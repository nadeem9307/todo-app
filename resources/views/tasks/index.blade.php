@extends('layouts.layout')

@section('title')
    {{ __('messages.task') }}
@endsection
@push('styles')
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
@endpush
@section('content')
    <section class="vh-100" style="background-color: #eee;">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-lg-12 col-xl-12">
                <div class="card rounded-3">
                    <div class="card-body p-4">

                        <h4 class="text-center my-3 pb-3">To Do App</h4>

                        <form action="{{ route('tasks.store') }}" method="POST" id="TaskForm" toggle="validator"
                            role="form">
                            @csrf
                            <div class="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2">
                                <div class="col-10">
                                    <div data-mdb-input-init class="form-outline">
                                        <input type="text" id="task" name="task" class="form-control">
                                        <div id="taskError" class="invalid-feedback"></div>
                                    </div>
                                </div>

                                <div class="col-2">
                                    <button type="button" id="submit-button" data-mdb-button-init data-mdb-ripple-init
                                        class="btn btn-primary">{{ __('messages.add_task') }}</button>
                                </div>
                            </div>


                        </form>
                        <div class="row row-cols-lg-auto g-3">
                            <div class="col-10">
                                <button type="button" class="btn btn-success"
                                    id="show_all">{{ __('messages.show_all_task') }}</button>
                            </div>
                        </div>
                        <input type="hidden" name="task_status" value="not_done">
                        <table class="table mb-4 task-datatable" data-list-url="{{ route('tasks.index') }}">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">{{ __('messages.task') }}</th>
                                    <th scope="col">{{ __('messages.status') }}</th>
                                    <th scope="col">{{ __('messages.action') }}</th>
                                </tr>
                            </thead>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </section>
    @push('scripts')
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
        <script src="{{ asset('assets/js/task.js') }}"></script>
    @endpush
@endsection
