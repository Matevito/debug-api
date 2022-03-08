const express = require("express");
const bodyParse = require("body-parser");
 
    // todo: ref to helmet and cors;
if (process.env.NODE_ENV !== 'production') require("dotenv").config();
let port = process.env.PORT || 3000;

// 1. routes

// 2. create express app
const app = express();

// 3. connect to mongoDB
require("./dependencies/mongoConfig")

// 4. set-up app routes

// 5. error handling

// 6. port app on server
app.listen(port, () => {
    console.log(`Debugger api listening on port http://localhost:${port}`);
});

