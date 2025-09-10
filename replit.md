# Expense Tracker

## Overview

A complete expense tracking web application built with vanilla HTML, CSS, and JavaScript. The app allows users to add, categorize, filter, and delete expenses while providing real-time summaries and breakdowns by category. It features a modern card-based design with local storage persistence for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without any frameworks
- **Component-based Structure**: Organized into logical sections (form, list, summary, filters) using semantic HTML
- **Class-based JavaScript**: Uses ES6 class syntax (`ExpenseTracker`) for better code organization and encapsulation
- **Event-driven Architecture**: Centralized event handling for form submissions, filters, and user interactions

### Data Management
- **Local Storage Persistence**: All expense data is stored in the browser's localStorage for data persistence across sessions
- **In-memory State**: Active expense list maintained in JavaScript class instance for real-time updates
- **JSON Serialization**: Expenses stored as JSON strings in localStorage for easy retrieval and manipulation

### User Interface Design
- **Card-based Layout**: Modern design using card components for form, list, and summary sections
- **Responsive Design**: Mobile-first approach with flexible layouts that adapt to different screen sizes
- **CSS Grid/Flexbox**: Modern layout techniques for consistent spacing and alignment
- **Gradient Background**: Visual appeal with CSS gradient backgrounds and shadow effects

### Data Structure
- **Expense Object Model**: Each expense contains:
  - Name (string)
  - Amount (number with decimal precision)
  - Category (predefined options: Food, Transport, Bills, Entertainment, Others)
  - Date (automatically generated timestamp)
  - Unique ID (for deletion and tracking)

### Filtering and Search
- **Category Filtering**: Dropdown filter to show expenses by specific categories
- **Date Filtering**: Time-based filtering options for viewing expenses by date ranges
- **Real-time Updates**: Filters applied immediately without page refresh

### Validation and Error Handling
- **Client-side Validation**: Form validation for required fields and data types
- **Input Sanitization**: Proper handling of user input to prevent errors
- **Graceful Degradation**: Error handling for localStorage unavailability

## External Dependencies

### Browser APIs
- **localStorage API**: For persistent data storage in the browser
- **DOM API**: For dynamic content manipulation and event handling
- **Date API**: For timestamp generation and date formatting

### No External Libraries
- **Framework-free**: Built entirely with vanilla JavaScript, HTML, and CSS
- **No CDN Dependencies**: All code is self-contained within the project files
- **No Build Tools**: Direct browser execution without compilation or bundling

### Browser Requirements
- **Modern Browser Support**: Requires ES6+ support for class syntax and modern JavaScript features
- **localStorage Support**: Essential for data persistence functionality
- **CSS3 Support**: For modern styling features like gradients, flexbox, and grid