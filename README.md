# Crossword-App

### Table of Contents
* [General Info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Resources](#resources)


### General info

Do you like solving crosswords? Do you like creating crosswords? Don't you want to be dirty because of pen? Are you ECO? If you said yes at least once, this application is for you! 
Here you can create your own crossword from scratch and share it with people all over the world, solve crosswords made by other users. Everything is under admin's supervision, who is responsible for crosswords correctness. 
Just create an account and start crosswording!

IMPORTANT - App is not fully adjusted for mobiles!


### Technologies

#### Database
* Mongo DB

#### Backend
* Node.js
* Express.js
* JavaScript

#### Frontend
* React
* JavaScript
* Redux
* JSX
* HTML
* CSS


### Setup

If you want to launch this application just go to <a href='https://krulikos-crosswords-app.web.app'>DEMO</a> site! ^<br>
To launch app on your local computer, you have to execute undermentioned steps^^^: 
1. Open terminal and make sure you have installed npm and node.js on your local machine -> ``$ npm -v`` and ``$ node -v`` (this commands check versions of npm and node.js
2. Clone this repository -> ``$ git clone https://github.com/kam237zasada/crosswordApp.git``
3. Go into client directory in project -> ``$ cd crosswordApp/client``
4. Install all dependencies -> ``$ npm i`` or ``$ npm install``
5. Run app on localhost:8000 -> ``$ npm start`` (it should open Web Browser automatically)
6. Open another terminal directly inside server directory in project (crosswordApp/server)
7. Install all dependencies -> ``$ npm i`` or ``$ npm install``
8. Run server on localhost:3000 -> ``$ node index.js``

^ Here you have credentials for example existing user:
``login: player123``
``password: password123``<br>
^^ If you want to sign as Admin, to see how looks from Admin's point of view, don't wait and just write to me.<br>
^^^ Some features would not be working because of environment variables which have to be hide. If you want to see full performance of application see <a href='https://krulikos-crosswords-app.web.app'>DEMO</a>. 


### Features

#### User

* Creating an accout
* Updating password
* Password reminder
* Resending of activation link

#### Admin

* Adding and deleting admins
* Approving and rejecting crosswords

#### Crosswords

* Creating crosswords: selecting blank fields, fields with questions, solutions etc. (only signed in)
* Solving crosswords
* Saving progress of solving crosswords in database (only signed in)
* Adding reviews to solved crosswords (only signed in)
* How many times crossword was solved and tried
* Assignment of solved crossword to user

#### Others

* Application is protected with jsonwebtoken
* bcrypt to hash passwords


### Resources

* Font-Awesome
* Semantic-UI (Loader & Progress bar)

