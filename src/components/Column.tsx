import { Task } from '../types';
import { StrictModeDroppable } from './StrictModeDroppable';
import TaskCard from './TaskCard';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card"

export interface ColumnProps {
    id: number;
    title: string;
    tasks: Task[];
}

function Column({ column }: { column: ColumnProps }) {
    const tasks = column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <StrictModeDroppable droppableId={column.id.toString()}>
            {(provided, snapshot) => (
                <Card
                    className={`py-0 px-2 flex flex-col flex-1 transition-colors ${snapshot.isDraggingOver ? 'bg-accent' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <CardHeader>
                        <CardTitle className="text-xl text-center">
                            {column.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className={`h-full`}>
                            {tasks.map((task, index) => <TaskCard key={task.id || Math.random()} task={task} index={index} />)}
                        </div>
                        {provided.placeholder}
                    </CardContent>
                </Card>
            )}
        </StrictModeDroppable>
    );
};

export default Column;