// Clase para manejar el panel administrativo
class AdminManager {
    constructor() {
        this.pacientes = [];
        this.pacientesFiltrados = [];
        this.paginaActual = 1;
        this.registrosPorPagina = 10;
        this.ordenActual = { campo: 'fechaRegistro', direccion: 'desc' };
        this.pacienteSeleccionado = null;
        
        this.init();
    }

    init() {
        // Verificar sesión
        if (!this.verificarSesion()) {
            this.redirigirLogin();
            return;
        }

        // Cargar datos iniciales
        this.cargarPacientes();
        this.actualizarEstadisticas();
        this.cargarFiltros();
        this.renderizarTabla();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Actualización automática cada 30 segundos
        setInterval(() => {
            this.actualizarDatos();
        }, 30000);
    }

    // Verificar sesión activa
    verificarSesion() {
        const sesionActiva = localStorage.getItem('sesionActiva');
        const sessionData = localStorage.getItem('sessionData');
        
        if (sesionActiva !== 'true' || !sessionData) {
            return false;
        }

        try {
            const data = JSON.parse(sessionData);
            const fechaLogin = new Date(data.fechaLogin);
            const ahora = new Date();
            const horasTranscurridas = (ahora - fechaLogin) / (1000 * 60 * 60);
            
            // Sesión válida por 8 horas
            return horasTranscurridas < 8;
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            return false;
        }
    }

    // Redirigir al login
    redirigirLogin() {
        alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('sessionData');
        window.location.href = 'login.html';
    }

    // Cargar pacientes desde localStorage
    cargarPacientes() {
        try {
            this.pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            this.pacientesFiltrados = [...this.pacientes];
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
            this.pacientes = [];
            this.pacientesFiltrados = [];
        }
    }

    // Actualizar estadísticas
    actualizarEstadisticas() {
        const total = this.pacientes.length;
        const hoy = new Date().toDateString();
        const pacientesHoy = this.pacientes.filter(p => {
            if (!p.fechaRegistro) return false;
            return new Date(p.fechaRegistro).toDateString() === hoy;
        }).length;

        const servicios = [...new Set(this.pacientes.map(p => p.servicio))];
        const habitaciones = [...new Set(this.pacientes.map(p => p.sala))];

        document.getElementById('totalPacientes').textContent = total;
        document.getElementById('pacientesHoy').textContent = pacientesHoy;
        document.getElementById('serviciosActivos').textContent = servicios.length;
        document.getElementById('habitacionesOcupadas').textContent = habitaciones.length;

        // Animación de números
        this.animarNumeros();
    }

    // Animar números de estadísticas
    animarNumeros() {
        const elementos = document.querySelectorAll('.stat-number');
        elementos.forEach(el => {
            const valor = parseInt(el.textContent);
            let contador = 0;
            const incremento = Math.ceil(valor / 20);
            const timer = setInterval(() => {
                contador += incremento;
                if (contador >= valor) {
                    el.textContent = valor;
                    clearInterval(timer);
                } else {
                    el.textContent = contador;
                }
            }, 50);
        });
    }

