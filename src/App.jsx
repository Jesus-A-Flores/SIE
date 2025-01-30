import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebaseConfig/firebase"
import Navbar from "./components/Header"
import Home from "./pages/Inicio"
import Employees from "./pages/Empleados"
import Projects from "./pages/Proyectos"
import Inventory from "./pages/Inventario"
import Reports from "./pages/Reportes"
import Login from "./pages/Login"
import Contracts from "./pages/Contratos"
import AdvancedPayments from "./pages/PagoAdelantado"
import UserManagement from "./pages/Administrativos"

import ToolTracking from "./pages/ToolTracking"
import ExpenseTracking from "./pages/ExpenseTracking"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {user && <Navbar />}
      <div className="container mt-4">
        <ErrorBoundary>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/empleados" element={user ? <Employees /> : <Navigate to="/login" />} />
            <Route path="/proyectos" element={user ? <Projects /> : <Navigate to="/login" />} />
            <Route path="/inventario" element={user ? <Inventory /> : <Navigate to="/login" />} />
            <Route path="/reportes" element={user ? <Reports /> : <Navigate to="/login" />} />
            <Route path="/contratos" element={user ? <Contracts /> : <Navigate to="/login" />} />
            <Route path="/pagoadelantado" element={user ? <AdvancedPayments /> : <Navigate to="/login" />} />
            <Route path="/administrativos" element={user ? <UserManagement /> : <Navigate to="/login" />} />
            <Route path="/tool-tracking" element={user ? <ToolTracking /> : <Navigate to="/login" />} />
            <Route path="/expense-tracking" element={user ? <ExpenseTracking /> : <Navigate to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App