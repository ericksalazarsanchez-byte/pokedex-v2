let pokedex = [];

const nombresPokemon = ["bulbasaur", "charmander", "squirtle", "pikachu", "jigglypuff", "eevee"];

const coloresPorTipo = {
  fuego: "bg-red-200 text-red-800",
  fire: "bg-red-200 text-red-800",
  agua: "bg-blue-200 text-blue-800",
  water: "bg-blue-200 text-blue-800",
  planta: "bg-green-200 text-green-800",
  grass: "bg-green-200 text-green-800",
  eléctrico: "bg-yellow-200 text-yellow-800",
  electric: "bg-yellow-200 text-yellow-800",
  veneno: "bg-purple-200 text-purple-800",
  poison: "bg-purple-200 text-purple-800",
  normal: "bg-gray-200 text-gray-800",
  hada: "bg-pink-200 text-pink-800",
  fairy: "bg-pink-200 text-pink-800",
  psíquico: "bg-fuchsia-200 text-fuchsia-800",
  psychic: "bg-fuchsia-200 text-fuchsia-800"
};

const traduccionTipos = {
  grass: "planta",
  poison: "veneno",
  fire: "fuego",
  water: "agua",
  electric: "eléctrico",
  normal: "normal",
  fairy: "hada",
  psychic: "psíquico"
};

const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");

function mostrarSpinner() {
  contenedor.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-12">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-slate-600 mt-4 font-medium">Cargando Pokédex de la web...</p>
    </div>
  `;
}

function adaptarPokemon(data) {
  const tiposTraducidos = data.types.map(t => traduccionTipos[t.type.name] || t.type.name);
  const hpStat = data.stats.find(s => s.stat.name === "hp");

  return {
    id: data.id,
    nombre: data.name,
    imagen: data.sprites.other["official-artwork"].front_default || data.sprites.front_default || "https://via.placeholder.com/96?text=?",
    tipos: tiposTraducidos,
    hp: hpStat ? hpStat.base_stat : 50,
    nivel: Math.floor(Math.random() * 20) + 5
  };
}

function crearTarjeta(pokemon) {
  const { nombre, imagen, tipos, hp, nivel } = pokemon;
  const img = imagen ?? "https://via.placeholder.com/96?text=?";
  const [principal = "normal"] = tipos;

  const badges = tipos.map(tipo => {
    const claseColor = coloresPorTipo[tipo] ?? "bg-slate-200 text-slate-700";
    return `<span class="text-xs ${claseColor} px-2 py-1 rounded-full capitalize font-semibold">${tipo}</span>`;
  }).join("");

  const articulo = document.createElement("article");
  articulo.className = "bg-white rounded-xl shadow-md p-4 text-center transform hover:scale-105 transition duration-200";

  articulo.innerHTML = `
    <img src="${img}" alt="${nombre}" class="w-28 h-28 mx-auto object-contain">
    <h2 class="capitalize font-bold text-slate-800 mt-2 text-lg">${nombre}</h2>
    <p class="text-xs text-slate-500 mb-1">Tipo principal: <span class="capitalize font-medium">${principal}</span></p>
    <div class="flex justify-center items-center gap-3 text-xs text-slate-600 mb-2 font-medium">
      <span>Nivel: <strong class="text-slate-800">${nivel}</strong></span>
      <span>HP: <strong class="text-emerald-600">${hp}</strong></span>
    </div>
    <div class="flex gap-1 justify-center mt-2 flex-wrap">
      ${badges}
    </div>
  `;

  return articulo;
}

function render(lista) {
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8 italic">No se encontraron Pokémon.</p>`;
    return;
  }

  lista.forEach(pokemon => {
    const tarjeta = crearTarjeta(pokemon);
    contenedor.appendChild(tarjeta);
  });
}

function cargarPokedex() {
  mostrarSpinner();

  const peticiones = nombresPokemon.map(nombre => 
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
      .then(respuesta => respuesta.json())
      .then(datosApi => adaptarPokemon(datosApi))
  );

  Promise.all(peticiones)
    .then(listaAdaptada => {
      pokedex = listaAdaptada;
      render(pokedex);
    })
    .catch(error => {
      contenedor.innerHTML = `<p class="col-span-full text-center text-red-500 py-8">Error al cargar datos de la web.</p>`;
    });
}

buscador.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase().trim();
  const filtrados = pokedex.filter(p => p.nombre.toLowerCase().includes(texto));
  render(filtrados);
});

cargarPokedex();