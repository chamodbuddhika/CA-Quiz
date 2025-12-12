// ========== Global Variables ==========
let currentQuestions = [];
let currentQuestionIndex = 0;
let selectedCategory = 'All';
let userAnswers = [];
let bookmarkedQuestions = new Set();
let flaggedQuestions = new Set();
let startTime;
let timerInterval;
let timeRemaining = 120;
let totalTimeSpent = 0;

// ========== Local Storage Keys ==========
const STORAGE_KEYS = {
    STATS: 'ca_ama_quiz_stats',
    BOOKMARKS: 'ca_ama_quiz_bookmarks',
    THEME: 'ca_ama_quiz_theme'
};

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadStats();
    loadBookmarks();
    setupEventListeners();
    renderCategories();
});

// ========== Theme Management ==========
function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ========== Statistics Management ==========
function loadStats() {
    const stats = getStats();
    document.getElementById('totalAttempted').textContent = stats.totalAttempted;
    document.getElementById('avgScore').textContent = stats.avgScore + '%';
    document.getElementById('bestScore').textContent = stats.bestScore + '%';
}

function getStats() {
    const defaultStats = {
        totalAttempted: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        avgScore: 0,
        bestScore: 0
    };
    
    const saved = localStorage.getItem(STORAGE_KEYS.STATS);
    return saved ? JSON.parse(saved) : defaultStats;
}

function updateStats(correct, total) {
    const stats = getStats();
    
    stats.totalAttempted++;
    stats.totalCorrect += correct;
    stats.totalQuestions += total;
    
    const currentScore = Math.round((correct / total) * 100);
    stats.avgScore = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
    
    if (currentScore > stats.bestScore) {
        stats.bestScore = currentScore;
    }
    
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    loadStats();
}

// ========== Bookmarks Management ==========
function loadBookmarks() {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    bookmarkedQuestions = saved ? new Set(JSON.parse(saved)) : new Set();
}

function saveBookmarks() {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...bookmarkedQuestions]));
}

function toggleBookmark() {
    const currentQ = currentQuestions[currentQuestionIndex];
    const btn = document.getElementById('bookmarkBtn');
    
    if (bookmarkedQuestions.has(currentQ.id)) {
        bookmarkedQuestions.delete(currentQ.id);
        btn.classList.remove('active');
    } else {
        bookmarkedQuestions.add(currentQ.id);
        btn.classList.add('active');
    }
    
    saveBookmarks();
}

function toggleFlag() {
    const btn = document.getElementById('flagBtn');
    
    if (flaggedQuestions.has(currentQuestionIndex)) {
        flaggedQuestions.delete(currentQuestionIndex);
        btn.classList.remove('active');
    } else {
        flaggedQuestions.add(currentQuestionIndex);
        btn.classList.add('active');
    }
}

// ========== Render Categories ==========
function renderCategories() {
    const categories = getCategories();
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
    // Add "All" category
    const allCard = createCategoryCard('All', '📚', questionsDatabase.length);
    container.appendChild(allCard);
    
    // Add other categories
    categories.forEach(cat => {
        const count = questionsDatabase.filter(q => q.category === cat).length;
        const icon = getCategoryIcon(cat);
        const card = createCategoryCard(cat, icon, count);
        container.appendChild(card);
    });
}

function getCategories() {
    return [...new Set(questionsDatabase.map(q => q.category))].sort();
}

function getCategoryIcon(category) {
    const icons = {
        'Quality Management': '⭐',
        'Throughput Accounting': '⚡',
        'Backflush Accounting': '🔄',
        'Business Process Reengineering': '🔧',
        'Environmental Management Accounting': '🌱',
        'Capacity Management': '📏',
        'Budgeting': '💰',
        'Performance Measurement': '📊',
        'Big Data': '💾',
        'Decision Making': '🎯',
        'Modern Manufacturing': '🏭',
        'Just-in-Time (JIT)': '⏰',
        'Activity-Based Costing': '📋',
        'Value Chain': '⛓️',
        'Variance Analysis': '📉',
        'Working Capital': '💵',
        'Life Cycle Costing': '♻️',
        'Customer Profitability Analysis': '👥',
        'Pricing': '💲',
        'Investment Appraisal': '📈',
        'Transfer Pricing': '🔀',
        'CVP Analysis': '📊',
        'Risk Management': '🛡️',
        'Receivables Management': '📝',
        'Relevant Costing': '✂️',
        'Project Evaluation': '🏗️',
        'Value Analysis': '🔍',
        'Balanced Scorecard': '📊',
        'Target Costing': '🎯',
        'Management Tools': '🛠️',
        'Investment Valuation': '💹',
        'Decision Trees': '🌳'
    };
    return icons[category] || '📚';
}

