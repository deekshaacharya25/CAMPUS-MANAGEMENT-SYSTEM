//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js'
function App() {
  return (
<div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage/>}></Route>
        <Route path="/loginpage" element={<LoginPage/>}></Route>
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
