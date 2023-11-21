// script.js
$(document).ready(function() {
    // URL de la PokeAPI para obtener los tipos de Pokémon
    const apiUrl = "https://pokeapi.co/api/v2/type/";

    // Obtener los tipos de Pokémon desde la PokeAPI
    $.get(apiUrl, function(data) {
        // Llamar a la función para construir y mostrar la tabla
        buildTable(data.results);
    });

    // Función para construir y mostrar la tabla
    function buildTable(types) {
        const tableContainer = $("#table-container");

        // Crear la tabla y su encabezado
        const table = $("<table>");
        const headerRow = $("<tr>");
        headerRow.append("<th>Tipo</th>");
        headerRow.append("<th>Fortalezas</th>");
        headerRow.append("<th>Debilidades</th>");
        table.append(headerRow);

        // Iterar sobre cada tipo
        types.forEach(function(type) {
            // Crear una fila para cada tipo
            const row = $("<tr>");

            // Añadir el nombre del tipo a la fila
            row.append("<td class='type'>" + type.name + "</td>");

            // Obtener las fortalezas y debilidades del tipo desde la PokeAPI
            $.get(type.url, function(typeData) {
                const strengths = typeData.damage_relations.double_damage_to.map(function(strength) {
                    return strength.name;
                });
                const weaknesses = typeData.damage_relations.double_damage_from.map(function(weakness) {
                    return weakness.name;
                });

                // Añadir las fortalezas y debilidades a la fila
                row.append("<td class='strengths'>" + strengths.join(", ") + "</td>");
                row.append("<td class='weaknesses'>" + weaknesses.join(", ") + "</td>");
            });

            // Añadir la fila a la tabla
            table.append(row);
        });

        // Añadir la tabla al contenedor
        tableContainer.append(table);
    }
});
