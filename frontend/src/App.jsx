import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import useUserStore from './store/userStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/home/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import Projects from './components/projects/Projects';
import ProjectDetails from './components/projects/ProjectDetails';
import Inventory from './components/inventory/Inventory';
import Financial from './components/financial/Financial';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRegister from './components/admin/AdminRegister';
import Profile from './components/user/Profile';
import Settings from './components/user/Settings';
import NotFound from './components/common/NotFound';
import AdminUsers from './components/admin/AdminUsers';
import EditUser from './components/admin/EditUser';
import AdminInventory from './components/admin/inventory/AdminInventory';
import AdminOrders from './components/admin/AdminOrders';
import AdminReports from './components/admin/AdminReports';
import AdminSettings from './components/admin/AdminSettings';
import AdminNotifications from './components/admin/AdminNotifications';
import AdminProjects from './components/admin/projects/AdminProjects';
import AdminPayments from './components/admin/payments/AdminPayments';
import Cart from './components/cart/Cart';
import Checkout from './components/cart/Checkout';
import Orders from './components/cart/Orders';
import AboutUs from './components/AboutUs'; // Added import
import ContactUs from './components/ContactUs'; // Added import
import ErrorBoundary from './components/ErrorBoundary';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box flex="1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/about" element={<AboutUs />} /> {/* Added About Us route */}
            <Route path="/contact" element={<ContactUs />} /> {/* Added Contact Us route */}

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/financial"
              element={
                <PrivateRoute>
                  <Financial />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={['admin']}>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/users/:id/edit" element={<EditUser />} />
                    <Route path="/register" element={<AdminRegister />} />
                    <Route path="/inventory" element={<AdminInventory />} />
                    <Route path="/orders" element={<AdminOrders />} />
                    <Route path="/reports" element={<AdminReports />} />
                    <Route path="/settings" element={<AdminSettings />} />
                    <Route path="/notifications" element={<AdminNotifications />} />
                    <Route path="/projects" element={<AdminProjects />} />
                    <Route path="/payments" element={<AdminPayments />} />
                  </Routes>
                </PrivateRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ErrorBoundary>
  );
};

export default App;