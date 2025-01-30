import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from "../utils/swalUtils"

const Empleados = () => {
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    salary: "",
    type: "permanent",
    transportSubsidy: "5",
  })

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "employees"))
        setEmployees(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        showErrorAlert("Error", `No se pudieron cargar los employees: ${error.message}`)
      }
    }
    fetchEmployees()
  }, [])

  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value })
  }

  const addEmployee = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "employees"), newEmployee)
      showSuccessAlert("Éxito", "Empleado agregado correctamente")
      setNewEmployee({
        name: "",
        position: "",
        salary: "",
        type: "permanent",
        transportSubsidy: "5",
      })
      const querySnapshot = await getDocs(collection(db, "employees"))
      setEmployees(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      showErrorAlert("Error", `No se pudo agregar el empleado: ${error.message}`)
    }
  }

  const deleteEmployee = async (id) => {
    const result = await showConfirmDialog("¿Estás seguro?", "No podrás revertir esto!", "Sí, eliminar")
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "employees", id))
        showSuccessAlert("Eliminado", "El empleado ha sido eliminado")
        setEmployees(employees.filter((employee) => employee.id !== id))
      } catch (error) {
        showErrorAlert("Error", `No se pudo eliminar el empleado: ${error.message}`)
      }
    }
  }

  const updateEmployee = async (id, field, value) => {
    try {
      await updateDoc(doc(db, "employees", id), { [field]: value })
      showSuccessAlert("Actualizado", "Empleado actualizado correctamente")
      setEmployees(employees.map((employee) => (employee.id === id ? { ...employee, [field]: value } : employee)))
    } catch (error) {
      showErrorAlert("Error", `No se pudo actualizar el empleado: ${error.message}`)
    }
  }

  return (
    <div>
      <h2 style={{ color: "var(--primary)" }}>Gestión de Empleados</h2>
      <form onSubmit={addEmployee} className="mb-4">
        <div className="row">
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Nombre"
              value={newEmployee.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="position"
              placeholder="Cargo"
              value={newEmployee.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="number"
              className="form-control"
              name="salary"
              placeholder="Salario"
              value={newEmployee.salary}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <select className="form-control" name="type" value={newEmployee.type} onChange={handleInputChange}>
              <option value="permanent">Permanente</option>
              <option value="temporary">Temporal</option>
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <select
              className="form-control"
              name="transportSubsidy"
              value={newEmployee.transportSubsidy}
              onChange={handleInputChange}
            >
              <option value="5">Cercano (5 Bs)</option>
              <option value="10">Medio (10 Bs)</option>
              <option value="20">Lejano (20 Bs)</option>
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Empleado
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Salario</th>
            <th>Tipo</th>
            <th>Subsidio de Transporte</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>
                <input
                  type="number"
                  value={employee.salary}
                  onChange={(e) => updateEmployee(employee.id, "salary", e.target.value)}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <select
                  value={employee.type}
                  onChange={(e) => updateEmployee(employee.id, "type", e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="permanent">Permanente</option>
                  <option value="temporary">Temporal</option>
                </select>
              </td>
              <td>
                <select
                  value={employee.transportSubsidy}
                  onChange={(e) => updateEmployee(employee.id, "transportSubsidy", e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="5">Cercano (5 Bs)</option>
                  <option value="10">Medio (10 Bs)</option>
                  <option value="20">Lejano (20 Bs)</option>
                </select>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(employee.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Empleados