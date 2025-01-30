import { useState, useEffect } from "react"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"

const AdvancedPayments = () => {
  const [employees, setEmployees] = useState([])
  const [advancedPayments, setAdvancedPayments] = useState([])
  const [newPayment, setNewPayment] = useState({ employeeId: "", amount: "", date: "" })

  useEffect(() => {
    const fetchData = async () => {
      const employeesSnapshot = await getDocs(collection(db, "employees"))
      setEmployees(employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

      const paymentsSnapshot = await getDocs(collection(db, "advancedPayments"))
      setAdvancedPayments(paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value })
  }

  const addPayment = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, "advancedPayments"), newPayment)
    setNewPayment({ employeeId: "", amount: "", date: "" })
    const paymentsSnapshot = await getDocs(collection(db, "advancedPayments"))
    setAdvancedPayments(paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  return (
    <div>
      <h2 style={{ color: "var(--primary)" }}>Gestión de Adelantos de Sueldo</h2>
      <form onSubmit={addPayment} className="mb-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <select
              className="form-control"
              name="employeeId"
              value={newPayment.employeeId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar Empleado</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="number"
              className="form-control"
              name="amount"
              placeholder="Monto"
              value={newPayment.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="date"
              className="form-control"
              name="date"
              value={newPayment.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <button type="submit" className="btn btn-primary">
              Registrar Adelanto
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Empleado</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {advancedPayments.map((payment) => {
            const employee = employees.find((e) => e.id === payment.employeeId)
            return (
              <tr key={payment.id}>
                <td>{employee ? employee.name : "Empleado no encontrado"}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AdvancedPayments