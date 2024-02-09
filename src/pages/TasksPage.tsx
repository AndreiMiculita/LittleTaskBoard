import React, { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthService from '../Services/AuthService.js';
import Select from '../components/Select';
import { DataTable } from '../components/ui/data-table';
import { columns } from '../table_defs/TaskTableColumns';
import { Task } from '../types';

type Filter = {
    id: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
};

function TasksPage({ auth }: { auth: AuthService }) {
    document.title = 'Task Overview - Little Task Board';

    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [tasksPerPage, setTasksPerPage] = useState<number>(10);

    const [searchText, setSearchText] = useState<string>('');
    const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('priority');
    const [sortDirection, setSortDirection] = useState<string>('desc');

    const filters: Filter[] = [
        {
            id: 'tasksPerPage',
            label: 'Tasks per Page',
            value: tasksPerPage.toString(),
            onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                setTasksPerPage(parseInt(e.target.value)),
            options: [
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '15', label: '15' },
            ],
        },
        {
            id: 'statusFilter',
            label: 'Status',
            value: statusFilter,
            onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value),
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
            onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                setPriorityFilter(e.target.value),
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
            onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                setSortCriteria(e.target.value),
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
            onChange: (e: ChangeEvent<HTMLSelectElement>) =>
                setSortDirection(e.target.value),
            options: [
                { value: 'asc', label: 'Ascending' },
                { value: 'desc', label: 'Descending' },
            ],
        },
    ];

    useEffect(() => {
        // This will omit the keys with empty string values
        const params = {
            ...(searchText !== '' && { q: searchText }),
            ...(statusFilter !== '' && { status: statusFilter }),
            ...(priorityFilter !== '' && { priority: priorityFilter }),
            ...(sortCriteria !== '' && { sort_by: sortCriteria }),
            ...(sortDirection !== '' && { sort_direction: sortDirection }),
        };

        auth.fetch('http://localhost:5000/api/tasks/', {
            method: 'GET',
            params
        })
            .then((data: Task[]) => {
                setTasks(data);
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to load tasks data');
            });
    }, [
        auth,
        currentPage,
        tasksPerPage,
        searchSubmitted,
        statusFilter,
        priorityFilter,
        sortCriteria,
        sortDirection,
    ]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchSubmitted(!searchSubmitted);
        }
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    return (
        <>
            <div className="filters">
                {filters.map((filter: Filter) => (
                    <Select
                        key={filter.id}
                        id={filter.id}
                        label={filter.label}
                        value={filter.value}
                        onChange={filter.onChange}
                        options={filter.options}
                    />
                ))}
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by text"
                    className="search"
                />
            </div>
            <DataTable columns={columns} data={currentTasks} />
        </>
    );
};

export default TasksPage;
