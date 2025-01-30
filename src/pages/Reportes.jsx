import { useState, useEffect } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { showErrorAlert } from "../utils/swalUtils"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { startOfMonth, endOfMonth, format } from "date-fns"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const Reports = () => {
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [expenses, setExpenses] = useState([])
  const [tools, setTools] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startDate = startOfMonth(new Date(selectedMonth))
        const endDate = endOfMonth(new Date(selectedMonth))

        const employeesSnapshot = await getDocs(collection(db, "employees"))
        setEmployees(employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        const projectsQuery = query(
          collection(db, "projects"),
          where("startDate", ">=", startDate.toISOString()),
          where("startDate", "<=", endDate.toISOString()),
        )
        const projectsSnapshot = await getDocs(projectsQuery)
        setProjects(projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        const expensesQuery = query(
          collection(db, "expenses"),
          where("date", ">=", startDate.toISOString()),
          where("date", "<=", endDate.toISOString()),
        )
        const expensesSnapshot = await getDocs(expensesQuery)
        setExpenses(expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        const toolsSnapshot = await getDocs(collection(db, "tools"))
        setTools(toolsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        showErrorAlert("Error", `No se pudieron cargar los datos para los reportes: ${error.message}`)
      }
    }
    fetchData()
  }, [selectedMonth])

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + Number(expense.amount), 0)
  }

  const calculateExpensesByCategory = () => {
    return expenses.reduce((categories, expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + Number(expense.amount)
      return categories
    }, {})
  }

  const calculateProjectProfitability = () => {
    return projects.map((project) => {
      const projectExpenses = expenses.filter((expense) => expense.projectId === project.id)
      const totalExpenses = projectExpenses.reduce((total, expense) => total + Number(expense.amount), 0)
      const profit = Number(project.budget) - totalExpenses
      return {
        name: project.name,
        budget: Number(project.budget),
        expenses: totalExpenses,
        profit: profit,
        profitMargin: ((profit / Number(project.budget)) * 100).toFixed(2),
      }
    })
  }

  const expensesByCategoryData = {
    labels: Object.keys(calculateExpensesByCategory()),
    datasets: [
      {
        data: Object.values(calculateExpensesByCategory()),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  }
  return (
    <div>
      <h2 className="mb-4" style={{ color: "var(--primary)" }}>
        Reportes
      </h2>

      <div className="mb-4">
        <label htmlFor="month-select" className="form-label fw-bold " style={{ color: "var(--highlight)" }}>
          Seleccionar mes:
        </label>
        <input
          type="month"
          id="month-select"
          className="form-control"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen de Empleados</h5>
              <p>Total de empleados: {employees.length}</p>
              <p>
                Salario promedio: $
                {(employees.reduce((sum, emp) => sum + Number(emp.salary), 0) / employees.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen de Proyectos</h5>
              <p>Total de proyectos: {projects.length}</p>
              <p>Proyectos en progreso: {projects.filter((p) => p.status === "En progreso").length}</p>
              <p>Proyectos completados: {projects.filter((p) => p.status === "Completado").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumen de Gastos</h5>
              <p>Total de gastos: ${calculateTotalExpenses().toFixed(2)}</p>
              <h6>Gastos por Categoría:</h6>
              <Pie data={expensesByCategoryData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Estado de Herramientas</h5>
              <p>Total de herramientas: {tools.length}</p>
              <p>Herramientas disponibles: {tools.filter((t) => t.status === "Disponible").length}</p>
              <p>Herramientas en uso: {tools.filter((t) => t.status === "En uso").length}</p>
              <p>Herramientas en mantenimiento: {tools.filter((t) => t.status === "En mantenimiento").length}</p>
              <p>Herramientas dañadas: {tools.filter((t) => t.status === "Dañada").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Detalles de Proyectos</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Presupuesto</th>
                <th>Gastos</th>
                <th>Ganancia</th>
                <th>Margen de Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {calculateProjectProfitability().map((project) => (
                <tr key={project.name}>
                  <td>{project.name}</td>
                  <td>${project.budget.toFixed(2)}</td>
                  <td>${project.expenses.toFixed(2)}</td>
                  <td>${project.profit.toFixed(2)}</td>
                  <td>{project.profitMargin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports