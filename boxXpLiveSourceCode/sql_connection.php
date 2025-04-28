<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['whoami'])) {
    session_start();
    echo json_encode(['user' => $_SESSION['user'] ?? 'guestData']);
    exit;
}


session_start();  
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

file_put_contents(__DIR__ . '/conn_debug.log', "SESSION: " . print_r($_SESSION, true) . "\n", FILE_APPEND);
file_put_contents(__DIR__ . '/conn_debug.log', "POST appData: " . ($_POST['appData'] ?? 'MISSING') . "\n", FILE_APPEND);

header('Content-Type: application/json');

function getDbConnection() {
    $cfg = [
        'host'     => 'localhost',
        'username' => 'u531149302_yungdopesaiyan',
        'password' => 'BabyTubs504!',
        'dbname'   => 'u531149302_boxxp_db',
    ];
    $conn = new mysqli($cfg['host'], $cfg['username'], $cfg['password'], $cfg['dbname']);
    if ($conn->connect_error) {
        error_log("DB connection failed: " . $conn->connect_error);
        http_response_code(500);
        echo json_encode(['status'=>'error','message'=>'DB connection failed']);
        exit;
    }
    return $conn;
}

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function registerUser($conn, $username, $password) {
    if (empty($username) || empty($password)) {
        jsonResponse(['status'=>'error','message'=>'Missing username or password'], 400);
    }

    $check = $conn->prepare("SELECT username FROM login WHERE username = ?");
    $check->bind_param("s", $username);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        jsonResponse(['status'=>'error','message'=>'Username already taken'], 409);
    }
    $check->close();

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO login (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $hash);
    if (!$stmt->execute()) {
        error_log("Register failed: " . $stmt->error);
        jsonResponse(['status'=>'error','message'=>'Account creation failed'], 500);
    }
    $stmt->close();

    $_SESSION['user'] = $username;
    jsonResponse(['status'=>'success','message'=>'Account created']);
}

function loginUser($conn, $username, $password) {
    $stmt = $conn->prepare("SELECT password FROM login WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($storedHash);
    if (!$stmt->fetch()) {
        $stmt->close();
        jsonResponse(['status'=>'error','message'=>'User not found'], 404);
    }
    $stmt->close();

    if (!password_verify($password, $storedHash)) {
        jsonResponse(['status'=>'error','message'=>'Incorrect password'], 401);
    }

    $_SESSION['user'] = $username;
    jsonResponse(['status'=>'success','message'=>'Login successful']);
}

function upsert(mysqli $conn, string $table, array $columns, array $values) {
    $user = $_SESSION['user'] ?? 'guestUser';
    $quoted = array_map(fn($c)=>"`$c`", $columns);
    $cols = implode(",", $quoted);
    $ph   = implode(",", array_fill(0, count($columns), "?"));
    $upd  = implode(",", array_map(fn($c)=>"`$c`=VALUES(`$c`)", $columns));
    $sql  = "INSERT INTO `$table` (username,$cols) VALUES (?, $ph) ON DUPLICATE KEY UPDATE $upd";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Prepare failed for $table: " . $conn->error);
        return;
    }

    $types = str_repeat('s', count($columns) + 1);
    $params = array_merge([$user], $values);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    if ($stmt->error) error_log("Upsert `$table` failed: " . $stmt->error);
    $stmt->close();
}

