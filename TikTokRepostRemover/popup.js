let isRunning = false;
let intervalId = null;

document.getElementById("start").addEventListener("click", () => {
    isRunning = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: startRepostRemoval
        });
    });
});

document.getElementById("stop").addEventListener("click", () => {
    isRunning = false;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: stopRepostRemoval
        });
    });
});

// Function injected into TikTok to start the removal process
function startRepostRemoval() {
    console.log("Starting repost removal...");

    if (window.tiktokRepostInterval) {
        console.log("Already running!");
        return;
    }

    function scanAndRemove() {
        if (!window.tiktokRepostRunning) return;

        const repostButton = document.querySelector('a[data-e2e="video-share-repost"]');

        if (repostButton) {
            console.log("Found a reposted video. Removing repost...");
            repostButton.click();
            setTimeout(() => {
                console.log("Repost removed. Moving to next video...");
                goToNextVideo();
            }, 500);
        } else {
            console.log("No reposted video found. Moving to next video...");
            goToNextVideo();
        }
    }

    function goToNextVideo() {
        if (!window.tiktokRepostRunning) return;

        const nextButton = document.querySelector('button[data-e2e="arrow-right"]');
        if (nextButton) {
            nextButton.click();
            console.log("Next video loaded. Checking for repost...");
        } else {
            console.log("Next button not found. End of videos?");
        }

        setTimeout(scanAndRemove, 3000);
    }

    window.tiktokRepostRunning = true;
    window.tiktokRepostInterval = setInterval(scanAndRemove, 3000);
}

// Function injected into TikTok to stop the removal process
function stopRepostRemoval() {
    console.log("Stopping repost removal...");
    if (window.tiktokRepostInterval) {
        clearInterval(window.tiktokRepostInterval);
        window.tiktokRepostInterval = null;
        window.tiktokRepostRunning = false;
    }
}
