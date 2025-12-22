import React from 'react';
import { createBrowserRouter } from "react-router";
import RootLayout from '../Layouts/RootLayout';
import Home from '../pages/Home/Home';
import AboutUs from '../pages/AboutUs/AboutUs';
import HowItWorks from '../pages/HowItWorks/HowItWorks';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import ForgetPassword from '../pages/Forget/ForgetPassword';
import PrivateRoute from './PrivateRoute';
import IssueDetails from '../pages/Issues/IssueDetails';
import AllIssues from '../pages/Issues/AllIssues';

const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayout,
    errorElement:<ErrorPage></ErrorPage>,
    children:[
      {
        index:true,
        Component:Home
      },
      {
        path:"/allissues",
        Component:AllIssues
      },
      {
        path:'/aboutus',
        Component:AboutUs
      },
      {
        path:'/howitworks',
        Component:HowItWorks
      },
      {
        path:'/details/:id',
        element:<PrivateRoute><IssueDetails></IssueDetails></PrivateRoute>
      }
    ]
  },
  {
    path:'/register',
    Component:Register
  },
  {
    path:'/login',
    Component:Login
  },
  {
    path:'/forget',
    Component:ForgetPassword
  }
]);

export default router;