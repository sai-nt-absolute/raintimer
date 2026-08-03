// System Configurations & Core Active Tracking Variables
let isWorking = false;
let workSecondsDone = 0;
let accumulatedBreakSeconds = 0;
let totalShiftSeconds = 8 * 3600; 

let timerInterval = null;
let currentBreakStart = null;
let breakSequenceCounter = 0;
let matrixInterval = null;

// DOM Element Anchors
const timeDoneDisplay = document.getElementById('timeDoneDisplay');
const timeLeftDisplay = document.getElementById('timeLeftDisplay');
const currentClock = document.getElementById('currentClock');
const leaveClock = document.getElementById('leaveClock');
const mainBtn = document.getElementById('mainBtn');
const resetBtn = document.getElementById('resetBtn');
const breakLogBody = document.getElementById('breakLogBody');
const totalBreakDisplay = document.getElementById('totalBreakDisplay');

// Input Configurations Anchors
const hrInput = document.getElementById('hrInput');
const minInput = document.getElementById('minInput');
const setTargetBtn = document.getElementById('setTargetBtn');

// Modal Framework Bindings
const gearBtn = document.getElementById('gearBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const themeCards = document.querySelectorAll('.theme-select-card');

// Rain Engine Anchors
const frontRow = document.querySelector('.rain.front-row');
const backRow = document.querySelector('.rain.back-row');

// Matrix Code Engine Background Canvas Properties
const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let cols = Math.floor(w / 20) + 1;
let ypos = Array(cols).fill(0);

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w / 20) + 1;
    ypos = Array(cols).fill(0);
});

/* ==========================================================================
   1. LIVE CLOCKS AND TIME METRICS CONVERSIONS
   ========================================================================== */
function updateLiveClocks() {
    const now = new Date();
    currentClock.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const remainingSeconds = Math.max(0, totalShiftSeconds - workSecondsDone);
    if (remainingSeconds > 0) {
        const leaveTime = new Date(now.getTime() + (remainingSeconds * 1000));
        leaveClock.textContent = leaveTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
        leaveClock.textContent = "Freedom!";
    }
}
setInterval(updateLiveClocks, 1000);
updateLiveClocks();

function formatTime(totalSecs) {
    const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const s = String(totalSecs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function renderDisplays() {
    timeDoneDisplay.textContent = formatTime(workSecondsDone);
    const remaining = Math.max(0, totalShiftSeconds - workSecondsDone);
    timeLeftDisplay.textContent = formatTime(remaining);
    totalBreakDisplay.textContent = formatTime(accumulatedBreakSeconds);
}

/* ==========================================================================
   2. CORE ENVIRONMENTAL FX RENDERING ENGINE
   ========================================================================== */
function renderMatrixFrame() {
    // 1. Maintain the pitch-black trail rendering setup
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'; 
    ctx.fillRect(0, 0, w, h);
    
    // 2. Read active break state to update color tracking rules dynamically
    const isBreakMode = !isWorking; 
    
    if (isBreakMode) {
        // Break Mode: Vibrant glowing red Matrix stream
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'; 
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    } else {
        // Focus Mode: Classic matrix green streaming baseline
        ctx.fillStyle = 'rgba(52, 211, 153, 0.8)'; 
        ctx.shadowBlur = 0; // Disable blur during focus for high clarity
    }
    
    ctx.font = '15pt monospace';
    
    ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        
        // 3. Render the falling text node character stream
        ctx.fillText(text, x, y);
        
        // 4. Direction flow routing calculations
        if (isBreakMode) {
            // Flow in Reverse: Move the Y coordinates upward (-20px)
            if (y < 0 && Math.random() > 0.975) {
                ypos[ind] = h; // Reset back down to the bottom viewport floor
            } else {
                ypos[ind] = y - 20;
            }
        } else {
            // Standard Flow: Move the Y coordinates downward (+20px)
            if (y > 100 + Math.random() * 10000) {
                ypos[ind] = 0; // Reset back up to the ceiling header row
            } else {
                ypos[ind] = y + 20;
            }
        }
    });
    
    // Reset canvas global shadow options state after drawing frame loops finishes
    ctx.shadowBlur = 0;
}

const generateRainFx = function() {
    frontRow.innerHTML = '';
    backRow.innerHTML = '';
    const activeTheme = document.body.getAttribute('data-theme');
    
    if (activeTheme !== 'astral' && activeTheme !== 'ambient' && activeTheme !== 'light') return;

    let increment = 0;
    let drops = "";
    let backDrops = "";

    while (increment < 100) {
        let randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        
        // Scarce Snow Logic: Keeps the snowflake count minimal and clean
        let randoFiver = (Math.floor(Math.random() * (14 - 8 + 1) + 8));
        increment += randoFiver;
        
        let primaryPrefix = '1.2';
        let subPrefix = '1.2';
        
        if (activeTheme === 'ambient') {
            primaryPrefix = '0.5';
            subPrefix = '0.5';
            
            drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: ' + primaryPrefix + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div></div>';
            backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: ' + primaryPrefix + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div></div>';
        
        } else if (activeTheme === 'light') {
            // Anti-Wave Solution: Unique speed formula per snowflake
            let randoSpeed = (Math.random() * (6.5 - 3.0) + 3.0).toFixed(2);
            // Positive Staggered Delay: Forces particles to wait and spawn strictly at the screen boundaries
            let randoDelay = (Math.random() * 4).toFixed(2);
            
            drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: ' + randoDelay + 's; animation-duration: ' + randoSpeed + 's;"><div class="stem"></div><div class="splat"></div></div>';
            backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: ' + randoDelay + 's; animation-duration: ' + randoSpeed + 's;"><div class="stem"></div><div class="splat"></div></div>';
        
        } else {
            // Default Astral theme setting configurations
            drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: ' + primaryPrefix + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div></div>';
            backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: ' + primaryPrefix + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: ' + subPrefix + randoHundo + 's;"></div></div>';
        }
    }

    frontRow.innerHTML = drops;
    backRow.innerHTML = backDrops;
};

