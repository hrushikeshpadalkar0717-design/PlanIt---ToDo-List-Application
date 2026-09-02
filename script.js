/**
 * PlanIt - Personal Task Planner
 * Vanilla JavaScript Implementation
 */

// Global State
let tasks = [];
let currentFilter = 'all';
let searchQuery = '';
let currentCalendarDate = new Date(); // Represents current month/year being viewed in calendar
let selectedCalendarDate = new Date(); // Represents user clicked day in calendar
let editingTaskId = null;
let taskToDeleteId = null;

// Pomodoro Timer State
let pomoTimerInterval = null;
let pomoSecondsLeft = 25 * 60;
let pomoTotalSeconds = 25 * 60;
let pomoIsRunning = false;
let pomoMode = 'work'; // 'work' or 'break'

// Initial Execution on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadTasks();
    initHeaderAndGreeting();
    setupEventListeners();
    renderAll();
    initPomodoro();
});

/* ==========================================
   THEME & LOCAL STORAGE MANAGEMENT
   ========================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('planit_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButtonUI(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('planit_theme', newTheme);
    updateThemeButtonUI(newTheme);
    showToast(`Switched to ${newTheme} mode`);
}

function updateThemeButtonUI(theme) {
    const btnText = document.getElementById('theme-btn-text');
    const btnIcon = document.querySelector('#theme-toggle-btn .material-symbols-outlined');
    if (btnText && btnIcon) {
        if (theme === 'dark') {
            btnText.textContent = 'Light';
            btnIcon.textContent = 'light_mode';
        } else {
            btnText.textContent = 'Dark';
            btnIcon.textContent = 'dark_mode';
        }
    }
}

function saveTasks() {
    localStorage.setItem('planit_tasks', JSON.stringify(tasks));
    renderAll();
}

function loadTasks() {
    const stored = localStorage.getItem('planit_tasks');
    if (stored) {
        try {
            tasks = JSON.parse(stored);
        } catch (e) {
            console.error('Failed to parse tasks from LocalStorage', e);
            tasks = [];
        }
    } else {
        // Populate starter sample tasks if brand new
        const todayStr = formatDateToYYYYMMDD(new Date());

        // Create an upcoming date (3 days from now)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 3);
        const futureStr = formatDateToYYYYMMDD(futureDate);

        tasks = [{
                id: 'task-1',
                title: 'Study DSA Data Structures',
                description: 'Review binary search trees and heap algorithms.',
                date: todayStr,
                time: '19:00',
                priority: 'High',
                category: 'Study',
                completed: false,
                repeat: 'none',
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-2',
                title: 'Complete DBMS Assignment',
                description: 'Write SQL queries for database normalization lab.',
                date: todayStr,
                time: '21:00',
                priority: 'Medium',
                category: 'Study',
                completed: false,
                repeat: 'none',
                createdAt: new Date().toISOString()
            },
            {
                id: 'task-3',
                title: 'Prepare Project Presentation',
                description: 'Design slides for PlanIt application showcase.',
                date: futureStr,
                time: '10:00',
                priority: 'High',
                category: 'Work',
                completed: false,
                repeat: 'none',
                createdAt: new Date().toISOString()
            }
        ];
        saveTasks();
    }
}

/* ==========================================
   HEADER & GREETING
   ========================================== */
function initHeaderAndGreeting() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('header-date').textContent = now.toLocaleDateString('en-US', options);

    const hour = now.getHours();
    let greetingText = 'Good evening';
    if (hour >= 5 && hour < 12) {
        greetingText = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good afternoon';
    }
    document.getElementById('greeting-title').textContent = greetingText;
}

/* ==========================================
   EVENT LISTENERS SETUP
   ========================================== */
