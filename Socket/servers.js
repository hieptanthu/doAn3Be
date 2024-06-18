const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(express.json());
app.use(express.static('public'));

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};


function getUsersInRoom(roomName, i) {
  const room = io.sockets.adapter.rooms.get(roomName);
  if (room) {
    return room.size;
  } else {
    return 0;
  }
}

app.use(cors(corsOptions));
require("dotenv").config();


const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const io = new Server(server, {
  cors: corsOptions
});


function getUsersInRoom(roomName) {
  const room = io.sockets.adapter.rooms.get(roomName);
  if (room) {
    return room.size;
  } else {
    return 0;
  }
}
const listUser = {}
io.on("connection", (socket) => {


  const userId = socket.handshake.query.userid;
  listUser[userId] = socket.id


  socket.on("joinRoomProduct", (room) => {
    socket.join("Product" + room);
    const roomSize = getUsersInRoom("Product" + room);
    io.to("Product" + room).emit("UserInRoomProduct", roomSize);
    console.log(`User ${socket.id} joined room ${"Product" + room} - number of users: ${roomSize}`);
  });

  socket.on("leaveRoomProduct", (room) => {
    socket.leave("Product" + room);
    const roomSize = getUsersInRoom("Product" + room);
    io.to("Product" + room).emit("UserOutRoomProduct", roomSize);
    console.log(`User ${socket.id} left room ${"Product" + room} - number of users: ${roomSize}`);
  });



  socket.on("joinRoomCommnet1", (room) => {
    socket.join("Commnet1" + room);
    console.log(`User ${socket.id} joined room ${"Commnet1" + room} - `);
  });

  socket.on("sendComnet1", (data) => {

    io.to("Commnet1" + data._id).emit("receiveComent", data.value);

  });

  socket.on("leaveRoomCommnet1", (room) => {
    socket.leave("Commnet1" + room);
    console.log(`User ${socket.id} left room ${"Commnet1" + room} -`);
  });




  socket.on("joinRoomCommnet2", (room) => {
    socket.join("Commnet2" + room);
    console.log(`User ${socket.id} joined room ${"Product" + room} - `);
  });


  socket.on("sendComnet2", (data) => {

    io.to("Commnet2" + data._id).emit("receiveComent2", data.value);

  });


  socket.on("leaveRoomCommnet2", (room) => {
    socket.leave("Commnet2" + room);
    console.log(`User ${socket.id} left room ${"Product" + room} -`);
  });


  socket.on("SETProductPay", (data) => {
    data.Item.forEach(element => {
      const roomName = "Product" + element.ProductId;
      io.to(roomName).emit("Productexcept", {
        Name: data.Name, Quantity: element.Quantity
      });
    });

  });


  function getUser() {

    let nullKeyCount = 0;
    let nonNullKeyCount = 0;

    // Mảng lưu trữ các khóa khác 'null'
    let nonNullKeys = [];

    // Duyệt qua các khóa của đối tượng
    for (let key in listUser) {
      if (listUser.hasOwnProperty(key)) {
        if (key == ''||key == null||key == "null") {
          nullKeyCount++;
        } else {
          nonNullKeyCount++;
          nonNullKeys.push(key);
        }
      }
    }
    return { nullKeyCount, nonNullKeyCount, nonNullKeys }
  }

  socket.on('getUser', (callback) => {
    // Gọi hàm getUser() để lấy dữ liệu từ server
    const userData = getUser();

    // Gửi dữ liệu userData về client
    callback(userData);
  });



  function getUsersInRoom(roomName) {
    const room = io.sockets.adapter.rooms.get(roomName);
    if (room) {
      return room.size;
    } else {
      return 0;
    }
  }




  socket.on("disconnect", () => {
    delete listUser[userId]

  });

})



app.start = app.listen = function () {
  return server.listen.apply(server, arguments);
};
app.start(PORT);
