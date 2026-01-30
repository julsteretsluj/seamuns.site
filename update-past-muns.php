<?php
/**
 * Update all past MUNs to "past" status
 * This script updates all conferences where the end_date has passed
 * and the status is currently "upcoming" to "past"
 */

require_once 'api/database.php';

// Get database connection
$db = getDB();

try {
    // Update all past conferences
    $stmt = $db->prepare("
        UPDATE conferences 
        SET status = 'past', updated_at = CURRENT_TIMESTAMP
        WHERE end_date < CURDATE() 
          AND status = 'upcoming'
    ");
    
    $stmt->execute();
    $updatedCount = $stmt->rowCount();
    
    // Get the updated conferences
    $stmt = $db->prepare("
        SELECT 
            conference_id,
            name,
            start_date,
            end_date,
            status,
            updated_at
        FROM conferences 
        WHERE status = 'past'
        ORDER BY end_date DESC
    ");
    
    $stmt->execute();
    $pastConferences = $stmt->fetchAll();
    
    echo "✅ Successfully updated $updatedCount conference(s) to 'past' status.\n\n";
    echo "📊 All past conferences:\n";
    echo str_repeat("=", 80) . "\n";
    
    foreach ($pastConferences as $conf) {
        echo sprintf(
            "ID: %d | %s | %s to %s | Status: %s\n",
            $conf['conference_id'],
            $conf['name'],
            $conf['start_date'],
            $conf['end_date'],
            $conf['status']
        );
    }
    
    echo str_repeat("=", 80) . "\n";
    echo "Total past conferences: " . count($pastConferences) . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>

