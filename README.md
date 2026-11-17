# Electricity Billing System — ReactJS Edition

A ReactJS frontend and Node.js/Express + MongoDB backend based on the functionality described in the supplied Electricity Billing System report. The Angular frontend has been replaced with React; the documented user/admin workflows and MongoDB data concepts are retained.

## Technology
- Frontend: React 18, Vite, React Router, Axios, Lucide icons, CSS
- Backend: Node.js, Express, Mongoose, JWT authentication, bcrypt password hashing
- Database: MongoDB

## Main features
### Customer
- Register and sign in
- Dashboard overview
- View bills and record a **demo** payment
- View assigned meter details
- Submit complaints/service requests and track status
- View payment history and update profile

### Administrator
- Sign in to the admin dashboard
- View registered customers and remove accounts
- Register meters and assign them to customers
- Generate bills and review billing records
- Review complaints and update their status
- View payment history and audit activity

## Requirements
Install Node.js LTS and MongoDB Community Server. Start the MongoDB service before starting the application.

## Setup on Windows (VS Code terminal)
1. Extract this ZIP and open the `electricity-billing-react` folder in VS Code.
2. Open a terminal in the project root and run:

   ```powershell
   copy server\.env.example server\.env
   npm install
   npm run install:all
   ```

3. Open `server/.env` and set a strong `JWT_SECRET`. The default local MongoDB URI is already configured. You can change the admin email/password there.
4. Start the application from the project root:

   ```powershell
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser. The API runs at **http://localhost:5000**.

The backend creates the configured admin account the first time it starts, if that email does not already exist. Default demo login (change it in `server/.env` before first start):
- Email: `admin@electricity.com`
- Password: `Admin@123`

Customers can register from the sign-in page.

## Important notes
- The payment action is a local demonstration that marks a bill as paid and creates a payment-history record. It is **not connected to a real payment gateway** and does not charge money.
- This is a reconstructed React implementation based on the features and database descriptions in the report. The report contains only selected Angular TypeScript files; it does not contain every original HTML/CSS component, service, backend route, or configuration file. Therefore this is not a byte-for-byte conversion of the missing original application files.
- Before public deployment, add production-grade validation, rate limiting, secure cookie/session policy, HTTPS, role/ownership checks for every resource, logging, and payment-gateway integration if required.

## Folder structure
```text
electricity-billing-react/
├── client/
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       └── style.css
├── server/
│   ├── models/Models.js
│   ├── middleware.js
│   ├── server.js
│   └── .env.example
├── package.json
└── README.md
```
