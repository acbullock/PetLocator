firebase.initializeApp(config);

var queryURL = "http://api.petfinder.com/pet.find";
var key = "e5945be700ddfa206a0f57f1f6066743";
var pets=[];var debug;
var addFavorite = function(pets, index){
  alert("the button works");
}
var createWellForResult = function(index, pet){
	var well = $("<div>");
	well.addClass("well");

	var number = $("<label>");
		number.addClass("fa-stack fa-lg");
		number.append($("<i class='fa fa-square fa-stack-2x'></i>"));
		number.append($("<i class='fa fa-inverse fa-stack-1x'>"+(index+1)+"</i>"));
		well.append(number);

			if(pet.media.photos!== undefined){
				for(var i = 1; i < pet.media.photos.photo.length; i+=5){
					var photo = $("<img>");
					photo.attr("src", pet.media.photos.photo[i].$t);
					photo.css("padding", "10px");
					well.append(photo);
				}

		}
		
	

    var nameHeader = $("<h2>");
	    nameHeader.html(pet.name.$t);

    var age = $("<h3>");
    age.html("Age: "+pet.age.$t);

    var sex = $("<h3>");
    sex.html("Sex: " +pet.sex.$t);

    var breed=$("<h3>");
    breed.html("Breed: "+pet.breeds.breed.$t);
    
    var mix = $("<h3>");
    mix.html("Mix Breed: "+pet.mix.$t);

    var about = $("<p>");
    about.html("About: " + pet.description.$t);

    var email = $("<h3>");
    email.css("font-weight", "bold");
    //console.log(pet);
    email.html("Email: "+pet.contact.email.$t);

    var phone = $("<h3>");
    phone.css("font-weight", "bold");
    phone.html(" Phone: "+pet.contact.phone.$t);

    var favButton = $("<button>");
    favButton.addClass("btn btn-info fav-btn");
    favButton.text("Add to Favorites!")
    favButton.attr("data-index", index);
    
    favButton.on("click", function(){
      //call function that adds to firebase
      addFavorite(pets, index);
    });

    well.append(nameHeader);
    well.append(age);
    well.append(sex);
    well.append(breed);
    well.append(mix);
    well.append(about);
    well.append(email);
    well.append(phone);
    well.append(favButton);

	$("#results-panel").append(well);
}


$("#find-btn").prop("disabled", true);
document.onkeyup = function(){
	if ( /^[0-9]{5}$/.test($("#zip-code-input").val().trim())) {
			$("#find-btn").prop("disabled", false);

	}
	else
		$("#find-btn").prop("disabled", true);
}
$("#find-btn").on("click", function(event){
	var queryURL = "http://api.petfinder.com/pet.find?format=json&key=";
	var key = "e5945be700ddfa206a0f57f1f6066743";
	var animalType="";
	var animalSize="";
	var animalSex="";

	var zipCode="";
	queryURL += key;
	
	event.preventDefault();
	$("#results-panel").html("");
	animalType = $("#animal-type-input").val().trim();

	animalSize = $("#animal-size-input").val().trim();
	animalSex = $("#animal-sex-input").val().trim();
	zipCode = $("#zip-code-input").val().trim();
	if(animalType!="show all"){
		queryURL+="&animal="+animalType;
	}
	if(animalSize !="All Sizes"){
		queryURL+="&size="+animalSize;
	}
	if(animalSex != "Show Both"){
		queryURL+="&sex="+animalSex;
	}
	queryURL+="&location="+zipCode+"&callback=?";

	

  console.log("query: "+queryURL);

	$.getJSON(queryURL)
	.done(function(petApiData) { 
		debug=petApiData;
		console.log(petApiData);
		if(petApiData.petfinder.pets !== undefined){
			pets = petApiData.petfinder.pets.pet;
			$.each(pets, function(index, value){
			createWellForResult(index, value);
			});
		} 
		else{
			$("#results-panel").html("No results. Please try again.");
		}
		
		
		
	});

});

// ****************************
// after page is ready show modal for the sign in 
// ****************************
$(document).ready(function() {
	console.log("im ready");
	
});

// ****************************
// creates event for the sign up of the costumer
// TODO: need to add a costumer to the database and 
// use the name of the form 
// ****************************
$("#btnSignUp").on("click", function(e) {
	e.preventDefault();
	var email = $("#formEmailSignUp").val();
	var name = $("#formNameSignUp").val();
	var pass = $("#formPassSignUp").val();

	console.log(email + " " + pass);

	var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
	promise
	.then(function(){
		
		promise.displayName = name;
	})
	.catch(function(e) {
		console.log(e.message);
	})

	
});

// ****************************
// creates event for the log in 
// grabs email and password and tries to 
// match with firebase 
// TODO: 
// - how to react when wrong input
// ****************************
$("#btnLogIn").on("click", function(e) {
	e.preventDefault();
	var email = $("#formEmailLogIn").val();
	var pass = $("#formPassLogIn").val();

	console.log(email + " " + pass);

	var promise = firebase.auth().signInWithEmailAndPassword(email, pass);
	promise
	.catch(function(e) {
		alert(e.message);
		
	})
	$("#myModal").modal("hide");
	
});

// ****************************
// if user is logged in then it should import history
// and show to screen
// TODO: 
// - if user is logged in have variables from that user with the 
//   history
//  
// ****************************
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.log(user);
	}
	else {

		$("#myModal").modal('show');
	}
});


$("#btn-logIn").on("click", function(e) {
	e.preventDefault();
	$("#myModal").modal('show');
});

$("#btn-logOut").on("click", function(e) {
	e.preventDefault();
	
	firebase.auth().signOut();
	
});


