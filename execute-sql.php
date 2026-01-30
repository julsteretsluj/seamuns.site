<?php
/**
 * Execute SQL file to add TSIMUN 2026
 */

require_once 'api/database.php';

// Get database connection
$db = getDB();

try {
    // Read the SQL file
    $sql = file_get_contents('add-tsimun-2026.sql');
    
    if (!$sql) {
        throw new Exception('Could not read SQL file');
    }
    
    // Split the SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    // Execute each statement
    foreach ($statements as $statement) {
        if (!empty($statement) && !strpos($statement, '--') === 0) {
            $db->exec($statement);
        }
    }
    
    echo "✅ TSIMUN 2026 conference added successfully!\n";
    echo "📊 Conference and 6 committees have been added to the database.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
