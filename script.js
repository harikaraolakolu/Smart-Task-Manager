$(document).ready(function () {
  const $inputText = $('#inputTaskText');
  const $inputDate = $('#inputTaskDate');
  const $taskList = $('#listTasks');
  const $filterButtons = $('.filter-btn');
  let taskStorage = JSON.parse(localStorage.getItem('taskRecords')) || [];

  function updateLocalStorage() {
    localStorage.setItem('taskRecords', JSON.stringify(taskStorage));
  }

  function renderTasks(filter = 'all') {
    $taskList.empty();
    taskStorage.forEach((task, index) => {
      if (filter === 'done' && !task.done) return;
      if (filter === 'pending' && task.done) return;

      const $item = $('<li class="list-group-item d-flex justify-content-between align-items-start"></li>');
      const $content = $(`
        <div class="flex-grow-1">
          <span class="task-text ${task.done ? 'done' : ''}">${task.text}</span>
          <div class="task-date">${new Date(task.due).toLocaleString()}</div>
        </div>
      `);
      const $buttons = $(`
        <div class="task-buttons">
          <button class="btn btn-sm btn-success btn-toggle" data-index="${index}">${task.done ? 'Undo' : 'Done'}</button>
          <button class="btn btn-sm btn-danger btn-delete" data-index="${index}">Remove</button>
        </div>
      `);

      $item.append($content).append($buttons);
      $taskList.append($item);
    });
  }

  $('#btnAddTask').on('click', function () {
    const text = $inputText.val().trim();
    const due = $inputDate.val();

    if (!text || !due) {
      Swal.fire('Please enter task and due date', '', 'warning');
      return;
    }

    const newTask = { text, due, done: false };
    taskStorage.push(newTask);
    updateLocalStorage();
    renderTasks();

    $inputText.val('');
    $inputDate.val('');
    Swal.fire('Task Added!', '', 'success');
  });

  $taskList.on('click', '.btn-toggle', function () {
    const index = $(this).data('index');
    taskStorage[index].done = !taskStorage[index].done;
    updateLocalStorage();
    renderTasks();
    Swal.fire('Task Updated!', '', 'success');
  });

  $taskList.on('click', '.btn-delete', function () {
    const index = $(this).data('index');
    taskStorage.splice(index, 1);
    updateLocalStorage();
    renderTasks();
    Swal.fire('Task Removed!', '', 'success');
  });

  $filterButtons.on('click', function () {
    const filter = $(this).data('filter');
    renderTasks(filter);
  });

  // Initial load
  renderTasks();
});
