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
                    title: 'Task 1',
                    priority: 1
                },
                {
                    id: 2,
                    title: 'Task 2',
                    priority: 2
                },
                {
                    id: 3,
                    title: 'Task 3',
                    priority: 3
                },
                {
                    id: 4,
                    title: 'Task 4',
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
                    title: 'Task 5',
                    priority: 1
                },
                {
                    id: 6,
                    title: 'Task 6',
                    priority: 2
                },
                {
                    id: 7,
                    title: 'Task 7',
                    priority: 3
                },
                {
                    id: 8,
                    title: 'Task 8',
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
                    title: 'Task 9',
                    priority: 1
                },
                {
                    id: 10,
                    title: 'Task 10',
                    priority: 2
                },
                {
                    id: 11,
                    title: 'Task 11',
                    priority: 3
                },
                {
                    id: 12,
                    title: 'Task 12',
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

function UserProfileButton(props) {
    return (
        <button className='userProfileButton' onClick={props.onClickUserProfileButton}>User Profile</button>
    );
}

function HeaderBar(props) {
    function onClickUserProfileButton() {
        alert('User profile clicked (WIP)!');
    }

    return (
        <div className="headerBar">
            <button className='sidebarButton' onClick={props.onClickSidebarButton}>Sidebar</button>
            <h1>Header Bar</h1>
            <UserProfileButton onClickUserProfileButton={onClickUserProfileButton} />
        </div>
    );
}

function Task(props) {
    return (
        <div className="task">
            {props.task.title}
        </div>
    );
}

function Column(props) {
    const tasks = props.column.tasks;
    tasks.sort((a, b) => a.priority - b.priority);

    return (
        <div className="column">
            <h2>{props.column.title}</h2>
            <div className="tasks">
                {tasks.map(task => <Task key={task.id} task={task} />)}
            </div>
        </div>
    );
}

function SidebarLink(props) {
    return (
        <div className="sidebarLink" onClick={() => alert(props.link.title)}>
            <a href={props.link.url}>{props.link.title}</a>
        </div>
    );
}

function SidebarLinkCategory(props) {
    return (
        <div className="sidebarLinkCategory">
            <h3>{props.linkCategory.title}</h3>
            {props.linkCategory.links.map(link => <SidebarLink key={link.id} link={link} />)}
        </div>
    );
}

function Sidebar(props) {
    if (!props.isSidebarOpen) {
        return null;
    }
    return (
        <div className="sidebar">
            {props.sidebar.linksByCategory.map(linkCategory => <SidebarLinkCategory key={linkCategory.id} linkCategory={linkCategory} />)}
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
                <div className="sidebar">
                    <Sidebar sidebar={sidebar} isSidebarOpen={isSidebarOpen} />
                </div>

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