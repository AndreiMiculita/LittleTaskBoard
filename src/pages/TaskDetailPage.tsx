import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Planning from '../components/Planning.tsx';
import TaskAttributes from '../components/TaskAttributes';
import { Task, CommentProps, ReplyProps } from '../types';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

const Comment = ({ comment, auth }: { comment: CommentProps, auth: any }) => {
    const [replies, setReplies] = useState(comment.replies || []);

    const handleReplyAdded = (reply) => {
        const updatedReply = { ...reply, key: 'RE' + reply.id };
        setReplies(prevReplies => [...prevReplies, updatedReply]);
    };

    return (
        <article className="comment">
            <h2>{comment.author}</h2>
            <p>{comment.text}</p>
            <section className="replies">
                {replies.map(reply => <Reply key={'RE' + reply.id} reply={reply} />)}
            </section>
            <ReplyForm commentId={comment.id} auth={auth} onReplyAdded={handleReplyAdded} />
        </article>
    );
};

const Reply = ({ reply }: { reply: ReplyProps }) => {
    return (
        <article className="reply">
            <h3>{reply.author}</h3>
            <p>{reply.text}</p>
        </article>
    );
};

const CommentForm = ({ taskId, auth, onCommentAdded }: { taskId: string, auth: any, onCommentAdded: any }) => {
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
        <form className="commentForm" onSubmit={handleSubmit}>
            <textarea value={text} onChange={e => setText(e.target.value)} required />
            <button type="submit">Add Comment</button>
        </form>
    );
};

const ReplyForm = ({ commentId, auth, onReplyAdded }: { commentId: number, auth: any, onReplyAdded: any }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        auth.fetch(`http://localhost:5000/api/tasks/comments/${commentId}/replies`, {
            method: 'POST',
            data: JSON.stringify({ text })
        })
            .then(data => {
                setText('');
                onReplyAdded(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to add reply');
            });
    };

    return (
        <form className="replyForm" onSubmit={handleSubmit}>
            <textarea value={text} onChange={e => setText(e.target.value)} required />
            <button type="submit">Add Reply</button>
        </form>
    );
};

function TaskDetailPage({ auth }) {

    let { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task>({} as Task);
    const [comments, setComments] = useState<CommentProps[]>([]);

    useEffect(() => {
        auth.fetch(`http://localhost:5000/api/tasks/${id}`, {
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
                            return { ...comment, replies: repliesData };
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
            <TaskAttributes type={task.task_type} priority={task.priority} />
            <Planning planned_at={task.planned_at} duration={task.duration} showFull={true} />
            <section className="comments">
                {comments.map(comment => <Comment key={comment.id} comment={comment} auth={auth} />)}
            </section>
            { id && <CommentForm taskId={id} auth={auth} onCommentAdded={(comment: CommentProps) => setComments([...comments, comment])} /> }
        </article>
    );
};

export default TaskDetailPage;