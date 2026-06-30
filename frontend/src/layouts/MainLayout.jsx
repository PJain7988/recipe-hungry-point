import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-20 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Recipe Hungry Point. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
