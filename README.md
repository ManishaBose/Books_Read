# Book Showcase Website

## Overview
This website is a personal book showcase that displays my book collection, reviews, and ratings. It allows visitors to browse through my reading list, view book details, and read my personal takes on various books.

## Technologies Used

### Frontend
- **Embedded Javascript (EJS)**: For structuring the web content, client-side interactivity and generating HTML markup with plain JavaScript.
- **CSS**: For styling the website, including responsive design.
- **Bootstrap 5**: Used for its grid system and pre-built components to ensure responsiveness and consistent styling across devices.

### Backend
- **Node.js**: The runtime environment for the server.
- **Express.js**: Web application framework for Node.js, used to build the server-side of the application.

### Database
- **PostgreSQL**: An open-source object-relational database system used to store book information, reviews, and user data.
- **node-postgres (pg)**: Non-blocking PostgreSQL client for Node.js, used to interact with the PostgreSQL database from the Node.js application.

### APIs
- **Open Library API**: Used to fetch book cover images and additional book metadata.

### Deployment
- **Render**: Cloud application hosting service used for deploying and hosting the application. Render provides easy deployment from Git repositories and supports PostgreSQL databases.

## Features
- Display of book collection with cover images, titles, and authors
- Detailed view for each book including my personal review, rating and notes
- Responsive design that works on desktop and mobile devices
- Integration with Open Library API for book cover images

## Setup and Installation
1. Clone the repository:
````bash
git clone https://github.com/ManishaBose/Books_Read.git
````
2. Install the dependencies:
````bash
npm install
````
3. Create a .env file in the rool of the project and add the following lines:
````bash
DATABASE_URL="postgresql://world_owner:E0TYLo2RWuUz@ep-delicate-queen-a1gxmygl.ap-southeast-1.aws.neon.tech/books_read?sslmode=require"
PORT="3000"
````
5. Run the application:
````bash
node index.js
````
6. Usage:
Visit http://localhost:3000 in your browser to start the quiz.