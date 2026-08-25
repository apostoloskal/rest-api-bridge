<?php
header('Content-Type: application/json');
require 'database.php'; 

// Get the raw JSON payload
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid data format received."]);
    exit;
}

// Extract variables
$id = isset($data['id']) ? (int)$data['id'] : 0;
$key_mappings = !empty($data['key_mappings']) ? json_encode($data['key_mappings']) : '{}';

// Validation
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Valid Bridge ID is required."]);
    exit;
}

// Update the database securely
try {
    $stmt = $pdo->prepare("
        UPDATE saved_bridges 
        SET key_mappings = :key_mappings 
        WHERE id = :id
    ");
    
    $stmt->execute([
        ':key_mappings' => $key_mappings,
        ':id' => $id
    ]);

    // Check if a row was actually modified
    if ($stmt->rowCount() > 0 || $stmt->errorCode() == '00000') {
        echo json_encode(["success" => true, "message" => "Bridge updated successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Bridge not found or no changes were made."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}

?>