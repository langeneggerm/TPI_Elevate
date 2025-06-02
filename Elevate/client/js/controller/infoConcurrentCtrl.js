/**
 * InfoConcurrentController
 * 
 * Contrôleur responsable de l’affichage des informations détaillées
 * d’un concurrent sélectionné (résultats et malus).
 * 
 * Il gère le chargement dynamique de la vue, la récupération des données,
 * et la génération du rendu HTML pour chaque ligne de résultat ou de malus.
 * 
 * Auteur : Langenegger
 * Version : 1.0
 */
class InfoConcurrentController {

    /**
     * Constructeur
     * @param {string} dossard - Numéro de dossard du concurrent à afficher.
     * Charge la vue et initialise les événements des boutons de navigation.
     */
    constructor(dossard) {
        // Charge la vue HTML du concurrent
        $("#content").load("views/infoConcurrent.html", () => {
            // Bouton pour accéder à la page de login
            $("#btnLogin").on("click", () => (this.gotoLogin()));
            // Bouton pour revenir au classement général
            $("#btnClassement").on("click", () => (this.gotoClassement()));
        });

        // Récupère les données du concurrent sélectionné
        this.loadData(dossard);
    }

    /**
     * Méthode loadData()
     * Récupère les résultats et malus du concurrent via AJAX et construit le rendu HTML.
     * @param {string} dossard - Numéro de dossard du concurrent.
     */
    loadData(dossard) {
        getInfoConcurrent(dossard, (data) => {
            if (!data || (!data.resultat && !data.malus)) return;

            const lignes = [];

            // Ajoute les résultats dans le tableau
            if (data.resultat && Array.isArray(data.resultat)) {
                data.resultat.forEach(item => {
                    lignes.push({
                        type: 'resultat',
                        date: item.date,
                        remarque: item.remarque || '',
                        label: `${item.nomTypePoste} - ${item.nomPoste}`,
                        points: parseInt(item.nombrePoints, 10) || 0
                    });
                });
            }

            // Ajoute les malus dans le tableau
            if (data.malus && Array.isArray(data.malus)) {
                data.malus.forEach(item => {
                    lignes.push({
                        type: 'malus',
                        date: item.date,
                        remarque: item.descriptionMalus || '',
                        label: 'Malus',
                        points: -Math.abs(parseInt(item.pointsMalus, 10)) || 0
                    });
                });
            }

            // Trie les lignes par date décroissante
            lignes.sort((a, b) => new Date(b.date) - new Date(a.date));

            let resultatsHTML;

            if (lignes.length === 0) {
                // Aucun résultat ni malus enregistré
                resultatsHTML = `
                    <li class="text-center text-gray-500 italic">
                        Aucun résultat n’est disponible pour ce concurrent.
                    </li>
                `;
            } else {
                // Génère le HTML pour chaque résultat/malus
                resultatsHTML = lignes.map(item => {
                    const dateObj = new Date(item.date);
                    const dateStr = dateObj.toLocaleDateString('fr-CH');
                    const heureStr = dateObj.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });

                    const pointsColor = item.points > 0 ? 'text-blue-600' :
                                        item.points < 0 ? 'text-red-600' :
                                        'text-gray-500';

                    const pointsStr = `${item.points > 0 ? '+' : ''}${item.points} pts`;

                    const remarqueHTML = item.remarque
                        ? `<p class="italic text-gray-600">Remarque : ${item.remarque}</p>`
                        : '';

                    return `
                        <li class="mb-3 border-b pb-2">
                            <p><strong>${item.label}</strong></p>
                            <p>${dateStr} - ${heureStr}</p>
                            ${remarqueHTML}
                            <p class="${pointsColor} font-semibold">${pointsStr}</p>
                        </li>
                    `;
                }).join('');
            }

            // Injection du rendu HTML dans le conteneur
            document.querySelector('#resultContainer').innerHTML = `
                <section class="bg-white rounded-lg shadow mt-4 p-4 mx-2 overflow-y-auto">
                    <ul class="list-none p-0 m-0">
                        ${resultatsHTML}
                    </ul>
                </section>
            `;
        });
    }

    /**
     * Redirige l’utilisateur vers la page de connexion.
     */
    gotoLogin() {
        this.login = new LoginController();
    }

    /**
     * Redirige l’utilisateur vers la page du classement général.
     */
    gotoClassement() {
        this.classement = new ClassementController();
    }

}
