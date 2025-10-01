import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import membersReducer from './membersSlice';

export const store = configureStore({
  reducer: {
    role: roleReducer,
    members: membersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
