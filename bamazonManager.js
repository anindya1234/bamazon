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
  var query = "SELECT * FROM products";
		    connection.query(query, function(err, res) {
		      	if (err) throw err;
		        
		        runManagerSearch(res);//pass response  as argument
		    });

  
});


function runManagerSearch(res){//inquirer to make a selection and chose option that calls another function

		inquirer.prompt([
		        {
		           name: "selection",
		           message: "Make a selection",
		           type: "list",
		           choices: 
		           ["1. View Products for Sale", "2. View Low Inventory", "3. Add to Inventory", "4. Add New Product", "5. Quit"] 
		        }

		    ]).then(function(response){

			    switch(response.selection){
		            case "1. View Products for Sale":
		                for (var i = 0; i < res.length; i++) {
				        console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity );
				        }
                        inquireAgain();
		            break;
		            case "2. View Low Inventory":
		                inventoryCheck(res);
		            break;
		            case "3. Add to Inventory":
		                update(res);
		            break;
		            case "4. Add New Product":
		                newAddition(res);
		            break;
		            case "5. Quit":
		                process.exit();
		            break;
	            }
            }); 
		
}

function inventoryCheck(res){//checks low inventory
			console.log("Displaying Items with <5 inventory: ");
			for (var i = 0; i < res.length; i++){

				if(res[i].stock_quantity<5){
                 console.log(" Product: " + res[i].product_name + " || Quantity: " + res[i].stock_quantity );
				    
				} else{
					console.log(" Product: " + res[i].product_name + " || Quantity: Sufficient" );
				}
				
			}
			inquireAgain();
				    
}

function update(res){//updates new product
			inquirer
			  .prompt([
			    
			    {
			      type: "input",
			      message: "What is the product ID of item you want to add to?",
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
                    if(id>0 && id<11){//id should be between 1-10
				        for (var i = 0; i < res.length; i++) {
				        	
				        	if (id===res[i].id){
				        		 
			                        var b =(res[i].stock_quantity+ units);
			                        var query = connection.query(
				    					"UPDATE products SET ? WHERE ?",
				    					[
									      {
									        stock_quantity: b
									      },
									      {
									        id: id
									      }
									    ],
									    function(err, res) {
									      if (err) throw err;
									      //how to show the change?
									     console.log(res.affectedRows + "Product Updated");
									     //console.log("For Product: " + res[i].product_name + " || New Quantity: " + res[i].stock_quantity);
     									inquireAgain();
									    }
								    );
			                   		       	
						    }
				         
				        }

			        }else{
			        	console.log("Enter ID between 1-10 only");
			        	runManagerSearch(res);
			        }   


			    });
}

function newAddition(res){//add new product
		inquirer
			  .prompt([
			    
			    {
			      type: "input",
			      message: "What is the product you want to add ?",
			      name: "product"
			    },
			    {
			      type: "input",
			      message: "Department Name?",
			      name: "department"
			    },
			    {
			      type: "input",
			      message: "Price?",
			      name: "price"
			    },
			    {
			      type: "input",
			      message: "Units?",
			      name: "units"
			    }

			  ])
			    .then(function(response) {


						  var query = connection.query(
						    "INSERT INTO products SET ?",
						    {
						      product_name: response.product,
						      department_name: response.department,
						      price: response.price,
						      stock_quantity: response.units
						    },
						    function(err, res) {
						      console.log(res.affectedRows + " product inserted!\n");
						      inquireAgain();
						    }
						  );
                });
}


function inquireAgain(){
		inquirer.prompt([
		      {
		          type: "confirm",
			      message: "Want to continue?",
			      name: "confirm",
			      default: true
		      }
		    ]).then(function(inquirerResponse){
		    	if (inquirerResponse.confirm) {
			       	var query = "SELECT * FROM products";
				    connection.query(query, function(err, res) {
				      	if (err) throw err;
				       
				        runManagerSearch(res);//pass response  as argument
				    });

			    }
			    else {
			      console.log("\nThanks for Shopping.\n");
			      connection.end();
			    }
			});	
}

