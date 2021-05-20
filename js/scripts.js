const searchContainerDiv = document.querySelector('.search-container');
const galleryDiv = document.getElementById('gallery');


// Api doc: https://randomuser.me/documentation
// multiple user request: https://randomuser.me/api/?results=5000
// selecting what you want:
// https://randomuser.me/api/?inc=picture,name,email,location,cell,dob
// We need:
// Image             -> picture
// Name              -> name
// Email             -> email
// full address      -> location
// Cell Number       -> cell
// Birthday          -> dob

const api = {
    url: 'https://randomuser.me/api/1.3/',
    reqDetails: 'inc=picture,name,email,location,cell,dob',
    employeeCnt: 'results=12'
}

const url = `${api.url}?${api.reqDetails}&${api.employeeCnt}`;

fetch(url)
    .then(response => response.json())
    .then(response => {
        // console.log(response.results)
        return response.results;
    })
    .then(people => {
        people.forEach(person => {
            galleryDiv.insertAdjacentHTML('beforeend', createCard(person));
        });
        return people;
    })
    .then(people => {
        // console.log(people);
        galleryDiv.insertAdjacentHTML('beforeend', createModal(people[0]));
        return people;
    })
    // catch failures with fetch (network error, etc):
    .catch(error => console.log('Looks like there was a problem!', error));

function createCard(person) {
    return `
        <div class="card">
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

function createModal(person) {
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
                    <p class="modal-text">(555) 555-5555</p>
                    <p class="modal-text">
                        ${person.location.street.number} ${person.location.street.name}, 
                        ${person.location.state}, ${person.location.postcode}
                    </p>
                    <p class="modal-text">
                        Birthday: ${person.dob.date}
                    </p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
}

