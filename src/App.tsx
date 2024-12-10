import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainMenu } from './components/main_menu';
import { LoginPage } from './components/testLoginPage';
import "./App.css";
import "./index.css";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
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
    </div>
  );
}

export default App;