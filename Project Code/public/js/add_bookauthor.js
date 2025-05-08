// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let addBookAuthorForm = document.getElementById('add-booksauthors-form-ajax');

// Modify the objects we need
addBookAuthorForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("input-title");
    let inputAuthor = document.getElementById("input-author");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let authorValue = inputAuthor.value;

    // Put our data we want to send in a javascript object
    let data = {
        bookID: titleValue,
        authorID: authorValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-booksauthors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitle.value = '';
            inputAuthor.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from 
// BooksAuthors
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("booksauthors-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let bookCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.bookAuthorID;
    bookCell.innerText = newRow.title;
    firstNameCell.innerText = newRow.fName;
    lastNameCell.innerText = newRow.lName;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteBookAuthor(newRow.bookAuthorID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(bookCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.bookAuthorID);
    
    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("input-bookauthorid-update");
    let option = document.createElement("option");
    option.text = newRow.bookAuthorID + ': ' +  newRow.title + ' - ' + newRow.fName + ' ' + newRow.lName;
    option.value = newRow.bookAuthorID;
    selectMenu.add(option);
}
