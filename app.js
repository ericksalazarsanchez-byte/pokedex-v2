// ==========================================
// LABORATORIO 11: POKÉDEX ASYNC/AWAIT
// ==========================================

// Estado global de la aplicación
const pokedex = [];
let offset = 0;
const limit = 12;

// Elementos del DOM
const contenedorResultado = document.getElementById('resultado');
const inputBuscador = document.getElementById('buscador');
const btnBuscar = document.getElementById('btn-buscar');
const btnCargarMas = document.getElementById('btn-cargar-mas');
const contadorPokedex = document.getElementById('contador-pokedex');

// Adaptar el JSON devuelto por PokeAPI (HU4: Estadísticas extras)
const adaptarPokemon = (data) => {
  const hp = data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
  const ataque = data.stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
  const defensa = data.stats.find(s => s.stat.name === 'defense')?.base_stat || 0;

  return {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    tipos: data.types.map(t => t.type.name),
    hp: hp,
    ataque: ataque,
    defensa: defensa
  };
};

// Crear tarjeta HTML individual (HU3: Botón Capturar)
const crearTarjeta = (pokemon) => {
  const yaCapturado = pokedex.some(p => p.id === pokemon.id);

  return `
    <div class="bg-white rounded-xl shadow-md p-4 text-center flex flex-col items-center justify-between">
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}" class="w-32 h-32 object-contain mb-2">
      <span class="text-xs font-bold text-slate-400">#${String(pokemon.id).padStart(3, '0')}</span>
      <h3 class="text-xl font-bold capitalize text-slate-800 mb-1">${pokemon.nombre}</h3>
      
      <div class="flex gap-2 mb-3">
        ${pokemon.tipos.map(tipo => `
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-700 capitalize">
            ${tipo}
          </span>
        `).join('')}
      </div>

      <!-- HU4: Estadísticas -->
      <div class="w-full text-xs text-slate-600 border-t pt-2 mb-3 grid grid-cols-3 gap-1">
        <div><strong>HP:</strong> ${pokemon.hp}</div>
        <div><strong>Atq:</strong> ${pokemon.ataque}</div>
        <div><strong>Def:</strong> ${pokemon.defensa}</div>
      </div>

      <!-- HU3: Botón de captura -->
      <button 
        onclick="capturarPokemon(${pokemon.id}, '${pokemon.nombre}', '${pokemon.imagen}')"
        class="w-full py-2 px-4 rounded-lg font-semibold text-sm transition ${
          yaCapturado 
            ? 'bg-green-100 text-green-700 border border-green-400 cursor-default' 
            : 'bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-sm'
        }"
        ${yaCapturado ? 'disabled' : ''}
      >
        ${yaCapturado ? '✓ Capturado' : '⚡ Capturar'}
      </button>
    </div>
  `;
};

// Renderizar lista de Pokémon
const render = (listaPokemon, append = false) => {
  const tarjetasHTML = listaPokemon.map(crearTarjeta).join('');
  if (append) {
    contenedorResultado.innerHTML += tarjetasHTML;
  } else {
    contenedorResultado.innerHTML = tarjetasHTML;
  }
};

// HU1 & HU5: Cargar rejilla con async/await y parámetros de consulta (?limit & ?offset)
const cargarPokemon = async () => {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();

    // Obtener detalles completos de cada Pokémon en paralelo
    const promesasDetalles = data.results.map(async (p) => {
      const res = await fetch(p.url);
      return await res.json();
    });

    const detalles = await Promise.all(promesasDetalles);
    const listaAdaptada = detalles.map(adaptarPokemon);

    render(listaAdaptada, offset > 0);
  } catch (error) {
    console.error('Error cargando lista de Pokémon:', error);
  }
};

// HU2: Buscar Pokémon en la API por nombre o ID con async/await
const buscarPokemonEnAPI = async (query) => {
  if (!query.trim()) {
    offset = 0;
    cargarPokemon();
    return;
  }

  const termino = query.trim().toLowerCase();
  contenedorResultado.innerHTML = `<p class="text-center text-slate-500 col-span-3">Buscando en PokeAPI...</p>`;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${termino}`);
    if (!response.ok) {
      contenedorResultado.innerHTML = `<p class="text-center text-red-500 col-span-3">No se encontró ningún Pokémon llamado "${termino}".</p>`;
      return;
    }
    const data = await response.json();
    const pokemonAdaptado = adaptarPokemon(data);
    render([pokemonAdaptado]);
  } catch (error) {
    contenedorResultado.innerHTML = `<p class="text-center text-red-500 col-span-3">Error al realizar la búsqueda.</p>`;
  }
};

// HU3: Capturar Pokémon sin duplicados
window.capturarPokemon = (id, nombre, imagen) => {
  const existe = pokedex.some(p => p.id === id);
  if (!existe) {
    pokedex.push({ id, nombre, imagen });
    contadorPokedex.textContent = pokedex.length;
    console.log('Pokédex actualizada:', pokedex);
    
    // Volver a renderizar la búsqueda/lista para actualizar estado del botón
    const query = inputBuscador.value;
    if (query.trim()) {
      buscarPokemonEnAPI(query);
    } else {
      // Actualizar interfaz actual
      const botones = document.querySelectorAll(`button[onclick*="${id}"]`);
      botones.forEach(btn => {
        btn.textContent = '✓ Capturado';
        btn.className = 'w-full py-2 px-4 rounded-lg font-semibold text-sm bg-green-100 text-green-700 border border-green-400 cursor-default';
        btn.disabled = true;
      });
    }
  }
};

// Event Listeners
btnBuscar.addEventListener('click', () => {
  buscarPokemonEnAPI(inputBuscador.value);
});

inputBuscador.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    buscarPokemonEnAPI(inputBuscador.value);
  }
});

btnCargarMas.addEventListener('click', () => {
  offset += limit;
  cargarPokemon();
});

// Inicialización
cargarPokemon();