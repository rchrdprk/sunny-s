(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    // key: 
    v: "weekly",
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
  });



// (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://google-maps-api.richardpark263.workers.dev/?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
//     // key: 
//     v: "weekly",
//     // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
//     // Add other bootstrap parameters as needed, using camel case.
//   });

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");

    const position = { lat: 49.347298, lng: -124.44812 }

    const map = new Map(document.getElementById("map"), {
        center: position, 
        zoom: 17.5,
        mapTypeControl: false,
        streetViewControl: false, 
        zoomControl: true,
        scrollwheel: false,
    });

    const icon = document.getElementById("customMarker").cloneNode(true);

    const marker = new Marker({
        map: map,
        position: position,
        title: "Sunny's Food & Drinks",
        icon: {
            url: icon.src,
            scaledSize: new google.maps.Size(70, 70),
        },
    });
  }

initMap();


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

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop; 

    if (scrollTop <= headerHeight) {
        header.style.top = "0";
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


const navbar = document.getElementById('nav-items');
const overlay = document.getElementById("overlay");

function openSidebar(){
    navbar.classList.add('active');
    document.getElementById("overlay").classList.add("active");
    // overlay.style.display = "block";
}

function closeSidebar(){
    navbar.classList.remove('active');
    overlay.classList.remove("active");

    // overlay.addEventListener("transitionend", function handler(e) {
    //     if (!overlay.classList.contains("active")) {
    //         overlay.style.display = "none";
    //     }
    //     overlay.removeEventListener("transitionend", handler);
    // });
}



//menu stuff

function menu() {

    addSectionContainers()
    createColumn()
    
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            renderMenu(data.menu.breakfast, 'breakfast', 'breakfast',false, 1);
            renderMenu(data.menu.tacos, 'tacos', 'tacos', false, 1);
            renderMenu(data.menu.quesadilla, 'quesadilla', 'quesadilla', false, 1);
            renderMenu(data.menu.kids_menu, 'kids','kids', false, 1);
            renderMenu(data.menu.beverages, 'beverages','beverages', false, 1);

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

const mainImage = document.querySelector(".main-image");
mainImage.style.paddingTop = `${headerHeight}px`;


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


