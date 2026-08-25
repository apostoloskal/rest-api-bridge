<?php

$config = require __DIR__ . '/config.php';

$host    = $config['db_host'];
$db      = $config['db_name'];
$user    = $config['db_user'];
$pass    = $config['db_pass'];
$charset = $config['db_charset'];

// Set up the Data Source Name (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Set standard PDO options for security and error handling
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // Connect to MariaDB
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    $createTableQuery = "
        CREATE TABLE IF NOT EXISTS saved_bridges (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            src_url TEXT NOT NULL,
            dst_url TEXT NOT NULL,
            key_mappings JSON,
            headers JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    
    $pdo->exec($createTableQuery);

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>