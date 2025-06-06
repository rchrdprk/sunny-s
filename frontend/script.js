
const map = L.map('map').setView([49.347298, -124.44812], 18); // Initial coordinates and zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const customIcon = L.icon({
    iconUrl: document.getElementById('customMarker').src,
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -75]
});
  
L.marker([49.347310, -124.44808], { icon: customIcon }).addTo(map)


document.querySelectorAll('.menu-types a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); 

        document.querySelectorAll('.menu-types a').forEach(l => l.classList.remove('menu-types-active'));
        this.classList.add('menu-types-active');

        const menuType = this.id.replace('menu-', '');

        displayMenu(menuType);
    });
  });


function displayMenu(type) {

    document.querySelectorAll('.menu-section').forEach(section => {
      section.classList.remove('active');
    });

    const target = document.getElementById(type);
    if (target) {
      target.classList.add('active');
    }
}

let prevScrollTop = 0;
const header = document.getElementById("header");
const headerHeight = header.offsetHeight;


const navContainer = document.getElementById('nav-container');
const navHeight = navContainer.offsetHeight;
const mainImage = document.querySelector(".main-image");
mainImage.style.marginTop = `${navHeight}px`;

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY || document.documentElement.scrollTop; 

    if (scrollTop <= headerHeight) {
        mainImage.style.paddingTop = `0`;
    } else {
        
        if (scrollTop < prevScrollTop && userInitiatedScroll == true) { //if user is scrolling up manually
            header.style.top = "0";
        } else if (scrollTop < prevScrollTop && userInitiatedScroll == false) { //if user is scrolling up 
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            if (scrollTop > prevScrollTop) {
                header.style.top = `-${header.offsetHeight}px`; // hide header
            } else {
                header.style.top = "0"; // show header
            }
        }
        
        if (scrollTop <= 0) {
            prevScrollTop = 0;
        } else {
            prevScrollTop = scrollTop;
        } // avoid negative values

    }
  });

  document.querySelectorAll('#header .nav-items li a').forEach(link => {
    link.addEventListener('click', (event) => {

    userInitiatedScroll = false;

    const a = event.target.closest('a');

    //target anchor's position
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    header.style.top = "-101%"; // hide header on 
    
    closeSidebar();
    })

});


let userInitiatedScroll = false;

function userScroll() {
    userInitiatedScroll = true;
}

function listenScroll() {
    window.addEventListener('wheel', userScroll);
    window.addEventListener('touchstart', userScroll); // for mobile
    window.addEventListener('keydown', e => {
        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (keys.includes(e.key)) {
            userScroll();
        }
    });
    window.addEventListener('mousedown', e => {
        if (e.button === 1 || e.button === 0) { // middle or left click
            userScroll();
        }
    });
}

listenScroll();


function preventScroll(e) {
    e.preventDefault();
}

function preventKeyScroll(e) {
    const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
    if (keys.includes(e.key)) {
        e.preventDefault();
    }
}

function preventMouseScroll(e) {
    if (e.button === 1 || e.button === 0) { // middle or left click
      e.preventDefault();
    }
  }
  
function disableScroll() {
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('mousedown', preventMouseScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll, false);
    document.body.style.overflow = 'hidden'; //remove scrollbar
}
  
function enableScroll() {
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('mousedown', preventMouseScroll);
    window.removeEventListener('keydown', preventKeyScroll);
    document.body.style.overflow = '';
}
  

const navbar = document.getElementById('nav-items');
const overlay = document.getElementById("overlay");

let sideBarStatus = false;

function openSidebar(){
    navbar.classList.add('active');
    document.getElementById("overlay").classList.add("active");
    disableScroll()
    sideBarStatus = true;
}

function closeSidebar(){
    navbar.classList.remove('active');
    overlay.classList.remove("active");
    enableScroll();
    sideBarStatus = false;
}

function sidebarResizeWindow() {
    //edge case where user resizes window and sidebar is still open
    if (sideBarStatus == true && window.innerWidth > 750) {
        closeSidebar();
    }
}

sidebarResizeWindow();

const navItemsContainer = document.getElementById('nav-items-container');
const mobileNavContainer = document.getElementById('mobile-nav-container');

