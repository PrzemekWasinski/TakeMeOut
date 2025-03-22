const API_URL = "http://localhost:5215/api";

// Templates
const homeContentTemplate = `
    <!-- Hero Section -->
    <div class="bg-black text-white py-16">
        <div class="max-w-6xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-4">Hungry? You're in the right place</h1>
            <div class="flex flex-col sm:flex-row gap-4">
                <input type="text" placeholder="Enter delivery address" class="px-4 py-2 rounded-full w-full sm:w-96 text-black">
                <button class="bg-green-500 px-6 py-2 rounded-full hover:bg-green-600">Find Food</button>
            </div>
        </div>  
    </div>

    <!-- Restaurant Grid -->
    <div class="max-w-6xl mx-auto px-4 py-8">
        <h2 class="text-2xl font-bold mb-6">Popular Restaurants</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Restaurant Cards -->
            <div class="restaurant-card cursor-pointer" data-restaurant-id="1" onclick="selectRestaurant(1, 'Burger Palace')">
                <img src="https://via.placeholder.com/400x250" alt="Restaurant" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Burger Palace</h3>
                    <p class="text-gray-600">⭐ 4.5 (500+ ratings)</p>
                    <p class="text-gray-600">$$ • Burgers • American</p>
                    <p class="text-gray-600">20-30 min delivery</p>
                </div>
            </div>

            <div class="restaurant-card cursor-pointer" data-restaurant-id="2" onclick="selectRestaurant(2, 'Sushi Master')">
                <img src="https://via.placeholder.com/400x250" alt="Restaurant" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Sushi Master</h3>
                    <p class="text-gray-600">⭐ 4.8 (300+ ratings)</p>
                    <p class="text-gray-600">$$$ • Japanese • Sushi</p>
                    <p class="text-gray-600">25-35 min delivery</p>
                </div>
            </div>

            <div class="restaurant-card cursor-pointer" data-restaurant-id="3" onclick="selectRestaurant(3, 'Pizza Express')">
                <img src="https://via.placeholder.com/400x250" alt="Restaurant" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">Pizza Express</h3>
                    <p class="text-gray-600">⭐ 4.3 (400+ ratings)</p>
                    <p class="text-gray-600">$$ • Italian • Pizza</p>
                    <p class="text-gray-600">15-25 min delivery</p>
                </div>
            </div>
        </div>
    </div>
`;

const loginFormTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Sign In</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="Email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="Password" class="input-field">
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <label class="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
                <button type="submit" class="submit-btn">Sign In</button>
            </form>
            <div class="text-center mt-4">
                <p>Don't have an account? <a href="#" onclick="loadContent('register')" class="text-blue-600 hover:underline">Sign up</a></p>
                <p class="mt-2 text-sm">Are you a restaurant? <a href="#" onclick="loadContent('restaurant-login')" class="text-blue-600 hover:underline">Restaurant Sign In</a></p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const registerFormTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="register-form" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" required class="input-field">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" required class="input-field">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" placeholder="Email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" placeholder="Password" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input type="password" required class="input-field">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" required class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                    <label class="ml-2 block text-sm text-gray-700">I agree to the Terms and Privacy Policy</label>
                </div>
                <button type="submit" class="submit-btn">Sign Up</button>
            </form>
            <div class="text-center mt-4">
                <p>Already have an account? <a href="#" onclick="loadContent('login')" class="text-blue-600 hover:underline">Sign in</a></p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const aboutTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">About Us</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <div id="about-content" class="prose max-w-none">
                <p>EatMeOut is a premier food delivery platform connecting hungry customers with their favorite local restaurants.</p>
                <p>Founded in 2023, we've quickly grown to serve over 50 cities worldwide, with a mission to make food delivery fast, reliable, and affordable for everyone.</p>
                <p>Our platform features thousands of restaurant partners, from local favorites to national chains, ensuring you can always find exactly what you're craving.</p>
                <p>With our dedicated delivery network, we ensure your food arrives hot and fresh, exactly when you want it.</p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const partnerTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Become a Partner</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="partner-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Business Name</label>
                    <input type="text" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Business Type</label>
                    <select class="input-field">
                        <option>Restaurant</option>
                        <option>Delivery Service</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Contact Email</label>
                    <input type="email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" class="input-field">
                </div>
                <button type="submit" class="submit-btn">Submit Application</button>
            </form>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

