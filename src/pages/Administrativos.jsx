import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "../firebaseConfig/firebase"
import { showSuccessAlert, showErrorAlert } from "../utils/swalUtils"

const Administrativos = () => {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "worker" })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"))
        setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        showErrorAlert("Error", `No se pudieron cargar los usuarios: ${error.message}`)
      }
    }
    fetchUsers()
  }, [])

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value })
  }

  const addUser = async (e) => {
    e.preventDefault()
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)

      // Add user to Firestore
      const userDocRef = await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        email: newUser.email,
        role: newUser.role,
      })

      showSuccessAlert("Éxito", "Usuario agregado correctamente")
      setNewUser({ email: "", password: "", role: "worker" })

      // Update local state
      setUsers([
        ...users,
        { id: userDocRef.id, uid: userCredential.user.uid, email: newUser.email, role: newUser.role },
      ])
    } catch (error) {
      showErrorAlert("Error", `No se pudo crear el usuario: ${error.message}`)
    }
  }

  const updateUserRole = async (id, newRole) => {
    try {
      await updateDoc(doc(db, "users", id), { role: newRole })
      setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)))
      showSuccessAlert("Éxito", "Rol de usuario actualizado correctamente")
    } catch (error) {
      showErrorAlert("Error", `No se pudo actualizar el rol del usuario: ${error.message}`)
    }
  }

  return (
    <div>
      <h2 className="mb-4" style={{ color: "var(--primary)" }}>
        Gestión de Usuarios
      </h2>
      <form onSubmit={addUser} className="mb-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Contraseña"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <select className="form-control" name="role" value={newUser.role} onChange={handleInputChange}>
              <option value="worker">Trabajador</option>
              <option value="secretary">Secretaria</option>
              <option value="engineer">Ingeniero</option>
              <option value="accountant">Contador</option>
              <option value="manager">Gerente</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Usuario
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="worker">Trabajador</option>
                  <option value="secretary">Secretaria</option>
                  <option value="engineer">Ingeniero</option>
                  <option value="accountant">Contador</option>
                  <option value="manager">Gerente</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Administrativos