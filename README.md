# Quiz App

![screenshot-react-redux-ws-passport herokuapp com-2019 01 02-15-09-30](https://user-images.githubusercontent.com/11415818/50595434-917dae80-0ea0-11e9-8ee3-21f17e8daf24.png)


## Short overview

A real-time application, where users can register and play quizzes together, earn points and compete with each other.

## More detailed overview

Application with public and protected links for access control, handled by Passport on the back-end. Registered users can take part in quiz games in real-time with other players. All the game interactions are done through WebSocket with JWT authentication. Initial quiz questions and answers are downloaded from OpenTDB, parsed and inserted into database.

## Run locally

The local app expects MongoDB to be running on `mongodb://localhost:27017`.

```sh
# In ./app folder
$ yarn run app
# In ./server folder
$ yarn run server

```

## Tools used

**Front-end**

-   React
-   Redux
-   Immutable.js

**Back-end**

-   NodeJS
-   Express API
-   Passport authentication
-   WebSockets with JWT authentication

**Data**

-   OpenTDB (https://opentdb.com)

## TODO

-   [ ] Better error handling in back-end
-   [ ] Serve timer from back-end via WebSockets
-   [ ] Add `status` property to Quiz object in DB
-   [ ] Do not allow users to retry quizzes once successfully completed

## Demo

**Heroku App**

Link: https://react-redux-ws-passport.herokuapp.com
