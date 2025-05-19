/**
 * LoginController
 * 
 * Contrôleur pour gérer l'authentification des utilisateurs.
 * 
 * Auteur : Langenegger Max
 * Version : 1.0
 * Date : 15 mai 2025
 */

class LoginController {
    /**
     * Constructeur de la classe LoginController
     */
    constructor() {
        $("#content").load("views/login.html", () => {
            $("#btnClassement").on("click", () => (this.gotoClassement()));
        });
        this.load();
    }

    /**
     * Vérifie si l'utilisateur est autorisé
     * @returns {boolean} - Retourne true par défaut (ou peut être étendu pour une logique supplémentaire)
     */
    isAuthorized() {
        return true;
    }


    gotoClassement(){
        this.index = new IndexController();

    }
  

    /**
     * Configure les événements et gère la soumission du formulaire de connexion
     */
    load() {

        // Appel de la fonction d'authentification
        /*     login(
                 username,
                 password,
                 (data) => {
                     if (data.result === true) {
                         // Stockage du nom d'utilisateur en local et mise à jour de l'état de connexion
                         localStorage.setItem("username", data.username);
                         this.viewService.setUserConnected(data.username);
 
                         // Redirection vers la vue JPO
                         this.viewService.changeView("jpo", true, data.username);
                     } else {
                         // Afficher une erreur si les informations sont incorrectes
                         this.viewService.showError("Nom d'utilisateur ou mot de passe invalide.");
                     }
                 },
                 () => {
                     // Gérer les erreurs réseau ou autres problèmes lors de la connexion
                     this.viewService.showError("Erreur réseau ou problème lors de la connexion.");
                 }
             );*/

    }
}