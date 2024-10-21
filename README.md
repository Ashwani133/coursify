# coursify
# Course Selling App - Backend
## Features

- User Authentication (JWT + bcrypt)
- Schema Validation (Zod)
- Password Hashing
- Role-based Access Control (Admin/User)
- Course Management (Create, Read, Update, Delete)

## Tech Stack

- **Node.js** - Backend runtime environment
- **Express.js** - Web framework for handling routes and middleware
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - ODM for MongoDB
- **JWT (JSON Web Tokens)** - Secure user authentication
- **Bcrypt** - Password hashing for secure login
- **Zod** - Schema validation

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ashwani133/coursify.git

2. npm install

3.Create a .env file in the root directory with the following variables:
MONGO_URI=<your_mongo_db_uri>
JWT_SECRET=<your_jwt_secret>
PAYMENT_SECRET_KEY=<your_payment_gateway_key>

4. Run the app: Node index.js


**##API Endpoints**
**Admin**
> POST: /api/v1/admin/signup - Register a new admin
> POST:  /api/v1/admin/sign - Sign in using admin credentials
> POST: /api/v1/admin/course - Post a new course
> PUT: /api/v1/admin/course - Edit course
> DELETE: /api/v1/admin/course - Delete course

**User**
> POST: /api/v1/user/signup - Register a new user
> POST:  /api/v1/user/sign - Sign in using user credentials
> POST: /api/v1/user/purchases - Purchase a course
> GET: /api/v1/user/purchases - See all your purchases

**courses**
> GET: /api/v1/course/preview - See all the courses available to purchase 


   
