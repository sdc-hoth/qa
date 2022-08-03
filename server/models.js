const client = require('./db.js');

module.exports = {
  getQuestions: function (product_id, page=0, count=5) {
    const queryString = `SELECT json_build_object(
      'product_id', ${product_id},
      'results',
      (SELECT json_agg(qap)
      FROM (
          SELECT
            q.question_id,
            q.question_body,
            to_timestamp(q.question_date ::double precision / 1000) at time zone 'UTC' as date,
            q.asker_name,
            q.question_helpfulness,
            q.reported,
              (SELECT JSON_OBJECT_AGG(id, ROW_TO_JSON(ap)::JSONB) as answers
                  FROM (
                      SELECT
                        a.answer_id as id,
                        a.body,
                        to_timestamp(a.date ::double precision / 1000) at time zone 'UTC' as date,
                        a.answerer_name,
                        a.helpfulness,
                      COALESCE((
                              SELECT json_agg(pho)
                              FROM (
                                  SELECT
                                  p.id,
                                  p.url
                                  FROM photos p
                                  where p.answer_id = a.answer_id
                              ) AS pho
                          ), '[]') AS photos
                      FROM answers a
                      WHERE a.question_id = q.question_id
                  ) AS ap
              )
          FROM questions q
          WHERE q.product_id = ${product_id} and q.reported = false
          LIMIT ${ count } OFFSET ${ page * count }
      ) AS qap)
  ) as data`;
    return client.query(queryString);
  },

  getAnswersForQ: function (question_id, page=0, count=5) {
    const queryString = `SELECT json_build_object (
      'question', ${question_id},
      'page', ${page},
      'count', ${count},
      'results',
      (SELECT JSON_AGG(ap) as results
      FROM (
          SELECT
              a.answer_id,
              a.body,
              to_timestamp(a.date ::double precision / 1000) at time zone 'UTC' as date,
              a.answerer_name,
              a.helpfulness,
             COALESCE((
                      SELECT json_agg(pho)
                      FROM (
                          SELECT
                          p.id,
                          p.url
                          FROM photos p
                          where p.answer_id = a.answer_id
                      ) AS pho
                  ), '[]') AS photos
              FROM answers a
              WHERE a.question_id = ${question_id} and a.reported = false
              LIMIT ${ count } OFFSET ${ page * count }
      ) as ap)
  ) as data`;
    return client.query(queryString);
  },

  postQuestion: function (body, name, email, product_id) {
    const queryString = `INSERT INTO questions (question_body, asker_name, asker_email, product_id)
      VALUES ('${body}', '${name}', '${email}', '${product_id}')`;
    return client.query(queryString);
  },

  postAnswer: function (body, name, email, question_id) {
    const queryString = `INSERT INTO answers (body, answerer_name, answerer_email, question_id)
      VALUES ('${body}', '${name}', '${email}', '${question_id}')
      RETURNING answer_id`;
    return client.query(queryString);
  },

  postPhotos: function(answer_id, url) {
    const queryString = `INSERT INTO photos (answer_id, url)
      VALUES ('${answer_id}', '${url}')`;
    return client.query(queryString);
  },

  updateQHelpful: function (question_id) {
    const queryString = `DO $$
    DECLARE id integer := (SELECT question_helpfulness from questions where question_id = ${question_id}) + 1;
BEGIN
    UPDATE questions
    SET question_helpfulness = id
    WHERE question_id = ${question_id};
END $$`;
    return client.query(queryString);
  },


  reportQuestion: function (question_id) {
    const queryString = `UPDATE questions
    SET reported = true
    WHERE question_id = ${question_id}`;
    return client.query(queryString);
  },


  updateAHelpful: function (answer_id) {
    const queryString = `DO $$
    DECLARE id integer := (SELECT helpfulness from answers where answer_id = ${answer_id}) + 1;
BEGIN
    UPDATE answers
    SET helpfulness = id
    WHERE answer_id = ${answer_id};
END $$`;
    return client.query(queryString);
  },


  reportAnswer: function (answer_id) {
    const queryString = `UPDATE answers
    SET reported = true
    WHERE answer_id = ${answer_id}`;
    return client.query(queryString);
  },

}



// const queryString = `INSERT INTO answers (body, answerer_name, answerer_email, question_id)
//     VALUES (${body}, ${name}, ${email}, ${question_id});

//     DO $$
//         DECLARE
//             id integer := (SELECT max(answer_id) from answers);
//     BEGIN
//         Raise notice id;
//         Raise notice photo_array;
//        INSERT INTO photos (answer_id, url)
//          SELECT id, v
//          FROM json_array_elements_text(ARRAY[${photos}]) as t(v);
//     END $$;`