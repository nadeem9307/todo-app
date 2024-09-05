<?php

namespace App\Repositories;

use App\Models\Task;
use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

class TaskRepository
{
    protected $model;

    public function __construct(Task $model)
    {
        $this->model = $model;
    }

    public function list()
    {
        $tasks = self::getAll();
        return (DataTables::eloquent($tasks))->filter(function ($query) {
            if (request()->get('task_status') && request()->get('task_status') != 'all') {
                $query->where('status', 0);
            }
            if (request()->get('task_status') && request()->get('task_status') == 'all') {
                $query->whereIn('status', [0, 1]);
            }
        })
            ->addIndexColumn()
            ->rawColumns(['status', 'action'])
            ->addColumn('name', function (Task $task) {
                return $task->task;
            })
            ->editColumn('status', function (Task $task) {
                if ($task->status == 1) {
                    return 'Done';
                }
                return '';
            })
            ->addColumn('action', function (Task $task) {
                return view('tasks.column.actions', compact('task'));
            })
            ->setRowId('id')
            ->make(true);
    }
    public static function getAll()
    {
        return Task::query();
    }
}
