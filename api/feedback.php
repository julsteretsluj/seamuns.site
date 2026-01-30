<?php
/**
 * SEAMUNs Feedback API
 * Handles conference feedback and reviews
 */

require_once 'database.php';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

try {
    switch ($method) {
        case 'GET':
            handleGet($db);
            break;
        case 'POST':
            handlePost($db);
            break;
        case 'PUT':
            handlePut($db);
            break;
        case 'DELETE':
            handleDelete($db);
            break;
        default:
            handleError('Method not allowed', 405);
    }
} catch (Exception $e) {
    handleError($e->getMessage());
}

// GET: Retrieve feedback
function handleGet($db) {
    $conferenceId = $_GET['conference_id'] ?? null;
    $userId = $_GET['user_id'] ?? null;
    
    if ($conferenceId) {
        // Get all feedback for a conference with statistics
        $stmt = $db->prepare("
            SELECT 
                f.*,
                u.name as user_name,
                u.profile_picture as user_avatar
            FROM feedback f
            JOIN users u ON f.user_id = u.user_id
            WHERE f.conference_id = ?
            ORDER BY f.created_at DESC
        ");
        $stmt->execute([$conferenceId]);
        $feedback = $stmt->fetchAll();
        
        // Calculate statistics
        $stats = [
            'avgRating' => 0,
            'totalReviews' => count($feedback),
            'recommendPercent' => 0
        ];
        
        if (count($feedback) > 0) {
            $totalRating = array_sum(array_column($feedback, 'rating'));
            $stats['avgRating'] = round($totalRating / count($feedback), 1);
            
            $recommendCount = count(array_filter($feedback, function($f) {
                return $f['recommend'] == 1;
            }));
            $stats['recommendPercent'] = round(($recommendCount / count($feedback)) * 100);
        }
        
        sendJSON([
            'feedback' => $feedback,
            'stats' => $stats
        ]);
    } elseif ($userId) {
        // Get all feedback by a user
        $stmt = $db->prepare("
            SELECT 
                f.*,
                c.name as conference_name
            FROM feedback f
            JOIN conferences c ON f.conference_id = c.conference_id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        ");
        $stmt->execute([$userId]);
        $feedback = $stmt->fetchAll();
        
        sendJSON($feedback);
    } else {
        handleError('Conference ID or User ID required', 400);
    }
}

// POST: Submit new feedback
function handlePost($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        handleError('Invalid JSON data', 400);
    }
    
    // Validate required fields
    if (empty($data['conference_id']) || empty($data['user_id']) || 
        empty($data['rating']) || empty($data['title']) || empty($data['comment'])) {
        handleError('Missing required fields', 400);
    }
    
    // Check if user already submitted feedback for this conference
    $stmt = $db->prepare("
        SELECT feedback_id FROM feedback 
        WHERE conference_id = ? AND user_id = ?
    ");
    $stmt->execute([$data['conference_id'], $data['user_id']]);
    
    if ($stmt->fetch()) {
        handleError('You have already submitted feedback for this conference', 409);
    }
    
    // Insert feedback
    $stmt = $db->prepare("
        INSERT INTO feedback (
            conference_id, user_id, rating, title, comment,
            recommend, highlights, improvements
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['conference_id'],
        $data['user_id'],
        $data['rating'],
        $data['title'],
        $data['comment'],
        $data['recommend'] ?? false,
        $data['highlights'] ?? null,
        $data['improvements'] ?? null
    ]);
    
    $feedbackId = $db->lastInsertId();
    
    sendJSON([
        'success' => true,
        'feedback_id' => $feedbackId
    ], 201);
}

// PUT: Update feedback
function handlePut($db) {
    $feedbackId = $_GET['id'] ?? null;
    
    if (!$feedbackId) {
        handleError('Feedback ID required', 400);
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        handleError('Invalid JSON data', 400);
    }
    
    $stmt = $db->prepare("
        UPDATE feedback SET
            rating = ?, title = ?, comment = ?,
            recommend = ?, highlights = ?, improvements = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE feedback_id = ?
    ");
    
    $stmt->execute([
        $data['rating'],
        $data['title'],
        $data['comment'],
        $data['recommend'] ?? false,
        $data['highlights'] ?? null,
        $data['improvements'] ?? null,
        $feedbackId
    ]);
    
    sendJSON(['success' => true]);
}

// DELETE: Remove feedback
function handleDelete($db) {
    $feedbackId = $_GET['id'] ?? null;
    
    if (!$feedbackId) {
        handleError('Feedback ID required', 400);
    }
    
    $stmt = $db->prepare("DELETE FROM feedback WHERE feedback_id = ?");
    $stmt->execute([$feedbackId]);
    
    sendJSON(['success' => true]);
}
?>










