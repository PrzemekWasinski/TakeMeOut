import API_URL from './config.js';

//Authentication functions
async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return { success: false };
    }

    try {
        let response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.name);
            return { success: true, data };
        } else {
            const errorData = await response.json(); 
            alert("Login failed: " + (errorData.message || response.statusText));
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Network error during login. Check the console for details.");
        return { success: false, error };
    }
}

async function register() {
    const form = document.getElementById("register-form");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = form.querySelector("input[type='text']").value;

    if (!name || !email || !password) {
        alert("Please fill out all required fields");
        return { success: false };
    }

    try {
        let response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        if (response.ok) {
            alert("Registration successful! Please login.");
            return { success: true, navigateTo: 'login' };
        } else {
            const data = await response.json();
            alert("Registration failed: " + (data.message || "Unknown error"));
            return { success: false, error: data };
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Network error during registration. Check the console for details.");
        return { success: false, error };
    }
}

async function loginRestaurant() {
    const email = document.getElementById("restaurant-email").value;
    const password = document.getElementById("restaurant-password").value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return { success: false };
    }

    try {
        let response = await fetch(`${API_URL}/restaurants/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("Login Response:", data);  

        if (response.ok) {
            localStorage.setItem("restaurantToken", data.token);
            localStorage.setItem("restaurantName", data.restaurantName);
            localStorage.setItem("restaurantId", data.restaurantId);
            localStorage.setItem("ownerName", data.ownerName); 
            localStorage.setItem("isRestaurant", "true");
            
            // Decode JWT and store the email
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            const email = payload?.email || payload?.Email;
            if (email) {
                localStorage.setItem("restaurantEmail", email);
            }

            
            return { success: true, data, ownerName: data.ownerName };
        } else {
            alert("Login failed: " + (data.message || response.statusText));
            return { success: false, error: data };
        }
    } catch (error) {
        console.error("Error during restaurant login:", error);
        alert("Network error during login. Check the console for details.");
        return { success: false, error };
    }
}

async function registerRestaurant() {
    const submitButton = document.getElementById('submit-signup');
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    // Step 1 Fields
    const ownerName = document.getElementById('ownerName').value;
    const restaurantName = document.getElementById('restaurantName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    
    // Step 2 (New Address Fields)
    const doorNumber = document.getElementById('doorNumber').value;
    const road = document.getElementById('road').value;
    const city = document.getElementById('city').value;
    const postcode = document.getElementById('postcode').value;

    // Concatenate full address
    const address = `${doorNumber}, ${road}, ${city}, ${postcode}`;

    const cuisineType = document.getElementById('cuisineType').value;
    const description = document.getElementById('description').value;

    // Step 3 Fields
    const coverImg = document.getElementById('coverImg').files[0];
    const bannerImg = document.getElementById('bannerImg').files[0];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let openingTimes = {};
    let closingTimes = {};

    days.forEach(day => {
        openingTimes[day] = document.getElementById(`${day.toLowerCase()}Open`).value;
        closingTimes[day] = document.getElementById(`${day.toLowerCase()}Close`).value;
    });

    // Regex patterns for validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^\d{10,15}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

    // Basic field validation
    if (!ownerName || !restaurantName || !email || !password || !confirmPassword || !phone || !doorNumber || !road || !city || !postcode || !cuisineType || !coverImg || !bannerImg) {
        alert('Please fill out all required fields and upload images.');
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false };
    }

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false };
    }

    if (!phonePattern.test(phone)) {
        alert('Please enter a valid phone number (10-15 digits).');
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false };
    }

    if (!passwordPattern.test(password)) {
        alert('Password must be at least 8 characters and include both letters and numbers.');
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false };
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false };
    }

    const formData = new FormData();
    formData.append("OwnerName", ownerName);
    formData.append("RestaurantName", restaurantName);
    formData.append("Email", email);
    formData.append("Password", password);
    formData.append("ConfirmPassword", confirmPassword);
    formData.append("Phone", phone);
    formData.append("Address", address);
    formData.append("CuisineType", cuisineType);
    formData.append("Description", description);
    formData.append("CoverIMG", coverImg);
    formData.append("BannerIMG", bannerImg);
    formData.append("OpeningTimes", JSON.stringify(openingTimes));
    formData.append("ClosingTimes", JSON.stringify(closingTimes));

    try {
        const response = await fetch(`${API_URL}/restaurants/register`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please sign in.');
            return { success: true, navigateTo: 'restaurant-login' };
        } else {
            alert('Registration failed: ' + (data.message || 'Unknown error'));
            submitButton.disabled = false;
            submitButton.textContent = "Sign Up";
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('Error registering restaurant:', error);
        alert('Network error during registration. Please try again later.');
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false, error };
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("restaurantToken");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("isRestaurant");
    return { success: true };
}

async function fetchUserData() {
    try {
        let response = await fetch(`${API_URL}/auth/home`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (response.ok) {
            let data = await response.json();
            return { success: true, data };
        } else {
            return { success: false, shouldLogout: true };
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { success: false, error };
    }
}

export { 
    loginUser, 
    register, 
    loginRestaurant, 
    registerRestaurant, 
    logout, 
    fetchUserData 
};