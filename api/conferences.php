<?php
/**
 * SEAMUNs Conferences API
 * Handles conference-related operations
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

// GET: Retrieve conferences
function handleGet($db) {
    $conferenceId = $_GET['id'] ?? null;
    
    if ($conferenceId) {
        // Get single conference with all details
        $stmt = $db->prepare("
            SELECT * FROM conferences WHERE conference_id = ?
        ");
        $stmt->execute([$conferenceId]);
        $conference = $stmt->fetch();
        
        if (!$conference) {
            handleError('Conference not found', 404);
        }
        
        // Get committees
        $stmt = $db->prepare("SELECT * FROM committees WHERE conference_id = ?");
        $stmt->execute([$conferenceId]);
        $conference['committees'] = $stmt->fetchAll();
        
        // Get allocations
        $stmt = $db->prepare("SELECT country FROM allocations WHERE conference_id = ?");
        $stmt->execute([$conferenceId]);
        $conference['allocations'] = array_column($stmt->fetchAll(), 'country');
        
        // Get unique topics
        $stmt = $db->prepare("SELECT topic FROM unique_topics WHERE conference_id = ?");
        $stmt->execute([$conferenceId]);
        $conference['uniqueTopics'] = array_column($stmt->fetchAll(), 'topic');
        
        // Get available awards
        $stmt = $db->prepare("SELECT award_name FROM available_awards WHERE conference_id = ?");
        $stmt->execute([$conferenceId]);
        $conference['availableAwards'] = array_column($stmt->fetchAll(), 'award_name');
        
        sendJSON($conference);
    } else {
        // Get all conferences
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;
        
        $query = "SELECT * FROM conferences WHERE 1=1";
        $params = [];
        
        if ($status) {
            $query .= " AND status = ?";
            $params[] = $status;
        }
        
        if ($search) {
            $query .= " AND (name LIKE ? OR location LIKE ? OR organization LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        $query .= " ORDER BY start_date DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $conferences = $stmt->fetchAll();
        
        sendJSON($conferences);
    }
}

// POST: Create new conference
function handlePost($db) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        handleError('Invalid JSON data', 400);
    }
    
    $stmt = $db->prepare("
        INSERT INTO conferences (
            name, organization, location, country_code, start_date, end_date,
            description, website, registration_deadline, position_paper_deadline,
            status, size, general_email, mun_account, advisor_account,
            sec_gen_accounts, parliamentarian_accounts, price_per_delegate,
            independent_dels_welcome, independent_signup_link, advisor_signup_link,
            disabled_suitable, sensory_suitable, schedule, venue_guide, extra_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $data['name'] ?? null,
        $data['organization'] ?? null,
        $data['location'] ?? null,
        $data['countryCode'] ?? null,
        $data['startDate'] ?? null,
        $data['endDate'] ?? null,
        $data['description'] ?? null,
        $data['website'] ?? null,
        $data['registrationDeadline'] ?? null,
        $data['positionPaperDeadline'] ?? null,
        $data['status'] ?? 'upcoming',
        $data['size'] ?? null,
        $data['generalEmail'] ?? null,
        $data['munAccount'] ?? null,
        $data['advisorAccount'] ?? null,
        $data['secGenAccounts'] ?? null,
        $data['parliamentarianAccounts'] ?? null,
        $data['pricePerDelegate'] ?? null,
        $data['independentDelsWelcome'] ?? false,
        $data['independentSignupLink'] ?? null,
        $data['advisorSignupLink'] ?? null,
        $data['disabledSuitable'] ?? false,
        $data['sensorySuitable'] ?? false,
        $data['schedule'] ?? null,
        $data['venueGuide'] ?? null,
        $data['extraNotes'] ?? null
    ]);
    
    $conferenceId = $db->lastInsertId();
    
    // Insert committees if provided
    if (!empty($data['committees'])) {
        $stmt = $db->prepare("INSERT INTO committees (conference_id, name, topic, chair_info) VALUES (?, ?, ?, ?)");
        foreach ($data['committees'] as $committee) {
            $stmt->execute([$conferenceId, $committee['name'], $committee['topic'] ?? null, $committee['chairInfo'] ?? null]);
        }
    }
    
    sendJSON(['success' => true, 'conference_id' => $conferenceId], 201);
}

// PUT: Update conference
function handlePut($db) {
    $conferenceId = $_GET['id'] ?? null;
    
    if (!$conferenceId) {
        handleError('Conference ID required', 400);
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        handleError('Invalid JSON data', 400);
    }
    
    $stmt = $db->prepare("
        UPDATE conferences SET
            name = ?, organization = ?, location = ?, country_code = ?,
            start_date = ?, end_date = ?, description = ?, website = ?,
            registration_deadline = ?, position_paper_deadline = ?, status = ?,
            size = ?, general_email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE conference_id = ?
    ");
    
    $stmt->execute([
        $data['name'], $data['organization'], $data['location'], $data['countryCode'],
        $data['startDate'], $data['endDate'], $data['description'], $data['website'],
        $data['registrationDeadline'], $data['positionPaperDeadline'], $data['status'],
        $data['size'], $data['generalEmail'], $conferenceId
    ]);
    
    sendJSON(['success' => true]);
}

// DELETE: Remove conference
function handleDelete($db) {
    $conferenceId = $_GET['id'] ?? null;
    
    if (!$conferenceId) {
        handleError('Conference ID required', 400);
    }
    
    $stmt = $db->prepare("DELETE FROM conferences WHERE conference_id = ?");
    $stmt->execute([$conferenceId]);
    
    sendJSON(['success' => true]);
}
?>










