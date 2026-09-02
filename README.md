🎮 PlayGame — Full-Stack Game Marketplace

A full-stack digital game marketplace built with Next.js, React, TypeScript, Drizzle ORM, and Turso/libSQL.

PlayGame provides a complete marketplace workflow where users can discover games, manage their wallet, purchase games, and access purchased games through their library. Developers can manage games and track revenue, while administrators manage the platform and monitor platform revenue.

🌐 Live Demo

Production:
https://playgame-amber.vercel.app/

📌 About the Project

PlayGame was developed as a full-stack portfolio project to demonstrate practical experience with:

Modern full-stack web development

Authentication and role-based authorization

Database design and ORM usage

Digital wallet and transaction management

E-commerce purchasing workflows

Developer and administrator dashboards

Revenue distribution

Scheduled game release processing

Production deployment with Vercel and Turso

✨ Key Features

🏠 Marketplace

Users can browse the game catalog, view game details, and discover available games.

🔐 Authentication

Provides user registration, login, and account management with role-based access.

🛒 Shopping

Users can add games to their cart and complete purchases through the checkout process.

💰 Wallet

Each user can manage their wallet balance, perform top-ups, and view transaction history.

📚 Library

Purchased games are automatically added to the user's library and associated with their ownership record.

👨‍💻 Developer

Developers have access to a dedicated dashboard where they can manage games and monitor generated revenue.

🛡️ Administration

Administrators can manage the platform, manage games, and monitor platform revenue.

⏰ Game Lifecycle

Games can use scheduled release dates. The release-processing system automatically handles games that reach their scheduled release time.

🔄 Application Workflow

The main marketplace workflow is:

Browse Games
     │
     ▼
Game Details
     │
     ▼
Add to Cart
     │
     ▼
Checkout
     │
     ▼
Wallet Payment
     │
     ▼
Purchase Completed
     │
     ├───────────────┐
     │               │
    90%             10%
     │               │
     ▼               ▼
Developer         PlayGame
Revenue           Platform Revenue
     │               │
     └───────┬───────┘
             ▼
       Game Library

Revenue Distribution

For every completed purchase:

90% → Developer revenue

10% → PlayGame platform revenue

This separation allows developer earnings and platform earnings to be tracked independently.

🧩 Application Modules

PlayGame
├── Marketplace
│   ├── Game Catalog
│   ├── Game Details
│   └── Game Discovery
│
├── Authentication
│   ├── Login
│   ├── Registration
│   └── Account Management
│
├── Shopping
│   ├── Cart
│   └── Checkout
│
├── Wallet
│   ├── Balance
│   ├── Top-Ups
│   └── Transactions
│
├── Library
│   └── Purchased Games
│
├── Developer
│   ├── Dashboard
│   ├── Game Management
│   └── Revenue
│
├── Administration
│   ├── Dashboard
│   ├── Game Management
│   └── Platform Revenue
│
└── Game Lifecycle
    └── Scheduled Release Processing

👥 User Roles

Role

Responsibilities

Gamer

Browse, purchase, and manage owned games

Developer

Manage games and view developer revenue

Administrator

Manage games and monitor platform revenue

⏰ Game Lifecycle

Games can have a scheduled release date.

Scheduled Game
      │
      ▼
Release Date Reached
      │
      ▼
Release Processing
      │
      ▼
Game Becomes Available
      │
      ▼
Users Can Purchase

This allows games to be prepared in advance and automatically become available when their release date is reached.

🛠️ Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

Backend

Next.js Server Components & API Routes

TypeScript

Drizzle ORM

Database

Turso

libSQL

Drizzle Kit

Development

Node.js

npm

tsx

ESLint

Deployment

Vercel

Git

GitHub

🏗️ Architecture

User
 │
 ▼
Next.js Application
 │
 ├── Authentication
 ├── Marketplace
 ├── Cart & Checkout
 ├── Wallet
 ├── Library
 ├── Developer Dashboard
 └── Admin Dashboard
 │
 ▼
Drizzle ORM
 │
 ▼
Turso / libSQL Database

📁 Project Structure

playgame/
├── app/
│   ├── admin/
│   ├── api/
│   ├── cart/
│   ├── checkout/
│   ├── developer/
│   ├── library/
│   ├── login/
│   ├── signup/
│   └── wallet/
│
├── components/
├── lib/
│   ├── auth/
│   ├── database/
│   └── ...
│
├── public/
├── drizzle.config.ts
├── package.json
└── README.md

🗄️ Database

The application uses Drizzle ORM with Turso/libSQL.

The database contains the core entities required for the marketplace, including:

Users

Roles

Games

Developer profiles

Game media

Cart items

Purchases

Game ownership

Wallets

Wallet top-ups

Wallet transactions

Developer revenue

Platform revenue

Database schema changes are managed through Drizzle migrations.

⚙️ Local Development

Clone the repository:

git clone https://github.com/RizalHB/playgame.git
cd playgame

Install dependencies:

npm install

Create your local environment file:

DATABASE_URL=file:./playgame.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-cron-secret

Run the development server:

npm run dev

Open:

http://localhost:3000

🗃️ Database Commands

Generate migrations:

npm run db:generate

Run migrations:

npm run db:migrate

Seed development data:

npm run db:seed

Open Drizzle Studio:

npm run db:studio

🚀 Deployment

The production application is deployed using Vercel with Turso/libSQL as the production database.

Production environment variables include:

TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token
NEXT_PUBLIC_APP_URL=https://playgame-amber.vercel.app/
CRON_SECRET=your-cron-secret

Sensitive credentials should be stored as environment variables and should never be committed to Git.

🔒 Security

The project follows several basic security practices:

Passwords are stored using secure password hashing.

Authentication is required for protected features.

Role-based authorization separates Gamer, Developer, and Administrator access.

Database credentials are stored in environment variables.

Sensitive environment files are excluded from Git.

Purchase and wallet operations are handled server-side.

🔮 Future Improvements

Possible future improvements include:

Real payment gateway integration

Game reviews and ratings

Wishlist functionality

Developer game analytics

Advanced search and filtering

Email notifications

Improved admin moderation tools

Automated testing and CI/CD

🎯 Project Purpose

PlayGame demonstrates how a modern full-stack application can combine authentication, database management, e-commerce logic, wallet transactions, role-based dashboards, revenue management, and scheduled processing into one production-ready project.

🔗 Links

Live Application: https://playgame-amber.vercel.app/

GitHub Repository: https://github.com/RizalHB/playgame

📄 License

This project was created as a personal portfolio and learning project.
