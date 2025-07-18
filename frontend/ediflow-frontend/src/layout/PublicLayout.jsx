import React from 'react';
import Navbar from '../components/landing/Navbar';

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </>
  );
};

export default PublicLayout;
