# Electricity Billing System

A Full Stack Electricity Billing System developed using **React.js, Node.js, Express.js, and MongoDB**. The application provides an integrated platform for managing electricity customers, meter assignments, consumption readings, bill generation, payments, complaints, and administrative operations.

## 1. Project Overview

The Electricity Billing System is designed to simplify and automate the electricity billing management process. It provides separate interfaces for administrators and customers with role-based access.

Administrators can manage customers, register and assign electricity meters, generate bills based on meter readings, monitor payments, and manage customer complaints. Customers can view their electricity consumption, access billing details, make demo payments, and track their service requests.

The system uses MongoDB for data storage and a RESTful API architecture for communication between the frontend and backend.

## 2. Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, HTML5, CSS3, JavaScript |
| Build Tool | Vite |
| Routing | React Router |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcrypt |
| Development Tools | Visual Studio Code, npm |

## 3. System Architecture

The application follows a client-server architecture.

- **Presentation Layer:** React.js provides the user interface and handles user interactions.
- **Application Layer:** Node.js and Express.js handle business logic, authentication, API requests, and application operations.
- **Database Layer:** MongoDB stores customer details, administrator information, meter records, billing information, payment records, and complaints.
- **Communication:** Axios is used to communicate with backend REST APIs.

### Architecture Flow

```text
          USER / ADMIN
                |
                v
       REACT.JS FRONTEND
                |
                v
         AXIOS HTTP REQUEST
                |
                v
       NODE.JS + EXPRESS.JS
                |
                v
          JWT AUTHENTICATION
                |
                v
          BUSINESS LOGIC
                |
                v
            MONGODB
                |
                v
         RESPONSE TO CLIENT
```

## 4. Main Modules

### 4.1 Administrator Module

- Administrator authentication and dashboard.
- View and manage registered customers.
- Register new electricity meters.
- Assign meters to registered customers.
- Generate electricity bills using meter readings.
- View and manage billing records.
- Monitor customer payments.
- Review and update complaint statuses.
- View administrative audit activities.

### 4.2 Customer Module

- Customer registration and login.
- Customer dashboard.
- View assigned electricity meter details.
- View electricity consumption and generated bills.
- Make demo payments for pending bills.
- View payment transaction history.
- Submit complaints and service requests.
- Track complaint status.
- Update customer profile information.

### 4.3 Meter Management Module

- Register electricity meters.
- Maintain unique meter numbers.
- Assign meters to customers.
- Maintain previous meter readings.
- Retrieve customer-specific meter information.

### 4.4 Automatic Bill Generation Module

The system calculates electricity consumption using previous and current meter readings.

**Consumption Calculation:**

```text
Units Consumed = Current Reading - Previous Reading
```

The bill amount is calculated automatically using the configured Tamil Nadu domestic tariff estimation logic.

The system performs the following operations:

1. Retrieves the selected customer's assigned meter.
2. Fetches the previous meter reading.
3. Accepts the current meter reading.
4. Calculates the total electricity consumption.
5. Calculates the estimated bill amount based on configured tariff slabs.
6. Generates and stores the bill.
7. Updates the meter's previous reading for the next billing cycle.

The application also validates meter readings to prevent negative consumption.

*Note: The implemented tariff calculation is a simplified educational estimate and may not represent the final official electricity bill or all applicable charges and subsidies.*

### 4.5 Payment Management Module

- Display pending and paid bills.
- Record customer demo payments.
- Update bill payment status.
- Maintain payment transaction records.
- Display payment history for customers and administrators.

*Note: Payment functionality is implemented as a demonstration. It does not integrate with an external payment gateway or process actual financial transactions.*

### 4.6 Complaint Management Module

- Customers can submit complaints and service requests.
- Administrators can review submitted complaints.
- Administrators can update complaint status.
- Customers can track the progress of their requests.

## 5. Database Management

MongoDB is used as the primary database, with Mongoose for schema definition and database operations.

The application maintains data for the following entities:

| Entity | Description |
|---|---|
| User | Customer and administrator information |
| Meter | Electricity meter details and customer assignments |
| Bill | Meter readings, consumption, bill amount, and payment status |
| Payment | Payment transaction details |
| Complaint | Customer complaints and service request information |
| Audit | Administrative activity records |

## 6. Project Folder Structure

```text
Electricity-Billing-System-React/
│
├── client/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       └── style.css
│
├── server/
│   ├── models/
│   │   └── Models.js
│   ├── middleware.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 7. Installation and Setup

### Prerequisites

Install the following software before running the application:

- Node.js (LTS version)
- npm
- MongoDB Community Server
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone https://github.com/kaliraj1306/Electricity-Billing-System-React.git
```

### Step 2: Navigate to the Project Directory

```bash
cd Electricity-Billing-System-React
```

### Step 3: Install Dependencies

Install the root dependencies and frontend/backend dependencies:

```bash
npm install
npm run install:all
```

### Step 4: Configure Environment Variables

Create the backend environment file by copying the example:

```powershell
Copy-Item server/.env.example server/.env
```

Open `server/.env` and configure the required environment variables, including:

- MongoDB connection URI
- JWT secret
- Administrator email
- Administrator password

Use a strong secret and secure credentials. Never upload the actual `.env` file to GitHub.

### Step 5: Start MongoDB

Ensure that the MongoDB service is running before starting the application.

### Step 6: Run the Application

From the project root directory, execute:

```bash
npm run dev
```

## 8. Application Access

After successfully starting the application, access it using the following URLs:

| Service | URL |
|---|---|
| React Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

The administrator account is initialized using the credentials configured in the backend environment file, if the account does not already exist.

Customers can register through the application login page.

## 9. Security Features

- JWT-based authentication.
- Password hashing using bcrypt.
- Role-based access control for administrator and customer operations.
- Environment-based configuration for sensitive credentials.
- Server-side validation for important application operations.

## 10. Future Enhancements

- PDF bill generation and download.
- Advanced billing and revenue analytics.
- Email and SMS notifications.
- Integration with a secure online payment gateway.
- Enhanced reporting and consumption analysis.

## 11. Disclaimer

This project is developed for educational and demonstration purposes. The payment module does not process real transactions. The configured electricity tariff calculation is an estimate and should not be treated as an official utility invoice.

## 12. Author

**Electricity Billing System – React.js Edition**

Developed as a full stack web application using React.js, Node.js, Express.js, and MongoDB.
