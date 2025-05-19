<?php

require_once "WDatabaseConnection.php";

class WDatabase
{


    public function getRanking(): array
    {
        try {
            $QUERY = "SELECT 
            c.id, 
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
            t_Localites AS l ON c.idLocalite = l.id;
        ";
            $rows = WDatabaseConnection::getInstance()->selectQuery($QUERY, []);
    
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'id' => $row['id'],
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
    
}
