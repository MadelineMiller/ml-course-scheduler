# Course Scheduling Planner using Deep Learning

## Project Overview

This project aims to build an intelligent course scheduling system that optimizes students' academic schedules based on RateMyProfessor reviews, prerequisites, and major requirements. By leveraging deep learning and sentiment analysis, the system will recommend optimal quarterly schedules that maximize both academic success and student satisfaction.

## How do I run this on my local machine?

There's two parts: the client-side (frontend) and server-side (backend). The client communicates with the server, and the server communicates with HuggingFace. Both need to be up or else the site will crash.
> **_TLDR/IDGAF:_** Run all 8 steps (1-2 for frontend) and (1-6 for backend)


### To put the frontened up:

1. `npm install`
2. `npm run dev`

After you've run `npm install`, you can just run `npm run dev` whenever you want to run the frontened. 

### To put the server up :

1. Open new term window
2. `cd server`
3. `touch .env` and
4. Edit `.env` using a code editor and add the following line: `HF_TOKEN={your_HF_API_key}` - If u don't really want to make an API key can just text me & I can send u mine. You're just not supposed to put them on Github.
5. `npm install`
6. `node server.js`

After you've run `npm install`, you can just run `node server.js` whenever you want to run the server. 

## Where TF is everything??

-   `/server/server.js`: line 84 has the prompt
-   `src/pages/homepage.jsx`: line 106 has the output (if you want to format it to look better/my formatting is giving you bugs)

### Credits

This project was bootstrapped with (reactfolio)[https://github.com/truethari/reactfolio].
