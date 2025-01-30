import Swal from 'sweetalert2'

export const showSuccessAlert = (title, text) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 2000,
    showConfirmButton: false
  })
}

export const showErrorAlert = (title, text) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text
  })
}

export const showConfirmDialog = (title, text, confirmButtonText) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Cancelar'
  })
}
