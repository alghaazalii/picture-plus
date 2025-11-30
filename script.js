const pages = document.querySelectorAll('.page');
const header = document.getElementById('globalHeader');
const logoText = document.getElementById('logoText');
const tap1 = document.getElementById('tap1');
const tap2 = document.getElementById('tap2');
const descElement = document.getElementById('desc');

let isTyping = false;

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
const lazyLoadConfig = {
  rootMargin: '100px',
  threshold: 0.01
};

const lazyImageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');
      
      if (src) {
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('lazy-loaded');
        };
        tempImg.onerror = () => {
          console.error('Failed to load image:', src);
        };
        tempImg.src = src;
        observer.unobserve(img);
      }
    }
  });
}, lazyLoadConfig);

function preloadActivePageImages(pageElement) {
  if (!pageElement) return;
  
  const lazyImages = pageElement.querySelectorAll('img.lazy');
  lazyImages.forEach((img, index) => {
    if (index < 5) {
      // Load first 5 images immediately
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.classList.remove('lazy');
        img.classList.add('lazy-loaded');
      }
    } else {
      // Observe the rest
      lazyImageObserver.observe(img);
    }
  });
}

// Preload images on initial load
window.addEventListener('DOMContentLoaded', () => {
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    preloadActivePageImages(activePage);
  }
});

// ==========================================
// PAGE NAVIGATION
// ==========================================
function goToPage(num) {
  pages.forEach(p => p.classList.remove('active'));
  const newPage = pages[num - 1];
  newPage.classList.add('active');

  // Preload images for the new page
  setTimeout(() => {
    preloadActivePageImages(newPage);
  }, 100);

  if (num <= 2) {
    header.classList.remove('visible');
  } else {
    header.classList.add('visible');
    setTimeout(() => {
      const gridContainer = newPage.querySelector('.grid-container');
      const gridItems = newPage.querySelectorAll('.grid-item');
      
      gridItems.forEach(item => item.classList.remove('active'));

      if (gridItems.length > 0) {
        const firstItem = gridItems[0];
        if (firstItem) {
          firstItem.classList.add('active');
        }
      }

      // Scroll to the beginning
      if (gridContainer && gridItems.length > 0) {
        if (window.innerWidth <= 768) { // Mobile view
          const firstItem = gridItems[0];
          firstItem.scrollIntoView({ behavior: 'auto', block: 'center' });
        } else { // Desktop view
          gridContainer.scrollTo({ left: 0, behavior: 'auto' });
        }
      }
      
      // Ensure body has focus for global keydown events
      document.body.focus();
    }, 100);
  }

  if (num === 1) {
    tap1.classList.remove('show');
    tap1.style.animation = '';
    setTimeout(() => {
      tap1.classList.add('show');
    }, 800);
  } else if (num === 2) {
    isTyping = false;
    logoText.classList.remove('tracking-in');
    void logoText.offsetWidth;
    descElement.innerHTML = '';
    tap2.classList.remove('show');
    tap2.style.animation = '';
    setTimeout(() => logoText.classList.add('tracking-in'), 400);
  }
}

function updateNavActiveState(pageId) {
  const navLinks = document.querySelectorAll('.navMenu ul li a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${pageId}`) {
      link.classList.add('active');
    }
  });
}

window.onload = () => setTimeout(()=>tap1.classList.add('show'),800);
document.getElementById('page1').addEventListener('click', ()=>{
  tap1.style.animation='fade-out 0.5s ease forwards';
  setTimeout(()=>goToPage(2),400);
});

logoText.addEventListener('animationend', ()=>setTimeout(startTextWriter,500));
const contentToType=`Hi, we are <span class="highlight">Picture Plus</span>

With our experience, we are ready to help your needs in the field of photography. We make <span class="italicOnly">Commercial, Fashion, Portrait, Architecture, Food & Product Photography.</span>

We began career as a photographer about 17 years ago.<br>During we experienseworking on magazines, tabloids and agency.<br>We have shot commercials, covers, editorials, and many renowned figurer.

Photo or Retouching for :<br>Traveloka, Realme, Sutra, Cosmopolitan, Harper's Baazar,<br>Webull Indonesia, Trax Magazine, Casa Indonesia, ELLE Indonesia, Marie Claire Indonesia,<br>iCreate Indonesia, Marketeer Indonesia, FHM Indonesia, Popular magazine ect.`.trim();

