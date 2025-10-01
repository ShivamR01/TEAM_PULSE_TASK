import { User, CheckCircle2, Clock, Eye } from 'lucide-react';
import type { Member } from '../redux/membersSlice';

interface MemberCardProps {
  member: Member;
  onViewDashboard?: (memberId: string) => void;
}

export default function MemberCard({ member, onViewDashboard }: MemberCardProps) {
  const activeTasks = member.tasks.filter(t => !t.completed).length;
  const completedTasks = member.tasks.filter(t => t.completed).length;

  const statusColors = {
    Working: 'bg-green-100 text-green-800 border-green-200',
    Break: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Meeting: 'bg-blue-100 text-blue-800 border-blue-200',
    Offline: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[member.status]} mt-1`}>
              {member.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            Active Tasks
          </span>
          <span className="font-semibold text-gray-900">{activeTasks}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center text-gray-600">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Completed
          </span>
          <span className="font-semibold text-gray-900">{completedTasks}</span>
        </div>
      </div>

      {onViewDashboard && (
        <button
          onClick={() => onViewDashboard(member.id)}
          className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-4 h-4" />
          <span>View Dashboard</span>
        </button>
      )}
    </div>
  );
}
