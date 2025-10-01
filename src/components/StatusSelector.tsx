import type { Status } from '../redux/slices/membersSlice';
import type { LucideIcon } from 'lucide-react';

interface StatusOption {
  value: Status;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface StatusSelectorProps {
  statuses: StatusOption[];
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
}

export default function StatusSelector({ statuses, currentStatus, onStatusChange }: StatusSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statuses.map((status) => {
        const IconComponent = status.icon;
        const isActive = currentStatus === status.value;

        return (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300
              ${
                isActive
                  ? `${status.color} text-white border-transparent shadow-lg scale-105 ring-2 ring-offset-2 ring-offset-gray-100`
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:shadow-md hover:border-gray-300'
              }`}
          >
            <IconComponent className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-gray-600'} transition-colors duration-300`} />
            <span className="text-sm font-medium">{status.label}</span>
          </button>
        );
      })}
    </div>
  );
}
