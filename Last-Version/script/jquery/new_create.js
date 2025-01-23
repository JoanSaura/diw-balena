$(document).ready(function () {
    const addRowBtn = $('#add-row');
    const paragraphTool = $('.tool-paragraph');
    const imageTool = $('.tool-img');
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const loginName = document.getElementById("username");

    function setDateAndUser() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();
        $('#news-date').text(formattedDate);

        const username = currentUser ? currentUser.name : 'Usuario';
        $('#news-username').text('Autor: ' + username);
    }

    setDateAndUser();

    paragraphTool.attr("data-type", "paragraph");
    imageTool.attr("data-type", "image");

    paragraphTool.draggable({
        helper: "clone",
        revert: "invalid",
    });

    imageTool.draggable({
        helper: "clone",
        revert: "invalid",
    });

    function initializeDroppable() {
        $(".blanck-content").droppable({
            accept: ".tool-paragraph, .tool-img",
            drop: function (event, ui) {
                const type = ui.draggable.data("type");

                const isDoubleElement = $(this).hasClass("double-element");
                const currentElements = $(this).children(".content-element").length;

                if ((isDoubleElement && currentElements >= 1) || (!isDoubleElement && currentElements >= 1)) {
                    alert("Aquest espai ja té el nombre màxim d'elements permès.");
                    return;
                }

                let newElement;
                if (type === "paragraph") {
                    newElement = $(`  
                        <div class="content-element">
                            <textarea class="editable"></textarea>
                        </div>
                    `);
                } else if (type === "image") {
                    newElement = $(`  
                        <div class="content-element">
                            <input type="file" accept="image/*" onchange="loadImage(event)" />
                            <img src="" alt="Imatge" style="display: none;">
                        </div>
                    `);
                }

                $(this).find('h3').remove();
                $(this).removeClass("blanck-content");
                $(this).append(newElement);
                makeElementsDraggable();
            }
        });
    }

    function makeElementsDraggable() {
        $(".content-element").draggable({
            helper: "original",
            revert: "invalid",
        });
    }

    addRowBtn.click(function () {
        const choice = parseInt($('#choice').val());
        const newsContainer = $('#news-body');

        if (choice === 1) {
            const singleRow = $('<section class="single-row"></section>');
            const singleElement = $('<div class="single-element blanck-content"></div>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            singleRow.append(singleElement);
            eraseContainer.append(eraseButton);
            newsContainer.append(singleRow);
            newsContainer.append(eraseContainer);

            if (singleElement.children('h3').length === 0) {
                singleElement.append('<h3>Espai en blanc</h3>');
            }

            eraseButton.click(function () {
                singleRow.remove();
                eraseContainer.remove();
            });

        } else if (choice === 2) {
            const doubleRow = $('<section class="double-row"></section>');
            const element1 = $('<div class="double-element blanck-content"></div>');
            const element2 = $('<div class="double-element blanck-content"></div>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            doubleRow.append(element1).append(element2);
            eraseContainer.append(eraseButton);
            newsContainer.append(doubleRow);
            newsContainer.append(eraseContainer);

            [element1, element2].forEach(el => {
                if (el.children('h3').length === 0) {
                    el.append('<h3>Espai en blanc</h3>');
                }
            });

            eraseButton.click(function () {
                doubleRow.remove();
                eraseContainer.remove();
            });
        }

        initializeDroppable();
    });

    $("#save-config").on("click", function () {
        const rows = [];
        $(".single-row, .double-row").each(function () {
            const row = [];
            $(this).find(".blanck-content").each(function () {
                const column = [];
                const isEmpty = $(this).children(".content-element").length === 0;

                if (isEmpty) {
                    column.push({ isEmpty: true });
                } else {
                    $(this).children(".content-element").each(function () {
                        if ($(this).find("textarea").length) {
                            column.push({
                                type: "paragraph",
                                content: $(this).find("textarea").val(),
                                isEmpty: false,
                            });
                        } else if ($(this).find("img").length) {
                            column.push({
                                type: "image",
                                src: $(this).find("img").attr("src"),
                                isEmpty: false,
                            });
                        }
                    });
                }
                row.push(column);
            });
            rows.push(row);
        });

        const config = JSON.stringify(rows);
        localStorage.setItem("pageBuilderConfig", config);
        alert("Configuració guardada al navegador.");
    });

    $("#load-config").on("click", function () {
        const config = localStorage.getItem("pageBuilderConfig");
        if (!config) {
            alert("No hi ha cap configuració guardada.");
            return;
        }

        const rows = JSON.parse(config);
        $("#news-body").empty();
        rows.forEach(row => {
            const newRow = $('<section></section>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const eraseButton = $('<button class="erase-content">Elimina fila</button>');

            row.forEach(column => {
                const isDouble = column.length > 1;
                const elementClass = isDouble ? 'double-element' : 'single-element';
                const newElement = $(`<div class="${elementClass} blanck-content"></div>`);

                column.forEach(item => {
                    if (item.isEmpty) {
                        newElement.append('<h3>Espai en blanc</h3>');
                    } else if (item.type === "paragraph") {
                        newElement.append(` 
                            <div class="content-element">
                                <textarea class="editable">${item.content}</textarea>
                            </div>`);
                    } else if (item.type === "image") {
                        newElement.append(` 
                            <div class="content-element">
                                <img src="${item.src}" alt="Imatge">
                            </div>`);
                    }
                });

                newRow.append(newElement);
            });

            eraseContainer.append(eraseButton);
            $("#news-body").append(newRow).append(eraseContainer);

            eraseButton.click(function () {
                newRow.remove();
                eraseContainer.remove();
            });
        });

        initializeDroppable();
    });

    initializeDroppable();
});
