<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskService
{
    /**
     * store
     *
     * @param  mixed $data
     * @return void
     */
    public static function store(array $data)
    {
        return Task::create($data);
    }

    /**
     * delete
     *
     * @param  mixed $task
     * @return void
     */
    public static function delete($task)
    {
        return $task->delete();
    }

    /**
     * updateStatus
     *
     * @param  mixed $task
     * @return void
     */
    public static function updateStatus($task)
    {
        return $task->update(['status' => 1]);
    }
}
