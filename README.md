# PlanIt---ToDo-List-Application

# PlanIt – Personal Task Planner

A simple and practical **frontend-only task planning and scheduling web application** built using **HTML, CSS, and Vanilla JavaScript**.

PlanIt helps users organize their daily tasks, schedule future activities, manage priorities, and track their progress. All task data is stored locally in the browser using **LocalStorage**, so no backend or database is required.

---

## 📌 Project Overview

PlanIt combines the simplicity of a to-do list with useful scheduling and productivity features.

The application allows users to:

* Create and manage tasks
* Assign dates and times
* Set task priorities
* Organize tasks into categories
* View tasks using a calendar
* Track upcoming and overdue tasks
* Search and filter tasks
* Mark tasks as completed
* Save data automatically using LocalStorage
* Switch between light and dark themes
* Use a Focus Timer for productive work sessions

The project is completely frontend-based and can be deployed as a static website.

---

## ✨ Features

### 📝 Task Management

* Add new tasks
* Edit existing tasks
* Delete tasks
* Mark tasks as completed
* Mark completed tasks as pending
* Add task descriptions
* Set task date and time

### 📅 Calendar

* View the current month
* Navigate between previous and next months
* Return to today's date
* Highlight the current day
* Select a particular date
* Display tasks associated with selected dates
* Show task indicators on dates containing tasks

### ⏰ Task Scheduling

* Schedule tasks for future dates
* Display upcoming tasks
* Display overdue tasks
* Sort scheduled tasks according to date and time

### 🎯 Priority Management

Tasks can be assigned different priority levels:

* **High**
* **Medium**
* **Low**

This helps users identify important tasks quickly.

### 🗂️ Categories

Tasks can be organized into different categories:

* Study
* Work
* Personal
* Other

### 🔍 Search and Filters

Users can quickly find tasks using:

* Search
* All Tasks
* Today's Tasks
* Upcoming Tasks
* Completed Tasks

### 📊 Progress Tracking

PlanIt provides productivity information based on the user's actual tasks, including:

* Total tasks
* Completed tasks
* Pending tasks
* Upcoming tasks
* Overdue tasks
* Completion progress

### 🌙 Dark Mode

PlanIt supports:

* Light Mode
* Dark Mode

The selected theme is saved using LocalStorage.

### ⏱️ Focus Timer

The Focus Timer helps users maintain concentration during work or study sessions.

A typical session can be:

```text
25 Minutes → Focus
5 Minutes  → Break
```

The timer works completely inside the browser and does not require any external service.

### 💾 LocalStorage

All task information is stored locally in the user's browser.

This allows tasks to remain available after:

* Refreshing the page
* Closing and reopening the browser
* Returning to the application later

No external database is required.

---

## 🛠️ Technologies Used

| Technology            | Purpose                             |
| --------------------- | ----------------------------------- |
| **HTML5**             | Structure of the application        |
| **CSS3**              | Styling and responsive design       |
| **JavaScript (ES6+)** | Application logic and interactivity |
| **LocalStorage**      | Local task data persistence         |

---

## 🚫 Technologies Not Used

This project intentionally does **not** use:

* React
* Angular
* Vue
* Node.js
* Express.js
* MongoDB
* MySQL
* Firebase
* Supabase
* External APIs
* Backend servers
* Package managers
* Build tools

The application is designed to work as a **static frontend project**.

---

## 📁 Project Structure

```text
PlanIt/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   └── icons/
│
└── README.md
```

### File Description

**`index.html`**

Contains the main structure and UI elements of the application.

**`style.css`**

Contains:

* Layout
* Colors
* Typography
* Responsive design
* Light and dark themes
* Component styling

**`script.js`**

Handles:

* Task creation
* Task editing
* Task deletion
* Task completion
* Calendar functionality
* Search
* Filters
* LocalStorage
* Dark mode
* Focus Timer
* Progress calculations

**`assets/`**

Contains project assets such as icons and other static resources.

**`README.md`**

Contains project documentation and setup instructions.

---

## 💻 Requirements

### Software Requirements

Any modern web browser:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

### Development Requirements

For development, you can use:

* Visual Studio Code
* Any modern web browser
* Optional: VS Code Live Server extension

### Hardware Requirements

No special hardware is required.

A normal computer or laptop capable of running a modern web browser is sufficient.

---

## 🚀 Installation and Setup

Since PlanIt is a frontend-only project, no installation of Node.js, npm, or backend software is required.

### Step 1: Download the Project

Download or clone the PlanIt project.

### Step 2: Open the Project

Open the entire `PlanIt` folder in **Visual Studio Code**.

Make sure the project structure looks like:

```text
PlanIt/
├── index.html
├── style.css
├── script.js
├── assets/
└── README.md
```

### Step 3: Run the Application

#### Method 1 – Open Directly

Open:

```text
index.html
```

in your browser.

#### Method 2 – Using Live Server

If you have the Live Server extension installed:

1. Open `index.html`
2. Right-click the file
3. Select **Open with Live Server**
4. The application will open in your browser

Live Server is recommended during development.

---

## 📖 How to Use

### 1. Add a Task

Enter the task information:

* Task title
* Description
* Date
* Time
* Priority
* Category

Click **Add Task** to create the task.

### 2. Complete a Task