function updateAmbientBackgroundEffects() {
    clearInterval(matrixInterval);
    matrixInterval = null;
    frontRow.style.opacity = '0';
    backRow.style.opacity = '0';
    canvas.style.display = 'none';

    if (!isWorking && currentBreakStart === null) return;

    const activeTheme = document.body.getAttribute('data-theme');
    if (activeTheme === 'matrix') {
        canvas.style.display = 'block';
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
        matrixInterval = setInterval(renderMatrixFrame, 50);
    } else if (activeTheme === 'astral' || activeTheme === 'ambient' || activeTheme === 'light') {
        frontRow.style.opacity = '1';
        backRow.style.opacity = '1';
        generateRainFx();
    }
}

/* ==========================================================================
   3. EVENT CALL INTERFACES & SESSION STORAGE IMPLEMENTATION
   ========================================================================== */
setTargetBtn.addEventListener('click', () => {
    const hours = parseInt(hrInput.value) || 0;
    const minutes = parseInt(minInput.value) || 0;
    totalShiftSeconds = (hours * 3600) + (minutes * 60);
    if (totalShiftSeconds <= 0) totalShiftSeconds = 3600; 
    renderDisplays();
    updateLiveClocks();
});

function logCompletedBreak(startTime, endTime) {
    const placeholder = document.getElementById('emptyPlaceholder');
    if (placeholder) placeholder.remove();

    breakSequenceCounter++;
    const startStr = startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const endStr = endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const diffSeconds = Math.floor((endTime - startTime) / 1000);
    accumulatedBreakSeconds += diffSeconds;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td style="color: var(--text-slate); text-align: center;">${breakSequenceCounter}</td>
        <td>${startStr}</td>
        <td>${endStr}</td>
        <td style="color: var(--ui-amber); font-weight: 600;">${formatTime(diffSeconds)}</td>
    `;
    
    breakLogBody.insertBefore(row, breakLogBody.firstChild);
    renderDisplays();
}

mainBtn.addEventListener('click', () => {
    isWorking = !isWorking;

    if (isWorking) {
        mainBtn.textContent = 'Take Break';
        mainBtn.classList.add('working');
        document.body.classList.remove('rain-reverse');

        if (currentBreakStart) {
            logCompletedBreak(currentBreakStart, new Date());
            currentBreakStart = null;
        }

        timerInterval = setInterval(() => {
            workSecondsDone++;
            renderDisplays();
        }, 1000);
    } else {
        mainBtn.textContent = 'Resume';
        mainBtn.classList.remove('working');
        document.body.classList.add('rain-reverse');
        
        currentBreakStart = new Date();
        clearInterval(timerInterval);
    }
    updateAmbientBackgroundEffects();
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isWorking = false;
    workSecondsDone = 0;
    accumulatedBreakSeconds = 0;
    currentBreakStart = null;
    breakSequenceCounter = 0;
    
    mainBtn.textContent = 'Start Shift';
    mainBtn.classList.remove('working');
    document.body.classList.remove('rain-reverse');
    
    breakLogBody.innerHTML = `
        <tr id="emptyPlaceholder">
            <td colspan="4" class="empty-placeholder-text">No workplace break events logged for this focus session.</td>
        </tr>
    `;
    
    renderDisplays();
    updateLiveClocks();
    updateAmbientBackgroundEffects();
});

gearBtn.addEventListener('click', () => settingsModal.classList.add('active'));
closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('active'));
settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.remove('active'); });

// Loop to apply changes and store selection tokens safely
themeCards.forEach(card => {
    card.addEventListener('click', () => {
        const targetThemeValue = card.getAttribute('data-value');
        applyThemeProfile(targetThemeValue);
    });
});

// Centralized management function to apply themes and synchronize modal state tags
function applyThemeProfile(themeValue) {
    themeCards.forEach(c => {
        if (c.getAttribute('data-value') === themeValue) {
            c.classList.add('active');
        } else {
            c.classList.remove('active');
        }
    });
    
    document.body.setAttribute('data-theme', themeValue);
    sessionStorage.setItem('selectedRainTimerTheme', themeValue);

    updateAmbientBackgroundEffects();
    renderDisplays();
}

/* ==========================================================================
   INITIALIZATION BOOTSTRAP
   ========================================================================== */
// Check for stored keys or fall back explicitly to ambient rain as system baseline rule
const cachedTheme = sessionStorage.getItem('selectedRainTimerTheme') || 'ambient';
applyThemeProfile(cachedTheme);
