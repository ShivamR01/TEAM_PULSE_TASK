import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { switchRole, selectMember } from '../redux/slices/roleSlice';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { currentRole, selectedMemberId, teamMembers } = useSelector(
    (state: RootState) => state.role
  );
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedMember = teamMembers.find(m => m.id === selectedMemberId);
  const profileName = currentRole === 'lead' ? 'Team Lead' : selectedMember?.name || 'N/A';

  const handleRoleToggle = (role: 'lead' | 'member') => {
    dispatch(switchRole(role));
    setDropdownOpen(false);
  };

  const handleMemberSelect = (memberId: string) => {
    dispatch(selectMember(memberId));
    setDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-wide">Team Pulse</span>
        </div>

        {/* Center: Role Toggle */}
        <div className="relative w-52 h-10 bg-gray-100 rounded-full flex items-center p-1 shadow-inner cursor-pointer select-none">
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-transform duration-300`}
            style={{ transform: currentRole === 'lead' ? 'translateX(0%)' : 'translateX(100%)' }}
          />
          <button
            onClick={() => handleRoleToggle('lead')}
            className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentRole === 'lead' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Team Lead
          </button>
          <button
            onClick={() => handleRoleToggle('member')}
            className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors ${
              currentRole === 'member' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Team Member
          </button>
        </div>

        {/* Right: Profile */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full px-3 py-1 transition-all shadow-sm"
            onClick={() => currentRole === 'member' && setDropdownOpen(!dropdownOpen)}
          >
            <div className="bg-gradient-to-tr from-purple-400 to-pink-400 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{profileName}</span>
              {currentRole === 'member' && selectedMember && (
                <span className="text-xs text-gray-500">ID: {selectedMember.id}</span>
              )}
            </div>
            {currentRole === 'member' && (
              <span>
                {dropdownOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </span>
            )}
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {currentRole === 'member' && dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
              >
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-all ${
                      member.id === selectedMemberId ? 'bg-blue-100 font-medium' : ''
                    }`}
                    onClick={() => handleMemberSelect(member.id)}
                  >
                    {member.name}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
