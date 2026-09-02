🎮 PlayGame — Full-Stack Game Marketplace

📋 Table of Contents

About the Project

Live Demo

Project Background

Project Objectives

Key Features

Marketplace Workflow

Application Modules

User Roles

Game Lifecycle

Wallet and Payment System

Revenue Distribution

Technology Stack

System Architecture

Project Structure

Database

Environment Configuration

Installation

Running the Application

Database Commands

Deployment

Security Considerations

Future Improvements

Project Purpose

Contributing

License

📌 About the Project

PlayGame is a full-stack web-based game marketplace designed to demonstrate the development of a modern digital game-commerce platform.

The application allows users to discover games, manage their accounts, maintain a digital wallet, purchase games, and access purchased games through their personal library.

The platform also includes dedicated functionality for developers and administrators, creating a multi-role marketplace environment.

PlayGame was built to demonstrate practical full-stack development concepts including:

Authentication and authorization

Role-based access control

Game catalog management

Shopping cart functionality

Checkout and purchasing

Digital wallet management

Game ownership and library management

Developer revenue tracking

Platform revenue tracking

Game release lifecycle management

Database migrations

Production deployment

The application is built using Next.js, React, TypeScript, Drizzle ORM, and Turso/libSQL, with production deployment through Vercel.

🌐 Live Demo

🚀 Try PlayGame

Live Application:

https://playgame-amber.vercel.app/

The production deployment provides access to the PlayGame marketplace through a web browser.

You can explore the application's main marketplace interface, authentication flow, game catalog, cart, checkout, wallet, library, developer area, and administration functionality according to the user's assigned role.

🎯 Project Objectives

The main objectives of PlayGame are:

Build a complete full-stack marketplace

Demonstrate the development of a production-oriented web application rather than a simple frontend prototype.

Implement user authentication

Provide account registration, login, password authentication, and account-related functionality.

Implement role-based authorization

Separate functionality between gamers, developers, and administrators.

Create a digital game marketplace

Allow users to browse and purchase digital games.

Implement a wallet system

Allow users to maintain wallet balances and perform wallet top-ups.

Implement a complete purchase workflow

Connect cart, pricing, wallet balance, payment processing, ownership, and library functionality.

Implement marketplace revenue distribution

Track developer revenue and platform revenue from completed purchases.

Implement game lifecycle management

Support scheduled, released, and other game lifecycle states.

Deploy the application to production

Demonstrate deployment using Vercel and a cloud-hosted Turso database.

🚀 Key Features

🎮 1. Game Marketplace

Users can browse the available game catalog and explore individual game information.

The marketplace provides information such as:

Game title

Description

Pricing

Release information

Developer/studio information

Game media

Pre-order information

Game availability

🔐 2. Authentication

PlayGame includes an authentication system for user accounts.

The authentication workflow supports:

User registration

User login

Password hashing

Email verification state

Account status

Role-based access

Two-factor authentication state

Passwords are stored as hashes rather than plain-text passwords.

👤 3. Role-Based Access Control

The platform supports different application roles.

                    PlayGame
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Gamer        Developer     Admin
          │            │            │
          ▼            ▼            ▼
     Marketplace   Game Tools   Management
     Purchases     Revenue      Platform
     Wallet        Dashboard    Dashboard
     Library       Games        Games

Different roles receive access to different areas of the application.

🛒 4. Shopping Cart

Users can add games to their shopping cart before completing a purchase.

The cart provides a structured checkout workflow:

Game
 ↓
Add to Cart
 ↓
Shopping Cart
 ↓
Price Calculation
 ↓
Checkout
 ↓
Wallet Payment
 ↓
Game Ownership
 ↓
Library

💳 5. Checkout

The checkout process validates the purchase before completing the transaction.

The system handles:

Cart contents

Game pricing

Final price

Wallet balance

Ownership validation

Transaction processing

Revenue allocation

Library ownership

💰 6. Digital Wallet

PlayGame includes a digital wallet system.

Users can:

View their wallet balance

Add wallet funds

Review wallet transactions

Use wallet funds during checkout

The wallet system is integrated with the purchase workflow.

📚 7. Game Library

After purchasing a game, ownership is recorded in the user's library.

The library provides a centralized location for games owned by the user.

The ownership system also prevents duplicate ownership of the same game.

👨‍💻 8. Developer Dashboard

