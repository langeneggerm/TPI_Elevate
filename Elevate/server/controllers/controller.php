<?php
require_once "workers/worker.php";

class Controller {

    private static $instance = null;
    private $worker;

    /**
    * Retourne l'instance de la classe Ctrl.
    * Si l'instance n'existe pas, elle est créée.
    *
    * @return Ctrl L'instance de la classe Ctrl.
    */
    public static function getInstance() {
        if (is_null(self::$instance)) {
            self::$instance = new Controller();
        }
        return self::$instance;
    }

    /**
    * Ctrl constructor.
    * Initialise l'objet worker.
    */
    private function __construct() {
        $this->worker = new Worker();
    }

    /**
    * Retourne l'objet worker.
    *
    * @return Wrk L'objet worker.
    */
    public function getWorker() {
        return $this->worker;
    }
}