import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(""); // State for deadline
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Fetch tasks
  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  };

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title required");
      return;
    }

    try {
      await api.post("/tasks", {
        title,
        status: "Todo", // Default status
        deadline: deadline || null, // Send deadline
      });
      setTitle("");
      setDeadline(""); // Reset deadline
      loadTasks();
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  // Update task status
  const updateTaskStatus = async (id, newStatus) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await api.put(`/tasks/${id}`, { status: newStatus });
      loadTasks();
    } catch (err) {
      console.error("Error updating task", err);
      loadTasks();
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Date formatter
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: "600px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>My Tasks</h2>
          <button className="logout" onClick={handleLogout} style={{ width: "auto", margin: 0, padding: "0.5rem 1rem", fontSize: "0.8rem" }}>Logout</button>
        </div>

        <form onSubmit={addTask} style={{ marginBottom: "2rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: 0, flex: "1 1 200px" }}
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{
              marginBottom: 0,
              flex: "0 0 140px",
              padding: "0.75rem",
              borderRadius: "8px",
              border: "1px solid #475569",
              backgroundColor: "#334155",
              color: "white"
            }}
          />
          <button style={{ width: "auto", flex: "0 0 80px" }}>Add</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 && <p style={{ textAlign: "center", color: "#64748b" }}>No tasks yet. Add one above!</p>}

          {tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginRight: "10px" }}>
                  <span style={{ fontSize: "1.1rem", textDecoration: task.status === "Completed" ? "line-through" : "none", color: task.status === "Completed" ? "#94a3b8" : "#f8fafc" }}>
                    {task.title}
                  </span>
                  {task.deadline && (
                    <span style={{ fontSize: "0.80rem", color: "#facc15", backgroundColor: "rgba(250, 204, 21, 0.1)", padding: "2px 6px", borderRadius: "4px", whiteSpace: "nowrap" }}>
                      📅 {formatDate(task.deadline)}
                    </span>
                  )}
                </div>

                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className={`status-select status-${task.status.toLowerCase().replace(" ", "-")}`}
                  style={{
                    width: "fit-content",
                    padding: "4px 8px",
                    fontSize: "0.85rem",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
                title="Delete Task"
              >
                <i className="trash-icon">🗑️</i>
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", textAlign: "center", borderTop: "1px solid #334155", paddingTop: "15px" }}>
          <Link to="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span>View Dashboard & Analytics</span> 📊
          </Link>
        </div>
      </div>
    </div>
  );
}