Developers have access to functionality related to their games and marketplace revenue.

Developer functionality includes:

Game management

Game information

Release lifecycle

Revenue information

Developer earnings

The platform tracks the developer's share of completed purchases separately from the platform's share.

🛡️ 9. Admin Dashboard

Administrators have access to platform-level management functionality.

The administration area provides functionality for managing and monitoring marketplace information.

Admin functionality includes areas such as:

Game management

Platform information

Revenue monitoring

User-related administration

Marketplace management

📈 10. Revenue Tracking

The marketplace separates purchase revenue into:

Completed Purchase
       │
       ▼
 Final Purchase Price
       │
       ├───────────────┐
       ▼               ▼
 Developer Share   Platform Share
       │               │
       ▼               ▼
 Developer       PlayGame Platform
   Revenue            Revenue

The current implementation allocates:

Developer = 90%
Platform  = 10%

Revenue amounts are calculated from the final purchase price.

⏰ 11. Game Release Lifecycle

PlayGame supports game lifecycle management for scheduled and released games.

Games can transition through lifecycle states based on their release information.

The application includes a release-processing endpoint:

/api/cron/release-games

This endpoint is designed to process games whose release conditions have been reached.

🔄 Marketplace Workflow

The primary marketplace workflow is:

                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Browse Games    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Game Details    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Add to Cart   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Checkout     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Wallet Payment  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Purchase        │
                    │ Completed       │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ Game Ownership  │       │ Revenue         │
       │                 │       │ Distribution    │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ User Library    │       │ Developer /     │
       │                 │       │ Platform        │
       └─────────────────┘       │ Revenue         │
                                 └─────────────────┘

🧩 Application Modules

PlayGame
│
├── 🏠 Marketplace
│   ├── Game Catalog
│   ├── Game Details
│   └── Game Discovery
│
├── 🔐 Authentication
│   ├── Login
│   ├── Registration
│   └── Account Management
│
├── 🛒 Shopping
│   ├── Cart
│   └── Checkout
│
├── 💰 Wallet
│   ├── Balance
│   ├── Top-Ups
│   └── Transactions
│
├── 📚 Library
│   └── Purchased Games
│
├── 👨‍💻 Developer
│   ├── Developer Dashboard
│   ├── Games
│   └── Revenue
│
├── 🛡️ Administration
│   ├── Admin Dashboard
│   ├── Game Management
│   └── Platform Revenue
│
└── ⏰ Game Lifecycle
    └── Scheduled Release Processing

👥 User Roles

🎮 Gamer

Gamers are the primary marketplace users.

They can:

Browse games

View game details

Add games to cart

Checkout

Manage their wallet

Purchase games

View their library

👨‍💻 Developer

Developers can manage their marketplace presence and monitor game-related revenue.

Developer functionality includes:

Managing games

Managing release information

Monitoring revenue

Viewing developer earnings

🛡️ Administrator

Administrators manage and monitor the platform.

Administrative functionality includes:

Platform management

Game management

Revenue monitoring

Administrative dashboards

⏰ Game Lifecycle

PlayGame supports scheduled game releases.

The lifecycle can be represented as:

Game Creation
      │
      ▼
   Scheduled
      │
      │ Release Date Reached
      ▼
   Released
      │
      ▼
Available for Marketplace Activity

The application provides a server-side release processing endpoint:

GET /api/cron/release-games

The endpoint can be triggered by a scheduled job in the production environment.

💰 Wallet and Payment System

The wallet system provides users with an internal balance that can be used for purchases.

The general workflow is:

Wallet Top-Up
      │
      ▼
Wallet Balance
      │
      ▼
Checkout
      │
      ▼
Purchase Amount
      │
      ▼
Wallet Deduction
      │
      ▼
Purchase Completed

Wallet-related records are stored in the database and linked to the corresponding user and transaction information.

The system also includes idempotency-related handling for wallet top-up operations.

📊 Revenue Distribution

PlayGame separates marketplace revenue between the developer and platform.

For a completed purchase:

Final Purchase Price
        │
        ▼
 ┌──────┴──────┐
 │             │
 ▼             ▼
90%           10%
 │             │
 ▼             ▼
Developer     Platform
Revenue       Revenue

The implementation calculates the developer amount and platform amount from the final purchase price.

This allows the application to provide separate revenue information for:

Developers

Platform administrators

🛠️ Technology Stack

