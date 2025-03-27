import API_URL from './config.js';
import { 
    homeContentTemplate, 
    restaurantDashboardTemplate 
} from './templates.js';
import { 
    loginUser, 
    register, 
    loginRestaurant, 
    registerRestaurant, 
    logout, 
    fetchUserData 
} from './auth.js';
import { 
    updateNavigation, 
    loadContent, 
    showHome, 
    showRestaurantHome, 
    previewImage,
    handleLogout
} from './navigation.js';
import { loadProfilePage } from './profile.js';
import { createOrder, selectRestaurant } from './orders.js';
import './menu.js';
import { fetchAllRestaurants, displayRestaurants } from './restaurants.js';

// Save original home content when page loads
let originalHomeContent;

document.addEventListener("DOMContentLoaded", () => {
    // Check for existing token in local storage
    const token = localStorage.getItem("token") || localStorage.getItem("restaurantToken");
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

// Make these functions available globally for HTML onclick handlers
window.loadContent = loadContent;
window.showHome = showHome;
window.selectRestaurant = selectRestaurant;
window.handleLogout = handleLogout;
window.previewImage = previewImage; 