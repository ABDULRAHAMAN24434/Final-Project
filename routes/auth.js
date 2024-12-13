const express = require("express");
const { register_user, login_user, validateUser } = require("../controllers/auth_controller");


const router = express.Router()

router.post("/register", register_user);

router.post("/login", login_user)

router.get("/dashboard", validateUser, (req, res) => {
    const user = req.session.user
    res.render("main", {user})
})

module.exports = router;