const restaurantSignupTemplate = `
    <div class="max-w-4xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Sign Up</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            
            <!-- Step 1: Basic Information -->
            <div id="signup-step-1">
                <h2 class="text-xl font-bold mb-4">Step 1: Basic Information</h2>

                <label class="block text-sm font-medium text-gray-700">Owner Name</label>
                <input type="text" id="ownerName" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Restaurant Name</label>
                <input type="text" id="restaurantName" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" required class="input-field">
                <span id="password-error" style="color: red; display: none;">Passwords do not match.</span>

                <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" id="phone" required class="input-field">

                <label class="block text-sm font-medium text-gray-700">Cuisine Type</label>
                <select id="cuisineType" required class="input-field">
                    <option value="">Select cuisine type</option>
                    <option value="Italian">Italian</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                    <option value="American">American</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Thai">Thai</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Other">Other</option>
                </select>

                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="description" rows="4" class="input-field" placeholder="Tell us about your restaurant..."></textarea>

                <button id="next-step" class="submit-btn">Next</button>
            </div>

            <!-- Step 2: Image Upload & Operating Hours -->
            <div id="signup-step-2" class="hidden">
                <h2 class="text-xl font-bold mb-4">Step 2: Images & Operating Hours</h2>

                <div class="flex gap-6">
                    <!-- Cover Image (Square) -->
                    <div class="image-box w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                        id="coverPreview" onclick="document.getElementById('coverImg').click()">
                        <span class="text-gray-600 text-center">Click to Upload<br>Cover Image</span>
                    </div>
                    <input type="file" id="coverImg" class="hidden" accept="image/*" onchange="previewImage(event, 'coverPreview')">
                    
                    <!-- Banner Image (Longer) -->
                    <div class="image-box w-64 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                        id="bannerPreview" onclick="document.getElementById('bannerImg').click()">
                        <span class="text-gray-600 text-center">Click to Upload<br>Banner Image</span>
                    </div>
                    <input type="file" id="bannerImg" class="hidden" accept="image/*" onchange="previewImage(event, 'bannerPreview')">
                </div>

                <h3 class="text-lg font-bold mt-4">Opening & Closing Times</h3>
                ${generateTimeFields()}

                <div class="flex justify-between">
                    <button id="back-step" class="back-btn">← Back</button>
                    <button id="submit-signup" class="submit-btn">Sign Up</button>
                </div>
            </div>
        </div>
    </div>
`;


const restaurantLoginTemplate = `
    <div class="max-w-md mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Sign In</h1>
        <div class="bg-white rounded-lg shadow-md p-6">
            <form id="restaurant-login-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Restaurant Email</label>
                    <input type="email" id="restaurant-email" placeholder="Email" class="input-field">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="restaurant-password" placeholder="Password" class="input-field">
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <label class="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <a href="#" class="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
                <button type="submit" class="submit-btn">Sign In</button>
            </form>
            <div class="text-center mt-4">
                <p>Don't have a restaurant account? <a href="#" onclick="loadContent('restaurant-signup')" class="text-blue-600 hover:underline">Register your Restaurant</a></p>
                <p class="mt-2 text-sm">Not a restaurant? <a href="#" onclick="loadContent('login')" class="text-blue-600 hover:underline">Customer Sign In</a></p>
            </div>
        </div>
        <button onclick="showHome()" class="back-btn">← Back to Home</button>
    </div>
`;

// Save original home content when page loads
let originalHomeContent;

document.addEventListener("DOMContentLoaded", () => {
    // Check for existing token in local storage
    const token = localStorage.getItem("token");
    updateNavigation(!!token);
    showHome();
    
    // Handle browser back button
    window.onpopstate = function(event) {
        if (event.state === null) {
            showHome();
        }
    };

    // Add event listener for the create order button
    const createOrderBtn = document.getElementById("create-order-btn");
    if (createOrderBtn) {
        createOrderBtn.addEventListener("click", () => {
            const sampleOrderData = {
                RestaurantId: 1, // Example restaurant ID
                orderItems: [
                    { ItemName: "Sample Item 1", Quantity: 2, UnitPrice: 10.00 },
                    { ItemName: "Sample Item 2", Quantity: 1, UnitPrice: 15.00 }
                ]
            };
            createOrder(sampleOrderData);
        });
    }
});

