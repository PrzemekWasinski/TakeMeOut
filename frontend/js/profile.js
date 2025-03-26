import API_URL from './config.js';
import { previewImage } from './navigation.js';

function loadProfilePage() {
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

    // Split address into separate fields
    const [door = "", road = "", city = "", postcode = ""] = (data.address || "").split(',').map(p => p.trim());
    document.getElementById("Door").value = door;
    document.getElementById("Road").value = road;
    document.getElementById("City").value = city;
    document.getElementById("Postcode").value = postcode;

    document.getElementById("CuisineType").value = data.cuisineType || "N/A";
    document.getElementById("Description").value = data.description || "N/A";

    // Times
    const openingTimes = typeof data.openingTimes === "string" ? JSON.parse(data.openingTimes) : data.openingTimes;
    const closingTimes = typeof data.closingTimes === "string" ? JSON.parse(data.closingTimes) : data.closingTimes;
    populateOperatingHours(openingTimes, closingTimes);

    // Image previews
    if (data.coverIMG) {
        document.getElementById("coverPreview").style.backgroundImage = `url('${API_URL}${data.coverIMG}')`;
        document.getElementById("coverPreview").style.backgroundSize = 'cover';
    }
    if (data.bannerIMG) {
        document.getElementById("bannerPreview").style.backgroundImage = `url('${API_URL}${data.bannerIMG}')`;
        document.getElementById("bannerPreview").style.backgroundSize = 'cover';
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

    const formData = new FormData();

    // Text fields
    formData.append("OwnerName", document.getElementById("OwnerName").value);
    formData.append("RestaurantName", document.getElementById("RestaurantName").value);
    formData.append("Email", document.getElementById("Email").value);
    formData.append("Phone", document.getElementById("Phone").value);
    formData.append("CuisineType", document.getElementById("CuisineType").value);
    formData.append("Description", document.getElementById("Description").value);

    // Rebuild full address
    const door = document.getElementById("Door").value.trim();
    const road = document.getElementById("Road").value.trim();
    const city = document.getElementById("City").value.trim();
    const postcode = document.getElementById("Postcode").value.trim();
    const address = [door, road, city, postcode].filter(Boolean).join(", ");
    formData.append("Address", address);

    // Opening/Closing times
    const openingTimes = getUpdatedTimes("Open");
    const closingTimes = getUpdatedTimes("Close");
    formData.append("OpeningTimes", JSON.stringify(openingTimes));
    formData.append("ClosingTimes", JSON.stringify(closingTimes));

    // Optional image uploads
    const coverImg = document.getElementById("CoverIMG").files[0];
    if (coverImg) formData.append("CoverIMG", coverImg);

    const bannerImg = document.getElementById("BannerIMG").files[0];
    if (bannerImg) formData.append("BannerIMG", bannerImg);

    try {
        const response = await fetch(`${API_URL}/restaurants/profile/update`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert("Profile updated successfully!");
            loadProfilePage();
        } else {
            alert(`Failed to update profile: ${result.message || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile. See console for details.");
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

export { loadProfilePage }; 