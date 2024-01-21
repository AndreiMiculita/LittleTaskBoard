import React from 'react';

function Planning({ planned_at, duration, showFull = false }) {
    function builtInFormatTime(date) {
        const options = { hour: 'numeric', minute: 'numeric' };
        return date.toLocaleTimeString([], options);
    }

    function builtInFormatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString([], options);
    }

    if (!planned_at) {
        return null;
    }

    const planned_atDate = new Date(planned_at);
    let planned_atString = '';

    if (showFull) {
        planned_atString = planned_atDate.toLocaleString();
    }
    else {
        // We format the date in a user friendly way; if it is today, we show the time, otherwise we show the date
        const today = new Date();
        if (planned_atDate.toDateString() === today.toDateString()) {
            planned_atString = builtInFormatTime(planned_atDate);
        }
        else {
            planned_atString = builtInFormatDate(planned_atDate);
        }
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
            <div className="planned_at">
                {planned_atString}
            </div>
            <div className="duration">
                {duration}
            </div>
        </div>
    );
}

export default Planning;