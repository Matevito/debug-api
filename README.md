# Issue-tracker API
As this project name states, *Issue-tracker API* is a rest API that can handle basic functions of an issue tracker (ticket system, call it as you prefer it). It can be used in small teams to develop and handle multiple projects. The idea behind building this app was to get to know more this common tool used often in real software developer teams.

## BUILT WITH
The app is built at its core in *Express* and uses *mongodb* as a database. For authentication it uses a simple middleware route protection that uses as keys *JWT tokens*. The app can store too images with the use of *multer* and *Cloudinary*. So have in hand the credentials of an account when you setup the config variables of the app.

# GETTING STARTED
Before get started make sure that you own on your cpu the last version of nodejs. Also the project was developed using the cloud service of mongodb so have in hand an account and a key to access a database to connect it to the API . To get a local copy and get started follow the next steps.

1. Clone the repo

	    git clone https://github.com/Matevito/debug-api

2. Enter the app folder

        cd debug-api/

3. Install the npm packages

        npm i

4. Enter the following config values in an .env file

        NODE_ENV="development"
        DB_URL=<database access link>
        SALT_FACTOR=<the integer value of your choice>
        TOKEN_SECRET=<a secret string>

        CLOUD_NAME=<check your cloudinary credentials>
        API_KEY=<check your cloudinary credentials>
        API_SECRET=<check your cloudinary credentials>
        
    Set-up the *NODE_ENV* value to *production* once you deploy your app. Don't forget that the values of your cloudinary credentials can be obtained on your account settings.
    Also if you want to use the demo-functionalities of the app, set-up the following values of the accounts you will use on the database with its corresponding usernames or emails and its corresponding password on the db.

        ADMIN_SEC="<username or email> <password>"
        TEAML_SEC="<username or email> <password>"
        DEV_SEC="<username or email> <password>"
    
5. Run the app

        npm start

6. Once you have changed the code or added a new functionality be sure that you havent broken anything running the test suite

        npm run test

    or if you want a clearer feedback in an enriched html

        npm run test_coverage

# FEATURES

* API that works as a back-end for ticket-system app.
* Authentication using jwt and different type of layers of protection according the user role.
* Change-log inside the tickets to get access to how an issue has been handled until it's completed.
* Issues and comments can use screenshots for easiness in development.
* Demos routes easily removable that can give a quick access to the app to possible clients.
* It can handle tests using a virtual test database.

# USAGE
## app models
Before we begin with the usage of the app it's important to take a moment of which data the app stores and works with. The most important it's the *User* model and it stores a username, email and password of a user. It also stores its role on the app and this is key cause some functionalities are only available to some specific roles. The *Project* model it's the next most important and it works a reference point for making and working with issues. In the app you can only make a ticket in the context of a specific project. 
 
The *Issue* model works as your ticket and it can store a basic description and images to make more clear the task that it tries to solve. It has also some semantic variables that makes clear if the task is solving a bug or working on a documentation on an app, for example. The issue works as a reference point for *Comments* and *ChangeLog* model values. The first one works as a place to comment and make clarifications on a working ticket and the changelog stores the changes made of on an issue.
    
