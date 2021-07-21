import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {deleteTodo, editTodo, getAllTodos, postOneTodo} from "./services/todos";
const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
);

app.get("/todos", getAllTodos);
app.post("/todos", postOneTodo);
app.delete("/todos/:id", deleteTodo);
app.put("/todos/:id", editTodo);


exports.api = functions.https.onRequest(app);
