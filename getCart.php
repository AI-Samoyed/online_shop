<?php

        $servername = "localhost";
        $username = "r4dhir";
        $password = "VoyFram5";
        $dbname = "r4dhir";
        $somethingprinted=0;
        //Establish connection with database
        $conn = new mysqli($servername, $username, $password, $dbname);

        //Check the connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        
        //Query for columns from table
        $sql = "SELECT title, price, id, img_ FROM Products";
        if($result = mysqli_query($conn, $sql)){

          //If records exist, construct elements and display them
          if(mysqli_num_rows($result) > 0){
                  
                  //for every product,if it is stored in cookies, and if so display it
                  while($row = mysqli_fetch_array($result)){
                      if (isset($_COOKIE[$row['id']])){
                        $somethingprinted=1;
                          echo "<div class='col-sm-4'>";

                              echo "<div class='card' style='width: 18rem;'>";
                                echo "<img src=". "'" . $row["img_"] . "'" . " class='card-img-top'>";

                                echo"<div class='card-body'>";
                                  echo "<h5 class='card-title'>". $row["title"]. "</h5>";
                                  echo "<p class='card-text'>" . $row['price'] . "</p>";
                                  echo "<div> Quantity: <input type='text' size='1' class='space_offset' id='quantity" .$row['id']. "' value ='" . $_COOKIE[$row['id']] . "'></input>";
                                  echo "<button type='button' class='btn btn-primary' onclick='updateCartQty(" . $row['id'] . ")'> Update </button></div>";
                                  echo "<button type='button' class='btn btn-primary space_offset' style='margin-left:12px' onclick='increaseCartQty(" . $row['id'] . ")'> + </button>";
                                  echo "<button type='button' class='btn btn-primary space_offset' onclick='reduceCartQty(" . $row['id'] . ")'> - </button>";
                                  echo "<button type='button' class='btn btn-primary space_offset' onclick='reduceCartQtyTo0(" . $row['id'] . ")'> Remove all </button>";
                                echo "</div>";

                              echo"</div>";
                            echo "</div>";
                      }

                  }

              if ($somethingprinted === 0){
                        echo "<div class='col-12' style='text-align:center'> Your Cart is Empty </div>";
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