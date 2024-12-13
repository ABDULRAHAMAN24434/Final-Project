const db = require("../config/db");
const path = require('path');
const bcrypt = require("bcryptjs")

exports.validateUser = (req, res, next) => {
    if (req.session.user) {
      next(); // Proceed to the next middleware/route
    } else {
      res.sendFile(path.join(__dirname, "../public/HTML/log-in.html")); // Redirect to login if not authenticated
    }
}

exports.editProfile = async (req, res) => {
  let {first_name, last_name, email, gender, dof, address, phone, patient_id, username, role, user, admin_id, doctor_id, specialization, schedule} = req.body;
  first_name = first_name || null;
  last_name = last_name || null;
  email = email || null;
  gender = gender || null;
  dof = dof || null;
  address = address || null;
  phone = phone || null;
  username = username || null;
  specialization = specialization || null;
  schedule = schedule || null;
  role = role || null;
  user = user || null;
  
  try {

    if (user === "patient") {
      await db.execute(`UPDATE
        patients
      SET 
        first_name = ?,
        last_name = ?,
        email = ?,
        phone = ?,
        date_of_birth = ?,
        gender = ?,
        address = ?
      WHERE 
        patient_id = ? `, [first_name, last_name, email, phone, dof, gender, address, patient_id])
      res.status(200).json({message: "Profile edited successfully!!", redirect: "/login"})
    }

    if (user === "admin") {
      await db.execute(`UPDATE
        admins
      SET 
        username = ?,
        email = ?,
        role = ?
      WHERE 
        admin_id = ? `, [username, email, role, admin_id])
      res.status(200).json({message: "Profile edited successfully!!", redirect: "/login"})
    }

    if (user === "doctor") {
      await db.execute(`UPDATE
        doctors
      SET 
        first_name = ?,
        last_name = ?,
        email = ?,
        phone = ?,
        specialization = ?,
        schedule = ?
      WHERE 
        doctor_id = ? `, [first_name, last_name, email, phone, specialization, schedule, doctor_id])
      res.status(200).json({message: "Profile edited successfully!!", redirect: "/login"})
    }
    
  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error encountered", err})
}}

exports.bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, day, formattedTime, date, status } = req.body;
  
  try {
    await db.execute(`INSERT INTO appointments
      (patient_id, doctor_id, appointment_date, appointment_time, status)
    VALUES
      (?, ?, ?, ?, ?)`, [patient_id, doctor_id, date, formattedTime, status])
      res.status(200).json({message: "Appointment successfully booked!!"})
  }catch (err) {
    console.log(err)
    res.status(500).json({message: "Error encountered", err})
}}

exports.reappointment = async (req, res) => {
  const { appointmentId, newAppointmentDate, newAppointmentTime } = req.body;

  try {
    await db.execute(`UPDATE appointments
      SET
        appointment_date = ?,
        appointment_time = ?
      WHERE
        appointment_id = ?;
      `, [newAppointmentDate, newAppointmentTime, appointmentId]);
    
    res.status(200).json({message: "Appointment rescheduled successfully!", redirect: "/dashboard"})
  
  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error encountered", err})
  }

}

exports.cancelAppointment = async (req, res) => {
  const { status, appointment_id } = req.body;

  try {
    await db.execute(`UPDATE appointments
      SET
        status = ?
      WHERE
        appointment_id = ?;
      `, [ status, appointment_id ]);
    
    res.status(200).json({message: "Appointment canceled successfully!", redirect: "/dashboard"})
  
  } catch (err) {
    console.log(err)
    res.status(500).json({message: "Error encountered", err})
  }

}

exports.deleteAccount = async (req, res) => {
  const {userId, user} = req.body;

  if (user === "patient") {
    try {
      await db.execute(`DELETE FROM patients
        WHERE
          patient_id = ?;
        `, [ userId ]);
      
      res.status(200).json({message: "Account deleted successfully.", redirect: "/"})
    
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error encountered", err})
    }
  } else if (user === "doctor") {
    try {
      await db.execute(`DELETE FROM doctors
        WHERE
          doctor_id = ?;
        `, [ userId ]);
      
      res.status(200).json({message: "Account deleted successfully.", redirect: "/"})
    
    } catch (err) {
      console.log(err)
      res.status(500).json({message: "Error encountered", err})
    }
  }
  
  
}

exports.addDoctor = async (req, res) => {
  const { first_name, last_name, specialization, email, phone, schedule, password } = req.body;

  // Validation (ensure required fields are provided)
  if (!first_name || !last_name || !specialization || !email || !phone || !schedule || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {

    const hashed_password = await bcrypt.hash(password, 10)

    // Insert new doctor into the database
    const query = `
      INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [first_name, last_name, specialization, email, phone, schedule, hashed_password];

    await db.execute(query, values);

    res.status(201).json({ message: "Doctor added successfully!" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ message: "An error occurred while adding the doctor.", error });
  }
};