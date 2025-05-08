-- CS340 Team 55;
-- Meadowlark Books;

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create Tables:
CREATE OR REPLACE TABLE Customers (
        customerID int NOT NULL AUTO_INCREMENT,
        fName varchar(50),
        lName varchar(50),
        phoneNumber varchar(50),
        PRIMARY KEY (customerID)
);

CREATE OR REPLACE TABLE Publishers (
        publisherID int NOT NULL AUTO_INCREMENT,
        name varchar(50),
        PRIMARY KEY (publisherID)
);

CREATE OR REPLACE TABLE Books (
        bookID int NOT NULL AUTO_INCREMENT,
        title varchar(50),
	price decimal(6,2) NOT NULL,
	publisherID int,
	PRIMARY KEY (bookID),
	FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID)
	-- On publisher delete, removes publisherID FK but keeps Book record
	ON DELETE SET NULL
);

CREATE OR REPLACE TABLE Orders (
        orderID int NOT NULL AUTO_INCREMENT,
        customerID int NOT NULL,
	dateOrdered date NOT NULL,
	orderType varchar(50),
	PRIMARY KEY (orderID),
	FOREIGN KEY (customerID) REFERENCES Customers(customerID)
	-- On customer delete, removes any associated Order records
        ON DELETE CASCADE
);

CREATE OR REPLACE TABLE Authors (
        authorID int NOT NULL AUTO_INCREMENT,
        fName varchar(50),
        lName varchar(50),
        PRIMARY KEY (authorID)
);

CREATE OR REPLACE TABLE BooksOrders (
	bookOrderID int NOT NULL AUTO_INCREMENT,
 	bookID int,
	orderID int,
	quantity int NOT NULL,
	PRIMARY KEY (bookOrderID),
	FOREIGN KEY (bookID) REFERENCES Books(bookID)
	-- On book delete, removes any associated BooksOrders records
	ON DELETE CASCADE,
	FOREIGN KEY (orderID) REFERENCES Orders(orderID)
	-- On Customer (because of delete cascade for Orders) or Order delete, sets orderID FK to null but keeps BooksOrder record so sales quantity can be tracked
	ON DELETE SET NULL
);

CREATE OR REPLACE TABLE BooksAuthors (
	bookAuthorID int NOT NULL AUTO_INCREMENT,
  bookID int,
	authorID int,
	PRIMARY KEY (bookAuthorID),
	FOREIGN KEY (bookID) REFERENCES Books(bookID)
	-- On Book deletion, removes BookAuthors record
	ON DELETE CASCADE,
	FOREIGN KEY (authorID) REFERENCES Authors(authorID)
	-- On Author deletion, removes BookAuthors record
	ON DELETE CASCADE
);

-- DESCRIBE to Verify Tables:

DESCRIBE Customers;
DESCRIBE Books;
DESCRIBE Orders;
DESCRIBE Publishers;
DESCRIBE Authors;
DESCRIBE BooksOrders;
DESCRIBE BooksAuthors;

-- Insert Sample Data:

INSERT INTO Customers (fName, lName, phoneNumber) VALUES 
	('Jane', 'Doe', '555-555-1234'),
	('John', 'Smith', '555-555-2345'),
	('Joe', 'Schmo', '555-555-3456');

INSERT INTO Authors (fName, lName) VALUES
        ('Professor', 'Coder'),
        ('George', 'Orwell'),
        ('Ted', 'Chiang'),
	('Neil', 'Gaiman'),
	('Terry', 'Pratchett');

INSERT INTO Publishers (name) VALUES
        ('Miracle Publishing'),
        ('Signet Classic'),
        ('Penguin Books'),
	('Workman'),
	('DC Comics');

INSERT INTO Books (title, price, publisherID) VALUES 
	('Hello World: Programming 101', 39.99, (SELECT publisherID FROM Publishers WHERE name = 'Miracle Publishing')),
	('Animal Farm', 19.99, (SELECT publisherID FROM Publishers WHERE name = 'Signet Classic')),
	('Exhalation', 29.99, (SELECT publisherID FROM Publishers WHERE name = 'Penguin Books')),
	('Good Omens', 9.99, (SELECT publisherID FROM Publishers WHERE name = 'Workman')),
	('The Sandman', 14.99, (SELECT publisherID FROM Publishers WHERE name = 'DC Comics'));

INSERT INTO Orders (customerID, dateOrdered, orderType) VALUES 
	((SELECT customerID FROM Customers WHERE fName = 'Joe' AND lName = 'Schmo'), 20240428, 'IN STORE'),
	((SELECT customerID FROM Customers WHERE fName = 'Jane' AND lName = 'Doe'), 20240427, 'DELIVERY'),
	((SELECT customerID FROM Customers WHERE fName = 'John' AND lName = 'Smith'), 20240429, 'PICK UP');

INSERT INTO BooksOrders (bookID, orderID, quantity) VALUES
	(1, 1, 2),	
	(2, 1, 1),
	(3, 2, 5),
	(3, 3, 1);
	
INSERT INTO BooksAuthors (bookID, authorID) VALUES
	(1, 1),
	(2, 2),
	(3, 3),
	(4, 4),
	(4, 5),
	(5, 4);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

-- SELECT * to Verify Sample Data:

SELECT * FROM Customers;
SELECT * FROM Books;
SELECT * FROM Orders;
SELECT * FROM Publishers;
SELECT * FROM Authors;
SELECT * FROM BooksOrders;
SELECT * FROM BooksAuthors;
