// Clase para manejar el quiz de conocimientos
class QuizManager {
    constructor() {
        this.preguntas = [
            {
                pregunta: '¿Cuál es un deber fundamental de los pacientes en la clínica?',
                opciones: [
                    'Recibir atención médica gratuita',
                    'Mantener el buen orden y aseo en la institución',
                    'Solicitar cualquier medicamento que deseen'
                ],
                respuesta: 'Mantener el buen orden y aseo en la institución',
                explicacion: 'Los pacientes tienen el deber de mantener el orden y la limpieza para garantizar un ambiente adecuado para todos.'
            },
            {
                pregunta: '¿Qué derecho tiene el paciente respecto a su información médica?',
                opciones: [
                    'Mantener toda la información en secreto',
                    'Exigir privacidad y confidencialidad de su información',
                    'Compartir su información con otros pacientes'
                ],
                respuesta: 'Exigir privacidad y confidencialidad de su información',
                explicacion: 'Todo paciente tiene derecho a la privacidad y confidencialidad de su información médica.'
            },
            {
                pregunta: '¿Qué debe hacer un paciente al solicitar servicios médicos?',
                opciones: [
                    'Proporcionar información falsa para obtener mejor atención',
                    'Exponer claramente su estado de salud y la causa de su visita',
                    'Ocultar síntomas para no preocupar al médico'
                ],
                respuesta: 'Exponer claramente su estado de salud y la causa de su visita',
                explicacion: 'Es fundamental que el paciente sea honesto y claro sobre su estado de salud para recibir el tratamiento adecuado.'
            },
            {
                pregunta: '¿Cuál es un derecho del paciente durante su tratamiento?',
                opciones: [
                    'Exigir medicamentos específicos sin prescripción médica',
                    'Aceptar o rechazar procedimientos dejando constancia escrita',
                    'Interrumpir el tratamiento sin consultar al médico'
                ],
                respuesta: 'Aceptar o rechazar procedimientos dejando constancia escrita',
                explicacion: 'Los pacientes tienen derecho a aceptar o rechazar tratamientos, siempre dejando constancia por escrito de su decisión.'
            },
            {
                pregunta: '¿Qué actitud debe mantener el paciente con el personal médico?',
                opciones: [
                    'Ser exigente y autoritario',
                    'Respetar al personal de salud y a los usuarios',
                    'Mantener distancia y no comunicarse'
                ],
                respuesta: 'Respetar al personal de salud y a los usuarios',
                explicacion: 'El respeto mutuo es fundamental para crear un ambiente de atención médica positivo y efectivo.'
            },
            {
                pregunta: '¿Qué tiene derecho a conocer el paciente sobre su atención?',
                opciones: [
                    'Solo el diagnóstico final',
                    'Únicamente los costos del tratamiento',
                    'Toda la información sobre la enfermedad, procedimientos y tratamientos'
                ],
                respuesta: 'Toda la información sobre la enfermedad, procedimientos y tratamientos',
                explicacion: 'Los pacientes tienen derecho a estar completamente informados sobre todos los aspectos de su atención médica.'
            }
        ];
        
        this.preguntaActual = 0;
        this.puntuacion = 0;
        this.respuestasCorrectas = 0;
        this.respuestasIncorrectas = 0;
        this.preguntasRespondidas = [];
        this.tiempoInicio = null;
        
        this.init();
    }

    init() {
        this.mezclarPreguntas();
        this.actualizarProgreso();
    }

    // Mezclar preguntas para mayor variedad
    mezclarPreguntas() {
        for (let i = this.preguntas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.preguntas[i], this.preguntas[j]] = [this.preguntas[j], this.preguntas[i]];
        }
        
