var controller = require('./controllers');
var router = require('express').Router();

//Connect controller methods to their corresponding routes
router.get('/questions/:product_id', controller.question.get);





// router.get('/questions/:question_id/answers', controller.answer.get);

// router.post('/questions/:question_id/answers', controller.answer.post);

// router.put('/answers/:answer_id/helpful', controller.answer.get);





// router.post('/questions', controller.question.post);


// router.put('/questions/:question_id/helpful', controller.question.put);

// router.put('/questions/:question_id/report', controller.reportQuestion.put);




// router.put('/answers/:answer_id/report', controller.reportAnswer.post);







module.exports = router;