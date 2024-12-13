const bcrypt = require("bcryptjs")
const db = require("../config/db")


// Register User
exports.register_user = async (req,res) => {
    let {first_name, last_name, email, password, phone, dob, gender, address} = req.body
    if (phone === "") {
        phone = null
    }
    if (dob === "") {
        dob = null
    }
    if (gender === "") {
        gender = null
    }
    if (address === "") {
        address = null
    }
    try {
        const [rows] = await db.execute("SELECT * FROM patients WHERE email = ?", [email])
        if (rows.length > 0) {
            res.status(400).json({message: "User already exist!"})
            return;
        }

        const hashed_password = await bcrypt.hash(password, 10)

        await db.execute(`INSERT INTO patients 
                    (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address)
                    VALUES
                    (?,?,?,?,?,?,?,?)`, [first_name, last_name, email, hashed_password, phone, dob, gender, address])

        res.status(200).json({message: "User Registered Successfully!", redirect: "/login"})

    }catch (err) {
        res.status(500).json({message: "An error occured!", err})
    }
}

exports.login_user = async (req,res) => {
    const { email, password } = req.body
    try {
        let [rows] = await db.execute("SELECT * FROM patients WHERE email = ?", [email])


        if (rows.length === 0 || rows[0].length === 0 ) {
          rows = await db.execute("SELECT * FROM doctors WHERE email = ?", [email]);
        }

        if (rows.length === 0 || rows[0].length === 0) {
          rows = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);
        }

        if (rows.length === 0 || rows[0].length === 0) {
            res.status(400).json({message: "Login Error, Email not registered."})
            return;
        } 
        
        let user = rows[0]

        if (Array.isArray(user)) {
            user = rows[0][0]
        }

        const password_matched = await bcrypt.compare(password, user.password_hash)

        if (password_matched) {
            if (user.patient_id) {
                const isoDate = user.date_of_birth;
                const date = new Date(isoDate);
                
                // Add one day to the date
                date.setUTCDate(date.getUTCDate() + 1);

                // Get the year, month, and day
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(date.getUTCDate()).padStart(2, '0');

                // Format the date as YYYY-MM-DD
                const formattedDate = `${year}-${month}-${day}`;

                req.session.user = {
                    patient_id: user.patient_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    dob: formattedDate,
                    gender: user.gender,
                    address: user.address
                }
            } else if (user.doctor_id) {
                req.session.user = {
                    doctor_id: user.doctor_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    schedule: user.schedule,
                    gender: user.gender,
                    specialization: user.specialization  // Assuming the doctor table has a 'specialty' column
                };
            } else if (user.admin_id) {
                req.session.user = {
                    admin_id: user.admin_id,
                    username: user.username,
                    email: user.email,
                    role: user.role  // Assuming the admin table has a 'role' column
                };
            }
            
            res.status(200).json({message: "Login Successfully!", redirect: "/dashboard"})
        } else {
            res.status(400).json({message: "Invalid Credential!"})
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error encountered", err})
    }
}

exports.validateUser = (req, res, next) => {
    if (req.session.user) {
      next(); // Proceed to the next middleware/route
    } else {
      res.redirect('/login'); // Redirect to login if not authenticated
    }
}