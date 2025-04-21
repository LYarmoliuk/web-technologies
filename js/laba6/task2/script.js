document.addEventListener('DOMContentLoaded', () => {
    // State (immutable)
    let state = {
        tasks: [],
        nextId: 1
    };

    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const sortSelect = document.getElementById('sort-select');
    const taskTemplate = document.getElementById('task-template');

    // Pure Functions
    const createTask = (text) => ({
        id: state.nextId,
        text,
        completed: false,
        dateAdded: new Date(),
        dateUpdated: new Date()
    });

    const addTask = (tasks, task) => [...tasks, task];

    const updateTask = (tasks, id, updates) => 
        tasks.map(task => 
            task.id === id ? { ...task, ...updates, dateUpdated: new Date() } : task
        );

    const removeTask = (tasks, id) => 
        tasks.filter(task => task.id !== id);

    const toggleTaskCompletion = (tasks, id) => 
        tasks.map(task => 
            task.id === id ? 
            { ...task, completed: !task.completed, dateUpdated: new Date() } : 
            task
        );

    const sortTasks = (tasks, criteria) => {
        const sortedTasks = [...tasks];
        switch (criteria) {
            case 'dateAdded':
                return sortedTasks.sort((a, b) => 
                    new Date(a.dateAdded) - new Date(b.dateAdded));
            case 'completed':
                return sortedTasks.sort((a, b) => 
                    Number(a.completed) - Number(b.completed));
            case 'dateUpdated':
                return sortedTasks.sort((a, b) => 
                    new Date(b.dateUpdated) - new Date(a.dateUpdated));
            default:
                return sortedTasks;
        }
    };

    // UI Rendering
    const renderTasks = () => {
        // Clear current list
        taskList.innerHTML = '';
        
        // Sort tasks based on current criteria
        const sortedTasks = sortTasks(state.tasks, sortSelect.value);
        
        // Render each task
        sortedTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    };

    const createTaskElement = (task) => {
        // Clone template
        const taskElement = document.importNode(taskTemplate.content, true).querySelector('.task-item');
        
        // Set data attribute for identification
        taskElement.dataset.id = task.id;
        
        // Set completed status
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        
        // Set task text and checkbox state
        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.checked = task.completed;
        
        const textElement = taskElement.querySelector('.task-text');
        textElement.textContent = task.text;
        
        // Add event listeners
        setupTaskEventListeners(taskElement, task.id);
        
        return taskElement;
    };

    const setupTaskEventListeners = (taskElement, taskId) => {
        const checkbox = taskElement.querySelector('.task-checkbox');
        const textElement = taskElement.querySelector('.task-text');
        const editButton = taskElement.querySelector('.btn-edit');
        const deleteButton = taskElement.querySelector('.btn-delete');
        
        // Toggle completion
        checkbox.addEventListener('change', () => {
            updateState(prevState => ({
                ...prevState,
                tasks: toggleTaskCompletion(prevState.tasks, taskId)
            }));
        });
        
        // Edit task
        editButton.addEventListener('click', () => {
            if (textElement.contentEditable === 'true') {
                // Save changes
                textElement.contentEditable = 'false';
                textElement.classList.remove('editable');
                editButton.textContent = 'Редагувати';
                
                const newText = textElement.textContent.trim();
                if (newText) {
                    updateState(prevState => ({
                        ...prevState,
                        tasks: updateTask(prevState.tasks, taskId, { text: newText })
                    }));
                }
            } else {
                // Enter edit mode
                textElement.contentEditable = 'true';
                textElement.classList.add('editable');
                textElement.focus();
                editButton.textContent = 'Зберегти';
                
                // Place cursor at the end
                const range = document.createRange();
                range.selectNodeContents(textElement);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        
        // Delete task
        deleteButton.addEventListener('click', () => {
            taskElement.classList.add('deleting');
            
            // Wait for animation to complete
            setTimeout(() => {
                updateState(prevState => ({
                    ...prevState,
                    tasks: removeTask(prevState.tasks, taskId)
                }));
            }, 500);
        });
    };

    // State Management
    const updateState = (updater) => {
        state = updater(state);
        
        // Save to localStorage (pure function side effect)
        saveStateToLocalStorage(state);
        
        // Render UI based on new state
        renderTasks();
    };

    // LocalStorage Functions
    const saveStateToLocalStorage = (state) => {
        localStorage.setItem('todoList', JSON.stringify({
            tasks: state.tasks,
            nextId: state.nextId
        }));
    };

    const loadStateFromLocalStorage = () => {
        const savedState = localStorage.getItem('todoList');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                
                // Convert string dates back to Date objects
                const tasks = parsedState.tasks.map(task => ({
                    ...task,
                    dateAdded: new Date(task.dateAdded),
                    dateUpdated: new Date(task.dateUpdated)
                }));
                
                return {
                    tasks,
                    nextId: parsedState.nextId
                };
            } catch (e) {
                console.error('Error parsing saved state:', e);
                return { tasks: [], nextId: 1 };
            }
        }
        return { tasks: [], nextId: 1 };
    };

    // Event Handlers
    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        const text = taskInput.value.trim();
        if (text) {
            updateState(prevState => {
                const newTask = createTask(text);
                return {
                    tasks: addTask(prevState.tasks, newTask),
                    nextId: prevState.nextId + 1
                };
            });
            
            // Reset input
            taskInput.value = '';
        }
    };

    const handleSortChange = () => {
        renderTasks();
    };

    // Init App
    const initApp = () => {
        // Load saved state
        state = loadStateFromLocalStorage();
        
        // Set up event listeners
        taskForm.addEventListener('submit', handleFormSubmit);
        sortSelect.addEventListener('change', handleSortChange);
        
        // Initial render
        renderTasks();
    };

    // Start the app
    initApp();
});