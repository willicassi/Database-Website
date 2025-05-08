// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateBookAuthorForm = document.getElementById('update-bookauthor-form-ajax');

// Modify the objects we need
updateBookAuthorForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookAuthorID = document.getElementById("input-bookauthorid-update");
    let inputBookID = document.getElementById("input-bookid-update");
    let inputAuthorID = document.getElementById("input-authorid-update")

    // Get the values from the form fields
    let bookAuthorIDValue = inputBookAuthorID.value;
    let bookIDValue = inputBookID.value;
    let authorIDValue = inputAuthorID.value;
    
    // currently the database table for Orders does not allow updating values to NULL
    // so we must abort if being bassed NULL for OrderID

    if (isNaN(bookAuthorIDValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        bookAuthorID: bookAuthorIDValue,
        bookID : bookIDValue,
        authorID: authorIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-bookauthor-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, bookAuthorIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    window.location.href = window.location.href;
    window.location.reload(true);
})


function updateRow(data, bookAuthorID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("booksauthors-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookAuthorID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of bookID
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign book to our value we updated to
            td.innerHTML = parsedData[1].title; 

            // Get td of authorID
            let td2 = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign book to our value we updated to
            td2.innerHTML = parsedData[2].authorID; 
       }
    }
}
