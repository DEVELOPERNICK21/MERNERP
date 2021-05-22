const dotenv = require("dotenv");
const express = require("express");
const app = express();

dotenv.config({path:'./config.env'});
require('./db/conn.js')


 const User = require('./model/userSchema');

 app.use(express.json());

 app.use(require('./router/auth.js'))

const PORT = process.env.PORT;



app.get("/", (req, res) => {
  res.send(`Hello from the server`);
  console.log(`Server is running this main page`);
});
// app.get('/about', Middleware,(req, res) => {
//     res.send(`Hello from the about page of server`);
// });
app.get("/about", (req, res) => {
  res.send(`Hello from the about page of server`);
});
app.get("/contact", (req, res) => {
  res.send(`Hello from the Contact page of server`);
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
