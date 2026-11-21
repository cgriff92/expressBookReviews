const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');
const BASE_URL = "http://localhost:5000";

// Task 1: all books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  });
  
  // Task 2: by ISBN
  public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) return res.status(200).json(book);
    return res.status(404).json({ message: "Book not found" });
  });
  
  // Task 3: by author
  public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const matches = Object.keys(books)
      .filter(isbn => books[isbn].author.toLowerCase() === author)
      .map(isbn => ({ isbn, ...books[isbn] }));
    if (matches.length) return res.status(200).json(matches);
    return res.status(404).json({ message: "No books found for that author" });
  });
  
  // Task 4: by title
  public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const matches = Object.keys(books)
      .filter(isbn => books[isbn].title.toLowerCase() === title)
      .map(isbn => ({ isbn, ...books[isbn] }));
    if (matches.length) return res.status(200).json(matches);
    return res.status(404).json({ message: "No books found with that title" });
  });
  
  // Task 5: reviews
  public_users.get('/review/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    if (book) return res.status(200).json(book.reviews);
    return res.status(404).json({ message: "Book not found" });
  });

  public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
    }
    if (users.some(u => u.username === username)) {
      return res.status(409).json({ message: "User already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
  });
module.exports.general = public_users;

// Task 10: all books (async/await)
const getAllBooks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching books:", err.message);
    }
  };
  
  // Task 11: by ISBN (promise callbacks)
  const getBookByISBN = (isbn) => {
    axios.get(`${BASE_URL}/isbn/${isbn}`)
      .then(response => console.log(response.data))
      .catch(err => console.error("Error fetching book:", err.message));
  };
  
  // Task 12: by author (async/await)
  const getBooksByAuthor = async (author) => {
    try {
      const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching by author:", err.message);
    }
  };
  
  // Task 13: by title (promise callbacks)
  const getBooksByTitle = (title) => {
    axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
      .then(response => console.log(response.data))
      .catch(err => console.error("Error fetching by title:", err.message));
  };