function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    // Search Input
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTasks();
    });

    // Filter Pills
    document.querySelectorAll('.filter-pills .btn-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-pills .btn-pill').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        });
    });

    // Open Modal Add Task
    document.getElementById('open-add-modal-btn').addEventListener('click', () => openTaskModal());
    document.getElementById('mnav-add').addEventListener('click', () => openTaskModal());

    // Close Modal
    document.getElementById('close-modal-btn').addEventListener('click', closeTaskModal);
    document.getElementById('cancel-task-btn').addEventListener('click', closeTaskModal);

    // Form Submission
    document.getElementById('task-form').addEventListener('submit', handleTaskFormSubmit);

    // Priority radio button UI update
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.priority-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Calendar Controls
    document.getElementById('prev-month-btn').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month-btn').addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Delete Modal Controls
    document.getElementById('close-delete-modal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancel-delete-btn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', confirmDeleteTask);

    // Mobile Bottom Nav Buttons
    document.getElementById('mnav-tasks').addEventListener('click', () => {
        setActiveMobileNav('mnav-tasks');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.getElementById('mnav-calendar').addEventListener('click', () => {
        setActiveMobileNav('mnav-calendar');
        document.querySelector('.right-column').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('mnav-focus').addEventListener('click', () => {
        setActiveMobileNav('mnav-focus');
        document.querySelector('.pomodoro-display').scrollIntoView({ behavior: 'smooth' });
    });
}

function setActiveMobileNav(id) {
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById(id);

    if (btn) {
        btn.classList.add('active');
    }
}

/* ==========================================
   RENDER ALL COMPONENTS
   ========================================== */
function renderAll() {
    renderStats();
    renderProgress();
    renderTasks();
    renderUpcomingTasks();
    renderCalendar();
    updatePomodoroTaskDropdown();
}

/* ==========================================
   TASK OPERATIONS (CRUD)
   ========================================== */
function handleTaskFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('task-title-input').value.trim();
    const description = document.getElementById('task-desc-input').value.trim();
    const date = document.getElementById('task-date-input').value;
    const time = document.getElementById('task-time-input').value;

    const priorityRadio = document.querySelector('input[name="priority"]:checked');
    const priority = priorityRadio ? priorityRadio.value : 'Medium';

    const category = document.getElementById('task-category-select').value;
    const repeat = document.getElementById('task-repeat-select').value;

    if (!title || !date) {
        showToast('Please fill in required fields.', 'error');
        return;
    }

    if (editingTaskId) {
        // Edit existing task
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                description,
                date,
                time,
                priority,
                category,
                repeat
            };
            showToast('Task updated successfully!');
        }
    } else {
        // Create new task
        const newTask = {
            id: 'task-' + Date.now(),
            title,
            description,
            date,
            time,
            priority,
            category,
            completed: false,
            repeat,
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        showToast('Task created successfully!');
    }

    saveTasks();
    closeTaskModal();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        if (task.completed) {
            showToast('Task marked as completed! 🎉');
        }
    }
}

function openTaskModal(task = null) {
    const modal = document.getElementById('task-modal');
    const heading = document.getElementById('modal-heading');
    const form = document.getElementById('task-form');
    form.reset();

    // Reset Priority Pills UI
    document.querySelectorAll('.priority-option').forEach(o => o.classList.remove('selected'));

    if (task) {
        editingTaskId = task.id;
        heading.textContent = 'Edit Task';
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-title-input').value = task.title;
        document.getElementById('task-desc-input').value = task.description || '';
        document.getElementById('task-date-input').value = task.date;
        document.getElementById('task-time-input').value = task.time || '';
        document.getElementById('task-category-select').value = task.category || 'Study';
        document.getElementById('task-repeat-select').value = task.repeat || 'none';

        // Priority
        const prio = task.priority || 'Medium';
        const radio = document.querySelector(`input[name="priority"][value="${prio}"]`);
        if (radio) {
            radio.checked = true;
            radio.closest('.priority-option').classList.add('selected');
        }
    } else {
        editingTaskId = null;
        heading.textContent = 'New Task';
        document.getElementById('task-id').value = '';

        // Default to today's date
        document.getElementById('task-date-input').value = formatDateToYYYYMMDD(new Date());

        // Default priority Medium
        const defaultPrioLabel = document.getElementById('prio-med-label');
        if (defaultPrioLabel) {
            defaultPrioLabel.classList.add('selected');
            const rad = defaultPrioLabel.querySelector('input');
            if (rad) rad.checked = true;
        }
    }

    modal.classList.add('active');
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.remove('active');
    editingTaskId = null;
}

function promptDeleteTask(id) {
    taskToDeleteId = id;
    document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.remove('active');
    taskToDeleteId = null;
}

function confirmDeleteTask() {
    if (taskToDeleteId) {
        tasks = tasks.filter(t => t.id !== taskToDeleteId);
        saveTasks();
        showToast('Task deleted');
        closeDeleteModal();
    }
}

/* ==========================================
   RENDER TASK LIST & FILTERS
   ========================================== */