function generateTimeFields() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return days.map(day => `
        <div class="flex gap-4 items-center mb-2">
            <label class="w-24">${day}:</label>

            <div class="relative flex-grow">
                <input type="time" id="${day.toLowerCase()}Open" class="input-field w-full pr-10" onclick="this.showPicker()">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onclick="document.getElementById('${day.toLowerCase()}Open').showPicker()">⏰</span>
            </div>

            <div class="relative flex-grow">
                <input type="time" id="${day.toLowerCase()}Close" class="input-field w-full pr-10" onclick="this.showPicker()">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onclick="document.getElementById('${day.toLowerCase()}Close').showPicker()">⏰</span>
            </div>
        </div>
    `).join("");
}

function loadProfilePage() {
    document.getElementById("dynamic-content").innerHTML = `
        <div class="max-w-screen-xl mx-auto px-16 pt-40 pb-16 slide-up bg-white shadow-md rounded-md">>
            <h1 class="text-3xl font-bold mb-6 text-center">Restaurant Profile</h1>
            <form id="restaurant-profile-form" class="space-y-4">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Left Side: Basic Information -->
                    <div class="bg-gray-50 p-6 rounded-md shadow">
                        <h2 class="text-xl font-semibold mb-4">Basic Information</h2>

                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Owner Name</label>
                                <input type="text" id="OwnerName" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Restaurant Name</label>
                                <input type="text" id="RestaurantName" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="Email" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="text" id="Phone" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Address</label>
                                <input type="text" id="Address" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Cuisine Type</label>
                                <input type="text" id="CuisineType" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="Description" class="input-field editable w-full" rows="4" readonly></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Images & Opening Hours -->
                    <div class="bg-gray-50 p-6 rounded-md shadow">
                        <h2 class="text-xl font-semibold mb-4">Images & Operating Hours</h2>

                        <div class="flex gap-4 mb-6">
                            <!-- Cover Image -->
                            <div class="flex flex-col items-center">
                                <label class="text-sm font-medium text-gray-700">Cover Image</label>
                                <div class="image-box w-32 h-32 border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                                    id="coverPreview" onclick="document.getElementById('CoverIMG').click()">
                                    <span class="text-gray-600 text-center">Upload</span>
                                </div>
                                <input type="file" id="CoverIMG" class="hidden" accept="image/*" onchange="previewImage(event, 'coverPreview')">
                            </div>

                            <!-- Banner Image -->
                            <div class="flex flex-col items-center">
                                <label class="text-sm font-medium text-gray-700">Banner Image</label>
                                <div class="image-box w-64 h-32 border-2 border-dashed border-gray-400 rounded-md bg-gray-100 cursor-pointer"
                                    id="bannerPreview" onclick="document.getElementById('BannerIMG').click()">
                                    <span class="text-gray-600 text-center">Upload</span>
                                </div>
                                <input type="file" id="BannerIMG" class="hidden" accept="image/*" onchange="previewImage(event, 'bannerPreview')">
                            </div>
                        </div>

                        <h3 class="text-lg font-bold mt-4 mb-2">Opening & Closing Times</h3>
                        <div id="opening-times" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                    </div>
                </div>

                <!-- Edit & Save Buttons -->
                <div class="flex justify-center mt-6">
                    <button type="button" id="edit-profile" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Edit</button>
                    <button type="button" id="save-profile" class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 hidden">Save</button>
                </div>

            </form>
        </div>
    `;

    loadRestaurantProfile();
}


