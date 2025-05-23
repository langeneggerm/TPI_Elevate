class SaisieMalusController{
    /**
     * Constructeur de la classe IndexController
     * Initialise le service de vue avec le fichier HTML courant
     */
    constructor() {
        $("#content").load("views/saisieMalus.html", () => {
            $("#retourSelection").on("click",()=>this.gotoPostesCommissaire());
            $("#heureActuelle").on("click", () => {
                const dateHeure = this.obtenirDateHeureActuelle();
                $("#datetime").val(dateHeure);
            });


            $("#postMalus").on("click", () => {
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

                postMalusConcurrent( numeroDossard, dateHeure, remarques, idCommissaire,nombrePoints, () => {
                    alert("Le résultat a bien été enregistré");
                    $('input[type="text"]').val('');
                    $('#dossard').val('');
                    $('#remarques').val('');
                    $('#pointsMalus').val('');
                    $('#dossard').focus();



                }, (error) => {
                    alert("Erreur lors de l'ajout du résultat: " + error.responseText)
                })
            })
        });


    }
    postMalus

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


}