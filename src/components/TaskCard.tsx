import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../types';
import Planning from './Planning';
import TaskAttributes from './TaskAttributes';
import TaskLinkButton from './TaskLinkButton';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"

function TaskCard({ task, index }: { task: Task, index: number }) {

    // Before the api call, task is an empty object, so we show a placeholder
    if (Object.keys(task).length === 0) {
        return (
            <div className="task taskPlaceholder">
                <div className="taskHeader">
                    <div className="taskTitle">
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided, snapshot) => {
                return (
                    <div
                        className='pb-2'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Card className={`cursor-grab hover:shadow-xl ${snapshot.isDragging ? 'opacity-50' : ''}`}>
                            <CardHeader className="p-3">
                                <CardTitle className="font-medium flex justify-between items-center">
                                    {task.title}
                                    <TaskLinkButton taskId={task.id} />
                                </CardTitle>
                                {task.description ?
                                    <CardDescription>
                                        {task.description}
                                    </CardDescription>
                                    : null
                                }
                            </CardHeader>
                            <CardContent className="p-2 pt-0">
                                <TaskAttributes type={task.task_type} priority={task.priority} />
                            </CardContent>
                            {task.planned_at || task.duration ? (
                                <CardFooter className="p-2 pt-0">
                                    <Planning planned_at={task.planned_at} duration={task.duration} />
                                </CardFooter>
                            ) : null}
                        </Card>
                    </div>
                );
            }}
        </Draggable>
    );
};

export default TaskCard;