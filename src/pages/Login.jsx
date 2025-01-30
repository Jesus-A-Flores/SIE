import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebaseConfig/firebase"
import { useNavigate } from "react-router-dom"
import { showSuccessAlert, showErrorAlert } from "../utils/swalUtils"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      showSuccessAlert("Éxito", "Has iniciado sesión correctamente")
      navigate("/")
    } catch (error) {
      showErrorAlert("Error", `No se pudo iniciar sesión: ${error.message}`)
    }
  }

  return (
    <div className="row justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4" style={{ color: "var(--primary)" }}>
              Iniciar Sesión
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login