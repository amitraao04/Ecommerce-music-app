# Melodic Market - Music Store E-commerce Application

A full-stack e-commerce application for a music store, featuring user authentication, product browsing, shopping cart functionality, and secure checkout with Razorpay payment integration.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Payment Gateway**: Razorpay

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas connection)
- [Git](https://git-scm.com/)

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd music-store-backend
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret_key
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Running the Application

### Start the Backend Server

1. From the root directory:
```bash
cd backend
npm start
```
Or with nodemon for development:
```bash
npm run server
```
The backend server will run on http://localhost:5000

### Start the Frontend Development Server

1. Open a new terminal and from the root directory:
```bash
cd frontend
npm start
```
The frontend development server will run on http://localhost:3000

## Application Features

- **User Authentication**: Register and login functionality
- **Product Browsing**: View music instruments with search and category filtering
- **Shopping Cart**: Add, remove, and update quantities
- **Checkout Process**: Enter shipping details and make payments
- **Order Management**: View order history and details
- **Payment Integration**: Secure payment processing with Razorpay

## Testing the Payment Gateway

The application uses Razorpay for payment processing. To test payments:

- Use test card number: 4111 1111 1111 1111
- Any future expiry date
- Any random CVV
- Any name

## License

[MIT License](LICENSE)
