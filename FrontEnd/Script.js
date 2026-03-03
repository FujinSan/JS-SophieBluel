fetch("http://localhost:5678/api/works")//appel de l'api 
  .then(response => response.json())//attente d'une réponse et si réponse transition en json
  .then(works => {

    const gallery = document.querySelector(".gallery");//récupération de la div gallery afin d'y inserer nos éléments

    works.forEach(work => {//parcours chaque projet 1 par 1 
        const figure = document.createElement("figure");//création de la balise figure
        figure.dataset.id = work.id;//stockage de l'id 
        figure.dataset.categoryId = work.categoryId;
        figure.dataset.userId = work.userId;

        const img = document.createElement("img");//création de l'image vide par défaut
        img.src = work.imageUrl;//utilisation de l'image donné par l'api
        img.alt = work.title;//utilisation de la déscription donné par l'api

        const figcaption = document.createElement("figcaption");//création et affichage du titre du projet
        figcaption.textContent = work.title;

        figure.appendChild(img);//met l'image et le titre dans la div figure crée plus tot
        figure.appendChild(figcaption);

        gallery.appendChild(figure);//met tout ce que contient figure dans la gallery
        });
  });

    fetch("http://localhost:5678/api/categories")//appel de l'api pour les filtres
    .then(response => response.json())
    .then(categories =>{

    const filtersContainer = document.querySelector(".filters");//récupération de la div filtre pour inserer nos éléments

    const allButton = document.createElement("button");//création d'un boutton
    allButton.textContent = "Tous";//qu'on va nommer tous
    allButton.classList.add("active"); // actif par défaut
    allButton.dataset.id = "0"; // id set à 0 pour que cela affiche tout 

    filtersContainer.appendChild(allButton);//ajout du bouton dans la div filtre

categories.forEach((category, index) => {//boucle des filtres afin de parcourire chaque catégorie
  const button = document.createElement("button");//création des boutons

  button.textContent = category.name;//on donne leurs noms 
  button.dataset.id = category.id;//on donne leurs id


  filtersContainer.appendChild(button);//affichage des boutons dans la div filtre

    });
  });
