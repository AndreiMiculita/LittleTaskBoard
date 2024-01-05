import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';


function InsightsPage({ auth }) {
    const [statusData, setStatusData] = useState([]);
    const [focusData, setFocusData] = useState([]);
    const [focusOverTimeData, setFocusOverTimeData] = useState([]);

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
            .then(data => {
                setStatusData(data.statuses);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load status data');
            });
    }, [auth]);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/insights/focus',
            {
                method: 'GET'
            })
            .then(data => {
                setFocusData(data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load focus data');
            });
    }, [auth]);

    useEffect(() => {
        auth.fetch('http://localhost:5000/api/insights/focus_over_time',
            {
                method: 'GET'
            })
            .then(data => {
                setFocusOverTimeData(data);
            })
            .catch(err => {
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
                        console.log("statusData is not an array")
                    }
                </div>
            </div>
            <div className="insights__focus" style={{ width: '50%', height: '100px', display: 'inline-block' }}> Focus </div>
            <div className="insights__focus_over_time" style={{ width: '100%', height: '100px', display: 'inline-block' }}> Focus over time </div>
        </div>
    );
}

export default InsightsPage;