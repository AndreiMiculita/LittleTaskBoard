import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Column, { ColumnProps } from '../components/Column.tsx';
import NewTaskForm from '../components/NewTaskForm.tsx';
import boardsData from '../example_responses/board.json';
import '../styles/App.css';

interface BoardPageProps {
    auth: any;
}

interface BoardData {
    columns: ColumnProps[];
}

function BoardPage({ auth }: BoardPageProps): JSX.Element {
    const [board, setBoard] = useState<BoardData>(boardsData as BoardData);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/boards/', {
            method: 'GET'
        })
            .then((data: any) => {
                setBoard(data);
            })
            .catch((err: any) => {
                console.error(err);
                toast.error('Failed to load board data');
            });
    }, [auth, reload]);

    function onDragEnd(result): void {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const sourceColumnId = parseInt(result.source.droppableId);
        const destinationColumnId = parseInt(result.destination.droppableId);
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const sourceTasks = board.columns.find((column: ColumnProps) => column.id === sourceColumnId)?.tasks || [];
        const task = sourceTasks[sourceIndex];
        sourceTasks.splice(sourceIndex, 1);

        const destinationTasks = board.columns.find((column: ColumnProps) => column.id === destinationColumnId)?.tasks || [];
        destinationTasks.splice(destinationIndex, 0, task);

        if (sourceColumnId !== destinationColumnId) {
            auth.fetch(`http://localhost:5000/api/tasks/${task.id}`,
                {
                    method: 'PATCH',
                    data: JSON.stringify({
                        status: destinationColumnId
                    })
                })
                .then((data: any) => {
                    toast.success('Task updated');
                })
                .catch((err: any) => {
                    console.error(err);
                    toast.error('Failed to update task. Are you connected to the internet?');
                });
        }

        setBoard(board);
    }

    function onCreateTask(task: any): void {
        auth.fetch('http://localhost:5000/api/tasks/', {
            method: 'POST',
            data: JSON.stringify(task)
        })
            .then((data: any) => {
                setReload(!reload);
                toast.success('Task created');
            })
            .catch((err: any) => {
                console.error(err);
                toast.error(err.response.data);
            });
    }

    return (
        <>
            <NewTaskForm onCreateTask={onCreateTask} />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board">
                    {board.columns.map((column: ColumnProps) => <Column key={column.id} column={column as ColumnProps} />)}
                </div>
            </DragDropContext>
        </>
    );
};

export default BoardPage;