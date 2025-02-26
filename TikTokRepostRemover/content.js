function removeRepostedVideos() {
    console.log("Scanning for reposted videos...");

    // Find the repost button (yellow repost icon)
    const repostButton = document.querySelector('a[data-e2e="video-share-repost"]');

    if (repostButton) {
        console.log("Found a reposted video. Removing repost...");

        // Click the repost button to remove the repost
        repostButton.click();

        setTimeout(() => {
            console.log("Repost removed successfully. Moving to the next video...");

            // Click the "next video" button to scroll down
            goToNextVideo();
        }, 500);
    } else {
        console.log("No reposted video found. Moving to the next video...");
        goToNextVideo();
    }
}

// Function to click the "next video" button
function goToNextVideo() {
    const nextButton = document.querySelector('button[data-e2e="arrow-right"]');

    if (nextButton) {
        nextButton.click();
        console.log("Next video loaded. Checking for repost...");
    } else {
        console.log("Next button not found. End of videos?");
    }

    // Wait 3 seconds before scanning the next video
    setTimeout(removeRepostedVideos, 3000);
}

// Run script automatically when TikTok loads
window.onload = () => {
    console.log("TikTok Repost Remover started...");
    removeRepostedVideos();
};
