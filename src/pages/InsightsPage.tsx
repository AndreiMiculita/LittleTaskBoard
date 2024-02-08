import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface DataPoint {
    status: string;
    count: number;
}

function InsightsPage({ auth }: { auth: any }) {
    document.title = 'Insights - Little Task Board';

    const [statusData, setStatusData] = useState<DataPoint[]>([]);
    const [taskTypeData, setTaskTypeData] = useState<DataPoint[]>([]);
    const [taskTypeOverTimeData, setTaskTypeOverTimeData] = useState<DataPoint[]>([]);

    // TODO: Implement this page.
    // We call the 
    // * /api/insights/status
    // * /api/insights/focus
    // * /api/insights/focus_over_time to get the data we need to display the insights.
    // Status and focus are two bar charts (side by side), focus over time is a line chart underneath.

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/insights/status',
            {
                method: 'GET'
            })
            .then((data: any) => {
                setStatusData(data.statuses);
            })
            .catch((err: Error) => {
                console.error(err);
                toast.error('Failed to load status data');
            });
    }, [auth]);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/insights/types',
            {
                method: 'GET'
            })
            .then((data: any) => {
                setTaskTypeData(data);
            })
            .catch((err: Error) => {
                console.error(err);
                toast.error('Failed to load focus data');
            });
    }, [auth]);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/insights/types_over_time',
            {
                method: 'GET'
            })
            .then((data: any) => {
                setTaskTypeOverTimeData(data);
            })
            .catch((err: Error) => {
                console.error(err);
                toast.error('Failed to load focus over time data');
            });
    }, [auth]);

    return (
        <div className="insights">
            <div className="insights__title">Insights</div>
            <div className="insights__description">This is where we will display some insights.</div>
            <div className="insights__status" style={{ width: '50%', height: '100px', display: 'inline-block' }}>
                Status
                <div>
                    {Array.isArray(statusData) ?
                        statusData.map((item, index) => (
                            <div key={index}>
                                {item.status} {item.count}
                            </div>
                        ))
                        :
                        null
                    }
                </div>
            </div>
            <div className="insights__focus" style={{ width: '50%', height: '100px', display: 'inline-block' }}>
                Focus
                <div>
                    {Array.isArray(taskTypeData) ?
                        taskTypeData.map((item, index) => (
                            <div key={index}>
                                {item.status} {item.count}
                            </div>
                        ))
                        :
                        null
                    }
                </div>
            </div>
            <div className="insights__focus_over_time" style={{ width: '100%', height: '100px', display: 'inline-block' }}>
                Focus over time
                <div>
                    {Array.isArray(taskTypeOverTimeData) ?
                        taskTypeOverTimeData.map((item, index) => (
                            <div key={index}>
                                {item.status} {item.count}
                            </div>
                        ))
                        :
                        null
                    }
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;