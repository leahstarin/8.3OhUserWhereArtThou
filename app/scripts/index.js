var $ = require('jquery');
var Firebase = require('firebase');

$.fn.serializeObject = function() {
  return this.serializeArray().reduce(function(acum, i) {
    acum[i.name] = i.value;
    return acum;
  }, {});
};

$(function(){
  var ref = new Firebase("https://fiery-fire-1039.firebaseio.com/");
  var auth;
  var formData;

  $('#signup').on('submit', function(event){
    event.preventDefault();
    var $form = $(this);
    var formData = $form.serializeObject();

    ref.createUser(formData, function(error, userData) {
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
          default:
            console.log("Error creating user:", error);
        }
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });

  });

  $('#login').on('submit', function(event){
    event.preventDefault();
    var $form = $(this);
    formData = $form.serializeObject();
    console.log(formData.email);

    ref.authWithPassword(formData, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        auth = authData.token;
      }
    });

  });
  $('#messageInput').on ( "submit", function (e) {
            e.preventDefault();
            var name = formData.email;
            var text = $('#textmessages').val();
            ref.push({name: name, text: text});
            $('#messageInput').val('');
          if (e.keyCode == 13) {
            e.preventDefault();
            var name = formData.email;
            var text = $('#textmessages').val();
            ref.push({name: name, text: text});
            $('#messageInput').val('');
          }
        });
         ref.on('child_added', function(snapshot) {
          var message = snapshot.val();
          displayChatMessage(message.name, message.text);
        });
        function displayChatMessage(name, text) {
          $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
          $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
          $('#textmessages').val('').empty();
        };


});
