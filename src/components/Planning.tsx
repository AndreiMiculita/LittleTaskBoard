import { Badge } from "./ui/badge";

interface PlanningProps {
    planned_at: string;
    duration: number;
    showFull?: boolean;
}

function Planning({ planned_at, duration, showFull = false }: PlanningProps) {
    function builtInFormatTime(date: Date) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
    }

    function builtInFormatDate(date: Date) {
        return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
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
    let duration_str: string;
    if (duration > 60) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        if (minutes === 0) {
            duration_str = `${hours}h`;
        } else {
            duration_str = `${hours}h ${minutes}m`;
        }
    } else {
        duration_str = `${duration}m`;
    }

    return (
        <Badge variant='outline' className="w-full justify-between">
            <div>
                {planned_atString}
            </div>
            <div>
                {duration_str}
            </div>
        </Badge>
    );
}

export default Planning;