import React, { useState } from 'react';

function NewTaskForm({ onCreate }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New task title"
                required
            />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default NewTaskForm;