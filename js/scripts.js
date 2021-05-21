// As per the requirements, we fetch 12 people from the api:
const nrEmployeesToFetch = 12;

// The 'peopleData' array will hold the people objects we fetch from the api
let peopleData = [];

const searchContainerDiv = document.querySelector('.search-container');
const galleryDiv = document.getElementById('gallery');

// This little helper function reformats the phone number to the desired format
function reformatCellNr(cellNr) {
    // keep digits only using regex & replace: 
    let retStr = cellNr.replace(/[^\d]/g, ''); 
    // And now we recreate the string in the desired format:
    retStr = `(${retStr.slice(0, 3)}) ${retStr.slice(3,6)}-${retStr.slice(6,retStr.length)}`;
    return retStr;
}

// This little helper function reformats the birthday in the desired format
function reformatBirthDay(birthday) {
    // we only need the date, not the time:
    let retStr = birthday.substring(0,10);
        // let's put the year, month and day in the desired order:
        retStr = retStr.replace(/^\d{2}(\d{2})-(\d{2})-(\d{2})/, '$2/$3/$1');
    return retStr;
}

// The following function takes in details about a person (a javascript object)
// and returns an html string containing the persons data.
function createCard(person, index) {
    return `
        <div class="card" data-index="${index}">
            <div class="card-img-container">
                <img class="card-img" 
                src="${person.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">
                  ${person.name.first} ${person.name.last}
                </h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">
                    ${person.location.city}, ${person.location.state}
                </p>
            </div>
        </div>        
    `;
}

function updateModalContent(person, index) {
    const modalContainerDiv = document.querySelector('.modal-container');
    const img = modalContainerDiv.querySelector('img');
    const nameH3 = modalContainerDiv.querySelector('#name');
    const paragraphs = modalContainerDiv.querySelectorAll('p');
    const modalBtnContainerDiv = modalContainerDiv.querySelector('.modal-btn-container');

    img.src = person.picture.large;
    nameH3.innerHTML = `${person.name.first} ${person.name.last}`;
    paragraphs[0].innerHTML = person.email;
    paragraphs[1].innerHTML = person.location.city;
    paragraphs[2].innerHTML = reformatCellNr(person.cell); 
    paragraphs[3].innerHTML =
        `${person.location.street.number} ${person.location.street.name}, ` +
        `${person.location.state}, ${person.location.postcode}`;
    paragraphs[4].innerHTML = `Birthday: ${reformatBirthDay(person.dob.date)}`; 
    modalBtnContainerDiv.dataset.index = `${index}`;
}

// The following function takes in details about a person (a javascript object)
// and returns an html string containing the persons data. Same as createCard 
// then, but the 'modal' contains more details
function createModal(person, index) {
    return `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn">
                    <strong>X</strong>
                </button>
                <div class="modal-info-container">
                    <img 
                        class="modal-img" 
                        src="${person.picture.large}" 
                        alt="profile picture"
                    >
                    <h3 id="name" class="modal-name cap">
                        ${person.name.first} ${person.name.last}
                    </h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${reformatCellNr(person.cell)}</p>
                    <p class="modal-text">
                        ${person.location.street.number} ${person.location.street.name}, 
                        ${person.location.state}, ${person.location.postcode}
                    </p>
                    <p class="modal-text">
                        Birthday: ${reformatBirthDay(person.dob.date)}
                    </p>
                </div>
            </div>

            <div class="modal-btn-container" data-index="${index}">
                <button type="button" id="modal-prev" class="modal-prev btn">
                    Prev
                </button>
                <button type="button" id="modal-next" class="modal-next btn">
                    Next
                </button>
            </div>
        </div>
    `;
}

// Fetch helper function for error handling
function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// fetchData needs an url and returns a promise that resolves to the requested
// data as a javascript object
function fetchData(url) {
    return fetch(url)
        // only continue if we got http status 200 OK:
        .then(checkStatus) 
        // transform the JSON string into a javascript object:
        .then(response => response.json())
        // catch failures of fetch (network error, etc):
        .catch(error => console.log('Looks like there was a problem!', error));
}

// Details of the API and its parameters
const api = {
    url: 'https://randomuser.me/api/1.3/',
    reqDetails: 'inc=picture,name,email,location,cell,dob',
    employeeCnt: `results=${nrEmployeesToFetch}`
}

// this little helper function returns the full api url
function getAPIString(api) {
    return `${api.url}?${api.reqDetails}&${api.employeeCnt}`;
}

// this little helper function saves 
function savePeopleData(peopleArray) {
    peopleData = [...peopleArray];
    return peopleArray;
}

// this little helper function will take a 'people' javascript object array
// and insert cards made with 'createCard' into the html document. It returns
// the 'people' array so that further "then" statements can be chained to the
// calling promise.
function insertPeopleToDom(people) {
    for(let i = 0; i < people.length; i++) {
        galleryDiv.insertAdjacentHTML('beforeend', createCard(people[i], i));
        galleryDiv.lastElementChild.addEventListener('click', (event) => {
            galleryDiv.insertAdjacentHTML(
                'beforeend', 
                createModal(peopleData[event.currentTarget.dataset.index], i)
            );
            const modalCloseButton = document.getElementById('modal-close-btn');            
            modalCloseButton.addEventListener('click', () => {
                modalCloseButton.parentNode.parentNode.remove();
            });
            // exceeds:
            const navButtons = [
                document.getElementById('modal-prev'),
                document.getElementById('modal-next')
            ];
            for(btn of navButtons) {
                btn.addEventListener('click', (event) => {
                    let index = parseInt(event.target.parentNode.dataset.index);
                    if(event.target.id === 'modal-prev' && index > 0) {                        
                        index--;
                    } else if(event.target.id === 'modal-next' && index < (peopleData.length - 1)) { 
                        index++;
                    }
                    updateModalContent(peopleData[index], index);
                });
            }
        });
    }        
    return people;
}

// Finally we fetch the data from the api and display the people by adding
// them to the DOM:
fetchData(getAPIString(api))
    // we take what we need from the response and tail it to our needs
    .then(response => savePeopleData(response.results))
    // we insert each person into an html string and attach that to the DOM
    .then(insertPeopleToDom)
    // catch failures with fetch (network error, etc):
    .catch(error => console.log('Looks like there was a problem!', error));

