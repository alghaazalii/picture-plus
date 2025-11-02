const pages = document.querySelectorAll('.page');
const header = document.getElementById('globalHeader');
const logoText = document.getElementById('logoText');
const tap1 = document.getElementById('tap1');
const tap2 = document.getElementById('tap2');
const descElement = document.getElementById('desc');

let isTyping = false;
function goToPage(num) {
  const navbarLogo = document.getElementById('navbarLogo');
  pages.forEach(p => p.classList.remove('active'));
  const targetPage = pages[num - 1];
  targetPage.classList.add('active');

  if(num <= 2) {
    header.classList.remove('visible');
    navbarLogo.src = '/images/LOGO PICTURE WEB_page 2.png';
  } else {
    header.classList.add('visible');
    navbarLogo.src = '/images/LOGO PICTURE WEB.png';
    // Initialize gallery for the visible page
    initializeGallery(targetPage);
  }

  // Reset and restart animations for page1 and page2
  if (num === 1) {
    tap1.classList.remove('show');
    tap1.style.animation = ''; // Clear any previous animation
    setTimeout(() => {
      tap1.classList.add('show');
    }, 800); // Re-trigger animation with original delay
  } else if (num === 2) {
    isTyping = false; // Reset typing flag
    logoText.classList.remove('tracking-in');
    void logoText.offsetWidth; // Force reflow
    descElement.innerHTML = '';
    tap2.classList.remove('show');
    tap2.style.animation = '';
    setTimeout(() => logoText.classList.add('tracking-in'), 400); // Re-trigger logo animation
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

With our experience, we are ready to help your needs in the field of photography. We make
<span class="italicOnly"> Commercial, Fashion, Portrait, Architecture, Food & Product Photography.</span>

We began career as a photographer about 17 years ago.<br>During we experiences working on magazines, tabloids, and agency.<br>We have shot commercials, covers, editorials, and many renowned figures.

Photo or Retouching for:<br>Traveloka, Realme, Sutra, Cosmopolitan, Harper’s Bazaar.<br>Webull Indonesia, Trax Magazine, Casa Indonesia, ELLE Indonesia, Marie Claire Indonesia.<br>iCreate Indonesia, Marketeer Indonesia, FHM Indonesia, Popular magazine etc.`.trim();

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
    const p=document.createElement('p'); descElement.appendChild(p);
    const text=paragraphs[pIndex]; let i=0;
    function typeChar(){
      if(i<text.length){p.innerHTML=text.slice(0,i+1).replace(/\n/g,''); i++; setTimeout(typeChar,15);}
      else{pIndex++; setTimeout(typeParagraph,300);}
    }
    typeChar();
  }
  typeParagraph();
}

document.getElementById('page2').addEventListener('click', ()=>{
  if(!isTyping) {
    tap2.style.animation='fade-out 0.5s ease forwards';
    setTimeout(()=>{
      goToPage(3);
      updateNavActiveState('commercial');
    },500);
  }
});

let isAnimating = false;
function moveActive(direction, activePage) {
  if (isAnimating) return;
  const gridItems = activePage.querySelectorAll('.grid-item');
  let currentActive = activePage.querySelector('.grid-item.active');
  let nextActive = null;

  if (!currentActive) {
    nextActive = gridItems[0]; // If no item is active, select the first one
  } else {
    const currentIndex = Array.from(gridItems).indexOf(currentActive);
    if (direction === 'right') {
      nextActive = gridItems[currentIndex + 1];
    } else { // 'left'
      nextActive = gridItems[currentIndex - 1];
    }
  }

  if (nextActive) {
    if (currentActive) {
      currentActive.classList.remove('active');
    }
    nextActive.classList.add('active');
    isAnimating = true;
    nextActive.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setTimeout(() => {
      isAnimating = false;
    }, 500); // Match this to your smooth scroll duration
  }
}

window.addEventListener('keydown', (e) => {
  const activePage = document.querySelector('.page.active');
  if (activePage && (activePage.id === 'commercial' || activePage.id === 'fashion' || activePage.id === 'portrait' || activePage.id === 'retouch')) { // Only scroll if gallery page is active
    if (e.key === 'ArrowLeft') {
      e.preventDefault(); // Prevent default browser action
      moveActive('left', activePage);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault(); // Prevent default browser action
      moveActive('right', activePage);
    }
  }
});

// Function to initialize gallery for a given page element
function initializeGallery(pageElement) {
  const gridContainer = pageElement.querySelector('.grid-container');
  const gridItems = pageElement.querySelectorAll('.grid-item');
  const leftArrow = pageElement.querySelector('.left-arrow');
  const rightArrow = pageElement.querySelector('.right-arrow');

  // Ensure only one item is active initially
  gridItems.forEach((item, index) => {
    if (index === 0) item.classList.add('active');
    else item.classList.remove('active');
  });

  // Attach event listeners for the current page's arrows
  if (leftArrow) leftArrow.onclick = () => moveActive('left', pageElement);
  if (rightArrow) rightArrow.onclick = () => moveActive('right', pageElement);

  // Attach click listeners for grid items
  gridItems.forEach(item => item.onclick = () => {
    gridItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });

  // Add wheel listener for trackpad snap scrolling
  if (gridContainer) {
    let isWheeling = false;
    gridContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (isWheeling) return;

      if (e.deltaX > 1) { // Swiped right
        moveActive('right', pageElement);
      } else if (e.deltaX < -1) { // Swiped left
        moveActive('left', pageElement);
      }

      isWheeling = true;
      setTimeout(() => {
        isWheeling = false;
      }, 300); // Throttle wheel event
    });
  }
}



// Add event listeners for header navigation links
const navLinks = document.querySelectorAll('.navMenu ul li a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1); // e.g., 'commercial' or 'fashion'
    let pageNum;
    if (targetId === 'commercial') pageNum = 3;
    else if (targetId === 'fashion') pageNum = 4;
    else if (targetId === 'portrait') pageNum = 5;
    else if (targetId === 'retouch') pageNum = 6;
    else if (targetId === 'about') pageNum = 2; // About goes to page 2

    if (pageNum) {
      goToPage(pageNum);
      updateNavActiveState(targetId);
    }
  });
});

// Add event listener for navbar logo
const navbarLogo = document.getElementById('navbarLogo');
if (navbarLogo) {
  navbarLogo.addEventListener('click', () => {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
      // No need to wait for animationend, just start animation and transition
    }
    goToPage(1);
    updateNavActiveState(''); // Clear active state for nav links
  });
}

// Burger menu toggle
const burgerMenu = document.querySelector('.burger-menu');
const navWrapper = document.querySelector('.navWrapper');

if (burgerMenu && navWrapper) {
  burgerMenu.addEventListener('click', () => {
    navWrapper.classList.toggle('menu-open');
  });
}
