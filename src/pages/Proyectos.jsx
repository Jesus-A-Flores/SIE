import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from "../utils/swalUtils"

const Proyectos = () => {
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    status: "En progreso",
    type: "Instalación eléctrica domiciliaria",
    assignedEmployees: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, "proyectos"))
        setProjects(projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        const employeesSnapshot = await getDocs(collection(db, "empleados"))
        setEmployees(employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        showErrorAlert("Error", `No se pudieron cargar los datos: ${error.message}`)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    if (e.target.name === "assignedEmployees") {
      const selectedEmployees = Array.from(e.target.selectedOptions, (option) => option.value)
      setNewProject({ ...newProject, assignedEmployees: selectedEmployees })
    } else {
      setNewProject({ ...newProject, [e.target.name]: e.target.value })
    }
  }

  const addProject = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "proyectos"), newProject)
      showSuccessAlert("Éxito", "Proyecto agregado correctamente")
      setNewProject({
        name: "",
        client: "",
        status: "En progreso",
        type: "Instalación eléctrica domiciliaria",
        assignedEmployees: [],
      })
      const querySnapshot = await getDocs(collection(db, "proyectos"))
      setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      showErrorAlert("Error", `No se pudo agregar el proyecto: ${error.message}`)
    }
  }

  const deleteProject = async (id) => {
    const result = await showConfirmDialog("¿Estás seguro?", "No podrás revertir esto!", "Sí, eliminar")
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "proyectos", id))
        showSuccessAlert("Eliminado", "El proyecto ha sido eliminado")
        setProjects(projects.filter((project) => project.id !== id))
      } catch (error) {
        showErrorAlert("Error", `No se pudo eliminar el proyecto: ${error.message}`)
      }
    }
  }

  const updateProject = async (id, field, value) => {
    try {
      await updateDoc(doc(db, "proyectos", id), { [field]: value })
      showSuccessAlert("Actualizado", "Proyecto actualizado correctamente")
      setProjects(projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
    } catch (error) {
      showErrorAlert("Error", `No se pudo actualizar el proyecto: ${error.message}`)
    }
  }

  return (
    <div>
      <h2>Gestión de Proyectos</h2>
      <form onSubmit={addProject} className="mb-4">
        <div className="row">
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Nombre del Proyecto"
              value={newProject.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="client"
              placeholder="Cliente"
              value={newProject.client}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <select className="form-control" name="status" value={newProject.status} onChange={handleInputChange}>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <select className="form-control" name="type" value={newProject.type} onChange={handleInputChange}>
              <option value="Instalación eléctrica domiciliaria">Instalación eléctrica domiciliaria</option>
              <option value="Instalación eléctrica industrial">Instalación eléctrica industrial</option>
              <option value="Armado de tableros de control">Armado de tableros de control</option>
              <option value="Cableado estructurado de LAN">Cableado estructurado de LAN</option>
              <option value="Instalación de cámaras de seguridad">Instalación de cámaras de seguridad</option>
              <option value="Instalación de fibra óptica">Instalación de fibra óptica</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <select
              multiple
              className="form-control"
              name="assignedEmployees"
              value={newProject.assignedEmployees}
              onChange={handleInputChange}
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Proyecto
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre del Proyecto</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Empleados Asignados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>
                <select
                  value={project.status}
                  onChange={(e) => updateProject(project.id, "status", e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
              <td>{project.type}</td>
              <td>
                {project.assignedEmployees.map((empId) => employees.find((emp) => emp.id === empId)?.name).join(", ")}
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteProject(project.id)}>
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

export default Proyectos