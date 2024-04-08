const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username)
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find((user) => user.username === username);

  // If user is found and the password matches, return true; otherwise, return false
  return user && user.password === password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body; // Retrieve username and password from the request body

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username exists and the password is correct
  if (authenticatedUser(username, password)) {
    // If credentials are valid, create a JWT token
    const token = jwt.sign({ username: username }, "secret_key");

    // Return the JWT token as response
    return res.status(200).json({ token: token });
  } else {
    // If credentials are invalid, return error message
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.get("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params; // Retrieve ISBN from the request parameters
  const { review } = req.query; // Retrieve review from the request query
  const username = req.session.username; // Retrieve username from the session
  
  // Check if review and username are provided
  if (!review || !username) {
    return res.status(400).json({ message: "Review and username are required" });
  }
  
  // Check if the book exists
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  // Check if the user has already reviewed the book
  if (books[isbn].reviews.hasOwnProperty(username)) {
    // If the user has already reviewed the book, modify the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // If the user hasn't reviewed the book, add a new review
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