function startTextWriter() {
  if (isTyping) return;
  isTyping = true;
  descElement.style.opacity=1;
  descElement.innerHTML='';
  const paragraphs=contentToType.split('\n\n'); let pIndex=0;
  function typeParagraph(){
    if(pIndex>=paragraphs.length){
      setTimeout(()=> {
        tap2.classList.add('show');
        isTyping = false;
      }, 500);
      return;
    }
    const p=document.createElement('p'); 
    p.style.opacity = '0';
    descElement.appendChild(p);
    setTimeout(() => p.style.opacity = '1', 50);
    
    const text=paragraphs[pIndex];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    let i=0;
    let currentHTML = '';
    let tagStack = [];
    let inTag = false;
    let currentTag = '';
    
    function typeChar(){
      if(i<text.length){
        const char = text[i];
        
        if(char === '<'){
          inTag = true;
          currentTag = '<';
        } else if(char === '>' && inTag){
          currentTag += '>';
          inTag = false;
          currentHTML += currentTag;
          
          if(currentTag.startsWith('</')){
            tagStack.pop();
          } else if(!currentTag.includes('/>')){
            tagStack.push(currentTag);
          }
          currentTag = '';
        } else if(inTag){
          currentTag += char;
        } else {
          currentHTML += char;
        }
        
        let displayHTML = currentHTML;
        for(let j = tagStack.length - 1; j >= 0; j--){
          const openTag = tagStack[j];
          const tagName = openTag.match(/<(\w+)/)[1];
          displayHTML += `</${tagName}>`;
        }
        
        p.innerHTML = displayHTML.replace(/\n/g,'<br>');
        i++; 
        setTimeout(typeChar, 15);
      }
      else{pIndex++; setTimeout(typeParagraph,300);}
    }
    typeChar();
  }
  typeParagraph();
}

document.getElementById('page2').addEventListener('click', ()=>{
  if(tap2.classList.contains('show')) tap2.style.animation='fade-out 0.5s ease forwards';
  setTimeout(()=>{
    goToPage(3);
    updateNavActiveState('commercial');
  },500);
});

