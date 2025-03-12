<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

// database
$servername = "localhost";
$username = "root";
$password = "";
$database = "boxxp";

$conn = new mysqli($servername, $username, $password, $database); // connect



if (empty($_POST['email']) || empty($_POST['password'])) {
    echo "Fill in all fields.";
    exit; // Stop further execution
}


    $email = $_POST['email'];
    $pass = $_POST['password'];


// database insertion
if (isset($_POST['create_account'])) {

    $sql = "INSERT INTO login (username, password) VALUES ('$email', '$pass')";

    if ($conn->query($sql)) {
        echo "Inserted successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

if (isset($_POST['sign_in'])) {

    $sql2 = "SELECT * FROM login WHERE username = '$email' AND password = '$pass'";
    $result = $conn->query($sql2);

// Check if user exists
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "User found: Username: " . $row["username"] . " - Password: " . $row["password"] . "<br>";
        }
    } else {
        echo "User not found. Please check your login details.";
    }
}

// quit connection
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
///
var_dump($_POST);

?>