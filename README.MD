# Proyecto NOC
El proyecto NOC es una aplicación diseñada para monitorear los servicios configurados y registrar los logs generados. Su objetivo principal es proporcionar una plataforma eficiente y segura para el seguimiento y análisis de servicios.

## Tecnologías destacadas
- **Node.js**: Utilizado como entorno de ejecución para el backend.
- **TypeScript**: Lenguaje utilizado para mejorar la calidad del código y facilitar el mantenimiento.
- **Express.js**: Framework para la creación de APIs RESTful.
nedorización y despliegue de la aplicación.

## Arquitectura
El proyecto sigue una arquitectura limpia (Clean Architecture) con una estructura de tres capas principales:
- **Domain**: Contiene las reglas de negocio y entidades principales.
- **Infrastructure**: Maneja la interacción con tecnologías externas como bases de datos y servicios de terceros.
- **Presentation**: Se encarga de la interacción con el usuario y la exposición de la API.

Esta arquitectura modular facilita la escalabilidad, el mantenimiento y la integración de nuevos servicios en el futuro. Además, se utiliza Docker para garantizar un entorno de ejecución consistente en diferentes plataformas.

# Instrucciones
1. Clonar el archivo .env.template a .env
2. Configurar las variables de entorno

```
PORT=3000

MAILER_EMAIL=consultas@noc.com
MAILER_PASSWORD=your_password_here

PROD=false
```