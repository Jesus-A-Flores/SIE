import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from "../utils/swalUtils"

const ExpenseTracking = () => {
  const [expenses, setExpenses] = useState([])
  const [projects, setProjects] = useState([])
  const [newExpense, setNewExpense] = useState({
    projectId: "",
    description: "",
    amount: "",
    date: "",
    category: "Material",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesSnapshot = await getDocs(collection(db, "expenses"))
        setExpenses(expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

        const projectsSnapshot = await getDocs(collection(db, "projects"))
        setProjects(projectsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        showErrorAlert("Error", `No se pudieron cargar los datos: ${error.message}`)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value })
  }

  const addExpense = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "expenses"), newExpense)
      showSuccessAlert("Éxito", "Gasto registrado correctamente")
      setNewExpense({
        projectId: "",
        description: "",
        amount: "",
        date: "",
        category: "Material",
      })
      const expensesSnapshot = await getDocs(collection(db, "expenses"))
      setExpenses(expensesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      showErrorAlert("Error", `No se pudo registrar el gasto: ${error.message}`)
    }
  }

  const deleteExpense = async (id) => {
    const result = await showConfirmDialog("¿Estás seguro?", "No podrás revertir esto!", "Sí, eliminar")
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "expenses", id))
        showSuccessAlert("Eliminado", "El gasto ha sido eliminado")
        setExpenses(expenses.filter((expense) => expense.id !== id))
      } catch (error) {
        showErrorAlert("Error", `No se pudo eliminar el gasto: ${error.message}`)
      }
    }
  }

  const updateExpense = async (id, field, value) => {
    try {
      await updateDoc(doc(db, "expenses", id), { [field]: value })
      showSuccessAlert("Actualizado", "Gasto actualizado correctamente")
      setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
    } catch (error) {
      showErrorAlert("Error", `No se pudo actualizar el gasto: ${error.message}`)
    }
  }

  return (
    <div>
      <h2 style={{ color: "var(--primary)" }}>Seguimiento de Gastos</h2>
      <form onSubmit={addExpense} className="mb-4">
        <div className="row">
          <div className="col-md-2 mb-3">
            <select
              className="form-control"
              name="projectId"
              value={newExpense.projectId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar Proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="description"
              placeholder="Descripción"
              value={newExpense.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="number"
              className="form-control"
              name="amount"
              placeholder="Monto"
              value={newExpense.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="date"
              className="form-control"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <select className="form-control" name="category" value={newExpense.category} onChange={handleInputChange}>
              <option value="Material">Material</option>
              <option value="Mano de obra">Mano de obra</option>
              <option value="Transporte">Transporte</option>
              <option value="Alimentación">Alimentación</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Gasto
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const project = projects.find((p) => p.id === expense.projectId)
            return (
              <tr key={expense.id}>
                <td>{project ? project.name : "Proyecto no encontrado"}</td>
                <td>{expense.description}</td>
                <td>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, "amount", e.target.value)}
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={expense.date}
                    onChange={(e) => updateExpense(expense.id, "date", e.target.value)}
                    className="form-control form-control-sm"
                  />
                </td>
                <td>
                  <select
                    value={expense.category}
                    onChange={(e) => updateExpense(expense.id, "category", e.target.value)}
                    className="form-control form-control-sm"
                  >
                    <option value="Material">Material</option>
                    <option value="Mano de obra">Mano de obra</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteExpense(expense.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseTracking