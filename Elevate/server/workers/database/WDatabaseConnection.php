<?php

include_once "config.php";
require_once "exceptions/DatabaseException.php";

/**
 * Classe connexion
 *
 * Cette classe de gérer l'accès à la base de données.
 *
 * @version 1.0
 * @author Neuhaus Olivier <neuhauso@edufr.ch>
 * @project exemple
 */

class WDatabaseConnection {

    private static $_instance = null;
    private $pdo;

    /**
     * Méthode qui crée l'unique instance de la classe
     * si elle n'existe pas encore puis la retourne.
     *
     * @return WDatabaseConnection de la connexion
     */
    public static function getInstance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new WDatabaseConnection();
        }
        return self::$_instance;
    }

    /**
     * Fonction permettant d'ouvrir une connexion à la base de données.
     */
    public function __construct() {
        try {
            $this->pdo = new PDO(DB_TYPE . ':host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PASS, array(
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                PDO::ATTR_PERSISTENT => true));
        } catch (PDOException $e) {
            print "{" .
                "\"status\":\"failure\"," 
                . "\"code\":\"500\","  
                . "\"initerror\":" . json_encode($e->getMessage()) 
                . "}";
            http_response_code(500);
            die();
        }
    }

    /**
     * Fonction permettant de fermer la connexion à la base de données.
     */
    public function __destruct() {
        $this->pdo = null;
    }

    /**
     * Fonction permettant d'exécuter un select dans MySQL.
     * A utiliser pour les SELECT.
     * 
     * @param string $query. Requête à exécuter.
     * @param array $params. Contient les paramètres à ajouter à la requête (null si aucun paramètre n'est requis)
     * @return array|false Liste de tous les résultats
     * @throws DatabaseException A database exception
     */
    public function selectQuery($query, $params) : array 
    {
        try {
            $queryPrepared = $this->pdo->prepare($query);
            $queryPrepared->execute($params);
            return $queryPrepared->fetchAll();
        } catch (Exception $e) {
            throw new DatabaseException($e->getMessage());
        }
    }

    /**
     * Fonction permettant d'exécuter un select avec une seule réponse dans MySQL.
     * A utiliser pour les SELECT.
     * 
     * @param string $query. Requête à exécuter.
     * @param array $params. Contient les paramètres à ajouter à la requête (null si aucun paramètre n'est requis)
     * @return array La première ligne du select
     * @throws DatabaseException A database exception
     */
    public function selectSingleQuery($request, $params) {
        try {
            $this->pdo->beginTransaction();
            $queryPrepared = $this->pdo->prepare($request);
            $queryPrepared->execute($params);
            $this->pdo->commit();
            return $queryPrepared->fetch();
        } catch (Exception $e) {
            $this->pdo->rollback();
            print "Erreur !: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    /**
     * Fonction permettant d'exécuter une requête MySQL.
     * A utiliser pour les UPDATE, DELETE, INSERT.
     *
     * @param string $query. Requête à exécuter.
     * @param array $params. Contient les paramètres à ajouter à la requête  (null si aucun paramètre n'est requis)
     * @return int le nombre de lignes affectées par la requête
     * @throws DatabaseException A database exception
     */
    public function executeQuery($query, $params) {
        try {
            $queryPrepared = $this->pdo->prepare($query);
            $queryPrepared->execute($params);
            return $queryPrepared->rowCount();
        } catch (PDOException $e) {
            throw new DatabaseException($e->getMessage());
        }
    }

    /**
     * Fonction permettant d'obtenir le dernier id inséré.
     * 
     * @param string $table. la table où a été inséré l'objet. 
     * @return int: l'id du dernier élément inséré.
     * @throws DatabaseException A database exception
     */
    public function getLastId($table) {
        try {
            $lastId = $this->pdo->lastInsertId($table);
            return $lastId;
        } catch (PDOException $e) {
            throw new DatabaseException($e->getMessage());
        }
    }

    /**
     * Méthode permettant de débuter une nouvelle transaction
     * 
     * @return bool: true si la transaction a bien débuté
     */
    public function startTransaction() {
        return $this->pdo->beginTransaction();
    }

    /**
     * Méthode permettant d'ajouter une requête à la transaction en cours
     * 
     * @return bool: true si la requête est fonctionnelle et qu'une transaction est bien en cours
     */
    public function addQueryToTransaction($query, $params) {
        $res = false;
        if ($this->pdo->inTransaction()) {
            $maQuery = $this->pdo->prepare($query);
            $res = $maQuery->execute($params);
        }
        return $res;
    }

    /**
     * Méthode permettant de valider la transaction
     * 
     * @return bool: true si la validation s'est correctement déroulée et qu'une transaction était bien en cours
     */
    public function commitTransaction() {
        $res = false;
        if ($this->pdo->inTransaction()) {
            $res = $this->pdo->commit();
        }
        return $res;
    }

    /**
     * Méthode permettant d'annuler la transaction
     * 
     * @return bool: true si la validation s'est correctement annulée et qu'une transaction était bien en cours
     */
    public function rollbackTransaction() {
        $res = false;
        if ($this->pdo->inTransaction()) {
            $res = $this->pdo->rollBack();
        }
        return $res;
    }
}
?>