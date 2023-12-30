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
    const [reload, setReload] = useState(false);

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
    }, [reload]);

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
        auth.fetch('http://localhost:5000/api/tasks/create', {
            method: 'POST',
            data: JSON.stringify(task)
        })
            .then(data => {
                setReload(!reload);
                toast.success('Task created');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to create task. Are you connected to the internet?');
            });
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