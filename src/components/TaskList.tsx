import { useDispatch } from 'react-redux';
import { updateTaskProgress, updateTaskStatus } from '../redux/slices/membersSlice';
import { Calendar, CheckCircle2, Minus, Plus, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task } from '../redux/slices/membersSlice';

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
        return 'bg-gray-200 text-gray-800';
      case 'in-progress':
        return 'bg-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-200 text-green-800';
    }
  };

  const isOverdue = (dueDate: string, completed: boolean) => {
    if (completed) return false;
    return new Date(dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10 text-center">
        <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500 text-lg">No tasks assigned yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task, index) => {
          const progressColor =
            task.taskStatus === 'completed'
              ? 'from-green-400 to-green-600'
              : task.taskStatus === 'in-progress'
              ? 'from-blue-400 to-blue-600'
              : 'from-gray-300 to-gray-400';

          return (
           <motion.div
  key={task.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
  className={`relative rounded-2xl p-5 shadow-sm hover:shadow-md transition-transform hover:scale-[1.02] overflow-hidden
    ${
      task.completed
        ? 'bg-green-50 border border-green-200'
        : isOverdue(task.dueDate, task.completed)
        ? 'bg-red-50 border border-red-200'
        : 'bg-white border border-gray-200'
    }
  `}
>
  {/* Top Info */}
  <div className="flex justify-between items-start mb-3">
    <div className="flex-1">
      <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {task.title}
      </h3>
      <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
        <div className={`flex items-center gap-1`}>
          <Calendar className="w-4 h-4" />
          <span className={isOverdue(task.dueDate, task.completed) ? 'text-red-600 font-medium' : ''}>
            {formatDate(task.dueDate)}
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded-full border text-xs ${getStatusColor(task.taskStatus)} flex items-center gap-1`}>
          <Tag className="w-3 h-3" />
          <span className="capitalize">{task.taskStatus.replace('-', ' ')}</span>
        </div>
      </div>
      {task.completedAt && (
        <div className="flex items-center text-xs text-green-600 mt-1 gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatDateTime(task.completedAt)}</span>
        </div>
      )}
    </div>

    {/* Status Selector */}
    <div className="flex-shrink-0">
      <select
        value={task.taskStatus}
        onChange={(e) => handleStatusChange(task.id, e.target.value as 'pending' | 'in-progress' | 'completed')}
        className={`text-xs px-3 py-1 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(task.taskStatus)}`}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>

  {/* Progress Bar */}
  <div className="mt-3">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">Progress</span>
      <span className="font-semibold text-gray-900">{task.progress}%</span>
    </div>
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${task.progress}%` }}
        transition={{ duration: 0.5 }}
        className={`h-full rounded-full ${
          task.taskStatus === 'completed'
            ? 'bg-green-500'
            : task.taskStatus === 'in-progress'
            ? 'bg-blue-500'
            : 'bg-gray-400'
        }`}
      />
    </div>
  </div>

  {/* Increment / Decrement Buttons */}
  {!task.completed && (
    <div className="flex justify-end items-center space-x-2 mt-4">
      <button
        onClick={() => handleProgressChange(task.id, -10)}
        disabled={task.progress === 0}
        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <Minus className="w-4 h-4 inline-block" />
      </button>
      <button
        onClick={() => handleProgressChange(task.id, 10)}
        disabled={task.progress === 100}
        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <Plus className="w-4 h-4 inline-block" />
      </button>
    </div>
  )}
</motion.div>

          );
        })}
      </div>
    </div>
  );
}
