import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoleState {
  currentRole: 'lead' | 'member';
  currentUser: string;
  selectedMemberId: string;
}

const initialState: RoleState = {
  currentRole: 'member',
  currentUser: 'John Doe',
  selectedMemberId: '1'
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    switchRole: (state, action: PayloadAction<'lead' | 'member'>) => {
      state.currentRole = action.payload;
    },
    setUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
    selectMember: (state, action: PayloadAction<string>) => {
      state.selectedMemberId = action.payload;
    }
  }
});

export const { switchRole, setUser, selectMember } = roleSlice.actions;
export default roleSlice.reducer;
