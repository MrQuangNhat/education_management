import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors';
require('dotenv').config();

let app = express();
// const corsOptions = {
//     credentials: true,
//     // origin: ['http://localhost:3000', 'http://localhost:8080'] // Whitelist the domains you want to allow
//     // origin: '*' // Whitelist the domains you want to allow
// };

// app.use(cors(corsOptions));
app.use(cors({ origin: true }));


//config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT;


app.listen(port, () => {
    //callback
    console.log("Runing on port : " + port)
})