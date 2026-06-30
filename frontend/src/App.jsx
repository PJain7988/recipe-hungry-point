import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Example of a protected route */}
          <Route 
            path="/create-recipe" 
            element={
              <ProtectedRoute>
                <div className="text-center py-20 text-2xl font-bold">Create Recipe Page (Protected)</div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
