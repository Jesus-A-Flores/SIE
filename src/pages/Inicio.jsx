import { Link } from "react-router-dom"

const Inicio = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4" style={{ color: "var(--primary)" }}>
        Bienvenido al Sistema de Gestión de Instalaciones Eléctricas
      </h1>
      <p className="lead">Gestione empleados, proyectos, inventario y más desde un solo lugar.</p>
      <hr className="my-4" />
      <div className="row">
        <div className="col-md-3 mb-3">
          <Link to="/empleados" className="btn btn-primary btn-lg btn-block w-100">
            Empleados
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/projectos" className="btn btn-secondary btn-lg btn-block w-100">
            Proyectos
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/inventario" className="btn btn-primary btn-lg btn-block w-100">
            Inventario
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/reportes" className="btn btn-secondary btn-lg btn-block w-100">
            Reportes
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Inicio