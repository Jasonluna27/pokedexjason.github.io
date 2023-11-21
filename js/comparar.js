$(document).ready(function() {
    
});

// Función para comparar dos Pokémon ingresados por el usuario
function comparePokemon() {
    // Obtiene los nombres de los Pokémon ingresados por el usuario desde los elementos de entrada
    const pokemon1Name = $('#pokemon1Name').val().toLowerCase();
    const pokemon2Name = $('#pokemon2Name').val().toLowerCase();

    // Verifica si se han ingresado ambos nombres
    if (!pokemon1Name || !pokemon2Name) {
        // Muestra una alerta si falta alguno de los nombres
        alert('Ingresa los nombres de ambos Pokémon para comparar.');
        return;
    }

    // Construye las URL de la API para obtener información sobre los Pokémon
    const apiUrl1 = `https://pokeapi.co/api/v2/pokemon/${pokemon1Name}`;
    const apiUrl2 = `https://pokeapi.co/api/v2/pokemon/${pokemon2Name}`;

    // Realiza solicitudes AJAX para obtener información sobre ambos Pokémon
    $.when(
        $.get(apiUrl1),
        $.get(apiUrl2)
    ).done(function(data1, data2) {
        // Cuando ambas solicitudes se completan con éxito, muestra la comparación
        displayComparison(data1[0], data2[0]);
    }).fail(function() {
        // Maneja errores si uno o ambos Pokémon no son encontrados
        alert('Uno o ambos Pokémon no fueron encontrados. Verifica los nombres e intenta de nuevo.');
    });
}

// Función para mostrar la comparación entre dos Pokémon
function displayComparison(pokemon1, pokemon2) {
    // Obtiene el contenedor de resultados
    const resultDiv = $('#result');
    // Limpia cualquier contenido previo en el contenedor
    resultDiv.empty();

    // Obtiene las estadísticas de cada Pokémon
    const stats1 = getStats(pokemon1);
    const stats2 = getStats(pokemon2);

    // Genera tarjetas (cards) para cada Pokémon con sus estadísticas y tipo
    const card1 = generateCard(pokemon1.name, pokemon1.sprites.front_default, stats1, pokemon1.types[0].type.name);
    const card2 = generateCard(pokemon2.name, pokemon2.sprites.front_default, stats2, pokemon2.types[0].type.name);

    // Agrega las tarjetas al contenedor de resultados
    resultDiv.append(card1);
    resultDiv.append(card2);

    // Compara las estadísticas y muestra al ganador
    const winner = compareStats(stats1, stats2);
    resultDiv.append(`<p id="winner-text"><strong>Ganador:</strong> ${winner}</p>`);
}

// Función para obtener las estadísticas de un Pokémon
function getStats(pokemon) {
    return {
        attack: pokemon.stats[4].base_stat,
        defense: pokemon.stats[3].base_stat
    };
}

// Función para comparar las estadísticas y determinar al ganador
function compareStats(stats1, stats2) {
    const totalStats1 = stats1.attack + stats1.defense;
    const totalStats2 = stats2.attack + stats2.defense;

    // Compara las estadísticas totales y determina al ganador
    if (totalStats1 > totalStats2) {
        return $('#pokemon1Name').val();
    } else if (totalStats1 < totalStats2) {
        return $('#pokemon2Name').val();
    } else {
        return 'Empate';
    }
}

// Función para generar el código HTML de una tarjeta (card) para un Pokémon
function generateCard(name, imageUrl, stats, type) {
    // Utiliza un template string para generar la estructura HTML de la tarjeta
    return `
        <div class="card ${type.toLowerCase()}">
            <h2>${name}</h2>
            <img src="${imageUrl}" alt="${name}">
            <p>Ataque: ${stats.attack}</p>
            <p>Defensa: ${stats.defense}</p>
        </div>
    `;
}
