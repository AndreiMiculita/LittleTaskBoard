import { Badge } from "./ui/badge";

interface PlanningProps {
    planned_at: string;
    duration: number;
    showFull?: boolean;
}

export function builtInFormatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
}

export function builtInFormatDate(date: Date) {
    return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatPlannedAt(planned_at: string, showFull: boolean) {
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

    return planned_atString;
}

export function formatDuration(duration: number) {
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

    return duration_str;
}

function Planning({ planned_at, duration, showFull = false }: PlanningProps) {
    const planned_atString = formatPlannedAt(planned_at, showFull);
    const duration_str = formatDuration(duration);

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