// Fetch and populate restaurant profile data
async function loadRestaurantProfile() {
    const token = localStorage.getItem("restaurantToken");
    if (!token) {
        alert("Please log in first.");
        loadContent('restaurant-login');
        return;
    }

    try {
        console.log("Fetching restaurant profile from API...");

        const response = await fetch(`${API_URL}/restaurants/profile`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const responseText = await response.text();
        console.log("Raw Response Text:", responseText);

        if (!response.ok) {
            console.warn("Profile request failed. Status:", response.status);
            
            if (response.status === 401 || response.status === 403) {
                alert("Session expired. Please log in again.");
                logout();
                return;
            }

            alert(`Failed to load profile data. Status: ${response.status}`);
            return;
        }

        const data = JSON.parse(responseText);
        console.log("Parsed Profile Data:", data);

        populateProfileFields(data);
    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Network error occurred while loading profile.");
    }
}

function populateProfileFields(data) {
    document.getElementById("OwnerName").value = data.ownerName || "N/A";
    document.getElementById("RestaurantName").value = data.restaurantName || "N/A";
    document.getElementById("Email").value = data.email || "N/A";
    document.getElementById("Phone").value = data.phone || "N/A";
    document.getElementById("Address").value = data.address || "N/A";
    document.getElementById("CuisineType").value = data.cuisineType || "N/A";
    document.getElementById("Description").value = data.description || "N/A";

    // Ensure JSON Parsing is correct for Opening and Closing Times
    const openingTimes = typeof data.openingTimes === "string" ? JSON.parse(data.openingTimes) : data.openingTimes;
    const closingTimes = typeof data.closingTimes === "string" ? JSON.parse(data.closingTimes) : data.closingTimes;

    console.log("Parsed Opening Times:", openingTimes);
    console.log("Parsed Closing Times:", closingTimes);

    populateOperatingHours(openingTimes, closingTimes);

    if (data.coverIMG) {
        document.getElementById("coverPreview").style.backgroundImage = `url('${data.coverIMG}')`;
    }
    if (data.bannerIMG) {
        document.getElementById("bannerPreview").style.backgroundImage = `url('${data.bannerIMG}')`;
    }

    document.getElementById("edit-profile").addEventListener("click", enableProfileEditing);
    document.getElementById("save-profile").addEventListener("click", saveProfile);
}

function populateOperatingHours(openingTimes, closingTimes) {
    let html = "";
    
    if (!openingTimes || !closingTimes) {
        console.error("Opening or Closing Times are missing:", openingTimes, closingTimes);
        // Add default days of week if times are missing
        html = `
            <div class="flex gap-4 items-center mb-2">
                <label class="w-24">Monday:</label>
                <input type="time" id="MondayOpen" class="input-field w-1/2 editable" value="" readonly>
                <input type="time" id="MondayClose" class="input-field w-1/2 editable" value="" readonly>
            </div>
            <!-- Add similar elements for other days of the week -->
        `;
        document.getElementById("opening-times").innerHTML = html;
        return;
    }

    const days = Object.keys(openingTimes);

    days.forEach(day => {
        const openValue = openingTimes[day] || "";
        const closeValue = closingTimes[day] || "";

        html += `
        <div class="grid grid-cols-3 gap-4 items-center mb-2">
            <label class="text-right font-medium">${day}:</label>
            <input type="time" id="${day}Open" class="input-field editable" value="${openValue}" readonly>
            <input type="time" id="${day}Close" class="input-field editable" value="${closeValue}" readonly>
        </div>
        `;

    });

    document.getElementById("opening-times").innerHTML = html;
}

// Enable profile editing
function enableProfileEditing() {
    document.querySelectorAll(".editable").forEach(input => input.removeAttribute("readonly"));
    document.getElementById("edit-profile").classList.add("hidden");
    document.getElementById("save-profile").classList.remove("hidden");
}

async function saveProfile() {
    const token = localStorage.getItem("restaurantToken");
    if (!token) {
        alert("Please log in first.");
        return;
    }

    // Create FormData object to handle images
    const formData = new FormData();
    
    // Add text fields
    formData.append("OwnerName", document.getElementById("OwnerName").value);
    formData.append("RestaurantName", document.getElementById("RestaurantName").value);
    formData.append("Email", document.getElementById("Email").value); // Make sure to include email
    formData.append("Phone", document.getElementById("Phone").value);
    formData.append("Address", document.getElementById("Address").value);
    formData.append("CuisineType", document.getElementById("CuisineType").value);
    formData.append("Description", document.getElementById("Description").value);
    
    // Get opening and closing times
    const openingTimes = getUpdatedTimes("Open");
    const closingTimes = getUpdatedTimes("Close");
    formData.append("OpeningTimes", JSON.stringify(openingTimes));
    formData.append("ClosingTimes", JSON.stringify(closingTimes));
    
    // Add images if selected
    const coverImg = document.getElementById("CoverIMG").files[0];
    if (coverImg) {
        formData.append("CoverIMG", coverImg);
    }
    
    const bannerImg = document.getElementById("BannerIMG").files[0];
    if (bannerImg) {
        formData.append("BannerIMG", bannerImg);
    }

    try {
        const response = await fetch(`${API_URL}/restaurants/profile/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            alert("Profile updated successfully!");
            loadProfilePage();
        } else {
            const error = await response.json();
            alert(`Failed to update profile: ${error.message || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. Check console for details.");
    }
}

// Get updated opening/closing times
function getUpdatedTimes(type) {
    let times = {};
    document.querySelectorAll(`[id$='${type}']`).forEach(input => {
        const day = input.id.replace(type, "");
        times[day] = input.value;
    });
    return times;
}

// Preview uploaded images
function previewImage(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewElement = document.getElementById(previewId);
            previewElement.style.backgroundImage = `url('${e.target.result}')`;
            previewElement.style.backgroundSize = 'cover';
            previewElement.style.backgroundPosition = 'center';
            // Clear any text content
            previewElement.innerHTML = '';
        };
        reader.readAsDataURL(file);
    }
}


function updateNavigation(isAuthenticated, ownerName = null) {
    const navButtons = document.getElementById('nav-buttons');
    if (!navButtons) {
        console.error("Navbar element not found!");
        return;
    }

    const isRestaurant = localStorage.getItem("isRestaurant") === "true";

    // Ensure ownerName is retrieved correctly if not passed
    if (!ownerName && isRestaurant) {
        ownerName = localStorage.getItem("ownerName") || "Restaurant Owner"; // ✅ Correctly retrieve owner name
    }

    console.log("isAuthenticated:", isAuthenticated);
    console.log("isRestaurant:", isRestaurant);
    console.log("ownerName:", ownerName);

    if (isAuthenticated) {
        if (isRestaurant) {
            // ✅ Restaurants should use `ownerName`
            navButtons.innerHTML = `
                <a href="#" onclick="loadContent('restaurant-dashboard')" class="text-gray-700 px-4 py-2 hover:text-black">Dashboard</a>
                <a href="#" onclick="loadContent('restaurant-menu')" class="text-gray-700 px-4 py-2 hover:text-black">Menu</a>
                <a href="#" onclick="loadContent('restaurant-orders')" class="text-gray-700 px-4 py-2 hover:text-black">Orders</a>
                <a href="#" onclick="loadContent('profile')" class="text-gray-700 px-4 py-2 hover:text-black">Profile</a> <!-- ✅ Added Profile Button -->
                <span id="user-greeting" class="user-greeting">Hello, <span id="user-name">${ownerName}</span></span>
                <a href="#" onclick="logout()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300">Logout</a>
            `;

            if (document.getElementById('dynamic-content').innerHTML === homeContentTemplate) {
                showRestaurantHome();
            }
        } else {
            // ✅ Customers should use `userName`
            const userName = localStorage.getItem("userName") || "User";
            navButtons.innerHTML = `
                <a href="#" onclick="loadContent('orders')" class="text-gray-700 px-4 py-2 hover:text-black">My Orders</a>
                <a href="#" onclick="loadContent('favorites')" class="text-gray-700 px-4 py-2 hover:text-black">Favorites</a>
                <span id="user-greeting" class="user-greeting">Hello, <span id="user-name">${userName}</span></span>
                <a href="#" onclick="logout()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300">Logout</a>
            `;
        }
    } else {
        // Guest navigation
        navButtons.innerHTML = `
            <a href="#" onclick="loadContent('login')" class="bg-gray-100 text-black px-4 py-2 rounded-full hover:bg-gray-200">Sign In</a>
            <a href="#" onclick="loadContent('register')" class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Sign Up</a>
        `;
    }
}

async function fetchUserData() {
    try {
        let response = await fetch(`${API_URL}/auth/home`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (response.ok) {
            let data = await response.json();
            document.getElementById("user-name").innerText = data.name || "User";
        } else {
            logout();
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

function loadContent(page) {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.classList.add('page-transition', 'fade-out');

    setTimeout(() => {
        // Show loading spinner
        dynamicContent.innerHTML = '<div class="flex justify-center items-center min-h-screen"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>';
        dynamicContent.classList.remove('fade-out');

        setTimeout(() => {
            let content = "";
            switch (page) {
                case 'login':
                    content = loginFormTemplate;
                    break;
                case 'register':
                    content = registerFormTemplate;
                    break;
                case 'about':
                    content = aboutTemplate;
                    break;
                case 'partner':
                    content = partnerTemplate;
                    break;
                case 'restaurant-signup':
                    dynamicContent.innerHTML = restaurantSignupTemplate;
                    
                    document.getElementById("next-step").addEventListener("click", function () {
                        document.getElementById("signup-step-1").classList.add("hidden");
                        document.getElementById("signup-step-2").classList.remove("hidden");
                    });

                    document.getElementById("back-step").addEventListener("click", function () {
                        document.getElementById("signup-step-1").classList.remove("hidden");
                        document.getElementById("signup-step-2").classList.add("hidden");
                    });

                    document.getElementById("submit-signup").addEventListener("click", registerRestaurant);
                    return;
                    
                case 'restaurant-login':
                    content = restaurantLoginTemplate;
                    break;
                case 'restaurant-dashboard':
                    content = restaurantDashboardTemplate;
                    break;
                case 'restaurant-menu':
                    content = restaurantMenuTemplate;
                    break;
                case 'restaurant-orders':
                    content = restaurantOrdersTemplate;
                    break;
                case 'profile':
                    content = loadProfilePage();
                    return;
                default:
                    content = homeContentTemplate;
            }

            dynamicContent.innerHTML = content;

            // Check authentication state and update navigation
            const token = localStorage.getItem("token") || localStorage.getItem("restaurantToken");
            updateNavigation(!!token);

            // Add event listeners for forms
            if (page === 'login') {
                document.getElementById('login-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    loginUser();
                });
            } else if (page === 'register') {
                document.getElementById('register-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    register();
                });
            } else if (page === 'partner') {
                document.getElementById('partner-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert("Thank you for your interest! We'll contact you soon.");
                    showHome();
                });
            } else if (page === 'restaurant-signup') {
                document.getElementById('restaurant-signup-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    registerRestaurant();
                });
            } else if (page === 'restaurant-login') {
                document.getElementById('restaurant-login-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    loginRestaurant();
                });
            }
        }, 300);
    }, 300);
}


