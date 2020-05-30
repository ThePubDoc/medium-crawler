const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const mainRoutes = require("./backend/routes/mainRoutes");
const medium = require("./backend/controllers/medium");
const db = require('./backend/models/index');

db.init();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("views", __dirname + "/client/views");

app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "client")));
app.use("/", mainRoutes);

io.on('connection', (socket) =>  {
    // console.log('a user connected');
    socket.on('tag' , (tag) => {
      // medium.index(socket,tag);
      medium.stream(socket,tag,[]);
    })
    socket.on('more' , (data) => {
      console.log("in app.js:" + data.tag +"--" + data.ignoredIds)
      medium.stream(socket,data.tag,data.ignoredIds)
    })
});

server.listen(4000 , () => {
  console.log("Application running in port: 4000");
});

module.exports = app;
