// CA Exam Quiz App - Complete JavaScript
// Combined AMA & Corporate Law Quiz System

let currentQuestions = [];
let currentQuestionIndex = 0;
let selectedCategory = 'All';
let selectedSubject = '';
let userAnswers = [];
let bookmarkedQuestions = new Set();
let flaggedQuestions = new Set();
let startTime;
let timerInterval;
let timeRemaining = 120;
let totalTimeSpent = 0;

const STORAGE_KEYS = {
    STATS_AMA: 'ca_quiz_stats_ama',
    STATS_LAW: 'ca_quiz_stats_law',
    BOOKMARKS: 'ca_quiz_bookmarks',
    THEME: 'ca_quiz_theme'
};

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadAllStats();
    loadBookmarks();
    setupEventListeners();
    updateSubjectCounts();
});

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

function updateSubjectCounts() {
    const amaQuestions = questionsDatabase.filter(q => q.id <= 60);
    const lawQuestions = questionsDatabase.filter(q => q.id > 60);
    document.getElementById('amaCount').textContent = `${amaQuestions.length} Questions`;
    document.getElementById('lawCount').textContent = `${lawQuestions.length} Questions`;
}

function selectSubject(subject) {
    selectedSubject = subject;
    const icon = subject === 'AMA' ? '📊' : '⚖️';
    const fullName = subject === 'AMA' ? 'Advanced Management Accounting' : 'Corporate Law';
    document.getElementById('subjectTitle').textContent = `${icon} ${subject} Quiz`;
    document.getElementById('subjectSubtitle').textContent = fullName;
    renderCategories();
    loadStats();
    showScreen('startScreen');
}

function loadAllStats() {
    const amaStats = getStats('AMA');
    const lawStats = getStats('Corporate Law');
    document.getElementById('amaAttempted').textContent = `${amaStats.totalAttempted} Attempted`;
    document.getElementById('amaAvg').textContent = `${amaStats.avgScore}% Avg`;
    document.getElementById('lawAttempted').textContent = `${lawStats.totalAttempted} Attempted`;
    document.getElementById('lawAvg').textContent = `${lawStats.avgScore}% Avg`;
    const totalAttempted = amaStats.totalAttempted + lawStats.totalAttempted;
    const totalQuestions = amaStats.totalQuestions + lawStats.totalQuestions;
    const totalCorrect = amaStats.totalCorrect + lawStats.totalCorrect;
    const bestScore = Math.max(amaStats.bestScore, lawStats.bestScore);
    document.getElementById('overallAttempted').textContent = totalAttempted;
    document.getElementById('overallAvg').textContent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) + '%' : '0%';
    document.getElementById('overallBest').textContent = bestScore + '%';
}

function loadStats() {
    const stats = getStats(selectedSubject);
    document.getElementById('totalAttempted').textContent = stats.totalAttempted;
    document.getElementById('avgScore').textContent = stats.avgScore + '%';
    document.getElementById('bestScore').textContent = stats.bestScore + '%';
}

function getStats(subject) {
    const defaultStats = {totalAttempted: 0, totalCorrect: 0, totalQuestions: 0, avgScore: 0, bestScore: 0};
    const key = subject === 'AMA' ? STORAGE_KEYS.STATS_AMA : STORAGE_KEYS.STATS_LAW;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultStats;
}

function updateStats(correct, total) {
    const key = selectedSubject === 'AMA' ? STORAGE_KEYS.STATS_AMA : STORAGE_KEYS.STATS_LAW;
    const stats = getStats(selectedSubject);
    stats.totalAttempted++;
    stats.totalCorrect += correct;
    stats.totalQuestions += total;
    const currentScore = Math.round((correct / total) * 100);
    stats.avgScore = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
    if (currentScore > stats.bestScore) stats.bestScore = currentScore;
    localStorage.setItem(key, JSON.stringify(stats));
    loadStats();
    loadAllStats();
}

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

function renderCategories() {
    const categories = getCategories();
    const container = document.getElementById('categories');
    container.innerHTML = '';
    const subjectQuestions = getSubjectQuestions();
    const allCard = createCategoryCard('All', '📚', subjectQuestions.length);
    container.appendChild(allCard);
    categories.forEach(cat => {
        const count = subjectQuestions.filter(q => q.category === cat).length;
        if (count > 0) {
            const icon = getCategoryIcon(cat);
            const card = createCategoryCard(cat, icon, count);
            container.appendChild(card);
        }
    });
}

function getSubjectQuestions() {
    return selectedSubject === 'AMA' ? questionsDatabase.filter(q => q.id <= 60) : questionsDatabase.filter(q => q.id > 60);
}

function getCategories() {
    const subjectQuestions = getSubjectQuestions();
    return [...new Set(subjectQuestions.map(q => q.category))].sort();
}

