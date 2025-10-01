import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TeamLeadView from '../components/TeamLeadView';
import TeamMemberView from '../components/TeamMemberView';

export default function Dashboard() {
  const { currentRole } = useSelector((state: RootState) => state.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentRole === 'lead' ? <TeamLeadView /> : <TeamMemberView />}
    </div>
  );
}
