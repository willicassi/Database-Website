// Citation: Code from Node.JS Starter Guide used as template from source: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 37596;                 // Set a port number at the top so it's easy to change in the future
var db      = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES
*/
// Renders HOMEPAGE
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.

// Renders AUTHORS PAGE
app.get('/authors', function(req, res)
{  
    let query1 = "SELECT * FROM Authors;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('authors', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// Renders BOOKS Page
app.get('/books', function(req, res)
{  
    let query1 = `SELECT Books.bookID, Books.title, Books.price, Publishers.name
    FROM Books LEFT OUTER JOIN Publishers ON Books.publisherID = Publishers.publisherID;`;               // Define our query

    let query2 = `SELECT * from Publishers`;

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        let books = rows

        db.pool.query(query2, function(error, rows, fields){
            let publishers = rows;
            res.render('books', {data: books, publishers: publishers});   
        })                                                 // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// Renders PUBLISHERS Page
app.get('/publishers', function(req, res)
{  
    let query1 = "SELECT * FROM Publishers;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('publishers', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// Renders CUSTOMERS Page
app.get('/customers', function(req, res)
{  
    let query1 = "SELECT * FROM Customers;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('customers', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// Renders ORDERS page
app.get('/orders', function(req, res)
    {  
        let query1 = `SELECT orderID, Orders.customerID, Customers.fName,  Customers.lName, dateOrdered, orderType
        FROM Orders LEFT OUTER JOIN Customers ON Orders.customerID = Customers.customerID;`;               // Define our query

        let query2 = `SELECT customerID, fName, lName, phoneNumber FROM Customers;`;
        
        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            let orders = rows;

            db.pool.query(query2, function(error, rows, fields){
                let customers = rows;
                res.render('orders.hbs', {data: orders, customers: customers});
            })
                                                           // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

// Renders BooksOrders page
app.get('/booksorders', function(req, res)
    {  
        let query1 = `SELECT bookOrderID, Books.title, BooksOrders.orderID, quantity
        FROM BooksOrders INNER JOIN Books ON BooksOrders.bookID = Books.bookID;`;    

        let query2 = 'SELECT bookID, title FROM Books;';

        let query3 = `SELECT Orders.orderID, Customers.customerID, Customers.fName, Customers.lName, dateOrdered
        FROM Orders INNER JOIN Customers ON Orders.customerID = Customers.customerID;`;
        
        // Run Query 1
        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            // Save BooksOrders
            let booksorders = rows;

            // Run Query 2
            db.pool.query(query2, (error, rows, fields) => {

                // Save Books
                let books = rows;

                db.pool.query(query3, (error, rows, fields) => {
                    let orders = rows;

                    res.render('booksorders', {data: booksorders, books: books, orders: orders}); 
                })               
                                                                 // Render the index.hbs file, and also send the renderer
            })   
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

// Renders BOOKS AUTHORS Page
app.get('/booksauthors', function(req, res)
{  
    let query1 = `SELECT bookAuthorID, Books.title, Authors.fName, Authors.lName
    FROM BooksAuthors
    INNER JOIN Authors ON BooksAuthors.authorID = Authors.authorID
    INNER JOIN Books ON BooksAuthors.bookID = Books.bookID;`;               // Define our query

    let query2 = `SELECT * from Authors`;

    let query3 = `SELECT * from Books`;

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        let booksauthors = rows

        db.pool.query(query2, function(error, rows, fields){
            let authors = rows;

            db.pool.query(query3,function(error, rows, fields){
                let books = rows;
            
            res.render('booksauthors', {data: booksauthors, authors: authors, books: books});   
    })})                                                 // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

// POST ROUTE FOR ADD BOOK
app.post('/add-book-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let title = parseInt(data.title);
    if (isNaN(title))
    {
        title = 'NULL'
    }

    let price = parseInt(data.price);
    if (isNaN(price))
    {
        price = 'NULL'
    }

    let name = parseInt(data.name);
    if (isNaN(name))
    {
        name = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title, price, publisherID) VALUES ('${data.title}', '${data.price}',
    (SELECT publisherID FROM Publishers WHERE name='${data.name}'))`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT Books.bookID, Books.title, Books.price, Publishers.name
            FROM Books LEFT OUTER JOIN Publishers ON Books.publisherID = Publishers.publisherID;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST ROUTE FOR ADD AUTHOR
app.post('/add-author-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let fName = parseInt(data.fName);
    if (isNaN(fName))
    {
        fName = 'NULL'
    }

    let lName = parseInt(data.lName);
    if (isNaN(lName))
    {
        lName = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (fName, lName) VALUES ('${data.fName}', '${data.lName}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Authors
            query2 = `SELECT * FROM Authors;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST ROUTE FOR ADD PUBLISHER
app.post('/add-publisher-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Publishers (name) VALUES ('${data.name}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Publishers
            query2 = `SELECT * FROM Publishers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST ROUTE FOR ADD CUSTOMER
app.post('/add-customer-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let fName = data.fName;
    if (isNaN(fName))
    {
        fName = 'NULL'
    }

    let lName = data.lName;
    if (isNaN(lName))
    {
        lName = 'NULL'
    }

    let phoneNumber = data.phoneNumber;
    if (isNaN(phoneNumber))
    {
        phoneNumber = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (fName, lName, phoneNumber) VALUES ('${data.fName}', '${data.lName}', '${data.phoneNumber}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Customers
            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST for Orders form
app.post('/add-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customerID, dateOrdered, orderType) VALUES 
    ('${data.customerID}', '${data.dateOrdered}', '${data.orderType}')`

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Orders
            query2 = `SELECT orderID, Orders.customerID, Customers.fName, Customers.lName, dateOrdered, orderType
            FROM Orders LEFT OUTER JOIN Customers ON Orders.customerID = Customers.customerID;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST ROUTE FOR ADD BOOKSAUTHORS
app.post('/add-booksauthors-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO BooksAuthors (bookID, authorID) VALUES ('${data.bookID}', '${data.authorID}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT on BooksAuthors
            query2 = `SELECT bookAuthorID, Books.title, Authors.fName, Authors.lName
            FROM BooksAuthors
            INNER JOIN Authors ON BooksAuthors.authorID = Authors.authorID
            INNER JOIN Books ON BooksAuthors.bookID = Books.bookID;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// POST ROUTE FOR ADD BooksOrders
app.post('/add-booksorders-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO BooksOrders (bookID, orderID, quantity) VALUES ('${data.bookID}', '${data.orderID}', '${data.quantity}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on BooksOrders
            query2 = `SELECT bookOrderID, Books.title, orderID, quantity
            FROM BooksOrders
            INNER JOIN Books ON BooksOrders.bookID = Books.bookID;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// DELETE for Orders form
app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;
    let orderID = parseInt(data.id);
    let deleteOrder = `DELETE FROM Orders WHERE orderID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteOrder, [orderID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
  })});

// UPDATE ORDER
app.put('/put-order-ajax', function(req,res,next){
    let data = req.body;

    let orderID = parseInt(data.orderID);
    let customerID = parseInt(data.customerID);
    let dateOrdered = data.dateOrdered;
    let orderType = data.orderType;

    if (isNaN(customerID))
        {
            customerID = 'NULL'
        }

    let queryUpdateOrder = `UPDATE Orders SET customerID = (SELECT customerID FROM Customers WHERE customerID = ?),
    dateOrdered = ?, orderType = ? WHERE orderID = ?;`;
    let selectOrder = `SELECT orderID, Orders.customerID, Customers.fName, Customers.lName, dateOrdered, orderType
    FROM Orders LEFT OUTER JOIN Customers ON Orders.customerID = Customers.customerID;`;

            // Run the 1st query
            db.pool.query(queryUpdateOrder, [customerID, dateOrdered, orderType, orderID], function(error, rows, fields){
                if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }

                // If there was no error, we run our second query and return that data so we can use it to update the Orders
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectOrder, [orderID], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


// UPDATE BooksOrders
app.put('/put-booksorders-ajax', function(req,res,next){
    let data = req.body;
  
    let bookID = parseInt(data.bookID);
    let bookOrderID = parseInt(data.bookOrderID);
  
    let queryUpdateBooksOrders = `UPDATE BooksOrders SET bookID = ? WHERE bookOrderID = ?;`;
    let selectBook = `SELECT * FROM Books WHERE bookID = ?;`
  
          // Run the 1st query
          db.pool.query(queryUpdateBooksOrders, [bookID, bookOrderID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the BooksOrders
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectBook, [bookID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// UPDATE BOOKS/AUTHORS
app.put('/put-bookauthor-ajax', function(req,res,next){
    let data = req.body;
    
    let bookID = parseInt(data.bookID);
    let authorID = parseInt(data.authorID);
    let bookAuthorID = parseInt(data.bookAuthorID);

    let queryUpdateOrder = `UPDATE BooksAuthors SET bookID = (SELECT bookID FROM Books WHERE bookID = ?),
    authorID = (SELECT authorID FROM Authors WHERE authorID = ?)
    WHERE bookAuthorID = ?;`;
    let selectBookAuthor = `SELECT bookAuthorID, Books.title, Authors.fName, Authors.lName 
    FROM BooksAuthors INNER JOIN Books ON BooksAuthors.bookID = Books.bookID
    INNER JOIN Authors ON BooksAuthors.authorID = Authors.authorID;`;
    
            // Run the 1st query
            db.pool.query(queryUpdateOrder, [bookID, authorID, bookAuthorID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the BookAuthors'
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectBookAuthor, [bookAuthorID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

// UPDATE BOOKS
app.put('/put-book-ajax', function(req,res,next){
    let data = req.body;
    
    let bookID = parseInt(data.bookID);
    let title = data.title;
    let price = parseInt(data.price);
    let publisherID = parseInt(data.publisherID);

    if (isNaN(publisherID))
        {
            publisherID = 'NULL'
        }    
    
    let queryUpdateBook = `UPDATE Books SET title = ?, price = ?, publisherID = (SELECT publisherID from Publishers WHERE publisherID = ?)
    WHERE bookID = ?;`;
    let selectBooks = `SELECT bookID, title, price, Publishers.name FROM Books
    LEFT OUTER JOIN Publishers ON Books.publisherID = Publishers.publisherID;`;
    
            // Run the 1st query
            db.pool.query(queryUpdateBook, [title, price, publisherID, bookID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the Books
                // table on the front-end
                else
                {
                    // Run the second query
                    db.pool.query(selectBooks, [bookID], function(error, rows, fields) {
    
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

// DELETE BOOKAUTHOR 
app.delete('/delete-bookauthor-ajax/', function(req,res,next){
    let data = req.body;
    let bookAuthorID = parseInt(data.bookAuthorID);
    let deleteBookAuthor = `DELETE FROM BooksAuthors WHERE bookAuthorID = ?`;
    let selectBookAuthor = `SELECT * FROM BooksAuthors;`
    
            // Run the 1st query
            db.pool.query(deleteBookAuthor, [bookAuthorID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                else
                {
                    // Run the second query
                    db.pool.query(selectBookAuthor, function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
 
    })});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
