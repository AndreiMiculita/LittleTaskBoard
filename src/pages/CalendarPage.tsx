import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import AuthService from '../Services/AuthService';
import '../styles/calendar_custom_styling.css';
import { Task } from '../types';

import 'react-big-calendar/lib/css/react-big-calendar.css';

function CalendarPage({ auth }: { auth: AuthService }) {
    document.title = 'Calendar - Little Task Board';

    const [myEventsList, setMyEventsList] = useState([]);

    const localizer = dayjsLocalizer(dayjs);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/tasks/',
            {
                method: 'GET',
                params: {
                    planned: true,
                }
            })
            .then(data => {
                const typeEmojiMap: { [key: number]: string } = {
                    0: '',
                    1: '🧠',
                    2: '👥',
                };

                const events = data.map((task: Task) => {
                    const emoji = typeEmojiMap[task.task_type] || '';
                    const text = emoji + task.title + " (" + new Date(task.planned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " to " + new Date(new Date(task.planned_at).getTime() + task.duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ")";
                    return {
                        id: task.id,
                        title: text,
                        start: new Date(task.planned_at),
                        end: new Date(new Date(task.planned_at).getTime() + task.duration * 60000),
                    }
                });

                setMyEventsList(events);

            })
            .catch(err => {
                console.error(err);
            });
    }, [auth]);

    function onEventMoved(args) {
        auth.fetch(`http://localhost:5000/api/tasks/${args.e.id()}`, {
            method: 'PATCH',
            data: JSON.stringify({
                planned_at: args.newStart.toString('yyyy-MM-ddTHH:MM'),
                end: args.newEnd.toString('yyyy-MM-ddTHH:MM'),
            })
        })
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    return (
        <div className="h-full min-h-[600px]">
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                className="h-full grow"
            />
        </div>
    );
};

export default CalendarPage;