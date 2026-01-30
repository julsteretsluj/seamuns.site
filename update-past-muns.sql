-- Update all past MUNs to "past" status
-- This script updates all conferences where the end_date has passed
-- and the status is currently "upcoming" to "past"

UPDATE conferences 
SET status = 'past', updated_at = CURRENT_TIMESTAMP
WHERE end_date < CURDATE() 
  AND status = 'upcoming';

-- Show the updated conferences
SELECT 
    conference_id,
    name,
    start_date,
    end_date,
    status,
    updated_at
FROM conferences 
WHERE status = 'past'
ORDER BY end_date DESC;

