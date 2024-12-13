var valid = true;

function validation(event) {
    let form = document.getElementById("form");
    
    // Fields
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let confirm_pswd = document.getElementById("confirm_pswd").value;
    let age = document.getElementById("age").value;
    let dob = document.getElementById("dob").value;
    let address = document.getElementById("address").value;
    let checked_check_box = document.getElementById("checkbox").checked;


    // Regex Patterns
    let name_regex_validation = /^[a-zA-Z\s]+$/;
    let email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phone_pattern = /^\+\d{1,3}\d{10}$/;
    let age_number_validation = /^[0-9]+$/;

    // Error Elements
    let first_name_error = document.getElementById("first_name_error");
    let last_name_error = document.getElementById("last_name_error");
    let email_error = document.getElementById("email_error");
    let phone_error = document.getElementById("phone_error");
    let password_error = document.getElementById("password_error");
    let confirm_pswd_error = document.getElementById("confirm_pswd_error");
    let age_error = document.getElementById("age_error");
    let dob_error = document.getElementById("dob_error");
    let address_error = document.getElementById("address_error");
    let agreement_error = document.getElementById("agreement_error");

    // Validations
    if (!first_name.match(name_regex_validation)) {
        first_name_error.innerHTML = "Please enter a valid first name.";
        valid = false;
        event.preventDefault();
    } else {
        first_name_error.innerHTML = "";
        valid = true;
    }

    if (!last_name.match(name_regex_validation)) {
        last_name_error.innerHTML = "Please enter a valid last name.";
        valid = false;
        event.preventDefault();
    } else {
        last_name_error.innerHTML = "";
        valid = true;
    }

    if (!email.match(email_pattern)) {
        email_error.innerHTML = "Please enter a valid email.";
        valid = false;
        event.preventDefault();
    } else {
        email_error.innerHTML = "";
        valid = true;
    }


    // Password length validation
    if (password.length < 8) {
        password_error.innerHTML = "Password must be at least 8 characters long.";
        valid = false;
        event.preventDefault();
    } else if (password !== confirm_pswd) {
        password_error.innerHTML = "Passwords do not match.";
        confirm_pswd_error.innerHTML = "Passwords do not match."
        valid = false;
        event.preventDefault();
    } else {
        password_error.innerHTML = "";
        confirm_pswd_error.innerHTML = "";
        valid = true;
    }

    if (!age.match(age_number_validation) || age < 18) {
        age_error.innerHTML = "Please enter a valid age (18 or older).";
        valid = false;
        event.preventDefault();
    } else {
        age_error.innerHTML = "";
        valid = true;
    }

    if (!checked_check_box) {
        agreement_error.innerHTML = "You must agree to the terms and conditions.";
        valid = false;
        event.preventDefault();
    } else {
        agreement_error.innerHTML = "";
        valid = true;
    }
}

/* New Function for Login Page Real-Time Data */
let real_time_data = () => {
    // Show the real_data div
    document.getElementById("real_data").style.display = "block";

    // Get the form element
    let form = document.getElementById("form");
    var data = {};

    // Get all input elements within the form
    let inputs = form.getElementsByTagName("input");

    // Iterate through each input element
    Array.from(inputs).forEach(form_input => {
        let inputValue = form_input.value;

        // Handle gender selection
        if (form_input.name === "gender") {
            if (form_input.checked) {
                data[form_input.name] = form_input.value; // Store selected gender
            } else {
                // Initialize gender as an empty string if not checked
                data[form_input.name] = data[form_input.name] || ""; 
            }
        } else if (form_input.name === "password") {
            // Store masked characters for password
            data[form_input.name] = inputValue ? "••••••••" : "";
        } else if (form_input.name === "password_confirmation") {
            // Store masked characters for password confirmation
            data[form_input.name] = inputValue ? "••••••••" : "";
        } else if (form_input.name === "Terms_and_conditions") {
            data[form_input.name] = form_input.checked ? "Agreed" : ""; // Store agreement status
        } else {
            // For all other fields, store the actual input value
            data[form_input.name] = inputValue;
        }
    });

    // Handle country selection from the dropdown
    let countrySelect = document.getElementById("country");
    data['country'] = countrySelect.value; // Get the selected country value

    // Get address from the textarea
    let addressField = document.getElementById("address");
    data['address'] = addressField.value || ""; // Ensure address is initialized properly

    // Update the real-time display spans
    let spans = document.getElementsByClassName("real_time_update");
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].getAttribute("name") === "first_name") {
            spans[i].innerHTML = "First Name: " + (data["first_name"] || "");
        } else if (spans[i].getAttribute("name") === "last_name") {
            spans[i].innerHTML = "Last Name: " + (data["last_name"] || "");
        } else if (spans[i].getAttribute("name") === "email") {
            spans[i].innerHTML = "Email: " + (data["email"] || "");
        } else if (spans[i].getAttribute("name") === "phone") {
            spans[i].innerHTML = "Phone: " + (data["phone"] || "");
        } else if (spans[i].getAttribute("name") === "password") {
            spans[i].innerHTML = "Password: " + (data["password"] || "");
        } else if (spans[i].getAttribute("name") === "password_confirmation") {
            spans[i].innerHTML = "Password Confirmation: " + (data["password_confirmation"] || "");
        } else if (spans[i].getAttribute("name") === "age") {
            spans[i].innerHTML = "Age: " + (data["age"] || "");           
        } else if (spans[i].getAttribute("name") === "gender") {
            spans[i].innerHTML = "Gender: " + (data["gender"] || "");            
        } else if (spans[i].getAttribute("name") === "dob") {
            spans[i].innerHTML = "Date of Birth: " + (data["dob"] || "");
        } else if (spans[i].getAttribute("name") === "address") {
            spans[i].innerHTML = "Address: " + (data["address"] || "");
        } else if (spans[i].getAttribute("name") === "Country") {
            spans[i].innerHTML = "Country: " + (data["country"] || "");
        } else if (spans[i].getAttribute("name") === "Terms_and_conditions") {
            spans[i].innerHTML = "Terms and Conditions: " + (data["Terms_and_conditions"] || "");
        }
    }
};


document.getElementById("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    if (valid) {
        let first_name = document.getElementById("first_name").value;
        let last_name = document.getElementById("last_name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let phone = document.getElementById("phone").value;
        let gender =  document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : "";
        let dob = document.getElementById("dob").value;
        let address = document.getElementById("address").value;

        const response = await fetch("/auth/register", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({first_name, last_name, email, password, phone, gender, dob, address})
        })

        const data = await response.json();
        alert(data.message);
        window.location.href = data.redirect

    } else {
        alert("Registration failed due to validation!")
    }
    
})