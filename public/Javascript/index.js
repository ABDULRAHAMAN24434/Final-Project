document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("bookAppointment").addEventListener("click", event => {
        event.preventDefault();
        alert("You must have registered and logged-in to book an appointment!")
    })
    
})


document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');

    function toggleMenu() {
        // Toggle the sidebar visibility
        sidebar.classList.toggle('show');

        // Change the hamburger to an 'X' when clicked
        if (sidebar.classList.contains('show')) {
            hamburger.innerHTML = '&#10005;'; // Change to 'X' symbol
        } else {
            hamburger.innerHTML = '&#9776;'; // Change back to hamburger
        }
    }

    // Add the click event listener to the hamburger button
    hamburger.addEventListener('click', toggleMenu);
});


