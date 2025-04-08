import API_URL from './config.js';
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
    restaurantOrdersTemplate,
    allRestaurantsTemplate,
    favouritesTemplate
} from './templates.js';
import { loginUser, register, loginRestaurant, registerRestaurant, logout } from './auth.js';
import { loadProfilePage } from './profile.js';
import { loadMenuManagement } from './menu.js';
import { fetchAllRestaurants, displayRestaurants, setupSearchHandlers } from './restaurants.js';
import { loadFavourites } from './favourites.js';
import { customerMenuTemplate } from './templates.js';
import { loadUserOrders, updateOrderDisplay, createOrder, loadRestaurantOrders, loadRestaurantDashboard } from './orders.js';
import { loadSettingsPage } from './settings.js';


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
            // Set navigation HTML for restaurant
            navButtons.innerHTML = `
                <a href="#" onclick="window.loadContent('restaurant-dashboard')" class="text-gray-700 px-4 py-2 hover:text-black">Dashboard</a>
                <a href="#" onclick="window.loadContent('restaurant-menu')" class="text-gray-700 px-4 py-2 hover:text-black">Menu</a>
                <a href="#" id="restaurant-orders-tab" class="text-gray-700 px-4 py-2 hover:text-black">Orders</a>
                <div class="dropdown">
                    <span id="user-greeting" class="user-greeting">Hello, <span id="user-name">${ownerName}</span></span>
                    <div class="dropdown-content">
                        <a href="#" onclick="window.loadContent('profile')">Profile</a>
                        <a href="#" onclick="window.loadContent('settings')">Settings</a>
                        <a href="#" onclick="window.handleLogout()">Logout</a>
                    </div>
                </div>
            `;
        
            // Attach event listener to load orders when Orders tab is clicked
            document.getElementById("restaurant-orders-tab").addEventListener("click", () => {
                loadRestaurantOrders();
            });
        
        } else {
            // Customers should use `userName`
            const userName = localStorage.getItem("userName") || "User";
            navButtons.innerHTML = `
                <a href="#" onclick="window.loadContent('my-orders')" class="text-gray-700 px-4 py-2 hover:text-black">My Orders</a>
                <a href="#" onclick="window.loadContent('favourites')" class="text-gray-700 px-4 py-2 hover:text-black">Favourites</a>
                <div class="dropdown">
                    <span id="user-greeting" class="user-greeting">Hello, <span id="user-name">${userName}</span></span>
                    <div class="dropdown-content">
                        <a href="#" onclick="window.loadContent('profile')">Profile</a>
                        <a href="#" onclick="window.loadContent('settings')">Settings</a>
                        <a href="#" onclick="window.handleLogout()">Logout</a>
                    </div>
                </div>
            `;
        }

        // Add dropdown toggle functionality
        const userGreeting = document.getElementById('user-greeting');
        const dropdown = document.querySelector('.dropdown');
        
        if (userGreeting && dropdown) {
            userGreeting.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
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
                case 'my-orders':
                    loadUserOrders();
                    return;                    
                case 'favourites':
                    content = favouritesTemplate;
                    // Load favourites after setting the template
                    setTimeout(() => {
                        loadFavourites();
                    }, 100);
                    break;
                case 'restaurant-signup':
                    dynamicContent.innerHTML = restaurantSignupTemplate;
                    
                    // Populate time fields
                    document.getElementById("time-fields-container").innerHTML = generateTimeFields();
                
                    // Step 1 → Step 2
                    document.getElementById("next-step").addEventListener("click", function (e) {
                        e.preventDefault();
                        document.getElementById("signup-step-1").classList.add("hidden");
                        document.getElementById("signup-step-2").classList.remove("hidden");
                    });
                
                    // Step 2 → Step 3
                    document.getElementById("next-to-step-3").addEventListener("click", function (e) {
                        e.preventDefault();
                        document.getElementById("signup-step-2").classList.add("hidden");
                        document.getElementById("signup-step-3").classList.remove("hidden");
                    });
                
                    // Step 2 ← Step 1
                    document.getElementById("back-to-step-1").addEventListener("click", function (e) {
                        e.preventDefault();
                        document.getElementById("signup-step-2").classList.add("hidden");
                        document.getElementById("signup-step-1").classList.remove("hidden");
                    });
                
                    // Step 3 ← Step 2
                    document.getElementById("back-to-step-2").addEventListener("click", function (e) {
                        e.preventDefault();
                        document.getElementById("signup-step-3").classList.add("hidden");
                        document.getElementById("signup-step-2").classList.remove("hidden");
                    });
                
                    // Final submit
                    document.getElementById("submit-signup").addEventListener("click", async function () {
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
                    loadRestaurantDashboard();
                    break;
                case 'restaurant-menu':
                    loadMenuManagement();
                    return;                    
                case 'restaurant-orders':
                    content = restaurantOrdersTemplate;
                    break;
                case 'profile':
                    content = loadProfilePage();
                    return;
                case 'all-restaurants':
                    content = allRestaurantsTemplate;
                    // After setting content, add this to load restaurants
                    setTimeout(async () => {
                        const restaurants = await fetchAllRestaurants();
                        displayRestaurants(restaurants);
                    }, 100);
                    break;
                case 'settings':
                    loadSettingsPage();
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
            loadRestaurantDashboard();
        } else {
            dynamicContent.innerHTML = homeContentTemplate;

            // Initialize search functionality
            setupSearchHandlers();
            fetchAllRestaurants().then(displayRestaurants);
        }

        dynamicContent.classList.remove('fade-out');

        if (!originalHomeContent) {
            originalHomeContent = homeContentTemplate;
        }

        const token = localStorage.getItem("token") || localStorage.getItem("restaurantToken");
        updateNavigation(!!token);

        if (!isRestaurant) {
            setTimeout(() => {
                const findFoodBtn = document.querySelector('button.bg-green-500');
                findFoodBtn?.addEventListener('click', () => loadContent('all-restaurants'));
            }, 100);
        }
    }, 300);
}


// Preview uploaded images
function previewImage(event, previewId) {
    const file = event.target.files[0];
    const previewElement = document.getElementById(previewId);
    
    // Reset the preview first
    previewElement.style.backgroundImage = '';
    previewElement.innerHTML = '<span class="text-gray-600 text-center">Upload</span>';
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            event.target.value = ''; // Clear the file input
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.style.backgroundImage = `url('${e.target.result}')`;
            previewElement.style.backgroundSize = 'cover';
            previewElement.style.backgroundPosition = 'center';
            previewElement.innerHTML = ''; // Clear any text content
        };
        reader.onerror = function(e) {
            console.error('Error reading file:', e);
            alert('Error reading file. Please try again.');
            event.target.value = ''; // Clear the file input
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
    previewImage,
    handleLogout,
}; 