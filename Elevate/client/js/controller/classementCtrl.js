/**
 * IndexController
 * 
 * Contrôleur pour gérer l'initialisation de la vue principale (Index).
 * 
 * Auteur : Langenegger
 * Version : 1.0
 */

class ClassementController {
  /**
   * Constructeur de la classe IndexController
   * Initialise le service de vue avec le fichier HTML courant
   */
  constructor() {
    $("#content").load("views/classement.html", () => {
      $("#btnRefresh").on("click", () => (this.loadData()));
      $("#btnLogin").on("click", () => (this.gotoLogin()));
     
  });

    this.loadData();

  }


  loadData() {

    if (!navigator.onLine) {
      console.warn("Mode hors ligne détecté !");
      const localData = getClassement();
      renderClassement(localData);
      return;
    }
    
    getRanking(
      async (data) => {
        await saveClassement(data);
        this.renderClassement(data);
      },
      async (xhr, status, error) => {
        console.warn("Erreur AJAX :", status, error);
        console.warn("Détail complet :", xhr.responseText);
    
        try {
          const localData = await getClassement();
          if (localData.length > 0) {
            console.info("Affichage du classement en mode hors ligne.");
            renderClassement(localData);
          } else {
            console.error("Aucune donnée locale disponible.");
          }
        } catch (e) {
          console.error("Échec de la lecture locale :", e);
        }
      }
    );


  }
 renderClassement(data) {
    const listElement = document.querySelector("ul.space-y-2");
    listElement.innerHTML = "";
  
    data.sort((a, b) => b.points - a.points);
  
    data.forEach(concurrent => {
      const listItem = document.createElement("li");
      listItem.className = "flex items-center justify-between p-3 bg-white rounded-xl shadow";
  
      listItem.innerHTML = `
        <div class="flex items-center space-x-3 cursor-pointer concurrent-item" data-id="${concurrent.id}">
          <img src="data:image/png;base64,${concurrent.photoProfil}" alt="Photo concurrent" class="w-16 h-16 rounded-full bg-gray-200" />
          <div class="text-base">
            <p class="font-semibold">N° ${concurrent.dossard} - ${concurrent.prenom} ${concurrent.nom}</p>
            <p class="text-gray-500 text-sm">${concurrent.NPA} ${concurrent.ville}</p>
          </div>
        </div>
        <span class="text-right font-bold text-base">${concurrent.points}</span>
      `;
    
      const clickableDiv = listItem.querySelector(".concurrent-item");
      clickableDiv.addEventListener("click", () => {
        console.log("ID du concurrent :", clickableDiv.dataset.id);
      });
    

      listElement.appendChild(listItem);
    });
    



   
  }
  gotoLogin(){
    this.login = new LoginController();
  }
}




