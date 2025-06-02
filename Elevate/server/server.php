
<?php

require_once "controllers/controller.php";
require_once "controllers/sessionController.php";

$ctrl = Controller::getInstance();
$session = new SessionController($ctrl->getWorker());
// Vérification de la méthode HTTP
if (isset($_SERVER['REQUEST_METHOD'])) {
    switch ($_SERVER['REQUEST_METHOD']) {

        // ==========================
        // Gestion des requêtes GET
        // ==========================
        case 'GET':
            if (isset($_GET['action'])) {
                switch ($_GET['action']) {

                    case 'getRanking':
                        handleGetResponse($ctrl->getWorker()->getRanking());
                        break;


                    case 'getInfoConcurrent':
                        handleGetResponse($ctrl->getWorker()->getInfoConcurrent($_GET['dossard']));
                        break;

                    case 'getPostesCommissaire':
                        if (isset($_GET['idComm'])) {
                            $idComm = sanitizeInput($_GET['idComm']);
                            handleGetResponse($ctrl->getWorker()->getPostesCommissaire($idComm));
                        } else {
                            handleErrorResponse("ID du commissaire manquant pour récuperer ces postes.");
                        };
                        break;

                    case 'hashPassword':
                        echo $session->hashPassword($_GET['password']);
                        break;

                    default:
                        handleErrorResponse("Action GET inconnue");
                        break;
                }
            }
            break;

        // ==========================
        // Gestion des requêtes POST
        // ==========================
        case 'POST':
            if (isset($_POST['action'])) {
                switch ($_POST['action']) {

                    case 'login':
                        if (isset($_POST['email'], $_POST['password'])) {
                            $username = sanitizeInput($_POST['email']);
                            $password = sanitizeInput($_POST['password']);
                            echo $session->login($username, $password);
                            http_response_code(200);
                        } else {
                            handleErrorResponse("Paramètres manquants pour la connexion.");
                        }
                        break;
                    case 'isLogged':
                        echo $session->isLogged();
                        http_response_code(200);
                        break;

                    case 'postResultatConcurrent':
                        // Vérification de session
                        if (!isset($_SESSION['email'])) {
                            handleErrorResponse("Utilisateur non authentifié.");
                            http_response_code(401);
                            break;
                        }

                        if (isset($_POST['idPoste'], $_POST['dossard'], $_POST['date'], $_POST['remarque'], $_POST['idCommissaire'])) {
                            $idPoste = sanitizeInput($_POST['idPoste']);
                            $dossard = sanitizeInput($_POST['dossard']);
                            $date = sanitizeInput($_POST['date']);
                            $remarque = sanitizeInput($_POST['remarque']);
                            $idCommissaire = sanitizeInput($_POST['idCommissaire']);

                            $result = $ctrl->getWorker()->postResultatConcurrent($idPoste, $dossard, $date, $remarque, $idCommissaire);

                            echo json_encode($result);
                            http_response_code(200);
                        } else {
                            handleErrorResponse("Paramètres manquants pour la connexion.");
                        }
                        break;
                    case 'postMalusConcurrent':
                        // Vérifie que l'utilisateur est connecté via la session
                        if (!isset($_SESSION['email'])) {
                            handleErrorResponse("Utilisateur non authentifié.");
                            http_response_code(401);
                            break;
                        }

                        // Vérifie la présence des paramètres POST
                        if (isset($_POST['dossard'], $_POST['date'], $_POST['remarque'], $_POST['idCommissaire'], $_POST['nombrePoints'])) {
                            $dossard = sanitizeInput($_POST['dossard']);
                            $date = sanitizeInput($_POST['date']);
                            $remarque = sanitizeInput($_POST['remarque']);
                            $idCommissaire = sanitizeInput($_POST['idCommissaire']);
                            $nombrePoints = sanitizeInput($_POST['nombrePoints']);

                            $result = $ctrl->getWorker()->postMalusConcurrent($dossard, $date, $remarque, $idCommissaire, $nombrePoints);
                            echo json_encode($result);
                            http_response_code(200);
                        } else {
                            handleErrorResponse("Paramètres manquants pour la connexion.");
                        }
                        break;




                    case 'disconnect':
                        echo $session->disconnect();
                        http_response_code(200);
                        break;

                    default:
                        handleErrorResponse("Action POST inconnue");
                        break;
                }
            }
            break;
        default:
            handleErrorResponse("Méthode HTTP non prise en charge");
            break;
    }
}

/**
 * Gère les réponses GET en JSON avec code 200.
 * @param array $response
 */
function handleGetResponse($response)
{
    echo json_encode($response);
    http_response_code(200);
}

/**
 * Gère les erreurs en JSON avec code 400.
 * @param string $message
 */
function handleErrorResponse($message)
{
    echo json_encode(["result" => false, "message" => $message]);
    http_response_code(400);
}

/**
 * Nettoie une chaîne de caractères pour éviter les attaques XSS et autres vulnérabilités liées aux entrées utilisateur.
 * 
 * Cette fonction effectue deux opérations principales :
 * 1. Supprime les espaces inutiles en début et en fin de chaîne avec `trim`.
 * 2. Convertit les caractères spéciaux HTML en entités HTML avec `htmlspecialchars`.
 *    Cela empêche l'interprétation de balises ou de caractères dangereux dans un contexte HTML.
 *
 * @param string $input La chaîne de caractères à nettoyer.
 * @return string La chaîne de caractères nettoyée et sécurisée.
 *
 * ### Exemple d'utilisation :
 * - Entrée : `<script>alert('XSS')</script>`
 * - Sortie : `&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;`
 *
 * ### Caractères convertis par htmlspecialchars :
 * - `&` devient `&amp;`
 * - `<` devient `&lt;`
 * - `>` devient `&gt;`
 * - `"` devient `&quot;`
 * - `'` devient `&#039;`
 *
 * ### Scénarios d'utilisation :
 * - Nettoyer les entrées utilisateur avant de les afficher dans une page HTML.
 * - Prévenir les attaques de type XSS dans les formulaires ou les paramètres GET/POST.
 * - Sécuriser les données affichées dans les templates ou dans les réponses JSON qui peuvent inclure du HTML.
 */
function sanitizeInput($input)
{
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
