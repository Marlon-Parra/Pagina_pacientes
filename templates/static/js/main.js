// Clase para manejar el formulario de pacientes
class FormularioPaciente {
    constructor() {
        this.form = document.getElementById('formRegistro');
        this.mensaje = document.getElementById('mensaje');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupValidation();
    }

    // Configurar validaciones en tiempo real
    setupValidation() {
        const inputs = this.form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validar campo individual
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validaciones específicas por campo
        switch(field.id) {
            case 'nombre':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 3 caracteres';
                } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'El nombre solo puede contener letras';
                }
                break;

            case 'numeroDocumento':
                if (!/^\d{10}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'El documento debe tener exactamente 10 dígitos';
                }
                break;

            case 'tipoDocumento':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Debe seleccionar un tipo de documento';
                }
                break;

            case 'sala':
                if (!/^[A-Za-z0-9\- ]{1,10}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Formato de habitación inválido (ej: 402A, H-203)';
                }
                break;

            case 'servicio':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'El servicio debe tener al menos 3 caracteres';
                } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'El servicio solo puede contener letras';
                }
                break;
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    // Mostrar error en campo
    showFieldError(field, isValid, errorMessage) {
        // Remover error anterior
        this.clearFieldError(field);

        if (!isValid) {
            field.classList.add('error');
            field.style.borderColor = '#e74c3c';
            
            // Crear mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = errorMessage;
            
            field.parentNode.appendChild(errorDiv);
        }
    }

    // Limpiar error de campo
    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '#ccc';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Manejar envío del formulario
    handleSubmit(e) {
        e.preventDefault();
        
        // Validar todos los campos
        const inputs = this.form.querySelectorAll('input, select');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Por favor, corrija los errores antes de continuar.', 'error');
            return;
        }

        // Verificar duplicados
        if (this.checkDuplicateDocument()) {
            this.showMessage('Ya existe un paciente registrado con este número de documento.', 'error');
            return;
        }

        // Crear objeto paciente
        const paciente = this.createPacienteObject();
        
        // Guardar paciente
        if (this.savePaciente(paciente)) {
            this.showMessage('¡Paciente registrado exitosamente!', 'success');
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = '/templates/derechos-deberes.html';
            }, 2000);
        } else {
            this.showMessage('Error al guardar el paciente. Intente nuevamente.', 'error');
        }
    }

    // Verificar documento duplicado
    checkDuplicateDocument() {
        const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
        const pacientes = this.getPacientes();
        
        return pacientes.some(p => p.numeroDocumento === numeroDocumento);
    }

    // Crear objeto paciente
    createPacienteObject() {
        return {
            id: Date.now(), // ID único basado en timestamp
            nombre: document.getElementById('nombre').value.trim(),
            tipoDocumento: document.getElementById('tipoDocumento').value,
            numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
            sala: document.getElementById('sala').value.trim(),
            servicio: document.getElementById('servicio').value.trim(),
            fechaRegistro: new Date().toISOString()
        };
    }

    // Guardar paciente en localStorage
    savePaciente(paciente) {
        try {
            let pacientes = this.getPacientes();
            pacientes.push(paciente);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            return true;
        } catch (error) {
            console.error('Error al guardar paciente:', error);
            return false;
        }
    }

    // Obtener pacientes del localStorage
    getPacientes() {
        try {
            return JSON.parse(localStorage.getItem('pacientes')) || [];
        } catch (error) {
            console.error('Error al obtener pacientes:', error);
            return [];
        }
    }

    // Mostrar mensaje
    showMessage(text, type) {
        this.mensaje.textContent = text;
        this.mensaje.className = type === 'success' ? 'mensaje-exito' : 'mensaje-error';
        
        // Scroll hacia el mensaje
        this.mensaje.scrollIntoView({ behavior: 'smooth' });
    }

    // Limpiar formulario
    reset() {
        this.form.reset();
        this.mensaje.textContent = '';
        this.mensaje.className = '';
        
        // Limpiar errores de campos
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => this.clearFieldError(input));
    }
}

// Utilidades adicionales
const Utils = {
    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Capitalizar texto
    capitalize(text) {
        return text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },

    // Validar documento
    isValidDocument(document) {
        return /^\d{10}$/.test(document);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormularioPaciente();
});

// Exportar para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FormularioPaciente, Utils };
}