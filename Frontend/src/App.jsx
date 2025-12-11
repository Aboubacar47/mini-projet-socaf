import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MesArticles from './pages/MesArticles';
import MesCategories from './pages/MesCategories';
import AdminUsers from './pages/AdminUsers';
import { Bounce, ToastContainer } from 'react-toastify';

const App = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mes-articles" element={<MesArticles />} />
        <Route path="/mes-categories" element={<MesCategories />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </Router>
  );
};

export default App;
