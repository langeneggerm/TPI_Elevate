
<?php

require_once "controllers/controller.php";

$ctrl = Controller::getInstance();

// Vérification de la méthode HTTP
if (isset($_SERVER['REQUEST_METHOD'])) {
    switch ($_SERVER['REQUEST_METHOD']) {

            // ==========================
            // Gestion des requêtes GET
            // ==========================
        case 'GET':
            if (isset($_GET['action'])) {
                switch ($_GET['action']) {
                        // Récupération de tous les QR codes
                    case 'getRanking':
                        handleGetResponse($ctrl->getWorker()->getRanking());
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
                        if (isset($_POST['username'], $_POST['password'])) {
                            $username = sanitizeInput($_POST['username']);
                            $password = sanitizeInput($_POST['password']);

                            echo $session->login($username, $password);
                            http_response_code(200);
                        } else {
                            handleErrorResponse("Paramètres manquants pour la connexion.");
                        }
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