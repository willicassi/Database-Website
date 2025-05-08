-- Group 55: Meadowlark Books
-- Database Manipulation Queries for Meadowlark Books


-- Customers Queries --

-- get all customers and info for browse customer page
SELECT * FROM Customers;

-- add new customer info
INSERT INTO Customers (fName, lName, phoneNumber) VALUES
(:fNameInput, :lNameInput, :phoneNumberInput);


-- Orders Queries --

-- get all orders for browse order page
SELECT orderID, Orders.customerID, Customers.fName,  Customers.lName, dateOrdered, orderType
FROM Orders LEFT OUTER JOIN Customers ON Orders.customerID = Customers.customerID;

-- adding new order requires: selecting customer
SELECT customerID, fName, lName, phoneNumber FROM Customers;

-- add new order info
INSERT INTO Orders (customerID, dateOrdered, orderType) VALUES
((SELECT Customers.customerID FROM Customers WHERE customerID = 
 :customerIDSelection), :dateOrderedInput, :orderTypeInput)

-- edit existing order info
UPDATE Orders SET customerID = (SELECT customerID FROM Customers WHERE customerID = :customerIDselection), dateOrdered = :dateOrderedInput, orderType = :orderTypeInput WHERE orderID = :orderIDSelection;

-- delete order
DELETE FROM Orders WHERE orderID = :orderIDSelection;


-- Books Queries --

-- get all books and info for browse books page
SELECT Books.bookID, Books.title, Books.price, Publishers.name
FROM Books LEFT OUTER JOIN Publishers ON Books.publisherID = Publishers.publisherID;

-- add new book info
INSERT INTO Books (title, price, publisherID) VALUES
(:titleInput, :priceInput, :publisherIDFromDropdownInput);

-- dropdown to select publisherID
SELECT publisherID, name AS 'Name' FROM Publishers;

-- display existing book info of selected bookID
SELECT bookID, title AS 'Title', price AS 'Price', Publishers.name as 'Publisher' FROM Books
INNER JOIN Books ON Publishers.publisherID = Books.publisherID
WHERE bookID = :bookIDselection;

-- edit existing book info
UPDATE Books SET title = :titleInput, price = :priceInput, publisherID = :publisherIDFromDropdownInput
WHERE bookID = :bookIDselection;


-- BooksOrders Queries --

-- display all books in a selected order
SELECT bookOrderID, Books.title, quantity 
	FROM BooksOrders
	INNER JOIN Books ON BooksOrders.bookID = Books.bookID
    WHERE BooksOrders.orderID = :orderIDSelection;

-- add books to order
INSERT INTO BooksOrders (bookID, orderID, quantity) VALUES
((SELECT bookID FROM Books where bookID = :bookIDSelection), (SELECT orderID FROM Orders WHERE orderID = :orderIDSelection), :quantityInput);


-- Authors Queries --

-- get all Authors for browse author page
SELECT * FROM Authors;

-- add new Author info
INSERT INTO Authors (fName, lName) VALUES
(:fNameInput, :lNameInput);


-- BooksAuthors Queries --

-- display all authors for a selected book
SELECT bookAuthorID, Books.title, Authors.fName, Authors.lName
    FROM BooksAuthors
    INNER JOIN Authors ON BooksAuthors.authorID = Authors.authorID
    INNER JOIN Books ON BooksAuthors.bookID == :bookIDSelection;

-- add author to book
INSERT INTO BooksAuthors (bookID, authorID) VALUES
((SELECT bookID FROM Books where bookID = :bookIDSelection), (SELECT authorID FROM Authors WHERE authorID = :authorIDSelection));

-- edit bookID and authorID for BooksAuthors
UPDATE BooksAuthors SET bookID = :bookIDInput, authorID = :authorIDInput
WHERE BookAuthorID= :bookAuthorIDSelection;

-- delete book and author relationship in BooksAuthors
DELETE FROM BooksAuthors WHERE bookAuthorID = :bookAuthorIDSelection;


-- Publisher Queries --

-- get all publishers for browse publisher page
SELECT * FROM Publishers;

-- add new publisher info
INSERT INTO Publishers (name) VALUES
(:nameInput);
