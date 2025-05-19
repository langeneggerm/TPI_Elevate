/*
 * Couche de services HTTP (worker).
 *
 * @author Langenegger Max
 * @version 1.0 / 15.05.2025
 */
var BASE_URL = "https://elevate.emf-infopro-tpi.ch/server/";


/**
 * Récupère les données de classement.
 * @param {Function} successCallback - Callback en cas de succès.
 * @param {Function} errorCallback - Callback en cas d'échec.
 */
function getRanking(successCallback, errorCallback) {
    $.ajax({
      type: "GET",
      dataType: "json",
      url: BASE_URL + "server.php",
      data: "action=getRanking",
      xhrFields: {
        withCredentials: true
      },
      success: successCallback,
      error: errorCallback,
    });
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("elevateDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("classement")) {
          db.createObjectStore("classement", { keyPath: "id" });
        }
      };
  
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
  
  async function saveClassement(data) {
    const db = await openDatabase();
    const tx = db.transaction("classement", "readwrite");
    const store = tx.objectStore("classement");
  
    data.forEach(commissaire => store.put(commissaire));
  
    return tx.complete;
  }
  
  async function getClassement() {
    const db = await openDatabase();
    const tx = db.transaction("classement", "readonly");
    const store = tx.objectStore("classement");
  
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  