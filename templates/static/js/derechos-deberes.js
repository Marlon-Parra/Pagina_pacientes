// Clase para manejar la página de derechos y deberes (sin animaciones)
class DerechosDeberesManager {
    constructor() {
        this.init();
    }

    init() {
        this.configurarInteracciones();
        this.verificarRegistroReciente();
    }

    // Configurar interacciones
    configurarInteracciones() {
        // Efecto de lectura (marcar como leído)
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.marcarComoLeido(card);
            });
        });

        // Configurar botones
        this.configurarBotones();
    }

    // Marcar card como leído
    marcarComoLeido(card) {
        if (!card.classList.contains('leido')) {
            card.classList.add('leido');
            card.style.background = 'linear-gradient(135deg, #f8f9fa, #e3f2fd)';
            card.style.opacity = '0.9';
            
            // Agregar checkmark
            const numero = card.querySelector('.card-number');
            if (numero) {
                const checkmark = document.createElement('div');
                checkmark.innerHTML = '✓';
                checkmark.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #27ae60;
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
                `;
                
                numero.style.position = 'relative';
                numero.appendChild(checkmark);
            }
            
            this.actualizarProgreso();
        }
    }

    // Configurar botones
    configurarBotones() {
        const botones = document.querySelectorAll('button');
        botones.forEach(boton => {
            // Prevenir múltiples clics
            boton.addEventListener('click', () => {
                boton.disabled = true;
                setTimeout(() => {
                    boton.disabled = false;
                }, 1000);
            });
        });
    }



    // Verificar registro reciente
    verificarRegistroReciente() {
        try {
            const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            if (pacientes.length > 0) {
                const ultimoPaciente = pacientes[pacientes.length - 1];
                const ahora = new Date();
                const fechaRegistro = new Date(ultimoPaciente.fechaRegistro);
                const minutos = Math.floor((ahora - fechaRegistro) / (1000 * 60));
                
                if (minutos < 5) {
                    this.mostrarMensajeBienvenida(ultimoPaciente);
                }
            }
        } catch (error) {
            console.error('Error al verificar registro reciente:', error);
        }
    }

    // Mostrar mensaje de bienvenida personalizado
    mostrarMensajeBienvenida(paciente) {
        const welcomeMessage = document.querySelector('.welcome-message p');
        if (welcomeMessage) {
            welcomeMessage.innerHTML = `
                Bienvenido/a <strong>${this.capitalize(paciente.nombre)}</strong>, 
                gracias por registrarse en la Clínica Medical Duarte. 
                A continuación, le presentamos información importante sobre sus derechos y deberes como paciente.
            `;
        }
    }

    // Actualizar progreso de lectura
    actualizarProgreso() {
        const totalCards = document.querySelectorAll('.card').length;
        const leidas = document.querySelectorAll('.card.leido').length;
        const porcentaje = Math.round((leidas / totalCards) * 100);
        
        // Crear o actualizar barra de progreso
        let barraProgreso = document.querySelector('.progreso-lectura');
        if (!barraProgreso) {
            barraProgreso = document.createElement('div');
            barraProgreso.className = 'progreso-lectura';
            barraProgreso.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                padding: 15px 25px;
                border-radius: 25px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                border: 2px solid #3498db;
                font-size: 14px;
                font-weight: 500;
                color: #2c3e50;
                z-index: 1000;
            `;
            document.body.appendChild(barraProgreso);
        }
        
        barraProgreso.innerHTML = `
            📖 Progreso de lectura: ${leidas}/${totalCards} (${porcentaje}%)
            <div style="width: 200px; height: 4px; background: #ecf0f1; border-radius: 2px; margin-top: 8px;">
                <div style="width: ${porcentaje}%; height: 100%; background: linear-gradient(90deg, #3498db, #2980b9); border-radius: 2px;"></div>
            </div>
        `;
        
        // Ocultar cuando esté completo
        if (porcentaje === 100) {
            setTimeout(() => {
                barraProgreso.style.display = 'none';
            }, 2000);
        }
    }

    // Utilidades
    capitalize(texto) {
        if (!texto) return '';
        return texto.split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
            .join(' ');
    }

    // Generar estadísticas de interacción
    generarEstadisticas() {
        const stats = {
            totalCards: document.querySelectorAll('.card').length,
            cardsLeidas: document.querySelectorAll('.card.leido').length,
            tiempoEnPagina: Date.now() - this.tiempoInicio,
            interacciones: this.interacciones || 0
        };
        
        // Guardar en localStorage para análisis
        try {
            let estadisticas = JSON.parse(localStorage.getItem('estadisticasDerechos')) || [];
            estadisticas.push({
                ...stats,
                fecha: new Date().toISOString()
            });
            
            // Mantener solo las últimas 10 sesiones
            if (estadisticas.length > 10) {
                estadisticas = estadisticas.slice(-10);
            }
            
            localStorage.setItem('estadisticasDerechos', JSON.stringify(estadisticas));
        } catch (error) {
            console.error('Error al guardar estadísticas:', error);
        }
        
        return stats;
    }
}

// Instancia global del manager
let derechosDeberesManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    derechosDeberesManager = new DerechosDeberesManager();
    
    // Registrar tiempo de inicio para estadísticas
    derechosDeberesManager.tiempoInicio = Date.now();
    
    // Guardar estadísticas al salir de la página
    window.addEventListener('beforeunload', () => {
        derechosDeberesManager.generarEstadisticas();
    });
});