function renderTasks() {
    const container = document.getElementById('task-list-container');
    const emptyState = document.getElementById('tasks-empty-state');
    const titleElem = document.getElementById('task-list-title');

    let filtered = [...tasks];
    const todayStr = formatDateToYYYYMMDD(new Date());

    // Filter selection
    if (currentFilter === 'today') {
        titleElem.textContent = "Today's Tasks";
        filtered = filtered.filter(t => t.date === todayStr);
    } else if (currentFilter === 'upcoming') {
        titleElem.textContent = "Upcoming Tasks";
        filtered = filtered.filter(t => t.date > todayStr && !t.completed);
    } else if (currentFilter === 'completed') {
        titleElem.textContent = "Completed Tasks";
        filtered = filtered.filter(t => t.completed);
    } else {
        titleElem.textContent = "All Tasks";
    }

    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.title.toLowerCase().includes(searchQuery) ||
            (t.description && t.description.toLowerCase().includes(searchQuery))
        );
    }

    // Sort tasks: pending first, then by date, then time
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.time || '').localeCompare(b.time || '');
    });

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        if (searchQuery) {
            emptyState.textContent = `No tasks matching "${searchQuery}".`;
        } else if (currentFilter === 'today') {
            emptyState.textContent = 'No tasks scheduled for today.';
        } else if (currentFilter === 'upcoming') {
            emptyState.textContent = 'No upcoming future tasks.';
        } else if (currentFilter === 'completed') {
            emptyState.textContent = 'No completed tasks yet.';
        } else {
            emptyState.textContent = 'Nothing here yet. Add your first task.';
        }
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = filtered.map(t => createTaskItemHTML(t)).join('');

    // Attach event listeners to task elements
    filtered.forEach(t => {
        const itemElem = document.getElementById(`task-item-${t.id}`);
        if (!itemElem) return;

        // Checkbox click
        const cb = itemElem.querySelector('.task-checkbox-wrap');

        if (cb) {
            cb.addEventListener('click', () => toggleTask(t.id));
        }

        // Edit button
        const editBtn = itemElem.querySelector('.edit-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => openTaskModal(t));
        }

        // Delete button
        const delBtn = itemElem.querySelector('.delete-btn');

        if (delBtn) {
            delBtn.addEventListener('click', () => promptDeleteTask(t.id));
        }
    });
}

function createTaskItemHTML(task) {
    const isOverdue = checkIfOverdue(task);
    const formattedTime = task.time ? formatTime12hr(task.time) : '';
    const formattedDate = formatDateDisplay(task.date);

    let priorityClass = 'badge-priority-medium';
    if (task.priority === 'High') priorityClass = 'badge-priority-high';
    if (task.priority === 'Low') priorityClass = 'badge-priority-low';

    return `
    <div class="task-item ${task.completed ? 'completed' : ''}" id="task-item-${task.id}">
      <div class="task-checkbox-wrap" aria-label="Toggle completed">
        <div class="custom-checkbox">
          ${task.completed ? '<span class="material-symbols-outlined" style="font-size: 14px;">check</span>' : ''}
        </div>
      </div>

      <div class="task-content">
        <div class="task-title-line">
          <span class="task-title">${escapeHTML(task.title)}</span>
          ${isOverdue ? '<span class="badge badge-overdue">OVERDUE</span>' : ''}
          <span class="badge ${priorityClass}">${task.priority}</span>
          ${task.category ? `<span class="badge badge-category">${escapeHTML(task.category)}</span>` : ''}
        </div>

        ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}

        <div class="task-meta">
          <span class="task-date">
            <span class="material-symbols-outlined" style="font-size: 14px;">calendar_today</span>
            ${formattedDate}
          </span>
          ${formattedTime ? `
            <span class="task-time">
              <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
              ${formattedTime}
            </span>
          ` : ''}
          ${task.repeat && task.repeat !== 'none' ? `
            <span class="task-repeat">
              <span class="material-symbols-outlined" style="font-size: 14px;">repeat</span>
              ${task.repeat}
            </span>
          ` : ''}
        </div>
      </div>

      <div class="task-actions">
        <button class="btn-icon edit-btn" aria-label="Edit task" title="Edit Task">
          <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
        </button>
        <button class="btn-icon delete-btn" aria-label="Delete task" title="Delete Task">
          <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
        </button>
      </div>
    </div>
  `;
}

/* ==========================================
   UPCOMING TASKS CARD
   ========================================== */
