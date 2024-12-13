const express = require("express")
const db = require("./config/db")
const session = require("express-session")
const PORT = 3300
const auth_routes = require("./routes/auth")
const path = require("path")
const dashboardRoutes = require("./routes/dashboard")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, '/public')))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(session({
    key: "rahmon_jago",
    secret: "qweertyuiiuiuytrerwewwertyuiioiuytrerwe",
    resave: false,
    saveUninitialized: false
}))

app.get("/", async (req,res) => {
    res.sendFile(path.join(__dirname, "/public/HTML/index.html"))
})

app.get("/hospitals", async (req,res) => {
    res.sendFile(path.join(__dirname, "/public/HTML/nearbyHealthCenters.html"))
})

app.get("/register", async (req,res) => {
    res.sendFile(path.join(__dirname, "/public/HTML/register.html"))
})

app.get("/login", async(req,res) => {
    res.sendFile(path.join(__dirname, "/public/HTML/log-in.html"))
})

app.get("/contact", async(req,res) => {
    res.sendFile(path.join(__dirname, "/public/HTML/contactUs.html"))
})

app.get("/about", async(req,res) => {
    res.sendFile(path.join(__dirname, "/public/HTML/aboutUs.html"))
})

app.get("/main", async(req,res) => {
    let schedules = {"Monday": "09:00-17:00", "Wednesday": "09:00-17:00"}
    let user = {
        id: 3,
        role: "admin",
        name: "Ada",
        email: "rahmon_nosiru@yahoo.com",
        phone: "+2349095263747",
        gender: "Male",
        dof: "2000-10-05",
        specialization: "Cardiology",
        schedule : schedules
    }

    let patients = [{
        name: "Ada",
        details: "Female"
    }];

    res.render("main", {user, patients});
})

app.use("/auth", auth_routes)
app.use("/dashboard", dashboardRoutes)


app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})