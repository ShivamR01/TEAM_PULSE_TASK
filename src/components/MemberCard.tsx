import { User, CheckCircle2, Clock, Eye } from 'lucide-react';
import type { Member } from '../redux/slices/membersSlice';

interface MemberCardProps {
  member: Member;
  onViewDashboard?: (memberId: string) => void;
}

export default function MemberCard({ member, onViewDashboard }: MemberCardProps) {
  const activeTasks = member.tasks.filter(t => !t.completed).length;
  const completedTasks = member.tasks.filter(t => t.completed).length;

  const statusColors = {
    Working: 'from-green-400 to-green-600',
    Break: 'from-yellow-400 to-yellow-500',
    Meeting: 'from-blue-400 to-blue-600',
    Offline: 'from-gray-400 to-gray-500'
  };

  return (
    <div className="group w-full max-w-sm mx-auto">
      {/* Card Main */}
      <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl transform transition-all hover:scale-[1.05] hover:shadow-3xl overflow-hidden">

        <div className="p-6 flex flex-col space-y-6">
          {/* Member Info */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/50 p-4 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-gray-900" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-gray-900 text-xl">{member.name}</h3>
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${statusColors[member.status]} text-white shadow-md mt-1`}>
                {member.status}
              </span>
            </div>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-300 to-green-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Clock className="w-5 h-5" />
                <span>Active</span>
              </div>
              <span className="mt-2 text-xl font-bold text-white">{activeTasks}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 text-white font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>Completed</span>
              </div>
              <span className="mt-2 text-xl font-bold text-white">{completedTasks}</span>
            </div>
          </div>

          {/* View Dashboard Button (hover only) */}
          {onViewDashboard && (
            <button
              onClick={() => onViewDashboard(member.id)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            >
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View Dashboard</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
