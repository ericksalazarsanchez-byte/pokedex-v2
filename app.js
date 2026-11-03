const pokemonLocal = [
  { id: 1, nombre: "bulbasaur", hp: 45, nivel: 5, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", tipos: ["planta", "veneno"] },
  { id: 4, nombre: "charmander", hp: 39, nivel: 5, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png", tipos: ["fuego"] },
  { id: 7, nombre: "squirtle", hp: 44, nivel: 5, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png", tipos: ["agua"] },
  { id: 25, nombre: "pikachu", hp: 35, nivel: 12, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", tipos: ["eléctrico"] },
  { id: 39, nombre: "jigglypuff", hp: 115, nivel: 8, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png", tipos: ["normal", "hada"] },
  { id: 133, nombre: "eevee", hp: 55, nivel: 10, imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png", tipos: ["normal"] }
];

const nuevoPokemon = {
  id: 150,
  nombre: "mewtwo",
  hp: 106,
  nivel: 70,
  imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  tipos: ["psíquico"]
};
const listaAmpliada = [...pokemonLocal, nuevoPokemon];

const coloresPorTipo = {
  fuego: "bg-red-200 text-red-800",
  agua: "bg-blue-200 text-blue-800",
  planta: "bg-green-200 text-green-800",
  eléctrico: "bg-yellow-200 text-yellow-800",
  veneno: "bg-purple-200 text-purple-800",
  normal: "bg-gray-200 text-gray-800",
  hada: "bg-pink-200 text-pink-800",
  psíquico: "bg-fuchsia-200 text-fuchsia-800"
};

const contenedor = document.getElementById("resultado");
const buscador = document.getElementById("buscador");

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
      <span>Nivel: <strong class="text-slate-800">${nivel ?? 1}</strong></span>
      <span>HP: <strong class="text-emerald-600">${hp ?? 50}</strong></span>
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

buscador.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase().trim();
  const filtrados = listaAmpliada.filter(p => p.nombre.toLowerCase().includes(texto));
  render(filtrados);
});

render(listaAmpliada);