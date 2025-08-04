// Clase para manejar el login de la doctora
class LoginManager {
    constructor() {
        // Credenciales válidas (en un entorno real, esto estaría en el backend)
        this.credencialesValidas = {
            usuario: 'doctora',
            contrasena: '1234'
        };
        
        this.form = document.getElementById('loginForm');
        this.errorMessage = document.getElementById('errorMessage');
        this.loginText = document.getElementById('loginText');
        this.loading = document.getElementById('loading');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        this.setupValidation();
        this.checkExistingSession();
    }

    // Configurar validaciones en tiempo real
    setupValidation() {
        const inputs = this.form.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearError();
                this.validateField(input);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.form.dispatchEvent(new Event('submit'));
                }
            });
        });
    }

    // Validar campo individual
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remover clases de error anteriores
        field.classList.remove('error');

        // Validaciones específicas
        if (field.id === 'usuario') {
            if (value.length < 3) {
                isValid = false;
                this.showFieldError(field, 'El usuario debe tener al menos 3 caracteres');
            }
        } else if (field.id === 'contrasena') {
            if (value.length < 4) {
                isValid = false;
                this.showFieldError(field, 'La contraseña debe tener al menos 4 caracteres');
            }
        }

        return isValid;
    }

    // Mostrar error en campo específico
    showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
        
        // Crear tooltip de error si no existe
        let tooltip = field.parentNode.querySelector('.field-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'field-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                background: #e74c3c;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 1000;
                margin-top: 5px;
            `;
            field.parentNode.appendChild(tooltip);
        }
        
        tooltip.textContent = message;
        tooltip.style.display = 'block';
        
        // Ocultar tooltip después de 3 segundos
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.style.display = 'none';
            }
        }, 3000);
    }

    // Limpiar errores
    clearError() {
        this.errorMessage.style.display = 'none';
        
        // Limpiar errores de campos
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('error');
            input.style.borderColor = '#e1e8ed';
            
            const tooltip = input.parentNode.querySelector('.field-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
    }

    // Manejar el login
    async handleLogin(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        
        // Validar campos
        const usuarioValido = this.validateField(document.getElementById('usuario'));
        const contrasenaValida = this.validateField(document.getElementById('contrasena'));
        
        if (!usuarioValido || !contrasenaValida) {
            this.showError('Por favor, corrija los errores antes de continuar.');
            return;
        }

        // Mostrar loading
        this.showLoading(true);
        
        try {
            // Simular delay de autenticación
            await this.delay(1500);
            
            // Verificar credenciales
            if (this.verificarCredenciales(usuario, contrasena)) {
                this.loginExitoso();
            } else {
                this.loginFallido();
            }
        } catch (error) {
            console.error('Error en el login:', error);
            this.showError('Error interno. Intente nuevamente.');
        } finally {
            this.showLoading(false);
        }
    }

    // Verificar credenciales
    verificarCredenciales(usuario, contrasena) {
        return usuario === this.credencialesValidas.usuario && 
               contrasena === this.credencialesValidas.contrasena;
    }

    // Login exitoso
    loginExitoso() {
        // Guardar sesión
        const sessionData = {
            usuario: this.credencialesValidas.usuario,
            fechaLogin: new Date().toISOString(),
            token: this.generateToken()
        };
        
        localStorage.setItem('sesionActiva', 'true');
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        
        // Mostrar mensaje de éxito
        this.showSuccess('¡Login exitoso! Redirigiendo...');
        
        // Registrar intento de login exitoso
        this.registrarIntento(true);
        
        // Redirigir después de un momento
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    }

    // Login fallido
    loginFallido() {
        this.showError('Usuario o contraseña incorrectos. Verifique sus credenciales.');
        
        // Limpiar campos
        document.getElementById('contrasena').value = '';
        document.getElementById('usuario').focus();
        
        // Registrar intento fallido
        this.registrarIntento(false);
        
        // Efecto de shake en el contenedor
        const container = document.querySelector('.login-container');
        container.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }

    // Mostrar loading
    showLoading(show) {
        if (show) {
            this.loginText.style.display = 'none';
            this.loading.style.display = 'inline-flex';
            this.form.querySelector('button[type="submit"]').disabled = true;
        } else {
            this.loginText.style.display = 'inline';
            this.loading.style.display = 'none';
            this.form.querySelector('button[type="submit"]').disabled = false;
        }
    }

    // Mostrar mensaje de error
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Mostrar mensaje de éxito
    showSuccess(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.background = '#d4edda';
        this.errorMessage.style.color = '#155724';
        this.errorMessage.style.borderLeftColor = '#28a745';
        this.errorMessage.style.display = 'block';
    }

    // Verificar sesión existente
    checkExistingSession() {
        const sesionActiva = localStorage.getItem('sesionActiva');
        const sessionData = localStorage.getItem('sessionData');
        
        if (sesionActiva === 'true' && sessionData) {
            try {
                const data = JSON.parse(sessionData);
                const fechaLogin = new Date(data.fechaLogin);
                const ahora = new Date();
                const horasTranscurridas = (ahora - fechaLogin) / (1000 * 60 * 60);
                
                // Sesión válida por 8 horas
                if (horasTranscurridas < 8) {
                    this.showSuccess('Ya tiene una sesión activa. Redirigiendo...');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 1500);
                    return;
                }
            } catch (error) {
                console.error('Error al verificar sesión:', error);
            }
        }
        
        // Limpiar sesión expirada
        this.cerrarSesion();
    }

    // Generar token simple
    generateToken() {
        return btoa(Date.now() + Math.random().toString(36));
    }

    // Registrar intento de login
    registrarIntento(exitoso) {
        try {
            let intentos = JSON.parse(localStorage.getItem('loginAttempts')) || [];
            
            intentos.push({
                fecha: new Date().toISOString(),
                exitoso: exitoso,
                ip: 'localhost', // En un entorno real, obtendría la IP real
                userAgent: navigator.userAgent
            });
            
            // Mantener solo los últimos 50 intentos
            if (intentos.length > 50) {
                intentos = intentos.slice(-50);
            }
            
            localStorage.setItem('loginAttempts', JSON.stringify(intentos));
        } catch (error) {
            console.error('Error al registrar intento:', error);
        }
    }

    // Cerrar sesión
    cerrarSesion() {
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('sessionData');
    }

    // Delay helper
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Obtener estadísticas de login
    obtenerEstadisticas() {
        try {
            const intentos = JSON.parse(localStorage.getItem('loginAttempts')) || [];
            const exitosos = intentos.filter(i => i.exitoso).length;
            const fallidos = intentos.filter(i => !i.exitoso).length;
            
            return {
                total: intentos.length,
                exitosos: exitosos,
                fallidos: fallidos,
                tasaExito: intentos.length > 0 ? Math.round((exitosos / intentos.length) * 100) : 0
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return null;
        }
    }
}

// Agregar estilos CSS adicionales dinámicamente
const additionalStyles = `
    <style>
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .input-group input.error {
            border-color: #e74c3c !important;
            background-color: #fdf2f2 !important;
        }
        
        .field-tooltip {
            animation: fadeInUp 0.3s ease;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});