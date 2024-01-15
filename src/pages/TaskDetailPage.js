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

const Comment = ({ comment }) => (
    <div className="comment">
        <h2>{comment.author}</h2>
        <p>{comment.text}</p>
        <div className="replies">
            {comment.replies && comment.replies.map(reply => <Reply key={reply.id} reply={reply} />)}
        </div>
    </div>
);

const Reply = ({ reply }) => (
    <div className="reply">
        <h3>{reply.author}</h3>
        <p>{reply.text}</p>
    </div>
);

const CommentForm = ({ taskId, auth, onCommentAdded }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        auth.fetch(`http://localhost:5000/api/tasks/${taskId}/comments`, {
            method: 'POST',
            data: JSON.stringify({ text })
        })
            .then(data => {
                setText('');
                onCommentAdded(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to add comment');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={text} onChange={e => setText(e.target.value)} required />
            <button type="submit">Add Comment</button>
        </form>
    );
};

function TaskDetailPage({ auth }) {

    let { id } = useParams();
    const [task, setTask] = useState([]);
    const [comments, setComments] = useState([]);

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
        auth.fetch(`http://localhost:5000/api/tasks/${id}/comments`, { method: 'GET' })
            .then(data => {
                const commentsWithRepliesPromises = data.map(comment => {
                    return auth.fetch(`http://localhost:5000/api/tasks/comments/${comment.id}/replies`, { method: 'GET' })
                        .then(repliesData => {
                            return { ...comment, replies: repliesData.replies };
                        });
                });
                return Promise.all(commentsWithRepliesPromises);
            })
            .then(commentsWithReplies => {
                setComments(commentsWithReplies);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load comments');
            });
    }, [auth, id]);

    return (
        <article className="taskDetail">
            <h1 className="taskDetail__title">{task.title}</h1>
            <p className="taskDetail__description">{task.description}</p>
            <div className="taskDetail__status">Status: {STATUS_MAP[task.status]}</div>
            <TaskAttributes type={task.type} priority={task.priority} />
            <Planning plannedAt={task.planned_at} duration={task.duration} showFull={true} />
            <div className="comments">
                {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
            </div>
            <CommentForm taskId={id} auth={auth} onCommentAdded={comment => setComments([...comments, comment])} />
        </article>
    );
};

export default TaskDetailPage;