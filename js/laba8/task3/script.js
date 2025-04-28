function allowDrop(event) {
    event.preventDefault();
  }
  
  function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add('dragging');
  }
  
  function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const task = document.getElementById(data);
    task.classList.remove('dragging');
    event.target.closest('.kanban-column').appendChild(task);
  }
  