<?php 
session_start();

// if(!isset($_SESSION['username'])) {
//     header('Location: login.php');
//     exit();
// }

?>

<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>keyb</title>
    <link rel='stylesheet' href='public/css/style.css' />
</head>
<body>
    <div class='container'>
        <div class='preparation'>
            <form class='choose'>
            Choose programming language
                <select id='prog-lang' onchange='getCodeBlock(this)'>
                    <option value='python'>Python</option>
                    <option value='cpp'>C++</option>
                    <option value='java'>Java</option>
                </select>
            </form>
        </div>
        <button id='ready' >Ready</button>
        <div class='processing'>
            <div class='sample'></div>
            <div class='output'>
                    <input type='text' id='input'><!-- onpaste='return false;' -->
                    <div id='time'></div>
                    <div id='speed'></div>
            </div>
        </div>
    </div>
    <script src='public/js/script.js'></script>
</body>
</html>