# Sistema de Registro de Pacientes básico - Clínica Medical Duarte

## 📋 Descripción

Sistema web básico para el registro y gestión de pacientes de la Clínica Medical Duarte. La aplicación permite registrar pacientes, mostrar información sobre derechos y deberes, realizar un quiz educativo y gestionar los registros a través de un panel administrativo.

## 🌟 Características Principales

### Para Pacientes
- **Registro de Pacientes**: Formulario intuitivo con validación en tiempo real
- **Información Educativa**: Visualización clara de derechos y deberes
- **Quiz Interactivo**: Juego educativo para evaluar conocimientos
- **Interfaz Responsive**: Adaptable a dispositivos móviles y desktop

### Para Administradores
- **Panel de Control**: Dashboard con estadísticas en tiempo real
- **Gestión de Registros**: Ver, filtrar, ordenar y eliminar pacientes
- **Exportación de Datos**: Descarga de registros en formato CSV
- **Búsqueda Avanzada**: Filtros por servicio, tipo de documento y texto libre
- **Paginación Inteligente**: Navegación eficiente entre registros

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilos**: CSS Grid, Flexbox, Animaciones CSS
- **Almacenamiento**: LocalStorage del navegador
- **Diseño**: Responsive Design, Mobile First
- **Iconos**: Emojis nativos para mejor compatibilidad

## 📁 Estructura del Proyecto

```
clinica-medical-duarte/
├── index.html                 # Página principal de registro
├── templates/
│   ├── login.html            # Acceso para doctora
│   ├── admin.html            # Panel administrativo
│   ├── derechos-deberes.html # Información educativa
│   ├── quiz.html             # Quiz interactivo
│   └── static/
│       ├── css/
│       │   ├── login.css     # Estilos del login
│       │   ├── admin.css     # Estilos del panel admin
│       │   ├── derechos-deberes.css # Estilos página educativa
│       │   └── quiz.css      # Estilos del quiz
│       └── js/
│           ├── main.js       # Lógica del registro
│           ├── login.js      # Autenticación
│           ├── admin.js      # Panel administrativo
│           ├── derechos-deberes.js # Página educativa
│           └── quiz.js       # Quiz interactivo
└── README.md
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, pero recomendado)

### Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/clinica-medical-duarte.git
   cd clinica-medical-duarte
   ```

2. **Abrir con servidor local (recomendado)**
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Acceder a la aplicación**
   - Abrir `http://localhost:8000` en tu navegador
   - O simplemente abrir `index.html` directamente

### Uso del Sistema

#### Para Pacientes:
1. Completar el formulario de registro en la página principal
2. Revisar la información de derechos y deberes
3. Opcionalmente, realizar el quiz educativo

#### Para Administradores:
1. Acceder a través del botón "Acceso Doctora"
2. Usar las credenciales de prueba:
   - **Usuario**: `doctora`
   - **Contraseña**: `1234`
3. Gestionar registros desde el panel administrativo

## 🎯 Funcionalidades Detalladas

### Registro de Pacientes
- Validación de nombres (solo letras, mínimo 3 caracteres)
- Validación de documentos (exactamente 10 dígitos)
- Verificación de documentos duplicados
- Selección de tipo de documento (CC, TI, CE)
- Registro de habitación y servicio
- Timestamp automático de registro

### Panel Administrativo
- **Estadísticas**: Total de pacientes, registros del día, servicios activos, habitaciones ocupadas
- **Filtros**: Por nombre, documento, servicio y tipo de documento
- **Ordenamiento**: Columnas ordenables (nombre, documento, fecha, etc.)
- **Paginación**: 10 registros por página con navegación
- **Acciones**: Ver detalles y eliminar registros
- **Exportación**: Descarga de todos los registros en CSV
- **Sesión**: Control de sesión con expiración automática (8 horas)

### Quiz Educativo
- Preguntas aleatorias sobre derechos y deberes
- Opciones mezcladas para mayor variedad
- Sistema de puntuación y estadísticas
- Feedback inmediato con explicaciones
- Resultados detallados con porcentaje de acierto
- Opción de repetir el quiz

## 🎨 Diseño y UX

- **Paleta de Colores**: Azules profesionales (#3498db, #2980b9)
- **Tipografía**: Fuentes del sistema para mejor rendimiento
- **Responsive**: Breakpoints en 768px y 480px
- **Accesibilidad**: Contraste adecuado y navegación por teclado
- **Microinteracciones**: Hover effects y transiciones suaves

## 💾 Almacenamiento de Datos

Los datos se almacenan localmente en el navegador usando `localStorage`:

- **pacientes**: Array con todos los registros de pacientes
- **sesionActiva**: Estado de la sesión administrativa
- **sessionData**: Datos de la sesión (usuario, fecha, token)
- **loginAttempts**: Registro de intentos de login
- **quizResultados**: Histórico de resultados del quiz

## 🔒 Seguridad

- Validación de entrada en cliente y servidor simulado
- Control de sesión con expiración automática
- Sanitización de datos de entrada
- Prevención de XSS mediante validación estricta
- Registro de intentos de acceso

## 📱 Compatibilidad

### Navegadores Soportados:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dispositivos:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

## 🐛 Solución de Problemas

### Problemas Comunes:

1. **Los datos no se guardan**
   - Verificar que el navegador tenga localStorage habilitado
   - Comprobar que no esté en modo incógnito

2. **La sesión expira constantemente**
   - Verificar la fecha/hora del sistema
   - Limpiar localStorage si hay datos corruptos

3. **El formulario no valida correctamente**
   - Verificar que JavaScript esté habilitado
   - Revisar la consola del navegador para errores

### Limpiar Datos de Prueba:
```javascript
// Ejecutar en la consola del navegador
localStorage.clear();
location.reload();
```


## 👥 Contribución

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

⭐ **¡No olvides dar una estrella al proyecto si te fue útil!**
