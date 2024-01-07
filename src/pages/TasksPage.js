import React, { useState, useEffect } from 'react';
import TaskRow from '../components/TaskRow';
import Select from '../components/Select';
import { toast } from 'react-toastify';

function TasksPage({ auth }) {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage, setTasksPerPage] = useState(10);


    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortCriteria, setSortCriteria] = useState('priority');
    const [sortDirection, setSortDirection] = useState('desc');

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
            label: 'Sort by',
            value: sortCriteria,
            onChange: e => setSortCriteria(e.target.value),
            options: [
                { value: 'priority', label: 'Priority' },
                { value: 'duration', label: 'Duration' },
                { value: 'planned_at', label: 'Planned At' },
                { value: 'type', label: 'Type' },
                { value: 'status', label: 'Status' },
            ],
        },
        {
            id: 'sortDirection',
            label: 'Direction',
            value: sortDirection,
            onChange: e => setSortDirection(e.target.value),
            options: [
                { value: 'asc', label: 'Ascending' },
                { value: 'desc', label: 'Descending' },
            ],
        },
    ];

    useEffect(() => {
        // This will omit the keys with empty string values
        const params = {
            ...(statusFilter !== '' && { status: statusFilter }),
            ...(priorityFilter !== '' && { priority: priorityFilter }),
            ...(sortCriteria !== '' && { sort_by: sortCriteria }),
            ...(sortDirection !== '' && { sort_direction: sortDirection }),
        };

        auth.fetch('http://localhost:5000/api/tasks/', {
            method: 'GET',
            params
        })
            .then(data => {
                setTasks(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load tasks data');
            });
    }, [auth, currentPage, tasksPerPage, statusFilter, priorityFilter, sortCriteria, sortDirection]);

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <>
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
            <table className="tasksList">
                <tbody>
                    {currentTasks.map(task => (
                        <TaskRow key={task.id} task={task} />
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TasksPage;
