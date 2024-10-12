// Show categories

// create loadCategories
const countDown = (button) => {
    let countdown = 3; // Starting the countdown from 3
    const countdownModal = document.getElementById("countdown_modal");
    const countdownText = document.getElementById("countdown_text");

    // Show the modal
    countdownModal.showModal();

    // Countdown logic
    const countdownInterval = setInterval(() => {
        countdownText.textContent = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);

            // Once countdown finishes, change button text to 'Adopted' and disable it
            button.textContent = "Adopted";
            button.disabled = true;

            // Close the modal after the countdown
            countdownModal.close();
        }
    }, 1000); // 1-second interval for the countdown
};



const likePet = (image) => {
    const likedPetsContainer = document.getElementById("likedPets");

    const petCard = document.createElement("div");
    petCard.classList = "h-auto w-full flex flex-col items-center p-2 overflow-hidden";

    petCard.innerHTML = `
        <img src=${image} class="rounded-lg w-full object-cover" />
    `;

    likedPetsContainer.appendChild(petCard);
};



const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn")
    console.log(buttons);
    for (let btn of buttons) {
        btn.classList.remove("active")
    }
};


const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error))
};

const loadPets = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then((data) => {
            currentPets = data.pets;
            displayPets(currentPets);
        })
        .catch((error) => console.log(error))
};

