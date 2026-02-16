const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

//Task 6 - Register new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered" });
});

// // Task 1 - Get all books
// public_users.get('/', function (req, res) {
//   return res.status(200).send(JSON.stringify(books, null, 4));
// });

// Task 10 - Get all books using Promise
public_users.get('/', function (req, res) {

  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Error fetching books");
    }
  });

  getBooks
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ message: err }));
});


// // Task 2 - Get book by ISBN
// public_users.get('/isbn/:isbn', function (req, res) {

//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   if (book) {
//     return res.status(200).send(JSON.stringify(book, null, 4));
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// Task 11 - Get book by ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
});


// Task 3 - Get books by Author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Task 4 - Get books by Title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  if (Object.keys(result).length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5 - Get book reviews
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
