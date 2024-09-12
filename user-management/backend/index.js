const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../backend/.env") });
const port = process.env.PORT;
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoutes");
const database = require("./config/database");
database();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/',userRoute);
app.use('/',adminRoute);

app.listen(port, () => console.log(`server started running on ${port}`));
