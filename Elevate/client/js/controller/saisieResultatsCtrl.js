class SaisieResultatController {
    /**
     * Constructeur de la classe SaisieResultatController
     * Initialise le service de vue avec le fichier HTML courant
     */
    constructor(idPoste) {
        $("#content").load("views/saisieResultats.html", () => {
            $("#retourSelection").on("click", () => this.gotoPostesCommissaire());
            $("#heureActuelle").on("click", () => {
                const dateHeure = indexCtrl.obtenirDateHeureActuelle();
                $("#datetime").val(dateHeure);
            });
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
                    postResultatConcurrent(idPoste, numeroDossard, dateHeure, remarques, idCommissaire,
                        () => {
                            Swal.fire({
                                title: "Résultat enregistré !",
                                text: "Le concurrent N° " + numeroDossard + " a recu un résultat",
                                icon: "success"
                            });
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
                    console.log("Hors ligne : stockage local du résultat");
                    await this.storeOfflineResult(data);
                    Swal.fire({
                        title: "Vous êtes hors connexion !",
                        text: "Les requêtes sont mise en attente",
                        icon: "warning"
                    });
                    $('input[type="text"]').val('');
                    $('#dossard').val('');
                    $('#remarques').val('');
                    $('#dossard').focus();
                }
            });

        });
    }

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
 * Formate la date et l'heure au format YYYY-MM-DD HH:mm:ss
 */


    gotoPostesCommissaire() {
        this.postesComm = new PostesCommissaireController(localStorage.getItem("id"));
    }
    gotoSaisieMalus() {
        this.saisieMalus = new SaisieMalusController();
    }
}