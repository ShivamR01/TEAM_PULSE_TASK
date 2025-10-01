import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { assignTask } from '../redux/slices/membersSlice';
import { selectMember, switchRole } from '../redux/slices/roleSlice';
import { Users, Coffee, Video, UserX, Plus, Filter, ArrowUpDown } from 'lucide-react';
import MemberCard from './MemberCard';
import type { Status } from '../redux/slices/membersSlice';
import StatusChart from './StatusChart';
import PerformanceChart from './PerformanceChart';

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

  const statusCounts = useMemo(() => ({
    Working: members.filter(m => m.status === 'Working').length,
    Break: members.filter(m => m.status === 'Break').length,
    Meeting: members.filter(m => m.status === 'Meeting').length,
    Offline: members.filter(m => m.status === 'Offline').length
  }), [members]);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members;
    if (filterStatus !== 'All') filtered = members.filter(m => m.status === filterStatus);
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.tasks.filter(t => !t.completed).length - a.tasks.filter(t => !t.completed).length;
    });
  }, [members, filterStatus, sortBy]);

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMember && taskTitle && dueDate) {
      dispatch(assignTask({ userId: selectedMember, title: taskTitle, dueDate }));
      setTaskTitle('');
      setDueDate('');
      setSelectedMember('');
    }
  };

  const statusCards = [
    { label: 'Working', count: statusCounts.Working, icon: Users, color: 'bg-gradient-to-tr from-green-400 to-green-600' },
    { label: 'Break', count: statusCounts.Break, icon: Coffee, color: 'bg-gradient-to-tr from-yellow-400 to-yellow-500' },
    { label: 'Meeting', count: statusCounts.Meeting, icon: Video, color: 'bg-gradient-to-tr from-blue-400 to-blue-600' },
    { label: 'Offline', count: statusCounts.Offline, icon: UserX, color: 'bg-gradient-to-tr from-gray-400 to-gray-500' }
  ];

  return (
    <div className="space-y-8 px-4 md:px-8">
      
    {/* Dashboard Heading */}
    <div className="flex items-center justify-between">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
        Team Lead Dashboard
      </h1>
    </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statusCards.map(card => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.label}
              className={`relative rounded-2xl p-6 flex items-center justify-between transition-transform hover:scale-[1.03] hover:shadow-2xl shadow-md border border-white/20 ${card.color} text-white`}
            >
              <div>
                <p className="text-sm font-medium opacity-80">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.count}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full flex items-center justify-center shadow-md">
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
          <StatusChart statusCounts={statusCounts} />
        </div>
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
          <PerformanceChart members={filteredAndSortedMembers} />
        </div>
      </div>

      {/* Assign Task Form */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Assign New Task
        </h2>
        <form onSubmit={handleAssignTask} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Team Member</label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select member...</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>

      {/* Team Members Section */}
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Status | 'All')}
                className="px-3 py-1.5 rounded-lg border text-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Working">Working</option>
                <option value="Break">Break</option>
                <option value="Meeting">Meeting</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'tasks')}
                className="px-3 py-1.5 rounded-lg border text-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="tasks">Sort by Active Tasks</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMembers.map(member => (
            <MemberCard key={member.id} member={member} onViewDashboard={handleViewMemberDashboard} />
          ))}
        </div>
      </div>
    </div>
  );
}

