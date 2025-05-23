<?php

require_once "WDatabaseConnection.php";

class WDatabase
{


    public function getRanking(): array
    {
        try {
            $QUERY = "SELECT  
            c.nom, 
            c.prenom, 
            c.dossard, 
            c.email,
            c.photoProfil, 
            c.points,
            l.NPA, 
            l.ville
        FROM 
            t_Concurrents AS c
        JOIN 
            t_Localites AS l ON c.NPALocalite = l.NPA;
        ";
            $rows = WDatabaseConnection::getInstance()->selectQuery($QUERY, []);

            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'nom' => $row['nom'],
                    'prenom' => $row['prenom'],
                    'dossard' => $row['dossard'],
                    'email' => $row['email'],
                    'photoProfil' => $row['photoProfil'],
                    'points' => $row['points'],
                    'NPA' => $row['NPA'],
                    'ville' => $row['ville'],
                ];
            }

            return $result;
        } catch (Exception $e) {
            throw new Exception("Erreur lors de la récupération du classement : " . $e->getMessage());
        }
    }

    public function getInfoConcurrent($dossard): array
    {
        try {

            $QUERYResultats = "
    SELECT
        r.date,
        r.remarque,
        p.nom AS nomPoste,
        p.nombrePoints,
        t.nom AS nomTypePoste
    FROM t_Resultats r
    JOIN t_Postes p ON r.idPoste = p.id
    JOIN t_Types t ON p.idType = t.id
    WHERE r.dossardConcurrent = :dossard
    ORDER BY r.date DESC;
";

            $params = [
                ":dossard" => $dossard
            ];

            $rowsResultats = WDatabaseConnection::getInstance()->selectQuery($QUERYResultats, $params);


            $QUERYMalus = "
    SELECT
        m.date,
        m.points AS pointsMalus,
        m.description AS descriptionMalus
    FROM t_Malus m
    WHERE m.dossardConcurrent = :dossard
    ORDER BY m.date DESC;
";

            $rowsMalus = WDatabaseConnection::getInstance()->selectQuery($QUERYMalus, $params);

            $result = [
                'resultat' => [],
                'malus' => []
            ];

            foreach ($rowsResultats as $row) {
                $result['resultat'][] = [
                    'date' => $row['date'],
                    'remarque' => $row['remarque'],
                    'nomPoste' => $row['nomPoste'],
                    'nombrePoints' => $row['nombrePoints'],
                    'nomTypePoste' => $row['nomTypePoste'],
                ];
            }


            foreach ($rowsMalus as $row) {
                $result['malus'][] = [
                    'date' => $row['date'],
                    'pointsMalus' => $row['pointsMalus'],
                    'descriptionMalus' => $row['descriptionMalus'],
                ];
            }


            return $result;
        } catch (Exception $e) {
            throw new Exception("Erreur lors de la récupération des infos du concurrent : " . $e->getMessage());
        }
    }

    public function  getPostesCommissaire($idComm)
    {
        try {
            $QUERY = "
SELECT 
    p.id,
    p.nom,
    p.nombrePoints,
    t.nom AS typeNom
FROM 
    tr_Postes_Commissaires pc
JOIN 
    t_Postes p ON pc.idPoste = p.id
JOIN 
    t_Types t ON p.idType = t.id
WHERE 
    pc.idCommissaire = :idComm;";
            $params = [
                ":idComm" => $idComm
            ];
            $rows = WDatabaseConnection::getInstance()->selectQuery($QUERY, $params);
            $result = [];

            if (!empty($rows)) {
                foreach ($rows as $row) {
                    $result[] = [
                        'id' => $row['id'],
                        'nom' => $row['nom'],
                        'nombrePoints' => $row['nombrePoints'],
                        'typeNom' => $row['typeNom']
                    ];
                }
            }


            return $result;
        } catch (Exception $e) {
            throw new Exception("Erreur lors de la récupération des postes du Commissaire : " . $e->getMessage());
        }
    }

    public function postResultatConcurrent($idPoste, $dossard, $date, $remarque, $idCommissaire)
    {
        try {

            $pointsQuery = "
                SELECT nombrePoints
                FROM t_Postes
                WHERE id = :idPoste;
            ";
            $pointsParams = [
                ":idPoste" => $idPoste
            ];
            $result = WDatabaseConnection::getInstance()->selectQuery($pointsQuery, $pointsParams);

            if (empty($result)) {
                throw new Exception("Le poste avec l'ID $idPoste n'existe pas.");
            }

            $nombrePoints = $result[0]['nombrePoints'];

            $checkDossardQuery = "
                SELECT COUNT(*) AS count
                FROM t_Concurrents
                WHERE dossard = :dossard;
            ";
            $checkParams = [
                ":dossard" => $dossard
            ];
            $result = WDatabaseConnection::getInstance()->selectQuery($checkDossardQuery, $checkParams);
            $dossardExist = $result[0]['count'] > 0;

            if (!$dossardExist) {
                throw new Exception("Le dossard $dossard n'existe pas.");
            }


            $QUERY = "
            INSERT INTO t_Resultats (date, idCommissaire, idPoste, dossardConcurrent, remarque)
            VALUES (:date, :idCommissaire, :idPoste, :dossardConcurrent, :remarque);
        ";
            $params = [
                ":date" => $date,
                ":idCommissaire" => $idCommissaire,
                ":idPoste" => $idPoste,
                ":dossardConcurrent" => $dossard,
                ":remarque" => $remarque
            ];

            WDatabaseConnection::getInstance()->executeQuery($QUERY, $params);


            $updateQuery = "
                UPDATE t_Concurrents
                SET points = points + :nombrePoints
                WHERE dossard = :dossard;
            ";
            $updateParams = [
                ":nombrePoints" => $nombrePoints,
                ":dossard" => $dossard
            ];
            WDatabaseConnection::getInstance()->executeQuery($updateQuery, $updateParams);

            return ["result" => true, "message" => "Résultat ajouté à la base de données"];
        } catch (Exception $e) {
            echo "Erreur : " . $e->getMessage();
        }
    }

    public function postMalusConcurrent($dossard, $date, $remarque, $idCommissaire, $nombrePoints)
    {
        try {

            $checkDossardQuery = "
            SELECT COUNT(*) AS count
            FROM t_Concurrents
            WHERE dossard = :dossard;
        ";
            $checkParams = [
                ":dossard" => $dossard
            ];
            $result = WDatabaseConnection::getInstance()->selectQuery($checkDossardQuery, $checkParams);
            $dossardExist = $result[0]['count'] > 0;

            if (!$dossardExist) {
                throw new Exception("Le dossard $dossard n'existe pas.");
            }

            $insertMalusQuery = "
            INSERT INTO t_Malus (points,description, dossardConcurrent, idCommissaire, date )
            VALUES (:nombrePoints, :remarque,  :dossardConcurrent, :idCommissaire, :date);
        ";
            $insertParams = [
                ":nombrePoints" => $nombrePoints,
                ":remarque" => $remarque,
                ":dossardConcurrent" => $dossard,
                ":idCommissaire" => $idCommissaire,
                ":date" => $date
            ];

            WDatabaseConnection::getInstance()->executeQuery($insertMalusQuery, $insertParams);


            $updateQuery = "
            UPDATE t_Concurrents
            SET points = points - :nombrePoints
            WHERE dossard = :dossard;
        ";
            $updateParams = [
                ":nombrePoints" => $nombrePoints,
                ":dossard" => $dossard
            ];
            WDatabaseConnection::getInstance()->executeQuery($updateQuery, $updateParams);

            return ["result" => true, "message" => "Malus enregistré dans t_Malus et points déduits du concurrent.", "Nombre de points" => $nombrePoints,"remarque"=> $remarque, "date" => $date];
        } catch (Exception $e) {
            echo "Erreur : " . $e->getMessage();
        }
    }
}
