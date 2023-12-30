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
import AuthService from './Services/AuthService';
import { toast, ToastContainer } from 'react-toastify';

function BoardPage() {
    const [board, setBoard] = useState(boardsData);
    const [sidebar, setSidebar] = useState(sidebarData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const auth = new AuthService();

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/sidebar/',
            {
                method: 'GET'
            })
            .then(data => {
                setSidebar(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load sidebar data');
            });
    }, []);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/boards/1',
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
        const res = auth.fetch('http://localhost:5000/api/tasks/create', {
            method: 'POST',
            data: JSON.stringify(task)
        });
        if (res.status === 200) {
            toast.success('Task created');
        }
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