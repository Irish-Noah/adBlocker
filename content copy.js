// content.js

// Function to block YouTube ads by removing known ad-related DOM elements
function blockAds() {
  // Block overlay ads (e.g., the "Skip Ads" overlay)
  const adOverlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-player-overlay, style-scope ytd-ad-slot-renderer');
  adOverlays.forEach(ad => ad.remove());

  // Block in-video ads (e.g., skippable video ads)
  const inVideoAds = document.querySelectorAll('.video-ads, .ytp-ad-module');
  inVideoAds.forEach(ad => ad.remove());

  // Block any iframe with ad-related URLs
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    if (iframe.src.includes('googleads') || iframe.src.includes('doubleclick.net')) {
      iframe.remove();
    }
  });
}

// Function to block common popup elements (e.g., "Turn off Adblock" or "Join our newsletter")
function blockPopups() {
  // Popup and modal selectors (can be adjusted for specific websites)
  const popupSelectors = [
    '.adblock-popup', // Common adblock detection popup
    '.adblock-banner', // Another adblock detection banner
    '.popup', // General popup class
    '.modal', // General modal class
    '.newsletter-popup', // Newsletter signup popups
    '.cookie-banner', // Cookie consent banners that could block content
    '.subscription-popup', // Subscriptions popups
    '.overlay', // Overlay modal popups
    '.notifications-placeholder',  // Target notifications-placeholder div
    '.sitenotice-wrapper',          // Add any additional notification wrappers if needed
    '.banner-notifications-placeholder', // Target banner notifications if applicable
    '.marketing-notifications',
    'yt-simple-endpoint style-scope ytd-video-masthead-ad-primary-video-renderer'
  ];

  // Loop through all popup selectors and remove matching elements
  popupSelectors.forEach(selector => {
    const popups = document.querySelectorAll(selector);
    popups.forEach(popup => {
      //popup.style.display = "none"; 
      popup.remove()
    });
  });
}

// Use MutationObserver to dynamically watch for new popups
function observeMutations() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        blockPopups(); // Re-check and remove popups
        blockAds();
      }
    }
  });

  // Start observing the body element for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Run the blockAds and blockPopups functions every second after the page loads
window.addEventListener('load', function() {
  blockPopups();
  blockAds();
  observeMutations();
});
