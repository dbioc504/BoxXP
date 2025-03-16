<?php

session_start();


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
        $_SESSION['user'] = $email; // Store the email in session
        session_write_close();
        header("Location: index.html"); // page change
        exit();
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
            $_SESSION['user'] = $email; // Store the email in session
            session_write_close();
            header("Location: index.html"); // page change
            exit();
        }
    } else {
        echo "User not found. Please check your login details.";
    }
}

if (isset($_POST['appData'])) {
    if ($conn->connect_error) {
        echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    // Decode the JSON data sent from JavaScript
    $appData = json_decode($_POST['appData'], true);

    // Check if 'skills' data exists
    if (isset($appData['skills'])) {

        $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser"; // Use the email as the username
        $dogwork = $pressure = $boxing = '';


        // Loop through the skills array and insert/update data
        foreach ($appData['skills'] as $skill) {

            // Insert based on category type
            foreach ($skill['items'] as $item) {
                switch (strtolower($skill['category'])) {
                    case 'dogwork':
                        $dogwork .= $item . ', ';
                        break;
                    case 'pressure':
                        $pressure .= $item . ', ';
                        break;
                    case 'boxing':
                        $boxing .= $item . ', ';
                        break;
                }
            }

//            // Clean up trailing commas
//            $dogwork = rtrim($dogwork, ', ');
//            $pressure = rtrim($pressure, ', ');
//            $boxing = rtrim($boxing, ', ');

            // Check if the user already exists in the skills table
            $check_sql = "SELECT * FROM skills WHERE username = '$username'";
            $result = $conn->query($check_sql);

            if ($result->num_rows > 0) {
                // Update existing record
                $update_sql = "UPDATE skills SET dogwork = ?, pressure = ?, boxing = ? WHERE username = ?";
                $stmt = $conn->prepare($update_sql);
                $stmt->bind_param("ssss", $dogwork, $pressure, $boxing, $username);
                $stmt->execute();
                $stmt->close();
            } else {
                // Insert new record
                $insert_sql = "INSERT INTO skills (username, dogwork, pressure, boxing) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($insert_sql);
                $stmt->bind_param("ssss", $username, $dogwork, $pressure, $boxing);
                $stmt->execute();
                $stmt->close();
            }
        }

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "No skills data received"]);
    }
}

// quit connection
$conn->close();

var_dump($_POST);

?>