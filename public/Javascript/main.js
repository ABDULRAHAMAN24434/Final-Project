function showContent(sectionId) {
  const headerTitle = {
    profile: "Profile Information",
    booking: "Book Appointment",
    appointments: "Upcoming Appointments",
    delete: "Delete Account",
    patients: "Patients",
    addDoctors: "Add Doctors",
  };

  // Display loading indicator
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.classList.remove("hidden");

  // Temporarily change header title to "Loading..."
  document.getElementById("header-title").innerText = "Loading...";

  // Delay to simulate content loading
  setTimeout(() => {
    // Hide the loading indicator
    loadingIndicator.classList.add("hidden");

    // Update the header title
    document.getElementById("header-title").innerText = headerTitle[sectionId] || "Dashboard";

    // Hide all sections
    const sections = document.querySelectorAll(".content-section");
    sections.forEach((section) => section.classList.remove("active"));

    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.add("active");
  }, 500); // 500ms delay
}


// Initialize by showing profile section
document.addEventListener('DOMContentLoaded', () => {
  showContent('profile');
});


document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.createElement("div"); // Create overlay dynamically
  overlay.className = "overlay";
  document.body.appendChild(overlay);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    const isSidebarActive = sidebar.classList.toggle("active");
    overlay.classList.toggle("active", isSidebarActive);
    sidebarToggle.innerHTML = isSidebarActive ? "X" : "☰"; // Toggle icon
  };

  // Toggle sidebar and overlay on button click
  sidebarToggle.addEventListener("click", toggleSidebar);

  // Hide sidebar and overlay on clicking overlay
  overlay.addEventListener("click", toggleSidebar);
});





function toggleEditProfile() {
  const profileView = document.getElementById('profile-view');
  const profileEdit = document.getElementById('profile-edit');
  
  if (profileEdit.style.display === 'none') {
    // Hide view mode, show edit mode
    profileView.style.display = 'none';
    profileEdit.style.display = 'flex';
  } else {
    // Show view mode, hide edit mode
    profileView.style.display = 'block';
    profileEdit.style.display = 'none';
  }
}

async function saveChanges(user_id) {
  try {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("user_email").value;
    let gender = document.getElementById("user_gender").value;
    let dof = document.getElementById("user_dof").value;
    let address = document.getElementById("user_address").value;
    let phone = document.getElementById("user_phone").value;
    const patient_id = parseInt(user_id, 10);
    let user = "patient";

    const response = await fetch("/dashboard/editProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, first_name, last_name, email, gender, dof, address, phone, patient_id }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.redirect) {
        window.location.href = data.redirect;
        alert(data.message);
      }
    } else {
      alert(data.message || "Profile edit failed! Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while saving changes. Please try again.");
  }
}

async function saveDoctorChanges(user_id) {
  try{
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let specialization = document.getElementById("specialization").value;
    let schedule = document.getElementById("schedule").value;
    let phone = document.getElementById("phone").value;
    let user = "doctor";
    const doctor_id = parseInt(user_id, 10);

    // Backend call
    const response = await fetch("/dashboard/editProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctor_id, email, phone, first_name, last_name, user, specialization, schedule }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.redirect) {
        window.location.href = data.redirect;
        alert(data.message);
      }
    } else {
        alert(data.message || "Profile edit failed! Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    console.log(error)
    alert("An error occurred while saving changes. Please try again.");
  }  
}

async function saveAdminChanges(user_id) {
  try{
    let username = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let role = document.getElementById("role").value;
    let user = "admin";
    const admin_id = parseInt(user_id, 10);

    // Backend call
    const response = await fetch("/dashboard/editProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id, email, role, username, user }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.redirect) {
        window.location.href = data.redirect;
        alert(data.message);
      }
    } else {
        alert(data.message || "Profile edit failed! Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    console.log(error)
    alert("An error occurred while saving changes. Please try again.");
  }  
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addDoctorForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    addDoctors();
  });
});

async function addDoctors() {
  console.log("I am working");

  console.log("Form submission started");
  try {
    // Collect form data
    const first_name = document.getElementById("firstName").value;
    const last_name = document.getElementById("lastName").value;
    const specialization = document.getElementById("specialization").value;
    const email = document.getElementById("newEmail").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("newPassword").value;


    const scheduleInput = document.getElementById("schedule").value;
    let schedule;

    try {
      schedule = JSON.parse(scheduleInput); // Convert to JSON object
    } catch (error) {
      alert("Invalid schedule format. Please provide a valid JSON object.");
      return;
    }

    console.log({
      first_name,
      last_name,
      email,
      phone,
      schedule,
      password,
    });

    // Backend request
    const response = await fetch("/dashboard/addDoctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, specialization, email, phone, schedule, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Doctor added successfully!");
      document.getElementById("addDoctorForm").reset(); // Reset the form
    } else {
      alert(data.message || "Failed to add doctor. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}
 


// Attach an event listener to all appointment forms
document.querySelectorAll('.appointmentForm').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Extract the doctor ID from the form's ID
    const formId = form.getAttribute('id'); // e.g., "appointmentForm-1"
    const doctorId = formId.split('-')[1];

    // Collect data from the form
    const patientId = form.getAttribute('data-patient-id'); // Use data attributes for clarity
    const day = document.querySelector(`#day-${doctorId}`).value;
    const time = document.querySelector(`#time-${doctorId}`).value;
    const date = document.querySelector(`#date-${doctorId}`).value;
    let formattedTime = time.padStart(2, '0') + ':00:00'; // This will convert it to '09:00:00'
    let status = "Successful"

    // Basic validation
    if (!day || !time || !date) {
      alert('Please fill out all the fields!');
      return;
    }

    // Prepare data to send
    const formData = {
      patient_id: parseInt(patientId),
      doctor_id: parseInt(doctorId),
      day,
      formattedTime,
      date,
      status
    };

    try {
      // Send data to the backend
      const response = await fetch('/dashboard/bookAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error(error);
      alert('Failed to book appointment. Please try again.');
    }
  });
});




