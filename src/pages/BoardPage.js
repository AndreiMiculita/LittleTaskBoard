import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import NewTaskForm from '../components/NewTaskForm.tsx';
import Column from '../components/Column.tsx';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';
import boardsData from '../example_responses/board.json';
import { toast } from 'react-toastify';

function BoardPage({ auth }) {
    const [board, setBoard] = useState(boardsData);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/boards/',
            {
                method: 'GET'
            })
            .then(data => {
                setBoard(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load board data');
            });
    }, [auth, reload]);

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const sourceColumnId = parseInt(result.source.droppableId);
        const destinationColumnId = parseInt(result.destination.droppableId);
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const sourceTasks = board.columns.find(column => column.id === sourceColumnId).tasks;
        const task = sourceTasks[sourceIndex];
        sourceTasks.splice(sourceIndex, 1);

        const destinationTasks = board.columns.find(column => column.id === destinationColumnId).tasks;
        destinationTasks.splice(destinationIndex, 0, task);


        if (sourceColumnId !== destinationColumnId) {
            auth.fetch(`http://localhost:5000/api/tasks/${task.id}`,
                {
                    method: 'PATCH',
                    data: JSON.stringify({
                        status: destinationColumnId
                    })
                })
                .then(data => {
                    toast.success('Task updated');
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Failed to update task. Are you connected to the internet?');
                });
        }

        setBoard(board);
    }

    function onCreateTask(task) {
        auth.fetch('http://localhost:5000/api/tasks/', {
            method: 'POST',
            data: JSON.stringify(task)
        })
            .then(data => {
                setReload(!reload);
                toast.success('Task created');
            })
            .catch(err => {
                console.error(err);
                toast.error(err.response.data);
            });
    }

    return (
        <>
            <NewTaskForm onCreateTask={onCreateTask} />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board">
                    {board.columns.map(column => <Column key={column.id} column={column} />)}
                </div>
            </DragDropContext>
        </>
    );
}

export default BoardPage;