function renderUpcomingTasks() {
  const container = document.getElementById('upcoming-list-container');
  const emptyState = document.getElementById('upcoming-empty-state');
  const todayStr = formatDateToYYYYMMDD(new Date());

  const upcoming = tasks
    .filter(t => !t.completed && t.date > todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));

  if (upcoming.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  // Group or render top upcoming tasks (limit to 5)
  const displayUpcoming = upcoming.slice(0, 5);

  container.innerHTML = displayUpcoming.map(t => {
    const dateObj = new Date(t.date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formattedTime = t.time ? formatTime12hr(t.time) : '';

    return `
      <div class="upcoming-item" onclick="openTaskModalById('${t.id}')">
        <div class="upcoming-date-tag">${formattedDate}</div>
        <div class="upcoming-title">${escapeHTML(t.title)}</div>
        ${formattedTime ? `<div class="upcoming-time">${formattedTime}</div>` : ''}
      </div>
    `;
  }).join('');
}

function openTaskModalById(id) {
  const task = tasks.find(t => t.id === id);
  if (task) openTaskModal(task);
}

/* ==========================================
   STATS & PROGRESS
   ========================================== */
function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const streak = calculateStreak();

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-streak').textContent = streak;
}

function renderProgress() {
  const todayStr = formatDateToYYYYMMDD(new Date());
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const totalToday = todayTasks.length;
  const completedToday = todayTasks.filter(t => t.completed).length;

  const statusText = document.getElementById('progress-status-text');
  const barFill = document.getElementById('progress-bar-fill');

  if (totalToday === 0) {
    statusText.textContent = 'No tasks scheduled for today';
    barFill.style.width = '0%';
  } else {
    const percent = Math.round((completedToday / totalToday) * 100);
    statusText.textContent = `${completedToday} of ${totalToday} tasks completed`;
    barFill.style.width = `${percent}%`;
  }
}

function calculateStreak() {
  // Simple streak calculation: count consecutive days backwards from today having completed tasks
  let streak = 0;
  let checkDate = new Date();

  while (true) {
    const dateStr = formatDateToYYYYMMDD(checkDate);
    const dayTasks = tasks.filter(t => t.date === dateStr);
    const hasCompleted = dayTasks.length > 0 && dayTasks.some(t => t.completed);

    if (hasCompleted) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If checking today and no completed task yet, check yesterday before breaking
      if (formatDateToYYYYMMDD(new Date()) === dateStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
}

/* ==========================================
   CALENDAR COMPONENT
   ========================================== */
function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth(); // 0-indexed

  // Month Title Header
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  document.getElementById('calendar-month-year').textContent = `${monthNames[month]} ${year}`;

  const grid = document.getElementById('calendar-days-grid');
  grid.innerHTML = '';

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDays = new Date(year, month + 1, 0).getDate();

  const todayStr = formatDateToYYYYMMDD(new Date());
  const selectedStr = formatDateToYYYYMMDD(selectedCalendarDate);

  // Empty slots before 1st day
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell empty';
    grid.appendChild(emptyCell);
  }

  // Days of current month
  for (let day = 1; day <= totalDays; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = formatDateToYYYYMMDD(dateObj);

    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell';
    cell.textContent = day;

    if (dateStr === todayStr) {
      cell.classList.add('today');
    }
    if (dateStr === selectedStr) {
      cell.classList.add('selected');
    }

    // Check if tasks exist for this date
    const dayHasTasks = tasks.some(t => t.date === dateStr);
    if (dayHasTasks) {
      const dot = document.createElement('div');
      dot.className = 'has-task-dot';
      cell.appendChild(dot);
    }

    cell.addEventListener('click', () => {
      selectedCalendarDate = dateObj;
      renderCalendar();
      renderSelectedDateTasks();
    });

    grid.appendChild(cell);
  }

  renderSelectedDateTasks();
}

