
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import Contacts from './pages/Contacts'
import Customer from './pages/Customer'

function App() {

  return (
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<SignIn />} />
       <Route path="/home" element={<Home />} />
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/contacts/:id" element={<Customer />} />
        <Route path="*" element={<div>404 Not Found</div>} />
     </Routes>
   </BrowserRouter>
  )
}

export default App