function showHome() {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.classList.add('page-transition', 'fade-out');
    
    setTimeout(() => {
        const isRestaurant = localStorage.getItem("isRestaurant") === "true";
        if (isRestaurant) {
            dynamicContent.innerHTML = restaurantDashboardTemplate;
        } else {
            dynamicContent.innerHTML = homeContentTemplate;
        }
        dynamicContent.classList.remove('fade-out');
        
        // Save original content on first load if not already saved
        if (!originalHomeContent) {
            originalHomeContent = homeContentTemplate;
        }

        // Check authentication state and update navigation
        const token = localStorage.getItem("token") || localStorage.getItem("restaurantToken");
        updateNavigation(!!token);
    }, 300);
}

async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
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
            updateNavigation(true);
            showHome();
        } else {
            const errorData = await response.json(); 
            alert("Login failed: " + (errorData.message || response.statusText));
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Network error during login. Check the console for details.");
    }
}

async function register() {
    const form = document.getElementById("register-form");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = form.querySelector("input[type='text']").value;

    if (!name || !email || !password) {
        alert("Please fill out all required fields");
        return;
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
            loadContent('login');
        } else {
            const data = await response.json();
            alert("Registration failed: " + (data.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Network error during registration. Check the console for details.");
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("restaurantToken");
    localStorage.removeItem("restaurantName");
    localStorage.removeItem("isRestaurant");
    updateNavigation(false);
    showHome();
}

document.addEventListener("DOMContentLoaded", function () {
    loadRestaurantSignup();
});

function loadRestaurantSignup() {
    const content = document.getElementById("dynamic-content");
    content.innerHTML = generateSignupStep1();

    document.getElementById("next-step").addEventListener("click", function () {
        if (validateStep1()) {
            loadSignupStep2();
        }
    });
}

function generateSignupStep1() {
    return `
        <div class="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md">
            <h2 class="text-2xl font-bold mb-4">Restaurant Sign Up - Step 1</h2>
            
            <input type="text" id="ownerName" class="input-field" placeholder="Owner Name">
            <input type="text" id="restaurantName" class="input-field" placeholder="Restaurant Name">
            <input type="email" id="email" class="input-field" placeholder="Email">
            <input type="password" id="password" class="input-field" placeholder="Password">
            <input type="text" id="phone" class="input-field" placeholder="Phone">
            <input type="text" id="address" class="input-field" placeholder="Address">
            
            <select id="cuisineType" class="input-field">
                <option value="">Select Cuisine Type</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="Indian">Indian</option>
            </select>
            
            <textarea id="description" class="input-field" placeholder="Short Description"></textarea>

            <button id="next-step" class="submit-btn">Next</button>
        </div>
    `;
}

function validateStep1() {
    const fields = ["ownerName", "restaurantName", "email", "password", "phone", "address", "cuisineType", "description"];
    for (const field of fields) {
        if (document.getElementById(field).value.trim() === "") {
            alert("Please fill in all fields before proceeding.");
            return false;
        }
    }
    return true;
}

function loadSignupStep2() {
    const content = document.getElementById("dynamic-content");
    content.innerHTML = generateSignupStep2();

    document.getElementById("back-step").addEventListener("click", loadRestaurantSignup);
    document.getElementById("submit-signup").addEventListener("click", handleSignup);
}

function generateSignupStep2() {
    return `
        <div class="max-w-lg mx-auto bg-white p-6 shadow-md rounded-md">
            <h2 class="text-2xl font-bold mb-4">Step 2: Images & Operating Hours</h2>

            <h3 class="text-lg font-bold">Cover Image</h3>
            <div id="coverPreview" class="image-box" onclick="document.getElementById('coverImg').click()">
                <span>Click to Upload</span>
            </div>
            <input type="file" id="coverImg" class="hidden" accept="image/*" onchange="previewImage(event, 'coverPreview')">

            <h3 class="text-lg font-bold mt-4">Banner Image</h3>
            <div id="bannerPreview" class="image-box" onclick="document.getElementById('bannerImg').click()">
                <span>Click to Upload</span>
            </div>
            <input type="file" id="bannerImg" class="hidden" accept="image/*" onchange="previewImage(event, 'bannerPreview')">

            <h3 class="text-lg font-bold mt-4">Opening & Closing Times</h3>
            ${generateTimeFields()}

            <button id="back-step" class="back-btn">Back</button>
            <button id="submit-signup" class="submit-btn">Sign Up</button>
        </div>
    `;
}

function previewImage(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewBox = document.getElementById(previewId);
            previewBox.style.backgroundImage = `url('${e.target.result}')`;
            previewBox.style.backgroundSize = "cover";
            previewBox.style.backgroundPosition = "center";
            previewBox.innerHTML = ''; // Remove text once an image is selected
        };
        reader.readAsDataURL(file);
    }
}

function generateTimeFields() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    return days.map(day => `
        <div class="flex gap-4 items-center mb-2">
            <label class="w-24">${day}:</label>
            
            <input type="time" id="${day.toLowerCase()}Open" class="input-field w-full">
            <input type="time" id="${day.toLowerCase()}Close" class="input-field w-full">
        </div>
    `).join("");
}


