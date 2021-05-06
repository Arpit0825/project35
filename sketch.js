//Create variables here
var dog, dogImg, happyDog;
var database;
var foodS, foodStock,food;
var feed,addFood;
var fedTime, lastFed;

function preload() {
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800-200, 500);

  dog = createSprite(480, 225);
  dog.addImage(dogImg);
  dog.scale = 0.15;
  

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  food = new Food();


  feed = createButton("Feed the dog");
  feed.position(575, 95);
  feed.mousePressed(feedDog);
  feed.style('background-color', color("pink"));

  addFood = createButton("Add Food");
  addFood.position(675, 95);
  addFood.mousePressed(addFoods);
  addFood.style('background-color', color("yellow"));
}

function draw() {
  background(46, 139, 87);

  fedTime=database.ref('FeedTime'); 
  fedTime.on("value",function(data){ 
    lastFed=data.val(); 
  }); 

  fill(255,255,254); 
  textSize(15); 
  if(lastFed>=12){ 
    text("Last Feed : "+ lastFed % 12 + " PM", 250,30); 
  }else if(lastFed==0){ 
    text("Last Feed : 12 AM",250,30); 
  }else{ 
    text("Last Feed : "+ lastFed + " AM", 250,30); 
  }

  food.display();
  drawSprites();
  //add styles here
  fill("white");
  text("Food Remaining: " + foodS, 150, 160);
}

//function to read values in database
function readStock(data) {
  foodS = data.val();
  food.updateFoodStock(foodS);
}

//function to add values in database
function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }

  database.ref("/").update({
    Food: x,
  });
}

function feedDog(){

  dog.addImage(happyDog); 
  if(food.getFoodStock()<= 0){
     food.updateFoodStock(food.getFoodStock()*0); 
    }else{ 
      food.updateFoodStock(food.getFoodStock()-1); 
    } 
    database.ref('/').update({ 
      Food:food.getFoodStock(), 
      FeedTime:hour() 
    })
  }  

function addFoods(){ 
    foodS++; 
    database.ref('/').update({ 
      Food:foodS 
    }) 
  }
  
  
