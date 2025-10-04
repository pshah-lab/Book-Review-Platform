# Book Review Platform - MERN Stack

A comprehensive book review platform built with MongoDB, Express.js, React, and Node.js. Users can sign up, log in, add books, and write reviews with ratings.

## Features

### Core Features
- **User Authentication**: JWT-based authentication with password hashing
- **Book Management**: CRUD operations for books with image uploads
- **Review System**: Rate and review books with 1-5 star ratings
- **Search & Filter**: Search books by title/author and filter by genre
- **Pagination**: Browse books with pagination (5 books per page)
- **Protected Routes**: Secure routes for authenticated users only

### Technical Features
- **Backend**: Node.js + Express + MongoDB with Mongoose
- **Frontend**: React with React Router and Context API
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer for image uploads
- **Database**: MongoDB Atlas with proper schema design
- **API**: RESTful API with proper error handling

## Project Structure

```
BookProjectPrac/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── routes/         # Page components
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Image uploads
│   └── index.js           # Server entry point
└── README.md
```

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  avatar: String,
  role: String (enum: ['user', 'admin'])
}
```

### Book Schema
```javascript
{
  title: String (required),
  author: String (required),
  description: String (required),
  genre: String (required, enum),
  year: Number (required),
  thumbnail: String,
  addedBy: ObjectId (ref: User),
  averageRating: Number,
  reviewCount: Number
}
```

### Review Schema
```javascript
{
  bookId: ObjectId (ref: Book),
  userId: ObjectId (ref: User),
  rating: Number (1-5),
  reviewText: String (required)
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books` - Get all books (with pagination, search, filter)
- `GET /api/books/:slug` - Get single book
- `POST /api/books` - Create new book (protected)
- `PUT /api/books/:id` - Update book (protected)
- `DELETE /api/books/:id` - Delete book (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `PUT /api/reviews/:id` - Update review (protected)
- `DELETE /api/reviews/:id` - Delete review (protected)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BookProjectPrac/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreview
   JWT_SECRET=your-super-secret-jwt-key
   PORT=8000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:8000

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd ../client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the client directory:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Usage

### For Users
1. **Sign Up**: Create a new account with name, email, and password
2. **Login**: Access your account with email and password
3. **Browse Books**: View all books with search and filter options
4. **Add Books**: Create new book entries (authenticated users only)
5. **Write Reviews**: Rate and review books (authenticated users only)
6. **Edit/Delete**: Manage your own books and reviews

### For Developers
- **API Testing**: Use Postman or similar tools to test API endpoints
- **Database**: Connect to MongoDB Atlas to view data
- **Logs**: Check server console for debugging information

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: JavaScript library for UI
- **React Router**: Client-side routing
- **Context API**: State management
- **Vite**: Build tool and dev server

## Deployment

### Backend (Render/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with Node.js buildpack

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.