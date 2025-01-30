import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">¡Ups! Algo salió mal.</h4>
          <p>
            Ha ocurrido un error inesperado. Por favor, intenta recargar la página o contacta al soporte técnico si el
            problema persiste.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary