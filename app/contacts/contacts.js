'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])


// ContactsCtrl which is dependent on the$scope and $firebaseArray

.controller('ContactsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	
	var ref = firebase.database().ref("/");
	

	console.log(ref.key);

	$scope.contacts = $firebaseArray(ref);
	
	// Sets the show or hide decision for the Add Contacts Form

	$scope.showAddForm = function(){
		$scope.addFormShow = true;
	}

	// Sets the show or hide decision for the Edit Contacts Form and 
	// import the contacts info into the form

	$scope.showEditForm = function(contact){
		$scope.editFormShow = true;
		$scope.id = contact.$id;
		$scope.name = contact.name;
		$scope.email = contact.email;
		$scope.company = contact.company;
		$scope.work_phone = contact.phones[0].work;
		$scope.home_phone = contact.phones[0].home;
		$scope.mobile_phone = contact.phones[0].mobile;
		$scope.street_address = contact.address[0].street_address;
		$scope.city = contact.address[0].city;
		$scope.state = contact.address[0].state;
		$scope.zipcode = contact.address[0].zipcode;
		}

	// Hide Function...Hides contact forms

	$scope.hide = function(){
		$scope.addFormShow = false;
		$scope.contactShow = false;
	}

	// Adds the inputed form data to the contact object

	$scope.addFormSubmit = function(){
		console.log("add contact");

		// Assign Values
		if($scope.name){ var name = $scope.name } else { var name = null; }
		if($scope.email){ var email = $scope.email; } else { var email = null; }
		if($scope.company){ var company = $scope.company; } else { var company = null; }
		if($scope.mobile_phone){ var mobile_phone = $scope.mobile_phone; } else { var mobile_phone = null; }
		if($scope.home_phone){ var home_phone = $scope.home_phone; } else { var home_phone = null; }
		if($scope.work_phone){ var work_phone = $scope.work_phone; } else { var work_phone = null; }
		if($scope.street_address){ var street_address = $scope.street_address; } else { var street_address = null; }
		if($scope.city){ var city = $scope.city; } else { var city = null; }
		if($scope.state){ var state = $scope.state; } else { var state = null; }
		if($scope.zipcode){ var zipcode = $scope.zipcode; } else { var zipcode = null; }
	

	// Build out the object

	$scope.contacts.$add({
		name: name,
		email: email,
		company: company,
		phones:[
		{
			mobile: mobile_phone,
			home: home_phone,
			work: work_phone
		}],
		address: [{
			street_addrress: street_address,
			city: city,
			state: state,
			zipcode: zipcode
		}]
		}).then(function(ref){
			var id = ref.key;
			console.log('Add Contact with ID:' + id);

			// Clear the data after the form is submitted

			clearfields();

			// Hides the form

			$scope.addFormShow = false;

			// Gives the user a message

			$scope.msg = "Contact Added";
		});
	}

	// Updates the information to the contact

	$scope.editFormSubmit = function() {
		console.log("updating contact");

		//get id
		
		var id = $scope.id;

		//get record

		var record = $scope.contacts.$getRecord(id);

		console.log(record);

		//assign the values
		record.name = $scope.name;
		record.email = $scope.email;
		record.company = $scope.company;
		record.phones.work = $scope.work_phone;
		record.phones.home = $scope.home_phone;
		record.phones.mobile = $scope.mobile_phone;
		record.address.street_address = $scope.street_address;
		record.address.city = $scope.city;
		record.address.state = $scope.state;
		record.address.zipcode = $scope.zipcode;

		//Save contact

		$scope.contacts.$save(record).then(function(){
			console.log("nearly");

			clearfields();

			$scope.editFormShow = false;

			$scope.msg = "contact Updated";
		})
	}

	// Display the contacts information

	$scope.showContact = function(contact) {
		console.log("getting contact...");
		$scope.name = contact.name;
		$scope.email = contact.email;
		$scope.company = contact.company;
		$scope.work_phone = contact.phones[0].work;
		$scope.home_phone = contact.phones[0].home;
		$scope.mobile_phone = contact.phones[0].mobile;
		$scope.street_address = contact.address[0].street_address;
		$scope.city = contact.address[0].city;
		$scope.state = contact.address[0].state;
		$scope.zipcode = contact.address[0].zipcode;

		$scope.contactShow = true;
	}

	// Removes the contact

	$scope.removeContact = function(contact){
		$scope.contacts.$remove(contact);

		$scope.msg = "Contact Removed";
	}

	// Function that clears the contact input fields

	function clearfields(){
			$scope.name = "";
			$scope.email = "";
			$scope.company = "";
			$scope.mobile_phone = "";
			$scope.home_phone = "";
			$scope.work_phone = "";
			$scope.street_address = "";
			$scope.city = "";
			$scope.state = "";
			$scope.zipcode = "";
		}
	}]);