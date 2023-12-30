import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import HeaderBar from './components/HeaderBar';
import Sidebar from './components/Sidebar';
import NewTaskForm from './components/NewTaskForm';
import Column from './components/Column';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';
import boardsData from './example_responses/board.json';
import sidebarData from './example_responses/sidebar.json';
import { toast, ToastContainer } from 'react-toastify';

function BoardPage() {
    const [board, setBoard] = useState(boardsData);
    const [sidebar, setSidebar] = useState(sidebarData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetch('/api/sidebar').then(res => res.json()).then(data => {
            setSidebar(data);
        });
    }, []);

    useEffect(() => {
        fetch('/api/boards').then(res => res.json()).then(data => {
            setBoard(data);
        });
    }, []);

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

        setBoard(board);
    }

    function onCreateTask(task) {
        fetch('/api/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }).then(res => res.json()).then(data => {
            setBoard(data);
        }
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="App">
                <header className="App-header">
                    <HeaderBar onClickSidebarButton={() => setIsSidebarOpen(!isSidebarOpen)} />
                </header>
                <div className="content">
                    <ToastContainer 
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable
                    />
                    <Sidebar sidebar={sidebar} isSidebarOpen={isSidebarOpen} />

                    <div className="main">
                        <NewTaskForm onCreate={onCreateTask} />
                        <div className="board">
                            {board.columns.map(column => <Column key={column.id} column={column} />)}
                        </div>
                    </div>
                </div>
            </div>
        </DragDropContext>
    );
}

export default BoardPage;