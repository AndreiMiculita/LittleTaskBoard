import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import HeaderBar from './components/HeaderBar';
import Sidebar from './components/Sidebar';
import NewTaskForm from './components/NewTaskForm';
import Column from './components/Column';
import './styles/App.css';

/* Start with mock data; 3 columns, 4 tasks each */
const exampleBoardResponse = {
    columns: [
        {
            id: 1,
            title: 'Placeholder',
            tasks: [
                {
                    id: 1,
                    title: 'Feed the cat, dog, and fish',
                    priority: 1,
                    plannedAt: '2021-01-01T12:00:00Z',
                    duration: 30

                },
                {
                    id: 2,
                    title: 'Clean the house; vacuum, dust, mop',
                    priority: 2,
                    plannedAt: '2021-01-01T13:00:00Z',
                    duration: 120
                },
                {
                    id: 3,
                    title: 'Water the plants and flowers',
                    priority: 3,
                    plannedAt: '2021-01-01T15:00:00Z',
                    duration: 30
                },
                {
                    id: 4,
                    title: 'Buy tea, coffee, and milk',
                    priority: 4
                }
            ]
        },
        {
            id: 2,
            title: 'In progress',
            tasks: [
                {
                    id: 5,
                    title: 'Write a book',
                    priority: 1
                },
                {
                    id: 6,
                    title: 'Quit smoking',
                    priority: 2
                },
                {
                    id: 7,
                    title: 'Update resume',
                    priority: 3
                },
                {
                    id: 8,
                    title: 'Organize the shed',
                    priority: 4
                }
            ]
        },
        {
            id: 3,
            title: 'Done',
            tasks: [
                {
                    id: 9,
                    title: 'Visit the dentist',
                    priority: 1
                },
                {
                    id: 10,
                    title: 'Install new light bulbs',
                    priority: 2
                },
                {
                    id: 11,
                    title: 'Call electrician',
                    priority: 3
                },
                {
                    id: 12,
                    title: '3D print a new phone case',
                    priority: 4
                }
            ]
        }
    ]
};

const exampleSidebarResponse = {
    linksByCategory: [
        {
            id: 1,
            title: 'Placeholder',
            links: [
                {
                    id: 1,
                    title: 'Placeholder',
                    url: '/board/1'
                },
                {
                    id: 2,
                    title: 'Placeholder',
                    url: '/board/2'
                },
                {
                    id: 3,
                    title: 'Placeholder',
                    url: '/board/3'
                }
            ]
        },
        {
            id: 2,
            title: 'Placeholder',
            links: [
                {
                    id: 4,
                    title: 'Calendar',
                    url: '/calendar'
                }
            ]
        }
    ]
};

function App() {
    const [board, setBoard] = useState(exampleBoardResponse);
    const [sidebar, setSidebar] = useState(exampleSidebarResponse);
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