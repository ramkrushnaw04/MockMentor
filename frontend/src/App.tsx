
import IntroPage from './pages/IntroPage'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InterviewRoom from './pages/InterviewRoom';
import InterviewSetup from './pages/interviewSetup';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/interview-room" element={
                // <ProtectedRoute >
                //     <Home />
                // </ProtectedRoute>
                <InterviewRoom/>
            } />
            <Route path="/interview-setup" element={
                // <ProtectedRoute >
                //     <Home />
                // </ProtectedRoute>
                <InterviewSetup/>
            } />
            <Route path="*" element={<IntroPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
