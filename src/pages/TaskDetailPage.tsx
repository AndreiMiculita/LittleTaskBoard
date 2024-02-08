import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../Services/AuthService';
import Planning from '../components/Planning';
import TaskAttributes from '../components/TaskAttributes';
import { CommentProps, ReplyProps, Task } from '../types';
import { Button } from '../components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../components/ui/collapsible"
import { CaretSortIcon } from "@radix-ui/react-icons"

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
        <Card className='my-4'>
            <CardHeader>
                <CardTitle>{comment.author}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{comment.text}</p>
            </CardContent>
            <CardFooter>
                <Collapsible onOpenChange={setRepliesLoaded} className="w-full">
                    <CollapsibleTrigger onClick={repliesLoaded ? undefined : loadReplies} className="flex items-center gap-1">
                        <CaretSortIcon className="w-4 h-4" />
                        {repliesLoaded ? 'Hide replies' : 'Show replies'}
                    </CollapsibleTrigger>
                    <CollapsibleContent >
                        {repliesLoaded && replies.map(reply => <Reply key={'RE' + reply.id} reply={reply} />)}
                        <ReplyForm commentId={comment.id} auth={auth} onReplyAdded={handleReplyAdded} />
                    </CollapsibleContent>
                </Collapsible>
            </CardFooter>
        </Card>
    );
};

function Reply({ reply }: { reply: ReplyProps }) {
    return (
        <Card className='my-4'>
            <CardHeader>
                <CardTitle>{reply.author}</CardTitle>
            </CardHeader>
            <CardContent>
                {reply.text}
            </CardContent>
        </Card>
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
        <Card className='w-full'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-3'>
                <Textarea value={text} onChange={e => setText(e.target.value)} placeholder='Type your comment here...' required />
                <Button variant='outline' className='self-end' type="submit">Add Comment</Button>
            </form>
        </Card>
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
        <Card className='w-full'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-3'>
                <Textarea value={text} onChange={e => setText(e.target.value)} placeholder='Type your reply here...' required />
                <Button variant='outline' className='self-end' type="submit">Add Reply</Button>
            </form>
        </Card>
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

    useEffect(() => {
        document.title = `${id} - Task Details - Little Task Board`;
    }, [id]);

    return (
        <Card className='max-w-2xl mx-auto'>
            <CardHeader>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div>Status: {STATUS_MAP[task.status]}</div>
                <TaskAttributes type={task.task_type} priority={task.priority} />
                <Planning planned_at={task.planned_at} duration={task.duration} showFull={true} />
            </CardContent>
            <CardFooter className='flex-col'>
                <section className='w-full'>
                    {comments.map(comment => <Comment key={comment.id} comment={comment} auth={auth} />)}
                </section>
                {id && <CommentForm taskId={id} auth={auth} onCommentAdded={(comment: CommentProps) => setComments([...comments, comment])} />}
            </CardFooter>
        </Card>
    );
};

export default TaskDetailPage;