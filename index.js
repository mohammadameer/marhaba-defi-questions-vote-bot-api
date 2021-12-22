import express from "express";
import cors from "cors";
import database from "./database.js";

/* Bot configuration */

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/questions", async (req, res) => {
  const query = {
    hide: false,
  };
  if (req.query.answered == "false") {
    query.answered = false;
  }

  if (req.query.saved == "true") {
    query.saved = true;
  }

  const questions = await database.getAllQuestions(query);

  res.json(questions);
});

app.delete("/questions/:number", async (req, res) => {
  const question = await database.updateQuestion({
    number: parseInt(req.params.number),
    data: { $set: { hide: true } },
  });

  res.json(question);
});

app.put("/questions/:number", async (req, res) => {
  const data = {};
  if (req.body.answer) {
    data.answer = req.body.answer;
    data.answered = true;
  }
  if (req.body.saved == false || req.body.saved == true) {
    data.saved = req.body.saved;
  }

  console.log("req.body", req.body);
  console.log("data", data);

  const question = await database.updateQuestion({
    number: parseInt(req.params.number),
    data: { $set: { ...data } },
  });

  console.log("question", question);

  res.json(question);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