function saveAppData($conn, array $appData) {
    file_put_contents(__DIR__ . '/conn_debug.log', "[saveAppData] called\n", FILE_APPEND);
    $user = $_SESSION['user'] ?? 'guestUser';

    if (!empty($appData['skills'])) {
    $dog = $pre = $box = '';
    foreach ($appData['skills'] as $cat) {
        $csv = implode(",", $cat['items']);
        switch (strtolower(trim($cat['category']))) {
            case 'dogwork':  $dog = $csv; break;
            case 'pressure': $pre = $csv; break;
            case 'boxing':   $box = $csv; break;
        }
    }
    upsert($conn, 'skills', ['dogwork','pressure','boxing'], [$dog,$pre,$box]);
}


    if (!empty($appData['workouts'])) {
        $up = $lo = $co = '';
        foreach ($appData['workouts'] as $cat) {
            $csv = implode(",", $cat['items']);
            switch (strtolower($cat['category'])) {
                case 'upper-body': $up = $csv; break;
                case 'lower-body': $lo = $csv; break;
                case 'core':       $co = $csv; break;
            }
        }
        upsert($conn, 'workouts', ['upper-body','lower-body','core'], [$up,$lo,$co]);
    }

    if (!empty($appData['combos'])) {
        $del = $conn->prepare("DELETE FROM combos WHERE username = ?");
        $del->bind_param("s", $user);
        $del->execute();
        $del->close();

        $ins = $conn->prepare("INSERT INTO combos (username, combo_list) VALUES (?, ?)");
        foreach ($appData['combos'] as $c) {
            $csv = implode(",", $c['combo']);
            $ins->bind_param("ss", $user, $csv);
            $ins->execute();
        }
        $ins->close();
    }

    jsonResponse(['status'=>'success']);
}

function fetchSkills($conn) {
    $user = $_SESSION['user'] ?? 'guestUser';
    $stmt = $conn->prepare("SELECT dogwork, pressure, boxing FROM skills WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($dog, $pre, $box);
    if ($stmt->fetch()) {
        $data = [
            ['category'=>'dogwork',  'items'=>array_filter(explode(',',$dog))],
            ['category'=>'pressure', 'items'=>array_filter(explode(',',$pre))],
            ['category'=>'boxing',   'items'=>array_filter(explode(',',$box))],
        ];
    } else {
        $data = [
            ['category'=>'dogwork',  'items'=>[]],
            ['category'=>'pressure', 'items'=>[]],
            ['category'=>'boxing',   'items'=>[]],
        ];
    }
    $stmt->close();
    jsonResponse(['user'=>$user, 'skills'=>$data]);
}

function fetchWorkouts($conn) {
    $user = $_SESSION['user'] ?? 'guestUser';
    $stmt = $conn->prepare("SELECT `upper-body`,`lower-body`,core FROM workouts WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($up, $lo, $co);
    if ($stmt->fetch()) {
        $data = [
            ['category'=>'upper-body','items'=>array_filter(explode(',',$up))],
            ['category'=>'lower-body','items'=>array_filter(explode(',',$lo))],
            ['category'=>'core',      'items'=>array_filter(explode(',',$co))],
        ];
    } else {
        $data = [
            ['category'=>'upper-body','items'=>[]],
            ['category'=>'lower-body','items'=>[]],
            ['category'=>'core',      'items'=>[]],
        ];
    }
    $stmt->close();
    jsonResponse(['user'=>$user, 'workouts'=>$data]);
}

function fetchCombos($conn) {
    $user = $_SESSION['user'] ?? 'guestUser';
    $stmt = $conn->prepare("SELECT id, combo_list FROM combos WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->bind_result($id,$csv);
    $out = [];
    while ($stmt->fetch()) {
        $out[] = ['id'=>$id,'combo'=>array_filter(explode(',',$csv))];
    }
    $stmt->close();
    jsonResponse(['user'=>$user,'combos'=>$out]);
}

// ====== Routing ======
$conn = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['create_account'])) {
        registerUser($conn, $_POST['email'] ?? '', $_POST['password'] ?? '');
    }
    if (isset($_POST['sign_in'])) {
        loginUser($conn, $_POST['email'] ?? '', $_POST['password'] ?? '');
    }
    if (isset($_POST['appData'])) {
        $json = json_decode($_POST['appData'], true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            jsonResponse(['status'=>'error','message'=>'Invalid JSON'], 400);
        }
        saveAppData($conn, $json);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['fetch_skills'])) fetchSkills($conn);
    if (isset($_GET['fetch_workouts'])) fetchWorkouts($conn);
    if (isset($_GET['fetch_combos'])) fetchCombos($conn);
}

$conn->close();
