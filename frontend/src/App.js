import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import PostProject from './pages/PostProject';
import ProjectDetail from './pages/ProjectDetail';
import Shop from './pages/Shop';
import Services from './pages/Services';
import Freelancers from './pages/Freelancers';
import Membership from './pages/Membership';
import Messages from './pages/Messages';
import ProductDetail from './pages/ProductDetail';
import ServiceDetail from './pages/ServiceDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Search from './pages/Search';
import CreateService from './pages/CreateService';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMemberships from './pages/admin/AdminMemberships';
import AdminCommissions from './pages/admin/AdminCommissions';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminServices from './pages/admin/AdminServices';
import AdminProjects from './pages/admin/AdminProjects';

// Styles
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <SocketProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route
                path="/post-project"
                element={
                  <PrivateRoute>
                    <PostProject />
                  </PrivateRoute>
                }
              />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/:id" element={<ServiceDetail />} />
              <Route
                path="/create-service"
                element={
                  <PrivateRoute>
                    <CreateService />
                  </PrivateRoute>
                }
              />
              <Route path="/freelancers" element={<Freelancers />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order/:orderId"
                element={
                  <PrivateRoute>
                    <OrderTracking />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                }
              />
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              >
                <Route path="memberships" element={<AdminMemberships />} />
                <Route path="commissions" element={<AdminCommissions />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="projects" element={<AdminProjects />} />
              </Route>
            </Routes>
          </main>
          <Routes>
            <Route path="/dashboard" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
      </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
