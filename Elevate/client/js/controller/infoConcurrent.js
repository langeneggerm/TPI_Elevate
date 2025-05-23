

class InfoConcurrent {


    constructor(dossard) {
        $("#content").load("views/infoConcurrent.html", () => {
            $("#btnLogin").on("click", () => (this.gotoLogin()));
            $("#btnClassement").on("click", () => (this.gotoClassement()));
        });

        this.loadData(dossard);

    }



    loadData(dossard) {
        getInfoConcurrent(dossard, (data) => {
            console.log(data);
            if (!data || (!data.resultat && !data.malus)) return;

            // Fusionner résultats et malus dans un seul tableau avec une clé "type"
            const lignes = [];

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

            // Trier par date décroissante
            lignes.sort((a, b) => new Date(b.date) - new Date(a.date));

            let resultatsHTML;

            if (lignes.length === 0) {
                // Aucun résultat ou malus
                resultatsHTML = `
                    <li class="text-center text-gray-500 italic">
                        Aucun résultat n’est disponible pour ce concurrent.
                    </li>
                `;
            } else {
                // Générer le HTML pour les résultats
                resultatsHTML = lignes.map(item => {
                    const dateObj = new Date(item.date);
                    const dateStr = dateObj.toLocaleDateString('fr-CH');
                    const heureStr = dateObj.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' });

                    const pointsColor = item.points > 0 ? 'text-blue-600' :
                        item.points < 0 ? 'text-red-600' :
                            'text-gray-500';

                    const pointsStr = `${item.points > 0 ? '+' : ''}${item.points} pts`;

                    const remarqueHTML = item.remarque ? `<p class="italic text-gray-600">Remarque : ${item.remarque}</p>` : '';

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

            // Injection HTML
            document.querySelector('#resultContainer').innerHTML = `
                <section class="bg-white rounded-lg shadow mt-4 p-4 mx-2 overflow-y-auto">
                    <ul class="list-none p-0 m-0">
                        ${resultatsHTML}
                    </ul>
                </section>
            `;
        });



    }
    gotoLogin() {
        this.login = new LoginController();
    }

    gotoClassement() {
        this.classement = new ClassementController();
    }

}