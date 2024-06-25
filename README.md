# 🗺️ Map Capture and 3D Visualization App

This project is a MERN (MongoDB, Express.js, React.js, Node.js) stack application that allows users to capture map regions and visualize them on a 3D cuboid.

Link : [mapcap.vercel.app](mapcap.vercel.app)

## ✨ Features

- 🌍 Interactive map selection using Google Maps or Mapbox
- 📸 Capture visible map region as an image
- 🧊 Apply captured image as a texture on a 3D cuboid using BabylonJS
- 💾 Save and retrieve map captures
- 📊 Identify top 3 most frequently captured regions for last 24 hours and all time.
- ⚡ Caching mechanism for improved performance
- 🔐 User authentication and authorization
- ✏️ Annotation functionality for maps

## 🛠️ Technologies Used

- Frontend: React.js, Google Maps/Mapbox API, BabylonJS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)

## 🚀 Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/deveshXm/MapCapture
   cd MapCapture
   ```

2. Install Dependencies
   1. client
      ```
      npm install
      ```
   1. server
      ```
      npm install
      ```
3. Setup env using template present in project
4. Run server
   1. client
      ```
      npm run dev
      ```
   2. server
      ```
      npm run dev
      ```

## 📖 Usage

1. Navigate to `http://localhost:5173` in your web browser.
2. Log in or create an account.
3. Use the map to select a region of interest.
4. View the captured region applied as a texture on a 3D cuboid.
5. Access previously saved captures and annotations.

## 🔌 API Endpoints

- `POST /api/maps`: Save a new map capture
- `GET /api/maps/user/?page=1`: Retrieve all captures for the authenticated user
- `GET /api/maps/top`: Get top 3 most frequently captured regions of all time
- `GET /api/maps/top24h` : Get top 3 most frequently captured regions from last 24 hour
- `POST /api/user/register`: Register a new user
- `POST /api/user/login`: Log in a user

## 🚀 Caching Strategy

### Overview

Our application implements a caching strategy for fetching and storing the top regions based on user activity. This approach optimizes performance and reduces database load while ensuring data freshness.

### Implementation

1. **Redis Caching**: We use Redis as an in-memory data store to cache the top regions data.

2. **Periodic Updates**: A background job updates the Redis cache every few seconds with the latest top regions data.

3. **API Endpoint**: When the API is queried for top regions, it first checks the Redis cache. If data is available, it's returned immediately. If not, it falls back to querying the database.

4. **Database Query**: The database query uses MongoDB's aggregation pipeline to efficiently calculate the top regions.

### Why This Approach?

1. **Performance**: By caching data in Redis, we significantly reduce response times for frequent requests.

2. **Reduced Database Load**: Periodic updates to the cache minimize direct database queries, reducing load on the primary database.

3. **Data Freshness**: Updating the cache every few seconds ensures that the data remains relatively fresh without overwhelming the system.

4. **Scalability**: This approach can easily handle increasing loads by scaling the Redis cache horizontally.

5. **Fault Tolerance**: If the cache fails, the system falls back to direct database queries, ensuring continued operation.

### Alternatives Considered

1. **No Caching**: While simpler, this would result in higher database load and slower response times.

2. **Application-Level Caching**: This would be less efficient for distributed systems and wouldn't persist across application restarts.

3. **Database-Level Caching**: While effective, it wouldn't provide as much flexibility and would be more complex to implement and manage.

4. **CDN Caching**: While powerful for static assets, it's less suitable for frequently changing dynamic data like our top regions.

### Future Improvements

- Implement cache warming strategies to pre-populate the cache after clearing or on cold starts.
- Add monitoring for cache hit/miss rates to fine-tune update frequency.
- Explore sharding strategies for Redis as data volume grows.

This caching strategy provides a good balance between performance, data freshness, and system complexity, making it well-suited for our current needs while allowing for future scalability.

## 🔮 Future Improvements

- Implement cache warming strategies to pre-populate the cache after clearing or on cold starts.
- Add monitoring for cache hit/miss rates to fine-tune update frequency.
- Explore sharding strategies for Redis as data volume grows.

This caching strategy provides a good balance between performance, data freshness, and system complexity, making it well-suited for our current needs while allowing for future scalability.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

You don't need one.
