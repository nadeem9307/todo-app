@if ($task->status != 1)
    <button type="button" class="btn btn-success" id="status-update" data-action="update_row"
        data-route="{{ route('tasks.updateStatus', $task) }}"><i class="fa-regular fa-pen-to-square"></i></button>
@endif


<button type="button" class="btn btn-danger" data-action="delete_row" data-route="{{ route('tasks.destroy', $task) }}"><i
        class="fas fa-times-circle" data-task-name="{{ $task->task ?? '' }}"></i></button>
