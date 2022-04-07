# Issue-tracker API
As this project name states, *Issue-tracker API* is a rest API that can handle basic functions of an issue tracker (ticket system, call it as you prefer it). It can be used in small teams to develop and handle multiple projects. The idea behind building this app was to get to know more this common tool used often in real software developer teams.

## BUILT WITH
The app is build at it's core in *express* and uses *mongodb* as a database. For authentication it uses a simple middleware route protection that uses as keys *JWT tokens*. The app can store too images on the folder */upload*  where the API it's running using *multer* to store the files. The images are not store on the database but just a valid link to access them.

# GETTING STARTED
Before get started make sure that you own on your cpu the last version of nodejs. Also the project was developed using the cloud service of mongodb so have in hand an account and a key to access a database to connect it to the API . To get a local copy and get started follow the next steps.

1. Clone the repo

	    git clone https://github.com/Matevito/debug-api

2. Enter the app folder

        cd debug-api/

3. Install npm packages

        npm i

4. Enter the following config values in an .env file

        NODE_ENV="development"
        DB_URL=<database access link>
        SALT_FACTOR=<the integer value of your choice>
        TOKEN_SECRET=<a secret string>

    Set-up the *NODE_ENV* value to *production* once you deploy your app. Also if you want to use the demo-functionalities of the app, set-up the following values of the accounts you will use on the database with it's corresponding usernames or emails and its corresponding password on the db.

        ADMIN_SEC="<username or email> <password>"
        TEAML_SEC="<username or email> <password>"
        DEV_SEC="<username or email> <password>"
    
5. Run the app

        npm start

6. Once you have changed the code or added a new functionality be sure that you havent broken anything running the test suite

        npm run test

    or if you want a more clear feedback in an enriched html

        npm run test_coverage

# FEATURES

* API that works as a back-end for ticket-system app.
* Authentication using jwt and diferent type of layers of protection according the user role.
* Change-log inside the tickets to get access to how an issue has been handled until it's completed.
* Issues and comments can use screenshots for easiness in development.
* Demos routes easily removable that can give a quick access to the app to possible clients or interviwers.
* It can handle tests using a virtual test database.

# USAGE
## app models
Before we begin with the usage of the app it's important to take a moment of which data the app stores and works with. The most important it's the *User* model and it stores a username, email and password of a user. It also stores it's role on the app and this is key cause some functionalities are only available to some specific roles. The *Project* model it's the next most important and it works a reference point for making and working with issues. In the app you can only make a ticket in the context of an specific project. 
 
The *Issue* model works as your ticket and it can stores a basic description and images to make more clear the task that it tries to solve. It has also some semanthic variables that makes clear if the task is solving a bug or working on a documentation on an app, for example. The issue works as a reference point for *Comments* and *ChangeLog* model values. The first one works as a place to comment and make clarifications on a working ticket and the changelog stores the changes made of on an issue.
    
On a more secondary role there's a *Notification* model. It's not as robust as the other ones and it's not tested enough to be confident to use it but it bassically stores notifications for a user of changes made on a project it's part on and it's related data (changes on issues). It does not handle at the moment when a comment is made but this can be easily added on.
You can check exactly wich data the mentioned models stores on the [*/models*](https://github.com/Matevito/debug-api/tree/master/models) folder.
## How to call the api
All the app routes are stored on */apiv1/*, except the images stored on the issues and comment models. So be sure when making calls to the api to call to the *root/apiv1/* after making any call, where root is wherever the app is running and apiv1 the name of the router of the app.
Other thing important to have in mind is that excluding */sign-in*, */log-in* and all the *demos* routes, all the listed routes require a valid *JWT-token* to be accessed.
## Using the api
### 1. Authentication routes
The following routes handle  authentication and registration functionalities.

    POST "/sign-in" { username, password, repeatPassword, email }
    POST "/log-in" { username, password }

These routes are self explanatory. It takes as a body the specified data values and return a corresponding response. In the case of *sign-in* it checks if the username or email has already been taken and other error-handling as different passwords or an username too short. It does not send as a response a valid token so once a user has made an account it needs to make a call to the *log-in* route.

    POST "/whoami"
The route requires a valid token and returns the username, email and role of the user of the sent token. It works as a middlepoint where the app comunicates to the front-end the role of a user to dissplay some data and as a check-point for valid tokens and communicate if a user already has access to the app or not.
### 2. Protected routes
All the following routes require a valid token to be accessed. This token is obtained making a call to the */log-in* route and need to be stored on a header called *"auth-token"*. If the token is not valid it will send a corresponding response. In all the following routes if a notifications or changeLog value is returned in the body response, it's value corresponds to a boolean and aacccording to it's value indicates if the notifications and changeLogs have been made.
#### 2.1 Project routes

    POST "/project" {title, description, team:array, teamLeader}
Creating a new project is an action abilitated to anly admin users. The team array is conformed of the valid id's of users in the app and a title and description of at least 5 characters is required. The team leader is also required and needs to be inside the team array of users. Also if the selected user as team leader has the role of developer it's role is changed to *Team leader*. The title value need to be too unique.

    GET "/project/:id"
    GET "/project/list"
To access a project info the user that makes the request need to be part of the project team or being an admin. It returns too all the issues that make a reference to the requested project. On the other hand, the */list* route takes all the projects the request user is part of and return their titles and id's. If the user is an admin it return's all the projects in db.

    PUT "/project/:id" {title, description, team:array, teamLeader}
The request user of the *put* call needs to be an admin or be the project leader of the project. the requirements of the parsed data are the same of the *post* call.

    DELETE "/project/:id" 
All *delete* functionalities on the app are only available to admins. The route not only delete the project object from db but too all it's related data. To be more preccisse, it's *issues* and it's corresponding *comments* and *changelogs*. The users tha became *team leaders* wroking on the deleted project remain with it's new role value status. Even if they are no longer leaders of another project.
#### 2.2 Issue routes
    POST "/project/:id/issue" {...}
    GET "/project/:id/issue/list"
    GET "/issue/:id"
    
    PUT "/issue/:id/take-issue" {}
    PUT "/issue/:id/leave-issue" {}
    PUT "/issue/:id" {...}
    
    DELETE "/issue/:id"
    
    POST "/issue/:id/comment" {...}
### 3. User routes
    GET "/user/list"
    GET "/user/:id"
    PUT "/user/:id/make-admin"
### 4. Demo routes
    POST "/demo/admin"
    POST "/demo/teamLeader"
    POST "/demo/developer"
## Contact
You can find me easily writting meto and email to madiazt@unal.edu.co or sending me a message to my [git-hub account](https://github.com/Matevito).