require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bp = require("body-parser");
const cors = require("cors");
const app = express();
const session = require("express-session")
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.set("view engine","ejs")
app.use(express.static("static"))


mongoose.connect(process.env.DBURL, {useNewUrlParser: true});
mongoose.connection.once("open",()=>console.log("connected"))
.on("error",()=>console.log("error connecting to db"));


app.get("/",(req,res,next)=>{
    res.render("main")
});

app.get("/quiz",(req,res,next)=>{
    if(!req.session.user)
        return res.redirect("/")
    res.render("index")
});

app.get("/admin",(req,res,next)=>{
    res.render("admin")
});

app.use("/",require("./routes/user"));
app.use("/",require("./routes/admin"));
app.use("/",require("./routes/quiz"));

app.use((err,req,res,next)=>{
    console.log(err);
    res.send("Some error occurred").status(500);
});

app.listen(process.env.PORT || 3000, ()=>console.log("Listening"));