function moveNavOutside() {
    if (navItemsContainer.parentElement !== mobileNavContainer) {
        mobileNavContainer.appendChild(navItemsContainer);
    }
}

function moveNavInside() {
    if (navItemsContainer.parentElement !== navContainer) {
        navContainer.appendChild(navItemsContainer); 
      }
}

function toggleMenu() {
    if (window.innerWidth <= 750) {
      moveNavOutside(); // Mobile
    } else {
      moveNavInside(); // Desktop
    }
  }

toggleMenu();

window.addEventListener('resize', function () {
    toggleMenu();
    sidebarResizeWindow();
});


//menu stuff
function menu() {

    addSectionContainers()
    createColumn()
    
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            renderMenu(data.menu.tacos, 'tacos', 'tacos', false, 1);

            //bevs
            renderMenu(data.menu.milk_tea, 'milk tea','beverages', false, 1);
            renderMenu(data.menu.fruity_smoothies, 'fruity smoothies','beverages', true, 1);
            renderMenu(data.menu.milky_smoothies, 'milky smoothies','beverages', true, 1);  
            renderMenu(data.menu.drinks, 'drinks','beverages', true, 1);  

            //alchohol
            renderMenu(data.menu.alcohol, 'alcohol','alcohol', false, 1);
            renderMenu(data.menu.wine, 'wine','alcohol', true, 1);

            renderMenu(data.menu.domestic, 'domestic','alcohol', true, 1);
            renderMenu(data.menu.international, 'international','alcohol', true, 1);

        })
        .catch(err => {
            document.getElementById('menu-content').textContent = 'Failed to load menu.';
            console.error(err);
        });
}


//rendermenu -> data, menuType: the header, menuTab: the tab this part will go in, 
//haveTitle: does it have a header?, columnNum: which Column will it be in?
function renderMenu(data, menuType, menuTab, haveTitle, columnNum) {
    
    const section = document.getElementById(menuTab);
    if (!section) {
        console.error(`No section found with ID ${menuTab}`);
        return;
    }

    const container = section.querySelector('.menu-section-container');
    if (!container) {
        console.error(`No .menu-section-container found in #${menuTab}`);
        return;
    }

    // section.innerHTML = ''; this clears the section

    const targetColumn = section.querySelector(`.menu-column-${columnNum}`);
    const target = targetColumn || section; // fallback to section if not found 

    if (haveTitle) {
        const menuTitleHtml = `<h1 class="menu-type">${menuType.toUpperCase()}</h1>`
        target.innerHTML += menuTitleHtml;
    }

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');

        const itemDesc = item.description
        const itemName = item.name

        if (itemDesc == '') {
            itemDiv.innerHTML = `
            <div class=item-name-price>
                <h3>${itemName}</h3>
                <p class="price">${item.price}</p>
            </div>
        `;
        } else {
            itemDiv.innerHTML = `
            <div class=item-name-price>
                <h3>${itemName}</h3>
                <p class="price">${item.price}</p>
            </div>
            <p class="desc">${itemDesc}</p> 
        `;
        }

        target.appendChild(itemDiv);
    }
}

function addSectionContainers() {
    document.querySelectorAll('.menu-section').forEach(section => {
        const container = document.createElement('div');
        container.classList.add('menu-section-container');
        section.appendChild(container);

        const desc = section.getAttribute('desc');
        if (desc) {

            const descDiv = document.createElement('h3');
                descDiv.classList.add('menu-section-description');
                descDiv.innerHTML = desc;
                section.prepend(descDiv);
        }
    });
}


function createColumn() {
    document.querySelectorAll('.menu-types a').forEach(link => {
        const columnNum = parseInt(link.getAttribute('column-count')) || 1;
        const menuType = link.id.replace('menu-', '');

        const section = document.getElementById(menuType);
        if (!section) return;

        const container = section.querySelector('.menu-section-container');
        if (!container) return; 

        for (let i = 0; i < columnNum; i++) {
            const column = document.createElement('div');
            column.classList.add('menu-column', `menu-column-${i + 1}`);
            container.appendChild(column);
          }
    });
}


menu()


//img stuff
document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('draggable', 'false');
    });
  });




