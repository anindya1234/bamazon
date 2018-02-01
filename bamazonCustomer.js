var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rocky123",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  display(); 
  
});



function display(){ //show items and price and display response one  time
	var query = "SELECT * FROM products";
		    connection.query(query, function(err, res) {
		      	if (err) throw err;
		        for (var i = 0; i < res.length; i++) {
		          console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Price: " + res[i].price);
		        }
		        runSearch(res);//pass response  as argument
		    });

}

function display1(){ //show items and price without console logging all values
	var query = "SELECT * FROM products";
		    connection.query(query, function(err, res) {
		      	if (err) throw err;
		       
		        runSearch(res);//pass response  as argument
		    });
}


function runSearch(res) {

	inquirer
	  .prompt([
	    
	    {
	      type: "input",
	      message: "What is the product ID you want to buy?",
	      name: "id"
	    },
	    {
	      type: "input",
	      message: "How many units?",
	      name: "units"
	    },

	  ])
	    .then(function(response) {
		  var id = parseInt(response.id);
		  var units= parseInt(response.units);
		  //get integer values for inputs and compare with response from mysql db passed as argument parameter 
	        if(id>0 && id<11){//id should be between 1-10
		        for (var i = 0; i < res.length; i++) {
		        	
		        	if (id===res[i].id){
		        		if(res[i].stock_quantity< units){
		                console.log("Insufficient Quantity. Please try again");
		                runSearch(res);
		        		}
		        		else{

		                 console.log("Your order was complete. Your cost: "+ (res[i].price*units));
	                        var b =(res[i].stock_quantity- units);
	                        var c= res[i].price*units;
	                        var query = connection.query(
		    					"UPDATE products SET stock_quantity= ?, product_sales = ? WHERE id=?",
		    					[b, c, id],
							   
							    function(err, res) {
							      if (err) throw err;
							       console.log("Product Updated ");
							        inquirer.prompt([
								      {
								          type: "confirm",
									      message: "Want to continue?",
									      name: "confirm",
									      default: true
								      }
								    ]).then(function(inquirerResponse){
								    	if (inquirerResponse.confirm) {
								        display1();
									    }
									    else {
									      console.log("\nThanks for Shopping.\n");
									      connection.end();
									    }
									});					      
							    }
						    );

		        		}
		        	}
		          
		        }
	        }else{
	        	console.log("Enter ID between 1-10 only");
	        	display1();
	        }   
	    });
}

