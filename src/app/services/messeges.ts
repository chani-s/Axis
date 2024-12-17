import Swal from 'sweetalert2';
import style from "../components/Entrance/UserEntrance.module.css";
export const showError = (message: string) => {
    Swal.fire({
        icon: 'error',
        title: 'משהו השתבש😳',
        text: message,
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: style.custom_confirm_button
        }
    });
}

export const showSuccess = (message: string) => {
    Swal.fire({
        icon: 'success', 
        title: 'הפעולה בוצעה בהצלחה! 🎉',
        text: message,
        customClass: {
            confirmButton: style.custom_confirm_button
        }
    });
};