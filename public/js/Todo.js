var myModule = (function() {

    /* Creating empty todo list and appending it to root element, setting event handlers
     * If the list is a available it will be displayed with function show()
     */
    function init(rootId) {
        var rootEl = $("#" + rootId);
        var textBox = rootEl.find(".form-control");
        var addButton = rootEl.find("button");
        var list = $('<table class="table"></table>');
        rootEl.append(list);
        textBox.keypress(onAddItem.bind(textBox, rootId, list));
        addButton.click(onAddItem.bind(textBox, rootId, list));
        show(list, rootId);
    }

    /* This function retrieves list items with get_todos() and ID of root element,
     * builds and inserts items to list
     * and sets handler for remove button
     */
    function show(list, rootId) {
        var todos = get_todos(rootId);

        var content = '';
        for (var i = 0; i < todos.length; i++) {
            content += '<tr><td><b>' + todos[i] + '</b></td><td class="tabledata"><button class="btnDelete btn btn-default">Remove</button></td></tr>';
        }
        list.html(content);

        $('.btnDelete').click(onRemoveItem.bind(rootId));
    }

    /* If the list is empty, get_todos() returns empty array.
     * Otherwise it gets and parses localStorage object for given ID of root element
     */
    function get_todos(rootId) {
        return JSON.parse(localStorage.getItem(rootId)) || [];
    }

    /* Handler for add button click and enter keypress. Here I validate 
     * user's input with regex re and send ajax request for server-side validation.
     * If input is correct buildLine() will add it to localStorage and build new line to the list,
     * otherwise there will be error message in console and input placeholder will change to "Incorrect input value"
     */
    function onAddItem(rootId, list) {
        if ($("#" + rootId).hasClass('has-error')) {
            $("#" + rootId).removeClass('has-error');       //clear input after invalid value
            $(this).attr('placeholder', '   Add your item')
        };

        if (event.keyCode == 13 || event.type == "click") { //checking if event is relevant

            

            var inputData = this.val();
            var re = /^[\w\s]+$/;

            if (re.test(inputData)) {                       // client-side validation

                $.ajax({
                    type: "POST",
                    url: '/index',
                    data: inputData
                }).done(function(data) {
                    console.log(data);
                    if (data) {                             // if server returns true new line will be added to the list 
                        buildLine(rootId, list, inputData);
                    }
                });
                
            } else {
                console.log("Error. Input not valid!");
                $("#" + rootId).find('input').attr('placeholder', 'Incorrect input value').val('').focus();
                $("#" + rootId).addClass('has-error');
            }
        }
    }

    function buildLine(rootId, list, inputData) {
        var todos = get_todos(rootId);
        todos.push(inputData);

        localStorage.setItem(rootId, JSON.stringify(todos));

        list.append('<tr><td><b>' + inputData + '</b></td><td class="tabledata"><button class="btnDelete btn btn-default">Remove</button></td></tr>');

        $('.btnDelete').click(onRemoveItem.bind(rootId));

        $("#" + rootId).find('input').val('').focus();
    }

    /* Handler for remove button retrieves array of list items, finds and removes from it 
     * value of the line where button was clicked. Then it removes  <tr> element from the DOM
     * and event handler for the button. 
     * After that it sets changed array of items to localStorage in JSON format 
     */
    function onRemoveItem() {
        var todos = get_todos(this);
        var data = $(event.target).parent().prev().text();
        var index = todos.indexOf(data);
        if (index > -1) {
            todos.splice(index, 1);
        }
        $(event.target).closest("tr").remove();
        $(event.target).off();
        localStorage.setItem(this, JSON.stringify(todos));
    }

    /* Public method of module
     */
    return {
        create: init            
    };
})();
