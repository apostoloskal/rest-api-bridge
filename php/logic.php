<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $getUrl = $_POST['get_endpoint'] ?? '';
    $postUrl = $_POST['post_endpoint'] ?? '';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    if (!empty($getUrl)) {
        curl_setopt($ch, CURLOPT_URL, $getUrl);
        
        $response = curl_exec($ch);

        $data = json_decode($response, true);

        if ($data) {
            $sampleItem = isset($data[0]) ? $data[0] : $data;
            $getKeys = array_keys($sampleItem);
            
            echo '<div class="p-4 bg-green-100 text-green-800 m-4 rounded">';
            echo '<h3>Found GET Parameters:</h3>';
            echo '<ul>';
            foreach ($getKeys as $key) {
                echo "<li>- $key</li>";
            }
            echo '</ul></div>';
        } else {
            echo "<p class='text-red-500 text-center'>Failed to fetch or parse GET data.</p>";
        }
    }

    if(!empty($postUrl)) {
        curl_setopt($ch, CURLOPT_URL, $postUrl);
        
        $response = curl_exec($ch);

        $data = json_decode($response, true);

        if ($data) {
            $sampleItem = isset($data[0]) ? $data[0] : $data;
            $getKeys = array_keys($sampleItem);
            
            echo '<div class="p-4 bg-green-100 text-green-800 m-4 rounded">';
            echo '<h3>Found POST Parameters:</h3>';
            echo '<ul>';
            foreach ($getKeys as $key) {
                echo "<li>- $key</li>";
            }
            echo '</ul></div>';
        } else {
            echo "<p class='text-red-500 text-center'>Failed to fetch or parse POST data.</p>";
        }
    }
}
?>