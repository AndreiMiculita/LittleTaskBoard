import React, { useState, useEffect } from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
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

function UserProfileButton({ onClickUserProfileButton }) {
    return (
        <button className='userProfileButton' onClick={onClickUserProfileButton}>User Profile</button>
    );
}

function HeaderBar({ onClickSidebarButton }) {
    function onClickUserProfileButton() {
        alert('User profile clicked (WIP)!');
    }

    return (
        <div className="headerBar">
            <button className='sidebarButton' onClick={onClickSidebarButton}>Menu</button>
            <h1>Little Task Board</h1>
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </div>
    );
}

function Planning({ plannedAt, duration }) {

    function builtInFormatTime(date) {
        const options = { hour: 'numeric', minute: 'numeric' };
        return date.toLocaleTimeString([], options);
    }

    function builtInFormatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString([], options);
    }

    if (!plannedAt) {
        return null;
    }

    const plannedAtDate = new Date(plannedAt);
    // We format the date in a user friendly way; if it is today, we show the time, otherwise we show the date
    // The date is formatted in a user friendly way, based on the user's locale; e.g. January 1, 2021 or 1 January 2021
    const today = new Date();
    let plannedAtString = '';
    if (plannedAtDate.toDateString() === today.toDateString()) {
        plannedAtString = builtInFormatTime(plannedAtDate);
    }
    else {
        plannedAtString = builtInFormatDate(plannedAtDate);
    }

    // Duration should be shown in minutes, or hours and minutes if it is more than 60 minutes
    if (duration > 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (minutes === 0) {
            duration = `${hours}h`;
        } else {
            duration = `${hours}h ${minutes}m`;
        }
    } else {
        duration = `${duration}m`;
    }

    return (
        <div className="planning">
            <div className="plannedAt">
                {plannedAtString}
            </div>
            <div className="duration">
                {duration}
            </div>
        </div>
    );
}

function Task({ task }) {
    const maxPriority = 4;
    const priorityColor = `hsl(${task.priority * 360 / maxPriority}, 100%, 50%)`;

    return (
        <Draggable draggableId={task.id.toString()} index={task.priority - 1}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="task">
                        <div className="taskTitle">
                            {task.title}
                        </div>
                        <div className="taskPriority">
                            <div className="taskPriorityColor" style={{ backgroundColor: priorityColor }}></div>
                            <div className="taskPriorityNumber">{task.priority}</div>
                        </div>
                        <Planning plannedAt={task.plannedAt} duration={task.duration} />
                    </div>
                </div>
            )}
        </Draggable>
    );
}

function Column({ column }) {
    const tasks = column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <div className="column">
            <h2>{column.title}</h2>
            <Droppable droppableId={column.id.toString()}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <div className="tasks">
                            {tasks.map(task => <Task key={task.id} task={task} />)}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}

function SidebarLink({ link }) {
    return (
        <div className="sidebarLink">
            <a href={link.url}>{link.title}</a>
        </div>
    );
}

function SidebarLinkCategory({ linkCategory }) {
    return (
        <div className="sidebarLinkCategory">
            <h3>{linkCategory.title}</h3>
            {linkCategory.links.map(link => <SidebarLink key={link.id} link={link} />)}
        </div>
    );
}

function Sidebar({ sidebar, isSidebarOpen }) {
    if (!isSidebarOpen) {
        return null;
    }
    return (
        <div className="sidebar">
            {sidebar.linksByCategory.map(linkCategory => <SidebarLinkCategory key={linkCategory.id} linkCategory={linkCategory} />)}
        </div>
    );
}

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

                    <div className="board">
                        {board.columns.map(column => <Column key={column.id} column={column} />)}
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