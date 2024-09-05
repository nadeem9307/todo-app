<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use App\Repositories\TaskRepository;
use App\Services\TaskService;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    private TaskRepository $taskRepository;

    public function __construct(TaskRepository $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function index(Request $request)
    {
        if ($request->ajax()) {
            return $this->taskRepository->list();
        }
        return view('tasks.index');
    }

    public function store(TaskRequest $request)
    {
        if (TaskService::store($request->all())) {
            return response()->json(['status' => 'success', 'message' => __('messages.task_created')]);
        }
        return response()->json(['status' => 'failed', 'message' => __('messages.not_created_message')]);
    }

    public function destroy(Task $task)
    {
        if (TaskService::delete($task)) {
            return response()->json(['status' => 'success', 'message' => __('messages.deleted_message')]);
        }
        return response()->json(['status' => 'failed', 'message' => __('messages.not_deleted_message')]);
    }

    public function updateStatus(Request $request, Task $task)
    {
        if (TaskService::updateStatus($task)) {
            return response()->json(['status' => 'success', 'message' => __('messages.updated_message')]);
        }
        return response()->json(['status' => 'failed', 'message' => __('messages.not_updated_message')]);
    }
}
