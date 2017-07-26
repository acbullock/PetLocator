

var queryURL = "http://api.petfinder.com/pet.find";
var key = "e5945be700ddfa206a0f57f1f6066743";

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

    var email = $("<h3>");
    email.css("font-weight", "bold");
    //console.log(pet);
    email.html("Email: "+pet.contact.email.$t);

    var phone = $("<h3>");
    phone.css("font-weight", "bold");
    phone.html(" Phone: "+pet.contact.phone.$t);
    
    

    well.append(nameHeader);
    well.append(age);
    well.append(sex);
    well.append(breed);
    well.append(mix);
    well.append(email);
    well.append(phone);
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
  console.log(queryURL);
	$.getJSON(queryURL)
  .done(function(petApiData) { 
  	//console.log(petApiData.petfinder.pets); 
  	var pets = petApiData.petfinder.pets.pet;
  	
  	$.each(pets, function(index, value){
  		createWellForResult(index, value);
  	});
  });

});
