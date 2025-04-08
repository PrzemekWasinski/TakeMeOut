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
    favouritesTemplate,
    customerMenuTemplate
} from './templates.js';
import { loginUser, register, loginRestaurant, registerRestaurant, logout } from './auth.js';
import { loadProfilePage } from './profile.js';
import { loadMenuManagement } from './menu.js';
import { fetchAllRestaurants, displayRestaurants, setupSearchHandlers } from './restaurants.js';
import { loadFavourites } from './favourites.js';
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

async function feelingLucky() {
    try {
        const restaurants = await fetchAllRestaurants();
        console.log('Fetched restaurants:', restaurants);
        
        if (!restaurants || restaurants.length === 0) {
            alert("No restaurants available at the moment.");
            return;
        }

        // Get a random restaurant
        const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
        console.log('Selected random restaurant:', randomRestaurant);
        
        // Get the auth token
        const token = localStorage.getItem('token');
        
        // Fetch the restaurant's menu using the correct endpoint
        const menuUrl = `${API_URL.replace(/\/api$/, '')}/api/menu/by-id/${randomRestaurant.id}`;
        console.log('Fetching menu from:', menuUrl);
        const response = await fetch(menuUrl, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Menu fetch failed:', response.status, errorText);
            
            // If unauthorized and user is not logged in, try fetching without auth
            if (response.status === 401 && !token) {
                console.log('Attempting to fetch menu without authentication...');
                const publicResponse = await fetch(menuUrl, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!publicResponse.ok) {
                    throw new Error('Failed to fetch menu');
                }
                const menuData = await publicResponse.json();
                console.log('Fetched menu data:', menuData);
                return processMenuData(menuData, randomRestaurant);
            }
            
            throw new Error('Failed to fetch menu');
        }
        
        const menuData = await response.json();
        console.log('Fetched menu data:', menuData);
        return processMenuData(menuData, randomRestaurant);
        
    } catch (error) {
        console.error('Error in feelingLucky:', error);
        alert("Something went wrong. Please try again later.");
    }
}

