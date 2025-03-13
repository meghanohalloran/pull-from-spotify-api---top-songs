require("dotenv").config(); // Load environment variables
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Function to get Spotify API Token
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
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching token:", error.response.data);
        return null;
    }
}

// API Route: Get Spotify New Releases
app.get("/new-releases", async (req, res) => {
    const token = await getSpotifyApiToken();
    if (!token) return res.status(500).json({ error: "Failed to get token" });

    try {
        const response = await axios.get("https://api.spotify.com/v1/browse/new-releases", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        res.json(response.data.albums.items);
    } catch (error) {
        res.status(500).json({ error: error.response.data });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});