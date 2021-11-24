// require deps
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const booksController = require('./controllers/books');
// initialize app
const app = express();
const Book = require('./models/book')
//const books = require('./controllers/books');
// configure settings
require('dotenv').config();

// connect to and configure mongoDB with mongoose
const DATABASE_URL = 'MONGODB_URI=mongodb+srv://admin:abc1234@cluster0.vn7x6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

// set up mongodb event listeners
db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (err) => console.log('MongoDB Error: ' + err.message));


// mount middleware
app.use(express.urlencoded({ extended: false })); // creates req.body
app.use(methodOverride('_method'));

// mount routes
app.use('/books', booksController);

//create


// Create route
app.post('/books', (req, res) => {
  Book.create(req.body, (err, createdBook) => {
      res.send(createdBook);
  }); // this code runs asynchronous
});

app.get('/', (req, res) => {

res.send(		`Welcome to the books app! Go to <a href="/books">localhost:3000/books</a> to get started!`
)

})


app.get('/books', (req, res) => {
  Book.find({}, (err, arrayOfBooks) => {
      res.send(arrayOfBooks);
  });
});


// Show route

app.get('/books/:id', (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
      res.send('index.ejs', foundBook)
  });
});


// Delete route
app.delete('/books/:id', (req, res) => {
  Book.findByIdAndDelete(req.params.id, (err, copyOfDeletedBook) => {
      res.send(copyOfDeletedBook);
  });
});

// Update route

app.put('/books/:id', (req, res) => {
  Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }, 
      (err, updatedBook) => {
          res.send(updatedBook);
  });
});





// Database Connection
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

// Database Connection Error/Success - optional but can be really helpful
db.on("error", (err) => console.log(err.message + " is Mongod not running?"))
db.on("connected", () => console.log("mongo connected"))
db.on("disconnected", () => console.log("mongo disconnected"))



// tell the app to listen

const PORT = process.env.PORT; 
// heroku or any cloud service will set this value for us

app.listen(PORT, () => {
    console.log('Express is listening on port: ' + PORT);
});
