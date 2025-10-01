import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamMember {
  id: string;
  name: string;
}

interface RoleState {
  currentRole: 'lead' | 'member';
  selectedMemberId: string;
  teamMembers: TeamMember[];
}

const initialState: RoleState = {
  currentRole: 'lead',
  selectedMemberId: '1',
  teamMembers: [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Michael Chen' },
  { id: '4', name: 'Emily Davis' },
  { id: '5', name: 'David Wilson' },
  { id: '6', name: 'Sophia Martinez' },
  { id: '7', name: 'Liam Brown' },
  { id: '8', name: 'Olivia Taylor' },
],

};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<'lead' | 'member'>) => {
      state.currentRole = action.payload;
    },
    selectMember: (state, action: PayloadAction<string>) => {
      state.selectedMemberId = action.payload;
    },
  },
});

export const { switchRole, selectMember } = roleSlice.actions;
export default roleSlice.reducer;
