import API_URL from './config.js';
import { previewImage, loadContent } from './navigation.js';
import { logout } from './auth.js';

//Function to check and load either user or restaurant profile pae
function loadProfilePage() {
    const isRestaurant = localStorage.getItem("isRestaurant") === "true";
    
    if (isRestaurant) {
        loadRestaurantProfilePage();
    } else {
        loadCustomerProfilePage();
    }
}

//Function to load user profile page
function loadCustomerProfilePage() {
    //Profile page HTML
    document.getElementById("dynamic-content").innerHTML = `
        <div class="max-w-2xl mx-auto px-8 pt-20 pb-16 slide-up">
            <div class="bg-white shadow-md rounded-lg p-8">
                <h1 class="text-2xl font-bold mb-6">My Profile</h1>
                
                <form id="customer-profile-form" class="space-y-6">
                    <!-- Personal Information Section -->
                    <div>
                        <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" id="customerName" class="input-field customer-editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" id="customerEmail" class="input-field customer-editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input type="password" id="customerPassword" class="input-field customer-editable" placeholder="Leave blank to keep current password" readonly>
                            </div>
                        </div>
                    </div>

                    <!-- Addresses Section -->
                    <div>
                        <h2 class="text-lg font-semibold mb-4">Delivery Addresses</h2>
                        <div id="addresses-container" class="space-y-4">
                            <!-- Addresses will be dynamically added here -->
                        </div>
                        <button type="button" id="add-address" class="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 hidden">
                            + Add New Address
                        </button>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" id="edit-customer-profile" class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Edit Profile
                        </button>
                        <button type="button" id="save-customer-profile" class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hidden">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    loadCustomerProfile();
    setupCustomerProfileHandlers();
}

//Funciton to load restaurant profile page
function loadRestaurantProfilePage() {
    //Profile page HTML
    document.getElementById("dynamic-content").innerHTML = `
        <div class="max-w-screen-xl mx-auto px-16 pt-40 pb-16 slide-up bg-white shadow-md rounded-md">
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

                            <!-- Split Address Fields -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Door Number</label>
                                <input type="text" id="Door" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Road</label>
                                <input type="text" id="Road" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" id="City" class="input-field editable" readonly>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Postcode</label>
                                <input type="text" id="Postcode" class="input-field editable" readonly>
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

//Function to retrieve user profile details
async function loadCustomerProfile() {
    //Check if  auser is loggedin
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first.");
        loadContent('login');
        return;
    }
    //Fetch user's profile information
    try {
        console.log("Attempting to fetch profile with token:", token);
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        console.log("Profile response status:", response.status);
        const responseText = await response.text();
        console.log("Raw response:", responseText);
        //If profile information culdnt be retrieved
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert("Session expired. Please log in again.");
                logout();
                return;
            }
            throw new Error(`Failed to load profile. Status: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        console.log("Parsed profile data:", data);
        //Display the profile information
        populateCustomerProfile(data);
    //Catch errors
    } catch (error) {
        console.error("Error loading customer profile:", error);
        alert("Failed to load profile information. Please try logging in again.");
        logout();
    }
}
//Function to display user profile information
function populateCustomerProfile(data) {
    console.log("Populating profile with data:", data);
    
    //Get user details
    document.getElementById("customerName").value = data.name || "";
    document.getElementById("customerEmail").value = data.email || "";
    
    //Retrieve and clear old address
    const addressesContainer = document.getElementById("addresses-container");
    addressesContainer.innerHTML = "";
    //If address exists seperate the details
    if (data.address) {
        const addressParts = data.address.split(',').map(part => part.trim());
        let address = {
            door: "",
            road: "",
            city: "",
            postcode: ""
        };

        //Get door num and road
        if (addressParts[0]) {
            const firstPart = addressParts[0];
            const match = firstPart.match(/^(\d+)\s+(.+)$/);
            if (match) {
                address.door = match[1];
                address.road = match[2];
            } else {
                address.road = firstPart;
            }
        }

        //Get city
        if (addressParts[1]) {
            address.city = addressParts[1];
        }

        //Get postcode
        if (addressParts[2]) {
            address.postcode = addressParts[2];
        }

        addressesContainer.innerHTML = createAddressHTML(address, 0);
    //If no addresses could be found
    } else {
        addressesContainer.innerHTML = `
            <div class="text-gray-500 text-center py-4">
                No addresses added yet
            </div>
        `;
    }
}
//Function to display 4 most recent addresses on a popup
function createAddressHTML(address, index) {
    return `
        <div class="address-entry bg-gray-50 p-4 rounded-md">
            <div class="flex justify-between items-start mb-2">
                <label class="block text-sm font-medium text-gray-700">Address ${index + 1}</label>
                <button type="button" class="text-red-500 hover:text-red-700 hidden delete-address" data-index="${index}">
                    Remove
                </button>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Door Number</label>
                    <input type="text" class="input-field customer-editable w-full" 
                        value="${address.door || ''}" data-field="door" data-index="${index}" readonly>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Road</label>
                    <input type="text" class="input-field customer-editable w-full" 
                        value="${address.road || ''}" data-field="road" data-index="${index}" readonly>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" class="input-field customer-editable w-full" 
                        value="${address.city || ''}" data-field="city" data-index="${index}" readonly>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                    <input type="text" class="input-field customer-editable w-full" 
                        value="${address.postcode || ''}" data-field="postcode" data-index="${index}" readonly>
                </div>
            </div>
        </div>
    `;
}

//Function to handle buttons on user profile page
function setupCustomerProfileHandlers() {
    //Buttons
    const editButton = document.getElementById("edit-customer-profile");
    const saveButton = document.getElementById("save-customer-profile");
    const addAddressButton = document.getElementById("add-address");
    //Event listeneers for profile buttons
    editButton.addEventListener("click", () => {
        document.querySelectorAll(".customer-editable").forEach(input => input.removeAttribute("readonly"));
        document.querySelectorAll(".delete-address").forEach(btn => btn.classList.remove("hidden"));
        addAddressButton.classList.remove("hidden");
        editButton.classList.add("hidden");
        saveButton.classList.remove("hidden");
    });

    addAddressButton.addEventListener("click", () => {
        const addressesContainer = document.getElementById("addresses-container");
        const newIndex = addressesContainer.children.length;
        const emptyAddress = { door: "", road: "", city: "", postcode: "" };
        addressesContainer.innerHTML += createAddressHTML(emptyAddress, newIndex);
    });

    document.getElementById("addresses-container").addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-address")) {
            e.target.closest(".address-entry").remove();
        }
    });

    saveButton.addEventListener("click", saveCustomerProfile);
}
//Function to save user's profile
async function saveCustomerProfile() {
    //Check if a user is logge din
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first.");
        return;
    }

    //Get user address
    const addressDiv = document.querySelector(".address-entry");
    const address = addressDiv ? [
        addressDiv.querySelector('[data-field="door"]').value,
        addressDiv.querySelector('[data-field="road"]').value,
        addressDiv.querySelector('[data-field="city"]').value,
        addressDiv.querySelector('[data-field="postcode"]').value
    ].filter(Boolean).join(", ") : "";
    //Get name
    const [firstName, ...lastNameParts] = document.getElementById("customerName").value.split(" ");
    const lastName = lastNameParts.join(" ");
    //Put user info in JSON format
    const formData = {
        firstName: firstName,
        lastName: lastName || " ", 
        email: document.getElementById("customerEmail").value,
        password: document.getElementById("customerPassword").value,
        address: address
    };

    //Remove password if not changed
    if (!formData.password) {
        delete formData.password;
    }
    //Send new data to server
    try {
        const response = await fetch(`${API_URL}/auth/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update profile. Status: ${response.status}`);
        }

        //Update UI
        document.querySelectorAll(".customer-editable").forEach(input => input.setAttribute("readonly", true));
        document.querySelectorAll(".delete-address").forEach(btn => btn.classList.add("hidden"));
        document.getElementById("add-address").classList.add("hidden");
        document.getElementById("save-customer-profile").classList.add("hidden");
        document.getElementById("edit-customer-profile").classList.remove("hidden");
        document.getElementById("customerPassword").value = ""; // Clear password field

        alert("Profile updated successfully!");
    //Catch errors
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile changes.");
    }
}

//Function to fetch and populate restaurant profile 
async function loadRestaurantProfile() {
    //If restaurant isn't logged in
    const token = localStorage.getItem("restaurantToken");
    if (!token) {
        alert("Please log in first.");
        loadContent('restaurant-login');
        return;
    }
    //Fetch restaurant profile info
    try {
        console.log("Fetching restaurant profile from API");

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

            console.log(`Failed to load profile data. Status: ${response.status}`);
            return;
        }

        const data = JSON.parse(responseText);
        console.log("Parsed Profile Data:", data);
        //Show restaurant info on profile
        populateProfileFields(data);
    //Catch errors
    } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Network error occurred while loading profile.");
    }
}
//Function to fill in information on profile page
function populateProfileFields(data) {
    document.getElementById("OwnerName").value = data.ownerName || "N/A";
    document.getElementById("RestaurantName").value = data.restaurantName || "N/A";
    document.getElementById("Email").value = data.email || "N/A";
    document.getElementById("Phone").value = data.phone || "N/A";

    //Split address data
    const [door = "", road = "", city = "", postcode = ""] = (data.address || "").split(',').map(p => p.trim());
    document.getElementById("Door").value = door;
    document.getElementById("Road").value = road;
    document.getElementById("City").value = city;
    document.getElementById("Postcode").value = postcode;

    document.getElementById("CuisineType").value = data.cuisineType || "N/A";
    document.getElementById("Description").value = data.description || "N/A";

    //Times
    const openingTimes = typeof data.openingTimes === "string" ? JSON.parse(data.openingTimes) : data.openingTimes;
    const closingTimes = typeof data.closingTimes === "string" ? JSON.parse(data.closingTimes) : data.closingTimes;
    populateOperatingHours(openingTimes, closingTimes);

    //Image previews
    const coverPreview = document.getElementById("coverPreview");
    const bannerPreview = document.getElementById("bannerPreview");
    
    //Reset preview containers
    coverPreview.style.backgroundImage = '';
    coverPreview.innerHTML = '<span class="text-gray-600 text-center">Upload</span>';
    bannerPreview.style.backgroundImage = '';
    bannerPreview.innerHTML = '<span class="text-gray-600 text-center">Upload</span>';

    if (data.coverIMG) {
        const coverUrl = data.coverIMG.startsWith('http') ? data.coverIMG : 
                        data.coverIMG.startsWith('/') ? `${API_URL}${data.coverIMG}` : 
                        `${API_URL}/uploads/${data.coverIMG}`;
        coverPreview.style.backgroundImage = `url('${coverUrl}')`;
        coverPreview.style.backgroundSize = 'cover';
        coverPreview.style.backgroundPosition = 'center';
        coverPreview.innerHTML = '';
    }

    if (data.bannerIMG) {
        const bannerUrl = data.bannerIMG.startsWith('http') ? data.bannerIMG : 
                         data.bannerIMG.startsWith('/') ? `${API_URL}${data.bannerIMG}` : 
                         `${API_URL}/uploads/${data.bannerIMG}`;
        bannerPreview.style.backgroundImage = `url('${bannerUrl}')`;
        bannerPreview.style.backgroundSize = 'cover';
        bannerPreview.style.backgroundPosition = 'center';
        bannerPreview.innerHTML = '';
    }
    
    //Remove existing event listeners before adding new ones
    const editButton = document.getElementById("edit-profile");
    const saveButton = document.getElementById("save-profile");
    
    editButton.replaceWith(editButton.cloneNode(true));
    saveButton.replaceWith(saveButton.cloneNode(true));
    
    //Add event listeners to the new buttons
    document.getElementById("edit-profile").addEventListener("click", enableProfileEditing);
    document.getElementById("save-profile").addEventListener("click", saveProfile);
}

//Function to populate opening an dclosing time fields
function populateOperatingHours(openingTimes, closingTimes) {
    let html = "";
    
    if (!openingTimes || !closingTimes) {
        console.error("Opening or Closing Times are missing:", openingTimes, closingTimes);
        //Add default days of week if times are missing
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
    //For each day display the opening and closing times
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

//Funciton to enable profile editing
function enableProfileEditing() {
    //Enable all editable fields
    document.querySelectorAll(".editable").forEach(input => input.removeAttribute("readonly"));
    
    //Enable file inputs
    document.getElementById("CoverIMG").disabled = false;
    document.getElementById("BannerIMG").disabled = false;
    
    //Show/hide appropriate buttons
    document.getElementById("edit-profile").classList.add("hidden");
    document.getElementById("save-profile").classList.remove("hidden");
}

//Function to save changes to profile
async function saveProfile() {
    //Check if a restaurant i slogged in
    const token = localStorage.getItem("restaurantToken");
    if (!token) {
        alert("Please log in first.");
        return;
    }
    //Retrieve all data from all fields
    try {
        const formData = new FormData();

        //Text fields
        formData.append("OwnerName", document.getElementById("OwnerName").value);
        formData.append("RestaurantName", document.getElementById("RestaurantName").value);
        formData.append("Email", document.getElementById("Email").value);
        formData.append("Phone", document.getElementById("Phone").value);
        formData.append("CuisineType", document.getElementById("CuisineType").value);
        formData.append("Description", document.getElementById("Description").value);

        //Rebuild full address
        const door = document.getElementById("Door").value.trim();
        const road = document.getElementById("Road").value.trim();
        const city = document.getElementById("City").value.trim();
        const postcode = document.getElementById("Postcode").value.trim();
        const address = [door, road, city, postcode].filter(Boolean).join(", ");
        formData.append("Address", address);

        //Opening and closing times
        const openingTimes = getUpdatedTimes("Open");
        const closingTimes = getUpdatedTimes("Close");
        formData.append("OpeningTimes", JSON.stringify(openingTimes));
        formData.append("ClosingTimes", JSON.stringify(closingTimes));

        //Image uploads 
        const coverImg = document.getElementById("CoverIMG").files[0];
        const bannerImg = document.getElementById("BannerIMG").files[0];
        
        if (coverImg) {
            console.log("Appending cover image:", coverImg);
            formData.append("CoverIMG", coverImg, coverImg.name);
        }
        
        if (bannerImg) {
            console.log("Appending banner image:", bannerImg);
            formData.append("BannerIMG", bannerImg, bannerImg.name);
        }

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        //Send new profile details to server
        const response = await fetch(`${API_URL}/restaurants/profile/update`, {
            method: "PUT",
            headers: { 
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || "Failed to update profile");
        }

        //Disable editing and reset UIafter sending new data to server
        document.querySelectorAll(".editable").forEach(input => input.setAttribute("readonly", true));
        document.getElementById("CoverIMG").disabled = true;
        document.getElementById("BannerIMG").disabled = true;
        document.getElementById("save-profile").classList.add("hidden");
        document.getElementById("edit-profile").classList.remove("hidden");

        //Clear file inputs
        document.getElementById("CoverIMG").value = '';
        document.getElementById("BannerIMG").value = '';

        //Reload the profile data
        await loadRestaurantProfile();
        
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert(error.message || "Error updating profile. Please try again.");
    }
}

//Get updated opening and closing times
function getUpdatedTimes(type) {
    let times = {};
    document.querySelectorAll(`[id$='${type}']`).forEach(input => {
        const day = input.id.replace(type, "");
        times[day] = input.value;
    });
    return times;
}
//Make "loadProfilePage" function available in other js files
export { loadProfilePage }; 