const mainTimer = document.getElementById("mainTimer");
const lapTimer = document.getElementById("lapTimer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const flagBtn = document.getElementById("flagBtn");
const lapList = document.getElementById("lapList");

let time = 0;
let initialState = true;
let isPaused = false;
let flags = [];
let timer = null;

function reprTime(ms) {
    const date = new Date(Date.UTC(0,0,0,0,0,0,ms));
    return `${String(date.getUTCMinutes()).padStart(2, "0")}:${String(date.getUTCSeconds()).padStart(2, "0")}.${String((date.getUTCMilliseconds()/10)).padStart(2, "0")}`;

}

function startTimer() {
    timer = setInterval(function () {
        mainTimer.textContent = reprTime(time);
        lapTimer.textContent = reprTime(time - flags.at(-1));
        time += 10; 
    }, 10);
}

function pauseTimer() {
    isPaused = true;
    clearInterval(timer);
    timer = null;
}

function resumeTimer() {
    isPaused = false;
    startTimer();
}

function setFlag() {
    let _flagAt = time;
    let _index = document.createElement("span");
    _index.textContent = String(flags.length).padStart(2, "0");
    let _checkpoint = document.createElement("span");
    _checkpoint.textContent = reprTime(_flagAt);
    let _difference = document.createElement("span");
    _difference.textContent = "+" + reprTime(_flagAt - flags.at(-1));
    let _flagListItem = document.createElement("li");
    _flagListItem.classList.add("lapItem");
    _flagListItem.appendChild(_index);
    _flagListItem.appendChild(_checkpoint);
    _flagListItem.appendChild(_difference);
    lapList.appendChild(_flagListItem);
    flags.push(_flagAt);
}

startBtn.addEventListener("click", () => {
    if(!initialState && isPaused){
        resumeTimer();
        startBtn.firstChild.classList.remove("fa-play");
        startBtn.firstChild.classList.add("fa-pause");
        resetBtn.disabled = true;
    } else if(!initialState && !isPaused){
        pauseTimer();
        startBtn.firstChild.classList.remove("fa-pause");
        startBtn.firstChild.classList.add("fa-play");
        resetBtn.disabled = false;
    }
    if(initialState) {
        initialState = false;
        time = 0;
        flags.push(0);
        startBtn.firstChild.classList.remove("fa-play");
        startBtn.firstChild.classList.add("fa-pause");
        startTimer();
        resetBtn.disabled = true;
    }
});

flagBtn.addEventListener("click", () => {
    if(!initialState) {
        setFlag();
    }
});

resetBtn.addEventListener("click", () => {
    isPaused = false;
    if(!initialState) {
        initialState = true;
        clearInterval(timer);
    }
    time = 0;
    flags = [];
    timer = null;
    lapList.innerHTML = "";
    mainTimer.textContent = reprTime(0);
    lapTimer.textContent = reprTime(0);
});

