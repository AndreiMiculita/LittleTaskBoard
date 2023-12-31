import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import withPageLayout from '../hoc/withPageLayout';
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
    }, []);

    return (
        <div className="main">
            <div className="taskDetail">
                <div className="taskDetail__title">{task.title}</div>
                <div className="taskDetail__description">{task.description}</div>
                <div className="taskDetail__status">{task.status}</div>
                <div className="taskDetail__priority">{task.priority}</div>
                <div className="taskDetail__createdAt">{task.createdAt}</div>
                <div className="taskDetail__updatedAt">{task.updatedAt}</div>
            </div>
        </div>
    );
};

export default withPageLayout(TaskDetailPage);