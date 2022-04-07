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
        DB_URL=\<database access link>
        SALT_FACTOR=\<the integer value of your choice>
        TOKEN_SECRET=\<a secret string>

    Set-up the *NODE_ENV* value to *production* once you deploy your app. Also if you want to use the demo-functionalities of the app, set-up the following values of the accounts you will use on the database with it's corresponding usernames or emails and its corresponding password on the db.

        ADMIN_SEC="\<username or email> \<password>"
        TEAML_SEC="\<username or email> \<password>"
        DEV_SEC="\<username or email> \<password>"
    
5. Run the app

        npm start

6. Once you have changed the code or added a new functionality be sure that you havent broken anything running the test suite

        npm run test

    or if you want a more clear feedback in an enriched html

        npm run test_coverage

# FEATURES

* API that works as a back-end for ticket-system app.
* Authentication using jwt and diferent type of layers of protection according the user role.
* Issues and comments can use screenshots for easiness in development.
* Demos routes easily removable that can give a quick access to the app to possible clients or interviwers.
* It can handle tests using a virtual test database.

# USAGE
....
Models...
- User()
- Project()
- Issue()

complementary models.
- Comment(),
- ChangeLog(),
- Notification()





Usage 
The root of the app routes is "/apiv1/". Hav in mind that all of the following routes start with this route to evade possible buggs. Also, it's important to notice that excluding the sign-in, log-in and demos routes all of the listed routes require a valid jwt token to be accessible (have this in mind if you want to implement this api on  a frontend or develop new features and want to make new test to them).

1. Authentication

    1.1 sign-in log-in
        -POST "/sign-in" { username, password, repeatPassword, email }

        -POST "/log-in" { username, password }

    1.2 demos
    The demo routes 
        - POST

        - POST "

        - POST "/
    1.3 whoami

2. Protect routes

    - POST "/project"

    - GET "/project/:id"

    - PUT "/project/:id"

    - DELETE "/project/:id"

    - GET "/project/list"
    only for admins
    