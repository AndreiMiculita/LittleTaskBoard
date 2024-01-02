import React, { useState, useEffect } from 'react';
import TaskRow from '../components/TaskRow';
import Select from '../components/Select';
import { toast } from 'react-toastify';

function TasksPage({ auth }) {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);


    const [statusFilter, setStatusFilter] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');

    const filters = [
        {
            id: 'tasksPerPage',
            label: 'Tasks per Page',
            value: tasksPerPage,
            onChange: e => setTasksPerPage(parseInt(e.target.value)),
            options: [
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 15, label: '15' },
            ],
        },
        {
            id: 'statusFilter',
            label: 'Status',
            value: statusFilter,
            onChange: e => setStatusFilter(e.target.value),
            options: [
                { value: '', label: 'All' },
                { value: '1', label: 'To Do' },
                { value: '2', label: 'In Progress' },
                { value: '3', label: 'Done' },
            ],
        },
        {
            id: 'durationFilter',
            label: 'Duration',
            value: durationFilter,
            onChange: e => setDurationFilter(e.target.value),
            options: [
                { value: '', label: 'All' },
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Long' },
            ],
        },
        {
            id: 'priorityFilter',
            label: 'Priority',
            value: priorityFilter,
            onChange: e => setPriorityFilter(e.target.value),
            options: [
                { value: '', label: 'All' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
            ],
        },
        {
            id: 'sortCriteria',
            label: 'Sort Criteria',
            value: sortCriteria,
            onChange: e => setSortCriteria(e.target.value),
            options: [
                { value: '', label: 'None' },
                { value: 'priority', label: 'Priority' },
                { value: 'duration', label: 'Duration' },
                { value: 'planned_at', label: 'Planned At' },
                { value: 'focus', label: 'Focus' },
                { value: 'status', label: 'Status' },
            ],
        },
    ];

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/tasks/',
            {
                method: 'GET',
                params: {
                    status: statusFilter,
                    duration: durationFilter,
                    priority: priorityFilter,
                    sort: sortCriteria
                }
            })
            .then(data => {
                setTasks(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load tasks data');
            });
    }, [auth, currentPage, tasksPerPage, statusFilter, durationFilter, priorityFilter, sortCriteria]);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <div className="main">
            <div className="filters">
                {filters.map(filter => (
                    <Select
                        key={filter.id}
                        id={filter.id}
                        label={filter.label}
                        value={filter.value}
                        onChange={filter.onChange}
                        options={filter.options}
                    />
                ))}
            </div>
            <div className="tasksList">
                {currentTasks.map(task => (
                    <TaskRow key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export default TasksPage;
