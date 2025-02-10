<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database credentials
$servername = "localhost";
$username = "root"; // Default XAMPP user
$password = ""; // Default password is empty
$database = "boxxp";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//if (isset($_POST['email']) && isset($_POST['password'])) {
    $email = $_POST['email'];
    $pass = $_POST['password'];


//$email = "email";
//$pass = "pass";

// Insert data into database
    $sql = "INSERT INTO login (username, password) VALUES ('$email', '$pass')";

    if ($conn->query($sql)) {
        echo "New record created successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
//}

// Close connection
$conn->close();


//$server = "localhost";
//$user = "root";  // Use your MariaDB username
//$password = "1321";      // Use your MariaDB password
//$database = "exampledb";
//
//// Create connection
//$conn = new mysqli($server, $user, $password, $database);
//
//// Check connection
//if ($conn->connect_error) {
//    die("Connection failed: " . $conn->connect_error);
//}
//
//echo "Connected successfully";

var_dump($_POST);

?>