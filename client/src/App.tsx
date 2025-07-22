
import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Contacts from "./pages/Contacts";
import Dashboard from "./pages/Dashboard";
import AIOverview from "./pages/AIOverview";
import ProtectedRoute from "./components/ProtectedRoute";
import Customer from './pages/Customer';

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<SignIn />} />
        <Route path="signin" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="home" element={<Home />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="ai-overview" element={<AIOverview/>} />
            <Route path="contacts/:id" element={<Customer />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
