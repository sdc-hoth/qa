# System Design: Questions and Answers API 

The goal of this project was to design a RESTful API and database to replace an exisiting API for a question and answer section of an e-commerce application <a href="https://github.com/HR-FEC-Titan/FEC-Atelier" > Atelier </a> and scale in order to handle traffic loads. 

## Technologies
![Node](https://img.shields.io/badge/-Node-9ACD32?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/-Express-DCDCDC?logo=express&logoColor=black&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![AWS](https://img.shields.io/badge/-AWS-232F3E?logo=amazonaws&logoColor=white&style=for-the-badge)
![loader.io](https://img.shields.io/badge/-loader.io-6495ED?logo=loader.io&logoColor=white&style=for-the-badge)


## Stress Testing
* Deployed Nginx to direct traffic to multiple servers on AWS EC2 instances.
* Stress tested with Loader.io was able to scale to achieve 1000 RPS with a average latency of 14ms and 0% error rate. 

<div align="center" >
<img width="700" alt="Screen Shot 2022-08-08 at 7 31 34 PM" src="https://user-images.githubusercontent.com/98438591/186223806-751d0eee-3971-42b4-8ecf-e980fd15fd49.png">
</div>


## Routes
| Request Type | Endpoint                          | Returns                                                                                                               | Status |
| ------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| GET          | /qa/questions/:product_id         | An object containing questions related to a particular product along with answers/photos associated with the question | 200    |
| GET          | /qa/questions/:question_id/answers| An object containing answers and associated photoes for each answer regarding a particular question for a specific product  | 200    |
| POST         | /qa/questions/:product_id         | Nothing is returned but serves a route to post questions about specific product                                       | 201    |
| POST         | /qa/questions/:question_id/answers| Nothing is returned but this route serves handling posting answers about a specfic question                        | 201    |
| PUT          | /qa/questions/:question_id/helpful| A counter associated with the question is incremented up                                                               | 204    |
| PUT          | /qa/questions/:question_id/report | The question will not get deleted but it will no longer be returned upon making a GET request for the questions route | 204    |
| PUT          | /qa/answers/:answer_id/helpful    | A counter associated with the question is incremented up                                                               | 204    |
| PUT          | /qa/answers/:answer_id/report     | The specific response will no longer be returned  upon making a GET request to the answers route                   | 204    |

## Usage 
In the project directory, you can run:
#### `npm run start`
