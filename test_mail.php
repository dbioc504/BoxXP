<?php

$to = 'your.email@gmail.com';
$subject = 'XAMPP Mail Test';
$message = 'If you see this, sendmail is working!';
$headers = 'From: your.email@gmail.com' . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo "Mail sent!";
} else {
    echo "Mail failed :(";
}