        // También mezclar opciones de cada pregunta
        this.preguntas.forEach(pregunta => {
            const respuestaCorrecta = pregunta.respuesta;
            for (let i = pregunta.opciones.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pregunta.opciones[i], pregunta.opciones[j]] = [pregunta.opciones[j], pregunta.opciones[i]];
            }
            pregunta.respuesta = respuestaCorrecta; // Mantener la respuesta correcta
        });
    }

    // Iniciar el quiz
    startQuiz() {
        this.tiempoInicio = new Date();
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('quizScreen').style.display = 'block';
        this.mostrarPregunta();
    }

    // Mostrar pregunta actual
    mostrarPregunta() {
        if (this.preguntaActual >= this.preguntas.length) {
            this.mostrarResultados();
            return;
        }

        const pregunta = this.preguntas[this.preguntaActual];
        
        // Actualizar elementos del DOM
        document.getElementById('questionNumber').textContent = 
            `Pregunta ${this.preguntaActual + 1} de ${this.preguntas.length}`;
        document.getElementById('questionText').textContent = pregunta.pregunta;
        
        // Limpiar y crear opciones
        const contenedorOpciones = document.getElementById('optionsContainer');
        contenedorOpciones.innerHTML = '';
        
        pregunta.opciones.forEach((opcion, index) => {
            const botonOpcion = document.createElement('button');
            botonOpcion.className = 'option-button';
            botonOpcion.textContent = opcion;
            botonOpcion.onclick = () => this.seleccionarRespuesta(botonOpcion, opcion);
            contenedorOpciones.appendChild(botonOpcion);
        });

        // Deshabilitar botón siguiente
        document.getElementById('nextButton').disabled = true;
        
        // Actualizar progreso
        this.actualizarProgreso();
        this.actualizarPuntuacion();
    }

    // Seleccionar respuesta
    seleccionarRespuesta(botonSeleccionado, opcionSeleccionada) {
        const pregunta = this.preguntas[this.preguntaActual];
        const botones = document.querySelectorAll('.option-button');
        
        // Deshabilitar todos los botones
        botones.forEach(boton => {
            boton.disabled = true;
            boton.classList.remove('selected');
        });

        // Marcar la opción seleccionada
        botonSeleccionado.classList.add('selected');

        // Verificar respuesta
        const esCorrecta = opcionSeleccionada === pregunta.respuesta;
        
        setTimeout(() => {
            // Mostrar respuesta correcta/incorrecta
            botones.forEach(boton => {
                if (boton.textContent === pregunta.respuesta) {
                    boton.classList.add('correct');
                } else if (boton === botonSeleccionado && !esCorrecta) {
                    boton.classList.add('incorrect');
                }
            });

            // Actualizar estadísticas
            if (esCorrecta) {
                this.respuestasCorrectas++;
                this.puntuacion += 100;
                this.mostrarMensaje('¡Correcto! 🎉', 'success');
            } else {
                this.respuestasIncorrectas++;
                this.mostrarMensaje(`Incorrecto. La respuesta correcta es: ${pregunta.respuesta}`, 'error');
            }

            // Guardar respuesta
            this.preguntasRespondidas.push({
                pregunta: pregunta.pregunta,
                respuestaUsuario: opcionSeleccionada,
                respuestaCorrecta: pregunta.respuesta,
                esCorrecta: esCorrecta,
                explicacion: pregunta.explicacion
            });

            // Habilitar botón siguiente
            document.getElementById('nextButton').disabled = false;
            document.getElementById('nextButton').textContent = 
                this.preguntaActual === this.preguntas.length - 1 ? 'Ver Resultados' : 'Siguiente';
            
            this.actualizarPuntuacion();
        }, 500);
    }

    // Siguiente pregunta
    nextQuestion() {
        this.preguntaActual++;
        if (this.preguntaActual >= this.preguntas.length) {
            this.mostrarResultados();
        } else {
            this.mostrarPregunta();
        }
    }

    // Mostrar resultados finales
    mostrarResultados() {
        document.getElementById('quizScreen').style.display = 'none';
        document.getElementById('resultScreen').style.display = 'block';

        const porcentaje = Math.round((this.respuestasCorrectas / this.preguntas.length) * 100);
        const tiempoTotal = this.calcularTiempoTotal();

        // Actualizar elementos de resultados
        document.getElementById('finalScore').textContent = `${porcentaje}%`;
        document.getElementById('totalQuestions').textContent = this.preguntas.length;
        document.getElementById('correctAnswers').textContent = this.respuestasCorrectas;
        document.getElementById('incorrectAnswers').textContent = this.respuestasIncorrectas;
        document.getElementById('percentage').textContent = `${porcentaje}%`;

        // Mensaje personalizado según el rendimiento
        let mensaje = '';
        if (porcentaje >= 90) {
            mensaje = '¡Excelente! 🏆 Tienes un gran conocimiento sobre derechos y deberes.';
        } else if (porcentaje >= 70) {
            mensaje = '¡Muy bien! 👏 Demuestras un buen entendimiento del tema.';
        } else if (porcentaje >= 50) {
            mensaje = 'Bien hecho 👍 Pero puedes mejorar revisando los temas nuevamente.';
        } else {
            mensaje = 'Te recomendamos revisar nuevamente los derechos y deberes. 📚';
        }

        document.getElementById('resultMessage').textContent = mensaje;

        // Guardar resultado en localStorage (opcional)
        this.guardarResultado({
            fecha: new Date().toISOString(),
            puntuacion: this.puntuacion,
            porcentaje: porcentaje,
            tiempo: tiempoTotal,
            respuestasCorrectas: this.respuestasCorrectas,
            totalPreguntas: this.preguntas.length
        });
    }

    // Calcular tiempo total
    calcularTiempoTotal() {
        if (!this.tiempoInicio) return '0:00';
        
        const tiempoFin = new Date();
        const diferencia = tiempoFin - this.tiempoInicio;
        const minutos = Math.floor(diferencia / 60000);
        const segundos = Math.floor((diferencia % 60000) / 1000);
        
        return `${minutos}:${segundos.toString().padStart(2, '0')}`;
    }

    // Actualizar barra de progreso
    actualizarProgreso() {
        const progreso = (this.preguntaActual / this.preguntas.length) * 100;
        document.getElementById('progressBar').style.width = `${progreso}%`;
    }

    // Actualizar puntuación mostrada
    actualizarPuntuacion() {
        document.getElementById('scoreCircle').textContent = 
            `${this.respuestasCorrectas}/${this.preguntaActual + (document.getElementById('nextButton').disabled ? 0 : 1)}`;
    }

    // Mostrar mensaje temporal
    mostrarMensaje(mensaje, tipo) {
        // Crear elemento de mensaje si no existe
        let mensajeDiv = document.getElementById('quizMessage');
        if (!mensajeDiv) {
            mensajeDiv = document.createElement('div');
            mensajeDiv.id = 'quizMessage';
            mensajeDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                max-width: 300px;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(mensajeDiv);
        }

        mensajeDiv.textContent = mensaje;
        mensajeDiv.style.backgroundColor = tipo === 'success' ? '#27ae60' : '#e74c3c';
        
        // Mostrar mensaje
        setTimeout(() => {
            mensajeDiv.style.opacity = '1';
            mensajeDiv.style.transform = 'translateY(0)';
        }, 100);

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            mensajeDiv.style.opacity = '0';
            mensajeDiv.style.transform = 'translateY(-20px)';
        }, 3000);
    }

    // Reiniciar quiz
    restartQuiz() {
        this.preguntaActual = 0;
        this.puntuacion = 0;
        this.respuestasCorrectas = 0;
        this.respuestasIncorrectas = 0;
        this.preguntasRespondidas = [];
        this.tiempoInicio = null;

        document.getElementById('resultScreen').style.display = 'none';
        document.getElementById('startScreen').style.display = 'block';
        
        this.mezclarPreguntas();
        this.actualizarProgreso();
    }

    // Guardar resultado en localStorage
    guardarResultado(resultado) {
        try {
            let resultados = JSON.parse(localStorage.getItem('quizResultados')) || [];
            resultados.push(resultado);
            
            // Mantener solo los últimos 10 resultados
            if (resultados.length > 10) {
                resultados = resultados.slice(-10);
            }
            
            localStorage.setItem('quizResultados', JSON.stringify(resultados));
        } catch (error) {
            console.error('Error al guardar resultado:', error);
        }
    }

    // Obtener estadísticas
    obtenerEstadisticas() {
        try {
            const resultados = JSON.parse(localStorage.getItem('quizResultados')) || [];
            if (resultados.length === 0) return null;

            const promedioPorcentaje = resultados.reduce((sum, r) => sum + r.porcentaje, 0) / resultados.length;
            const mejorPorcentaje = Math.max(...resultados.map(r => r.porcentaje));
            const totalIntentos = resultados.length;

            return {
                promedio: Math.round(promedioPorcentaje),
                mejor: mejorPorcentaje,
                intentos: totalIntentos
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return null;
        }
    }
}

// Instancia global del quiz
let quiz;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    quiz = new QuizManager();
});