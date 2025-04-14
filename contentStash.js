// content.js

// Function to block YouTube ads by removing known ad-related DOM elements
function blockAds() {
  // Block overlay ads (e.g., the "Skip Ads" overlay)
  //const adOverlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-player-overlay, ytd-ad-slot-renderer');
  //adOverlays.forEach(ad => ad.remove());

  console.log("[🧩 MyExt] Running from the mutation");

  const inGridAds = document.querySelectorAll('ytd-rich-item-renderer');
  inGridAds.forEach(ad => {
    // Check if the item contains an ad slot
    if (ad.querySelector('ytd-ad-slot-renderer')) {
      ad.remove(); // Remove the entire grid item
      console.log("[🧩 MyExt] Removed ad slot renderer.");
    }
  });

  const nonNestedAds = document.querySelectorAll('ytd-ad-slot-renderer', 'ytd-rich-item-renderer', 'ytd-rich-section-renderer', 'masthead-ad', 
    'ytd-search-pyv-renderer', 'ytd-search-pyv-renderer', 'ytd-promoted-video-renderer')
  nonNestedAds.forEach(ad => ad.remove());

  const shelfSpace = document.querySelectorAll('ytd-reel-shelf-renderer', 'ytd-rich-shelf-renderer', 'ytd-rich-section-renderer')
  shelfSpace.forEach(ad => ad.remove());

  /*const dismissableShelfAds = document.querySelectorAll('ytd-rich-section-renderer')
  dismissableShelfAds.forEach(ad => ad.remove());

  const topLevelAd = document.querySelectorAll('masthead-ad')
  topLevelAd.forEach(ad => ad.remove());

  const inSearchTopAd = document.querySelectorAll('ytd-search-pyv-renderer')
  inSearchTopAd.forEach(ad => ad.remove());*/

  // Block in-video ads (e.g., skippable video ads)
  //const inVideoAds = document.querySelectorAll('.video-ads, .ytp-ad-module');
  //inVideoAds.forEach(ad => ad.remove());

  // Block any iframe with ad-related URLs
  //const iframes = document.querySelectorAll('iframe');
  //iframes.forEach(iframe => {
    //if (iframe.src.includes('googleads') || iframe.src.includes('doubleclick.net')) {
      //iframe.remove();
    //}
  //});
}


// Use MutationObserver to dynamically watch for new popups
function observeMutations() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        blockAds();
        console.log("is this thing on?")
      }
    }
  });

  const videoGrid = document.getElementById('contents');
  if (videoGrid) {
    observer.observe(videoGrid, { childList: true, subtree: true });
  }
}

// Run the blockAds and blockPopups functions every second after the page loads
window.addEventListener('load', function() {
  blockAds();
  observeMutations();
});
