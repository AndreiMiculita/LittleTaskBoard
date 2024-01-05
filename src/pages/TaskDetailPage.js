import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Planning from '../components/Planning';
import { toast } from 'react-toastify';

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
        <div className="taskDetail">
            <div className="taskDetail__title">{task.title}</div>
            <div className="taskDetail__description">{task.description}</div>
            <div className="taskDetail__status">{task.status}</div>
            <div className="taskDetail__priority">{task.priority}</div>
            <Planning plannedAt={task.planned_at} duration={task.duration} showFull={true} />
        </div>
    );
};

export default TaskDetailPage;