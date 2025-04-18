import API_URL from './config.js';
import { selectRestaurant } from './orders.js';

//Function to load favourite restaurants
export async function loadFavourites() {
    //If there is no token in local storage it means no user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        document.getElementById("dynamic-content").innerHTML = '<p class="text-center text-gray-600">Please log in to view your favourites.</p>';
        return;
    }
    //Fetch the logged in user's favourite restaurants
    try {
        const res = await fetch(`${API_URL}/favourites`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        //If favourites were returned successfuly
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error('Load favourites failed:', errorData);
            throw new Error(`Failed to fetch favourites: ${res.status} ${res.statusText}`);
        }

        const favourites = await res.json();
        //If user doesn't have any favourites
        if (favourites.length === 0) {
            document.getElementById("dynamic-content").innerHTML = '<p class="text-center text-gray-600">You haven\'t added any restaurants to your favourites yet.</p>';
            return;
        }
        //Grid to display user's favourite restaurants
        const favouritesHTML = `
            <div class="container mx-auto px-4 py-8">
                <h2 class="text-2xl font-bold mb-6">Your Favourite Restaurants</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${favourites.map(restaurant => {
                        const fullCoverUrl = restaurant.coverIMG 
                            ? (restaurant.coverIMG.startsWith('uploads/') 
                                ? `${API_URL}/${restaurant.coverIMG}`
                                : `${API_URL}/uploads/${restaurant.coverIMG}`)
                            : '/images/placeholder.svg';

                        return `
                            <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300" 
                                 onclick="window.selectRestaurant(${restaurant.id}, '${restaurant.restaurantName.replace(/'/g, "\\'")}')">
                                <div class="relative h-48">
                                    <img src="${fullCoverUrl}" 
                                         alt="${restaurant.restaurantName}" 
                                         class="w-full h-full object-cover"
                                         onerror="this.src='/images/placeholder.svg'">
                                    <button class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors duration-200"
                                            onclick="event.stopPropagation(); window.toggleFavourite(${restaurant.id})">
                                        <svg class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="p-4">
                                    <h3 class="text-xl font-semibold mb-2">${restaurant.restaurantName}</h3>
                                    <p class="text-gray-600 mb-2">${restaurant.cuisineType || 'No cuisine type available'}</p>
                                    <p class="text-gray-600 mb-2">${restaurant.description || ''}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        document.getElementById("dynamic-content").innerHTML = favouritesHTML;
    //If error has occured while loading favourites
    } catch (error) {
        console.error('Error loading favourites:', error);
        document.getElementById("dynamic-content").innerHTML = '<p class="text-center text-red-600">Failed to load your favourites. Please try again later.</p>';
    }
}

//Function to save/unsave restaurants as favourite
export async function toggleFavourite(restaurantId) {
    //Check if a user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert('Please log in to add restaurants to your favourites.');
        return;
    }

    try {
        //Check if restaurant is already saved in favourites
        const checkRes = await fetch(`${API_URL}/favourites/check/${restaurantId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!checkRes.ok) {
            const errorData = await checkRes.json().catch(() => ({}));
            console.error('Check favourite status failed:', errorData);
            throw new Error(`Failed to check favourite status: ${checkRes.status} ${checkRes.statusText}`);
        }

        const { isFavourite } = await checkRes.json();
        console.log('Current favourite status:', isFavourite);

        //If restaurant is already in favourites remove it, otherwise save it
        const actionRes = await fetch(`${API_URL}/favourites/${restaurantId}`, {
            method: isFavourite ? 'DELETE' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!actionRes.ok) {
            const errorData = await actionRes.json().catch(() => ({}));
            console.error('Toggle favourite action failed:', errorData);
            throw new Error(`Failed to update favourite status: ${actionRes.status} ${actionRes.statusText}`);
        }

        //Update heart icon
        const heartIcon = document.querySelector(`[onclick="event.stopPropagation(); window.toggleFavourite(${restaurantId})"] svg`);
        if (heartIcon) {
            heartIcon.classList.toggle('text-red-500');
            heartIcon.classList.toggle('text-gray-400');
        }

        //If user is currently on "favourites" page, update it
        const restaurantCard = document.querySelector(`[onclick="window.selectRestaurant(${restaurantId}"]`);
        if (restaurantCard && isFavourite) {
            restaurantCard.remove();
        }
    } catch (error) {
        console.error('Error toggling favourite:', error);
        alert(`Failed to update favourite status: ${error.message}`);
    }
} 