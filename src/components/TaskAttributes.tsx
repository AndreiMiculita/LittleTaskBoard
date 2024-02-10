import { faBrain, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from './ui/badge';

const priorityColors = ['bg-red-600', 'bg-yellow-500', 'bg-green-600'];

interface TaskAttributesProps {
    type: number;
    priority: number;
}

function getPriorityClassName(priority: number) {
    return priorityColors[priority - 1] || 'bg-green-600';
}

function TaskAttributes({ type, priority }: TaskAttributesProps) {
    return (
        <div>
            <Badge variant='outline' className={`${getPriorityClassName(priority)} text-white`}>
                Priority {priority}
            </Badge>
            {type === 1 && <FontAwesomeIcon icon={faBrain} className="taskType" />}
            {type === 2 && <FontAwesomeIcon icon={faUsers} className="taskType" />}
        </div>
    );
};

export default TaskAttributes;