import React from 'react';
import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  completedTasks: number[];
  handleTaskCompletion: (taskId: number, taskLink: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, completedTasks, handleTaskCompletion }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Earn with Tasks</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="mb-2 flex justify-between items-center">
            <span>{task.name}</span>
            <button
              onClick={() => handleTaskCompletion(task.id, task.link)}
              disabled={completedTasks.includes(task.id)}
              className={`ml-4 px-4 py-2 rounded ${
                completedTasks.includes(task.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
              }`}
            >
              {completedTasks.includes(task.id) ? 'Completed' : task.btn}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;