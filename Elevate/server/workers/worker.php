<?php

require_once "database/WDatabase.php";

class Worker
{
    /** @var WDatabaseConnection Instance de la connexion à la base de données. */
    private $dataBaseWrk;

    /** @var WDatabase Instance de l'objet de gestion des opérations liées à la base de données. */
    private $db;

    /**
     * Constructeur de la classe Worker.
     * Initialise les objets nécessaires à la gestion de la base de données.
     */
    public function __construct()
    {
        $this->dataBaseWrk = new WDatabaseConnection();
        $this->db = new WDatabase();
    }

    /**
     * Récupère l'instance de gestion de la connexion à la base de données.
     * @return WDatabaseConnection L'objet de connexion à la base de données.
     */
    public function getDataBaseWrk()
    {
        return $this->dataBaseWrk;
    }

    // ======== Gestion des Lieux ========

    /**
     * Récupère tous les lieux de la base de données.
     * @return array Un tableau contenant les lieux.
     */
    public function getRanking(): array
    {
        return $this->db->getRanking();
    }


}
