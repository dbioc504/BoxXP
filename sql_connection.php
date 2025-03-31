<?php

session_start();
//session_unset();
//session_destroy();
//if (isset($_COOKIE[session_name()])) {
//    setcookie(session_name(), '', time() - 3600, '/'); // Expire the session cookie
//}
header('Content-Type: application/json'); // Ensure the response is JSON


//error_reporting(E_ALL);
//ini_set('display_errors', 1);

ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_log("This is a test log message");


// database
$servername = "localhost";
$username = "root";
$password = "";
$database = "boxxp";



//session_unset();
//session_destroy();
//if (isset($_COOKIE[session_name()])) {
//    setcookie(session_name(), '', time() - 3600, '/'); // Expire the session cookie
//}

$conn = new mysqli($servername, $username, $password, $database); // connect



//if (empty($_POST['email']) || empty($_POST['password'])) {
//    echo "Fill in all fields.";
//    exit; // Stop further execution
//}


//    $email = $_POST['email'];
//    $pass = $_POST['password'];


//$hashedPassword = password_hash($pass, PASSWORD_DEFAULT); // <-- CHANGED: Secure password hashing
//look into this line for password security


// database insertion
if (isset($_POST['create_account'])) {

    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;

    if ($email && $password) {

        $sql = "INSERT INTO login (username, password) VALUES ('$email', '$pass')";

        if ($conn->query($sql)) {
            echo "Inserted!";

            $_SESSION['user'] = $email; // Store the email in session
            session_write_close();
            header("Location: index.html"); // page change
            exit();
        } else {
        }
    } else{

    }
}

if (isset($_POST['sign_in'])) {

    $email = isset($_POST['email']) ? $_POST['email'] : 'guestUser@guestUser';
    $password = isset($_POST['password']) ? $_POST['password'] : 'guestUser@guestUser';

    if ($email && $password) {

        $sql2 = "SELECT * FROM login WHERE username = '$email' AND password = '$pass'";
        $result = $conn->query($sql2);

// Check if user exists
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
//            echo "User found: Username: " . $row["username"] . " - Password: " . $row["password"] . "<br>";
                $_SESSION['user'] = $email; // Store the email in session


//            $skills_sql = "SELECT dogwork, pressure, boxing FROM skills WHERE username = ?";
//            $stmt = $conn->prepare($skills_sql);
//            $stmt->bind_param("s", $email);
//            $stmt->execute();
//            $skills_result = $stmt->get_result();
//
//            if ($skills_result->num_rows > 0) {
//                $_SESSION['skills'] = $skills_result->fetch_assoc(); // Store skills in session
//            } else {
//                $_SESSION['skills'] = ["dogwork" => "", "pressure" => "", "boxing" => ""]; // Default empty skills
//            }


                session_write_close();
                header("Location: index.html"); // page change
                exit();
            }
        } else {
            echo "User not found. Please check your login details.";
        }
    } else {
        echo "Email or password is missing.";
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
//        $username =
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

// Handle request to fetch user skills
if (isset($_GET['fetch_skills'])) {
    header('Content-Type: application/json');
    $email = isset($_SESSION['user']) ? $_SESSION['user'] : "guestData";

    // Log the email value to check if it's correct
    error_log("Email: " . $email);

    if ($email === "guestData") {
        // Log the guestData response
        error_log("Returning guestData response");
        echo json_encode(["user" => "guestData", "skills" => [], "workouts" => [], "combos" => []]);
        exit();
    }

    $skillsSQL = "SELECT dogwork, pressure, boxing FROM skills WHERE username = ?";
    $stmt = $conn->prepare($skillsSQL);

    // Log before binding the parameter
    error_log("Preparing SQL query");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    // Log after executing the query
    error_log("Query executed, fetching result");

    $result = $stmt->get_result();

    // Log the number of rows in the result
    error_log("Number of rows in result: " . $result->num_rows);

    if ($result->num_rows > 0) {
        $skills = $result->fetch_assoc();

        // Log the fetched skills data
        error_log("Fetched skills: " . print_r($skills, true));

        echo json_encode([
            "user" => $email,
            "skills" => [
                ["category" => "dogwork", "items" => array_filter(explode(",", isset($skills['dogwork']) ? $skills['dogwork'] : ''))],
                ["category" => "pressure", "items" => array_filter(explode(",", isset($skills['pressure']) ? $skills['pressure'] : ''))],
                ["category" => "boxing", "items" => array_filter(explode(",", isset($skills['boxing']) ? $skills['boxing'] : ''))],
            ]
        ]);
    } else {
        // Log the case when no skills are found
        error_log("No skills found for user: " . $email);
        echo json_encode(["status" => "error", "message" => "No skills found"]);
    }
    $stmt->close();
    exit();
}


//if (isset($_SESSION['user'])) {
//    echo json_encode(["user" => $_SESSION['user']]);
//} else {
//    echo json_encode(["user" => null]); // No user logged in
//}


// quit connection
$conn->close();

var_dump($_POST);

?>