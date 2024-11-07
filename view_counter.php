<?php
$file = "portfolio_web\view_count.txt";

// Read the current count
$count = file_get_contents($file);

// Increment the count
$count++;

// Save the new count back to the file
file_put_contents($file, $count);

// Return the count
echo $count;
?>
