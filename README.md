# Pokédex Pro - Aplicación Web Interactiva

Buscador de Pokémon dinámico y profesional desarrollado en JavaScript moderno (ES6+) que consume la API REST oficial **PokeAPI**. La aplicación incluye renderizado dinámico del DOM, paginación, captura en colección propia y un manejo robusto de errores HTTP e interfaz de usuario.

## 🚀 Enlace al Proyecto Desplegado
[Ver Pokédex Pro en GitHub Pages](https://ericksalazarsanchez-byte.github.io/pokedex-v2/)

---

## 📋 Historias de Usuario Implementadas

### Base del Laboratorio Evaluado (Lab 12)
* **HU1 (try/catch):** El sistema captura cualquier fallo de red o ejecución envolviendo el flujo asíncrono en bloques `try/catch`. En lugar de romperse, la interfaz muestra un mensaje claro al usuario.
* **HU2 (throw y response.ok):** Al consultar un Pokémon o ID inexistente (ej. "pikachuu"), la aplicación detecta la respuesta HTTP `404` mediante `response.ok` y lanza una excepción explícita (`throw new Error`) que detalla el término buscado.
* **HU3 (Estados de UI y finally):** Se implementó un estado de carga (spinner animado) controlado mediante un bloque `finally`, garantizando que el indicador siempre se oculte sin importar si la petición fue exitosa o fallida.

### Historias de Usuario Adicionales (Retos del Proyecto)
* **HU4 (Búsqueda por Nombre o ID):** El usuario puede buscar tanto por el nombre del Pokémon como por su número identificador nacional en la PokeAPI.
* **HU5 (Botón de Reintento tras Fallos):** Ante una caída de red o pérdida de conexión, el sistema despliega un botón interactivo de "Reintentar" que repite automáticamente la última petición fallida sin recargar la página.

---

## 🛠️ Tecnologías Utilizadas
* **JavaScript Moderno (ES6+):** `async/await`, `fetch API`, `Promise.all`, `try/catch/finally`, `Array.prototype.map()`, `.filter()`, `.find()`, `template literals` y `destructuring`[cite: 33, 34].
* **HTML5 & Tailwind CSS:** Diseño responsive, rejilla adaptativa (`CSS Grid`), componentes estilizados y animaciones de UI (`animate-spin`)[cite: 29, 34].
* **PokeAPI REST Service:** Consumo de datos públicos en formato JSON para especies y características de Pokémon[cite: 33, 34].
* **Git / GitHub Pages:** Control de versiones por ramas (`lab12-errores`, `main`) y despliegue público continuo[cite: 26, 34].

---

## 💻 Cómo Ejecutar el Proyecto Localmente

1. Clona el repositorio desde GitHub:
   ```bash
   git clone [https://github.com/ericksalazarsanchez-byte/pokedex-v2.git](https://github.com/ericksalazarsanchez-byte/pokedex-v2.git)