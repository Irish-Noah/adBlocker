// content.js

// Function to block YouTube ads by removing known ad-related DOM elements
function blockAds() {
  // Block overlay ads (e.g., the "Skip Ads" overlay)
  const adOverlays = document.querySelectorAll('.ytp-ad-overlay-container, .ytp-ad-player-overlay');
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
  ];

  // Loop through all popup selectors and remove matching elements
  popupSelectors.forEach(selector => {
    const popups = document.querySelectorAll(selector);
    popups.forEach(popup => popup.remove());
  });
}

// Run the blockAds and blockPopups functions every second after the page loads
window.addEventListener('load', function() {
  setInterval(() => {
    blockAds();
    blockPopups();
  }, 1000); // Check every 1 second for new popups or ads
});
