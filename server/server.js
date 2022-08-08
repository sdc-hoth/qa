// require('newrelic');
require('dotenv').config();
const express = require('express');
// const cors = require('cors');
// const path = require('path');
// var morgan = require('morgan');
// const router = require('./router.js');
const { getAnswersForQ, getQuestions, postQuestion, postAnswer, postPhotos, updateQHelpful, reportQuestion, updateAHelpful, reportAnswer } = require('./models');

const app = express();
module.exports.app = app;

app.set('port', process.env.PORT);
// app.use(morgan('dev'));
// app.use(express.json());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });
// app.options('*', cors());

app.get('/loaderio-a7887161d0556f5c12e34c0501aa7f55.txt', async (req, res) => {
  try {
    res.status(200).send('loaderio-a7887161d0556f5c12e34c0501aa7f55');
  } catch(e) {
    console.log('errrrrr', e);
  }
})

app.get('/qa/questions/:product_id', async(req, res) => {
  const { product_id } = req.params;
  const { page, count } = req.query;
  try {
    const data = await getQuestions(product_id);
    res.send(data.rows[0].data);
  } catch(e) {
    res.sendStatus(404);
  }
})

app.get('/qa/questions/:question_id/answers', async (req, res) => {
  const { question_id } = req.params;
  const { page, count } = req.query;
  try {
    const data = await getAnswersForQ(question_id, page, count);
    res.send(data.rows[0].data);
  } catch(e) {
    res.sendStatus(404);
  }
});

app.post('/qa/questions/:product_id', async (req, res) => {
  const { product_id } = req.params;
  const { body, name, email } = req.body;
  try {
    await postQuestion(body, name, email, product_id);
    res.sendStatus(201);
  } catch(e) {
    res.sendStatus(501);
  }
});

app.post('/qa/questions/:question_id/answers', async (req, res) => {
  const { question_id } = req.params;
  const { body, name, email, photos } = req.body;
  try {
    const result = await postAnswer(body, name, email, question_id);
    const answer_id = result.rows[0].answer_id;

    for (let p of photos) {
      await postPhotos(answer_id, p)
    }
    res.sendStatus(201);
  } catch(e) {
    res.sendStatus(501);
  }
});

app.put('/qa/questions/:question_id/helpful', async (req, res) => {
  const { question_id } = req.params;
  try {
    await updateQHelpful(question_id);
    res.sendStatus(200);
  } catch(e) {
    res.sendStatus(204);
  }
});

app.put('/qa/questions/:question_id/report', async (req, res) => {
  const { question_id } = req.params;
  console.log(question_id);
  try {
    await reportQuestion(question_id);
    res.sendStatus(200);
  } catch(e) {
    res.sendStatus(204);
  }
});

app.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  const { answer_id } = req.params;
  try {
    await updateAHelpful(answer_id);
    res.sendStatus(200);
  } catch(e) {
    res.sendStatus(204);
  }
});

app.put('/qa/answers/:answer_id/report', async (req, res) => {
  const { answer_id } = req.params;
  try {
    await reportAnswer(answer_id);
    res.sendStatus(200);
  } catch(e) {
    res.sendStatus(204);
  }
})


if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}