    // Cargar opciones de filtros
    cargarFiltros() {
        const servicios = [...new Set(this.pacientes.map(p => p.servicio))];
        const selectServicio = document.getElementById('filtroServicio');
        
        // Limpiar opciones existentes (excepto la primera)
        selectServicio.innerHTML = '<option value="">Todos los servicios</option>';
        
        servicios.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio;
            option.textContent = servicio;
            selectServicio.appendChild(option);
        });
    }

    // Configurar eventos
    configurarEventos() {
        // Cerrar modales al hacer clic fuera
        window.onclick = (event) => {
            const modales = document.querySelectorAll('.modal');
            modales.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        };

        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('buscador').focus();
                        break;
                    case 'n':
                        e.preventDefault();
                        window.location.href = 'index.html';
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportarCSV();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.cerrarModal();
                this.cerrarModalDetalles();
                this.cerrarModalSesion();
            }
        });
    }

    // Filtrar pacientes
    filtrarPacientes() {
        const textoBusqueda = document.getElementById('buscador').value.toLowerCase().trim();
        const filtroServicio = document.getElementById('filtroServicio').value;
        const filtroTipoDoc = document.getElementById('filtroTipoDocumento').value;

        this.pacientesFiltrados = this.pacientes.filter(paciente => {
            const coincideTexto = !textoBusqueda || 
                paciente.nombre.toLowerCase().includes(textoBusqueda) ||
                paciente.numeroDocumento.includes(textoBusqueda);
                
            const coincideServicio = !filtroServicio || paciente.servicio === filtroServicio;
            const coincideTipoDoc = !filtroTipoDoc || paciente.tipoDocumento === filtroTipoDoc;

            return coincideTexto && coincideServicio && coincideTipoDoc;
        });

        this.paginaActual = 1;
        this.renderizarTabla();
    }

    // Limpiar filtros
    limpiarFiltros() {
        document.getElementById('buscador').value = '';
        document.getElementById('filtroServicio').value = '';
        document.getElementById('filtroTipoDocumento').value = '';
        this.filtrarPacientes();
    }

    // Ordenar tabla
    ordenarTabla(campo) {
        if (this.ordenActual.campo === campo) {
            this.ordenActual.direccion = this.ordenActual.direccion === 'asc' ? 'desc' : 'asc';
        } else {
            this.ordenActual.campo = campo;
            this.ordenActual.direccion = 'asc';
        }

        this.pacientesFiltrados.sort((a, b) => {
            let valorA = a[campo] || '';
            let valorB = b[campo] || '';

            // Manejo especial para fechas
            if (campo === 'fechaRegistro') {
                valorA = new Date(valorA);
                valorB = new Date(valorB);
            } else {
                valorA = valorA.toString().toLowerCase();
                valorB = valorB.toString().toLowerCase();
            }

            if (valorA < valorB) {
                return this.ordenActual.direccion === 'asc' ? -1 : 1;
            }
            if (valorA > valorB) {
                return this.ordenActual.direccion === 'asc' ? 1 : -1;
            }
            return 0;
        });

        this.actualizarIndicadoresOrden();
        this.renderizarTabla();
    }

    // Actualizar indicadores de orden
    actualizarIndicadoresOrden() {
        document.querySelectorAll('.sort-indicator').forEach(indicator => {
            indicator.textContent = '↕️';
        });

        const campoActual = document.querySelector(`th[onclick="adminManager.ordenarTabla('${this.ordenActual.campo}')"] .sort-indicator`);
        if (campoActual) {
            campoActual.textContent = this.ordenActual.direccion === 'asc' ? '↑' : '↓';
        }
    }

    // Renderizar tabla
    renderizarTabla() {
        const tbody = document.getElementById('tablaPacientesBody');
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
        const fin = inicio + this.registrosPorPagina;
        const pacientesPagina = this.pacientesFiltrados.slice(inicio, fin);

        if (pacientesPagina.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #6c757d;">
                        <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
                        <div style="font-size: 18px; margin-bottom: 5px;">No hay pacientes registrados</div>
                        <div style="font-size: 14px;">Los registros aparecerán aquí cuando se agreguen pacientes</div>
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = pacientesPagina.map((paciente, index) => `
                <tr>
                    <td>
                        <strong>${this.capitalize(paciente.nombre)}</strong>
                    </td>
                    <td>
                        <span class="badge badge-${paciente.tipoDocumento.toLowerCase()}">
                            ${paciente.tipoDocumento}
                        </span>
                    </td>
                    <td>${paciente.numeroDocumento}</td>
                    <td>${paciente.sala}</td>
                    <td>${this.capitalize(paciente.servicio)}</td>
                    <td>${this.formatearFecha(paciente.fechaRegistro)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-action btn-view" onclick="adminManager.verDetalles(${inicio + index})" title="Ver detalles">
                                👁️
                            </button>
                            <button class="btn-action btn-delete" onclick="adminManager.confirmarEliminacion(${inicio + index})" title="Eliminar">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        this.actualizarInfoTabla();
        this.renderizarPaginacion();
    }

    // Actualizar información de la tabla
    actualizarInfoTabla() {
        document.getElementById('registrosMostrados').textContent = this.pacientesFiltrados.length;
        document.getElementById('totalRegistros').textContent = this.pacientes.length;
    }

    // Renderizar paginación
    renderizarPaginacion() {
        const totalPaginas = Math.ceil(this.pacientesFiltrados.length / this.registrosPorPagina);
        const paginacion = document.getElementById('pagination');

        if (totalPaginas <= 1) {
            paginacion.innerHTML = '';
            return;
        }

        let html = '';

        // Botón anterior
        html += `<button ${this.paginaActual === 1 ? 'disabled' : ''} onclick="adminManager.cambiarPagina(${this.paginaActual - 1})">‹</button>`;

        // Números de página
        for (let i = 1; i <= totalPaginas; i++) {
            if (i === 1 || i === totalPaginas || (i >= this.paginaActual - 2 && i <= this.paginaActual + 2)) {
                html += `<button class="${i === this.paginaActual ? 'active' : ''}" onclick="adminManager.cambiarPagina(${i})">${i}</button>`;
            } else if (i === this.paginaActual - 3 || i === this.paginaActual + 3) {
                html += '<span>...</span>';
            }
        }

        // Botón siguiente
        html += `<button ${this.paginaActual === totalPaginas ? 'disabled' : ''} onclick="adminManager.cambiarPagina(${this.paginaActual + 1})">›</button>`;

        paginacion.innerHTML = html;
    }

    // Cambiar página
    cambiarPagina(pagina) {
        const totalPaginas = Math.ceil(this.pacientesFiltrados.length / this.registrosPorPagina);
        if (pagina >= 1 && pagina <= totalPaginas) {
            this.paginaActual = pagina;
            this.renderizarTabla();
        }
    }

    // Ver detalles del paciente
    verDetalles(index) {
        const paciente = this.pacientesFiltrados[index];
        const modal = document.getElementById('modalDetalles');
        const detalles = document.getElementById('detallesPaciente');

        detalles.innerHTML = `
            <div class="patient-detail">
                <div class="detail-label">👤 Nombre Completo:</div>
                <div class="detail-value">${this.capitalize(paciente.nombre)}</div>
            </div>
            <div class="patient-detail">
                <div class="detail-label">📄 Tipo de Documento:</div>
                <div class="detail-value">
                    <span class="badge badge-${paciente.tipoDocumento.toLowerCase()}">
                        ${this.getTipoDocumentoCompleto(paciente.tipoDocumento)}
                    </span>
                </div>
            </div>
            <div class="patient-detail">
                <div class="detail-label">🔢 Número de Documento:</div>
                <div class="detail-value">${paciente.numeroDocumento}</div>
            </div>
            <div class="patient-detail">
                <div class="detail-label">🏠 Habitación:</div>
                <div class="detail-value">${paciente.sala}</div>
            </div>
            <div class="patient-detail">
                <div class="detail-label">🏥 Servicio:</div>
                <div class="detail-value">${this.capitalize(paciente.servicio)}</div>
            </div>
            <div class="patient-detail">
                <div class="detail-label">📅 Fecha de Registro:</div>
                <div class="detail-value">${this.formatearFecha(paciente.fechaRegistro)}</div>
            </div>
            <div class="patient-detail">
                <div class="detail-label">🆔 ID de Registro:</div>
                <div class="detail-value">${paciente.id || 'No asignado'}</div>
            </div>
        `;

        this.pacienteSeleccionado = index;
        modal.style.display = 'block';
    }

    // Confirmar eliminación
    confirmarEliminacion(index) {
        const paciente = this.pacientesFiltrados[index];
        const modal = document.getElementById('modalConfirmacion');
        const mensaje = document.getElementById('modalMensaje');
        
        mensaje.innerHTML = `
            ¿Está seguro de que desea eliminar el registro del paciente:<br>
            <strong>${this.capitalize(paciente.nombre)}</strong><br>
            <small>Documento: ${paciente.numeroDocumento}</small><br><br>
            <em>Esta acción no se puede deshacer.</em>
        `;
        
        const btnConfirmar = document.getElementById('btnConfirmar');
        btnConfirmar.onclick = () => this.eliminarPaciente(index);
        
        modal.style.display = 'block';
    }

    // Eliminar paciente
    eliminarPaciente(index) {
        const paciente = this.pacientesFiltrados[index];
        
        // Encontrar el índice en la lista original
        const indiceOriginal = this.pacientes.findIndex(p => 
            p.numeroDocumento === paciente.numeroDocumento && 
            p.nombre === paciente.nombre
        );
        
        if (indiceOriginal !== -1) {
            this.pacientes.splice(indiceOriginal, 1);
            localStorage.setItem('pacientes', JSON.stringify(this.pacientes));
            
            this.filtrarPacientes();
            this.actualizarEstadisticas();
            this.cargarFiltros();
            
            this.cerrarModal();
            this.mostrarNotificacion('Paciente eliminado correctamente', 'success');
        } else {
            this.mostrarNotificacion('Error al eliminar el paciente', 'error');
        }
    }

    // Exportar CSV
    exportarCSV() {
        if (this.pacientes.length === 0) {
            this.mostrarNotificacion('No hay pacientes para exportar', 'warning');
            return;
        }

        const headers = [
            'Nombre Completo',
            'Tipo Documento',
            'Número Documento',
            'Habitación',
            'Servicio',
            'Fecha Registro'
        ];

        let csvContent = headers.join(',') + '\n';
        
        this.pacientes.forEach(paciente => {
            const fila = [
                `"${paciente.nombre}"`,
                paciente.tipoDocumento,
                paciente.numeroDocumento,
                `"${paciente.sala}"`,
                `"${paciente.servicio}"`,
                this.formatearFecha(paciente.fechaRegistro)
            ];
            csvContent += fila.join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.mostrarNotificacion('Archivo CSV descargado correctamente', 'success');
    }

    // Actualizar datos
    actualizarDatos() {
        this.cargarPacientes();
        this.actualizarEstadisticas();
        this.cargarFiltros();
        this.filtrarPacientes();
        
        // Mostrar indicador de actualización
        const btn = document.querySelector('button[onclick="adminManager.actualizarDatos()"]');
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = '🔄 Actualizando...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }, 1000);
    }

    // Cerrar sesión
    cerrarSesion() {
        const modal = document.getElementById('modalCerrarSesion');
        modal.style.display = 'block';
    }

    // Confirmar cerrar sesión
    confirmarCerrarSesion() {
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('sessionData');
        this.mostrarNotificacion('Sesión cerrada correctamente', 'success');
        
        // Pequeño delay para mostrar la notificación antes de redirigir
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    // Cerrar modal de sesión
    cerrarModalSesion() {
        document.getElementById('modalCerrarSesion').style.display = 'none';
    }

    // Cerrar modal de confirmación
    cerrarModal() {
        document.getElementById('modalConfirmacion').style.display = 'none';
    }

    // Cerrar modal de detalles
    cerrarModalDetalles() {
        document.getElementById('modalDetalles').style.display = 'none';
        this.pacienteSeleccionado = null;
    }

    // Utilidades
    capitalize(texto) {
        if (!texto) return '';
        return texto.split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
            .join(' ');
    }

    formatearFecha(fechaString) {
        if (!fechaString) return 'No disponible';
        
        try {
            const fecha = new Date(fechaString);
            return fecha.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    }

    getTipoDocumentoCompleto(tipo) {
        const tipos = {
            'CC': 'Cédula de Ciudadanía',
            'TI': 'Tarjeta de Identidad',
            'CE': 'Cédula de Extranjería'
        };
        return tipos[tipo] || tipo;
    }

    // Mostrar notificaciones
    mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = `notification notification-${tipo}`;
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Colores según el tipo
        const colores = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        notificacion.style.backgroundColor = colores[tipo];
        notificacion.textContent = mensaje;

        // Agregar al DOM
        document.body.appendChild(notificacion);

        // Mostrar notificación
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Ocultar y remover después de 4 segundos
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }, 4000);
    }

    // Obtener estadísticas avanzadas
    obtenerEstadisticasAvanzadas() {
        const stats = {
            totalPacientes: this.pacientes.length,
            pacientesPorServicio: {},
            pacientesPorTipoDoc: {},
            registrosPorDia: {},
            habitacionesOcupadas: new Set(this.pacientes.map(p => p.sala)).size
        };

        this.pacientes.forEach(paciente => {
            // Por servicio
            stats.pacientesPorServicio[paciente.servicio] = 
                (stats.pacientesPorServicio[paciente.servicio] || 0) + 1;

            // Por tipo de documento
            stats.pacientesPorTipoDoc[paciente.tipoDocumento] = 
                (stats.pacientesPorTipoDoc[paciente.tipoDocumento] || 0) + 1;

            // Por día
            if (paciente.fechaRegistro) {
                const dia = new Date(paciente.fechaRegistro).toDateString();
                stats.registrosPorDia[dia] = (stats.registrosPorDia[dia] || 0) + 1;
            }
        });

        return stats;
    }
}

// Instancia global del administrador
let adminManager;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminManager();
});