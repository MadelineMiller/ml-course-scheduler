# Course Scheduling Planner using Deep Learning

## Project Overview

This project aims to build an intelligent course scheduling system that optimizes students' academic schedules based on RateMyProfessor reviews, prerequisites, and major requirements. By leveraging deep learning and sentiment analysis, the system will recommend optimal quarterly schedules that maximize both academic success and student satisfaction.

## Run on Local

1. `npm install`
2. `npm run dev`

> **_NOTE:_** If you're running locally, IT WILL CRASH unless the server is up.

To put the server up on local:

1. Open new term window
2. `cd server`
3. `touch .env` and
4. Edit `.env` using a code editor and add the following line: `HF_TOKEN={your_HF_API_key}` - If u don't really want to make one u can just text me & I can send u mine. You're just not supposed to put them on Github.
5. `npm install`
6. `node server.js`

## Where TF is everything??

-   `/server/server.js`: line 84 has the prompt
-   `src/pages/homepage.jsx`: line 106 has the output (if you want to format it to look better/my formatting is giving you bugs)

### Credits

This project was bootstrapped with (reactfolio)[https://github.com/truethari/reactfolio].
