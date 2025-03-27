import API_URL from './config.js';

async function fetchAllRestaurants() {
    try {
        const response = await fetch(`${API_URL}/restaurants/all`);
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
        const restaurants = await response.json();
        return restaurants;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
}

function displayRestaurants(restaurants) {
    const grid = document.getElementById('restaurants-grid');
    if (!restaurants || restaurants.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 text-center col-span-full">No restaurants found.</p>';
        return;
    }

    grid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card cursor-pointer bg-white rounded-lg shadow-md overflow-hidden" 
             data-restaurant-id="${restaurant.id}" 
             onclick="window.selectRestaurant(${restaurant.id}, '${restaurant.restaurantName}')">
            <img src="${restaurant.coverIMG ? `${API_URL}/uploads/${restaurant.coverIMG}` : 'https://via.placeholder.com/400x250'}" 
                 alt="${restaurant.restaurantName}" 
                 class="w-full h-48 object-cover"
                 onerror="this.src='https://via.placeholder.com/400x250'">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${restaurant.restaurantName}</h3>
                <p class="text-gray-600">${restaurant.cuisineType}</p>
                <p class="text-gray-600 text-sm mt-2">${restaurant.description || ''}</p>
            </div>
        </div>
    `).join('');
}

export { fetchAllRestaurants, displayRestaurants }; 