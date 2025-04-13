import API_URL from './config.js';

//Authentication functions

//User login function
async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //Clear previous error messages and remove red borders
    document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-field').forEach(el => el.classList.remove('border-red-500'));
    const form = document.getElementById('login-form');
    const existingFormError = form.querySelector('.text-red-500.text-sm.mb-4');
    if (existingFormError) {
        existingFormError.remove();
    }

    let hasErrors = false;

    //Validate email
    if (!email.trim()) {
        document.getElementById('email-error').textContent = 'Email is required';
        document.getElementById('email').classList.add('border-red-500');
        hasErrors = true;
    }

    //Validate password
    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        document.getElementById('password').classList.add('border-red-500');
        hasErrors = true;
    }

    if (hasErrors) {
        return { success: false };
    }

    //Send login details to backend
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

        //If user logged in successfully
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", `${data.firstName} ${data.lastName}`);
            return { success: true, data };
        //If login failed
        } else {
            const errorData = await response.json(); 
            if (errorData.message.includes('email')) {
                document.getElementById('email-error').textContent = errorData.message;
                document.getElementById('email').classList.add('border-red-500');
            } else if (errorData.message.includes('password')) {
                document.getElementById('password-error').textContent = errorData.message;
                document.getElementById('password').classList.add('border-red-500');
            } else {
                const formError = document.createElement('p');
                formError.className = 'text-red-500 text-sm mb-4';
                formError.textContent = errorData.message;
                form.insertBefore(formError, form.firstChild);
            }
            return { success: false, error: errorData };
        }
    //If an error occured
    } catch (error) {
        console.error("Error during login:", error);
        const formError = document.createElement('p');
        formError.className = 'text-red-500 text-sm mb-4';
        formError.textContent = 'Network error during login. Please try again later.';
        form.insertBefore(formError, form.firstChild);
        return { success: false, error };
    }
}

//User register function
async function register() {
    const form = document.getElementById("register-form");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    //Debugging
    console.log('Form values:', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    });

    //Clear previous error messages and remove red borders
    document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-field').forEach(el => el.classList.remove('border-red-500'));
    const existingFormError = form.querySelector('.text-red-500.text-sm.mb-4');
    if (existingFormError) {
        existingFormError.remove();
    }

    let hasErrors = false;

    //Validate first name
    if (!firstName || !firstName.trim()) {
        document.getElementById('firstName-error').textContent = 'First name is required';
        document.getElementById('firstName').classList.add('border-red-500');
        hasErrors = true;
        console.log('First name validation failed');
    }

    //Validate last name
    if (!lastName || !lastName.trim()) {
        document.getElementById('lastName-error').textContent = 'Last name is required';
        document.getElementById('lastName').classList.add('border-red-500');
        hasErrors = true;
        console.log('Last name validation failed');
    }

    //Email regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !email.trim()) {
        document.getElementById('email-error').textContent = 'Email is required';
        document.getElementById('email').classList.add('border-red-500');
        hasErrors = true;
        console.log('Email validation failed - empty');
    } else if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        document.getElementById('email').classList.add('border-red-500');
        hasErrors = true;
        console.log('Email validation failed - invalid format');
    }

    //Password regex
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        document.getElementById('password').classList.add('border-red-500');
        hasErrors = true;
        console.log('Password validation failed - empty');
    } else if (!passwordPattern.test(password)) {
        document.getElementById('password-error').textContent = 'Password must be at least 8 characters and include both letters and numbers';
        document.getElementById('password').classList.add('border-red-500');
        hasErrors = true;
        console.log('Password validation failed - invalid format');
    }

    //Validate confirm password
    if (!confirmPassword) {
        document.getElementById('confirmPassword-error').textContent = 'Please confirm your password';
        document.getElementById('confirmPassword').classList.add('border-red-500');
        hasErrors = true;
        console.log('Confirm password validation failed - empty');
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPassword-error').textContent = 'Passwords do not match';
        document.getElementById('confirmPassword').classList.add('border-red-500');
        hasErrors = true;
        console.log('Confirm password validation failed - mismatch');
    }

    if (hasErrors) {
        console.log('Form validation failed');
        return { success: false };
    }

    console.log('Form validation passed sending request...');

    //Send register details to backend
    try {
        const requestBody = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: password
        };
        console.log('Request body:', requestBody);

        let response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Server response:', data);

        //If register was successful
        if (response.ok) {
            return { success: true, navigateTo: 'login' };
        //If register was unsuccessful
        } else {
            if (data.message.includes('email')) {
                document.getElementById('email-error').textContent = data.message;
                document.getElementById('email').classList.add('border-red-500');
            } else if (data.message.includes('password')) {
                document.getElementById('password-error').textContent = data.message;
                document.getElementById('password').classList.add('border-red-500');
            } else {
                const formError = document.createElement('p');
                formError.className = 'text-red-500 text-sm mb-4';
                formError.textContent = data.message;
                form.insertBefore(formError, form.firstChild);
            }
            return { success: false, error: data };
        }
    //If an error occured
    } catch (error) {
        console.error("Registration error:", error);
        const formError = document.createElement('p');
        formError.className = 'text-red-500 text-sm mb-4';
        formError.textContent = 'Network error during registration. Please try again later.';
        form.insertBefore(formError, form.firstChild);
        return { success: false, error };
    }
}

