<?php
header('Content-Type: application/json');
require './database.php'; 

// Get the raw JSON payload
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid data format received."]);
    exit;
}

// Extract variables
$id = isset($data['id']) ? (int)$data['id'] : 0;
$name = trim($data['name'] ?? '');
$src_url = trim($data['src_url'] ?? '');
$dst_url = trim($data['dst_url'] ?? '');
$get_headers = !empty($data['get_headers']) ? json_encode($data['get_headers']) : '{}';
$post_headers = !empty($data['post_headers']) ? json_encode($data['post_headers']) : '{}';

// Validation
if ($id <= 0) {
    echo json_encode(["success" => false, "message" => "Valid Bridge ID is required."]);
    exit;
}
if (empty($name) || empty($src_url) || empty($dst_url)) {
    echo json_encode(["success" => false, "message" => "Name, Get URL, and Post URL are required."]);
    exit;
}

// Update the database securely
try {
    $stmt = $pdo->prepare("
        UPDATE saved_bridges 
        SET name = :name, 
            src_url = :src_url, 
            dst_url = :dst_url, 
            get_headers = :get_headers,
            post_headers = :post_headers
        WHERE id = :id
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':src_url' => $src_url,
        ':dst_url' => $dst_url,
        ':get_headers' => $get_headers,
        ':post_headers' => $post_headers,
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