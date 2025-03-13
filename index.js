require('dotenv').config();
const axios = require('axios');

async function getSpotifyApiToken() {
    const url = "https://accounts.spotify.com/api/token";
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const authParams = new URLSearchParams();
    authParams.append("grant_type", "client_credentials");
    authParams.append("client_id", clientId);
    authParams.append("client_secret", clientSecret);

    try {
        const response = await axios.post(url, authParams, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error.response.data);
        return null;
    }
}

// Function to fetch Spotify API data
async function fetchSpotifyData() {
    const token = await getSpotifyApiToken();
    if (!token) {
        console.log("Failed to get token.");
        return;
    }

    const url = "https://api.spotify.com/v1/browse/new-releases";
    
    try {
        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("New Releases:", response.data.albums.items);
    } catch (error) {
        console.error("Error fetching data:", error.response.data);
    }
}

// Call the function to fetch data
fetchSpotifyData();