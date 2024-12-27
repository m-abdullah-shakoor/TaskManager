import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';

const TaskList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {list.map((task) => (
        <div key={task._id} className="p-4 bg-gray-100 rounded shadow mb-2">
          <h3 className="text-xl font-semibold">{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
