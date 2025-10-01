import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateStatus } from '../redux/membersSlice';
import { selectMember } from '../redux/roleSlice';
import StatusSelector from './StatusSelector';
import TaskList from './TaskList';
import { Users, Coffee, Video, UserX, User } from 'lucide-react';
import type { Status } from '../redux/membersSlice';

export default function TeamMemberView() {
  const { currentUser, currentRole, selectedMemberId } = useSelector((state: RootState) => state.role);
  const { members } = useSelector((state: RootState) => state.members);
  const dispatch = useDispatch();

  const currentMember = members.find(m => m.id === selectedMemberId);
  const currentStatus = currentMember?.status || 'Offline';
  const myTasks = currentMember?.tasks || [];

  const handleMemberSelect = (memberId: string) => {
    dispatch(selectMember(memberId));
  };

  const handleStatusChange = (newStatus: Status) => {
    if (currentMember) {
      dispatch(updateStatus({
        userId: currentMember.id,
        newStatus,
        currentUser,
        currentRole
      }));
    }
  };

  const statuses: { value: Status; label: string; icon: typeof Users; color: string }[] = [
    { value: 'Working', label: 'Working', icon: Users, color: 'bg-green-500 hover:bg-green-600' },
    { value: 'Break', label: 'Break', icon: Coffee, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { value: 'Meeting', label: 'Meeting', icon: Video, color: 'bg-blue-500 hover:bg-blue-600' },
    { value: 'Offline', label: 'Offline', icon: UserX, color: 'bg-gray-500 hover:bg-gray-600' }
  ];

  const activeTasks = myTasks.filter(t => !t.completed);
  const completedTasks = myTasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Team Member Dashboard</h2>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-500" />
            <select
              value={selectedMemberId}
              onChange={(e) => handleMemberSelect(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-900"
            >
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Current Status</h3>
        <StatusSelector
          statuses={statuses}
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{myTasks.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeTasks.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Coffee className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{completedTasks.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Video className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <TaskList tasks={myTasks} userId={currentMember?.id || ''} />
    </div>
  );
}
