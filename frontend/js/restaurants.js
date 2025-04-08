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

async function searchRestaurants(query) {
    try {
        const response = await fetch(`${API_URL}/restaurants/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error('Failed to search restaurants');
        }
        const restaurants = await response.json();
        return restaurants;
    } catch (error) {
        console.error('Error searching restaurants:', error);
        return [];
    }
}

async function checkFavoriteStatus(restaurantId, token) {
    try {
        const response = await fetch(`${API_URL}/favourites/check/${restaurantId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.isFavourite;
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
    }
}

async function displayRestaurants(restaurants) {
    const grid = document.getElementById('restaurants-grid');
    if (!restaurants || restaurants.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 text-center col-span-full">No restaurants found.</p>';
        return;
    }

    const token = localStorage.getItem('token');
    let favoriteStatuses = {};
    
    if (token) {
        // Fetch favorite status for all restaurants in parallel
        const statusPromises = restaurants.map(r => checkFavoriteStatus(r.id, token));
        const statuses = await Promise.all(statusPromises);
        restaurants.forEach((r, i) => {
            favoriteStatuses[r.id] = statuses[i];
        });
    }

    grid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card cursor-pointer bg-white rounded-lg shadow-md overflow-hidden" 
             data-restaurant-id="${restaurant.id}"
             onclick="window.animateAndSelectRestaurant(this, ${restaurant.id}, '${restaurant.restaurantName.replace(/'/g, "\\'")}')">
            <div class="relative">
                <img src="${restaurant.coverIMG ? `${API_URL}/uploads/${restaurant.coverIMG.replace('/uploads/', '')}` : '/images/placeholder.svg'}" 
                     alt="${restaurant.restaurantName}" 
                     class="w-full h-48 object-cover"
                     onerror="this.src='/images/placeholder.svg'">
                ${token ? `
                    <button onclick="event.stopPropagation(); window.toggleFavourite(${restaurant.id})" 
                            class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                        <svg class="w-6 h-6 ${favoriteStatuses[restaurant.id] ? 'text-red-500' : 'text-gray-400'}" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${restaurant.restaurantName}</h3>
                <p class="text-gray-600">${restaurant.cuisineType}</p>
                <p class="text-gray-600 text-sm mt-2">${restaurant.description || ''}</p>
            </div>
        </div>
    `).join('');
}

function setupSearchHandlers() {
    const searchInput = document.getElementById('restaurant-search');
    const searchButton = document.getElementById('search-button');
    let searchTimeout;

    if (!searchInput || !searchButton) return;

    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (query) {
            const restaurants = await searchRestaurants(query);
            displayRestaurants(restaurants);
        } else {
            const restaurants = await fetchAllRestaurants();
            displayRestaurants(restaurants);
        }
    };

    // Search on button click
    searchButton.addEventListener('click', performSearch);

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Debounced search as user types
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 500);
    });
}

export { 
    fetchAllRestaurants, 
    displayRestaurants, 
    searchRestaurants,
    setupSearchHandlers 
}; 