<?php
/*
* Code to query an SQLite database and return
* results as JSON.
*/

// Specify your sqlite database name and path //
$dir = 'sqlite:../storage/carrier.sqlite';

// Instantiate PDO connection object and failure msg //
$dbh = new PDO($dir) or die("cannot open database");

// Define your SQL statement //
$query = "SELECT * FROM carrier_detail ORDER BY RANDOM() LIMIT 10";

// Iterate through the results and pass into JSON encoder //
$rows = array();
foreach ($dbh->query($query) as $row) {
  $rows [] = $row;
}

?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>postal</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

  <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"> -->

  <!-- build:css styles/vendor.css -->
  <!-- bower:css -->
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
  <!-- endbower -->
  <!-- endbuild -->
  
  <!-- build:css(.tmp) styles/main.css -->
  <link rel="stylesheet" href="styles/main.css">
  <!-- endbuild -->
</head>
<body>
    <!--[if lt IE 10]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
      <![endif]-->

      <div class="container">
        <div class="header">
          <ul class="nav nav-pills pull-right">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <h3 class="text-muted">Postal</h3>
        </div>


        <!-- Flash Message -->
        <div class="flash alert alert-danger alert-dismissable">
          <!-- <button type="button" class="close btn-block" data-dismiss="alert" aria-hidden="true">&#215;</button> -->
          <div id="message"> </div>
          <div class="pull-left"><span class="glyphicon glyphicon-icon-remove"></span></div>
        </div>

        <div class="jumbotron">
          <h1>Welcome to Postal!</h1>
          <p class="lead">A Carrier ID Quiz Application</p>
          <p><button class="btn btn-lg btn-success" id="startQuizBtn">Start Quiz! </button></p>
        </div>


        <div class="footer">
          <p>&copy; 2015 Coppernickel</p>
        </div>
      </div>
      <!-- <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script> -->
      <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script> -->

      <!-- build:js(.) scripts/vendor.js -->
      <!-- bower:js -->
      <script src="bower_components/jquery/dist/jquery.js"></script>
      <!-- endbower -->
      <!-- endbuild -->


      <!-- build:js(.) scripts/plugins.js -->

      <!-- endbuild -->


      <!-- build:js scripts/main.js -->
      <script src="scripts/ajax-helpers.js"></script>
      <script src="scripts/pubsub.js"></script>
      <script src="scripts/main.js"></script>
      <!-- endbuild -->

      <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
      <script>
      var ar = <?php echo json_encode($rows) ?>;
      if(ar) {
        $.publish(event, 'questions.loaded', [ar]);
      }
      (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
          function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='https://www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','UA-XXXXX-X');ga('send','pageview');

      </script>
    </body>
    </html>
