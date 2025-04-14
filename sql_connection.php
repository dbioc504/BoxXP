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
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO login (username, password) VALUES ('$email', '$hashedPassword')";

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

//        $sql2 = "SELECT * FROM login WHERE username = '$email' AND password = '$password'";
//        $result = $conn->query($sql2);

// Check if user exists
//        if ($result->num_rows > 0) {
//            while ($row = $result->fetch_assoc()) {
////            echo "User found: Username: " . $row["username"] . " - Password: " . $row["password"] . "<br>";
////                $_SESSION['user'] = $email; // Store the email in session
//
//                $sql3 = "SELECT password_hash FROM users WHERE username = ?";
//                $stmt = $conn->prepare($sql3);
//                $stmt->bind_param("s", $username);
//                $stmt->execute();
//                $stmt->bind_result($storedHash);
//                $stmt->fetch();
//                $stmt->close();
//
//                echo $storedHash;
//
//                if (password_verify($password, $storedHash)) {
//                    $_SESSION['user'] = $email; // Store the email in session
//                    session_write_close();
//                    header("Location: index.html"); // page change
//                    exit();
//                }
                // Query to check if user exists
                $sql2 = "SELECT username, password FROM login WHERE username = ?";
                $stmt = $conn->prepare($sql2);
                $stmt->bind_param("s", $email);  // Bind the email to the query
                $stmt->execute();
                $stmt->bind_result($username, $storedHash);  // Fetch the result
                $stmt->fetch();
                $stmt->close();

                if ($username) {
                    // Verify the password
                    if (password_verify($password, $storedHash)) {
                        $_SESSION['user'] = $username; // Store the username in session
                        session_write_close();
                        header("Location: index.html"); // Redirect to the homepage
                        exit();
                    } else {
                        echo "Invalid password.";
                    }
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
            $dogwork = rtrim($dogwork, ', ');
            $pressure = rtrim($pressure, ', ');
            $boxing = rtrim($boxing, ', ');

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

    if (isset($appData['workouts'])) {

        $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser"; // Use the email as the username
        $upperBody = $lowerBody = $core = '';  // Initialize the variables for workout categories

        // Loop through the workouts array and insert/update data
        foreach ($appData['workouts'] as $workout) {

            // Insert based on category type
            foreach ($workout['items'] as $item) {
                switch (strtolower($workout['category'])) {
                    case 'upper-body':
                        $upperBody .= $item . ', ';
                        break;
                    case 'lower-body':
                        $lowerBody .= $item . ', ';
                        break;
                    case 'core':
                        $core .= $item . ', ';
                        break;
                }
            }

            // Clean up trailing commas
            $upperBody = rtrim($upperBody, ', ');
            $lowerBody = rtrim($lowerBody, ', ');
            $core = rtrim($core, ', ');

            // Check if the user already exists in the workouts table
            $check_sql = "SELECT * FROM workouts WHERE username = '$username'";
            $result = $conn->query($check_sql);

            if ($result->num_rows > 0) {
                // Update existing record
                $update_sql = "UPDATE workouts SET `upper-body` = ?, `lower-body` = ?, `core` = ? WHERE username = ?";
                $stmt = $conn->prepare($update_sql);
                $stmt->bind_param("ssss", $upperBody, $lowerBody, $core, $username);
                $stmt->execute();
                $stmt->close();
            } else {
                // Insert new record
                $insert_sql = "INSERT INTO workouts (username, `upper-body`, `lower-body`, `core`) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($insert_sql);
                $stmt->bind_param("ssss", $username, $upperBody, $lowerBody, $core);
                $stmt->execute();
                $stmt->close();
            }
        }

        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "No workouts data found."]);
    }

}