function createCategoryCard(name, icon, count) {
    const card = document.createElement('div');
    card.className = 'category-card';
    if (name === 'All') card.classList.add('selected');
    
    card.innerHTML = `
        <div class="category-icon">${icon}</div>
        <div class="category-name">${name}</div>
        <div class="category-count">${count} Questions</div>
    `;
    
    card.addEventListener('click', () => selectCategory(card, name));
    
    return card;
}

function selectCategory(card, category) {
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedCategory = category;
}

// ========== Start Quiz ==========
function startQuiz() {
    // Get selected questions
    let questions = selectedCategory === 'All' 
        ? [...questionsDatabase]
        : questionsDatabase.filter(q => q.category === selectedCategory);
    
    // Shuffle questions
    questions = shuffleArray(questions);
    
    // Get question count
    const questionCount = document.getElementById('questionCount').value;
    if (questionCount !== 'all') {
        questions = questions.slice(0, parseInt(questionCount));
    }
    
    if (questions.length === 0) {
        alert('No questions available in this category!');
        return;
    }
    
    currentQuestions = questions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    flaggedQuestions.clear();
    startTime = Date.now();
    totalTimeSpent = 0;
    
    // Check if timer is enabled
    const timerEnabled = document.getElementById('timerToggle').checked;
    if (timerEnabled) {
        timeRemaining = 120;
    }
    
    showScreen('quizScreen');
    renderQuestion();
    
    if (timerEnabled) {
        startTimer();
    } else {
        document.getElementById('timer').style.display = 'none';
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ========== Timer ==========
function startTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').style.display = 'flex';
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 30) {
            document.getElementById('timer').classList.add('warning');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timerValue').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    timeRemaining = 120;
    document.getElementById('timer').classList.remove('warning');
    updateTimerDisplay();
}

// ========== Render Question ==========
function renderQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    // Update header
    document.getElementById('currentCategory').textContent = question.category;
    document.getElementById('questionCounter').textContent = 
        `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    
    // Update year badge
    if (question.year) {
        document.getElementById('questionYear').textContent = question.year;
        document.getElementById('questionYear').style.display = 'inline-block';
    } else {
        document.getElementById('questionYear').style.display = 'none';
    }
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update question
    document.getElementById('questionText').textContent = question.question;
    
    // Update options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (userAnswers[currentQuestionIndex] === index) {
            optionDiv.classList.add('selected');
        }
        
        const letter = String.fromCharCode(65 + index);
        
        optionDiv.innerHTML = `
            <div class="option-letter">${letter}</div>
            <div class="option-text">${option}</div>
        `;
        
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    
    // Update buttons
    updateBookmarkButton();
    updateFlagButton();
    updateNavigationButtons();
    
    // Reset timer
    if (document.getElementById('timerToggle').checked) {
        resetTimer();
    }
}

function selectOption(index) {
    userAnswers[currentQuestionIndex] = index;
    
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === index);
    });
}

function updateBookmarkButton() {
    const currentQ = currentQuestions[currentQuestionIndex];
    const btn = document.getElementById('bookmarkBtn');
    
    if (bookmarkedQuestions.has(currentQ.id)) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

function updateFlagButton() {
    const btn = document.getElementById('flagBtn');
    
    if (flaggedQuestions.has(currentQuestionIndex)) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuestions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// ========== Navigation ==========
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function submitQuiz() {
    const unanswered = userAnswers.filter(a => a === null).length;
    
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
            return;
        }
    }
    
    clearInterval(timerInterval);
    totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    showResults();
}

// ========== Show Results ==========
function showResults() {
    let correct = 0;
    
    currentQuestions.forEach((q, index) => {
        if (userAnswers[index] === q.correct) {
            correct++;
        }
    });
    
    const total = currentQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    
    // Update stats
    updateStats(correct, total);
    
    // Update UI
    document.getElementById('scorePercentage').textContent = percentage + '%';
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = total - correct;
    
    const minutes = Math.floor(totalTimeSpent / 60);
    const seconds = totalTimeSpent % 60;
    document.getElementById('timeTaken').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    animateScoreRing(percentage);
    showPerformanceMessage(percentage);
    
    showScreen('resultsScreen');
}

function animateScoreRing(percentage) {
    const ring = document.getElementById('scoreRing');
    const circumference = 339.292;
    const offset = circumference - (percentage / 100) * circumference;
    
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 100);
}

function showPerformanceMessage(percentage) {
    const messageDiv = document.getElementById('performanceMessage');
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
        emoji = '🌟';
        message = 'Excellent! Outstanding performance!';
    } else if (percentage >= 75) {
        emoji = '🎉';
        message = 'Great job! Strong understanding!';
    } else if (percentage >= 60) {
        emoji = '👍';
        message = 'Good work! Keep practicing!';
    } else if (percentage >= 40) {
        emoji = '📚';
        message = 'Fair attempt! Review and try again!';
    } else {
        emoji = '💪';
        message = 'Keep trying! More practice needed!';
    }
    
    messageDiv.innerHTML = `<p>${emoji} ${message}</p>`;
}

// ========== Review Answers ==========
function showReview() {
    const container = document.getElementById('reviewContainer');
    container.innerHTML = '';
    
    currentQuestions.forEach((q, index) => {
        const item = createReviewItem(q, index);
        container.appendChild(item);
    });
    
    showScreen('reviewScreen');
}

function createReviewItem(question, index) {
    const isCorrect = userAnswers[index] === question.correct;
    const isBookmarked = bookmarkedQuestions.has(question.id);
    const userAnswer = userAnswers[index];
    
    const div = document.createElement('div');
    div.className = 'review-item';
    div.dataset.status = isCorrect ? 'correct' : 'wrong';
    div.dataset.bookmarked = isBookmarked;
    
    let optionsHTML = '';
    question.options.forEach((opt, i) => {
        let classes = 'review-option';
        if (i === userAnswer) classes += ' user-answer';
        if (i === question.correct) classes += ' correct-answer';
        
        optionsHTML += `<div class="${classes}">${String.fromCharCode(65 + i)}. ${opt}</div>`;
    });
    
    div.innerHTML = `
        <div class="review-question-header">
            <span class="review-question-number">Question ${index + 1}</span>
            <div class="review-status">
                ${question.year ? `<span class="status-badge">${question.year}</span>` : ''}
                ${isBookmarked ? '<span class="status-badge">🔖 Bookmarked</span>' : ''}
                <span class="status-badge ${isCorrect ? 'correct' : 'wrong'}">
                    ${isCorrect ? '✓ Correct' : '✗ Wrong'}
                </span>
            </div>
        </div>
        <div class="review-question-text">${question.question}</div>
        <div class="review-options">${optionsHTML}</div>
        ${question.explanation ? `
            <div class="performance-message">
                <strong>💡 Explanation:</strong> ${question.explanation}
            </div>
        ` : ''}
    `;
    
    return div;
}

function filterReview(filter) {
    const items = document.querySelectorAll('.review-item');
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    items.forEach(item => {
        let show = true;
        
        switch(filter) {
            case 'correct':
                show = item.dataset.status === 'correct';
                break;
            case 'wrong':
                show = item.dataset.status === 'wrong';
                break;
            case 'bookmarked':
                show = item.dataset.bookmarked === 'true';
                break;
            case 'all':
            default:
                show = true;
        }
        
        item.classList.toggle('hidden', !show);
    });
}

// ========== Screen Management ==========
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ========== Event Listeners ==========
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Start quiz
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    
    // Quiz navigation
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitQuiz);
    
    // Question actions
    document.getElementById('bookmarkBtn').addEventListener('click', toggleBookmark);
    document.getElementById('flagBtn').addEventListener('click', toggleFlag);
    
    // Results actions
    document.getElementById('reviewBtn').addEventListener('click', showReview);
    document.getElementById('retryBtn').addEventListener('click', () => {
        showScreen('startScreen');
        loadStats();
    });
    document.getElementById('homeBtn').addEventListener('click', () => {
        showScreen('startScreen');
        loadStats();
    });
    
    // Review actions
    document.getElementById('backToResultsBtn').addEventListener('click', () => {
        showScreen('resultsScreen');
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterReview(btn.dataset.filter);
        });
    });
}