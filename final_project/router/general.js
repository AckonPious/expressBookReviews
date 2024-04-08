const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body; // Retrieve username and password from the request body

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  // Return success message
  return res.status(201).json({ message: "User registered successfully" })
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from the request parameters

  // Check if the provided ISBN matches any of the numeric keys in the books object
  const book = Object.values(books).find(
    (book, key) => key.toString() === isbn
  );

  if (book) {
    // Book found, return its details
    return res.status(200).json({ book: book });
  } else {
    // Book not found
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author; // Retrieve author from the request parameters
  const booksArray = Object.values(books); // Convert the books object into an array of book objects

  // Filter the books array to find books with the specified author
  const booksByAuthor = booksArray.filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
      // Books found, return their details
      return res.status(200).json({ books: booksByAuthor });
  } else {
      // No books found for the specified author
      return res.status(404).json({ message: "No books found for the author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title; // Retrieve title from the request parameters
  const booksArray = Object.values(books); // Convert the books object into an array of book objects

  // Filter the books array to find books with the specified title
  const booksByTitle = booksArray.filter(book => book.title === title);

  if (booksByTitle.length > 0) {
      // Books found, return their details
      return res.status(200).json({ books: booksByTitle });
  } else {
      // No books found for the specified title
      return res.status(404).json({ message: "No books found for the title" });
  };
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from the request parameters
  const book = books[isbn]; // Get the book based on the ISBN

  if (book) {
      // Check if the book has reviews
      if (Object.keys(book.reviews).length > 0) {
          // Book has reviews, return them
          return res.status(200).json({ reviews: book.reviews });
      } else {
          // Book has no reviews
          return res.status(404).json({ message: "No reviews found for the book" });
      }
  } else {
      // Book not found
      return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
