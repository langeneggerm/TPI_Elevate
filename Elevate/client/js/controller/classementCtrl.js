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
      setInterval(this.loadData(), 10000);
      $("#btnRefresh").on("click", () => (this.loadData()));
      $("#btnLogin").on("click", () => (this.gotoLogin()));
      $("#btnEdit").on("click", () => (this.gotoPosteCommissaire()));
      $("#logout").on("click", () => {
        disconnect((data) => {
          if (data.result === true) {
            Swal.fire({
              title: "Au revoir 👋",
              text: "Utilisateur " + username + " déconnecté !",
              icon: "success"
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "La déconnexion a échoué !",
            });
          }

        }, () => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "La déconnexion a échoué !",
          });
        });
        localStorage.setItem('id', null);
        localStorage.setItem('isLogged', false);
        window.location.reload();
      });
      if (localStorage.getItem("isLogged") === "true") {
        $("#logout").removeClass('hidden');
        $("#btnLogin").addClass('hidden');
        $("#btnEdit").removeClass('hidden');
      }


    });

    this.loadData();

  }


  loadData() {

    getRanking(
      async (data) => {
        this.renderClassement(data);
      },
      async (xhr, status, error) => {
        console.warn("Erreur AJAX :", status, error);
        console.warn("Détail complet :", xhr.responseText);
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
        <div class="flex items-center space-x-3 cursor-pointer concurrent-item" data-dossard="${concurrent.dossard}">
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

        this.infoConcurrent = new InfoConcurrent(clickableDiv.dataset.dossard)


      });


      listElement.appendChild(listItem);
    });
  }


  gotoLogin() {
    this.login = new LoginController();
  }

  gotoPosteCommissaire() {
    this.postesCommissaire = new PostesCommissaireController(localStorage.getItem("id"))
  }

}




