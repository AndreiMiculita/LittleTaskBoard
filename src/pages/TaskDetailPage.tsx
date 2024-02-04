import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../Services/AuthService';
import Planning from '../components/Planning';
import TaskAttributes from '../components/TaskAttributes';
import { CommentProps, ReplyProps, Task } from '../types';
import { Button } from '../components/ui/button';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

function Comment({ comment, auth }: { comment: CommentProps, auth: AuthService }) {
    const [replies, setReplies] = useState<ReplyProps[]>([]);
    const [repliesLoaded, setRepliesLoaded] = useState(false);

    const loadReplies = (e) => {
        if (!e.currentTarget.parentNode.open) {
            auth.fetch(`http://localhost:5000/api/tasks/comments/${comment.id}/replies`, { method: 'GET' })
                .then((repliesData: ReplyProps[]) => {
                    setReplies(repliesData);
                    setRepliesLoaded(true);
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Failed to load replies');
                });
        }
    };

    const handleReplyAdded = (reply) => {
        const updatedReply = { ...reply, key: 'RE' + reply.id };
        setReplies(prevReplies => [...prevReplies, updatedReply]);
    };

    return (
        <article className="comment">
            <h2 className="comment__author">{comment.author}</h2>
            <p className="comment__text">{comment.text}</p>
            <details className="comment__details" onToggle={e => setRepliesLoaded(e.currentTarget.open)}>
                <summary onClick={loadReplies} className="comment__details-summary">
                    {repliesLoaded ? 'Hide replies' : 'Show replies'}
                </summary>
                <section className="comment__replies">
                    {repliesLoaded && replies.map(reply => <Reply key={'RE' + reply.id} reply={reply} />)}
                    <ReplyForm commentId={comment.id} auth={auth} onReplyAdded={handleReplyAdded} />
                </section>
            </details>
        </article>
    );
};

function Reply({ reply }: { reply: ReplyProps }) {
    return (
        <article className="reply">
            <h3 className="reply__author">{reply.author}</h3>
            <p className="reply__text">{reply.text}</p>
        </article>
    );
};

function CommentForm({ taskId, auth, onCommentAdded }: { taskId: string, auth: AuthService, onCommentAdded: (comment: CommentProps) => void }) {
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
            <Button variant='outline' className='self-end' type="submit">Add Comment</Button>
        </form>
    );
};

function ReplyForm({ commentId, auth, onReplyAdded }: { commentId: number, auth: AuthService, onReplyAdded: (reply: ReplyProps) => void }) {
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
            <Button variant='outline' className='self-end' type="submit">Add Reply</Button>
        </form>
    );
};

function TaskDetailPage({ auth }: { auth: AuthService }) {

    let { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task>({} as Task);
    const [comments, setComments] = useState<CommentProps[]>([]);

    useEffect(() => {
        auth.fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: 'GET'
        })
            .then((data: Task) => {
                setTask(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load task data');
            });
        auth.fetch(`http://localhost:5000/api/tasks/${id}/comments`, {
            method: 'GET'
        })
            .then((data: CommentProps[]) => {
                setComments(data);
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
            {id && <CommentForm taskId={id} auth={auth} onCommentAdded={(comment: CommentProps) => setComments([...comments, comment])} />}
        </article>
    );
};

export default TaskDetailPage;