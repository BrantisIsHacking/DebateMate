import { Routes, Route } from "react-router-dom"
import DashboardPage from "./pages/Dashboard"
import ArenaPage from "./pages/Arena"
import ProgressPage from "./pages/Progress"
import FeedbackPage from "./pages/Feedback"

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/arena" element={<ArenaPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/feedback/:debateId" element={<FeedbackPage />} />
    </Routes>
  )
}

export default App
