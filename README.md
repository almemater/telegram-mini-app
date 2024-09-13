# MindmInt Memory Game Project

This project is a memory game built with Next.js, TypeScript, and MongoDB. It includes user profiles, game records, and a leaderboard.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

## Installation

1. **Clone the repository:**

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

## Configuration

1. **Environment Variables:**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   MONGODB_URI=<YOUR MONGO URI>
   ```

## Running the Project

1. **Start the development server:**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

2. **Open your browser and navigate to:**

   ```
   http://localhost:3000
   ```

## Project Structure

- components: Contains React components used throughout the project.
- context: Contains context providers for global user state management.
- libs: Contains utility functions and types.
- models: Contains Mongoose models for MongoDB.
- public: Contains static assets.

## Usage

### User Profile

- View user profile information.
- View recent game activity.

### Memory Game

- Start a new game.
- Flip cards to find matching pairs.
- View game statistics such as score, time taken, and flips.

### Leaderboard

- View the leaderboard with user rankings based on points.
