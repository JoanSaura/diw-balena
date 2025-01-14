$(document).ready(function () {
    const addRow = $('#add-row');

    addRow.click(function() {
        const prototypeNew = $('#prototype-new')
        const choice = parseInt($('#choice').val());  
        const newsBody = $('#news-body');  

        if (choice === 1) {
            const singleRow = $('<section class="single-row"></section>');
            const singleElement = $('<div class="single-element"></div>');
            const EraseBtn = $('<button class="erase-content">Borra</button>');  

            singleRow.append(singleElement); 
            newsBody.append(singleRow);  
            prototypeNew.append(EraseBtn);  

            EraseBtn.click(function() {
                singleRow.remove(); 
                EraseBtn.remove();
            });

        } else if (choice === 2) {
            const doubleRow = $('<section class="double-row"></section>');
            const element1 = $('<div class="double-element element-1"></div>');
            const element2 = $('<div class="double-element element-2"></div>');
            const EraseBtn = $('<button class="erase-content">Borra</button>');  

            doubleRow.append(element1).append(element2);  
            newsBody.append(doubleRow);  
            prototypeNew.append(EraseBtn);  

            EraseBtn.click(function() {
                doubleRow.remove();  
                EraseBtn.remove();

            });
        }
    });
});
