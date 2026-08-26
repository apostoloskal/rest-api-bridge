<?php
header('Content-Type: application/json');

require './database.php'; 

// Get the raw JSON payload from JavaScript
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid data format received."]);
    exit;
}

// Extract variables
$name = trim($data['name'] ?? '');
$src_url = trim($data['src_url'] ?? '');
$dst_url = trim($data['dst_url'] ?? '');

// Convert arrays back to JSON strings for MariaDB's JSON column
$key_mappings = !empty($data['key_mappings']) ? json_encode($data['key_mappings']) : '{}';
$get_headers = !empty($data['get_headers']) ? json_encode($data['get_headers']) : '{}';
$post_headers = !empty($data['post_headers']) ? json_encode($data['post_headers']) : '{}';

// Basic Validation
if (empty($name) || empty($src_url) || empty($dst_url)) {
    echo json_encode(["success" => false, "message" => "Name, Get URL (src_url), and Post URL (dst_url) are required."]);
    exit;
}

// Insert into MariaDB safely using Prepared Statements
try {
    $stmt = $pdo->prepare("
        INSERT INTO saved_bridges (name, src_url, dst_url, key_mappings, get_headers, post_headers) 
        VALUES (:name, :src_url, :dst_url, :key_mappings, :get_headers, :post_headers)
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':src_url' => $src_url,
        ':dst_url' => $dst_url,
        ':key_mappings' => $key_mappings,
        ':get_headers' => $get_headers,
        ':post_headers' => $post_headers
    ]);

    echo json_encode([
        "success" => true, 
        "message" => "Bridge saved successfully!", 
        "id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>