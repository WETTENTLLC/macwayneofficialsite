<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $purchase = [
        'id' => $data['id'] ?? uniqid(),
        'type' => $data['type'] ?? 'track',
        'amount' => $data['amount'] ?? '1.50',
        'track' => $data['track'] ?? 'Unknown',
        'timestamp' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    $purchases = [];
    if (file_exists('purchases.json')) {
        $purchases = json_decode(file_get_contents('purchases.json'), true) ?: [];
    }
    
    $purchases[] = $purchase;
    file_put_contents('purchases.json', json_encode($purchases, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true, 'purchase_id' => $purchase['id']]);
} else {
    echo json_encode(['error' => 'Method not allowed']);
}
?>