//Login function for restaurants
async function loginRestaurant() {
    const email = document.getElementById("restaurant-email").value;
    const password = document.getElementById("restaurant-password").value;

    // Clear previous error messages and remove red borders
    document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-field').forEach(el => el.classList.remove('border-red-500'));
    const form = document.getElementById('restaurant-login-form');
    const existingFormError = form.querySelector('.text-red-500.text-sm.mb-4');
    if (existingFormError) {
        existingFormError.remove();
    }

    let hasErrors = false;

    //Validate email
    if (!email.trim()) {
        document.getElementById('restaurant-email-error').textContent = 'Email is required';
        document.getElementById('restaurant-email').classList.add('border-red-500');
        hasErrors = true;
    }

    //Validate password
    if (!password) {
        document.getElementById('restaurant-password-error').textContent = 'Password is required';
        document.getElementById('restaurant-password').classList.add('border-red-500');
        hasErrors = true;
    }

    if (hasErrors) {
        return { success: false };
    }

    //Send login details to backend
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

        //If login was successful
        if (response.ok) {
            localStorage.setItem("restaurantToken", data.token);
            localStorage.setItem("restaurantName", data.restaurantName);
            localStorage.setItem("restaurantId", data.restaurantId);
            localStorage.setItem("ownerName", data.ownerName); 
            localStorage.setItem("isRestaurant", "true");
            localStorage.setItem("currentRestaurantEmail", email);
            
            return { success: true, data, ownerName: data.ownerName };
        //If login was unsuccessful
        } else {
            if (data.message.includes('email')) {
                document.getElementById('restaurant-email-error').textContent = data.message;
                document.getElementById('restaurant-email').classList.add('border-red-500');
            } else if (data.message.includes('password')) {
                document.getElementById('restaurant-password-error').textContent = data.message;
                document.getElementById('restaurant-password').classList.add('border-red-500');
            } else {
                const formError = document.createElement('p');
                formError.className = 'text-red-500 text-sm mb-4';
                formError.textContent = data.message;
                form.insertBefore(formError, form.firstChild);
            }
            return { success: false, error: data };
        }
    //If lan error occured
    } catch (error) {
        console.error("Error during restaurant login:", error);
        const formError = document.createElement('p');
        formError.className = 'text-red-500 text-sm mb-4';
        formError.textContent = 'Network error during login. Please try again later.';
        form.insertBefore(formError, form.firstChild);
        return { success: false, error };
    }
}

