
interface Task {
    id: number;
    title: string;
    description: string;
    task_type: number;
    planned_at: string;
    duration: number;
    priority: number;
    status: number;
    comments?: CommentProps[];
}

interface CommentProps {
    id: number;
    text: string;
    author: string;
    replies?: ReplyProps[];
}

interface ReplyProps {
    id: number;
    text: string;
    author: string;
}

export { Task, CommentProps, ReplyProps };