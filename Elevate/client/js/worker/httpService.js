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


function login(login, mdp, successCallback, errorCallback) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "login",
      email: login,
      password: mdp
    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback
  });
}


/**
* Récupère les données du concurrent.
* @param {Function} dossard - N° de dossard du concurrent.
* @param {Function} successCallback - Callback en cas de succès.
* @param {Function} errorCallback - Callback en cas d'échec.
*/
function getInfoConcurrent(dossard, successCallback, errorCallback) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "getInfoConcurrent",
      dossard: dossard
    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback,
  });
}

/**
* Récupère les données des postes liés au commissaire.
* @param {Function} idComm - id du commissaire.
* @param {Function} successCallback - Callback en cas de succès.
* @param {Function} errorCallback - Callback en cas d'échec.
*/
function getPostesCommissaire(idComm, successCallback, errorCallback) {

  $.ajax({
    type: "GET",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "getPostesCommissaire",
      idComm: idComm
    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback,
  });
}



function isLogged(successCallback,errorCallback){
  $.ajax({
    type: "GET",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "isLogged"
    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback,
  });
}


/**
* Récupère les données des postes liés au commissaire.
* @param {Function} idComm - id du commissaire.
* @param {Function} successCallback - Callback en cas de succès.
* @param {Function} errorCallback - Callback en cas d'échec.
*/
function postResultatConcurrent(idPoste, dossard, date, remarque, idCommissaire, successCallback, errorCallback) {

  $.ajax({
    type: "POST",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "postResultatConcurrent",
      idPoste: idPoste,
      dossard: dossard,
      date: date,
      remarque: remarque,
      idCommissaire: idCommissaire

    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback,
  });
}

/**
* Récupère les données des postes liés au commissaire.
* @param {Function} dossard - dossard du concurrent.
* @param {Function} date- date du malus.
* @param {Function} remarque - remarque concernant le malus.
* @param {Function} idCommissaire - id du commissaire.
* @param {Function} nombrePoints - nombre de points du malus.
* @param {Function} successCallback - Callback en cas de succès.
* @param {Function} errorCallback - Callback en cas d'échec.
*/
function postMalusConcurrent(dossard, date, remarque, idCommissaire, nombrePoints, successCallback, errorCallback){
  $.ajax({
    type: "POST",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "postMalusConcurrent",
      dossard: dossard,
      date: date,
      remarque: remarque,
      idCommissaire: idCommissaire,
      nombrePoints: nombrePoints

    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback,
  });

}



function disconnect(successCallback,errorCallback){

  $.ajax({
    type: "POST",
    dataType: "json",
    url: BASE_URL + "server.php",
    data: {
      action: "disconnect",
    },
    xhrFields: {
      withCredentials: true
    },
    success: successCallback,
    error: errorCallback,
  });

}





