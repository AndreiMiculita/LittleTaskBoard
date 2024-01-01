import React from 'react';

function Planning({ plannedAt, duration, showFull = false }) {
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
    let plannedAtString = '';

    if (showFull) {
        plannedAtString = plannedAtDate.toLocaleString();
    }
    else {
        // We format the date in a user friendly way; if it is today, we show the time, otherwise we show the date
        const today = new Date();
        if (plannedAtDate.toDateString() === today.toDateString()) {
            plannedAtString = builtInFormatTime(plannedAtDate);
        }
        else {
            plannedAtString = builtInFormatDate(plannedAtDate);
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
            <div className="plannedAt">
                {plannedAtString}
            </div>
            <div className="duration">
                {duration}
            </div>
        </div>
    );
}

export default Planning;