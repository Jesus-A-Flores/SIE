const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="container">
        <div className="text-center">
          <h5>Sistema de Gestión Eléctrica</h5>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <p>&copy; {currentYear} Sistema de Gestión Eléctrica. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer