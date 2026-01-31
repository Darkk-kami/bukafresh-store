// alerts.jsx
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * Shows a calm toast notification without any icon
 * @param {Object} options
 * @param {string} options.title - Main title
 * @param {string} options.text - Description text
 * @param {number} options.timer - Auto-close after ms (default 3000)
 * @param {"success"|"warning"|"error"|"info"} options.type - Visual style
 */
const showAlert = ({ title = "", text = "", timer = 3000, type = "info" }) => {
  return MySwal.fire({
    toast: true,
    position: "top-end",
    icon: undefined, // No icon at all
    title: <strong>{title}</strong>,
    html: text ? (
      <div style={{ fontSize: "0.875rem", marginTop: "4px" }}>{text}</div>
    ) : null,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    customClass: {
      popup: "animated-toast", // you can style it in CSS
    },
    didOpen: (toast) => {
      const popup = toast;
      popup.style.borderRadius = "12px";
      popup.style.padding = "16px";
      popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      popup.style.minWidth = "260px";

      // Colored left border based on type (no scary red!)
      let color = "#94a3b8"; // neutral gray
      if (type === "success") color = "#10b981"; // green
      if (type === "warning") color = "#f59e0b"; // yellow
      if (type === "error") color = "#64748b"; // soft slate (still calm)

      popup.style.borderLeft = `5px solid ${color}`;
    },
  });
};

// Friendly exports
export const showSuccessAlert = (title = "Done!", text) =>
  showAlert({ title, text, type: "success" });

export const showWarningAlert = (title = "Heads up", text) =>
  showAlert({ title, text, type: "warning" });

export const showErrorAlert = (title = "Oops!", text) =>
  showAlert({ title, text, type: "error" });

export const showInfoAlert = (title = "Just so you know", text) =>
  showAlert({ title, text, type: "info" });

/**
 * Shows a confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} text - Dialog text
 * @param {string} confirmButtonText - Text for confirm button (default: "Yes")
 * @param {string} cancelButtonText - Text for cancel button (default: "Cancel")
 * @returns {Promise<boolean>} - true if confirmed, false if cancelled
 */
export const showConfirmAlert = async (
  title = "Are you sure?",
  text = "",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel"
) => {
  const result = await MySwal.fire({
    title: <strong>{title}</strong>,
    html: text ? (
      <div style={{ fontSize: "0.875rem", marginTop: "8px" }}>{text}</div>
    ) : null,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#ef4444", // red for destructive actions
    cancelButtonColor: "#6b7280", // gray for cancel
    customClass: {
      popup: "confirm-dialog",
    },
    didOpen: (popup) => {
      popup.style.borderRadius = "12px";
      popup.style.padding = "20px";
      popup.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
    },
  });

  return result.isConfirmed;
};
