import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"

const Inventario = () => {
  const [inventory, setInventory] = useState([])
  const [newItem, setNewItem] = useState({ name: "", quantity: "", type: "Material" })

  useEffect(() => {
    const fetchInventory = async () => {
      const querySnapshot = await getDocs(collection(db, "inventory"))
      setInventory(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    fetchInventory()
  }, [])

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const addItem = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, "inventory"), newItem)
    setNewItem({ name: "", quantity: "", type: "Material" })
    // Refetch inventory
    const querySnapshot = await getDocs(collection(db, "inventory"))
    setInventory(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
  }

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id))
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const updateQuantity = async (id, newQuantity) => {
    await updateDoc(doc(db, "inventory", id), { quantity: newQuantity })
    setInventory(inventory.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  return (
    <div>
      <h2 style={{ color: "var(--primary)" }}>Gestión de Inventario</h2>
      <form onSubmit={addItem} className="mb-4">
        <div className="form-row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Nombre del Item"
              value={newItem.name}
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
              value={newItem.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <select className="form-control" name="type" value={newItem.type} onChange={handleInputChange}>
              <option value="Material">Material</option>
              <option value="Herramienta">Herramienta</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <button type="submit" className="btn btn-primary">
              Agregar Item
            </button>
          </div>
        </div>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  className="form-control form-control-sm"
                />
              </td>
              <td>{item.type}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>
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

export default Inventario