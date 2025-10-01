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
        taskStatus: 'in-progress',
      },
      {
        id: 't6',
        title: 'Implement login functionality',
        dueDate: '2025-10-08',
        progress: 20,
        completed: false,
        taskStatus: 'in-progress',
      },
    ],
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
        taskStatus: 'completed',
      },
      {
        id: 't3',
        title: 'Update API documentation',
        dueDate: '2025-10-07',
        progress: 30,
        completed: false,
        taskStatus: 'in-progress',
      },
      {
        id: 't7',
        title: 'Create test cases for new features',
        dueDate: '2025-10-09',
        progress: 0,
        completed: false,
        taskStatus: 'pending',
      },
    ],
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
        taskStatus: 'in-progress',
      },
      {
        id: 't8',
        title: 'Optimize database queries',
        dueDate: '2025-10-06',
        progress: 40,
        completed: false,
        taskStatus: 'in-progress',
      },
    ],
  },
  {
    id: '4',
    name: 'Emily Davis',
    status: 'Break',
    tasks: [
      {
        id: 't9',
        title: 'Design sprint retrospective slides',
        dueDate: '2025-10-10',
        progress: 0,
        completed: false,
        taskStatus: 'pending',
      },
    ],
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
        taskStatus: 'pending',
      },
      {
        id: 't10',
        title: 'Set up CI/CD pipeline',
        dueDate: '2025-10-11',
        progress: 50,
        completed: false,
        taskStatus: 'in-progress',
      },
    ],
  },
  {
    id: '6',
    name: 'Sophia Martinez',
    status: 'Working',
    tasks: [
      {
        id: 't11',
        title: 'UI redesign for profile page',
        dueDate: '2025-10-04',
        progress: 100,
        completed: true,
        completedAt: '2025-10-03T11:00:00',
        taskStatus: 'completed',
      },
      {
        id: 't12',
        title: 'Fix mobile responsiveness',
        dueDate: '2025-10-08',
        progress: 70,
        completed: false,
        taskStatus: 'in-progress',
      },
    ],
  },
  {
    id: '7',
    name: 'Liam Brown',
    status: 'Meeting',
    tasks: [
      {
        id: 't13',
        title: 'Prepare Q4 roadmap',
        dueDate: '2025-10-07',
        progress: 10,
        completed: false,
        taskStatus: 'pending',
      },
      {
        id: 't14',
        title: 'Conduct team training session',
        dueDate: '2025-10-12',
        progress: 0,
        completed: false,
        taskStatus: 'pending',
      },
    ],
  },
  {
    id: '8',
    name: 'Olivia Taylor',
    status: 'Working',
    tasks: [
      {
        id: 't15',
        title: 'Analyze customer feedback',
        dueDate: '2025-10-06',
        progress: 80,
        completed: false,
        taskStatus: 'in-progress',
      },
      {
        id: 't16',
        title: 'Update onboarding flow',
        dueDate: '2025-10-09',
        progress: 100,
        completed: true,
        completedAt: '2025-10-08T16:45:00',
        taskStatus: 'completed',
      },
    ],
  },
]

};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    updateStatus: (
      state,
      action: PayloadAction<{ userId: string; newStatus: Status }>
    ) => {
      const { userId, newStatus } = action.payload;
      const member = state.members.find(m => m.id === userId);
      if (member) member.status = newStatus;
    },
    assignTask: (
      state,
      action: PayloadAction<{ userId: string; title: string; dueDate: string }>
    ) => {
      const { userId, title, dueDate } = action.payload;
      const member = state.members.find(m => m.id === userId);
      if (!member) return;

      const newTask: Task = {
        id: `t${Date.now()}`,
        title,
        dueDate,
        progress: 0,
        completed: false,
        taskStatus: 'pending'
      };
      member.tasks.push(newTask);
    },
    updateTaskProgress: (
      state,
      action: PayloadAction<{ userId: string; taskId: string; progressChange: number }>
    ) => {
      const { userId, taskId, progressChange } = action.payload;
      const member = state.members.find(m => m.id === userId);
      if (!member) return;

      const task = member.tasks.find(t => t.id === taskId);
      if (!task) return;

      task.progress = Math.max(0, Math.min(100, task.progress + progressChange));
      if (task.progress === 0) {
        task.taskStatus = 'pending';
        task.completed = false;
      } else if (task.progress === 100) {
        task.taskStatus = 'completed';
        task.completed = true;
        task.completedAt = new Date().toISOString();
      } else {
        task.taskStatus = 'in-progress';
        task.completed = false;
      }
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ userId: string; taskId: string; newStatus: 'pending' | 'in-progress' | 'completed' }>
    ) => {
      const { userId, taskId, newStatus } = action.payload;
      const member = state.members.find(m => m.id === userId);
      if (!member) return;

      const task = member.tasks.find(t => t.id === taskId);
      if (!task) return;

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
});

export const { updateStatus, assignTask, updateTaskProgress, updateTaskStatus } = membersSlice.actions;
export default membersSlice.reducer;
