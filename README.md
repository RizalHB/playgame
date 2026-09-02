🎮 PlayGame — Full-Stack Game Marketplace

A full-stack digital game marketplace built with Next.js, React, TypeScript, Drizzle ORM, and Turso/libSQL.

PlayGame provides a complete marketplace experience where users can discover games, manage their wallet, purchase games, and access purchased games through their library. Developers can manage games and track revenue, while administrators manage the platform and monitor platform revenue.

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

Users can browse the game catalog, discover available games, and view detailed information about each game.

🔐 Authentication

Provides user registration, login, account management, and role-based access control.

🛒 Shopping

Users can add games to their cart and complete purchases through the checkout process.

💰 Wallet

Users can manage their wallet balance, perform top-ups, and view their transaction history.

📚 Library

After a successful purchase, the game is added to the user's library and associated with their ownership record.

👨‍💻 Developer

Developers have access to a dedicated dashboard for managing games and monitoring their generated revenue.

🛡️ Administration

Administrators can manage games, oversee the platform, and monitor platform revenue.

⏰ Game Lifecycle

Games can have scheduled release dates. The release-processing system handles games when their scheduled release time is reached.

🔄 Application Workflow

The main marketplace workflow begins when a user discovers a game through the marketplace. The user can view the game details, add the game to their cart, and proceed to checkout.

During checkout, the purchase is processed using the user's wallet balance. Once the transaction is completed successfully, the purchase and ownership records are created and the game becomes available in the user's library.

The completed purchase also records the revenue distribution. 90% of the purchase amount is allocated to the developer, while 10% is allocated to PlayGame as platform revenue. Developer and platform revenue are tracked separately for reporting and dashboard purposes.

This workflow connects the marketplace, cart, checkout, wallet, purchase, ownership, developer revenue, platform revenue, and library systems into one complete transaction process.

🧩 Application Modules

PlayGame is organized into several functional areas.

The Marketplace provides the game catalog, game details, and game discovery experience. Authentication manages registration, login, account management, and access control.

The Shopping system handles the cart and checkout process, while the Wallet system manages balances, top-ups, and transactions. The Library provides users with access to their purchased games.

The Developer area provides game management and revenue information for developers. The Administration area provides platform-level game management and revenue monitoring.

The Game Lifecycle system manages scheduled releases and allows games to become available when their configured release date is reached.

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

Games can be configured with a scheduled release date. Before release, the game remains unavailable for normal purchasing. When the scheduled release time is reached, the release-processing system updates the game's lifecycle state so that it becomes available to users.

This provides a controlled way to prepare games in advance while automatically managing their availability based on the configured release schedule.

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

PlayGame uses a full-stack Next.js architecture. The application layer handles the marketplace, authentication, shopping, wallet, library, developer dashboard, and administration features.

Drizzle ORM provides the database access layer, while Turso/libSQL is used as the production database. This architecture keeps the application logic and database operations organized while allowing the application to be deployed as a production web application through Vercel.

📁 Project Organization

The project is organized around Next.js application routes, reusable UI components, authentication, database access, and shared application logic. Marketplace, wallet, checkout, developer, administration, and authentication features are separated into their respective application areas, while shared components and backend/database functionality are maintained in dedicated directories.

This organization keeps the application modular and makes individual features easier to maintain and extend.

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

The project is designed as a portfolio application to demonstrate practical full-stack development and the ability to build and deploy a multi-role web application with real business logic.

🔗 Links

Live Application: https://playgame-amber.vercel.app/

GitHub Repository: https://github.com/RizalHB/playgame

📄 License

This project was created as a personal portfolio and learning project.
