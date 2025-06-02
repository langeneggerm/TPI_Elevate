/**
 * IndexController
 * 
 * Contrôleur principal qui initialise l'application.
 * Il instancie le contrôleur du classement dès le chargement de la page.
 * 
 * Auteur : Langenegger
 * Version : 1.0
 */
class IndexController {

    /**
     * Constructeur
     * Initialise le contrôleur du classement principal.
     */
    constructor() {
        this.classementCtrl = new ClassementController();
    }
}

// Lorsque le document est prêt, instancie l'IndexController pour démarrer l'application.
$(document).ready(function () {
    const indexCtrl = new IndexController();
});
