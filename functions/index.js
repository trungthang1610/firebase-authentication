const functions = require("firebase-functions");
const app = require("express")();
const cors = require("cors");

const auth = require("./util/auth");

const {
  getAllTodos,
  postOneTodo,
  deleteTodo,
  editTodo,
  getOneTodo,
} = require("./APIs/todos");
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails,
} = require("./APIs/users");

app.use(cors({ origin: true }));

// Todos
app.get("/todos", getAllTodos);
app.get("/todos/:todoId", auth, getOneTodo);
app.post("/todos", auth, postOneTodo);
app.delete("/todos/:todoId", auth, deleteTodo);
app.put("/todos/:todoId", auth, editTodo);

// Users
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
