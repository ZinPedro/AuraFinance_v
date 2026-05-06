import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import LandingPage from './assets/pages/LandingPage'
import Login from './assets/pages/Login'
import DashBoard from './assets/pages/DashBoard'
import Objectives from './assets/pages/Objectives'
import Savings from './assets/pages/Savings'
import Transactions from './assets/pages/Transactions'
import UserSettings from './assets/pages/UserSettings'

import { Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/objectives" element={<Objectives />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/usersettings" element={<UserSettings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)