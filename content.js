/*
  Responsible for blocking grid and shelf ads like sponsored videos and youtube shorts
*/
function blockGridAds() {
  // print statements for debuggings TODO: remove later
  console.log("[🧩 MyExt] Running blockAds");

  let totalRemoved = 0;

  // Grid ads
  document.querySelectorAll('ytd-rich-item-renderer').forEach(item => {
    if (item.querySelector('ytd-ad-slot-renderer')) {
      console.log("[🧩 MyExt] Removed a grid ad");
      item.remove();
      totalRemoved++;
    }
  });

  // Direct ad elements
  const adSelectors = [
    'ytd-ad-slot-renderer',
    'ytd-rich-section-renderer',
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer',
    'masthead-ad',
    'ytd-search-pyv-renderer',
    'ytd-promoted-video-renderer',
    'ytd-compact-promoted-video-renderer', 
    'ytd-display-ad-renderer',              
    'ytd-video-masthead-ad-v3-renderer'    
  ];

  adSelectors.forEach(selector => {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      console.log(`[🧩 MyExt] Found ${nodes.length} elements for selector: ${selector}`);
    }
    nodes.forEach(el => {
      el.remove();
      totalRemoved++;
    });
  });

  // Check for videos with "Ad" badge
  document.querySelectorAll('ytd-video-renderer, ytd-compact-video-renderer').forEach(el => {
    const badge = el.querySelector('#badge .ytd-badge-supported-renderer');
    if (badge && badge.textContent.toLowerCase().includes('ad')) {
      el.remove();
      console.log("[🧩 MyExt] Removed promoted video with badge");
      totalRemoved++;
    }
  });

  console.log(`[🧩 MyExt] Total elements removed this run: ${totalRemoved}`);
}
  

/*
  Responsible for removing the in video ad elements
  Bonus of auto skipping without clicking if the ad can't be removed by element
*/
function blockInVideoAds() {
  const inVideoAdSelectors = [
    '.ytp-ad-module',                 
    '.video-ads',                    
    '.ytp-ad-overlay-container',     
    '.ytp-ad-player-overlay'          
  ];
  
  inVideoAdSelectors.forEach(selector => {
    const nodes = document.querySelectorAll(selector);
    if (nodes.length > 0) {
      console.log(`[🧩 MyExt] Found ${nodes.length} in-video ad element(s): ${selector}`);
    }
    nodes.forEach(node => {
      node.remove();
    });
  });

  // Possibly skip the ad automatically if not deleted 
  const skipButton = document.querySelector('.ytp-ad-skip-button');
  if (skipButton) {
    console.log("[🧩 MyExt] Clicking 'Skip Ad' button");
    skipButton.click();
  }
}

  
/*
  Responsible for watching for new elements in the grid to be removed
*/
function observeGrid() {
  const grid = document.querySelector('#contents');

  if (!grid) {
    console.log('[🧩 MyExt] #contents not found, retrying...');
    setTimeout(observeGrid, 500); // retry until the grid is available
    return;
  }

  const observer = new MutationObserver(() => {
    blockGridAds();
  });

  observer.observe(grid, { childList: true, subtree: true });
  console.log('[🧩 MyExt] MutationObserver is active on #contents');
}
  

/*
  Responsible for running the code on URL changes
*/
function observeUrlChanges() {
  let lastUrl = location.href;

  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      console.log('[🧩 MyExt] URL changed:', currentUrl);
      lastUrl = currentUrl;
      setTimeout(() => {
        blockGridAds();
        blockInVideoAds();
        observeGrid();
      }, 1000); // delay to allow YouTube to render the new content
    }
  }).observe(document.body, { childList: true, subtree: true });
}


// DOM ready entry point
document.addEventListener('DOMContentLoaded', () => {
    console.log('[🧩 MyExt] DOM ready — initializing...');
    blockGridAds();
    observeGrid();
    observeUrlChanges();
});
  