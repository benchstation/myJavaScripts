// Script for custom audio player
const audio = document.getElementById('audioplayer');
const playButton = document.querySelector('.btn-play');
const seekbar = document.querySelector('.progress-slider');
const volButton = document.querySelector('.volume-button');
const volContainer = document.querySelector('.volume-container');

function playPause() {
    if (audio.paused) {
        audio.play();
        playButton.textContent = '||';
    } else {
        audio.pause();
        playButton.textContent = '>'; 
    }
}

/* Updates the progress based on where the user moves along the bar */
function changeProgress(value) {
    // Calculates the new time based on the percentage
    let newTime = (value / 100) * audio.duration;
    audio.currentTime = newTime;
}

audio.addEventListener('timeupdate', function() {
    seekbar.value = (audio.currentTime / audio.duration) * 100;

    // Update the time display
    let currentTime = formatTime(audio.currentTime);
    let totalDuration = formatTime(audio.duration);
    document.querySelector('.time-display').textContent = `${currentTime} / ${totalDuration}`;
});

// Format time (mm:ss)
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// --------------------- Volume Buttons (+/-) ---------------------- //
    function increaseVolume() {
        if (audio.volume < 1) {
            audio.volume += 0.1;
        }
    }

    function decreaseVolume() {
        if (audio.volume > 0) {
            audio.volume -= 0.1;
        }
    }

// ------------------------- Volume Slider (Incomplete) ------------------------- //

function changeVolumeSlider(value) {
    audio.volume = parseFloat(value);
}

function expandButton() {
    // console.log("~ expandButton() Ran ~");


    volButton.style.flexGrow = '1';
    volContainer.classList.add('expanded');
}

function collapseButton() {
    // console.log("~ collapseButton() Ran ~");

    // Making sure the collapseButton function is not triggered when moving from the button to the slider
    if (!volContainer.contains(document.activeElement)) {
        volButton.style.flexGrow = '0';
        volContainer.classList.remove('expanded');
    }
}