//Register function for restaurants
async function registerRestaurant() {
    const submitButton = document.getElementById('submit-signup');
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";

    // Clear previous error messages and remove red borders
    document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-field').forEach(el => el.classList.remove('border-red-500'));
    const form = document.getElementById('restaurant-signup-form');
    if (form) {
        const existingFormError = form.querySelector('.text-red-500.text-sm.mb-4');
        if (existingFormError) {
            existingFormError.remove();
        }
    }

    //Retrieve data from input fields
    //Owner and restaurant details
    const ownerName = document.getElementById('ownerName').value;
    const restaurantName = document.getElementById('restaurantName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('phone').value;
    
    // Address
    const doorNumber = document.getElementById('doorNumber').value;
    const road = document.getElementById('road').value;
    const city = document.getElementById('city').value;
    const postcode = document.getElementById('postcode').value;
    const address = `${doorNumber}, ${road}, ${city}, ${postcode}`;
    const cuisineType = document.getElementById('cuisineType').value;
    const description = document.getElementById('description').value;

    //Restaurant images and opening times
    const coverImg = document.getElementById('coverImg').files[0];
    const bannerImg = document.getElementById('bannerImg').files[0];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let openingTimes = {};
    let closingTimes = {};

    days.forEach(day => {
        openingTimes[day] = document.getElementById(`${day.toLowerCase()}Open`).value;
        closingTimes[day] = document.getElementById(`${day.toLowerCase()}Close`).value;
    });

    //Regex 
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^\d{10,15}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

    let hasErrors = false;

    //Check if fields match regex
    if (!ownerName.trim()) {
        document.getElementById('ownerName-error').textContent = 'Owner name is required';
        document.getElementById('ownerName').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!restaurantName.trim()) {
        document.getElementById('restaurantName-error').textContent = 'Restaurant name is required';
        document.getElementById('restaurantName').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!email.trim()) {
        document.getElementById('email-error').textContent = 'Email is required';
        document.getElementById('email').classList.add('border-red-500');
        hasErrors = true;
    } else if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        document.getElementById('email').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        document.getElementById('password').classList.add('border-red-500');
        hasErrors = true;
    } else if (!passwordPattern.test(password)) {
        document.getElementById('password-error').textContent = 'Password must be at least 8 characters and include both letters and numbers';
        document.getElementById('password').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!confirmPassword) {
        document.getElementById('confirmPassword-error').textContent = 'Please confirm your password';
        document.getElementById('confirmPassword').classList.add('border-red-500');
        hasErrors = true;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPassword-error').textContent = 'Passwords do not match';
        document.getElementById('confirmPassword').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!phone.trim()) {
        document.getElementById('phone-error').textContent = 'Phone number is required';
        document.getElementById('phone').classList.add('border-red-500');
        hasErrors = true;
    } else if (!phonePattern.test(phone)) {
        document.getElementById('phone-error').textContent = 'Please enter a valid phone number (10-15 digits)';
        document.getElementById('phone').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!doorNumber.trim()) {
        document.getElementById('doorNumber-error').textContent = 'Door number is required';
        document.getElementById('doorNumber').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!road.trim()) {
        document.getElementById('road-error').textContent = 'Road is required';
        document.getElementById('road').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!city.trim()) {
        document.getElementById('city-error').textContent = 'City is required';
        document.getElementById('city').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!postcode.trim()) {
        document.getElementById('postcode-error').textContent = 'Postcode is required';
        document.getElementById('postcode').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!cuisineType) {
        document.getElementById('cuisineType-error').textContent = 'Cuisine type is required';
        document.getElementById('cuisineType').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!coverImg) {
        document.getElementById('coverImg-error').textContent = 'Cover image is required';
        document.getElementById('coverImg').classList.add('border-red-500');
        hasErrors = true;
    }

    if (!bannerImg) {
        document.getElementById('bannerImg-error').textContent = 'Banner image is required';
        document.getElementById('bannerImg').classList.add('border-red-500');
        hasErrors = true;
    }

    if (hasErrors) {
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

    //Sends register details to backend
    try {
        const response = await fetch(`${API_URL}/restaurants/register`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        //If register was successsful
        if (response.ok) {
            return { success: true, navigateTo: 'restaurant-login' };
        //If register was unsuccessful
        } else {
            if (data.message.includes('email')) {
                document.getElementById('email-error').textContent = data.message;
                document.getElementById('email').classList.add('border-red-500');
            } else {
                const formError = document.createElement('p');
                formError.className = 'text-red-500 text-sm mb-4';
                formError.textContent = data.message;
                document.getElementById('restaurant-signup-form').insertBefore(formError, document.getElementById('restaurant-signup-form').firstChild);
            }
            //Disable register button after user presses it
            submitButton.disabled = false;
            submitButton.textContent = "Sign Up";
            return { success: false, error: data };
        }
    //If an error has occured
    } catch (error) {
        console.error('Error registering restaurant:', error);
        const formError = document.createElement('p');
        formError.className = 'text-red-500 text-sm mb-4';
        formError.textContent = 'Network error during registration. Please try again later.';
        document.getElementById('restaurant-signup-form').insertBefore(formError, document.getElementById('restaurant-signup-form').firstChild);
        submitButton.disabled = false;
        submitButton.textContent = "Sign Up";
        return { success: false, error };
    }
}

//Logout function
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("restaurantToken");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("isRestaurant");
    return { success: true };
}

//Function to retrieve user data
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

//Make user details available in other files
export { 
    loginUser, 
    register, 
    loginRestaurant, 
    registerRestaurant, 
    logout, 
    fetchUserData 
};