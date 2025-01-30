import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from "../utils/swalUtils"

const ToolTracking = () => {
  const [tools, setTools] = useState([])
  const [newTool, setNewTool] = useState({
    name: "",
    quantity: "",
    status: "Disponible",
    assignedTo: "",
    lastMaintenance: "",
  })

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tools"))
        setTools(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      } catch (error) {
        showErrorAlert("Error", `No se pudieron cargar las herramientas: ${error.message}`)
      }
    }
    fetchTools()
  }, [])

  const handleInputChange = (e) => {
    setNewTool({ ...newTool, [e.target.name]: e.target.value })
  }

  const addTool = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "tools"), newTool)
      showSuccessAlert("Éxito", "Herramienta agregada correctamente")
      setNewTool({
        name: "",
        quantity: "",
        status: "Disponible",
        assignedTo: "",
        lastMaintenance: "",
      })
      const querySnapshot = await getDocs(collection(db, "tools"))
      setTools(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      showErrorAlert("Error", `No se pudo agregar la herramienta: ${error.message}`)
    }
  }

  const deleteTool = async (id) => {
    const result = await showConfirmDialog("¿Estás seguro?", "No podrás revertir esto!", "Sí, eliminar")
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "tools", id))
        showSuccessAlert("Eliminada", "La herramienta ha sido eliminada")
        setTools(tools.filter((tool) => tool.id !== id))
      } catch (error) {
        showErrorAlert("Error", `No se pudo eliminar la herramienta: ${error.message}`)
      }
    }
  }

  const updateTool = async (id, field, value) => {
    try {
      await updateDoc(doc(db, "tools", id), { [field]: value })
      showSuccessAlert("Actualizada", "Herramienta actualizada correctamente")
      setTools(tools.map((tool) => (tool.id === id ? { ...tool, [field]: value } : tool)))
    } catch (error) {
      showErrorAlert("Error", `No se pudo actualizar la herramienta: ${error.message}`)
    }
  }

  return (
    <div>
      <h2>Seguimiento de Herramientas</h2>
      <form onSubmit={addTool} className="mb-4">
        <div className="row">
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Nombre de la Herramienta"
              value={newTool.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="number"
              className="form-control"
              name="quantity"
              placeholder="Cantidad"
              value={newTool.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <select className="form-control" name="status" value={newTool.status} onChange={handleInputChange}>
              <option value="Disponible">Disponible</option>
              <option value="En uso">En uso</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="Dañada">Dañada</option>
            </select>
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="text"
              className="form-control"
              name="assignedTo"
              placeholder="Asignada a"
              value={newTool.assignedTo}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <input
              type="date"
              className="form-control"
              name="lastMaintenance"
              value={newTool.lastMaintenance}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Herramienta
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Asignada a</th>
            <th>Último Mantenimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.name}</td>
              <td>
                <input
                  type="number"
                  value={tool.quantity}
                  onChange={(e) => updateTool(tool.id, "quantity", e.target.value)}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <select
                  value={tool.status}
                  onChange={(e) => updateTool(tool.id, "status", e.target.value)}
                  className="form-control form-control-sm"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En uso">En uso</option>
                  <option value="En mantenimiento">En mantenimiento</option>
                  <option value="Dañada">Dañada</option>
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={tool.assignedTo}
                  onChange={(e) => updateTool(tool.id, "assignedTo", e.target.value)}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={tool.lastMaintenance}
                  onChange={(e) => updateTool(tool.id, "lastMaintenance", e.target.value)}
                  className="form-control form-control-sm"
                />
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteTool(tool.id)}>
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

export default ToolTracking