const loadCategoryPets = (id) => {
    const petContainer = document.getElementById("pets");
    const likedPetsContainer = document.getElementById("likedPets").closest('.border'); // Get the parent container
    
    // Store original content
    const originalPetContent = petContainer.innerHTML;
    
    // Hide both containers' content
    petContainer.innerHTML = '';
    likedPetsContainer.style.visibility = 'hidden';
    
    // Create a temporary container for the loading gif
    const loadingContainer = document.createElement('div');
    loadingContainer.className = "col-span-4 min-h-[300px] flex justify-center items-center";
    loadingContainer.innerHTML = `
        <img src="images/loading.gif" alt="Loading..." class="w-40 h-40" />
    `;
    
    // Insert loading container before pet container
    petContainer.parentNode.insertBefore(loadingContainer, petContainer);
    
    removeActiveClass();
    const activeBtn = document.getElementById(`btn-${id}`);
    activeBtn.classList.add("active");
    
    setTimeout(() => {
        fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`)
            .then((res) => res.json())
            .then((data) => {
                // Remove loading container
                loadingContainer.remove();
                
                // Restore liked pets visibility
                likedPetsContainer.style.visibility = 'visible';
                
                currentPets = data.data;
                displayPets(data.data);
            })
            .catch((error) => {
                console.log(error);
                // On error, remove loading and restore original content
                loadingContainer.remove();
                petContainer.innerHTML = originalPetContent;
                likedPetsContainer.style.visibility = 'visible';
            });
    }, 2000);
};

const loadDetails = async (petId) => {
    console.log(petId);
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.petData);
};
const displayDetails = (pet) => {
    console.log(pet)
    const detailsContainer = document.getElementById("modal-content");

    detailsContainer.innerHTML = `
    <div class="flex justify-center"> 
    <img class="w-[85%] rounded-lg object-cover" src=${pet.image}/>
    </div>
    
    <h2 class="text-3xl font-bold py-4">${pet.pet_name}</h2>
    <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=82774&format=png"
            <p class="text-gray-600 mb-1">Breed: ${pet.breed || "Not Available"}</p>
        </div>
    <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=9nK4xgWiABie&format=png"
            <p class="text-gray-600 mb-1">Gender: ${pet.gender || "Unknown"}</p>
        </div>
    <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=84997&format=png"
            <p class="text-gray-600 mb-1">Birth: ${pet.date_of_birth || "Unknown"}</p>
        </div>
    <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=85782&format=png"
            <p class="text-gray-600 mb-1">Price: ${pet.price || "Not Available"}</p>
        </div>

    <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=103050&format=png"
            <p class="text-gray-600 mb-1">Vaccinated: ${pet.vaccinated_status || "Not Available"}</p>
        </div>

        <hr>
        <h2 class="font-bold text-xl py-3">Details Information</h2>
    <p class="text-lg">${pet.pet_details}</p>
    `;

    document.getElementById("showModalData").click();
};


// const cardDemo = {
//     "petId": 12,
//     "breed": "Poodle",
//     "category": "Dog",
//     "date_of_birth": "2023-08-10",
//     "price": 1500,
//     "image": "https://i.ibb.co.com/R9ZHvDD/pet-12.jpg",
//     "gender": "Female",
//     "pet_details": "This elegant female Poodle, born on August 10, 2023, is intelligent and eager to learn. Fully vaccinated and priced at $1500, she's perfect for families looking for a trainable and loving companion.",
//     "vaccinated_status": "Fully",
//     "pet_name": "Chloe"
// }

const displayPets = (pets) => {
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = "";

    if (pets.length == 0) {
        petContainer.classList.remove("grid");
        petContainer.innerHTML =
        `
        <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="images/error.webp" />
        <h2 class="font-bold text-3xl">No Information Available</h2>
        <p class="text-secondary font-extrabold">We currently do not have any birds. Please check again later.</p>
        </div>
        `;
        return;
    } else {
        petContainer.classList.add("grid");
    }

    pets.forEach(pet => {
        // console.log(pet);
        const card = document.createElement("div");
        card.classList = "card card-compact"
        
        card.innerHTML =
        `
    <figure>
        <img
        src=${pet.image}
        class="h-[300px] w-full object-cover"
        />
    </figure>
    <div class="px-0 py-2 gap-2 border rounded-lg">
        <div class="px-6">
        <h2 class=" text-3xl font-bold mb-6">${pet.pet_name}</h2>
        <div>
        <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=82774&format=png"
            <p class="text-gray-600 mb-1">Breed: ${pet.breed || "Not Available"}</p>
        </div>
        
        <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=84997&format=png"
            <p class="text-gray-600 mb-1">Birth: ${pet.date_of_birth || "Unknown"}</p>
        </div>

        <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=9nK4xgWiABie&format=png"
            <p class="text-gray-600 mb-1">Gender: ${pet.gender || "Unknown" }</p>
        </div>

        <div class="flex gap-2 mb-2">
            <img src="https://img.icons8.com/?size=24&id=85782&format=png"
            <p class="text-gray-600 mb-1">Price: ${pet.price || "Not Available"}</p>
        </div>
        </div>
        <hr>
        <div class="flex justify-between gap-6 my-4">
            <button class="btn hover:bg-primary"onclick="likePet('${pet.image}')"><img src="https://img.icons8.com/?size=24&id=82788&format=png" alt=""></button>
            
            <button class="btn hover:bg-primary hover:text-white adopt-btn">Adopt</button>
            
            <button onclick="loadDetails(${pet.petId})" class="btn hover:bg-primary hover:text-white">Details</button>
        </div>
    </div>
        `;
        const adoptButton = card.querySelector('.adopt-btn');
        adoptButton.addEventListener('click', () => countDown(adoptButton));
        petContainer.append(card)
    })
}

// {
//     "id": 1,
//     "category": "Cat",
//     "category_icon": "https://i.ibb.co.com/N7dM2K1/cat.png"
// }


// create displayCategories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories")

    categories.forEach((item) => {
        // console.log(item);
        // Create a button 
        const buttonContainer = document.createElement("div");
        buttonContainer.innerHTML =
            `
        <button id="btn-${item.category}" onclick="loadCategoryPets('${item.category}')" class="btn px-auto text-xl lg:px-28 hover:text-black category-btn btn-lg flex flex-col items-center gap-2">
            <img src="${item.category_icon}" alt="${item.category}" class="w-8 h-8"/>
        ${item.category}
        </button>
        `;


        // add button to categoryContainer

        categoryContainer.append(buttonContainer);
    })
};


// Scroll to adopt 
document.getElementById('viewMoreButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor link behavior

    // Scroll to the 'Adopt Best Friend' section smoothly
    document.querySelector('#adopt-best-friend').scrollIntoView({
    behavior: 'smooth'
    });
});


let currentPets = [];

const sortPetsByPrice = () => {
    currentPets.sort((a, b) => b.price - a.price);
    displayPets(currentPets);
};

document.addEventListener('DOMContentLoaded', () => {
    const sortButton = document.querySelector('.sort-button');
    if (sortButton) {
        sortButton.addEventListener('click', sortPetsByPrice);
    }
});

loadCategories();
loadPets();