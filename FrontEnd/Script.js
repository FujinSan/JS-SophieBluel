let allWorks = [];//variable globale afin de contenir touts les projets récupérés via l'api qui permet a nos éléments d'accéder aux projets à tout moment

const token = localStorage.getItem("token");

if (token) {
    console.log("Utilisateur connecté");

    // changer login → logout
    const loginLink = document.querySelector("nav ul li a");

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

    // afficher le bouton modifier
    const editButton = document.querySelector(".edit-button");
    if (editButton) {
        editButton.style.display = "block";
    }
}

function displayWorks(works){//sert à construire dynamiquement le HTML ici affiche les projets dans la galerie

    const gallery = document.querySelector(".gallery");//récupération de la classe galerry afin d'y inserer nos éléments
    gallery.innerHTML = "";//sert à éviter d'empiler les projets lors de l'utilisation d'un filtre

    works.forEach(work => {//boucle qui va parcourir un tableau ici va traiter chaque projet individuellement

        const figure = document.createElement("figure");//création d'un élément ici le conteneur du projet
        figure.dataset.id = work.id;//ajout de l'attribut data-id 
        figure.dataset.categoryId = work.categoryId;//id de la categorie
        figure.dataset.userId = work.userId;//id du projet en fonction de l'utilisateur

        const img = document.createElement("img");//création de la balise image ou sera afficher les photo 
        img.src = work.imageUrl;//utilisation de l'image via l'api
        img.alt = work.title;//texte pour les malvoyant

        const figcaption = document.createElement("figcaption");//création de la légende qui va servir à afficher le titre 
        figcaption.textContent = work.title;//affichage du titre

        figure.appendChild(img);//ajout de l'image dans figure
        figure.appendChild(figcaption);//ajout du titre dans figure

        gallery.appendChild(figure);//affichage de ce que contient figure dans la gallery 
    });
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
});

    fetch("http://localhost:5678/api/categories")//appel de l'api pour les filtres
    .then(response => response.json())
    .then(categories =>{

    const filtersContainer = document.querySelector(".filters");//récupération de la div filtre pour inserer nos éléments va nous servir de conteneur

    const allButton = document.createElement("button");//création d'un boutton 
    allButton.textContent = "Tous";//qu'on va nommer tous
    allButton.classList.add("active"); // actif par défaut
    allButton.dataset.id = "0"; // id set à 0 pour identifier le filtre tous 

    filtersContainer.appendChild(allButton);//ajout du bouton dans la div filtre

    allButton.addEventListener("click", () => {//detecteur de clic qui va permettre d'activer notre fonction

      setActiveButton(allButton);//va activer visuellement le bouton 

      displayWorks(allWorks);//va afficher tous les projets (reset des filtres)
    });

categories.forEach((category, index) => {//boucle des filtres afin de parcourire chaque catégorie

  const button = document.createElement("button");//création des boutons

  button.textContent = category.name;//on donne leurs noms récupérer via l'api
  button.dataset.id = category.id;//on donne leurs id pareil via l'api 


  filtersContainer.appendChild(button);//affichage des boutons dans la div filtre

  button.addEventListener("click", () => {//detecteur de clic qui va permettre d'activer la fonction

    setActiveButton(button);//activation visuelle du viltre 

    const categoryId = parseInt(button.dataset.id);//conversion en nombre de l'id ("2" en 2 car considérer comme une chaine de caractère)

    const filteredWorks = allWorks.filter(work =>//filtrage des projets par catégorie
        work.categoryId === categoryId
    );

    displayWorks(filteredWorks);//affichafe des projets une fois filtrés

    });

    });
  });
