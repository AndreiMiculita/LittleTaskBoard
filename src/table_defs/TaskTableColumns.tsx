import { faBrain, faNoteSticky, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "../types";
import { formatPlannedAt, formatDuration } from '../components/Planning';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons"
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
    1: 'To Do',
    2: 'In Progress',
    3: 'Done'
};

const TASK_TYPE_MAP = {
    '0': <div><FontAwesomeIcon icon={faNoteSticky} /> Regular</div>,
    '1': <div><FontAwesomeIcon icon={faBrain} /> Focus</div>,
    '2': <div><FontAwesomeIcon icon={faUsers} /> Meeting</div>
};

export const columns: ColumnDef<Task>[] = [
    {
        header: "Title",
        accessorKey: "title",
    },
    {
        header: "Priority",
        accessorKey: "priority",
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.getValue("priority")}
            </div>
        )
    },
    {
        header: "Planned At",
        accessorKey: "planned_at",
        cell: ({ row }) => row.getValue("planned_at") ? formatPlannedAt(row.getValue("planned_at"), false) : "Not Planned"
    },
    {
        header: "Duration",
        accessorKey: "duration",
        cell: ({ row }) => row.getValue("duration") ? formatDuration(row.getValue("duration")) : "No Duration"
    },
    {
        header: "Type",
        accessorKey: "task_type",
        cell: ({ row }) => (
            <div className="flex justify-center">
                {TASK_TYPE_MAP[row.getValue("task_type")?.toString()] || "No Type"}
            </div>
        )
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => STATUS_MAP[row.getValue("status")?.toString()] || "No Status"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(task.id.toString())}
                        >
                            Copy task ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                const navigate = useNavigate();
                                navigate(`/tasks/${task.id}`);
                            }
                            }
                        >View task</DropdownMenuItem>
                        <DropdownMenuItem>Delete task</DropdownMenuItem>
                        <DropdownMenuItem>Assign task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];