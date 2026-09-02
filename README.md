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

The main marketplace workflow starts when a user discovers a game and continues through purchase and ownership.

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

After a successful purchase, the transaction is recorded and the purchased game becomes available in the user's library.

Revenue Distribution

For every completed purchase:

90% → Developer revenue

10% → PlayGame platform revenue

This separation allows developer earnings and platform earnings to be tracked independently.

🧩 Application Modules

PlayGame is divided into several functional areas. The Marketplace handles game discovery and game details, while Authentication manages registration, login, and account access.

The Shopping module manages the cart and checkout process. The Wallet module handles balances, top-ups, and transaction history. After purchasing a game, users can access it through the Library.

Developers use the Developer Dashboard to manage their games and monitor revenue. Administrators use the Administration area to manage games and monitor platform revenue. The Game Lifecycle system handles scheduled game releases.

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

Games can have a scheduled release date. The release-processing system checks scheduled games and makes them available when their release date is reached.

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

This allows games to be prepared in advance while controlling when they become publicly available.

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

PlayGame uses a full-stack Next.js architecture. The application layer handles authentication, marketplace features, shopping, wallet operations, library management, and role-specific dashboards. Drizzle ORM provides database access, while Turso/libSQL is used as the production database.

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

📁 Project Organization

The project is organized around Next.js application routes, reusable UI components, authentication, database access, and shared application logic. Marketplace, wallet, checkout, developer, administration, and authentication features are separated into their respective application areas, while shared components and backend/database functionality are maintained in dedicated directories.

This structure keeps the application modular and makes it easier to maintain and extend individual features without tightly coupling the entire system.

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

Create a local .env file:

DATABASE_URL=file:./playgame.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-cron-secret

Run the development server:

npm run dev

Open the application at:

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

The project follows several security practices:

Passwords are securely hashed.

Authentication protects private features.

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

PlayGame demonstrates how a modern full-stack application can combine authentication, database management, e-commerce logic, wallet transactions, role-based dashboards, revenue management, and scheduled processing into one complete marketplace system.

🔗 Links

Live Application: https://playgame-amber.vercel.app/

GitHub Repository: https://github.com/RizalHB/playgame

📄 License

This project was created as a personal portfolio and learning project.
