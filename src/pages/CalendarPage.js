import React, { useState, useRef, useEffect } from 'react';
import withPageLayout from '../hoc/withPageLayout';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";


function CalendarPage({ auth }) {

    const [config, setConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        onEventMoved: onEventMoved
    });
    const calendarRef = useRef(null); // We use this to update events with calendarRef.current.control.update
    // This prevents an infinite loop if we were to use setConfig directly in useEffect

    // useEffect(() => {
    //     const events = [
    //         {
    //           id: 1,
    //           text: "Event 1",
    //           start: "2023-10-02T10:30:00",
    //           end: "2023-10-02T13:00:00",
    //           participants: 2,
    //         },
    //         {
    //           id: 2,
    //           text: "Event 2",
    //           start: "2023-10-03T09:30:00",
    //           end: "2023-10-03T11:30:00",
    //           backColor: "#6aa84f",
    //           participants: 1,
    //         },
    //         {
    //           id: 3,
    //           text: "Event 3",
    //           start: "2023-10-03T12:00:00",
    //           end: "2023-10-03T15:00:00",
    //           backColor: "#f1c232",
    //           participants: 3,
    //         },
    //         {
    //           id: 4,
    //           text: "Event 4",
    //           start: "2023-10-01T11:30:00",
    //           end: "2023-10-01T14:30:00",
    //           backColor: "#cc4125",
    //           participants: 4,
    //         },
    //       ];

    //       const startDate = "2023-10-02";

    //       calendarRef.current.control.update({startDate, events});
    // }, []);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/tasks/',
            {
                method: 'GET'
            })
            .then(data => {
                const events = data.map(task => {
                    return {
                        id: task.id,
                        text: task.title,
                        start: new Date(task.planned_at).toISOString(),
                        end: new Date(new Date(task.planned_at).getTime() + task.duration * 60000).toISOString(),
                        backColor: task.focus ? "#cc4125" : "#6aa84f",
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
                duration: args.newEnd.getTime() - args.newStart.getTime()
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
        <div className="main">
            <div>
                <DayPilotCalendar {...config} ref={calendarRef} />
            </div>
        </div>
    );
}

export default withPageLayout(CalendarPage);