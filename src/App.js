import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';
import NewTaskForm from './components/NewTaskForm';
import './styles/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTableList } from '@fortawesome/free-solid-svg-icons';

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

function SidebarLink({ link }) {
    let icon = null;
    if (link.title === 'Calendar') {
        icon = <FontAwesomeIcon icon={faCalendarAlt} />
    }
    if (link.title === 'Tasks') {
        icon = <FontAwesomeIcon icon={faTableList} />
    }
    return (
        <div className="sidebarLink">
            {icon}
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