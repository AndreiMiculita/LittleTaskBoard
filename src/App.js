import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './styles/App.css';

/* Start with mock data; 3 columns, 4 tasks each */
const exampleBoardResponse = {
    columns: [
        {
            id: 1,
            title: 'To do',
            tasks: [
                {
                    id: 1,
                    title: 'Feed the cat, dog, and fish',
                    priority: 1
                },
                {
                    id: 2,
                    title: 'Clean the house; vacuum, dust, mop',
                    priority: 2
                },
                {
                    id: 3,
                    title: 'Water the plants and flowers',
                    priority: 3
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
            title: 'Category 1',
            links: [
                {
                    id: 1,
                    title: 'Board 1',
                    url: '/board/1'
                },
                {
                    id: 2,
                    title: 'Board 2',
                    url: '/board/2'
                },
                {
                    id: 3,
                    title: 'Board 3',
                    url: '/board/3'
                }
            ]
        },
        {
            id: 2,
            title: 'Category 2',
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
            <button className='sidebarButton' onClick={onClickSidebarButton}>Sidebar</button>
            <h1>Little Task Board</h1>
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </div>
    );
}

function Task({ task }) {
    const maxPriority = 4;
    const priorityColor = `hsl(${task.priority * 360 / maxPriority}, 100%, 50%)`;

    return (
        <div className="task">
            <div className="taskTitle">
                {task.title}
            </div>
            <div className="taskPriority">
                <div className="taskPriorityColor" style={{ backgroundColor: priorityColor }}></div>
                <div className="taskPriorityNumber">{task.priority}</div>
            </div>
        </div>
    );
}

function Column({ column }) {
    const tasks = column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <div className="column">
            <h2>{column.title}</h2>
            <div className="tasks">
                {tasks.map(task => <Task key={task.id} task={task} />)}
            </div>
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

    return (
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