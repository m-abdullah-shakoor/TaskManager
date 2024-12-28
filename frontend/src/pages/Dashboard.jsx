import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  updateTask,
  deleteTask,
  createTask,
} from "../redux/taskSlice";
import { logout } from "../redux/authSlice";
import { IoMdAddCircleOutline } from "react-icons/io";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);
  const { isInitialized, isAuthenticated } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: "",
    status: "Pending",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      dispatch(fetchTasks());
    }
  }, [isInitialized, isAuthenticated, dispatch]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredTasks(tasks);
    } else if (filter === "duedate") {
      setFilteredTasks(
        [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      );
    } else if (filter === "status") {
      setFilteredTasks(tasks.filter((task) => task.status === "completed"));
    }
  }, [filter, tasks]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleCreateTask = () => {
    setNewTask({
      title: "",
      dueDate: "",
      status: "Pending",
      description: "",
    });
    setSelectedTask(null);
    setIsEditMode(true);
  };

  const handleDeleteClick = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setSelectedTask(null);
      dispatch(deleteTask(taskId));
    }
  };

  const handleSaveTask = () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Task saved");
      setIsEditMode(false);
      if (selectedTask) {
        console.log(selectedTask);
        dispatch(updateTask(selectedTask));
      } else {
        console.log(newTask);
        dispatch(createTask(newTask));
      }
      setIsEditMode(false);
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!newTask.title && !selectedTask?.title)
      errors.title = "Title is required.";
    if (!newTask.dueDate && !selectedTask?.dueDate)
      errors.dueDate = "Due Date is required.";
    if (!newTask.status && !selectedTask?.status)
      errors.status = "Status is required.";
    if (!newTask.description && !selectedTask?.description)
      errors.description = "Description is required.";
    const validStatuses = ["Completed", "Pending", "In Progress"];
    if (
      (newTask.status && !validStatuses.includes(newTask.status)) ||
      (selectedTask?.status && !validStatuses.includes(selectedTask.status))
    ) {
      errors.status = "Valid statuses: Pending, In Progress, Completed.";
    }

    return errors;
  };
  const handleCancelClick = () => {
    setIsEditMode(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedTask) {
      setSelectedTask((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewTask((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <div
        id="header"
        className="h-16 bg-blue-600 text-white flex items-center justify-between px-4"
      >
        <h1>Task Manager</h1>
        <button onClick={handleLogout} className="text-red-600">
          Logout
        </button>
      </div>

      <div className="flex flex-1">
        <div id="sidebar" className="w-72 bg-gray-800 text-white p-4">
          <div className="flex flex-row items-center justify-between mb-4">
            <span>Filter Tasks</span>
            <select
              className="bg-gray-700 text-white p-2 rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="duedate">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  selectedTask?._id === task._id ? "bg-blue-600" : "bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedTask(task);
                  setIsEditMode(false);
                }}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>

        <div id="maincontent" className="flex-1 bg-gray-100 p-6">
          <div className="my-2 border-b-2 border-gray-200">
            <button
              onClick={handleCreateTask}
              className="rounded-xl text-xl bg-sky-600 text-white w-28 flex flex-row justify-center items-center gap-1 p-2 my-1"
            >
              <span>Create</span> <IoMdAddCircleOutline className="" />
            </button>
          </div>
          {isEditMode ? (
            <div className="task-details">
              <input
                className="w-full text-2xl font-bold mb-4 border-spacing-2 border rounded-lg bg-white p-5 focus:outline-none "
                type="text"
                name="title"
                placeholder={selectedTask ? "" : "Add Task Title Here..."}
                value={selectedTask ? selectedTask.title : newTask.title}
                onChange={handleInputChange}
                disabled={!isEditMode}
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs">{formErrors.title}</p>
              )}

              <div className="flex flex-row justify-between">
                <div className="mb-2 border-spacing-2 border rounded-lg bg-white p-5 min-w-md w-[40%]">
                  <strong>Due Date:</strong>{" "}
                  <input
                    type="date"
                    name="dueDate"
                    value={
                      selectedTask
                        ? selectedTask.dueDate.slice(0, 10)
                        : newTask.dueDate
                    }
                    onChange={handleInputChange}
                    className="focus:outline-none"
                    disabled={!isEditMode}
                  />
                </div>

                <div className="mb-2 border-spacing-2 border rounded-lg bg-white p-5 min-w-md w-[40%]">
                  <strong>Status: </strong>
                  <input
                    type="text"
                    name="status"
                    value={selectedTask ? selectedTask.status : newTask.status}
                    onChange={handleInputChange}
                    className="focus:outline-none w-full"
                    disabled={!isEditMode}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="w-[40%]">
                  {formErrors.dueDate && (
                    <p className="text-red-500 text-xs">{formErrors.dueDate}</p>
                  )}
                </div>
                <div className="w-[40%]">
                  {formErrors.status && (
                    <p className="text-red-500 text-xs">{formErrors.status}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <strong>Description</strong>
                <textarea
                  name="description"
                  value={
                    selectedTask
                      ? selectedTask.description
                      : newTask.description
                  }
                  onChange={handleInputChange}
                  className="w-full my-4 p-5 border rounded-lg bg-white focus:outline-none h-40"
                  disabled={!isEditMode}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="flex justify-around">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSaveTask}
                      className="bg-blue-600 text-white px-4 p-2 rounded-xl w-28"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-600 text-white px-4 p-2 rounded-xl w-28"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-green-600 text-white px-4 p-2 rounded-xl w-28"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ) : selectedTask ? (
            <div className="task-details">
              <h2 className="text-2xl font-bold mb-4 border-spacing-2 border rounded-lg bg-white p-5 ">
                {selectedTask.title}
              </h2>
              <div className="flex flex-row justify-between">
                <div className="mb-2 border-spacing-2 border rounded-lg bg-white p-5 min-w-md w-[40%]">
                  <strong>Due Date:</strong>{" "}
                  {new Date(selectedTask.dueDate).toLocaleDateString()}
                </div>
                <div className="mb-2 border-spacing-2 border rounded-lg bg-white p-5 min-w-md w-[40%]">
                  <strong>Status:</strong> {selectedTask.status || "N/A"}
                </div>
              </div>
              <div className="my-6">
                <strong>Description</strong>
                <div className="my-4 border-spacing-2 border rounded-lg bg-white p-5 h-40">
                  {selectedTask.description || "No description provided."}
                </div>
              </div>
              <div className="flex justify-around">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-600 text-white px-4 p-2 rounded-xl w-28"
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 p-2 rounded-xl w-28"
                  onClick={() => handleDeleteClick(selectedTask._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[90%] flex justify-center items-center">
              <p className="text-gray-500">
                Select a task to view its details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
