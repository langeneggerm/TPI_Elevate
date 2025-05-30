class SaisieMalusController {
    /**
     * Constructeur de la classe IndexController
     * Initialise le service de vue avec le fichier HTML courant
     */
    constructor() {
        $("#content").load("views/saisieMalus.html", () => {
            $("#retourSelection").on("click", () => this.gotoPostesCommissaire());
            $("#heureActuelle").on("click", () => {
                const dateHeure = this.obtenirDateHeureActuelle();
                $("#datetime").val(dateHeure);
            });
            $("#postMalus").on("click", async () => {
                const numeroDossard = $("#dossard").val();
                const dateHeure = $("#datetime").val();
                const nombrePoints = $("#pointsMalus").val();
                const estValide = !isNaN(Date.parse(dateHeure.replace(" ", "T")));
            
                if (!estValide) {
                    alert("La date et heure est invalide.");
                    return;
                }
            
                const remarques = $("#remarques").val();
                const idCommissaire = localStorage.getItem("id");
                const data = {
 // assure-toi que cette variable est définie dans ton contexte global !
                    numeroDossard,
                    dateHeure,
                    remarques,
                    idCommissaire,
                    nombrePoints
                };
            
                if (navigator.onLine) {
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
                            $('input[type="text"]').val('');
                            $('#dossard').val('');
                            $('#remarques').val('');
                            $('#pointsMalus').val('');
                            $('#dossard').focus();
                        },
                        (error) => {
                            alert("Erreur lors de l'ajout du malus: " + error.responseText);
                        }
                    );
                } else {
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
                    $('input[type="text"]').val('');
                    $('#dossard').val('');
                    $('#remarques').val('');
                    $('#pointsMalus').val('');
                    $('#dossard').focus();
                }
            });
            
        });


    }


    /**
 * Formate la date et l'heure au format YYYY-MM-DD HH:mm:ss
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

    gotoPostesCommissaire() {
        this.postesComm = new PostesCommissaireController(localStorage.getItem("id"));
    }


}