Technology

Purpose

Next.js

Full-stack React framework

React

User interface

TypeScript

Type-safe application development

Tailwind CSS

UI styling

Drizzle ORM

Database access and ORM

Drizzle Kit

Database migrations and development tools

Turso / libSQL

Production database

@libsql/client

Turso database connectivity

Node.js

JavaScript runtime

tsx

TypeScript execution

Vercel

Production deployment

Git

Version control

GitHub

Source code hosting

🏗️ System Architecture

PlayGame uses a full-stack Next.js architecture.

┌───────────────────────────────────────────────┐
│                    User                       │
│                                               │
│             Web Browser / Client              │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│                  Next.js                      │
│                                               │
│  ┌────────────────┐   ┌────────────────────┐ │
│  │ React UI       │   │ Server Components  │ │
│  │                │   │ & Server Logic     │ │
│  └────────────────┘   └────────────────────┘ │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │ API Routes / Application Services       │ │
│  └──────────────────────┬──────────────────┘ │
└─────────────────────────┼─────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────┐
│                  Drizzle ORM                  │
│                                               │
│       Type-Safe Database Queries              │
│       Transactions / Data Access              │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────┐
│                Turso / libSQL                 │
│                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ Users       │ │ Games       │ │ Wallets │ │
│  ├─────────────┤ ├─────────────┤ ├─────────┤ │
│  │ Orders      │ │ Library     │ │ Revenue │ │
│  ├─────────────┤ ├─────────────┤ ├─────────┤ │
│  │ Cart        │ │ Developers  │ │ Media   │ │
│  └─────────────┘ └─────────────┘ └─────────┘ │
└───────────────────────────────────────────────┘

📁 Project Structure

The main project structure is:

playgame/
│
├── app/
│   ├── admin/
│   ├── api/
│   ├── cart/
│   ├── checkout/
│   ├── developer/
│   ├── library/
│   ├── login/
│   ├── signup/
│   ├── wallet/
│   └── ...
│
├── components/
│   └── ...
│
├── lib/
│   ├── auth/
│   ├── database/
│   │   ├── migrations/
│   │   ├── database.ts
│   │   ├── schema/
│   │   └── seed/
│   │
│   └── ...
│
├── public/
│   └── ...
│
├── drizzle.config.ts
├── instrumentation.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── .gitignore
└── README.md

The exact project structure may evolve as new features are added.

🗄️ Database

PlayGame uses Turso/libSQL for the production database.

The application uses Drizzle ORM for type-safe database access and Drizzle Kit for schema migrations.

The database contains data related to areas such as:

Users
Roles
Developer Profiles
Games
Game Media
Cart
Orders / Purchases
Game Ownership
Library
Wallets
Wallet Transactions
Wallet Top-Ups
Revenue
Game Lifecycle

Database schema changes are managed through versioned migration files.

Example migration workflow:

Schema Change
     │
     ▼
Drizzle Kit
     │
     ▼
Migration File
     │
     ▼
Turso / libSQL
     │
     ▼
Updated Production Schema

🔧 Environment Configuration

Environment variables are required for database connectivity and application configuration.

Create a local .env file when running the application locally.

Example:

DATABASE_URL=file:./playgame.db

NEXT_PUBLIC_APP_URL=http://localhost:3000

CRON_SECRET=your-local-cron-secret

For production, the application uses Turso:

TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

Never commit authentication tokens, passwords, or other secrets to GitHub.

Production secrets should be configured through the deployment platform's environment-variable management system.

⚙️ Installation

Requirements

Before running PlayGame locally, install:

Node.js

npm

Git

A modern web browser is also recommended.

1. Clone the Repository

git clone https://github.com/RizalHB/playgame.git

Move into the project directory:

cd playgame

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a local .env file:

DATABASE_URL=file:./playgame.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your-local-cron-secret

Use appropriate local credentials for your development environment.

▶️ Running the Application

Start the Next.js development server:

npm run dev

The application will normally be available at:

http://localhost:3000

Open the URL in a modern browser.

🗃️ Database Commands

PlayGame uses Drizzle Kit for database development and migrations.

Generate a Migration

npm run db:generate

Apply Migrations

npm run db:migrate

Seed the Database

npm run db:seed

Open Drizzle Studio

npm run db:studio

🚀 Deployment

The production application is deployed using Vercel.

The production architecture is:

