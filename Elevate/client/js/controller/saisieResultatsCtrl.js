/*
 * SaisieResultatController
 * 
 * Contrôleur pour la saisie des résultats des concurrents.
 * Permet l'enregistrement des résultats, la gestion de la date/heure,
 * ainsi que la synchronisation des résultats en mode hors-ligne grâce à IndexedDB.
 * 
 * Auteur : Langenegger Max
 * Version : 1.0 / 15.05.2025
 */
class SaisieResultatController {

    /**
     * Constructeur de la classe SaisieResultatController
     * @param {string} idPoste - Identifiant du poste sélectionné
     * Initialise la vue et configure les événements utilisateurs.
     */
    constructor(idPoste) {
        // Charge la vue HTML pour la saisie des résultats
        $("#content").load("views/saisieResultats.html", () => {
            // Bouton de retour à la sélection des postes
            $("#retourSelection").on("click", () => this.gotoPostesCommissaire());

            // Bouton pour insérer automatiquement l'heure actuelle
            $("#heureActuelle").on("click", () => {
                const dateHeure = indexCtrl.obtenirDateHeureActuelle();
                $("#datetime").val(dateHeure);
            });

            // Bouton pour poster un résultat
            $("#postResultat").on("click", async () => {
                const numeroDossard = $("#dossard").val();
                const dateHeure = $("#datetime").val();
                const estValide = !isNaN(Date.parse(dateHeure.replace(" ", "T")));

                if (!estValide) {
                    alert("La date et heure est invalide.");
                    return;
                }

                const remarques = $("#remarques").val();
                const idCommissaire = localStorage.getItem("id");

                const data = {
                    idPoste,
                    numeroDossard,
                    dateHeure,
                    remarques,
                    idCommissaire
                };

                if (navigator.onLine) {
                    // En ligne : envoie directement la requête au serveur
                    postResultatConcurrent(
                        idPoste, numeroDossard, dateHeure, remarques, idCommissaire,
                        () => {
                            Swal.fire({
                                title: "Résultat enregistré !",
                                text: "Le concurrent N° " + numeroDossard + " a reçu un résultat",
                                icon: "success"
                            });
                            // Réinitialise les champs du formulaire
                            $('input[type="text"]').val('');
                            $('#dossard').val('');
                            $('#remarques').val('');
                            $('#dossard').focus();
                        },
                        (error) => {
                            alert("Erreur lors de l'ajout du résultat: " + error.responseText);
                        }
                    );
                } else {
                    // Hors-ligne : stocke la requête localement
                    console.log("Hors ligne : stockage local du résultat");
                    await this.storeOfflineResult(data);
                    Swal.fire({
                        title: "Vous êtes hors connexion !",
                        text: "Les requêtes sont mises en attente",
                        icon: "warning"
                    });
                    // Réinitialise les champs du formulaire
                    $('input[type="text"]').val('');
                    $('#dossard').val('');
                    $('#remarques').val('');
                    $('#dossard').focus();
                }
            });
        });
    }

    /**
     * Méthode storeOfflineResult()
     * Stocke le résultat dans IndexedDB en cas de fonctionnement hors-ligne.
     * @param {Object} data - Données du résultat à stocker.
     */
    async storeOfflineResult(data) {
        const db = await new PostesCommissaireController().openPostDB();
        const tx = db.transaction('post-requests', 'readwrite');
        const store = tx.objectStore('post-requests');
        await store.add({
            functionName: "postResultatConcurrent",
            args: [
                data.idPoste,
                data.numeroDossard,
                data.dateHeure,
                data.remarques,
                data.idCommissaire
            ]
        });
    }

    /**
     * Redirige l’utilisateur vers la page de sélection des postes du commissaire.
     */
    gotoPostesCommissaire() {
        this.postesComm = new PostesCommissaireController(localStorage.getItem("id"));
    }

    /**
     * (Non utilisée ici) Redirige vers la saisie des malus.
     */
    gotoSaisieMalus() {
        this.saisieMalus = new SaisieMalusController();
    }
}
