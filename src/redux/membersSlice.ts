import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Status = 'Working' | 'Break' | 'Meeting' | 'Offline';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  taskStatus: 'pending' | 'in-progress' | 'completed';
}

export interface Member {
  id: string;
  name: string;
  status: Status;
  tasks: Task[];
}

interface MembersState {
  members: Member[];
}

const initialState: MembersState = {
  members: [
    {
      id: '1',
      name: 'John Doe',
      status: 'Working',
      tasks: [
        {
          id: 't1',
          title: 'Complete dashboard wireframe',
          dueDate: '2025-10-05',
          progress: 60,
          completed: false,
          taskStatus: 'in-progress'
        }
      ]
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      status: 'Meeting',
      tasks: [
        {
          id: 't2',
          title: 'Review pull request #234',
          dueDate: '2025-10-03',
          progress: 100,
          completed: true,
          completedAt: '2025-10-02T14:30:00',
          taskStatus: 'completed'
        },
        {
          id: 't3',
          title: 'Update API documentation',
          dueDate: '2025-10-07',
          progress: 30,
          completed: false,
          taskStatus: 'in-progress'
        }
      ]
    },
    {
      id: '3',
      name: 'Michael Chen',
      status: 'Working',
      tasks: [
        {
          id: 't4',
          title: 'Fix authentication bug',
          dueDate: '2025-10-02',
          progress: 90,
          completed: false,
          taskStatus: 'in-progress'
        }
      ]
    },
    {
      id: '4',
      name: 'Emily Davis',
      status: 'Break',
      tasks: []
    },
    {
      id: '5',
      name: 'David Wilson',
      status: 'Offline',
      tasks: [
        {
          id: 't5',
          title: 'Prepare sprint planning',
          dueDate: '2025-10-06',
          progress: 0,
          completed: false,
          taskStatus: 'pending'
        }
      ]
    }
  ]
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<{ userId: string; newStatus: Status; currentUser: string; currentRole: 'lead' | 'member' }>) => {
      const { userId, newStatus, currentUser, currentRole } = action.payload;

      if (currentRole === 'member') {
        const member = state.members.find(m => m.name === currentUser);
        if (member) {
          member.status = newStatus;
        }
      } else {
        const member = state.members.find(m => m.id === userId);
        if (member) {
          member.status = newStatus;
        }
      }
    },
    assignTask: (state, action: PayloadAction<{ userId: string; title: string; dueDate: string }>) => {
      const { userId, title, dueDate } = action.payload;
      const member = state.members.find(m => m.id === userId);

      if (member) {
        const newTask: Task = {
          id: `t${Date.now()}`,
          title,
          dueDate,
          progress: 0,
          completed: false,
          taskStatus: 'pending'
        };
        member.tasks.push(newTask);
      }
    },
    updateTaskProgress: (state, action: PayloadAction<{ userId: string; taskId: string; progressChange: number }>) => {
      const { userId, taskId, progressChange } = action.payload;
      const member = state.members.find(m => m.id === userId);

      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.progress = Math.max(0, Math.min(100, task.progress + progressChange));

          if (task.progress === 0) {
            task.taskStatus = 'pending';
          } else if (task.progress === 100) {
            task.taskStatus = 'completed';
            task.completed = true;
            task.completedAt = new Date().toISOString();
          } else {
            task.taskStatus = 'in-progress';
            task.completed = false;
          }
        }
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ userId: string; taskId: string; newStatus: 'pending' | 'in-progress' | 'completed' }>) => {
      const { userId, taskId, newStatus } = action.payload;
      const member = state.members.find(m => m.id === userId);

      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.taskStatus = newStatus;

          if (newStatus === 'completed') {
            task.completed = true;
            task.progress = 100;
            task.completedAt = new Date().toISOString();
          } else if (newStatus === 'pending') {
            task.completed = false;
            if (task.progress === 100) task.progress = 0;
          } else {
            task.completed = false;
          }
        }
      }
    }
  }
});

export const { updateStatus, assignTask, updateTaskProgress, updateTaskStatus } = membersSlice.actions;
export default membersSlice.reducer;
