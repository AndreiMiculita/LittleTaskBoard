import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import HeaderBar from './components/HeaderBar';
import Sidebar from './components/Sidebar';
import NewTaskForm from './components/NewTaskForm';
import Column from './components/Column';
import './styles/App.css';
import boardsData from './example_responses/board.json';
import sidebarData from './example_responses/sidebar.json';

function App() {
    const [board, setBoard] = useState(boardsData);
    const [sidebar, setSidebar] = useState(sidebarData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        fetch('/sidebar').then(res => res.json()).then(data => {
            setSidebar(data);
        });
    }, []);

    useEffect(() => {
        fetch('/boards').then(res => res.json()).then(data => {
            setBoard(data);
        });
    }, []);

    function onDragEnd(result) {
        // TODO
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="App">
                <header className="App-header">
                    <HeaderBar onClickSidebarButton={() => setIsSidebarOpen(!isSidebarOpen)} />
                </header>
                <div className="content">
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

//function App() {
//  const [currentTime, setCurrentTime] = useState(0);
//
//  useEffect(() => {
//    fetch('/time').then(res => res.json()).then(data => {
//      setCurrentTime(data.time);
//    });
//  }, []);
//
//  return (
//    <div className="App">
//      <header className="App-header">
//        <img src={logo} className="App-logo" alt="logo" />
//        <p>
//          Edit <code>src/App.js</code> and save to reload.
//        </p>
//        <a
//          className="App-link"
//          href="https://reactjs.org"
//          target="_blank"
//          rel="noopener noreferrer"
//        >
//          Learn React
//        </a>
//        <p>The current time is {currentTime}.</p>
//      </header>
//    </div>
//  );
//}

export default App;