function filterPatients() {
  const genderFilter = document.getElementById('genderFilter').value.toLowerCase();
  const lastNameFilter = document.getElementById('lastNameFilter').value.toLowerCase();
  const rows = document.querySelectorAll('#patientsTable tbody tr');

  rows.forEach(row => {
    const gender = row.dataset.gender;
    const lastName = row.dataset.lastname;

    // Check if the row matches both filters
    const matchesGender = (genderFilter === 'all' || gender === genderFilter);
    const matchesLastName = (lastNameFilter === '' || lastName.startsWith(lastNameFilter));

    // Show or hide the row based on the filters
    if (matchesGender && matchesLastName) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function viewPatient(patientId) {
  alert(`Viewing details for patient ID: ${patientId}`);
}

async function handleAddDoctor(event) {
  event.preventDefault(); // Prevent default form submission
  
  // Get form data
  const formData = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    specialization: document.getElementById("specialization").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    schedule: document.getElementById("schedule").value, // This should be a valid JSON string
  };

  try {
    // Validate schedule field is in JSON format
    JSON.parse(formData.schedule);

    // Send data to the server (example URL)
    const response = await fetch('/api/doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Doctor added successfully!');
      document.getElementById("addDoctorForm").reset(); // Clear the form
    } else {
      const errorData = await response.json();
      alert(`Failed to add doctor: ${errorData.message}`);
    }
  } catch (error) {
    alert('Invalid schedule format. Please provide a valid JSON object.');
  }
}

// JavaScript for opening and closing the reschedule form
function openRescheduleForm(appointmentId, appointmentDate, appointmentTime) {
  const form = document.getElementById('rescheduleForm');
  form.style.display = 'block';
  
  // Pre-fill the form with current appointment details
  document.getElementById('newAppointmentDate').value = appointmentDate;
  document.getElementById('newAppointmentTime').value = appointmentTime;
}

function closeRescheduleForm() {
  const form = document.getElementById('rescheduleForm');
  form.style.display = 'none';
}

function openRescheduleForm(appointmentId) {
  // Populate the hidden field with the appointment ID
  document.getElementById('appointmentId').value = appointmentId;
  
  // Show the modal
  document.getElementById('rescheduleModal').style.display = 'block';
}

function closeRescheduleForm() {
  // Hide the modal
  document.getElementById('rescheduleModal').style.display = 'none';

}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('reappointmentForm').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent default form submission

      const formData = {
          appointmentId: document.getElementById("appointmentId").value,
          newAppointmentDate: document.getElementById("newAppointmentDate").value,
          newAppointmentTime: document.getElementById("newAppointmentTime").value // Corrected
      };

      try {
          const response = await fetch('/dashboard/reappointment', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });

          if (response.ok) {
              const result = await response.json();
              if (result.redirect) {
                  alert(result.message);
                  window.location.href = result.redirect;
              }
              document.getElementById("reappointmentForm").reset(); // Clear the form
          } else {
              const errorData = await response.json();
              alert(`Failed to reschedule appointment: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while rescheduling the appointment.');
      }
  });
});


async function cancelAppointment(appointmentId) {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    // Send a request to cancel the appointment

    const formData = {
      status: 'Cancelled',
      appointment_id: appointmentId
    }

    try {
      const response = await fetch('/dashboard/cancelAppointment', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });

      if (response.ok) {
          const result = await response.json();
          if (result.redirect) {
              alert(result.message);
              window.location.href = result.redirect;
          }
      } else {
          const errorData = await response.json();
          alert(`Failed to cancel appointment: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while canceling the appointment.');
    }
  };
}


document.addEventListener("DOMContentLoaded", function () {
  const deleteButton = document.querySelector('.deleteButton');

  deleteButton.addEventListener('click', async function () {
      const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!confirmation) {
          return; // Exit if the user cancels
      }

      try {
          // Get the user ID from the hidden input field
          const userId = parseInt(document.getElementById("delUserID").value);
          const user = "patient";

          const response = await fetch('/dashboard/deleteAccount', {
              method: 'POST', // Or POST if DELETE with body causes issues
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId }) // Send userId directly
          });

          if (response.ok) {
              const result = await response.json();
              alert(result.message || "Account deleted successfully.");
              window.location.href = result.redirect || '/'; // Redirect if specified
          } else {
              const errorData = await response.json();
              alert(`Failed to delete account: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error:', error);
          alert("An error occurred while attempting to delete your account.");
      }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const deleteButton = document.querySelector('.deleteButtonDoctor');

  deleteButton.addEventListener('click', async function () {
      const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!confirmation) {
          return; // Exit if the user cancels
      }

      try {
          // Get the user ID from the hidden input field
          const userId = parseInt(document.getElementById("delUserID").value);
          const user = "doctor";

          const response = await fetch('/dashboard/deleteAccount', {
              method: 'POST', // Or POST if DELETE with body causes issues
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId, user }) // Send userId directly
          });

          if (response.ok) {
              const result = await response.json();
              alert(result.message || "Account deleted successfully.");
              window.location.href = result.redirect || '/'; // Redirect if specified
          } else {
              const errorData = await response.json();
              alert(`Failed to delete account: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error:', error);
          alert("An error occurred while attempting to delete your account.");
      }
  });
});