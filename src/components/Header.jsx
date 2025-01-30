import { Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebaseConfig/firebase"
import { showSuccessAlert, showErrorAlert } from "../utils/swalUtils"

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      showSuccessAlert("Éxito", "Has cerrado sesión correctamente")
      navigate("/login")
    } catch (error) {
      showErrorAlert("Error", `Error al cerrar sesión: ${error.message}`)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        {/*Agregar imagen*/}
        <Link to="/" className="">
          <img src="elekid.gif" alt="Logo" />
        </Link>
        <Link className="navbar-brand fw-bold fs-2 fst-italic" to="/">
          ElecSys
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/empleados">
                Empleados
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/proyectos">
                Proyectos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/inventario">
                Inventario
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contratos">
                Contratos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pagoadelantado">
                Adelantos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tool-tracking">
                Herramientas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/expense-tracking">
                Gastos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reportes">
                Reportes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/administrativos">
                Usuarios
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Header