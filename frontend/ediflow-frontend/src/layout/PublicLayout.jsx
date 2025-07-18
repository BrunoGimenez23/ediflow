import React from 'react';
import Navbar from '../components/landing/Navbar';
import { Outlet } from 'react-router-dom';

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto"><Outlet /></main>
    </>
  );
};

export default PublicLayout;
