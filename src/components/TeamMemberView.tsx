import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { selectMember } from '../redux/slices/roleSlice';
import { updateStatus, Status, Member } from '../redux/slices/membersSlice';
import StatusSelector from './StatusSelector';
import TaskList from './TaskList';
import { Users, Coffee, Video, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamMemberView() {
  const { selectedMemberId } = useSelector((state: RootState) => state.role);
  const { members } = useSelector((state: RootState) => state.members) as { members: Member[] };
  const dispatch = useDispatch();

  const currentMember = members.find(m => m.id === selectedMemberId) || members[0];
  const currentStatus: Status = currentMember?.status || 'Offline';
  const myTasks = currentMember?.tasks || [];

  const handleStatusChange = (newStatus: Status) => {
    if (!currentMember) return;
    dispatch(
      updateStatus({
        userId: currentMember.id,
        newStatus,
      })
    );
  };

  const statuses = [
    { value: 'Working' as Status, label: 'Working', icon: Users, color: 'bg-green-500 hover:bg-green-600' },
    { value: 'Break' as Status, label: 'Break', icon: Coffee, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { value: 'Meeting' as Status, label: 'Meeting', icon: Video, color: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'Offline' as Status, label: 'Offline', icon: UserX, color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  const activeTasks = myTasks.filter(t => !t.completed);
  const completedTasks = myTasks.filter(t => t.completed);

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
          Team Member Dashboard
        </h2>

        <select
          value={currentMember.id}
          onChange={e => dispatch(selectMember(e.target.value))}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          {members.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Status Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Current Status</h3>
        <StatusSelector statuses={statuses} currentStatus={currentStatus} onStatusChange={handleStatusChange} />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Tasks', value: myTasks.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { title: 'Active Tasks', value: activeTasks.length, icon: Coffee, color: 'bg-yellow-100 text-yellow-600' },
          { title: 'Completed', value: completedTasks.length, icon: Video, color: 'bg-green-100 text-green-600' },
        ].map((card) => (
          <motion.div
            key={card.title}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex items-center justify-between transition cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color} flex items-center justify-center`}>
              <card.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
      >
        <TaskList tasks={myTasks} userId={currentMember.id} />
      </motion.div>
    </div>
  );
}
