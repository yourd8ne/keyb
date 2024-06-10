<?php 
session_start();

if(!isset($_SESSION['username'])) {
    header('Location: views/login.php');
    exit();
}

?>

<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>keyb</title>
    <link rel='stylesheet' href='public/css/style.css' />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js"></script>
</head>
<body>
    <div class='container'>
        <h2>Code Typing Practice</h2>
        <div class='preparation'>
            <form class='choose'>
                <div class="form-group">
                    <label for="prog-lang">Choose programming language</label>
                    <select id='prog-lang'>
                        <option value='python'>Python</option>
                        <option value='cpp'>C++</option>
                        <option value='java'>Java</option>
                    </select>
                </div>
            </form>
        </div>
        <button id='ready'>Ready</button>
        <div class='processing'>
            <div class='sample'></div><!--<pre><code id="code-block"></code></pre>-->
            <input type='text' id='input' />
            <div class='output'>
                <div id='time'>Time: 0s</div>
                <div id='speed'>Speed: 0 CPM</div>
            </div>
        </div>
    </div>
    <script>
        const username = "<?php echo $_SESSION['username']; ?>";
    </script>
    <script src='public/js/script.js'></script>
    <script>hljs.highlightAll();</script>
</body>
</html>