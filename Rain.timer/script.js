// System Configurations & Core States
let isWorking = false;
let workSecondsDone = 0;
let targetHours = 8;
let totalShiftSeconds = targetHours * 3600;

let timerInterval = null;
let breakStartPeriod = null;

// DOM Anchors
const timeDoneDisplay = document.getElementById('timeDoneDisplay');
const timeLeftDisplay = document.getElementById('timeLeftDisplay');
const currentClock = document.getElementById('currentClock');
const leaveClock = document.getElementById('leaveClock');
const mainBtn = document.getElementById('mainBtn');
const resetBtn = document.getElementById('resetBtn');
const logList = document.getElementById('logList');
const gearBtn = document.getElementById('gearBtn');
const settingsPanel = document.getElementById('settingsPanel');
const shiftInput = document.getElementById('shiftInput');

// Settings Selectors for Rain Layers
const rainToggle = document.getElementById('rainToggle');
const splatToggleInput = document.getElementById('splatToggleInput');
const backRowToggleInput = document.getElementById('backRowToggleInput');

// Rain Row Containers
const frontRow = document.querySelector('.rain.front-row');
const backRow = document.querySelector('.rain.back-row');

/* ==========================================================================
   1. YOUR CUSTOM RAIN GENERATOR ENGINE (Converted to Pure Vanilla JS)
   ========================================================================== */
var makeItRain = function() {
    // Clear out everything first
    frontRow.innerHTML = '';
    backRow.innerHTML = '';

    // If the master rain switch is turned off in settings, stop rendering drops
    if (!rainToggle.checked) return;

    var increment = 0;
    var drops = "";
    var backDrops = "";

    while (increment < 100) {
        var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
        var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
        increment += randoFiver;
        
        // Formulate procedural HTML structures using randomized values for variety
        drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
        backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
    }

    frontRow.innerHTML = drops;
    backRow.innerHTML = backDrops;
};

/* ==========================================================================
   2. SYSTEM CLOCKS AND TIMELINE LOG ENGINE
   ========================================================================== */
function updateLiveClocks() {
    const now = new Date();
    currentClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Freedom Clock: Current Time + Remaining Needed Work Time
    const remainingSeconds = Math.max(0, totalShiftSeconds - workSecondsDone);
    if (remainingSeconds > 0) {
        const leaveTime = new Date(now.getTime() + remainingSeconds * 1000);
        leaveClock.textContent = leaveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } else {
        leaveClock.textContent = "Freedom!";
    }
}
setInterval(updateLiveClocks, 1000);
updateLiveClocks();

// Format numbers into standard HH:MM:SS
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
}

function appendLog(text, typeClass) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const li = document.createElement('li');
    li.className = `log-item ${typeClass}`;
    li.textContent = `[${timeStr}] ${text}`;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight; // Autoscroll to bottom
}

/* ==========================================================================
   3. BUTTON INTERACTION & EVENT LISTENERS
   ========================================================================== */
mainBtn.addEventListener('click', () => {
    isWorking = !isWorking;

    if (isWorking) {
        // Mode: WORKING (Rain falls naturally)
        mainBtn.textContent = 'Take Break';
        mainBtn.classList.add('working');
        document.body.classList.remove('rain-reverse');

        // Check if returning from a break to compute exact elapsed break length
        if (breakStartPeriod) {
            const breakDurationMs = new Date() - breakStartPeriod;
            const breakSecs = Math.floor(breakDurationMs / 1000);
            const mins = Math.floor(breakSecs / 60);
            const secs = breakSecs % 60;
            appendLog(`Back to work. Break lasted: ${mins}m ${secs}s.`, 'work-event');
            breakStartPeriod = null;
        } else {
            appendLog('Clocked In / Shift Started.', 'work-event');
        }

        // Run the workspace clock accumulation loop
        timerInterval = setInterval(() => {
            workSecondsDone++;
            renderDisplays();
        }, 1000);

    } else {
        // Mode: BREAK (Rain flies inversely skyward)
        mainBtn.textContent = 'Resume Work';
        mainBtn.classList.remove('working');
        document.body.classList.add('rain-reverse');
        
        breakStartPeriod = new Date();
        clearInterval(timerInterval);
        appendLog('Break started.', 'break-event');
    }
    
    // Refresh the weather elements to update positional css configurations
    makeItRain();
});

resetBtn.addEventListener('click', () => {
    if (confirm("Reset entire session records? This clears today's totals.")) {
        clearInterval(timerInterval);
        isWorking = false;
        workSecondsDone = 0;
        breakStartPeriod = null;
        
        // Reset element states
        mainBtn.textContent = 'Start Work';
        mainBtn.classList.remove('working');
        document.body.classList.add('rain-reverse'); // Back to starting state
        
        logList.innerHTML = '<li class="log-item">Session reset. Ready to track.</li>';
        
        renderDisplays();
        updateLiveClocks();
        makeItRain();
    }
});

/* ==========================================================================
   4. GEAR PANEL & LIVE TOGGLE ACTION HUB
   ========================================================================== */
gearBtn.addEventListener('click', () => settingsPanel.classList.toggle('active'));

// Dynamic Shift Hours configuration changer
shiftInput.addEventListener('change', () => {
    targetHours = parseFloat(shiftInput.value) || 8;
    totalShiftSeconds = targetHours * 3600;
    renderDisplays();
    updateLiveClocks();
});

// Master Rain Filter Toggle
rainToggle.addEventListener('change', () => {
    if (rainToggle.checked) {
        frontRow.style.opacity = '1';
        backRow.style.opacity = '1';
    } else {
        frontRow.style.opacity = '0';
        backRow.style.opacity = '0';
    }
    makeItRain();
});

// Splat / Splash Layer Filter Trigger
splatToggleInput.addEventListener('change', () => {
    document.body.classList.toggle('splat-toggle', splatToggleInput.checked);
    makeItRain();
});

// Deep Back Row Visibility Layer Trigger
backRowToggleInput.addEventListener('change', () => {
    document.body.classList.toggle('back-row-toggle', backRowToggleInput.checked);
    makeItRain();
});

/* ==========================================================================
   5. INITIAL SYSTEM BOOTSTRAP
   ========================================================================== */
// Initialize app elements
document.body.classList.add('rain-reverse'); // Initially upside down since we haven't hit "Start Work"
renderDisplays();
makeItRain();