function moveActive(direction, activePage) {
  const gridItems = activePage.querySelectorAll('.grid-item');
  const actualGridItems = Array.from(gridItems).filter(item => !item.classList.contains('scroll-spacer'));
  let currentActive = activePage.querySelector('.grid-item.active');
  let nextActive = null;
  
  const isDesktop = window.innerWidth > 768;

  if (!currentActive) {
    nextActive = actualGridItems[0];
  } else {
    const currentIndex = actualGridItems.indexOf(currentActive);
    if (direction === 'right') {
      if (currentIndex < actualGridItems.length - 1) {
        nextActive = actualGridItems[currentIndex + 1];
      }
    } else {
      if (currentIndex > 0) {
        nextActive = actualGridItems[currentIndex - 1];
      }
    }
  }

  if (nextActive) {
    if (currentActive) {
      currentActive.classList.remove('active');
    }
    nextActive.classList.add('active');
    
    // Load adjacent images when moving
    const nextIndex = actualGridItems.indexOf(nextActive);
    [nextIndex - 2, nextIndex - 1, nextIndex, nextIndex + 1, nextIndex + 2].forEach(idx => {
      if (idx >= 0 && idx < actualGridItems.length) {
        const img = actualGridItems[idx].querySelector('img.lazy');
        if (img) {
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('lazy-loaded');
          }
        }
      }
    });
    
    const gridContainer = activePage.querySelector('.grid-container');
    if (gridContainer && nextActive) {
      const itemIndex = actualGridItems.indexOf(nextActive);
      
      // Desktop-specific behavior
      if (isDesktop) {
        // Handle first item
        if (itemIndex === 0) {
          gridContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
        // Handle last item
        else if (itemIndex === actualGridItems.length - 1) {
          gridContainer.scrollTo({ 
            left: gridContainer.scrollWidth - gridContainer.offsetWidth, 
            behavior: 'smooth' 
          });
        }
        // Handle middle items
        else {
          const scrollLeft = nextActive.offsetLeft - (gridContainer.offsetWidth - nextActive.offsetWidth) / 2;
          gridContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      } else {
        // Mobile/Tablet - Original behavior
        const scrollLeft = nextActive.offsetLeft - (gridContainer.offsetWidth - nextActive.offsetWidth) / 2;
        gridContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }
}

window.addEventListener('keydown', (e) => {
  const activePage = document.querySelector('.page.active');
  if (activePage && (activePage.id === 'page3' || activePage.id === 'page4' || activePage.id === 'page5' || activePage.id === 'page6')) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveActive('left', activePage);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveActive('right', activePage);
    }
  }
});

function initializeGallery(pageElement) {
  const gridItems = pageElement.querySelectorAll('.grid-item');
  const leftArrow = pageElement.querySelector('.left-arrow');
  const rightArrow = pageElement.querySelector('.right-arrow');
  const gridContainer = pageElement.querySelector('.grid-container');
  
  let currentActiveItem = null;
  const actualGridItems = Array.from(gridItems).filter(item => !item.classList.contains('scroll-spacer'));
  
  const isDesktop = () => window.innerWidth > 768;

  function setActiveItem(newActiveItem, forceScroll = false) {
    if (!newActiveItem) return;
    
    if (newActiveItem !== currentActiveItem || forceScroll) {
      if (currentActiveItem) {
        currentActiveItem.classList.remove('active');
      }
      newActiveItem.classList.add('active');
      currentActiveItem = newActiveItem;
      
      // Load images around the active item
      const activeIndex = actualGridItems.indexOf(newActiveItem);
      [activeIndex - 2, activeIndex - 1, activeIndex, activeIndex + 1, activeIndex + 2].forEach(idx => {
        if (idx >= 0 && idx < actualGridItems.length) {
          const img = actualGridItems[idx].querySelector('img.lazy');
          if (img) {
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              img.classList.add('lazy-loaded');
            }
          }
        }
      });
    }
  }

  let scrollEndTimer;
  let isScrolling = false;
  let isManualScrolling = false;
  
  gridContainer.addEventListener('scroll', () => {
    if (isManualScrolling) return;
    
    isScrolling = true;
    clearTimeout(scrollEndTimer);
    
    scrollEndTimer = setTimeout(() => {
      // Desktop-specific scroll detection
      if (isDesktop()) {
        const scrollCenter = gridContainer.scrollLeft + (gridContainer.offsetWidth / 2);
        const containerWidth = gridContainer.offsetWidth;
        const scrollLeft = gridContainer.scrollLeft;
        const scrollWidth = gridContainer.scrollWidth;
        
        // Check if at the end
        if (scrollLeft + containerWidth >= scrollWidth - 5) {
          const lastItem = actualGridItems[actualGridItems.length - 1];
          if (lastItem) {
            setActiveItem(lastItem);
          }
        } 
        // Check if at the beginning
        else if (scrollLeft <= 5) {
          const firstItem = actualGridItems[0];
          if (firstItem) {
            setActiveItem(firstItem);
          }
        }
        // Normal center detection
        else {
          let closestItem = null;
          let minDistance = Infinity;

          actualGridItems.forEach(item => {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(scrollCenter - itemCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestItem = item;
            }
          });

          if (closestItem) {
            setActiveItem(closestItem);
          }
        }
      } else {
        // Mobile/Tablet - Original behavior
        if (gridContainer.scrollLeft + gridContainer.clientWidth >= gridContainer.scrollWidth - 5) {
          const lastItem = actualGridItems[actualGridItems.length - 1];
          if (lastItem) {
            setActiveItem(lastItem);
          }
        } else {
          const scrollCenter = gridContainer.scrollLeft + (gridContainer.offsetWidth / 2);
          let closestItem = null;
          let minDistance = Infinity;

          actualGridItems.forEach(item => {
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(scrollCenter - itemCenter);
            if (distance < minDistance) {
              minDistance = distance;
              closestItem = item;
            }
          });

          if (closestItem) {
            setActiveItem(closestItem);
          }
        }
      }
      
      isScrolling = false;
    }, 10);
  });

  if (leftArrow) {
    leftArrow.onclick = () => {
      isManualScrolling = true;
      moveActive('left', pageElement);
      setTimeout(() => { isManualScrolling = false; }, 100);
    };
  }
  
  if (rightArrow) {
    rightArrow.onclick = () => {
      isManualScrolling = true;
      moveActive('right', pageElement);
      setTimeout(() => { isManualScrolling = false; }, 100);
    };
  }

  gridItems.forEach((item, index) => {
    item.onclick = () => {
      if (item.classList.contains('scroll-spacer')) return;
      
      isManualScrolling = true;
      setActiveItem(item, true);
      
      const gridContainer = item.closest('.grid-container');
      if (gridContainer && item) {
        const itemIndex = actualGridItems.indexOf(item);
        
        // Desktop-specific scroll behavior
        if (isDesktop()) {
          // Handle first item
          if (itemIndex === 0) {
            gridContainer.scrollTo({ left: 0, behavior: 'smooth' });
          }
          // Handle last item
          else if (itemIndex === actualGridItems.length - 1) {
            gridContainer.scrollTo({ 
              left: gridContainer.scrollWidth - gridContainer.offsetWidth, 
              behavior: 'smooth' 
            });
          }
          // Handle middle items
          else {
            const scrollLeft = item.offsetLeft - (gridContainer.offsetWidth - item.offsetWidth) / 2;
            gridContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        } else {
          // Mobile/Tablet - Original behavior
          const scrollLeft = item.offsetLeft - (gridContainer.offsetWidth - item.offsetWidth) / 2;
          gridContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
      }
      
      setTimeout(() => { isManualScrolling = false; }, 100);
    };
  });
  
  // Set first item as active on initialization
  if (actualGridItems.length > 0) {
    setActiveItem(actualGridItems[0], false);
  }
}

const page3Element = document.getElementById('page3');
if (page3Element) {
  initializeGallery(page3Element);
}

const page4Element = document.getElementById('page4');
if (page4Element) {
  initializeGallery(page4Element);
}

const page5Element = document.getElementById('page5');
if (page5Element) {
  initializeGallery(page5Element);
}

const page6Element = document.getElementById('page6');
if (page6Element) {
  initializeGallery(page6Element);
}

const navLinks = document.querySelectorAll('.navMenu ul li a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    let pageNum;
    if (targetId === 'commercial') pageNum = 3;
    else if (targetId === 'fashion') pageNum = 4;
    else if (targetId === 'portrait') pageNum = 5;
    else if (targetId === 'retouch') pageNum = 6;
    else if (targetId === 'about') pageNum = 2;

    if (pageNum) {
      goToPage(pageNum);
      updateNavActiveState(targetId);
    }

    if (navWrapper.classList.contains('menu-open')) {
      navWrapper.classList.remove('menu-open');
    }
  });
});

const navbarLogo = document.getElementById('navbarLogo');
if (navbarLogo) {
  navbarLogo.addEventListener('click', () => {
    goToPage(1);
    updateNavActiveState('');
  });
}

const burgerMenu = document.querySelector('.burger-menu');
const navWrapper = document.querySelector('.navWrapper');

if (burgerMenu && navWrapper) {
  burgerMenu.addEventListener('click', () => {
    navWrapper.classList.toggle('menu-open');
  });
}

function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

// Add lazy loading styles
const lazyLoadStyles = document.createElement('style');
lazyLoadStyles.textContent = `
  img.lazy {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    min-height: 200px;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  img.lazy-loaded {
    animation: fadeIn 0.3s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(lazyLoadStyles);