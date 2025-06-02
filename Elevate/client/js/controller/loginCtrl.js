/**
 * LoginController
 * 
 * Contrôleur pour gérer l'authentification des utilisateurs (commissaires).
 * Il permet à l’utilisateur de saisir ses identifiants, se connecter
 * et être redirigé vers les postes correspondants après validation.
 * 
 * Auteur : Langenegger Max
 * Version : 1.0
 * Date : 15 mai 2025
 */
class LoginController {
    /**
     * Constructeur de la classe LoginController
     * Charge la vue HTML de login et initialise les événements associés.
     */
    constructor() {
        // Chargement de la vue login
        $("#content").load("views/login.html", () => {
            // Bouton pour revenir au classement général
            $("#btnClassement").on("click", () => this.gotoClassement());
            // Bouton pour déclencher la connexion
            $("#btnConnexion").on("click", () => this.loginCommissaire());

            // Préremplissage du champ email si déjà stocké en local
            if (localStorage.getItem('email')) {
                $('#email').val(localStorage.getItem('email'));
            }
        });
    }

    /**
     * Redirige l’utilisateur vers la page du classement général.
     */
    gotoClassement() {
        this.index = new IndexController();
    }

    /**
     * Redirige l’utilisateur vers la page des postes du commissaire.
     */
    gotoPosteCommissaire() {
        this.postesCommissaire = new PostesCommissaireController(localStorage.getItem("id"));
    }

    /**
     * Méthode loginCommissaire()
     * Récupère les identifiants saisis par l’utilisateur, appelle la fonction login()
     * pour vérifier les informations et gère le résultat (connexion ou message d’erreur).
     */
    loginCommissaire() {
        const username = $("#email").val();
        const password = $("#password").val();

        // Appel AJAX pour vérifier les identifiants
        login(username, password,
            (data) => {
                if (data.result === true) {
                    // Stockage des informations en local pour maintenir la session
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("id", data.id);
                    localStorage.setItem("isLogged", true);

                    // Message de confirmation avec SweetAlert
                    Swal.fire({
                        title: "Connexion Réussi",
                        text: "Utilisateur " + username + " connecté !",
                        icon: "success"
                    });

                    // Redirection vers les postes du commissaire
                    this.gotoPosteCommissaire();
                } else {
                    // Message d'erreur si les identifiants sont incorrects
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Code PIN ou email incorrect !",
                    });
                }
            },
            (error) => {
                // Gestion des erreurs réseau ou AJAX
                console.error("Erreur AJAX :", error);
                if (error.responseText) {
                    console.error("Réponse brute :", error.responseText);
                }
                alert("Erreur réseau ou problème lors de la connexion.");
            }
        );
    }
}
