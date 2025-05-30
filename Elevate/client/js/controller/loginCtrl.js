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
            $("#btnClassement").on("click", () => this.gotoClassement());
            $("#btnConnexion").on("click", () => this.loginCommissaire());
            if (localStorage.getItem('email')) {
                $('#email').val(localStorage.getItem('email'));
            }
            
        });

    }


    gotoClassement() {
        this.index = new IndexController();
    }

    gotoPosteCommissaire() {
        this.postesCommissaire = new PostesCommissaireController(localStorage.getItem("id"))
    }

    loginCommissaire() {
        const username = $("#email").val();
        const password = $("#password").val();
        login(username, password,
            (data) => {
                if (data.result === true) {
                    // Stockage du nom d'utilisateur en local et mise à jour de l'état de connexion
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("id", data.id);
                    localStorage.setItem("isLogged", true);
                    Swal.fire({
                        title: "Connexion Réussi",
                        text: "Utilisateur " + username + " connecté !",
                        icon: "success"
                      });
                    this.gotoPosteCommissaire();
                } else {
                    // Afficher une erreur si les informations sont incorrectes
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Code PIN ou email incorrect !",
                      });
                }
            },
            (error) => {
                console.error("Erreur AJAX :", error);
                if (error.responseText) {
                    console.error("Réponse brute :", error.responseText);
                }
                alert("Erreur réseau ou problème lors de la connexion.");
            }

        );
    }
}