function handleSignup() {
    // TODO: Implement form submission
    alert("Signup process completed! (Form submission logic pending)");
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
        return;
    }

    // Password Confirmation Check
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
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
            loadContent('restaurant-login');
        } else {
            alert('Registration failed: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error registering restaurant:', error);
        alert('Network error during registration. Please try again later.');
    }
}


async function loginRestaurant() {
    const email = document.getElementById("restaurant-email").value;
    const password = document.getElementById("restaurant-password").value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
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

            updateNavigation(true, data.ownerName);
            showHome();
        } else {
            alert("Login failed: " + (data.message || response.statusText));
        }
    } catch (error) {
        console.error("Error during restaurant login:", error);
        alert("Network error during login. Check the console for details.");
    }
}

// Add restaurant-specific templates
const restaurantDashboardTemplate = `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Restaurant Dashboard</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Today's Orders</h2>
                <div class="text-3xl font-bold text-green-600">0</div>
                <p class="text-gray-600">Active Orders</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Revenue</h2>
                <div class="text-3xl font-bold text-blue-600">$0.00</div>
                <p class="text-gray-600">Today's Revenue</p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Rating</h2>
                <div class="text-3xl font-bold text-yellow-600">⭐ 0.0</div>
                <p class="text-gray-600">Average Rating</p>
            </div>
        </div>
        
        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Recent Orders</h2>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-gray-500" colspan="5">No recent orders</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
`;

