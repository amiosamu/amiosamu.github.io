// Get all necessary DOM elements
const problemList = document.querySelector('.problem-list');
const difficultyFilter = document.getElementById('difficulty-filter');
const statusButtons = document.querySelectorAll('.status-btn');
const resetButton = document.querySelector('.button.red');
const pickRandomButton = document.querySelector('.button:not(.red)');

// Store all problems on page load
const allProblems = Array.from(document.querySelectorAll('.problem-item'));

// Add these new constants at the top with other DOM elements
const darkModeToggle = document.querySelector('.dark-mode-toggle');
const body = document.body;

// Add this function to handle dark mode toggle
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
}

// Function to filter and sort problems
function filterAndSortProblems() {
    const selectedDifficulty = difficultyFilter.value;
    const selectedStatus = document.querySelector('.status-btn.active').dataset.status;

    // Filter problems based on difficulty and status
    const filteredProblems = allProblems.filter(problem => {
        const difficultyMatch = !selectedDifficulty || 
            problem.querySelector('.difficulty-btn').classList.contains(selectedDifficulty);
        const statusMatch = !selectedStatus || 
            problem.querySelector('.status-select').value === selectedStatus;
        
        return difficultyMatch && statusMatch;
    });

    // Sort problems alphabetically by name
    filteredProblems.sort((a, b) => {
        return a.querySelector('.problem-name').textContent.localeCompare(
            b.querySelector('.problem-name').textContent
        );
    });

    // Clear and re-append sorted problems
    problemList.innerHTML = '';
    filteredProblems.forEach(problem => {
        const problemClone = problem.cloneNode(true);
        problemList.appendChild(problemClone);
    });
}

// Handle status button clicks
function handleStatusButtonClick(e) {
    // Remove active class from all buttons
    statusButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    e.target.classList.add('active');
    // Filter problems
    filterAndSortProblems();
}

// Function to pick a random problem
function pickRandomProblem() {
    const problems = Array.from(document.querySelectorAll('.problem-item'));
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    
    // Optional: Highlight or focus the random problem
    randomProblem.style.backgroundColor = '#f0f0f0';
    setTimeout(() => {
        randomProblem.style.backgroundColor = '';
    }, 2000);
}

// Function to reset all problem statuses to 'Todo'
function resetAllProblems() {
    const statusSelects = document.querySelectorAll('.status-select');
    const checkboxes = document.querySelectorAll('.problem-checkbox');
    
    // Reset status selects to 'todo'
    statusSelects.forEach(select => {
        select.value = 'todo';
    });
    
    // Uncheck all checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Existing difficulty and status logic
    // ...

    // Language selection logic
    const languageButtons = document.querySelectorAll('.language-btn');
    const codeBlocks = document.querySelectorAll('.code-block');

    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and code blocks
            languageButtons.forEach(btn => btn.classList.remove('active'));
            codeBlocks.forEach(block => block.classList.remove('active'));

            // Add active class to clicked button and corresponding code block
            button.classList.add('active');
            const language = button.dataset.language;
            const activeBlock = document.querySelector(`.code-block.${language}`);
            if (activeBlock) {
                activeBlock.classList.add('active');
            }
        });
    });

    // Set initial dark mode state from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️ Light Mode';
    }

    // Add dark mode toggle event listener
    darkModeToggle.addEventListener('click', toggleDarkMode);
});


// Add event listeners
difficultyFilter.addEventListener('change', filterAndSortProblems);
statusButtons.forEach(btn => btn.addEventListener('click', handleStatusButtonClick));
pickRandomButton.addEventListener('click', pickRandomProblem);
resetButton.addEventListener('click', resetAllProblems);

// Initial sort on page load
filterAndSortProblems();