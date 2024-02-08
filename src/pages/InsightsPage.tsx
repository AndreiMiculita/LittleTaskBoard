import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '../components/ui/card';

interface DataPoint {
    status: string;
    count: number;
}

function InsightsPage({ auth }: { auth: any }) {
    document.title = 'Insights - Little Task Board';

    const [statusData, setStatusData] = useState<DataPoint[]>([]);
    const [taskTypeData, setTaskTypeData] = useState<DataPoint[]>([]);
    const [taskTypeOverTimeData, setTaskTypeOverTimeData] = useState<DataPoint[]>([]);

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
                toast.error('Failed to load task type data');
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
                toast.error('Failed to load task type over time data');
            });
    }, [auth]);

    return (
        <>
            <h1 className="text-3xl font-bold m-6">
                Insights
                </h1>
            <div className="flex flex-column items-stretch justify-center flex-wrap w-full gap-4">
                <div className="w-full flex flex-row items-stretch justify-center gap-4">
                    <Card className="w-full md:w-1/2">
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>Task status distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Array.isArray(statusData) ?
                                statusData.map((item, index) => (
                                    <div key={index}>
                                        {item.status} {item.count}
                                    </div>
                                ))
                                :
                                null
                            }
                        </CardContent>
                    </Card>
                    <Card className="w-full md:w-1/2">
                        <CardHeader>
                            <CardTitle>Type</CardTitle>
                            <CardDescription>Task type distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Array.isArray(taskTypeData) ?
                                taskTypeData.map((item, index) => (
                                    <div key={index}>
                                        {item.status} {item.count}
                                    </div>
                                ))
                                :
                                null
                            }
                        </CardContent>
                    </Card>
                </div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Type over time</CardTitle>
                        <CardDescription>Task type distribution over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(taskTypeOverTimeData) ?
                            taskTypeOverTimeData.map((item, index) => (
                                <div key={index}>
                                    {item.status} {item.count}
                                </div>
                            ))
                            :
                            null
                        }
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default InsightsPage;