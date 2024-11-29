import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { MainMenu } from './components/main_menu';
import "./App.css";
import "./index.css";
import { LoginPage } from './components/testLoginPage';

// Auth guard component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userId = sessionStorage.getItem('userId');
  
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/main" 
          element={
            <ProtectedRoute>
              <MainMenu />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;