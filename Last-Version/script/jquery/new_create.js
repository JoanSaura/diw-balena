$(document).ready(function () {
    const addRow = $('#add-row');
    const toolparagraph = $('.tool-paragraph');
    const toolimg = $('.tool-img');

    toolparagraph.draggable({
        helper: "clone",
    });

    toolimg.draggable({
        helper: "clone",
    });

    addRow.click(function () {
        const choice = parseInt($('#choice').val());
        const newsBody = $('#news-body');

        if (choice === 1) {
            const singleRow = $('<section class="single-row"></section>');
            const singleElement = $('<div class="single-element blanck-content"></div>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const EraseBtn = $('<button class="erase-content">Borra</button>');

            singleRow.append(singleElement);
            newsBody.append(singleRow);
            eraseContainer.append(EraseBtn);
            newsBody.append(eraseContainer);

            $(".blanck-content").each(function () {
                if ($(this).children('h3').length === 0) {
                    $(this).append('<h3>Espai en blanc</h3>');
                }
            });

            EraseBtn.click(function () {
                singleRow.remove();
                eraseContainer.remove();
            });

        } else if (choice === 2) {
            const doubleRow = $('<section class="double-row"></section>');
            const element1 = $('<div class="double-element element-1 blanck-content"></div>');
            const element2 = $('<div class="double-element element-2 blanck-content"></div>');
            const eraseContainer = $('<div class="erase-container"></div>');
            const EraseBtn = $('<button class="erase-content">Borra</button>');

            doubleRow.append(element1).append(element2);
            newsBody.append(doubleRow);
            eraseContainer.append(EraseBtn);
            newsBody.append(eraseContainer);

            $(".blanck-content").each(function () {
                if ($(this).children('h3').length === 0) {
                    $(this).append('<h3>Espai en blanc</h3>');
                }
            });

            EraseBtn.click(function () {
                doubleRow.remove();
                eraseContainer.remove();
            });
        }
    });
});
