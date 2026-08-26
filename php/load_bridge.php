<?php
header('Content-Type: application/json');
require './database.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Invalid ID."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM saved_bridges WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $bridge = $stmt->fetch();

    if ($bridge) {
        echo json_encode(["success" => true, "data" => $bridge]);
    } else {
        echo json_encode(["success" => false, "message" => "Bridge not found."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>