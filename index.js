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
      "http://192.168.0.117:3000",
      "http://192.168.0.121:3000",
      "https://dr-ambedkarnagar-janmbhoomi.netlify.app",
      "https://admin-dr-ambedkar-janmbhoomi.netlify.app"
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

app.get("/", (req, res) => {

  return res.status(200).send({
    error: false,
    message: "Welcome to Dr Ambedkar Janmbhoomi trust",
  });
});


const port = process.env.PORT || 5050;

app.listen(port, host, () =>
  console.log(`App is listening at port:http://${host}:${port}`)
);
