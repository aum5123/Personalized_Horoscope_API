# Personalized Horoscope API

A production-grade Node.js backend API for personalized horoscopes, featuring user authentication, daily readings based on zodiac signs, and history tracking stored in MongoDB. This project was generated with assistance from Perplexity AI, an intelligent AI assistant developed by Perplexity AI, to ensure modular, clean code structure and adherence to best practices.

## Setup Instructions

1. Clone the project or create the folder structure as outlined.
2. Navigate to the project root and run `npm install` to install all dependencies listed in `package.json`.
3. Copy `.env.example` to `.env` and configure the environment variables:
   - `PORT`: The server port (default: 3000).
   - `MONGO_URI`: Your MongoDB connection string (e.g., local: `mongodb://localhost:27017/horoscopeDB` or use MongoDB Atlas for cloud).
   - `JWT_SECRET`: A strong, unique secret key for JWT signing (generate one securely for production).
4. Ensure MongoDB is installed and running (version 4.4+ recommended). For local setup, start the MongoDB service.
5. Run the server with `npm start` for production mode or `npm run dev` for development with auto-restart via Nodemon.
6. Access the API at `http://localhost:3000` and Swagger documentation at `http://localhost:3000/api-docs`.

**Note:** This project uses Node.js (v18+ recommended) and requires no additional global installations beyond npm. Test endpoints using tools like Postman.

## API Endpoints

### Authentication Routes (No auth required)
- **POST /api/auth/signup**  
  Body: `{ "name": "John Doe", "email": "john@example.com", "password": "securepass123", "birthdate": "1990-05-15" }` (birthdate in YYYY-MM-DD format).  
  Response: `{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "zodiacSign": "Taurus" } }` [201 Created].  
  Automatically detects zodiac sign from birthdate.

- **POST /api/auth/login**  
  Body: `{ "email": "john@example.com", "password": "securepass123" }`.  
  Response: Same as signup, with JWT token valid for 7 days [200 OK].

### Horoscope Routes (Require JWT auth via `Authorization: Bearer <token>`)
- **GET /api/horoscope/today**  
  Response: `{ "date": "2025-10-31", "zodiacSign": "Taurus", "horoscope": "A stable day ahead. Focus on your goals..." }` [200 OK].  
  Serves from mocked data and stores in MongoDB history if not already served today.

- **GET /api/horoscope/history**  
  Response: Array of objects, e.g., `[{ "date": "2025-10-31", "zodiacSign": "Taurus", "horoscope": "..." }, ...]` (last 7 days, sorted newest first) [200 OK].

### Documentation
- Interactive Swagger UI available at `/api-docs` for testing endpoints directly in the browser.

## Example API Requests (Postman-Ready)

1. **Signup**:  
   - Method: POST  
   - URL: `http://localhost:3000/api/auth/signup`  
   - Headers: `Content-Type: application/json`  
   - Body (JSON): `{ "name": "Test User", "email": "test@example.com", "password": "password123", "birthdate": "1990-01-15" }`  
   - Expected: 201 with token and user details.

2. **Login**:  
   - Similar to signup, but use `/api/auth/login` and omit name/birthdate.  
   - Copy the returned token for auth headers.

3. **Today's Horoscope**:  
   - Method: GET  
   - URL: `http://localhost:3000/api/horoscope/today`  
   - Headers: `Authorization: Bearer <paste_token_here>`  
   - Expected: 200 with horoscope object.

4. **History**:  
   - Method: GET  
   - URL: `http://localhost:3000/api/horoscope/history`  
   - Headers: Same as above.  
   - Expected: 200 with array (empty on first use).

**Troubleshooting Tips**: If MongoDB connection fails, verify `MONGO_URI` and service status. For JWT errors, ensure `JWT_SECRET` matches across sessions.

## Design Decisions

- **Modular Structure**: Organized into `models/`, `controllers/`, `routes/`, and `middleware/` for separation of concerns, improving maintainability and testability in a production environment .
- **Authentication**: Used JWT for stateless sessions and bcrypt for secure password hashing to handle user sessions efficiently without database lookups on every request.
- **Data Handling**: Mocked horoscopes in `horoscopeData.js` for simplicity, with zodiac detection via `zodiacUtils.js` based on standard date ranges . History stored in MongoDB for persistence, querying only recent 7 days to optimize performance.
- **Rate Limiting**: Applied globally via `express-rate-limit` (5 req/min per IP) to prevent abuse, focusing on IP-based limiting for simplicity over user-specific in this scope.
- **Swagger Integration**: Included for self-documenting APIs, aiding development and client integration without external tools.
- **No External Horoscope API**: Relied on in-memory mocks to avoid dependencies and costs, ensuring the API runs offline.

These choices prioritize security, scalability basics, and ease of setup while meeting core requirements .

## Potential Improvements with More Time

- **Input Validation**: Integrate Joi or express-validator for robust schema validation on all endpoints to prevent malformed data and enhance security.
- **Error Handling**: Add global error middleware with structured logging (e.g., Winston) and user-friendly messages, including validation errors and 404 handling.
- **Testing Suite**: Implement unit/integration tests with Jest/Mocha, covering auth, zodiac logic, and database operations for CI/CD readiness.
- **User-Specific Personalization**: Beyond zodiac, incorporate user preferences (e.g., mood, location) via additional fields and ML-based horoscope generation using libraries like TensorFlow.js.
- **Caching**: Use Redis for horoscope history and daily fetches to reduce MongoDB load, especially for high-traffic scenarios.
- **Advanced Rate Limiting**: Switch to user-based limiting with Redis store for fairness in multi-user environments.
- **Deployment**: Add Dockerfiles, PM2 for process management, and cloud config for Heroku/AWS deployment.

These enhancements would elevate reliability and user experience .

## Scalability for Personalized Horoscopes

Currently, the system scales well for zodiac-specific horoscopes (12 variants) as data is static and in-memory, with MongoDB handling user history via efficient queries (indexed on `userId` and `date`). For truly personalized horoscopes (e.g., generated per user based on profile, past interactions, or AI), scalability challenges include:

- **Data Volume**: Personalized content would require dynamic generation (e.g., via GPT-like models), increasing compute needs. Solution: Use serverless functions (AWS Lambda) or microservices to offload generation, caching results in Redis with TTL (e.g., 24h per user).
- **Database Load**: History storage grows linearly with users; for 1M users at 7 entries/day, ~7M docs/year. MongoDB scales horizontally with sharding on `userId`, but add read replicas for queries.
- **Performance**: Rate limiting prevents spikes, but personalize via async queues (Bull/Redis) to handle bursts without blocking. Horizontal scaling with Node.js clusters or Kubernetes pods supports 10k+ concurrent users.
- **Cost/Complexity**: Integrate external AI APIs (e.g., OpenAI) with fallback to zodiac defaults; monitor via Prometheus for bottlenecks. Estimated: Handles 100k users with basic setup, scaling to millions via cloud infra .

## Additional Notes

- **Security**: Always use HTTPS in production; rotate JWT secrets periodically. Passwords are hashed, but consider adding email verification.
- **License**: MIT (add if needed).
- **Contributions**: Welcome via pull requests; ensure tests pass.
- **Zodiac Accuracy**: Based on tropical astrology dates; edge cases (e.g., leap years) handled via Date object .

For issues, check console logs or MongoDB collections (`users`, `horoscopohistories`).