// Helper function to process menu data and show modal
function processMenuData(menuData, randomRestaurant) {
    // Get all available items from all categories
    const allItems = menuData.flatMap(category => 
        category.items.filter(item => item.isAvailable)
    );
    console.log('Available items:', allItems);
    
    if (allItems.length === 0) {
        alert("No available items found in the selected restaurant.");
        return;
    }

    // Get a random item
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    console.log('Selected random item:', randomItem);
    
    // Show the result in a modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 class="text-2xl font-bold mb-4">Your Lucky Pick!</h2>
            <div class="mb-4">
                <p class="text-lg font-semibold">${randomItem.name}</p>
                <p class="text-gray-600">from ${randomRestaurant.restaurantName}</p>
                <p class="text-gray-600">£${randomItem.price.toFixed(2)}</p>
                <p class="text-sm text-gray-500 mt-2">${randomItem.description}</p>
            </div>
            <div class="flex justify-end gap-4">
                <button class="no-thanks-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    No Thanks
                </button>
                <button class="try-again-btn px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Try Again
                </button>
                <button class="view-restaurant-btn px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    View Restaurant
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for all buttons
    const noThanksBtn = modal.querySelector('.no-thanks-btn');
    const tryAgainBtn = modal.querySelector('.try-again-btn');
    const viewRestaurantBtn = modal.querySelector('.view-restaurant-btn');

    noThanksBtn.addEventListener('click', () => {
        modal.remove();
    });

    tryAgainBtn.addEventListener('click', () => {
        modal.remove();
        feelingLucky();
    });

    viewRestaurantBtn.addEventListener('click', async () => {
        modal.remove(); // Remove the modal first
        const dynamicContent = document.getElementById('dynamic-content');
        dynamicContent.innerHTML = '<div class="flex justify-center items-center min-h-screen"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>';
        
        try {
            // Fetch both restaurant details and menu
            const [restaurantResponse, menuResponse] = await Promise.all([
                fetch(`${API_URL.replace(/\/api$/, '')}/api/restaurants/${randomRestaurant.id}`),
                fetch(`${API_URL.replace(/\/api$/, '')}/api/menu/by-id/${randomRestaurant.id}`)
            ]);

            if (!restaurantResponse.ok || !menuResponse.ok) {
                throw new Error('Failed to fetch restaurant data');
            }

            const restaurantDetails = await restaurantResponse.json();
            const menuData = await menuResponse.json();

            // Combine the data we have
            const fullRestaurantData = {
                ...restaurantDetails,
                ...randomRestaurant
            };

            // Display the restaurant page
            dynamicContent.innerHTML = customerMenuTemplate(fullRestaurantData, menuData);

            // Set up rating functionality
            const ratingStars = document.querySelectorAll('.rating-star');
            ratingStars.forEach((star, index) => {
                star.addEventListener('click', async () => {
                    const rating = index + 1;
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            alert('Please log in to rate restaurants');
                            return;
                        }

                        const response = await fetch(`${API_URL}/api/restaurants/${fullRestaurantData.id}/rate`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(rating)
                        });

                        if (response.ok) {
                            const result = await response.json();
                            document.getElementById('rating-feedback').classList.remove('hidden');
                            // Update the display of all stars
                            ratingStars.forEach((s, i) => {
                                s.style.color = i < rating ? '#FCD34D' : '#9CA3AF';
                            });
                        }
                    } catch (error) {
                        console.error('Error submitting rating:', error);
                        alert('Failed to submit rating. Please try again.');
                    }
                });

                // Hover effects
                star.addEventListener('mouseenter', () => {
                    ratingStars.forEach((s, i) => {
                        s.style.color = i <= index ? '#FCD34D' : '#9CA3AF';
                    });
                });
            });

            // Add to order functionality
            const addToOrderButtons = document.querySelectorAll('.add-to-order');
            const orderItems = document.getElementById('order-items');
            const orderTotal = document.getElementById('order-total');
            let currentOrder = new Map();

            addToOrderButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const itemName = button.dataset.itemName;
                    const itemPrice = parseFloat(button.dataset.itemPrice);

                    if (currentOrder.has(itemName)) {
                        const currentQty = currentOrder.get(itemName).quantity;
                        currentOrder.set(itemName, {
                            quantity: currentQty + 1,
                            price: itemPrice
                        });
                    } else {
                        currentOrder.set(itemName, {
                            quantity: 1,
                            price: itemPrice
                        });
                    }

                    updateOrderDisplay(currentOrder, orderItems, orderTotal);
                });
            });

            // Place order functionality
            const placeOrderBtn = document.getElementById('place-order-btn');
            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', async () => {
                    if (currentOrder.size === 0) {
                        alert('Please add items to your order first.');
                        return;
                    }

                    const token = localStorage.getItem('token');
                    if (!token) {
                        alert('Please log in to place an order.');
                        return;
                    }

                    try {
                        const orderData = {
                            restaurantId: fullRestaurantData.id,
                            items: Array.from(currentOrder.entries()).map(([name, details]) => ({
                                name,
                                quantity: details.quantity,
                                unitPrice: details.price
                            }))
                        };

                        await createOrder(orderData);
                        currentOrder.clear();
                        updateOrderDisplay(currentOrder, orderItems, orderTotal);
                        alert('Order placed successfully!');
                    } catch (error) {
                        console.error('Error placing order:', error);
                        alert('Failed to place order. Please try again.');
                    }
                });
            }

        } catch (error) {
            console.error('Error loading restaurant:', error);
            dynamicContent.innerHTML = '<div class="text-center p-8">Error loading restaurant. Please try again.</div>';
        }
    });
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

            // Add event listener for the "I'm Feeling Lucky" button
            const feelingLuckyBtn = document.getElementById('feeling-lucky-btn');
            if (feelingLuckyBtn) {
                feelingLuckyBtn.addEventListener('click', feelingLucky);
            }
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