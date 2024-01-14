import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Planning from '../components/Planning';
import { toast } from 'react-toastify';
import TaskAttributes from '../components/TaskAttributes';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

function TaskDetailPage({ auth }) {

    let { id } = useParams();
    const [task, setTask] = useState([]);

    useEffect(() => {
        auth.fetch(`http://localhost:5000/api/tasks/${id}`,
            {
                method: 'GET'
            })
            .then(data => {
                setTask(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load task data');
            });
    }, [auth, id]);

    return (
        <article className="taskDetail">
            <h1 className="taskDetail__title">{task.title}</h1>
            <p className="taskDetail__description">{task.description}</p>
            <div className="taskDetail__status">Status: {STATUS_MAP[task.status]}</div>
            <TaskAttributes type={task.type} priority={task.priority} />
            <Planning plannedAt={task.planned_at} duration={task.duration} showFull={true} />
        </article>
    );
};

export default TaskDetailPage;