function getCategoryIcon(category) {
    const icons = {'Quality Management':'⭐','Throughput Accounting':'⚡','Backflush Accounting':'🔄','Business Process Reengineering':'🔧','Environmental Management Accounting':'🌱','Capacity Management':'📏','Budgeting':'💰','Performance Measurement':'📊','Big Data':'💾','Decision Making':'🎯','Modern Manufacturing':'🏭','Just-in-Time (JIT)':'⏰','Activity-Based Costing':'📋','Value Chain':'⛓️','Variance Analysis':'📉','Working Capital':'💵','Life Cycle Costing':'♻️','Customer Profitability Analysis':'👥','Pricing':'💲','Investment Appraisal':'📈','Transfer Pricing':'🔀','CVP Analysis':'📊','Risk Management':'🛡️','Receivables Management':'📝','Relevant Costing':'✂️','Project Evaluation':'🏗️','Value Analysis':'🔍','Balanced Scorecard':'📊','Target Costing':'🎯','Management Tools':'🛠️','Investment Valuation':'💹','Decision Trees':'🌳','Corporate Law - Company Fundamentals':'🏛️','Corporate Law - Company Types':'🏢','Corporate Law - Case Law':'⚖️','Corporate Law - Foreign Exchange':'💱','Corporate Law - Incorporation Advantages':'📈','Corporate Law - Overseas Companies':'🌍','Corporate Law - Lifting the Veil':'🎭','Corporate Law - Company Features':'🔍','Corporate Law - Overseas Company Obligations':'📋','Corporate Law - Land Restrictions':'🏞️','Corporate Law - Pre-incorporation Contracts':'📝','Corporate Law - Dirisavi Board Listing':'📊','Corporate Law - Company Forms':'📄','Corporate Law - Residency Definition':'🏠','Corporate Law - Company Name Recognition':'🏷️','Corporate Law - Overseas Company Documents':'📑','Corporate Law - Companies Limited by Guarantee':'🤝','Corporate Law - Voluntary Winding Up':'🔚','Corporate Law - Winding Up Procedure':'⚙️','Corporate Law - SEC Powers':'🏛️','Corporate Law - Document Requirements':'📂','Corporate Law - Annual General Meetings':'👥','Corporate Law - Winding Up Process':'🔄','Corporate Law - Administrator Appointment':'👔','Corporate Law - Overseas Company Restrictions':'🚫','Corporate Law - Inward Investment Accounts':'💰','Corporate Law - Official Receiver':'⚖️','Corporate Law - Land Alienation Restrictions':'🏞️','Corporate Law - Auditor Provisions':'🔍','Corporate Law - Outward Investment Accounts':'💸','Corporate Law - Overseas Company Financial Statements':'📊','Corporate Law - Company Secretary Role':'👨‍💼','Corporate Law - Derivative Actions':'⚖️','Corporate Law - Director Types':'👔','Corporate Law - Share Types':'📜','Corporate Law - Dividends':'💵','Corporate Law - Land Purchase Responsibilities':'📋','Corporate Law - Foreign Investment Restrictions':'🚫','Corporate Law - Company Secretary Authority':'📝','Corporate Law - Resolutions':'✍️','Corporate Law - Financial Statements':'📊','Corporate Law - Foreign Land Transactions':'🌍','Corporate Law - Listing Requirements':'📈','Corporate Law - Auditor Rights':'👁️','Corporate Law - Inability to Pay Debts':'💸','Corporate Law - Voluntary Winding Up Grounds':'🔚','Corporate Law - Liquidator Powers':'⚖️','Corporate Law - Listed Securities Definition':'📜','Corporate Law - Director-Shareholder Division':'👥','Corporate Law - CSE Boards':'📊','Corporate Law - Liquidator Appointment':'👔'};
    return icons[category] || '📚';
}

function createCategoryCard(name, icon, count) {
    const card = document.createElement('div');
    card.className = 'category-card';
    if (name === 'All') card.classList.add('selected');
    card.innerHTML = `<div class="category-icon">${icon}</div><div class="category-name">${name}</div><div class="category-count">${count} Questions</div>`;
    card.addEventListener('click', () => selectCategory(card, name));
    return card;
}

function selectCategory(card, category) {
    document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedCategory = category;
}

function startQuiz() {
    let questions = getSubjectQuestions();
    if (selectedCategory !== 'All') questions = questions.filter(q => q.category === selectedCategory);
    questions = shuffleArray(questions);
    const questionCount = document.getElementById('questionCount').value;
    if (questionCount !== 'all') questions = questions.slice(0, parseInt(questionCount));
    if (questions.length === 0) {alert('No questions available!'); return;}
    currentQuestions = questions;
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    flaggedQuestions.clear();
    startTime = Date.now();
    totalTimeSpent = 0;
    const timerEnabled = document.getElementById('timerToggle').checked;
    if (timerEnabled) timeRemaining = 120;
    showScreen('quizScreen');
    renderQuestion();
    if (timerEnabled) startTimer(); else document.getElementById('timer').style.display = 'none';
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').style.display = 'flex';
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 30) document.getElementById('timer').classList.add('warning');
        if (timeRemaining <= 0) {clearInterval(timerInterval); nextQuestion();}
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timerValue').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function resetTimer() {
    timeRemaining = 120;
    document.getElementById('timer').classList.remove('warning');
    updateTimerDisplay();
}

function renderQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('currentCategory').textContent = question.category;
    document.getElementById('questionCounter').textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    const subjectBadge = document.getElementById('currentSubject');
    subjectBadge.textContent = selectedSubject;
    subjectBadge.style.background = selectedSubject === 'AMA' ? '#6366f1' : '#8b5cf6';
    if (question.year) {
        document.getElementById('questionYear').textContent = question.year;
        document.getElementById('questionYear').style.display = 'inline-block';
    } else {
        document.getElementById('questionYear').style.display = 'none';
    }
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('questionText').textContent = question.question;
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (userAnswers[currentQuestionIndex] === index) optionDiv.classList.add('selected');
        const letter = String.fromCharCode(65 + index);
        optionDiv.innerHTML = `<div class="option-letter">${letter}</div><div class="option-text">${option}</div>`;
        optionDiv.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionDiv);
    });
    updateBookmarkButton();
    updateFlagButton();
    updateNavigationButtons();
    if (document.getElementById('timerToggle').checked) resetTimer();
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
    if (bookmarkedQuestions.has(currentQ.id)) btn.classList.add('active'); else btn.classList.remove('active');
}

function updateFlagButton() {
    const btn = document.getElementById('flagBtn');
    if (flaggedQuestions.has(currentQuestionIndex)) btn.classList.add('active'); else btn.classList.remove('active');
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
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }
    clearInterval(timerInterval);
    totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
    showResults();
}

function showResults() {
    let correct = 0;
    currentQuestions.forEach((q, index) => {
        if (userAnswers[index] === q.correct) correct++;
    });
    const total = currentQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    updateStats(correct, total);
    const subjectName = selectedSubject === 'AMA' ? 'Advanced Management Accounting' : 'Corporate Law';
    document.getElementById('subjectResult').textContent = subjectName;
    document.getElementById('scorePercentage').textContent = percentage + '%';
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = total - correct;
    const minutes = Math.floor(totalTimeSpent / 60);
    const seconds = totalTimeSpent % 60;
    document.getElementById('timeTaken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    animateScoreRing(percentage);
    showPerformanceMessage(percentage);
    showScreen('resultsScreen');
}

function animateScoreRing(percentage) {
    const ring = document.getElementById('scoreRing');
    const circumference = 339.292;
    const offset = circumference - (percentage / 100) * circumference;
    setTimeout(() => {ring.style.strokeDashoffset = offset;}, 100);
}

function showPerformanceMessage(percentage) {
    const messageDiv = document.getElementById('performanceMessage');
    let message, emoji;
    if (percentage >= 90) {emoji = '🌟'; message = 'Excellent! Outstanding performance!';}
    else if (percentage >= 75) {emoji = '🎉'; message = 'Great job! Strong understanding!';}
    else if (percentage >= 60) {emoji = '👍'; message = 'Good work! Keep practicing!';}
    else if (percentage >= 40) {emoji = '📚'; message = 'Fair attempt! Review and try again!';}
    else {emoji = '💪'; message = 'Keep trying! More practice needed!';}
    messageDiv.innerHTML = `<p>${emoji} ${message}</p>`;
}

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
    div.innerHTML = `<div class="review-question-header"><span class="review-question-number">Question ${index + 1}</span><div class="review-status">${question.year ? `<span class="status-badge">${question.year}</span>` : ''}${isBookmarked ? '<span class="status-badge">🔖 Bookmarked</span>' : ''}<span class="status-badge ${isCorrect ? 'correct' : 'wrong'}">${isCorrect ? '✓ Correct' : '✗ Wrong'}</span></div></div><div class="review-question-text">${question.question}</div><div class="review-options">${optionsHTML}</div>${question.explanation ? `<div class="performance-message"><strong>💡 Explanation:</strong> ${question.explanation}</div>` : ''}`;
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
            case 'correct': show = item.dataset.status === 'correct'; break;
            case 'wrong': show = item.dataset.status === 'wrong'; break;
            case 'bookmarked': show = item.dataset.bookmarked === 'true'; break;
            case 'all': default: show = true;
        }
        item.classList.toggle('hidden', !show);
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {screen.classList.remove('active');});
    document.getElementById(screenId).classList.add('active');
}

function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.dataset.subject;
            selectSubject(subject);
        });
    });
    document.getElementById('backToSubjects').addEventListener('click', () => {showScreen('subjectScreen');});
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitQuiz);
    document.getElementById('bookmarkBtn').addEventListener('click', toggleBookmark);
    document.getElementById('flagBtn').addEventListener('click', toggleFlag);
    document.getElementById('reviewBtn').addEventListener('click', showReview);
    document.getElementById('retryBtn').addEventListener('click', () => {showScreen('startScreen'); loadStats();});
    document.getElementById('homeBtn').addEventListener('click', () => {showScreen('subjectScreen'); loadAllStats();});
    document.getElementById('backToResultsBtn').addEventListener('click', () => {showScreen('resultsScreen');});
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {filterReview(btn.dataset.filter);});
    });
}
