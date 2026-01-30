<?php
/**
 * Execute SQL file to add HISMUN VI
 */

require_once 'api/database.php';

// Get database connection
$db = getDB();

try {
    // Read the SQL file
    $sql = file_get_contents('add-hismun-vi.sql');
    
    if (!$sql) {
        throw new Exception('Could not read SQL file');
    }
    
    // Split the SQL into individual statements
    // Remove comments and empty lines
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && 
                   !preg_match('/^--/', $stmt) && 
                   !preg_match('/^SELECT.*message/', $stmt); // Skip the SELECT message statement
        }
    );
    
    // Execute each statement
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $db->exec($statement);
            } catch (PDOException $e) {
                // Skip if it's a duplicate entry error (conference already exists)
                if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                    echo "⚠️  Conference already exists, skipping insert...\n";
                    continue;
                }
                throw $e;
            }
        }
    }
    
    echo "✅ HISMUN VI conference added successfully!\n";
    echo "📊 Conference and 6 committees have been added to the database.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>

