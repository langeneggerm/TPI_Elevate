/**
 * ClassementController
 * 
 * Contrôleur chargé de gérer l'affichage et la mise à jour du classement général
 * des concurrents dans l'application Elevate.
 * 
 * Il assure l'initialisation de la vue, la récupération des données via AJAX
 * et la gestion des interactions utilisateur (rafraîchissement, login, déconnexion).
 * 
 * Auteur : Langenegger
 * Version : 1.0
 */

class ClassementController {
  /**
   * Constructeur
   * Initialise la vue en chargeant le fichier HTML associé (classement.html)
   * et configure les événements utilisateurs (rafraîchir, login, édition, déconnexion).
   */
  constructor() {
    // Chargement dynamique de la vue HTML
    $("#content").load("views/classement.html", () => {
      // Événement pour rafraîchir le classement
      $("#btnRefresh").on("click", () => (this.loadData()));
      // Événement pour accéder à la page de login
      $("#btnLogin").on("click", () => (this.gotoLogin()));
      // Événement pour accéder à la page d’édition des postes (si connecté)
      $("#btnEdit").on("click", () => (this.gotoPosteCommissaire()));

      // Événement pour la déconnexion de l’utilisateur
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

        // Réinitialise les données locales et recharge la page
        localStorage.setItem('id', null);
        localStorage.setItem('isLogged', false);
        window.location.reload();
      });

      // Gestion de l'affichage des boutons selon l'état de connexion
      if (localStorage.getItem("isLogged") === "true") {
        $("#logout").removeClass('hidden');
        $("#btnLogin").addClass('hidden');
        $("#btnEdit").removeClass('hidden');
      }
    });

    // Chargement initial des données du classement
    this.loadData();
    // Mise à jour automatique toutes les 10 secondes
    setInterval(this.loadData(), 10000);
  }

  /**
   * Méthode loadData()
   * Récupère le classement via un appel AJAX et le transmet à la méthode renderClassement().
   */
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

  /**
   * Méthode renderClassement()
   * Affiche les concurrents sous forme de liste triée par nombre de points décroissant.
   * @param {Array} data - Liste des concurrents récupérés du serveur
   */
  renderClassement(data) {
    const listElement = document.querySelector("ul.space-y-2");
    listElement.innerHTML = "";

    // Trie décroissant sur le nombre de points
    data.sort((a, b) => b.points - a.points);

    // Génère le HTML pour chaque concurrent
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

      // Événement pour consulter les détails d'un concurrent
      const clickableDiv = listItem.querySelector(".concurrent-item");
      clickableDiv.addEventListener("click", () => {
        this.infoConcurrent = new InfoConcurrentController(clickableDiv.dataset.dossard);
      });

      // Ajoute l'élément à la liste
      listElement.appendChild(listItem);
    });
  }

  /**
   * Redirige l’utilisateur vers la page de connexion.
   */
  gotoLogin() {
    this.login = new LoginController();
  }

  /**
   * Redirige l’utilisateur vers la page des postes du commissaire.
   */
  gotoPosteCommissaire() {
    this.postesCommissaire = new PostesCommissaireController(localStorage.getItem("id"));
  }
}
