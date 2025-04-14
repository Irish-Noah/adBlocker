function blockAds() {
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
  
  // Watch for new elements in the grid
  function observeGrid() {
    const grid = document.querySelector('#contents');
  
    if (!grid) {
      console.log('[🧩 MyExt] #contents not found, retrying...');
      setTimeout(observeGrid, 500); // retry until the grid is available
      return;
    }
  
    const observer = new MutationObserver(() => {
      blockAds();
    });
  
    observer.observe(grid, { childList: true, subtree: true });
    console.log('[🧩 MyExt] MutationObserver is active on #contents');
  }
  
  // Handle SPA (URL) changes
  function observeUrlChanges() {
    let lastUrl = location.href;
  
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        console.log('[🧩 MyExt] URL changed:', currentUrl);
        lastUrl = currentUrl;
        setTimeout(() => {
          blockAds();
          observeGrid();
        }, 1000); // delay to allow YouTube to render the new content
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  
  // DOM ready entry point
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[🧩 MyExt] DOM ready — initializing...');
    blockAds();
    observeGrid();
    observeUrlChanges();
  });
  