const restaurantMenuTemplate = `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Menu Management</h1>
            <button onclick="showAddItemForm()" class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Add New Item</button>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Sample menu item card -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="text-xl font-semibold mb-2">Add Your First Item</div>
                    <p class="text-gray-600 mb-4">Start building your menu by adding your first dish</p>
                    <button onclick="showAddItemForm()" class="text-green-500 hover:text-green-600">+ Add Item</button>
                </div>
            </div>
        </div>
    </div>
`;

const restaurantOrdersTemplate = `
    <div class="max-w-6xl mx-auto p-8 slide-up">
        <h1 class="text-3xl font-bold mb-6">Order Management</h1>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b">
                <div class="flex gap-4">
                    <button class="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600">New Orders</button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Preparing</button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Ready</button>
                    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300">Completed</button>
                </div>
            </div>
            
            <table class="min-w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-gray-500" colspan="6">No orders to display</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button id="create-order-btn" class="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">Create Order</button>
    </div>
`;

function showRestaurantHome() {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = restaurantDashboardTemplate;
}

async function createOrder(orderData) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to place an order.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Order created successfully! Order ID: ${data.orderId}`);
        } else {
            const errorData = await response.json();
            alert(`Order creation failed: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error("Error creating order:", error);
        alert("Network error during order creation. Check the console for details.");
    }
}

