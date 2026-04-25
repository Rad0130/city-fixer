import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot/Chatbot';
import useAuth from '../Hooks/useAuth';

const RootLayout = () => {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
      {/* Only show chatbot for authenticated users */}
      {user && <Chatbot />}
    </>
  );
};

export default RootLayout;