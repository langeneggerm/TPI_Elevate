<?php

require_once('workers/worker.php');

class SessionController
{
    private $worker;

    /**
     * SessionCtrl constructor.
     * Initialise l'objet worker et démarre une session.
     *
     * @param Worker $worker L'objet worker à utiliser.
     */
    public function __construct($worker)
    {
        $this->worker = $worker;
        session_start();
    }

    /**
    * Connecte un utilisateur.
    *
    * @param string $username Le nom d'utilisateur.
    * @param string $password Le mot de passe.
    * @return string Une chaîne JSON indiquant si la connexion a réussi et le nom d'utilisateur si c'est le cas.
    */
    public function login($email, $password) {
        $request = "SELECT * FROM t_Commissaires WHERE email = :email";
        $params = array('email' => $email);
        $user = $this->worker->getDataBaseWrk()->selectSingleQuery($request, $params);
        if(isset($user['email'])) {
            if(password_verify($password, $user['PIN'])) {
              $_SESSION['email'] = $email;
              $_SESSION['id'] = $user['id'];
                return '{"result": true, "email": "' . $user['email'] . '"' . ',"id":"' . $user['id'] . '"}';
            }
        }
        return '{"result": false}';
    }

    /**
     * Vérifie si un utilisateur est connecté.
     *
     * @return string Une chaîne JSON indiquant si un utilisateur est connecté et le nom d'utilisateur si c'est le cas.
     */
    public function isLogged()
    {
        if (isset($_COOKIE['PHPSESSID'])) {
            if (isset($_SESSION['email'])) {
                return '{"result": true, "email": "' . $_SESSION['email'] . '"}';
            }
        }
        return '{"result": false}';
    }

    /**
     * Déconnecte un utilisateur.
     *
     * @return string Une chaîne JSON indiquant que la déconnexion a réussi.
     */
    public function disconnect()
    {
        session_destroy();
        return '{"result": true}';
    }


    public function hashPassword($password)
    {
        return  password_hash($password, PASSWORD_DEFAULT);
    }
}
?>