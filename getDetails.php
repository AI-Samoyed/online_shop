<?php

        $servername = "localhost";
        $username = "r4dhir";
        $password = "VoyFram5";
        $dbname = "r4dhir";

        //Establish connection with database
        $conn = new mysqli($servername, $username, $password, $dbname);

        //Check the connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

          $idNum = htmlspecialchars($_GET["idNum"]); 
        
        //Query for columns from table
        $sql = "SELECT title, price, descr, img_, qty FROM Products WHERE id=" . "'" . $idNum . "'";
        if($result = mysqli_query($conn, $sql)){

          //If records exist, construct elements and display them
          if(mysqli_num_rows($result) > 0){

                  //for every product, generate an element and display it
                  while($row = mysqli_fetch_array($result)){
                    echo "<div class='col'>"; 
                    echo "<img src=". "'" . $row['img_'] . "'" . " class='prod-img' alt=". "'" . $row['title'] . "'>";
                    echo "</div>";

                    echo "<div class='col'>";
                    echo "<h4 class='prod-subtitle'>" . $row['title'] . "</h4>";
                    echo "<p>" . $row['descr'] . "</p>";
                    echo "<br />";
                    echo "<h5>". $row["price"]. "</h5>";
                   echo "<br />";
                    echo "<button type='button' class='btn btn-primary' onclick='addToCartWithMessage(" . $idNum . ", " . '"' . $row["price"] . '"'. ", " . $row["qty"] . ")'> Add to Cart</button>";
                  }
      
              // Free result set
              mysqli_free_result($result);
      
              //If no records exist or an error occured, return message
            } else {
            echo "<br /> <h5> Sorry, the product you're looking for does not exist :( </h5>";
          }
        } else {
          echo "Error: Could not execute $sql. " . mysqli_error($conn);
        }
        mysqli_close($conn);

?>