On a more secondary role there's a *Notification* model. It's not as robust as the other ones and it's not tested enough to be confident to use it but it basically stores notifications for a user of changes made on a project it's part on and its related data (changes on issues). It does not handle at the moment when a comment is made but this can be easily added on.
You can check exactly which data the mentioned models stores on the [*/models*](https://github.com/Matevito/debug-api/tree/master/models) folder.

## How to call the API
All the app routes are stored on */apiv1/*, except the images stored on the issues and comment models. So be sure when making calls to the API to call to the *root/apiv1/* after making any call, where root is wherever the app is running and apiv1 the name of the router of the app.
Other thing important to have in mind is that excluding */sign-in*, */log-in* and all the *demos* routes, all the listed routes require a valid *JWT-token* to be accessed.
## Using the API
### 1. Authentication routes
The following routes handle authentication and registration functionalities.

    POST "/sign-in" { username, password, repeatPassword, email }
    POST "/log-in" { username, password }

These routes are self-explanatory. It takes as a body the specified data values and return a corresponding response. In the case of *sign-in* it checks if the username or email has already been taken and other error-handling as different passwords or a username too short. It does not send as a response a valid token so once a user has made an account it needs to make a call to the *log-in* route.

    POST "/whoami"
The route requires a valid token and returns the username, email and role of the user of the sent token. It works as a middle point where the app communicates to the front-end the role of a user to display some data and as a check-point for valid tokens and communicate if a user already has access to the app or not.
### 2. Protected routes
All the following routes require a valid token to be accessed. This token is obtained making a call to the */log-in* route and need to be stored on a header called *"auth-token"*. If the token is not valid it will send a corresponding response. In all the following routes if a notifications or changeLog value is returned in the body response, it's value corresponds to a Boolean and according to its value indicates if the notifications and changeLogs have been made.
#### 2.1 Project routes

    POST "/project" {title, description, team:array, teamLeader}
Creating a new project is an action that only admin users can use. The team array is conformed of the valid ids of users in the app and a title and description of at least 5 characters is required. The team leader is also required and needs to be inside the team array of users. Also if the selected user as team leader has the role of developer it's role is changed to *Team leader*. The title value need to be too unique.

    GET "/project/:id"
    GET "/project/list"
To access a project info, the user that makes the request need to be part of the project team or being an admin. It returns too all the issues that make a reference to the requested project. On the other hand, the */list* route takes all the projects the request user is part of and return their titles and id's. If the user is an admin it return's all the projects in db.

    PUT "/project/:id" {title, description, team:array, teamLeader}
The request user of the *put* call needs to be an admin or be the project leader of the project. the requirements of the parsed data are the same of the *post* call.

    DELETE "/project/:id" 
All *delete* functionalities on the app are only available to admins. The route not only delete the project object from db but too all its related data. To be more precise, it's *issues* and it's corresponding *comments* and *changelogs*. The users that became *team leaders* working on the deleted project remain with its new role value status. Even if they are no longer leaders of another project.
#### 2.2 Issue routes

    POST "/project/:id/issue" {title, description, project, priority, type, screenshots}
First of all, the user that makes the request of a new issue in just needs to be part of the project team or being an admin. the title and description values are simple strings. The project value, on the other hand, needs to be a valid id of a project stored on db. It seems quite redundant at first sight cause the project id is stablished when making the call but I wanted to be the more descriptive enough on the form making of the route.
The screenshots value is not needed. But remember that if you want to add images to the issue, on the header of the request state the *Content-Type* value to *multipart/form-data*. The *handlingTeam* value is set to *a blank array* by default and its status value to *open*. So the creation of an issue does not assignate a user to a ticket.
Last but not least important, the priority and type valid values are:

**_type:_** bugg-error, feature req, documentation req

**_priority:_** low, mid, high

    GET "/project/:id/issue/list"
    GET "/issue/:id"
A valid response of this get methods require the request user to be part of the project team. The */issue/list* route returns all issues of the requested project but does not sends its changeLog or comments sections. To get this data make a call to the specific issue you want to get its info.

    PUT "/issue/:id/take-issue"
    PUT "/issue/:id/leave-issue"
To take an issue make a request to the */take-issue route*. The route handles if the request user is already part of the ticket handling-team. The */leave-issue* as its name implies removes a request user of its handling-team. All this routes and the *put issue* one stores all its changes on a changelog. Because the way the route works a team-leader cannot remove a user from a ticket by itself.

    PUT "/issue/:id" {description, status, priority, type}
The *defacto* route to store the progress on an issue-ticket. The description priority and type values where explained on the creation of an issue route. One think to have in mind with the status value is that a developer cannot parse the status value as *solved*, so it needs to parse it as *under review* and wait for the project-team leader to change it. The screenshots cannot be deleted or changed and the title too, so be ware when making an issue. Don't forget that the valid values for status are the following:

**_status:_** open, aditional info needed, in progress, under review, solved.

    POST "/issue/:id/comment" {message, screenshots}
A comment can be created on an issue by any user part of the project team. It only needs a message string value but it can contain and array of screenshots images. Remember that when making a call if files are sent you need to set the *Content-Type* value on your header-request to *multipart/form-data*. The *user* value on the comment object is set to the request user id the response sends the saved comment and a list of al comments of the issue.

     DELETE "/issue/:id"
As it was clarified previously, this route can only be made by an admin user. It not only deletes the issue object from db but it deletes too it's comments and changelogs. So be aware when using this route.
### 3. User routes
    GET "/user/list"
    GET "/user/:id"
The user get routes can be made by any user, independent of it's role or projects it's part of. The */user/list* route sends the username, id, role and email of all the users on db. The */user/:id* sends the user info and the projects and issues it's part of.

    PUT "/user/:id/make-admin"
The only method that provides to edit user info is a */make-admin* request and can only be performed by and admin. As it's expected, the route makes the user with the id of the request an admin. The route handles if the parsed user is already an admin.
### 4. Demo routes
    POST "/demo/admin"
    POST "/demo/teamLeader"
    POST "/demo/developer"
The demo routes are an easy way to access the app without creating an account an experience in firsthand the differences between been an admin, team leader or a developer.
As it's quite evident, these controllers are meant to be used only when a project is in its development phase, or as part of a portfolio, for vulnerability reasons. The controllers to be set-up require, first, that the user to be used as demos already exist on db and to set the username and passwords value as an environment config value.
The reason of this consist in that all this routes user the */log-in* controller and use a middleware to set its authentication values. Certainly a more secure way to handle these demos is having a separate controller to handle the authentication so feel free to do it if you want to.
## Contact
You can find me easily writing me an email to madiazt@unal.edu.co or sending me a message to my [git-hub account](https://github.com/Matevito).