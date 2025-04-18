import API_URL from './config.js';
import { 
    homeContentTemplate, 
    restaurantDashboardTemplate,
    favouritesTemplate
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
    previewImage,
    handleLogout
} from './navigation.js';
import { loadProfilePage } from './profile.js';
import { createOrder, selectRestaurant, loadRestaurantOrders } from './orders.js';
import './menu.js';
import { fetchAllRestaurants, displayRestaurants } from './restaurants.js';
import { loadFavourites, toggleFavourite } from './favourites.js';

//Save home content when page loads
let originalHomeContent;

document.addEventListener("DOMContentLoaded", () => {
    //Check if user is logged in
    const token = localStorage.getItem("token") || localStorage.getItem("restaurantToken");
    updateNavigation(!!token);
    showHome();
    
    //Handle browser back button
    window.onpopstate = function(event) {
        if (event.state === null) {
            showHome();
        }
    };

    //Listen for create order button click
    const createOrderBtn = document.getElementById("create-order-btn");
    if (createOrderBtn) {
        createOrderBtn.addEventListener("click", () => {
            const sampleOrderData = {
                RestaurantId: 1, 
                orderItems: [
                    { ItemName: "Sample Item 1", Quantity: 2, UnitPrice: 10.00 },
                    { ItemName: "Sample Item 2", Quantity: 1, UnitPrice: 15.00 }
                ]
            };
            createOrder(sampleOrderData);
        });
    }
});

//Make these functions available globally for HTML onclick handlers
window.loadContent = loadContent;
window.showHome = showHome;
window.selectRestaurant = selectRestaurant;
window.handleLogout = handleLogout;
window.previewImage = previewImage;
window.loadRestaurantOrders = loadRestaurantOrders;
window.toggleFavourite = toggleFavourite;
window.animateAndSelectRestaurant = animateAndSelectRestaurant;

//Animate restaurant card and then navigate to restaurant page
function animateAndSelectRestaurant(element, restaurantId, restaurantName) {
    element.classList.add('clicked');

    //Wait for animation to finish before navigating
    setTimeout(() => {
        //Navigate to restaurant page
        window.selectRestaurant(restaurantId, restaurantName);
    }, 400); 
}

//Function to create retaurant cards
function createRestaurantCard(restaurant) {
    return `
        <div class="restaurant-card" data-restaurant-id="${restaurant.id}">
            <div class="relative">
                <img src="${restaurant.coverIMG || '/images/placeholder.svg'}" 
                     alt="${restaurant.restaurantName}" 
                     class="w-full h-48 object-cover"
                     onerror="this.src='/images/placeholder.svg'">
                ${localStorage.getItem('token') ? `
                    <button onclick="window.toggleFavourite(${restaurant.id})" 
                            class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
            <div class="p-4">
                <h3 class="text-xl font-semibold mb-2">${restaurant.restaurantName}</h3>
                <p class="text-gray-600 mb-2">${restaurant.cuisineType}</p>
                <p class="text-gray-700">${restaurant.description}</p>
            </div>
        </div>
    `;
} 