<!--
This is the minimal code required to run AlgebraKiT exercises. It contains 
both the backend part (creating a session from an exercise-id) and
the frontend part (inserting the akit-exercise tags).
-->

<?php
    //Backend part: create a session for one or more exercises based on exercise id(s).

    $appId     = '...';            //credentials you received from AlgebraKiT
    $appSecret = '...';
    
    $host      = 'https://algebrakit.eu';   //the domain of AlgebraKiT's web service
    $endpoint  = '/session/create';         //see https://algebrakit-learning.com/dev/api-web-create

    $data = array(
        'exercises' => Array(
            0 => Array(
                exerciseId => "9e5aa8cd-1426-4845-88d6-459d3942ca75",   //exercise id can be obtained from AlgebraKiT's CMS
                version => "latest",
            ),   
            1 => Array(
                exerciseId => "d098c2cc-b100-4e99-91cb-ca65af683abe",
                version => "latest",
            ),   
            2 => Array(
                exerciseId => "be98a21c-5f1f-45c0-919f-e511ac55fc08",
                version => "latest",
            ),   
        ),
        'api-version' => 2,
        'appId' => $appId,
        'appSecret' => $appSecret
    );

    //perform JSON POST
    $curl = curl_init($host.$endpoint);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-type: application/json"));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

    $json_response  = curl_exec($curl);
    $sessionData = json_decode($json_response);
?>


<!DOCTYPE html>
<html>
   <head></head>
   <body>
        <h1>AlgebraKiT demo</h1>

        <?php
            for($ii=0; $ii<count($sessionData); $ii++) {
                echo "<h2>Exercise ".($ii+1)."</h2>";
                $exerciseResult = $sessionData[$ii];
                if($exerciseResult->success) {
                    $sessionResult = $exerciseResult->sessions[0]; 
                    echo "<akit-exercise session-id='$sessionResult->sessionId' start-active></akit-exercise>";
                } else {
                    echo $ex->msg;  //creating session failed
                }
            }
        ?>
   
        <!--- Global object AlgebraKIT will be the front end API of AlgebraKiT and is used for configuration -->
        <script>
            AlgebraKIT = {
                config: {
                    //theme: '..',  //themes configure behaviour and design of frontend widgets
                }
            };
        </script>
        
        <!--- Load frontend API (stored in window.AlgebraKIT) -->
        <script src='https://widgets.algebrakit.eu/akit-widgets.min.js'></script>

        <!-- now you can use the frontend API, e.g. to listen to learning events -->
        <script>
            AlgebraKIT.addExerciseListener(function(data){
                console.log(data);
            })
        </script>

   </body>
</html>