import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../chartSetup";

// Register ArcElement for Doughnut if not already in chartSetup
import { Chart as ChartJS, ArcElement } from "chart.js";
ChartJS.register(ArcElement);

export default function Dashboard() {
  const [stats, setStats] = useState({
    todo: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/tasks");
        const data = res.data;
        const counts = { todo: 0, inProgress: 0, completed: 0, total: data.length };

        data.forEach((task) => {
          if (task.status === "Todo") counts.todo++;
          if (task.status === "In Progress") counts.inProgress++;
          if (task.status === "Completed") counts.completed++;
        });

        setStats(counts);
      } catch (err) {
        // Handle error silently or redirect
      }
    };

    loadStats();
  }, [navigate]);

  const chartData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ["#facc15", "#38bdf8", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutData = {
    labels: ["Todo", "In Progress", "Completed"],
    datasets: [
      {
        data: [stats.todo, stats.inProgress, stats.completed],
        backgroundColor: ["#facc15", "#38bdf8", "#22c55e"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="page">
      <div className="card" style={{ maxWidth: "900px", width: "95%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "20px" }}>
          <h2 style={{ margin: 0 }}>Analytics Dashboard</h2>
          <button onClick={() => navigate("/tasks")} style={{ width: "auto" }}>Back to Tasks</button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: "40px" }}>
          <div className="stat-card">
            <span className="stat-number" style={{ color: "#f8fafc" }}>{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: "#facc15" }}>{stats.todo}</span>
            <span className="stat-label">Todo</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: "#38bdf8" }}>{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card">
            <span className="stat-number" style={{ color: "#22c55e" }}>{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <div style={{ background: "#334155", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "1.1rem", color: "#94a3b8", fontWeight: 600 }}>Task Distribution</h3>
            <div style={{ height: "220px", display: "flex", justifyContent: "center" }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', padding: 20 } } } }} />
            </div>
          </div>
          <div style={{ background: "#334155", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: "20px", textAlign: "center", fontSize: "1.1rem", color: "#94a3b8", fontWeight: 600 }}>Completion Status</h3>
            <div style={{ height: "220px" }}>
              <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#cbd5e1' }, grid: { color: '#475569' } }, x: { ticks: { color: '#cbd5e1' }, grid: { display: false } } } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
