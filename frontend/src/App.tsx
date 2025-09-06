
import IntroPage from './pages/IntroPage'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Home from './pages/Home';

function App() {

     
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={
                // <ProtectedRoute >
                //     <Home />
                // </ProtectedRoute>
                <Home/>
            } />
            <Route path="*" element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
