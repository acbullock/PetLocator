firebase.initializeApp(config);
var database = firebase.database().ref();

var userID = "user1";//TO DO: GET FROM FIREBASE AUTHENTICATION (GET CURRENT USER)
var userRef = firebase.database().ref("/"+userID);
userRef.child("email").set("user1@gmail.com");

var queryURL = "http://api.petfinder.com/pet.find";
var key = "e5945be700ddfa206a0f57f1f6066743";
var pets=[];var debug;
var addFavorite = function(pets, index){
  var pet = pets[index];

  var name = pet.name.$t;
  var age = pet.age.$t;
  var sex = pet.sex.$t;
  var breed = pet.breeds.breed.$t;
  if(breed == undefined)
    breed="not available";
  var mix = pet.mix.$t;
  var description = pet.description.$t;
  var email ="unavailable";
    if(pet.contact.email.$t !==undefined)
      email =pet.contact.email.$t;
    console.log(pet);
  var phone = "unavailable";
  if(pet.contact.phone.$t !== undefined){
    phone= pet.contact.phone.$t;
  }
  alert(phone + "  " +email);
  
  //replace dog with fave object
  userRef.child("favorites").child(name).set({
    name: name,
    age: age,
    sex: sex,
    breed: breed,
    mix: mix,
    description: description,
    email: email,
    phone: phone,
    photo:pet.media.photos.photo[0].$t

  });
  

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
    var emailText = "unavailable";
    if(pet.contact.email.$t !== undefined){
      emailText = pet.contact.email.$t;
    }
    //console.log(pet);
    email.html("Email: "+emailText );

    var phone = $("<h3>");
    phone.css("font-weight", "bold");
    var phoneText = "unavailable";
    if(pet.contact.phone.$t !== undefined){
      phoneText = pet.contact.phone.$t;
    }
    phone.html(" Phone: "+phoneText);

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
   // console.log(petApiData);
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

  $("#clear-btn").on("click", function(event){
    event.preventDefault();
    $("#results-panel").html("");
  });

});


userRef.child("favorites").on("value", function(snapshot){
    $("#favorites-section").html("");
    var favs =snapshot.val();
    console.log(favs);
    $.each(favs, function(index, value){
      //  console.log("index" + value.name);
      var name = value.name;
      var age = value.age;
      var sex = value.sex;
      var breed = value.breed;
      if(breed == undefined)
        breed="not available";
      var mix = value.mix;
      var description = value.description;
      var email = value.email;
      var phone = value.phone;


          var well = $("<div>");
  well.addClass("well");
  var img = $("<img>");
  userRef.child("favorites").child(name).child("photo").once("value").then(function(snapshot){
    img.attr("src", snapshot.val());
  });
  //console.log(img.attr("src"));

var nameHeader = $("<h2>");
      nameHeader.html(name);

    var ageHeader = $("<h3>");
    ageHeader.html("Age: "+age);

    var sexHeader = $("<h3>");
    sexHeader.html("Sex: " +sex);

    var breedHeader=$("<h3>");
    breedHeader.html("Breed: "+breed);
    
    var mixHeader = $("<h3>");
    mixHeader.html("Mix Breed: "+mix);

    var aboutHeader = $("<p>");
    aboutHeader.html("About: " + description );

    var emailHeader = $("<h3>");
    emailHeader.css("font-weight", "bold");
    //console.log(pet);
    emailHeader.html("Email: "+email);

    var phoneHeader = $("<h3>");
    phoneHeader.css("font-weight", "bold");
    phoneHeader.html("Phone: "+phone);

    var removeBtn = $("<button>");
    removeBtn.text("Remove from Favorites");
    removeBtn.addClass("remove-fave btn btn-danger");
      
    removeBtn.attr("data-key", name);
    

      removeBtn.on("click", function(event){
        
          //event.preventDefault();
          var rem = $(this).attr("data-key");
          
          userRef.child("favorites").child(rem).remove();
      });

  console.log(img.attr('src'));
  well.append(removeBtn );
   well.append($("<br>"));
   well.append($("<br>"));

  well.append(img);
  well.append(nameHeader);
  well.append(ageHeader);
  well.append(sexHeader);
  well.append(breedHeader);
  well.append(mixHeader);
  well.append(aboutHeader);
  well.append(emailHeader);
  well.append(phoneHeader);
 // well.append(img);

  $("#favorites-section").append(well);

    });




});