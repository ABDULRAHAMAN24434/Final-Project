function void_validation (tag) {
    tag.style.color = "red"
    tag.style.fontSize = "smaller"
}

/* New Function for Login Page Real-Time Data */
function log_in_validation (event) {
    let form = document.getElementById("login_form")
    let email = document.getElementById("email").value
    let email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    let password = document.getElementById("password").value
    let email_error = document.getElementById("email_error")
    let password_error = document.getElementById("password_error")

    if (email !== "" || password !== "") {
        let error_spans = document.getElementsByClassName("error_msg")
        for (let i = 0; i < error_spans.length; i++) {
            error_spans[i].innerHTML = "";
        }
    }

    if (email === "") {
        email_error.innerHTML = "Email is required"
        void_validation(email_error)
        event.preventDefault()
        alert("Please fill")
    } else if (email_pattern.test(email) === false) {
        email_error.innerHTML = "Invalid email input"
        void_validation(email_error)
        event.preventDefault()
        alert("Invalid email input")
    } else if (password === "") {
        password_error.innerHTML= "Password is required"
        void_validation(password_error)
        event.preventDefault()
        alert("Please fill")
    } else {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
        
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;
        
            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
        
                const data = await response.json();
        
                if (response.ok) {
                    if (data.redirect) {
                        // Redirect to the dashboard if specified
                        window.location.href = data.redirect;
                    } else {
                        alert(data.message); // Show success message
                    }
                } else {
                    // Handle errors
                    alert(data.message || "Login failed. Please try again.");
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        });
        
    }
};


function real_time_login_data() {
    // Display the real_data div
    let realDataDiv = document.getElementById("real_data");
    realDataDiv.style.display = "block";

    let form = document.getElementById("login_form");
    var data = {};

    // Get input elements
    let emailInput = form.querySelector('input[name="email"]');
    let passwordInput = form.querySelector('input[name="password"]');

    // Populate data object
    data["email"] = emailInput.value;
    // Instead of storing the actual password, store masked characters
    data["password"] = passwordInput.value ? "••••••••" : "";

    // Update the real-time display
    let spans = realDataDiv.getElementsByClassName("real_time_update");
    for (var i = 0; i < spans.length; i++) {
        let key = spans[i].getAttribute("name");
        if (data.hasOwnProperty(key)) {
            // Capitalize the first letter and append the value
            let displayKey = key.charAt(0).toUpperCase() + key.slice(1);
            spans[i].innerHTML = displayKey + ": " + data[key];
        }
    }
}