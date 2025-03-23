import API_URL from './config.js';

// Authentication functions
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
            localStorage.setItem("ownerName", data.ownerName); 
            localStorage.setItem("isRestaurant", "true");
            
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
    // Step 1 Fields
    const ownerName = document.getElementById('ownerName').value;
    const restaurantName = document.getElementById('restaurantName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const cuisineType = document.getElementById('cuisineType').value;
    const description = document.getElementById('description').value;

    // Step 2 Fields
    const coverImg = document.getElementById('coverImg').files[0];
    const bannerImg = document.getElementById('bannerImg').files[0];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let openingTimes = {};
    let closingTimes = {};

    days.forEach(day => {
        openingTimes[day] = document.getElementById(`${day.toLowerCase()}Open`).value;
        closingTimes[day] = document.getElementById(`${day.toLowerCase()}Close`).value;
    });

    // Validation Check
    if (!ownerName || !restaurantName || !email || !password || !confirmPassword || !phone || !address || !cuisineType || !coverImg || !bannerImg) {
        alert('Please fill out all required fields and upload images.');
        return { success: false };
    }

    // Password Confirmation Check
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return { success: false };
    }

    // Prepare Form Data for Image Upload
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
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('Error registering restaurant:', error);
        alert('Network error during registration. Please try again later.');
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