GitHub
   │
   │ Push to main
   ▼
Vercel
   │
   │ Next.js Build
   ▼
Production Application
   │
   │ Database Connection
   ▼
Turso / libSQL

Production environment variables are configured through Vercel.

The production database uses:

Turso
AWS ap-northeast-1
Tokyo

The deployment is designed to provide a geographically suitable database region for users in Indonesia and surrounding regions.

🔐 Security Considerations

PlayGame includes several security-oriented practices.

Password Security

User passwords are hashed before being stored in the database.

Plain-text passwords should never be stored.

Environment Secrets

Database authentication tokens and application secrets are stored in environment variables rather than committed to the repository.

Role-Based Authorization

Different user roles have different access permissions.

Database Access

Database operations are performed server-side through the application's database layer.

Ownership Validation

The purchase flow validates game ownership to prevent users from purchasing the same game multiple times.

Wallet Integrity

Wallet and transaction operations are handled through server-side application logic.

PlayGame is a portfolio project and should not be considered a production financial platform without additional security auditing, payment-provider integration, monitoring, and compliance controls.

🚧 Future Improvements

Potential improvements include:

Real payment gateway integration

Stripe or other payment-provider integration

More advanced authentication

OAuth / social login

Email verification delivery

Password reset workflow

Two-factor authentication completion

Game reviews and ratings

Wishlist functionality

Game search and filtering

Categories and genres

Developer game publishing workflow

Game file delivery

Download management

Order history

Refund system

Promotional discounts

Coupon system

Featured games

Recommendation system

Advanced admin analytics

Automated testing

End-to-end testing

CI/CD pipeline

Application monitoring

Error tracking

Rate limiting

Improved API documentation

Custom production domain

Improved mobile responsiveness

CDN-based game media delivery

🎓 Project Purpose

PlayGame was developed as a full-stack portfolio project to demonstrate practical software engineering skills across frontend development, backend application logic, database design, authentication, marketplace workflows, and cloud deployment.

The project goes beyond a simple CRUD application by implementing interconnected business workflows:

Authentication
      ↓
Marketplace
      ↓
Cart
      ↓
Checkout
      ↓
Wallet
      ↓
Purchase
      ↓
Ownership
      ↓
Library
      ↓
Revenue Distribution
      ↓
Developer / Admin Analytics

This architecture demonstrates how multiple application domains can be integrated into a single full-stack system.

🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

Fork the repository.

Create a feature branch.

Implement your changes.

Test the changes.

Commit your changes.

Push the branch.

Open a Pull Request.

Example:

git checkout -b feature/new-feature

git add .

git commit -m "feat: add new feature"

git push origin feature/new-feature

📄 License

This project does not currently specify an open-source license.

If you intend to distribute PlayGame as open-source software, add an appropriate LICENSE file and update this section accordingly.

👨‍💻 Project Information

Information

Details

Project Name

PlayGame

Application Type

Full-Stack Game Marketplace

Frontend

Next.js / React

Language

TypeScript

ORM

Drizzle ORM

Database

Turso / libSQL

Database Region

Tokyo, AWS ap-northeast-1

Authentication

Custom Authentication System

Marketplace

Digital Game Marketplace

Payment System

Internal Wallet / Checkout

User Roles

Gamer, Developer, Administrator

Developer Revenue

90%

Platform Revenue

10%

Deployment

Vercel

Repository

GitHub

Live Demo

https://playgame-amber.vercel.app/

⭐ Conclusion

PlayGame is a full-stack game marketplace demonstrating the integration of modern web technologies with real-world marketplace business logic.

The application combines:

Next.js
   +
React
   +
TypeScript
   +
Drizzle ORM
   +
Turso / libSQL
   +
Vercel

into a single application supporting:

🎮 Game Marketplace
🔐 Authentication
👥 Role-Based Access
🛒 Shopping Cart
💳 Checkout
💰 Digital Wallet
📚 Game Library
👨‍💻 Developer Dashboard
🛡️ Admin Dashboard
📊 Revenue Tracking
⏰ Game Release Lifecycle

The project demonstrates practical experience with full-stack architecture, relational database design, authentication, business logic, financial-style transaction flows, role-based systems, database migrations, and cloud deployment.

🚀 Live Demo

https://playgame-amber.vercel.app/

Explore the application and experience the PlayGame marketplace directly in the browser.