// Handle request to fetch user skills
if (isset($_GET['fetch_skills'])) {
    header('Content-Type: application/json');
    $email = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";

    // Log the email value to check if it's correct
    error_log("Email: " . $email);

//    if ($email === "guestUser@guestUser") {
//        // Log the guestData response
//        error_log("Returning guestData response");
////        echo json_encode(["user" => "guestData", "skills" => [], "workouts" => [], "combos" => []]);
//        echo json_encode([
//            "user" => "guestData",
//            "skills" => [
//                ["category" => "dogwork", "items" => array_filter(explode(",", "Combo-Angle-Combo,Left Hook(s),Combo-Roll-Combo"))],
//                ["category" => "pressure", "items" => array_filter(explode(",", "Forward Shuffle,Cut Off Ring,Left Hand Up, Roll Head Inside"))],
//                ["category" => "boxing", "items" => array_filter(explode(",", "Shuffle and Tick,Stand Ground, Block Combo, Combo, Shuffle Out"))]
//            ]
//        ]);
//
//        exit();
//    }

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
        echo json_encode([
            "user" => "guestData",
            "skills" => [
                ["category" => "dogwork", "items" => array_filter(explode(",", "Combo-Angle-Combo,Left Hook(s),Combo-Roll-Combo"))],
                ["category" => "pressure", "items" => array_filter(explode(",", "Forward Shuffle,Cut Off Ring,Left Hand Up, Roll Head Inside"))],
                ["category" => "boxing", "items" => array_filter(explode(",", "Shuffle and Tick,Stand Ground, Block Combo, Combo, Shuffle Out"))]
            ]
        ]);
//        error_log("No skills found for user: " . $email);
//        echo json_encode(["status" => "error", "message" => "No skills found"]);
    }
    $stmt->close();
    exit();
}

if (isset($_GET['fetch_workouts'])) {
    header('Content-Type: application/json');
    $email = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";

    // Log the email value to check if it's correct
    error_log("Email: " . $email);

    if ($email === "guestUser@guestUser") {
        // Log the guestData response
        error_log("Returning guestData response");
//        echo json_encode(["user" => "guestData", "skills" => [], "workouts" => [], "combos" => []]);
        echo json_encode([
            "user" => "guestUser@guestUser",
            "workouts" => [
                ["category" => "upper-body", "items" => array_filter(explode(",", "Pushups, Dips, Shoulder Press"))],
                ["category" => "lower-body", "items" => array_filter(explode(",", "Squats, Squat Jumps, Deadlifts"))],
                ["category" => "core", "items" => array_filter(explode(",", "Russian Twists, Dumbell Rack Marches"))]
            ]
        ]);

        exit();
    } else {

        $workoutsSQL = "SELECT `upper-body`, `lower-body`, core FROM workouts WHERE username = ?";
        $stmt = $conn->prepare($workoutsSQL);

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
            $workouts = $result->fetch_assoc();

            // Log the fetched skills data
            error_log("Fetched workouts: " . print_r($workouts, true));

            echo json_encode([
                "user" => $email,
                "workouts" => [
                    ["category" => "upper-body", "items" => array_filter(explode(",", isset($workouts['upper-body']) ? $workouts['upper-body'] : ''))],
                    ["category" => "lower-body", "items" => array_filter(explode(",", isset($workouts['lower-body']) ? $workouts['lower-body'] : ''))],
                    ["category" => "core", "items" => array_filter(explode(",", isset($workouts['core']) ? $workouts['core'] : ''))],
                ]
            ]);
        } else {
            // Log the case when no skills are found
            error_log("No workouts found for user: " . $email);
//        echo json_encode(["status" => "error", "message" => "No workouts found"]);
            echo json_encode([
                "user" => $email,
                "workouts" => [
                    ["category" => "upper-body", "items" => array_filter(explode(",", "Pushups, Dips, Shoulder Press"))],
                    ["category" => "lower-body", "items" => array_filter(explode(",", "Squats, Squat Jumps, Deadlifts"))],
                    ["category" => "core", "items" => array_filter(explode(",", "Russian Twists, Dumbell Rack Marches"))]
                ]
            ]);
        }
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