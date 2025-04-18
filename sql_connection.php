<?php

session_start();
//session_unset();
//session_destroy();
//if (isset($_COOKIE[session_name()])) {
//    setcookie(session_name(), '', time() - 3600, '/');
//}
header('Content-Type: application/json');


//error_reporting(E_ALL);
//ini_set('display_errors', 1);

ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
error_log("test log message");


$servername = "localhost";
$username = "root";
$password = "";
$database = "boxxp";



//session_unset();
//session_destroy();
//if (isset($_COOKIE[session_name()])) {
//    setcookie(session_name(), '', time() - 3600, '/');
//}

$conn = new mysqli($servername, $username, $password, $database);



//if (empty($_POST['email']) || empty($_POST['password'])) {
//    echo "Fill in all fields.";
//    exit;
//}


//    $email = $_POST['email'];
//    $pass = $_POST['password'];


//$hashedPassword = password_hash($pass, PASSWORD_DEFAULT);
//look into this line for password security


if (isset($_POST['create_account'])) {

    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;

    if ($email && $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO login (username, password) VALUES ('$email', '$hashedPassword')";

        if ($conn->query($sql)) {
            echo "Inserted!";

            $_SESSION['user'] = $email;
            session_write_close();
            header("Location: index.html");
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
                $sql2 = "SELECT username, password FROM login WHERE username = ?";
                $stmt = $conn->prepare($sql2);
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $stmt->bind_result($username, $storedHash);
                $stmt->fetch();
                $stmt->close();

                if ($username) {
                    if (password_verify($password, $storedHash)) {
                        $_SESSION['user'] = $username; //
                        session_write_close();
                        header("Location: index.html");
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

    $appData = json_decode($_POST['appData'], true);

    if (isset($appData['skills'])) {

        $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser";
//        $username =
        $dogwork = $pressure = $boxing = '';


        foreach ($appData['skills'] as $skill) {

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

            $dogwork = rtrim($dogwork, ', ');
            $pressure = rtrim($pressure, ', ');
            $boxing = rtrim($boxing, ', ');

            $check_sql = "SELECT * FROM skills WHERE username = '$username'";
            $result = $conn->query($check_sql);

            if ($result->num_rows > 0) {
                $update_sql = "UPDATE skills SET dogwork = ?, pressure = ?, boxing = ? WHERE username = ?";
                $stmt = $conn->prepare($update_sql);
                $stmt->bind_param("ssss", $dogwork, $pressure, $boxing, $username);
                $stmt->execute();
                $stmt->close();
            } else {
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

        $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser";
        $upperBody = $lowerBody = $core = '';

        foreach ($appData['workouts'] as $workout) {

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

            $upperBody = rtrim($upperBody, ', ');
            $lowerBody = rtrim($lowerBody, ', ');
            $core = rtrim($core, ', ');

            $check_sql = "SELECT * FROM workouts WHERE username = '$username'";
            $result = $conn->query($check_sql);

            if ($result->num_rows > 0) {
                $update_sql = "UPDATE workouts SET `upper-body` = ?, `lower-body` = ?, `core` = ? WHERE username = ?";
                $stmt = $conn->prepare($update_sql);
                $stmt->bind_param("ssss", $upperBody, $lowerBody, $core, $username);
                $stmt->execute();
                $stmt->close();
            } else {
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

if (isset($_GET['fetch_skills'])) {
    header('Content-Type: application/json');
    $email = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";

    error_log("Email: " . $email);

//    if ($email === "guestUser@guestUser") {
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

    error_log("Preparing SQL query");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    error_log("Query executed, fetching result");

    $result = $stmt->get_result();

    error_log("Number of rows in result: " . $result->num_rows);

    if ($result->num_rows > 0) {
        $skills = $result->fetch_assoc();

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

    error_log("Email: " . $email);

    if ($email === "guestUser@guestUser") {
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

        error_log("Preparing SQL query");

        $stmt->bind_param("s", $email);
        $stmt->execute();

        error_log("Query executed, fetching result");

        $result = $stmt->get_result();

        error_log("Number of rows in result: " . $result->num_rows);

        if ($result->num_rows > 0) {
            $workouts = $result->fetch_assoc();

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

//if (isset($_POST['combos'])) {
//    $combos = json_decode($_POST['combos'], true);
//    error_log(print_r($combos, true));
//
//    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";
//
//    if ($conn->connect_error) {
//        echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
//        exit();
//    }
//
//    if (!is_array($combos)) {
//        echo json_encode(["status" => "error", "message" => "Invalid combo data"]);
//        exit();
//    }
//
////    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser";
//
//    $delete_sql = "DELETE FROM combos WHERE username = ?";
//    $stmt = $conn->prepare($delete_sql);
//    $stmt->bind_param("s", $username);
//    $stmt->execute();
//    $stmt->close();
//
//    $insert_sql = "INSERT INTO combos (username, id, combo) VALUES (?, ?, ?)";
//    $stmt = $conn->prepare($insert_sql);
//
//    foreach ($combos as $combo) {
//        if (isset($combo['id']) && isset($combo['combo'])) {
//            $comboId = $combo['id'];
//            $comboText = implode(', ', $combo['combo']);
//            $stmt->bind_param("sis", $username, $comboId, $comboText);
//            $stmt->execute();
//        }
//    }
//
//    $stmt->close();
//    echo json_encode(["status" => "success"]);
//}

if (isset($_POST['combos'])) {
    $newCombos = json_decode($_POST['combos'], true);
    error_log(print_r($newCombos, true));

    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";

    if ($conn->connect_error) {
        echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    if (!is_array($newCombos)) {
        echo json_encode(["status" => "error", "message" => "Invalid combo data"]);
        exit();
    }

    $existing_sql = "SELECT combo FROM combos WHERE username = ?";
    $stmt = $conn->prepare($existing_sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($existingComboString);
    $stmt->fetch();
    $stmt->close();

    $existingCombos = [];
    if (!empty($existingComboString)) {
        $existingCombos = json_decode($existingComboString, true);
        if (!is_array($existingCombos)) $existingCombos = [];
    }

    foreach ($newCombos as $combo) {
        if (isset($combo['id']) && isset($combo['combo'])) {
            $existingCombos[] = $combo;
        }
    }

    $updatedComboString = json_encode($existingCombos);

    $check_sql = "SELECT COUNT(*) FROM combos WHERE username = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($exists);
    $stmt->fetch();
    $stmt->close();

    if ($exists > 0) {
        $update_sql = "UPDATE combos SET combo = ? WHERE username = ?";
        $stmt = $conn->prepare($update_sql);
        $stmt->bind_param("ss", $updatedComboString, $username);
    } else {
        $insert_sql = "INSERT INTO combos (username, combo) VALUES (?, ?)";
        $stmt = $conn->prepare($insert_sql);
        $stmt->bind_param("ss", $username, $updatedComboString);
    }

    $stmt->execute();
    $stmt->close();

    echo json_encode(["status" => "success"]);
}

//if (isset($_GET['fetch_combos'])) {
//    header('Content-Type: application/json');
//
//    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";
//
//    $sql = "SELECT combo FROM combos WHERE username = ?";
//    $stmt = $conn->prepare($sql);
//    $stmt->bind_param("s", $username);
//    $stmt->execute();
//    $stmt->bind_result($comboData);
//    $stmt->fetch();
//    $stmt->close();
//
//    $combos = json_decode($comboData, true);
//    if (!$combos) $combos = [];
//
//    echo json_encode(["status" => "success", "combos" => $combos]);
//    exit();
//}

if (isset($_GET['fetch_combos'])) {
    header('Content-Type: application/json');

    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";

    $sql = "SELECT combo FROM combos WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $allCombos = [];

    while ($row = $result->fetch_assoc()) {
        $storedCombo = json_decode($row['combo'], true);

        if (is_array($storedCombo)) {
            foreach ($storedCombo as $comboItem) {
                if (isset($comboItem['combo'])) {
                    $allCombos[] = [
                        "id" => $comboItem['id'],
                        "combo" => $comboItem['combo']
                    ];
                }
            }
        }
    }

    // If nothing found, send default combos for guestUser
    if (empty($allCombos) && $username === "guestUser@guestUser") {
        $allCombos = [
            [ "id" => "1", "combo" => ["jab", "jab", "roll", "flurry"] ],
            [ "id" => "2", "combo" => ["slip", "jab", "jab", "fake", "roll", "hook", "right hand"] ]
        ];
    }

    echo json_encode(["status" => "success", "combos" => $allCombos]);

    $stmt->close();
    exit();
}

if (isset($_GET['read_only_combos'])) {
    header('Content-Type: application/json');


    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser@guestUser";

    if (!$username) {
        echo json_encode(["status" => "error", "message" => "User not logged in."]);
        exit();
    }

    $sql = "SELECT combo FROM combos WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $allCombos = [];

    while ($row = $result->fetch_assoc()) {
        $storedCombo = json_decode($row['combo'], true);

        if (is_array($storedCombo)) {
            foreach ($storedCombo as $comboItem) {
                if (isset($comboItem['combo'])) {
                    $allCombos[] = [
                        "id" => $comboItem['id'],
                        "combo" => $comboItem['combo']
                    ];
                }
            }
        }
    }

    echo json_encode(["status" => "success", "combos" => $allCombos]);

    $stmt->close();
    exit();
}


//if (isset($_POST['overwrite_combos'])) {
//    if ($conn->connect_error) {
//        echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
//        exit();
//    }
//
//    $combos = json_decode($_POST['combos'], true);
//
//    if (!is_array($combos)) {
//        echo json_encode(["status" => "error", "message" => "Invalid combo data"]);
//        exit();
//    }
//
//    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser";
//
//    $delete_sql = "DELETE FROM combos WHERE username = ?";
//    $stmt = $conn->prepare($delete_sql);
//    $stmt->bind_param("s", $username);
//    $stmt->execute();
//    $stmt->close();
//
//    $insert_sql = "INSERT INTO combos (username, id, combo) VALUES (?, ?, ?)";
//    $stmt = $conn->prepare($insert_sql);
//
//    foreach ($combos as $combo) {
//        if (isset($combo['id']) && isset($combo['combo'])) {
//            $comboId = $combo['id'];
//            $comboText = $combo['combo'];
//            $stmt->bind_param("sss", $username, $comboId, $comboText);
//            $stmt->execute();
//        }
//    }
//
//    $stmt->close();
//    echo json_encode(["status" => "success"]);
//}



if (isset($_POST['overwrite_combos'])) {
    if ($conn->connect_error) {
        echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
        exit();
    }

    $username = isset($_SESSION['user']) ? $_SESSION['user'] : "guestUser";
    $combos = json_decode($_POST['combos'], true);

    if (!is_array($combos)) {
        echo json_encode(["status" => "error", "message" => "Invalid combo data"]);
        exit();
    }

    $comboJson = json_encode($combos);

    $sql = "REPLACE INTO combos (username, combo) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $comboJson);
    $stmt->execute();
    $stmt->close();

    echo json_encode(["status" => "success"]);
}



//if (isset($_SESSION['user'])) {
//    echo json_encode(["user" => $_SESSION['user']]);
//} else {
//    echo json_encode(["user" => null]);
//}


$conn->close();

var_dump($_POST);

?>