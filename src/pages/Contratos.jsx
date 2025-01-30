import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"

const Contratos = () => {
  const [contracts, setContracts] = useState([])
  const [newContract, setNewContract] = useState({
    clientName: "",
    projectType: "",
    startDate: "",
    endDate: "",
    value: "",
    status: "En progreso",
  })

  useEffect(() => {
    const fetchContracts = async () => {
      const querySnapshot = await getDocs(collection(db, "contracts"))
      setContracts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    fetchContracts()
  }, [])

  const handleInputChange = (e) => {
    setNewContract({ ...newContract, [e.target.name]: e.target.value })
  }

  const addContract = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, "contracts"), newContract)
    setNewContract({
      clientName: "",
      projectType: "",
      startDate: "",
      endDate: "",
      value: "",
      status: "En progreso",
    })
    const querySnapshot = await getDocs(collection(db, "contracts"))
    setContracts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  const updateContractStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "contracts", id), { status: newStatus })
    setContracts(contracts.map((contract) => (contract.id === id ? { ...contract, status: newStatus } : contract)))
  }

  return (
    <div>
      <h2 style={{ color: "var(--primary)" }}>Gestión de Contratos</h2>
      <form onSubmit={addContract} className="mb-4">
        <div className="row">
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="clientName"
              placeholder="Nombre del Cliente"
              value={newContract.clientName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="projectType"
              placeholder="Tipo de Proyecto"
              value={newContract.projectType}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={newContract.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="date"
              className="form-control"
              name="endDate"
              value={newContract.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="number"
              className="form-control"
              name="value"
              placeholder="Valor"
              value={newContract.value}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Contrato
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Tipo de Proyecto</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.id}>
              <td>{contract.clientName}</td>
              <td>{contract.projectType}</td>
              <td>{contract.startDate}</td>
              <td>{contract.endDate}</td>
              <td>{contract.value}</td>
              <td>{contract.status}</td>
              <td>
                <select
                  value={contract.status}
                  onChange={(e) => updateContractStatus(contract.id, e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Contratos