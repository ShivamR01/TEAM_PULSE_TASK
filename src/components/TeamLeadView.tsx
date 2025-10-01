import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { assignTask } from '../redux/membersSlice';
import { selectMember, switchRole } from '../redux/roleSlice';
import { Users, Coffee, Video, UserX, Plus, Filter, ArrowUpDown } from 'lucide-react';
import MemberCard from './MemberCard';
import type { Status } from '../redux/membersSlice';

export default function TeamLeadView() {
  const { members } = useSelector((state: RootState) => state.members);
  const dispatch = useDispatch();

  const handleViewMemberDashboard = (memberId: string) => {
    dispatch(selectMember(memberId));
    dispatch(switchRole('member'));
  };

  const [selectedMember, setSelectedMember] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'tasks'>('name');

  const statusCounts = useMemo(() => {
    return {
      Working: members.filter(m => m.status === 'Working').length,
      Break: members.filter(m => m.status === 'Break').length,
      Meeting: members.filter(m => m.status === 'Meeting').length,
      Offline: members.filter(m => m.status === 'Offline').length
    };
  }, [members]);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members;

    if (filterStatus !== 'All') {
      filtered = members.filter(m => m.status === filterStatus);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        const aActiveTasks = a.tasks.filter(t => !t.completed).length;
        const bActiveTasks = b.tasks.filter(t => !t.completed).length;
        return bActiveTasks - aActiveTasks;
      }
    });

    return sorted;
  }, [members, filterStatus, sortBy]);

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMember && taskTitle && dueDate) {
      dispatch(assignTask({
        userId: selectedMember,
        title: taskTitle,
        dueDate
      }));
      setTaskTitle('');
      setDueDate('');
      setSelectedMember('');
    }
  };

  const statusCards = [
    { label: 'Working', count: statusCounts.Working, icon: Users, color: 'bg-green-500' },
    { label: 'Break', count: statusCounts.Break, icon: Coffee, color: 'bg-yellow-500' },
    { label: 'Meeting', count: statusCounts.Meeting, icon: Video, color: 'bg-blue-500' },
    { label: 'Offline', count: statusCounts.Offline, icon: UserX, color: 'bg-gray-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.count}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Assign New Task
        </h2>
        <form onSubmit={handleAssignTask} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Member
              </label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select member...</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Assign Task
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Status | 'All')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Working">Working</option>
                <option value="Break">Break</option>
                <option value="Meeting">Meeting</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'tasks')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="tasks">Sort by Active Tasks</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedMembers.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onViewDashboard={handleViewMemberDashboard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
