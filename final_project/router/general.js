const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 6: User registration via username and password
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "User already exists" });
  }

  users[username] = { password: password };
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
// Task 1: Get all books
public_users.get('/', function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);

  let result = [];

  keys.forEach(key => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.send(JSON.stringify(result, null, 4));
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);

  let result = [];

  keys.forEach(key => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    res.send(JSON.stringify(result, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
