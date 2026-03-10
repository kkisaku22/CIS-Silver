# Mini Budget Tracker

## Author

**Karel Kisaku**
Computer Science Major

---

# Project Description

The **Mini Budget Tracker** is a full-stack web application that allows users to track and manage personal expenses. The application enables users to create, view, and delete financial entries such as purchases or payments.

Each budget entry includes:

* Title of the expense
* Amount spent
* Category
* Date of the transaction

The application stores all data in a **MongoDB database**, allowing the information to persist even after the server restarts.

This project demonstrates how a modern web application works by implementing the **complete data flow** between a user interface, a backend server, and a database.

The project was built as a learning exercise in **full-stack web development and cloud deployment**.

---

# Technologies Used

## Backend

* Node.js
* Express.js
* MongoDB
* dotenv
* Nodemon (development server)

## Frontend

* HTML
* CSS
* Bootstrap 5
* JavaScript
* jQuery / jQuery UI

## DevOps and Deployment

* GitHub
* GitHub Actions (CI/CD)
* Google Cloud Platform (GCP)
* Nginx Reverse Proxy
* PM2 Process Manager

---

# Development vs Production

## Development Environment

During development, the application runs using **nodemon**, which automatically restarts the server when code changes are detected.

Run the development server:

```
npx nodemon app.mjs
```

or if installed globally:

```
nodemon app.mjs
```

This allows developers to update the code without manually restarting the server.

---

## Production Environment

In production, the application runs on a **Google Cloud Virtual Machine** and is managed using **PM2**.

PM2 ensures that:

* the server stays online
* the app restarts automatically if it crashes
* the app restarts after a VM reboot

Example command used in production:

```
pm2 start app.mjs --name app
```

---

# Application Limitations

Users of the web application **cannot update or modify the application code**.

Updates to the application are performed by the developer by:

1. Updating the code locally
2. Pushing changes to GitHub
3. Running the deployment workflow
4. Restarting the server on the GCP VM

This ensures the application remains stable and secure.

---

# Future Improvements

Although the Mini Budget Tracker works well for basic expense tracking, several improvements could enhance the system:

### User Authentication

Allow users to create accounts and securely log in to manage their own budgets.

### Budget Analytics

Add visual charts to display spending trends using libraries like **Chart.js**.

### Edit Transactions

Allow users to edit previously created expense entries.

### Category Management

Let users create custom expense categories.

### Data Export

Allow users to export their data as **CSV or PDF**.

### Mobile Optimization

Improve the UI for better mobile usability.

### Recurring Expenses

Allow automatic tracking of recurring payments such as rent or subscriptions.

### Notifications

Add alerts for upcoming bills or budget limits.

---

# Educational Purpose

This project demonstrates important computer science and software engineering concepts including:

* REST API development
* CRUD operations
* Database integration
* Full stack architecture
* Cloud deployment
* CI/CD automation
* Server process management

