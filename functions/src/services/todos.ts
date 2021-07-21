import * as express from "express";
import {db} from "../utils/admin";

export type Todo = {
  id?: string;
  title: string;
  body: string;
  createdAt: string;
};

const getAllTodos = (req: express.Request, res: express.Response) => {
  return db
      .collection("todos")
      .orderBy("createdAt", "desc")
      .get()
      .then((data) => {
        const todos: Todo[] = [];
        data.forEach((doc) => {
          todos.push({
            id: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            createdAt: doc.data().createdAt,
          });
        });
        res.status(200).json(todos);
      })
      .catch((err) => res.status(500).json(err));
};

const postOneTodo = (req: express.Request, res: express.Response) => {
  if (req.body.title.trim() === "") {
    return res.status(400).json({title: "Must not be empty"});
  }
  if (req.body.body.trim() === "") {
    return res.status(400).json({body: "Must not be empty"});
  }

  const newTodo: Todo = {
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().toISOString(),
  };

  return db
      .collection("todos")
      .add(newTodo)
      .then((doc) => {
        const resTodo: Todo = newTodo;
        resTodo.id = doc.id;
        res.status(201).json(resTodo);
      })
      .catch((err) => res.status(500).json(err.code));
};

const deleteTodo = (req: express.Request, res: express.Response)=> {
  const document = db.doc(`/todos/${req.params.todoId}`);
  document
      .get()
      .then((doc) => {
        if (!doc.exists) {
          res.status(400).json("Todo not found");
        }
        return document.delete();
      }).then(() => {
        res.status(200).json("Delete successfully");
      }).catch((err) => {
        res.status(500).json({error: err.code});
      });
};

const editTodo = (req: express.Request, res: express.Response) => {
  if (req.body.id || req.body.createdAt) {
    res.status(403).json("Not allow to edit");
  }

  const document = db.doc(`/todos/${req.params.id}`);
  document.update(req.body).then(() => {
    res.json({message: "Updated successfully"});
  }).catch((err) => {
    res.status(500).json({error: err.code});
  });
};

export {getAllTodos, postOneTodo, deleteTodo, editTodo};
