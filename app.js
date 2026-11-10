// =================================================================
// PROYECTO MÓDULO 3: POKÉDEX PRO CON MANEJO DE ERRORES Y ESTADOS
// =================================================================

// Estado global de la aplicación
const pokedex = [];
let offset = 0;
const limit = 12;
let ultimaBusqueda = '';

// Referencias al DOM
const contenedorResultado = document.getElementById('resultado');
const inputBuscador = document.getElementById('buscador');
const btnBuscar = document.getElementById('btn-buscar');
const btnCargarMas = document.getElementById('btn-cargar-mas');
const contadorPokedex = document.getElementById('contador-pokedex');
const spinner = document.getElementById('spinner');
const mensajeContainer = document.getElementById('mensaje');
const mensajeTexto = document.getElementById('mensaje-texto');
const btnReintentar = document.getElementById('btn-reintentar');

// --- MANEJO DE ESTADOS DE UI ---
const mostrarError = (msg) => {
  mensajeTexto.textContent = msg;
  mensajeContainer.classList.remove('hidden'); // Muestra el contenedor rojo
  
  // Forzamos la visibilidad del botón Reintentar quitando cualquier clase u ocultamiento
  btnReintentar.classList.remove('hidden');
  btnReintentar.style.display = 'inline-block';
};

const limpiarErrores = () => {
  mensajeContainer.classList.add('hidden');
  btnReintentar.classList.add('hidden');
  btnReintentar.style.display = 'none';
};

// --- ADAPTACIÓN DE DATOS DE LA API ---
const adaptarPokemon = (data) => {
  const getStat = (nombreStat) => 
    data.stats.find(s => s.stat.name === nombreStat)?.base_stat || 0;

  return {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    tipos: data.types.map(t => t.type.name),
    hp: getStat('hp'),
    ataque: getStat('attack'),
    defensa: getStat('defense')
  };
};

// --- RENDERIZADO DINÁMICO DEL DOM ---
const crearTarjeta = (pokemon) => {
  const yaCapturado = pokedex.some(p => p.id === pokemon.id);

  return `
    <div class="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between border border-slate-100 transition hover:shadow-lg">
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}" class="w-32 h-32 object-contain mb-2">
      <span class="text-xs font-bold text-slate-400">#${String(pokemon.id).padStart(3, '0')}</span>
      <h3 class="text-xl font-bold capitalize text-slate-800 mb-1">${pokemon.nombre}</h3>
      
      <div class="flex gap-2 mb-3">
        ${pokemon.tipos.map(tipo => `
          <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
            ${tipo}
          </span>
        `).join('')}
      </div>

      <!-- Estadísticas con formato visual -->
      <div class="w-full text-xs text-slate-600 border-t pt-2 mb-3 grid grid-cols-3 gap-1 bg-slate-50 rounded-lg p-2">
        <div><span class="block text-slate-400 font-normal">HP</span><strong>${pokemon.hp}</strong></div>
        <div><span class="block text-slate-400 font-normal">ATQ</span><strong>${pokemon.ataque}</strong></div>
        <div><span class="block text-slate-400 font-normal">DEF</span><strong>${pokemon.defensa}</strong></div>
      </div>

      <!-- Botón Capturar -->
      <button 
        onclick="capturarPokemon(${pokemon.id}, '${pokemon.nombre}', '${pokemon.imagen}')"
        class="w-full py-2 px-4 rounded-lg font-semibold text-sm transition ${
          yaCapturado 
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-400 cursor-default' 
            : 'bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm'
        }"
        ${yaCapturado ? 'disabled' : ''}
      >
        ${yaCapturado ? '✓ Capturado' : '⚡ Capturar'}
      </button>
    </div>
  `;
};

const render = (listaPokemon, append = false) => {
  const tarjetasHTML = listaPokemon.map(crearTarjeta).join('');
  if (append) {
    contenedorResultado.innerHTML += tarjetasHTML;
  } else {
    contenedorResultado.innerHTML = tarjetasHTML;
  }
};

// --- CONSULTA ASÍNCRONA A LA API (HU1, HU2, HU3) ---

// 1. Consulta individual
const obtenerPokemon = async (parametro) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${parametro.toLowerCase()}`;
  const response = await fetch(url);
  
  // HU2: Detección de respuesta 404
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`No se encontró el Pokémon "${parametro}".`);
    }
    throw new Error(`Error del servidor (código: ${response.status}).`);
  }
  
  return await response.json();
};

// Búsqueda principal
const buscarPokemonEnAPI = async (query) => {
  if (!query.trim()) {
    offset = 0;
    cargarPokedexInicial();
    return;
  }

  ultimaBusqueda = query.trim();
  limpiarErrores();
  mostrarCargando();
  contenedorResultado.innerHTML = '';

  try {
    const data = await obtenerPokemon(ultimaBusqueda);
    const pokemonAdaptado = adaptarPokemon(data);
    render([pokemonAdaptado]);
  } catch (error) {
    const esErrorRed = error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
    const mensajeFinal = esErrorRed 
      ? 'Error de conexión a internet. Revisa tu red y vuelve a intentarlo.' 
      : error.message;
      
    // Llama a la función que fuerza la visualización del botón
    mostrarError(mensajeFinal);
  } finally {
    ocultarCargando();
  }
};

    // HU1 & Reto Reintento: Captura de error y despliegue del botón
    const esErrorRed = error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
    const mensajeFinal = esErrorRed 
      ? 'Error de conexión a internet. Revisa tu red y vuelve a intentarlo.' 
      : error.message;
      
    mostrarError(mensajeFinal);
  } finally {
    // HU3: finally asegura que el spinner se oculte en todos los casos
    ocultarCargando();
  }
};

// 3. Carga inicial de la rejilla
const cargarPokedexInicial = async () => {
  limpiarErrores();
  mostrarCargando();

  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('No se pudo obtener la lista de Pokémon.');

    const data = await response.json();
    const promesasDetalles = data.results.map(p => fetch(p.url).then(r => r.json()));
    const detalles = await Promise.all(promesasDetalles);
    const listaAdaptada = detalles.map(adaptarPokemon);

    render(listaAdaptada, offset > 0);
  } catch (error) {
    mostrarError('No se pudo cargar la lista inicial. Verifica tu conexión.');
  } finally {
    ocultarCargando();
  }
};

// --- CAPTURA DE POKÉMON EN ESTADO LOCAL ---
window.capturarPokemon = (id, nombre, imagen) => {
  if (!pokedex.some(p => p.id === id)) {
    pokedex.push({ id, nombre, imagen });
    contadorPokedex.textContent = pokedex.length;

    const botones = document.querySelectorAll(`button[onclick*="${id}"]`);
    botones.forEach(btn => {
      btn.textContent = '✓ Capturado';
      btn.className = 'w-full py-2 px-4 rounded-lg font-semibold text-sm bg-emerald-100 text-emerald-700 border border-emerald-400 cursor-default';
      btn.disabled = true;
    });
  }
};

// --- EVENT LISTENERS ---
btnBuscar.addEventListener('click', () => buscarPokemonEnAPI(inputBuscador.value));

inputBuscador.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') buscarPokemonEnAPI(inputBuscador.value);
});

btnCargarMas.addEventListener('click', () => {
  offset += limit;
  cargarPokedexInicial();
});

btnReintentar.addEventListener('click', () => {
  if (ultimaBusqueda) {
    buscarPokemonEnAPI(ultimaBusqueda);
  } else {
    cargarPokedexInicial();
  }
});

// Inicialización
cargarPokedexInicial();