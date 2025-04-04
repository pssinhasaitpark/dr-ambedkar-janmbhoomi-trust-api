const express = require("express");
const app = express();

require("dotenv").config();
const host = process.env.HOST;

const cors = require("cors");
const bodyParser = require("body-parser");


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.130:3000",
      "http://192.168.0.129:3000",
      "https://dr-ambedkarnagar-janmbhoomi.netlify.app",
      "https://admin-dr-ambedkar-janmbhoomi.netlify.app",
      "http://82.29.167.130:8000",
      "http://82.29.167.130",
      "https://82.29.167.130",
      "http://82.29.167.130:3000",
      "http://82.29.167.130:3001",
      "http://topperszone.com",
      "https://topperszone.com",
      "http://192.168.0.133:3000"
    ],
    methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const connectDB = require('./app/dbConfig/dbConfig');
connectDB();


require("./app/routes")(app);
require("./app/routes/media")(app);


app.get("/", (req, res) => {

  return res.status(200).send({
    error: false,
    message: "Welcome to Dr Ambedkar Janmbhoomi trust",
  });
});


const port = process.env.PORT || 5050;

// app.listen(port, host, () =>
//   console.log(`App is listening at port:http://${host}:${port}`)
// );


app.listen(port, () =>
  console.log(`App is listening at port:http://localhost:${port}`)
);