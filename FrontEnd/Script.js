let allWorks = [];//variable globale afin de contenir touts les projets récupérés via l'api qui permet a nos éléments d'accéder aux projets à tout moment

const token = localStorage.getItem("token");

if (token) {
    console.log("Utilisateur connecté");

    // logout
    const loginLink = document.querySelector('nav a[href="login.html"]');

    if (loginLink) {
        loginLink.textContent = "logout";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
    }

    // cacher les filtres
    const filters = document.querySelector(".filters");
    if (filters) {
        filters.style.display = "none";
    }

    // afficher la barre noire
    const editMode = document.querySelector(".edit-mode");
    if (editMode) {
        editMode.style.display = "flex";
    }

    // afficher bouton modifier
    const editButton = document.querySelector(".edit-button");
    if (editButton) {
        editButton.style.display = "block";
    }

} else {
    console.log("Utilisateur NON connecté");

    // remettre login
    const loginLink = document.querySelector('nav a[href="login.html"]');

    if (loginLink) {
        loginLink.textContent = "login";
    }

    // afficher filtres
    const filters = document.querySelector(".filters");
    if (filters) {
        filters.style.display = "flex";
    }

    // cacher barre édition
    const editMode = document.querySelector(".edit-mode");
    if (editMode) {
        editMode.style.display = "none";
    }

    // cacher bouton modifier
    const editButton = document.querySelector(".edit-button");
    if (editButton) {
        editButton.style.display = "none";
    }
}

function displayWorks(works) {

    const gallery = document.querySelector(".gallery");

    if (!gallery) return; 

    gallery.innerHTML = "";

    works.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}

function displayModalWorks(works) {
    const modalGallery = document.querySelector(".modal-gallery");

    if (!modalGallery) return; 

    modalGallery.innerHTML = "";

    works.forEach(work => {
        const container = document.createElement("div");
        container.style.position = "relative";

        const img = document.createElement("img");
        img.src = work.imageUrl;

        // 🗑️ bouton delete
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.style.position = "absolute";
        deleteBtn.style.top = "5px";
        deleteBtn.style.right = "5px";
        deleteBtn.style.cursor = "pointer";

        // EVENT DELETE
        deleteBtn.addEventListener("click", () => {
            deleteWork(work.id);
        });

        container.appendChild(img);
        container.appendChild(deleteBtn);

        modalGallery.appendChild(container);
    });
}

async function deleteWork(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur suppression");
        }

        // 🔄 mettre à jour le tableau
        allWorks = allWorks.filter(work => work.id !== id);

        // 🔄 refresh affichage
        displayWorks(allWorks);
        displayModalWorks(allWorks);

    } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression");
    }
}

function setActiveButton(clickedButton){//fonction de la gestion de l'état des boutton ici changer le bouton actif

    const buttons = document.querySelectorAll(".filters button");//récupération de tous les boutons filtres 

    buttons.forEach(button => {//boucle boutons qui va servir à parcourir chaque filtre
        button.classList.remove("active");//sert à désactiver dans un premier temps l'effet actif du css
    });

    clickedButton.classList.add("active");//sert à activer dans un second temps au clic l'effet actif 
}

fetch("http://localhost:5678/api/works")//appel de l'api 
  .then(response => response.json())//attente d'une réponse et si réponse transition en json
  .then(works => {

    allWorks = works;//stockage des donner afin de conserver les projets pour l'utilisation des filtres

    displayWorks(allWorks);//affichage de tous les projets 
    displayModalWorks(allWorks);
});

fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {

        const filtersContainer = document.querySelector(".filters");
        const select = document.getElementById("category");

        if (!filtersContainer || !select) return;

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });

        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.classList.add("active");
        allButton.dataset.id = "0";

        filtersContainer.appendChild(allButton);

        allButton.addEventListener("click", () => {
            setActiveButton(allButton);
            displayWorks(allWorks);
        });

        categories.forEach(category => {

            const button = document.createElement("button");
            button.textContent = category.name;
            button.dataset.id = category.id;

            filtersContainer.appendChild(button);

            button.addEventListener("click", () => {
                setActiveButton(button);

                const categoryId = parseInt(button.dataset.id);

                const filteredWorks = allWorks.filter(work =>
                    work.categoryId === categoryId
                );

                displayWorks(filteredWorks);
            });
        });
    });

  // sélection éléments
const modal = document.getElementById("modal");
const openModalBtn = document.querySelector(".edit-button");
const closeModalBtn = document.querySelector(".close-modal");

// ouvrir
if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });
}

// fermer (croix)
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

// fermer en cliquant dehors
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });
}

const openAddBtn = document.getElementById("open-add-form");
const galleryView = document.getElementById("modal-gallery-view");
const addView = document.getElementById("modal-add-view");

if (openAddBtn) {
    openAddBtn.addEventListener("click", () => {
        galleryView.classList.add("hidden");
        addView.classList.remove("hidden");
    });
}

const form = document.getElementById("add-work-form");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const image = document.getElementById("image").files[0];
        const title = document.getElementById("title").value;
        const category = document.getElementById("category").value;

        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", category);

        try {
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error("Erreur upload");
            }

            const newWork = await response.json();

            // 🔄 mise à jour
            allWorks.push(newWork);

            displayWorks(allWorks);
            displayModalWorks(allWorks);

            // reset form
            form.reset();

            // retour galerie
            addView.classList.add("hidden");
            galleryView.classList.remove("hidden");

        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout");
        }
    });
}

const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const submitBtn = document.querySelector(".submit-btn");

if (imageInput && titleInput && categorySelect && submitBtn) {

    function checkForm() {
        if (
            imageInput.files.length > 0 &&
            titleInput.value.trim() !== "" &&
            categorySelect.value !== ""
        ) {
            submitBtn.disabled = false;
            submitBtn.classList.add("active");
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.remove("active");
        }
    }

    imageInput.addEventListener("change", checkForm);
    titleInput.addEventListener("input", checkForm);
    categorySelect.addEventListener("change", checkForm);
}

const fileNameDisplay = document.getElementById("file-name");

if (imageInput && fileNameDisplay) {
    imageInput.addEventListener("change", () => {
        if (imageInput.files.length > 0) {
            fileNameDisplay.textContent = imageInput.files[0].name;
        }
    });
};

const backBtn = document.querySelector(".back-modal");

if (openAddBtn) {
    openAddBtn.addEventListener("click", () => {
        galleryView.classList.add("hidden");
        addView.classList.remove("hidden");

        backBtn.style.display = "block"; // 🔥 AJOUT
    });
}

if (backBtn) {
    backBtn.addEventListener("click", () => {
        addView.classList.add("hidden");
        galleryView.classList.remove("hidden");

        backBtn.style.display = "none"; // 🔥 AJOUT
    });
}