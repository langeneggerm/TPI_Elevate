class SaisieResultatController {
    /**
     * Constructeur de la classe SaisieResultatController
     * Initialise le service de vue avec le fichier HTML courant
     */
    constructor(idPoste) {
        $("#content").load("views/saisieResultats.html", () => {
            $("#retourSelection").on("click",()=>this.gotoPostesCommissaire());
            $("#heureActuelle").on("click", () => {
                const dateHeure = this.obtenirDateHeureActuelle();
                $("#datetime").val(dateHeure);
            });

            $("#postResultat").on("click", () => {
                const numeroDossard = $("#dossard").val();
                const dateHeure = $("#datetime").val();
                const estValide = !isNaN(Date.parse(dateHeure.replace(" ", "T")));

                if (!estValide) {
                    alert("La date et heure est invalide.");
                    return;
                }


                const remarques = $("#remarques").val();
                const idCommissaire = localStorage.getItem("id");

                postResultatConcurrent(idPoste, numeroDossard, dateHeure, remarques, idCommissaire, (data) => {
                    alert("Le résultat a bien été enregistré");
                    $('input[type="text"]').val('');
                    $('#dossard').val('');
                    $('#remarques').val('');
                    $('#dossard').focus();



                }, (error) => {
                    alert("Erreur lors de l'ajout du résultat: " + error.responseText)
                })
            })
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

    gotoPostesCommissaire(){
        this.postesComm = new PostesCommissaireController(localStorage.getItem("id"));
    }
gotoSaisieMalus(){
    this.saisieMalus = new SaisieMalusController();
}
}