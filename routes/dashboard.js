const express = require("express");
const { validateUser, editProfile, bookAppointment, reappointment, cancelAppointment, deleteAccount, addDoctor } = require("../controllers/dashboard_controller");
const db = require("../config/db")

const router = express.Router()

router.get("/", validateUser, async (req, res) => {
    const user = req.session.user
    const doctors_db = await db.execute(`SELECT 
        *
        FROM doctors;`)
    const patients_db = await db.execute(`SELECT 
        *
        FROM patients;`)

    let appointments_db = [];

    if (user.patient_id) {
        appointments_db = await db.execute(`SELECT
            *
            FROM appointments
            WHERE patient_id = ${user.patient_id};`)
    } else if (user.doctor_id) {
        appointments_db = await db.execute(`SELECT
            *
            FROM appointments
            WHERE doctor_id = ${user.doctor_id};`)
    } else {
        appointments_db = await db.execute(`SELECT
            *
            FROM appointments;`)
    }
    const doctors = doctors_db[0] || doctors_db;
    const appointments = appointments_db[0] || appointments_db
    const patients = patients_db[0] || patients_db



    if (user.patient_id) {
        res.render("main", {user, doctors, appointments});
    } else if (user.doctor_id) {
        res.render("doctor", {user, doctors, appointments});
    } else if (user.admin_id) {
        res.render("admin", {user, doctors, appointments, patients});
    }
    
})

router.post("/editProfile", editProfile)

router.post("/bookAppointment", bookAppointment)

router.post("/reappointment", reappointment)

router.post("/cancelAppointment", cancelAppointment)

router.post("/deleteAccount", deleteAccount)

router.post("/addDoctor", addDoctor)

module.exports = router;