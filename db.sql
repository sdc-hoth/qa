-- ***************  GET /qa/questions ***************
--use product_id = 66604 for TESTING: has BOTH reported question and reported answer

SELECT json_build_object(
    'product_id', 66604,
    'results',
    (SELECT json_agg(qap)
    FROM (
        SELECT
            q.question_id,
            q.question_body,
            q.question_date,
            q.asker_name,
            q.question_helpfulness,
            q.reported,
            (SELECT JSON_OBJECT_AGG(id, ROW_TO_JSON(ap)::JSONB) as answers
                FROM (
                    SELECT
                        a.answer_id as id,
                        a.body,
                        a.date,
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
        WHERE q.product_id = 66604 and q.reported = false
        LIMIT 5
    ) AS qap)
) as data



-- ***************  GET /qa/questions/:question_id/answers ***************
--   limit 5 answers

SELECT json_build_object (
    'question', 234192,
    'page', 0,
    'count', 5,
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
            WHERE a.question_id = 234192 and a.reported = false
            LIMIT 5
    ) as ap)
) as data



-- *************** POST /qa/questions   body, name, email, product_id **********************
INSERT INTO questions (body, asker_name, asker_email, product_id)
VALUES (body, name, email, product_id)


-- ***************  POST /qa/questions/:question_id/answers ***************
INSERT INTO answers (body, answerer_name, answerer_email, question_id)
VALUES ('${body}', '${name}', '${email}', '${question_id}')
RETURNING answer_id

-- SELECT currval('answers_id_seq')
-- DECLARE @id INT = (SELECT LAST_INSERT_ID())

INSERT INTO photos (answer_id, url) --need to insert multiple photos (for loop each insert?)
VALUES
    ('${answer_id}', '${url}'),
    ('${answer_id}', '${url}'),
    ('${answer_id}', '${url}');

-- ***************  PUT /qa/questions/:question_id/helpful ***************
DO $$
    DECLARE id integer := (SELECT question_helpfulness from questions where question_id = ${question_id}) + 1;
BEGIN
    UPDATE questions
    SET question_helpfulness = id
    WHERE question_id = ${question_id};
END $$

-- ***************  PUT /qa/questions/:question_id/report ***************
UPDATE questions
SET reported = true
WHERE question_id = ${question_id}



-- ***************  PUT /qa/answers/:answer_id/helpful ***************
-- DECLARE @i INT = (SELECT helful from answers where a.id = answer_id)

-- UPDATE answers
-- SET helpful = @i, @i = @i + 1
-- WHERE a.id = answer_id

DO $$
    DECLARE id integer := (SELECT helpfulness from answers where answer_id = ${answer_id}) + 1;
BEGIN
    UPDATE answers
    SET helpfulness = id
    WHERE answer_id = ${answer_id};
END $$

-- ***************  PUT /qa/answers/:answer_id/report ***************
UPDATE answers
SET reported = true
WHERE answer_id = ${answer_id};
