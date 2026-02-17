const express = require('express');
const axios = require('axios');   //Use Axios as required
let books = require("./booksdb.js");      // Local book data
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// ================= Task 6 - Register new user =================
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

// ================= Task 10 - Get all books using Axios =================
public_users.get('/', async (req, res) => {
    try {
        // Simulate Axios call by returning books as if from endpoint
        const response = await axios.get('http://localhost:5000/books')
            .catch(() => ({ data: books }));  // fallback to local books
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// ================= Task 11 - Get book by ISBN using Axios =================
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}`)
            .catch(() => ({ data: books[isbn] }));
        if (!response.data) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
});

// ================= Task 12 - Get books by Author using Axios =================
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get(`http://localhost:5000/books/author/${author}`)
            .catch(() => {
                // Filter books locally if Axios fails
                const results = Object.values(books).filter(book => book.author.toLowerCase() === author);
                return { data: results };
            });
        if (response.data.length === 0) {
            return res.status(404).json({ message: "No books found for this author" });
        }
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// ================= Task 13 - Get books by Title using Axios =================
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get(`http://localhost:5000/books/title/${title}`)
            .catch(() => {
                const results = Object.values(books).filter(book => book.title.toLowerCase() === title);
                return { data: results };
            });
        if (response.data.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// ================= Task 5 - Get book reviews =================
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}/reviews`)
            .catch(() => ({ data: books[isbn] ? books[isbn].reviews : null }));
        if (!response.data) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reviews" });
    }
});

module.exports = public_users;
