import { faBrain, faNoteSticky, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from 'react-router-dom';
import { formatDuration, formatPlannedAt } from '../components/Planning';
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { DataTableColumnHeader } from '../components/ui/data-table-column-header';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Task } from "../types";

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
        id: "select",
        header: ({ table }) => (
            <Checkbox
                className="flex justify-center mx-auto"
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                className="flex justify-center mx-auto"
                checked={row.getIsSelected()}
                onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: () => (
            <div className="flex justify-end">
                Task ID
            </div>
        ),
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="flex justify-end">
                {row.getValue("id")}
            </div>
        )
    },
    {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Title" />
            )
        },
        accessorKey: "title",
    },
    {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader className='flex justify-center' column={column} title="Priority" />
            )
        },
        accessorKey: "priority",
        cell: ({ row }) => (
            <div className="flex justify-center">
                {row.getValue("priority")}
            </div>
        )
    },
    {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Planned At" />
            )
        },
        accessorKey: "planned_at",
        cell: ({ row }) => row.getValue("planned_at") ? formatPlannedAt(row.getValue("planned_at"), false) : "Not Planned"
    },
    {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Duration" />
            )
        },
        accessorKey: "duration",
        cell: ({ row }) => row.getValue("duration") ? formatDuration(row.getValue("duration")) : "No Duration"
    },
    {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader className='flex justify-center' column={column} title="Type" />
            )
        },
        accessorKey: "task_type",
        cell: ({ row }) => (
            <div className="flex justify-center">
                {TASK_TYPE_MAP[row.getValue("task_type")?.toString()] || "No Type"}
            </div>
        )
    },
    {
        header: ({ column }) => {
            return (
                <DataTableColumnHeader column={column} title="Status" />
            )
        },
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