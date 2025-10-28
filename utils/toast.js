import Toastify from 'toastify-js';

export function showToast(message, options = {}) {
  const { type = 'info' } = options;

  let backgroundColor;
  switch (type) {
    case 'success':
      backgroundColor = "#16a34a"; // Tailwind green-600
      break;
    case 'error':
      backgroundColor = "#dc2626"; // Tailwind red-600
      break;
    case 'warning':
      backgroundColor = "#d97706"; // Tailwind primary-600 (amber)
      break;
    case 'info':
    default:
      backgroundColor = "#2563eb"; // Tailwind blue-600
      break;
  }

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: backgroundColor,
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
    },
  }).showToast();
}
