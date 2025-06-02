/**
 * SaisieMalusController
 * 
 * Contrôleur pour la saisie des malus attribués aux concurrents.
 * Permet de saisir les informations nécessaires (dossard, date, remarque, points)
 * et de gérer l'envoi des données, même en mode hors-ligne.
 * 
 * Auteur : Langenegger Max
 * Version : 1.0
 */
class SaisieMalusController {

    /**
     * Constructeur de la classe SaisieMalusController
     * Initialise la vue et les événements utilisateur.
     */
    constructor() {
        // Charge la vue HTML
        $("#content").load("views/saisieMalus.html", () => {
            // Bouton de retour à la liste des postes
            $("#retourSelection").on("click", () => this.gotoPostesCommissaire());

            // Bouton pour insérer l'heure actuelle automatiquement
            $("#heureActuelle").on("click", () => {
                const dateHeure = this.obtenirDateHeureActuelle();
                $("#datetime").val(dateHeure);
            });

            // Bouton pour poster un malus
            $("#postMalus").on("click", async () => {
                const numeroDossard = $("#dossard").val();
                const dateHeure = $("#datetime").val();
                const nombrePoints = $("#pointsMalus").val();

                // Vérification de la validité de la date
                const estValide = !isNaN(Date.parse(dateHeure.replace(" ", "T")));
                if (!estValide) {
                    alert("La date et heure est invalide.");
                    return;
                }

                const remarques = $("#remarques").val();
                const idCommissaire = localStorage.getItem("id");

                const data = {
                    numeroDossard,
                    dateHeure,
                    remarques,
                    idCommissaire,
                    nombrePoints
                };

                if (navigator.onLine) {
                    // Envoi direct si en ligne
                    postMalusConcurrent(
                        numeroDossard,
                        dateHeure,
                        remarques,
                        idCommissaire,
                        nombrePoints,
                        () => {
                            Swal.fire({
                                title: "Malus enregistré !",
                                text: "Le concurrent N° " + numeroDossard + " a reçu un malus",
                                icon: "success"
                            });
                            // Réinitialise les champs
                            $('input[type="text"]').val('');
                            $('#dossard').focus();
                        },
                        (error) => {
                            alert("Erreur lors de l'ajout du malus: " + error.responseText);
                        }
                    );
                } else {
                    // Hors-ligne : stockage local de la requête
                    console.log("Hors ligne : stockage local du malus");
                    await this.storeOfflineResult({
                        ...data,
                        functionName: "postMalusConcurrent",
                        args: [
                            numeroDossard,
                            dateHeure,
                            remarques,
                            idCommissaire,
                            nombrePoints
                        ]
                    });
                    Swal.fire({
                        title: "Vous êtes hors connexion !",
                        text: "Les requêtes sont mises en attente",
                        icon: "warning"
                    });
                    // Réinitialise les champs
                    $('input[type="text"]').val('');
                    $('#dossard').focus();
                }
            });
        });
    }

    /**
     * Méthode obtenirDateHeureActuelle()
     * Retourne la date et l’heure actuelle au format YYYY-MM-DD HH:mm:ss
     * pour un remplissage rapide du champ date.
     */
    obtenirDateHeureActuelle() {
        const maintenant = new Date();
        const yyyy = maintenant.getFullYear();
        const mm = String(maintenant.getMonth() + 1).padStart(2, '0');
        const dd = String(maintenant.getDate()).padStart(2, '0');
        const hh = String(maintenant.getHours()).padStart(2, '0');
        const min = String(maintenant.getMinutes()).padStart(2, '0');
        const ss = String(maintenant.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    /**
     * Redirige l’utilisateur vers la liste des postes du commissaire.
     */
    gotoPostesCommissaire() {
        this.postesComm = new PostesCommissaireController(localStorage.getItem("id"));
    }

    /**
     * Méthode storeOfflineResult()
     * Permet de stocker les requêtes POST en local via IndexedDB (non incluse ici).
     * (⚠️ à inclure dans le code complet pour la fonctionnalité hors-ligne)
     */
}
