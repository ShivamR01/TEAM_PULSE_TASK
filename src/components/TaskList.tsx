import { useDispatch } from 'react-redux';
import { updateTaskProgress, updateTaskStatus } from '../redux/membersSlice';
import { Calendar, CheckCircle2, Circle, Minus, Plus, Clock, Tag } from 'lucide-react';
import type { Task } from '../redux/membersSlice';

interface TaskListProps {
  tasks: Task[];
  userId: string;
}

export default function TaskList({ tasks, userId }: TaskListProps) {
  const dispatch = useDispatch();

  const handleProgressChange = (taskId: string, change: number) => {
    dispatch(updateTaskProgress({ userId, taskId, progressChange: change }));
  };

  const handleStatusChange = (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    dispatch(updateTaskStatus({ userId, taskId, newStatus }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: 'pending' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Circle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No tasks assigned yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border rounded-lg p-4 transition-all ${
              task.completed
                ? 'bg-green-50 border-green-200'
                : isOverdue(task.dueDate, task.completed)
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3 flex-1">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span
                        className={
                          isOverdue(task.dueDate, task.completed) ? 'text-red-600 font-medium' : ''
                        }
                      >
                        Due: {formatDate(task.dueDate)}
                      </span>
                    </div>
                    <div className={`flex items-center text-xs px-2 py-1 rounded border ${getStatusColor(task.taskStatus)}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      <span className="font-medium capitalize">{task.taskStatus}</span>
                    </div>
                  </div>
                  {task.completedAt && (
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Completed: {formatDateTime(task.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <select
                  value={task.taskStatus}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as 'pending' | 'in-progress' | 'completed')}
                  className={`text-xs px-2 py-1 rounded border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.taskStatus)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold text-gray-900">{task.progress}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    task.completed ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>

              {!task.completed && (
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <button
                    onClick={() => handleProgressChange(task.id, -10)}
                    disabled={task.progress === 0}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                  >
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-medium">10%</span>
                  </button>
                  <button
                    onClick={() => handleProgressChange(task.id, 10)}
                    disabled={task.progress === 100}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">10%</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
