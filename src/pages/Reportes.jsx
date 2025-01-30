import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"

const Reportes = () => {
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const employeesSnapshot = await getDocs(collection(db, "employees"))
      setEmployees(employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

      const projectsSnapshot = await getDocs(collection(db, "projects"))
      setProjects(projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

      const inventorySnapshot = await getDocs(collection(db, "inventory"))
      setInventory(inventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    fetchData()
  }, [])

  return (
    <div>
      <h2>Reportes</h2>

      <h3>Resumen de Empleados</h3>
      <p>Total de empleados: {employees.length}</p>
      <p>
        Salario promedio: ${(employees.reduce((sum, emp) => sum + Number(emp.salary), 0) / employees.length).toFixed(2)}
      </p>

      <h3>Resumen de Proyectos</h3>
      <p>Total de proyectos: {projects.length}</p>
      <p>Proyectos en progreso: {projects.filter((p) => p.status === "En progreso").length}</p>
      <p>Proyectos completados: {projects.filter((p) => p.status === "Completado").length}</p>

      <h3>Resumen de Inventario</h3>
      <p>Total de items: {inventory.length}</p>
      <p>Materiales: {inventory.filter((i) => i.type === "Material").length}</p>
      <p>Herramientas: {inventory.filter((i) => i.type === "Herramienta").length}</p>
    </div>
  )
}

export default Reportes