function selectRestaurant(restaurantId, restaurantName) {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to place an order.");
        loadContent('login');
        return;
    }

    // Show a simple order form
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.classList.add('page-transition', 'fade-out');
    
    setTimeout(() => {
        const orderFormTemplate = `
            <div class="max-w-6xl mx-auto p-8 slide-up">
                <h1 class="text-3xl font-bold mb-6">Place Order - ${restaurantName}</h1>
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold mb-4">Menu Items</h2>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 border rounded">
                            <div>
                                <h3 class="font-medium">Signature Dish 1</h3>
                                <p class="text-gray-600">$10.00</p>
                            </div>
                            <button class="add-to-order px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600" 
                                data-item-name="Signature Dish 1" 
                                data-item-price="10.00">
                                Add to Order
                            </button>
                        </div>
                        <div class="flex items-center justify-between p-4 border rounded">
                            <div>
                                <h3 class="font-medium">Signature Dish 2</h3>
                                <p class="text-gray-600">$15.00</p>
                            </div>
                            <button class="add-to-order px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600" 
                                data-item-name="Signature Dish 2" 
                                data-item-price="15.00">
                                Add to Order
                            </button>
                        </div>
                    </div>
                    
                    <div class="mt-8">
                        <h2 class="text-xl font-semibold mb-4">Your Order</h2>
                        <div id="order-items" class="space-y-2 mb-4">
                            <p class="text-gray-600">No items added yet</p>
                        </div>
                        
                        <div class="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span id="order-total">$0.00</span>
                        </div>
                        
                        <button id="place-order-btn" class="w-full px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        dynamicContent.innerHTML = orderFormTemplate;
        dynamicContent.classList.remove('fade-out');
        
        // Set up event listeners for the order form
        const orderItems = [];
        
        // Add to order buttons
        document.querySelectorAll('.add-to-order').forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.getAttribute('data-item-name');
                const itemPrice = parseFloat(button.getAttribute('data-item-price'));
                
                // Add item to order
                const existingItem = orderItems.find(item => item.ItemName === itemName);
                if (existingItem) {
                    existingItem.Quantity += 1;
                } else {
                    orderItems.push({
                        ItemName: itemName,
                        Quantity: 1,
                        UnitPrice: itemPrice
                    });
                }
                
                // Update order display
                updateOrderDisplay(orderItems);
            });
        });
        
        // Place order button
        document.getElementById('place-order-btn').addEventListener('click', () => {
            if (orderItems.length === 0) {
                alert("Please add at least one item to your order.");
                return;
            }
            
            const orderData = {
                RestaurantId: restaurantId,
                orderItems: orderItems
            };
            
            createOrder(orderData);
        });
    }, 300);
}

function updateOrderDisplay(orderItems) {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.getElementById('order-total');
    
    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-gray-600">No items added yet</p>';
        orderTotalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    let html = '';
    
    orderItems.forEach(item => {
        const itemTotal = item.Quantity * item.UnitPrice;
        total += itemTotal;
        
        html += `
            <div class="flex justify-between items-center">
                <span>${item.Quantity}x ${item.ItemName}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = html;
    orderTotalElement.textContent = `$${total.toFixed(2)}`;
}