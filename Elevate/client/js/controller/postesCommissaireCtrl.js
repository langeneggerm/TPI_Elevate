class PostesCommissaireController {


    constructor(idCommissaire) {

        $("#content").load("views/postesCommissaire.html", () => {
            this.loadData(idCommissaire);
            this.updateSyncButtonText();
            $("#btnClassement").on("click", () => this.gotoClassement());
            $("#logout").on("click", () => {
                disconnect((data)=>{
                    alert(JSON.stringify(data));
                  }, (error)=>{
                    alert(JSON.stringify(error));
                  });
                localStorage.setItem('id', null);
                localStorage.setItem('isLogged', false);
                this.gotoClassement();
            });


            document.getElementById('sync-posts-btn').addEventListener('click', () => {
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ action: 'sync-posts' });

                    // Optionnel : petite mise à jour visuelle
                    const btn = document.getElementById('sync-posts-btn');
                    btn.textContent = 'Synchronisation en cours…';

                    // Recompter après quelques secondes
                    setTimeout(updateSyncButtonText, 3000);
                }
            });



        });
    }


    loadData(idCommissaire) {
        getPostesCommissaire(idCommissaire, (data) => {
            // Récupérer le container <ul>
            const ul = document.getElementById('postesCommissaire');
            ul.innerHTML = ''; // reset du contenu

            // Grouper les postes par typeNom
            const grouped = data.reduce((acc, poste) => {
                (acc[poste.typeNom] = acc[poste.typeNom] || []).push(poste);
                return acc;
            }, {});

            // Pour chaque type, créer un titre <li> et les postes en <li>
            Object.entries(grouped).forEach(([type, postes]) => {
                // Item pour le titre de type
                const liType = document.createElement('li');
                liType.className = 'font-semibold text-lg mt-4 mb-2 border-b border-gray-300';
                liType.textContent = type;
                ul.appendChild(liType);

                // Pour chaque poste sous ce type
                postes.forEach(poste => {
                    const liPoste = document.createElement('li');
                    liPoste.className = 'flex items-center justify-between p-3 bg-blue-100 rounded-xl shadow';

                    // Ajouter l'id en data attribute
                    liPoste.dataset.id = poste.id;

                    liPoste.innerHTML = `
                        <span class="font-semibold">${poste.nom}</span>
                    `;

                    // Ajouter l'écouteur de clic
                    liPoste.addEventListener('click', () => {
                        this.gotoSaisieResultat(liPoste.dataset.id)
                    });

                    ul.appendChild(liPoste);
                });
            });

            const liType = document.createElement('li');
            liType.className = 'font-semibold text-lg mt-4 mb-2 border-b border-gray-300';
            liType.textContent = "Ajouter un malus";
            ul.appendChild(liType);

            // Ajouter le li "Malus" à la fin
            const liMalus = document.createElement('li');
            liMalus.className = 'flex items-center justify-between p-3 bg-red-100 rounded-xl shadow';
            liMalus.innerHTML = `<span class="font-semibold">Malus</span>`;
            liMalus.addEventListener('click', () => {
                this.gotoSaisieMalus();
            });
            ul.appendChild(liMalus);

        }, (error) => {
            console.error('Erreur récupération postes :', error);
        });



    }

    gotoClassement() {
        this.index = new IndexController();
    }

    gotoSaisieResultat(idPoste) {
        this.saisieResultat = new SaisieResultatController(idPoste);
    }

    gotoSaisieMalus() {
        this.saisieMalus = new SaisieMalusController();
    }

    updateSyncButtonText() {
        const request = indexedDB.open('offline-cache-db', 1);

        request.onsuccess = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains('post-queue')) {
                document.getElementById('sync-posts-btn').textContent = 'Aucune requête en attente';
                return;
            }

            const tx = db.transaction('post-queue', 'readonly');
            const store = tx.objectStore('post-queue');
            const countRequest = store.count();

            countRequest.onsuccess = () => {
                const count = countRequest.result;
                const button = document.getElementById('sync-posts-btn');

                if (count === 0) {
                    button.textContent = 'Aucune requête en attente';
                } else {
                    button.textContent = `Synchroniser ${count} requête${count > 1 ? 's' : ''} en attente`;
                }
            };
        };

        request.onerror = () => {
            console.warn("Impossible d'accéder à IndexedDB");
        };
    }


}