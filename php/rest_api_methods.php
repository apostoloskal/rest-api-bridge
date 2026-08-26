<?php
$fetchedJson = '';
$postResult = null;

function parseCustomHeaders($jsonString) {
    $curlHeaders = [];
    if (!empty(trim($jsonString))) {
        $decoded = json_decode($jsonString, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            foreach ($decoded as $key => $value) {
                $curlHeaders[] = trim($key) . ': ' . trim($value);
            }
        }
    }
    return $curlHeaders;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    if (isset($_POST['get-json'])) {
        $fetchedJson = trim($_POST['get-json']);
    }
    
    $action = $_POST['action'] ?? '';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'PHP API Bridge Tool');

    // Fetch action-
    if ($action === 'fetch') {
        $getUrl = !empty($_POST['resolved-get-endpoint']) ? $_POST['resolved-get-endpoint'] : ($_POST['get-endpoint'] ?? '');
        $rawGetHeaders = $_POST['headers-get-json'] ?? '{}';

        if (!empty($getUrl)) {
            curl_setopt($ch, CURLOPT_URL, $getUrl);

            $getHeaders = parseCustomHeaders($rawGetHeaders);
            if (!empty($getHeaders)) {
                curl_setopt($ch, CURLOPT_HTTPHEADER, $getHeaders);
            }
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($httpCode >= 200 && $httpCode < 300 && $response) {
                $decoded = json_decode($response);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $fetchedJson = json_encode($decoded, JSON_PRETTY_PRINT);
                } else {
                    $fetchedJson = "// Error: Response was not valid JSON\n" . $response;
                }
            } else {
                $fetchedJson = "// Error: HTTP request failed with code " . $httpCode;
            }
        }
    } 
    // Post action
    elseif ($action === 'post') {
        $postUrl = !empty($_POST['resolved-post-endpoint']) ? $_POST['resolved-post-endpoint'] : ($_POST['post-endpoint'] ?? '');
        $postPayload = trim($_POST['post-json'] ?? '');
        $rawPostHeaders = $_POST['headers-post-json'] ?? '{}';

        if (!empty($postUrl) && !empty($postPayload)) {
            curl_setopt($ch, CURLOPT_URL, $postUrl);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postPayload);

            $postHeaders = parseCustomHeaders($rawPostHeaders);

            if (!empty($postHeaders)) {
                $postHeaders[] = 'Content-Length: ' . strlen($postPayload);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $postHeaders);
            }
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);

            if ($curlError) {
                $postResult = ["success" => false, "message" => "cURL Error: " . $curlError];
            } else {
                $postResult = [
                    "success" => ($httpCode >= 200 && $httpCode < 300),
                    "code" => $httpCode,
                    "response" => $response
                ];
            }
        } else {
            $postResult = ["success" => false, "message" => "Post URL or Payload is empty."];
        }
    }
}
?>