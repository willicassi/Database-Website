// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBookID = document.getElementById("input-bookid-update");
    let inputTitle = document.getElementById("input-title-update");
    let inputPrice = document.getElementById("input-price-update");
    let inputPublisher = document.getElementById("input-publisherid-update");

    // Get the values from the form fields
    let bookIDValue = inputBookID.value;
    let titleValue = inputTitle.value;
    let priceValue = inputPrice.value;
    let publisherValue = inputPublisher.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        bookID: bookIDValue,
        title: titleValue,
        price: priceValue,
        publisherID: publisherValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, bookIDValue);

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


function updateRow(data, bookID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("books-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookID) {

            // Get the location of the row where we found the matching book ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of title value
            let td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign title to our value we updated to
            td.innerHTML = parsedData[1].title; 

            // Get td of price value
            let td1 = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign price to our value we updated to
            td1.innerHTML = parsedData[2].price;

            // Get td of publisher value
            let td2 = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign publisher to our value we updated to
            td2.innerHTML = parsedData[3].name; 
       }
    }
}
