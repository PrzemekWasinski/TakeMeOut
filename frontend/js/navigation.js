import { 
    generateTimeFields, 
    homeContentTemplate, 
    loginFormTemplate, 
    registerFormTemplate, 
    aboutTemplate, 
    partnerTemplate, 
    restaurantSignupTemplate, 
    restaurantLoginTemplate, 
    restaurantDashboardTemplate, 
    restaurantMenuTemplate, 
    restaurantOrdersTemplate 
} from './templates.js';
import { loginUser, register, loginRestaurant, registerRestaurant, logout } from './auth.js';
import { loadProfilePage } from './profile.js';

// Original home content storage
let originalHomeContent;

function updateNavigation(isAuthenticated, ownerName = null) {
    const navButtons = document.getElementById('nav-buttons');
    if (!navButtons) {
        console.error("Navbar element not found!");
        return;
    }

    const isRestaurant = localStorage.getItem("isRestaurant") === "true";

    // Ensure ownerName is retrieved correctly if not passed
    if (!ownerName && isRestaurant) {
        ownerName = localStorage.getItem("ownerName") || "Restaurant Owner";
    }

    console.log("isAuthenticated:", isAuthenticated);
    console.log("isRestaurant:", isRestaurant);
    console.log("ownerName:", ownerName);

    if (isAuthenticated) {
        if (isRestaurant) {
            // Restaurants should use `ownerName`
            navButtons.innerHTML = `
                <a href="#" onclick="window.loadContent('restaurant-dashboard')" class="text-gray-700 px-4 py-2 hover:text-black">Dashboard</a>
                <a href="#" onclick="window.loadContent('restaurant-menu')" class="text-gray-700 px-4 py-2 hover:text-black">Menu</a>
                <a href="#" onclick="window.loadContent('restaurant-orders')" class="text-gray-700 px-4 py-2 hover:text-black">Orders</a>
                <a href="#" onclick="window.loadContent('profile')" class="text-gray-700 px-4 py-2 hover:text-black">Profile</a>
                <span id="user-greeting" class="user-greeting">Hello, <span id="user-name">${ownerName}</span></span>
                <a href="#" onclick="window.handleLogout()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300">Logout</a>
            `;

            if (document.getElementById('dynamic-content').innerHTML === homeContentTemplate) {
                showRestaurantHome();
            }
        } else {
            // Customers should use `userName`
            const userName = localStorage.getItem("userName") || "User";
            navButtons.innerHTML = `
                <a href="#" onclick="window.loadContent('orders')" class="text-gray-700 px-4 py-2 hover:text-black">My Orders</a>
                <a href="#" onclick="window.loadContent('favorites')" class="text-gray-700 px-4 py-2 hover:text-black">Favorites</a>
                <span id="user-greeting" class="user-greeting">Hello, <span id="user-name">${userName}</span></span>
                <a href="#" onclick="window.handleLogout()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300">Logout</a>
            `;
        }
    } else {
        // Guest navigation
        navButtons.innerHTML = `
            <a href="#" onclick="window.loadContent('login')" class="bg-gray-100 text-black px-4 py-2 rounded-full hover:bg-gray-200">Sign In</a>
            <a href="#" onclick="window.loadContent('register')" class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Sign Up</a>
        `;
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
                    
                    // Populate time fields
                    document.getElementById("time-fields-container").innerHTML = generateTimeFields();
                    
                    document.getElementById("next-step").addEventListener("click", function () {
                        document.getElementById("signup-step-1").classList.add("hidden");
                        document.getElementById("signup-step-2").classList.remove("hidden");
                    });

                    document.getElementById("back-step").addEventListener("click", function () {
                        document.getElementById("signup-step-1").classList.remove("hidden");
                        document.getElementById("signup-step-2").classList.add("hidden");
                    });

                    document.getElementById("submit-signup").addEventListener("click", async function() {
                        const result = await registerRestaurant();
                        if (result.success && result.navigateTo) {
                            loadContent(result.navigateTo);
                        }
                    });
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
                document.getElementById('login-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const result = await loginUser();
                    if (result.success) {
                        updateNavigation(true);
                        showHome();
                    }
                });
            } else if (page === 'register') {
                document.getElementById('register-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const result = await register();
                    if (result.success && result.navigateTo) {
                        loadContent(result.navigateTo);
                    }
                });
            } else if (page === 'partner') {
                document.getElementById('partner-form').addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert("Thank you for your interest! We'll contact you soon.");
                    showHome();
                });
            } else if (page === 'restaurant-login') {
                document.getElementById('restaurant-login-form').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const result = await loginRestaurant();
                    if (result.success) {
                        updateNavigation(true, result.ownerName);
                        showHome();
                    }
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

function showRestaurantHome() {
    const dynamicContent = document.getElementById('dynamic-content');
    dynamicContent.innerHTML = restaurantDashboardTemplate;
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

// Handle logout action
async function handleLogout() {
    const result = await logout();
    if (result.success) {
        updateNavigation(false);
        showHome();
    }
}

export {
    updateNavigation,
    loadContent,
    showHome,
    showRestaurantHome,
    previewImage,
    handleLogout
}; 