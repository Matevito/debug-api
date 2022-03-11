Issue tracker API
...
API-DEBUG is a rest api that can hadnle the basic functions of the backen of an issue tracker app (ticket siystem.., call it whatever you want). It can be used in small dev teams to develop and handle a particular project. The idea behind building it was the get to know this common tool used oftenly in real teams of software developing.

It is built on express and uses mongoDB as a database. Jwt tokens are uses as an authentication sistem and handles all the basic CRUD operations.

Models...
- User()
- Project()
- Issue()

complementary models.
- Comment(),
- ChangeLog(),
- Notification()

Instalation...
create an uploads folder and inside it an screenshots too.

Features....
- Authentication using jwt and diferent type of layers of protection according the user role.
- Issues and comments can use screenshots for easiness in development.
- Demos routes easily removable that can give a quick access to the app to possible clients or interviwers.
- Basic notification sistem.
- It can handle tests using a virtual test database.


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
    