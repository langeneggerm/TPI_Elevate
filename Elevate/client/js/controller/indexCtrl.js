
class IndexController {


    constructor() {
        this.classementCtrl = new ClassementController();
    }

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

}





$(document).ready(function () {
    const indexCtrl = new IndexController();
});