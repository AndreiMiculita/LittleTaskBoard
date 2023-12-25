import React, { useState } from 'react';

function NewTaskForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState(1);
    const [plannedAt, setPlannedAt] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate({ title, priority, plannedAt, duration });
        setTitle('');
        setPriority(1);
        setPlannedAt('');
        setDuration('');
    };

    return (
        <form className="newTaskForm" onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task title"
                required
            />
            <div className="taskDetails">
                <input
                    type="number"
                    min="1"
                    max="4"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="Task priority (1-4) (Optional)"
                />
                <input
                    type="datetime-local"
                    value={plannedAt}
                    onChange={(e) => setPlannedAt(e.target.value)}
                    placeholder="Planned at (Optional)"
                />
                <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration (minutes) (Optional)"
                />
            </div>
            <button type="submit">Add Task</button>
        </form>
    );
}

export default NewTaskForm;