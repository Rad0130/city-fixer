import React from 'react';
import { createBrowserRouter } from 'react-router';

// Layouts
import RootLayout from '../Layouts/RootLayout';
import CitizenDashboardLayout from '../Layouts/CitizenDashboardLayout';
import AdminDashboardLayout from '../Layouts/AdminDashboardLayout';
import StaffDashboardLayout from '../Layouts/StaffDashboardLayout';

// Public pages
import Home from '../pages/Home/Home';
import AboutUs from '../pages/AboutUs/AboutUs';
import HowItWorks from '../pages/HowItWorks/HowItWorks';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import ForgetPassword from '../pages/Forget/ForgetPassword';
import AllIssues from '../pages/Issues/AllIssues';

// Private issue pages
import IssueDetails from '../pages/Issues/IssueDetails';
import ReportIssue from '../pages/Issues/ReportIssue';
import EditIssue from '../pages/Issues/EditIssue';

// Route guards
import PrivateRoute from './PrivateRoute';
import { AdminRoute, StaffRoute } from './RoleRoutes';

// Citizen dashboard
import CitizenOverview from '../pages/Dashboard/Citizen/CitizenOverview';
import MyIssues from '../pages/Dashboard/Citizen/MyIssues';
import MyPayments from '../pages/Dashboard/Citizen/CitizenMyPayments';
import CitizenProfile from '../pages/Dashboard/Citizen/CitizenProfile';

// Admin dashboard
import AdminAllIssues from '../pages/Dashboard/Admin/AdminAllIssues';
import AdminOverview from '../pages/Dashboard/Admin/AdminOverview';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageStaff from '../pages/Dashboard/Admin/ManageStaff';
import AdminPayments from '../pages/Dashboard/Admin/AdminPayments';
import AdminProfile from '../pages/Dashboard/Admin/AdminProfile';
import AdminStaffRequests from '../pages/Dashboard/Admin/AdminStaffRequests'; // NEW

// Staff dashboard
import StaffOverview from '../pages/Dashboard/Staff/StaffOverview';
import AssignedIssues from '../pages/Dashboard/Staff/AssignedIssues';
import StaffProfile from '../pages/Dashboard/Staff/StaffProfile';

const router = createBrowserRouter([
  // ── PUBLIC ROUTES ─────────────────────────────────────────────────────────
  {
    path: '/',
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
      { path: '/allissues', Component: AllIssues },
      { path: '/aboutus', Component: AboutUs },
      { path: '/howitworks', Component: HowItWorks },
      // IssueDetails is private but the API call inside uses public axios (no logout risk)
      { path: '/details/:id', element: <PrivateRoute><IssueDetails /></PrivateRoute> },
      { path: '/reportIssue', element: <PrivateRoute><ReportIssue /></PrivateRoute> },
      { path: 'editissue/:id', element: <PrivateRoute><EditIssue /></PrivateRoute> },
    ],
  },

  // ── AUTH ROUTES ────────────────────────────────────────────────────────────
  { path: '/register', Component: Register },
  { path: '/login', Component: Login },
  { path: '/forget', Component: ForgetPassword },

  // ── CITIZEN DASHBOARD ─────────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: <PrivateRoute><CitizenDashboardLayout /></PrivateRoute>,
    children: [
      { index: true, Component: CitizenOverview },
      { path: 'myissues', Component: MyIssues },
      { path: 'mypayments', Component: MyPayments },
      { path: 'profile', Component: CitizenProfile },
    ],
  },

  // ── ADMIN DASHBOARD ───────────────────────────────────────────────────────
  {
    path: '/admin',
    element: <AdminRoute><AdminDashboardLayout /></AdminRoute>,
    children: [
      { index: true, Component: AdminOverview },
      { path: 'issues', Component: AdminAllIssues },
      { path: 'users', Component: ManageUsers },
      { path: 'staff', Component: ManageStaff },
      { path: 'staff-requests', Component: AdminStaffRequests }, // NEW
      { path: 'payments', Component: AdminPayments },
      { path: 'profile', Component: AdminProfile },
    ],
  },

  // ── STAFF DASHBOARD ───────────────────────────────────────────────────────
  {
    path: '/staff',
    element: <StaffRoute><StaffDashboardLayout /></StaffRoute>,
    children: [
      { index: true, Component: StaffOverview },
      { path: 'issues', Component: AssignedIssues },
      { path: 'profile', Component: StaffProfile },
    ],
  },
]);

export default router;