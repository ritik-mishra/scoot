# Scoot 🛵
**Scoot into new possibilities!**

A full-stack bike marketplace application built with React, Node.js, Express, and MongoDB. Users can browse, list, and manage bike listings with authentication and search functionality.

## Features
- 🔐 User authentication (login/register)
- 🏍️ Browse all bike listings
- 📝 Create and manage your own bike listings
- 🔍 Search bikes by brand or model
- ✏️ Edit your bike listings
- 📱 Responsive design with modern UI

## Tech Stack
- **Frontend**: React, Ant Design, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens

## Prerequisites
Before running this application, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation) or [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ritik-mishra/scoot.git
cd scoot
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/scoot
JWT_SECRET=your_jwt_secret_key_here
```

**For MongoDB Atlas (Cloud):**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scoot?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
```

**For Local MongoDB:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/scoot
JWT_SECRET=your_jwt_secret_key_here
```

### 5. Start MongoDB
**For Local MongoDB:**
- Start your local MongoDB service
- On Windows: Run `mongod` in command prompt
- On macOS: `brew services start mongodb-community`
- On Linux: `sudo systemctl start mongod`

**For MongoDB Atlas:**
- No additional setup required, just use your connection string

## Running the Application

### Option 1: Run Both Frontend and Backend Together (Recommended)
```bash
npm run dev:all
```
This command will start both the backend server and React development server simultaneously.

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```bash
cd client
npm start
```
The frontend will run on `http://localhost:3000`

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Register a new account** or **login** with existing credentials
3. **Browse bike listings** using the dropdown selector
4. **Search for bikes** using the search bar
5. **View bike details** by clicking on any bike card
6. **Switch to "My Listings"** to manage your own bike listings
7. **Add new bikes** or **edit existing ones** from your listings page

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Bikes
- `GET /bikes` - Get all bike listings
- `GET /bikes/my-listings` - Get user's bike listings
- `GET /bikes/:id` - Get specific bike details
- `POST /bikes` - Create new bike listing
- `PUT /bikes/:id` - Update bike listing
- `DELETE /bikes/:id` - Delete bike listing

### Users
- `GET /users/:id` - Get user details

## Project Structure
```
scoot/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── src/                   # Backend server
│   ├── middleware/        # Auth & validation middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
├── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the MONGO_URI in your .env file

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill processes using the ports: `npx kill-port 3000` or `npx kill-port 5000`

3. **Module Not Found Errors**
   - Run `npm install` in both root and client directories
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

4. **CORS Issues**
   - The backend is configured to allow all origins in development
   - Ensure the frontend is making requests to the correct backend URL

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the ISC License.

## Support
If you encounter any issues or have questions, please open an issue on GitHub.
