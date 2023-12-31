import React, { useState, useEffect } from 'react';
import withPageLayout from '../hoc/withPageLayout';
import TaskRow from '../components/TaskRow';
import Task from '../components/Task';
import { toast } from 'react-toastify';

function TasksPage({ auth }) {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/tasks/',
            {
                method: 'GET'
            })
            .then(data => {
                setTasks(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load tasks data');
            });
    }, [reload, currentPage, tasksPerPage]);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="main">
            <div>
                <label htmlFor="tasksPerPage">Tasks per Page:</label>
                <select
                    id="tasksPerPage"
                    value={tasksPerPage}
                    onChange={e => setTasksPerPage(parseInt(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>
            <div className="tasksList">
                {currentTasks.map(task => (
                    <Task key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default withPageLayout(TasksPage);
