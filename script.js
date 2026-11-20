const tasks = JSON.parse(localStorage.getItem("studentTasks") || "[]");
let currentFilter = "All";
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const form = document.querySelector("#taskForm");
const titleInput = document.querySelector("#taskTitle");
const priorityInput = document.querySelector("#taskPriority");
const dueInput = document.querySelector("#taskDue");

document.querySelector("#today").textContent = new Date().toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
document.querySelector("#showFormBtn").addEventListener("click",()=>{form.classList.toggle("hidden");titleInput.focus();});
document.querySelector("#cancelBtn").addEventListener("click",()=>form.classList.add("hidden"));
form.addEventListener("submit",(event)=>{
  event.preventDefault();
  const title=titleInput.value.trim();
  if(!title)return;
  tasks.unshift({id:Date.now(),title,priority:priorityInput.value,due:dueInput.value,completed:false});
  save();form.reset();form.classList.add("hidden");render();
});
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  currentFilter=button.dataset.filter;
  document.querySelectorAll(".filter").forEach(item=>item.classList.toggle("active",item===button));
  render();
}));
function save(){localStorage.setItem("studentTasks",JSON.stringify(tasks));}
function render(){
  taskList.innerHTML="";
  const shown=tasks.filter(task=>currentFilter==="All"||(currentFilter==="Completed"?task.completed:!task.completed));
  emptyState.style.display=shown.length?"none":"block";
  shown.forEach(task=>{
    const item=document.createElement("article");item.className="task-item"+(task.completed?" done":"");
    const check=document.createElement("input");check.type="checkbox";check.className="task-check";check.checked=task.completed;check.setAttribute("aria-label","Mark task complete");
    check.addEventListener("change",()=>{task.completed=check.checked;save();render();});
    const info=document.createElement("div");info.className="task-info";
    const taskTitle=document.createElement("div");taskTitle.className="task-title";taskTitle.textContent=task.title;
    const meta=document.createElement("div");meta.className="task-meta";meta.textContent=task.due?`Due ${task.due}`:"No due date";
    info.append(taskTitle,meta);
    const badge=document.createElement("span");badge.className="priority "+task.priority;badge.textContent=task.priority;
    const del=document.createElement("button");del.className="delete-btn";del.textContent="×";del.setAttribute("aria-label","Delete task");del.addEventListener("click",()=>{const index=tasks.findIndex(t=>t.id===task.id);if(index>=0)tasks.splice(index,1);save();render();});
    item.append(check,info,badge,del);taskList.append(item);
  });
  document.querySelector("#totalCount").textContent=tasks.length;
  document.querySelector("#pendingCount").textContent=tasks.filter(t=>!t.completed).length;
  document.querySelector("#completedCount").textContent=tasks.filter(t=>t.completed).length;
}
render();
