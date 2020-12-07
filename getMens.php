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
        
        //Query for columns from table
        $sql = "SELECT title, price, id, img_, qty FROM Products WHERE cat_='Men'";
        if($result = mysqli_query($conn, $sql)){

          //If records exist, construct elements and display them
          if(mysqli_num_rows($result) > 0){

                  //for every product, generate an element and display it
                  while($row = mysqli_fetch_array($result)){
                    echo "<div class='col-sm-4'>";

                      echo "<div class='card' style='width: 18rem;'>";
                        echo "<img src=". "'" . $row["img_"] . "'" . " class='card-img-top'>";

                        echo"<div class='card-body'>";
                          echo "<h5 class='card-title'>". $row["title"]. "</h5>";
                          echo "<p class='card-text'>" . $row['price'] . "</p>";
                          echo "<button type='button' class='btn btn-primary' onclick='addToCartWithMessage(" . $row["id"] . ", " . '"' . $row["price"] . '"'. ", " . $row["qty"] . ")'> Add to Cart</button>";
                        echo "</div>";

                      echo"</div>";
                    echo "</div>";
                  }
      
              // Free result set
              mysqli_free_result($result);
      
              //If no records exist or an error occured, return message
            } else {
            echo "No records were found.";
          }
        } else {
          echo "Error: Could not execute $sql. " . mysqli_error($conn);
        }
        mysqli_close($conn);

?>