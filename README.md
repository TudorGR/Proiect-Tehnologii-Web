# Web Technologies Project - Educational Programming Platform

## Description

This educational platform is designed for high school students who want to learn programming. The application provides a complete environment for teachers, students, and administrators, facilitating the teaching and learning of programming through problem-solving, homework management, and collaboration within classes.

## Features

### For Students

- Solving programming problems
- Viewing and submitting homework
- Participating in classes
- Tracking personal progress

### For Teachers

- Creating and managing classes
- Adding problems and verifying solutions
- Assigning homework to students
- Evaluating solutions and providing feedback

### For Administrators

- Managing users and their roles
- Monitoring platform activity
- Verifying problems before publication
- Importing and exporting problems in CSV format

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js
- **Database**: SQLite3
- **Libraries**: csv-parser, csv-parse, formidable, ejs

## Project Structure

```
├── controllers/         # Business logic for entities
├── css/                 # CSS styles for the interface
├── javascript/          # Frontend scripts
├── pages/               # HTML pages
├── utils/               # Utilities and helper functions
├── C4/                  # Architecture diagrams
├── index.js             # Application entry point
└── server.db            # SQLite database
```

## Installation and Running

### Requirements

- Node.js (v12.x or later)
- npm

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/Proiect-Tehnologii-Web.git
   cd Proiect-Tehnologii-Web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## Authentication

The application supports three types of users:

- **Administrator**: Manages users and content
- **Teacher**: Creates classes, adds problems and homework
- **Student**: Solves problems and submits homework