function renderSelectedDateTasks() {
  const dateTitleElem = document.getElementById('selected-date-title');
  const taskListElem = document.getElementById('selected-date-tasks');

  const todayStr = formatDateToYYYYMMDD(new Date());
  const selectedStr = formatDateToYYYYMMDD(selectedCalendarDate);

  if (selectedStr === todayStr) {
    dateTitleElem.textContent = 'Today';
  } else {
    dateTitleElem.textContent = selectedCalendarDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  const dayTasks = tasks.filter(t => t.date === selectedStr);

  if (dayTasks.length === 0) {
    taskListElem.innerHTML = '<p class="text-body-sm text-on-surface-variant mt-1">No tasks on this day.</p>';
    return;
  }

  taskListElem.innerHTML = dayTasks.map(t => `
    <div class="selected-date-task-item">
      <div>
        <div style="font-weight: 600; color: var(--text-main);">${escapeHTML(t.title)}</div>
        ${t.time ? `<div style="font-size: 0.775rem; color: var(--text-muted);">${formatTime12hr(t.time)}</div>` : ''}
      </div>
      <span class="badge ${t.completed ? 'badge-priority-low' : 'badge-priority-medium'}">
        ${t.completed ? 'Done' : t.priority}
      </span>
    </div>
  `).join('');
}

/* ==========================================
   POMODORO FOCUS TIMER
   ========================================== */
function initPomodoro() {
  const modeWorkBtn = document.getElementById('pomo-mode-work');
  const modeBreakBtn = document.getElementById('pomo-mode-break');
  const startBtn = document.getElementById('pomodoro-start-btn');
  const resetBtn = document.getElementById('pomodoro-reset-btn');

  modeWorkBtn.addEventListener('click', () => setPomodoroMode('work'));
  modeBreakBtn.addEventListener('click', () => setPomodoroMode('break'));

  startBtn.addEventListener('click', togglePomodoroTimer);
  resetBtn.addEventListener('click', resetPomodoroTimer);

  updatePomodoroDisplay();
}

function setPomodoroMode(mode) {
  if (pomoIsRunning) pausePomodoroTimer();
  pomoMode = mode;

  document.querySelectorAll('.pomodoro-modes .btn-pill').forEach(b => b.classList.remove('active'));
  if (mode === 'work') {
    document.getElementById('pomo-mode-work').classList.add('active');
    pomoSecondsLeft = 25 * 60;
    pomoTotalSeconds = 25 * 60;
  } else {
    document.getElementById('pomo-mode-break').classList.add('active');
    pomoSecondsLeft = 5 * 60;
    pomoTotalSeconds = 5 * 60;
  }

  updatePomodoroDisplay();
}

function togglePomodoroTimer() {
  const startBtn = document.getElementById('pomodoro-start-btn');
  if (pomoIsRunning) {
    pausePomodoroTimer();
  } else {
    pomoIsRunning = true;
    startBtn.textContent = 'Pause';
    pomoTimerInterval = setInterval(() => {
      pomoSecondsLeft--;
      updatePomodoroDisplay();

      if (pomoSecondsLeft <= 0) {
        clearInterval(pomoTimerInterval);
        pomoIsRunning = false;
        startBtn.textContent = 'Start';
        showToast(pomoMode === 'work' ? 'Focus session completed! Take a break.' : 'Break ended! Time to focus.');
        
        // Optional browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("PlanIt Focus Timer", {
            body: pomoMode === 'work' ? 'Focus session finished!' : 'Break finished!'
          });
        }
      }
    }, 1000);
  }
}

function pausePomodoroTimer() {
  pomoIsRunning = false;
  clearInterval(pomoTimerInterval);
  document.getElementById('pomodoro-start-btn').textContent = 'Start';
}

function resetPomodoroTimer() {
  pausePomodoroTimer();
  pomoSecondsLeft = pomoTotalSeconds;
  updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
  const minutes = Math.floor(pomoSecondsLeft / 60);
  const seconds = pomoSecondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('pomodoro-timer-display').textContent = formatted;
}

function updatePomodoroTaskDropdown() {
  const select = document.getElementById('pomodoro-task-select');
  const pendingTasks = tasks.filter(t => !t.completed);

  const currentVal = select.value;
  select.innerHTML = '<option value="">No task linked</option>';

  pendingTasks.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.title;
    if (t.id === currentVal) opt.selected = true;
    select.appendChild(opt);
  });
}

/* ==========================================
   UTILITY HELPER FUNCTIONS
   ========================================== */
function formatDateToYYYYMMDD(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const todayStr = formatDateToYYYYMMDD(new Date());
  if (dateStr === todayStr) return 'Today';

  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime12hr(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

function checkIfOverdue(task) {
  if (task.completed || !task.date) return false;
  const todayStr = formatDateToYYYYMMDD(new Date());
  if (task.date < todayStr) return true;

  if (task.date === todayStr && task.time) {
    const now = new Date();
    const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return task.time < currentHM;
  }
  return false;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconName = 'check_circle';
  if (type === 'error') iconName = 'error';

  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color: var(--primary-container); font-size: 20px;">${iconName}</span>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}