import React, { useState, useRef, useEffect } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import '../styles/calendar_custom_styling.css';


function CalendarPage({ auth }) {

    const [config, setConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        onEventMoved: onEventMoved,
        onEventResized: onEventMoved,
    });
    const calendarRef = useRef(null);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/tasks/',
            {
                method: 'GET',
                params: {
                    planned: true,
                }
            })
            .then(data => {
                const typeEmojiMap = {
                    0: '',
                    1: '🧠',
                    2: '👥',
                };

                const events = data.map(task => {
                    const emoji = typeEmojiMap[task.type] || '';
                    const text = emoji + task.title + " (" + new Date(task.planned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " to " + new Date(new Date(task.planned_at).getTime() + task.duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ")";
                    return {
                        id: task.id,
                        text: text,
                        start: new Date(task.planned_at).toISOString(),
                        end: new Date(new Date(task.planned_at).getTime() + task.duration * 60000).toISOString(),
                        backColor: "#fff",
                        participants: 4,
                    }
                });
                const startDate = events.reduce((min, event) => event.start < min ? event.start : min, events[0].start);
                setConfig({ ...config, startDate, events });
                console.log(startDate);
                console.log(events);
            })
            .catch(err => {
                console.error(err);
            });
    }
        , [auth]);

    function onEventMoved(args) {
        auth.fetch(`http://localhost:5000/api/tasks/${args.e.id()}`, {
            method: 'PATCH',
            data: JSON.stringify({
                planned_at: args.newStart,
                duration: args.newEnd.getTime() - args.newStart.getTime() / 60000
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
        <div>
            <DayPilotCalendar {...config} ref={calendarRef} />
        </div>
    );
}

export default CalendarPage;