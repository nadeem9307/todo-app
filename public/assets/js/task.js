"use strict";

var TaskMaganement = function () {
    var table;
    var datatable;
    var listUrl;
    var initDatatable = function () {
        listUrl = $('task-datatable').attr('data-list-url');
        datatable = $('.task-datatable').DataTable({
            processing: true,
            serverSide: true,
            // "bPaginate": false,
            "bFilter": false,
            "bInfo": false,
            order: [[0, 'desc']],
            ajax: {
                url: listUrl,
                data: function (d) {
                    d.task_status = $('input[name="task_status"]').val()
                }
            },
            columns: [{
                data: 'DT_RowIndex',
                name: 'id'
            },
            {
                data: 'task',
                orderable: false,
                searchable: false
            },
            {
                data: 'status',
                orderable: false,
                searchable: false
            },
            {
                data: 'action',
                orderable: false,
                searchable: false
            },
            ]
        });
        // Re-init functions on datatable re-draws
        datatable.on('draw', function () {
            handleNewTask();
            handleDeleteTaskRows();
            handleChangeTaskStatus();
            handleShowAllTask();

        });
        table = datatable.$;

    }

    // delete task
    var handleDeleteTaskRows = () => {
        const deleteButtons = document.querySelectorAll('[data-action="delete_row"]');
        deleteButtons.forEach(d => {

            d.addEventListener('click', function (e) {
                e.preventDefault();

                // Select parent row
                const parent = e.target.closest('tr');
                const taskName = e.target.getAttribute('data-task-name')

                Swal.fire({
                    text: "Are you sure you want to delete " + taskName + "? ",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-primary",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + taskName + "!.",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        }).then(function () {
                            let urls = e.target.closest('button').getAttribute('data-route');
                            console.log(urls);
                            $.ajax({
                                url: urls,
                                method: "DELETE",
                                dataType: 'json',
                                headers: {
                                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                },
                                success: function (res) {
                                    if (res.status == 'success') {
                                        // Simulate delete request -- for demo purpose only
                                        Swal.fire({
                                            text: "deleted " + taskName,
                                            icon: "info",
                                            buttonsStyling: false,
                                            showConfirmButton: false,
                                            timer: 2000
                                        }).then(function () {
                                            Swal.fire({
                                                text: "You delete " + taskName + "!.",
                                                icon: "success",
                                                buttonsStyling: false,
                                                confirmButtonText: "Ok, got it!",
                                                customClass: {
                                                    confirmButton: "btn fw-bold btn-primary",
                                                }
                                            }).then(function () {
                                                datatable.row($(parent)).remove().draw();
                                            });
                                        });
                                    } else {
                                        Swal.fire({
                                            text: taskName + " was not deleted.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn fw-bold btn-primary",
                                            }
                                        });
                                        // return false;
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    // Handle errors here
                                    console.error('Error:', textStatus, errorThrown);
                                    console.error('Response text:', jqXHR.responseText);
                                    //location.reload();
                                }
                            });
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: taskName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        })

    }
    var handleChangeTaskStatus = () => {
        const updateButtons = document.querySelectorAll('[data-action="update_row"]');
        updateButtons.forEach(d => {

            d.addEventListener('click', function (e) {
                e.preventDefault();
                // Select parent row
                const parent = e.target.closest('tr');

                let urls = e.target.closest('button').getAttribute('data-route');
                console.log(urls);
                $.ajax({
                    url: urls,
                    method: "PUT",
                    dataType: 'json',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (res) {
                        if (res.status == 'success') {
                            Swal.fire({
                                text: "Task Mark as completed",
                                icon: "success",
                                buttonsStyling: false,
                                showConfirmButton: false,
                                timer: 2000
                            }).then(function () {
                                datatable.row($(parent)).remove().draw();
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // Handle errors here
                        console.error('Error:', textStatus, errorThrown);
                        console.error('Response text:', jqXHR.responseText);
                        //location.reload();
                    }
                });
            })
        })
    }
    // add new task definition
    var handleNewTask = function () {
        // Shared variables
        const form = document.getElementById('TaskForm');
        const submitButton = document.getElementById('submit-button');
        const taskInput = document.getElementById('task');
        const taskError = document.getElementById('taskError');

        // Submit button handler
        submitButton.addEventListener('click', e => {
            e.preventDefault();
            taskInput.classList.remove('is-invalid');
            taskError.textContent = '';

            // Check if the task input is empty
            if (taskInput.value.trim() === '') {
                taskInput.classList.add('is-invalid');
                taskError.textContent = 'Task name is required';
                taskInput.focus();
            } else {
                // Show loading indication
                submitButton.setAttribute('data-kt-indicator', 'on');
                // Disable button to avoid multiple clicks
                submitButton.disabled = true;
                var formData = new FormData(form);
                $.ajax({
                    url: form.action,
                    method: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (res) {
                        if (res.status == 'success') {
                            // Remove loading indication
                            submitButton.removeAttribute('data-kt-indicator');

                            // Enable button
                            submitButton.disabled = false;

                            // Show popup confirmation
                            Swal.fire({
                                text: "User has been successfully created!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    datatable.draw();
                                    form.reset();
                                }
                            });

                        } else {
                            Swal.fire({
                                text: "User details were not created.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn fw-bold btn-primary",
                                }
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log(error)
                        Swal.fire({
                            text: xhr.responseJSON.message,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                submitButton.disabled = false;
                                console.log('asdsa')
                            }
                        });

                    }

                });
            }
        });
    }
    // show all
    var handleShowAllTask = () => {
        const taskStatus = document.querySelector('#show_all');

        $(taskStatus).on('click', e => {
            $('input[name="task_status"]').val('all');
            datatable.draw();
        });
    }
    return {
        init: function () {
            table = document.querySelector('.task-datatable');

            if (!table) {
                return;
            }

            initDatatable();
            handleDeleteTaskRows();
            handleChangeTaskStatus();
            handleShowAllTask();
            // handleNewTask();
        }
    };
}();


// On document ready
document.addEventListener('DOMContentLoaded', function () {
    TaskMaganement.init();
});
