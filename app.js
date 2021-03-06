const express = require("express");
const bodyParse = require("body-parser");
const compression = require("compression")
const helmet = require("helmet")
const cors = require("cors")
    // todo: ref to helmet and cors;
if (process.env.NODE_ENV !== 'production') require("dotenv").config();
let port = process.env.PORT || 3000;

// 1. routes
const apiv1router = require("./routes/apiv1");

// 2. create express app
const app = express();
app.use(cors())
app.use(helmet())

app.use("/uploads", express.static("uploads"));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. connect to mongoDB
require("./dependencies/mongoConfig")

// 4. set-up app routes
app.use("/apiv1", apiv1router);

// 5. error handling
app.use((err, req, res) => {
    console.log(err);
    if (!res.headersSent) {
      res.status(err.httpStatusCode || 500).render('UnknownError');
    }
});

// 6. port app on server
app.listen(port, () => {
    console.log(`Debugger api listening on port http://localhost:${port}`);
});

