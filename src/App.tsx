// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import Header from './components/common/Header';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Customer pages
import CustomerList from './pages/customers/CustomerList';
import AddCustomer from './pages/customers/AddCustomer';
import EditCustomer from './pages/customers/EditCustomer';
import CustomerDetails from './pages/customers/CustomerDetails';

// Product pages
import ProductList from './pages/products/ProductList';
import AddProduct from './pages/products/AddProduct';
import EditProduct from './pages/products/EditProduct';
import ProductDetails from './pages/products/ProductDetails';

// Admin pages
import AdminList from './pages/admin/AdminList';
import AddAdmin from './pages/admin/AddAdmin';
import RegisterPage from './pages/auth/RegisterPage';

// Authorized Person pages
import AuthorizedPersonDetails from './pages/AuthorizedPerson/AuthorizedPersonDetails';
import EditAuthorizedPerson from './pages/AuthorizedPerson/EditAuthorizedPerson';
import AuthorizedPersonList from './pages/AuthorizedPerson/AuthorizedPersonList';
import AddAuthorizedPerson from './pages/AuthorizedPerson/AddAuthorizedPerson';

// Maintenance pages
import MaintenanceList from './pages/maintenances/MaintenanceList';
import AddMaintenance from './pages/maintenances/AddMaintenance';
import EditMaintenance from './pages/maintenances/EditMaintenance';
import MaintenanceDetail from './pages/maintenances/MaintenanceDetail';

import { Box } from '@mui/material';


const App: React.FC = () => {
  const { token, isSuperAdmin } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Header />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: isAuthenticated ? '64px' : 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />

          {/* Customer pages */}
          <Route
            path="/customers"
            element={isAuthenticated ? <CustomerList /> : <Navigate to="/login" />}
          />
          <Route
            path="/customers/add"
            element={isAuthenticated ? <AddCustomer /> : <Navigate to="/login" />}
          />
          <Route
            path="/customers/edit/:id"
            element={isAuthenticated ? <EditCustomer /> : <Navigate to="/login" />}
          />
          <Route
            path="/customers/:id"
            element={isAuthenticated ? <CustomerDetails /> : <Navigate to="/login" />}
          />

          {/* Product pages */}
          <Route
            path="/products"
            element={isAuthenticated ? <ProductList /> : <Navigate to="/login" />}
          />
          <Route
            path="/products/add"
            element={isAuthenticated ? <AddProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/products/edit/:id"
            element={isAuthenticated ? <EditProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/products/details/:id"
            element={isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />}
          />

          {/* Authorized Persons pages */}
          <Route
            path="/authorized-persons"
            element={isAuthenticated ? <AuthorizedPersonList /> : <Navigate to="/login" />}
          />
          <Route
            path="/authorized-persons/add"
            element={isAuthenticated ? <AddAuthorizedPerson /> : <Navigate to="/login" />}
          />
          <Route
            path="/authorized-persons/edit/:id"
            element={isAuthenticated ? <EditAuthorizedPerson /> : <Navigate to="/login" />}
          />
          <Route
            path="/authorized-persons/details/:id"
            element={isAuthenticated ? <AuthorizedPersonDetails /> : <Navigate to="/login" />}
          />

          {/* Maintenance pages */}
          <Route
            path="/maintenances"
            element={isAuthenticated ? <MaintenanceList /> : <Navigate to="/login" />}
          />
          <Route
            path="/maintenances/add"
            element={isAuthenticated ? <AddMaintenance /> : <Navigate to="/login" />}
          />
          <Route
            path="/maintenances/edit/:id"
            element={isAuthenticated ? <EditMaintenance /> : <Navigate to="/login" />}
          />
          <Route
            path="/maintenances/:id"
            element={isAuthenticated ? <MaintenanceDetail /> : <Navigate to="/login" />}
          />

          {/* Admin pages */}
          <Route
            path="/admins"
            element={isAuthenticated ? <AdminList /> : <Navigate to="/login" />}
          />
          <Route
            path="/admins/add"
            element={
              isAuthenticated
                ? isSuperAdmin
                  ? <AddAdmin />
                  : <Navigate to="/admins" />
                : <Navigate to="/login" />
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