When a task is finished, mark it as completed.

The task status and progress information will be updated automatically.

### 3. Edit a Task

Select an existing task, modify its information, and save the changes.

### 4. Delete a Task

Use the delete option to permanently remove a task.

### 5. Schedule a Future Task

Select a future date and time while creating a task.

The task will appear in the upcoming task section.

### 6. Use the Calendar

The calendar allows users to:

* Navigate between months
* Select dates
* View scheduled tasks
* Identify dates containing tasks
* Return to today's date

### 7. Search Tasks

Use the search option to quickly find a specific task.

### 8. Filter Tasks

Tasks can be filtered using:

```text
All
Today
Upcoming
Completed
```

### 9. Change Theme

Switch between:

```text
Light Mode
Dark Mode
```

The selected theme is saved locally.

### 10. Use Focus Timer

Start the Focus Timer when working or studying.

A typical session can be:

```text
25 Minutes → Focus
5 Minutes  → Break
```

---

## 💾 Data Storage

PlanIt uses the browser's **LocalStorage** to store application data.

Information stored locally includes:

```text
Task Title
Description
Date
Time
Priority
Category
Completion Status
Theme Preference
```

The data is stored on the user's device and is not sent to a server.

### Important

Clearing the browser's site data or LocalStorage can remove saved tasks.

---

## 📱 Responsive Design

PlanIt is designed to work across different screen sizes.

Supported devices include:

* Desktop
* Laptop
* Tablet
* Mobile

The interface automatically adjusts according to the available screen width.

---

## 🔐 Privacy

PlanIt does not require:

* User accounts
* Login
* Passwords
* Email addresses
* Backend databases

Task data is stored locally in the user's browser.

Since there is no backend server, task information is not transmitted to a remote database.

---

## ⚠️ Limitations

Because PlanIt is a frontend-only application, it has some limitations.

### Local Data Only

Tasks are stored only on the current browser and device.

They are not automatically synchronized between different devices.

### No User Authentication

The project does not currently provide user accounts or login functionality.

### No Cloud Synchronization

Task data cannot currently be synchronized across multiple devices.

---

## 🌐 Deployment

PlanIt can be deployed using any static hosting platform.

Examples include:

* GitHub Pages
* Netlify
* Vercel
* Cloudflare Pages

No backend server is required.

### GitHub Pages

To deploy using GitHub Pages:

1. Create a GitHub repository.
2. Upload the PlanIt project files.
3. Open **Settings**.
4. Select **Pages**.
5. Select the required branch.
6. Select the project root folder.
7. Save the configuration.
8. GitHub Pages will generate a public website URL.

---

## 🧪 Testing Checklist

### Task Management

* [ ] Add task
* [ ] Edit task
* [ ] Delete task
* [ ] Complete task
* [ ] Uncomplete task
* [ ] Add description
* [ ] Set date
* [ ] Set time
* [ ] Set priority
* [ ] Set category

### Calendar

* [ ] Current date highlighted
* [ ] Previous month works
* [ ] Next month works
* [ ] Today button works
* [ ] Date selection works
* [ ] Tasks appear on correct dates

### Storage

* [ ] Tasks remain after refresh
* [ ] Tasks remain after reopening browser
* [ ] Dark mode preference is saved

### Search and Filters

* [ ] Search works
* [ ] All filter works
* [ ] Today filter works
* [ ] Upcoming filter works
* [ ] Completed filter works

### Responsive Design

* [ ] Desktop layout works
* [ ] Tablet layout works
* [ ] Mobile layout works

### Focus Timer

* [ ] Timer starts correctly
* [ ] Timer pauses correctly
* [ ] Timer resets correctly
* [ ] Focus session works
* [ ] Break session works

---

## 🔮 Future Improvements

Possible future improvements include:

* User authentication
* Cloud synchronization
* Cross-device task synchronization
* Recurring tasks
* Drag-and-drop task organization
* Export and import tasks
* CSV/JSON export
* Productivity streaks
* Custom Focus Timer presets
* Progressive Web App (PWA) support
* Offline support with Service Workers

These features can be added in future versions according to project requirements.

---

## 🎯 Project Goals

The main goals of PlanIt are:

1. Build a practical productivity application.
2. Learn and demonstrate frontend development.
3. Practice JavaScript DOM manipulation.
4. Understand browser LocalStorage.
5. Implement calendar and scheduling logic.
6. Create a responsive user interface.
7. Build a project that can be deployed as a static website.
8. Keep the code simple and understandable.

---

## 📚 Learning Outcomes

Through this project, developers can practice:

* HTML semantic structure
* CSS layouts
* Responsive web design
* JavaScript fundamentals
* DOM manipulation
* Event handling
* Arrays and objects
* Date and time handling
* LocalStorage
* Form handling
* Search and filtering
* Calendar generation
* UI state management
* Static website deployment

---

## 📄 License

This project is created for **learning and educational purposes**.

You are free to modify and improve the project according to your requirements.

---

## 👨‍💻 Project Information

**Project Name:** PlanIt
**Project Type:** Personal Task Planner
**Application Type:** Frontend Web Application
**Technologies:** HTML5, CSS3, Vanilla JavaScript
**Storage:** Browser LocalStorage
**Backend:** None
**Deployment:** Static Hosting
