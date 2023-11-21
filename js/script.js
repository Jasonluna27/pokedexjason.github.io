// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(document).ready(function () {
    const cardContainer = document.getElementById("card-container");
    const numberOfPokemon = 1051; // Número de cartas que deseas mostrar

    // Realizar una solicitud a la PokeAPI para obtener los primeros N Pokémon
    $.get(`https://pokeapi.co/api/v2/pokemon/?limit=${numberOfPokemon}`, function (data) {
        const pokemonList = data.results;

        // Crear una matriz para almacenar los detalles de los Pokémon
        const pokemonDetails = [];

        // Iterar a través de la lista de Pokémon y obtener sus detalles
        pokemonList.forEach(function (pokemon, index) {
            $.get(pokemon.url, function (data) {
                const name = capitalizeFirstLetter(data.name); // Capitalizar el nombre
                const id = data.id;
                const type = data.types[0].type.name;
                const imageUrl = data.sprites.front_default;

                // Almacenar los detalles en un objeto
                const pokemonInfo = {
                    id,
                    name,
                    type,
                    imageUrl,
                };

                pokemonDetails.push(pokemonInfo);

                // Si hemos obtenido los detalles de todos los Pokémon
                if (pokemonDetails.length === numberOfPokemon) {
                    // Ordenar los Pokémon por su número ascendente
                    pokemonDetails.sort((a, b) => a.id - b.id);

                    // Crear cartas en orden ascendente
                    pokemonDetails.forEach(pokemonInfo => {
                        const card = document.createElement("div");
                        card.className = "card";

                        // Agregar una clase que corresponde al tipo de Pokémon
                        card.classList.add(pokemonInfo.type);

                        card.innerHTML = `
                            <h2>${pokemonInfo.name}</h2>
                            <p>Número: ${pokemonInfo.id}</p>
                            <img src="${pokemonInfo.imageUrl}" alt="${pokemonInfo.name}">
                            <div class="types">
                                <div class="type">${pokemonInfo.type}</div>
                            </div>
                        `;

                        cardContainer.appendChild(card);
                    });
                }
            });
        });
    });
});
