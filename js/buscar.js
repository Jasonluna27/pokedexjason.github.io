$(document).ready(function () {
    const cardContainer = document.getElementById("card-container");

    // Función para obtener los detalles de un Pokémon por nombre
    function getPokemonDetailsByName(name) {
        const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

        return $.get(`${apiUrl}${name}`, function (data) {
            const pokemonInfo = extractPokemonInfo(data);
            displayPokemonCard(pokemonInfo);
        });
    }

    // Función para obtener los detalles de un Pokémon por tipo
    function getPokemonDetailsByType(type) {
        const apiUrl = `https://pokeapi.co/api/v2/type/${type}`;

        return $.get(apiUrl, function (data) {
            const pokemonList = data.pokemon;

            // Limpiar el contenedor de cartas antes de mostrar nuevos resultados
            cardContainer.innerHTML = "";

            pokemonList.forEach(function (pokemon) {
                const name = pokemon.pokemon.name;
                getPokemonDetailsByName(name);
            });
        });
    }

    // Función para obtener los detalles de un Pokémon por generación
    function getPokemonDetailsByGeneration(generation) {
        const apiUrl = (generation === "none") ?
            "https://pokeapi.co/api/v2/pokemon/?limit=1051" : // Sin restricciones de generación
            `https://pokeapi.co/api/v2/pokemon/?limit=151&offset=${(generation - 1) * 151}`;
    
        return $.get(apiUrl, function (data) {
            const pokemonList = data.results;
    
            // Obtener detalles directamente desde la lista proporcionada por la API
            const promises = pokemonList.map(function (pokemon) {
                return $.get(pokemon.url);
            });
    
            // Esperar a que todas las solicitudes se completen
            $.when.apply($, promises).done(function () {
                // Argumentos son los resultados de las solicitudes
                for (let i = 0; i < arguments.length; i++) {
                    const pokemonData = arguments[i][0];
                    const pokemonInfo = extractPokemonInfo(pokemonData);
                    displayPokemonCard(pokemonInfo);
                }
            });
        });
    }

    // Función para extraer la información relevante de un Pokémon
    function extractPokemonInfo(data) {
    return {
        id: data.id,
        name: capitalizeFirstLetter(data.name),
        type: data.types[0].type.name,
        imageUrl: data.sprites.front_default,
    };
}

// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

    // Función para mostrar la carta de un Pokémon
    function displayPokemonCard(pokemonInfo) {
        const card = document.createElement("div");
        card.className = "card";
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
    }

    // Función para realizar la búsqueda de Pokémon
    window.performSearch = function () {
        const name = document.getElementById("pokemon-name").value.toLowerCase();
        const type = document.getElementById("pokemon-type").value.toLowerCase();
        const generation = document.getElementById("pokemon-generation").value;

        // Limpiar el contenedor de cartas antes de realizar la búsqueda
        cardContainer.innerHTML = "";

        // Realizar la búsqueda por nombre
        if (name) {
            getPokemonDetailsByName(name);
            return;
        }

        // Realizar la búsqueda por tipo
        if (type) {
            getPokemonDetailsByType(type);
            return;
        }

        // Realizar la búsqueda por generación
        if (generation) {
            getPokemonDetailsByGeneration(generation);
            return;
        }
    };

    // Obtener los detalles de los primeros N Pokémon al cargar la página
    $.get("https://pokeapi.co/api/v2/pokemon/?limit=151", function (data) {
        const pokemonList = data.results;

        // Iterar a través de la lista de Pokémon y obtener sus detalles
        pokemonList.forEach(function (pokemon) {
            getPokemonDetailsByName(pokemon.name);
        });
    });
});
