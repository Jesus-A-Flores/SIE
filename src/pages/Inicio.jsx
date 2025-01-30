import { Link } from "react-router-dom"

const Inicio = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4 fw-bold text-center" style={{ color: "var(--primary)" }}>
        Bienvenido al Sistema de Gestión de Instalaciones Eléctricas
      </h1>
      <p className="lead fw-bold" style={{ color: "var(--highlight)" }}>Gestione empleados, proyectos, inventario y más desde un solo lugar.</p>
      <hr className="my-4" />
      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="text-center">
            <i className="bi bi-people"></i>
          </div>
          <Link to="/empleados" className="btn btn-primary btn-lg btn-block w-100">
            Empleados
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <div className="text-center">
            <i className="bi bi-journal-text"></i>
          </div>
          <Link to="/proyectos" className="btn btn-secondary btn-lg btn-block w-100">
            Proyectos
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <div className="text-center">
            <i className="bi bi-clipboard-data"></i>
          </div>
          <Link to="/inventario" className="btn btn-primary btn-lg btn-block w-100">
            Inventario
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <div className="text-center">
            <i className="bi bi-bar-chart"></i>
          </div>
          <Link to="/reportes" className="btn btn-secondary btn-lg btn-block w-100">
            Reportes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Inicio