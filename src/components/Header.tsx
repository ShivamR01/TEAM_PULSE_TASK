import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { switchRole } from '../redux/roleSlice';
import { User } from 'lucide-react';

export default function Header() {
  const { currentUser, currentRole } = useSelector((state: RootState) => state.role);
  const dispatch = useDispatch();

  const handleRoleToggle = () => {
    const newRole = currentRole === 'lead' ? 'member' : 'lead';
    dispatch(switchRole(newRole));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Pulse Dashboard</h1>
              <p className="text-sm text-gray-600">{currentUser}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleRoleToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentRole === 'member'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Team Member
              </button>
              <button
                onClick={handleRoleToggle}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentRole === 'lead'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Team Lead
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
