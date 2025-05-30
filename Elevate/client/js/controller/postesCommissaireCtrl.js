class PostesCommissaireController {

    constructor(idCommissaire) {
        $("#content").load("views/postesCommissaire.html", async () => {
            await this.loadData(idCommissaire);

            $("#btnClassement").on("click", () => this.gotoClassement());

            // 🔹 Bouton de synchronisation des POST différés
            $("#sync-posts-btn").on("click", async () => {
                await this.flushPostRequests();
            });

            $("#logout").on("click", () => {
                disconnect((data)=>{
                    if(data.result===true){
                      Swal.fire({
                        title: "Au revoir 👋",
                        text: "Utilisateur déconnecté !",
                        icon: "success"
                      });
                    }else{
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "La déconnexion a échoué !",
                      });
                    }
          
                  }, ()=>{
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "La déconnexion a échoué !",
                    });
                  });
                localStorage.setItem('id', null);
                localStorage.setItem('isLogged', false);
                this.gotoClassement();
            });

            // 🔸 Une fois tout est prêt, on met à jour le bouton
            await this.updateButtonText(); // ← ici
            $("#sync-posts-btn").prop("disabled", false);

        });
    }


    async loadData(idCommissaire) {
        await this.updateButtonText();
        getPostesCommissaire(idCommissaire, async (data) => {
            const ul = document.getElementById('postesCommissaire');
            ul.innerHTML = '';

            const grouped = data.reduce((acc, poste) => {
                (acc[poste.typeNom] = acc[poste.typeNom] || []).push(poste);
                return acc;
            }, {});

            Object.entries(grouped).forEach(([type, postes]) => {
                const liType = document.createElement('li');
                liType.className = 'font-semibold text-lg mt-4 mb-2 border-b border-gray-300';
                liType.textContent = type;
                ul.appendChild(liType);

                postes.forEach(poste => {
                    const liPoste = document.createElement('li');
                    liPoste.className = 'flex items-center justify-between p-3 bg-blue-100 rounded-xl shadow';
                    liPoste.dataset.id = poste.id;
                    liPoste.innerHTML = `<span class="font-semibold">${poste.nom}</span>`;
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

            const liMalus = document.createElement('li');
            liMalus.className = 'flex items-center justify-between p-3 bg-red-100 rounded-xl shadow';
            liMalus.innerHTML = `<span class="font-semibold">Malus</span>`;
            liMalus.addEventListener('click', () => {
                this.gotoSaisieMalus();
            });
            ul.appendChild(liMalus);

            // 🔹 Met à jour le bouton selon le nombre de requêtes en attente


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

    // 🔸 Méthodes utilitaires de gestion IndexedDB (copiées depuis le fichier séparé)
    async openPostDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('post-requests-db', 1);
            request.onerror = () => reject('Erreur ouverture IndexedDB');
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore('post-requests', { autoIncrement: true });
            };
        });
    }

    async flushPostRequests() {
        if (!navigator.onLine) {
            Swal.fire({
                title: "Vous êtes hors ligne.",
                text: "Veuillez vous reconnecter pour envoyer les requêtes.",
                icon: "warning"
              });
            return;
        }

        const db = await this.openPostDB();
        const tx = db.transaction('post-requests', 'readwrite');
        const store = tx.objectStore('post-requests');
        const allRequests = await new Promise((resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });

        for (const req of allRequests) {
            try {
                const { functionName, args } = req;

                // Vérifie si la fonction existe
                if (typeof window[functionName] === "function") {
                    await new Promise((resolve, reject) => {
                        window[functionName](...args,
                            (data) => resolve(data),
                            (error) => reject(error)
                        );
                    });
                } else {
                    console.warn(`Fonction ${functionName} inconnue`);
                }

            } catch (err) {
                console.error('Erreur envoi requête différée:', err);
                continue;
            }
        }

        // Nettoyage
        const clearTx = db.transaction('post-requests', 'readwrite');
        await new Promise((resolve, reject) => {
            const clearReq = clearTx.objectStore('post-requests').clear();
            clearReq.onsuccess = () => resolve();
            clearReq.onerror = () => reject(clearReq.error);
        });


        await this.updateButtonText();
        alert("Toutes les requêtes en attente ont été envoyées.");
    }



    async updateButtonText() {
        const db = await this.openPostDB();
        const tx = db.transaction('post-requests', 'readonly');
        const store = tx.objectStore('post-requests');
        const allRequests = await new Promise((resolve, reject) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        const count = allRequests.length;

        const $btn = $('#sync-posts-btn');
        if (count > 0) {
            $btn.text(`Envoyer ${count} requête${count > 1 ? 's' : ''} en attente`);
            $btn.prop('disabled', false);
        } else {
            $btn.text('Aucune requête en attente');
            $btn.prop('disabled', true);
        }
    }

}
