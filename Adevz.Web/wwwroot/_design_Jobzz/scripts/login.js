//Stores data on the Yobbz Member that has successfully logged in into his (her) account
var JobzzMember = null;





//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if (e.keyCode == 13)
    {
        LoginButtonClickHandler();
    }
}

//Handler called when user clicks on the Login Button
function LoginButtonClickHandler()
{
    var Message = CheckForm("EmailAddressTextBox", "PasswordTextBox");

    if(Message.length > 0)
    {
        alert(Message, "Jobzz");
    }
    else
    {
        var EmailAddress = document.getElementById("EmailAddressTextBox").value;
        var Password = document.getElementById("PasswordTextBox").value;

        Login(EmailAddress, Password);
    }
}

//Handler called when user clicks on the Close Button
function CloseButtonClickHandler()
{
    SlideToPage('authenticationdashboard.html');
}

//Handler called when user clicks on the Forgot Button
function ForgotButtonClickHandler()
{
    SlideToPage('resetpassword.html');

}






//Sets attributes and widgets to their initial state
function SetUp()
{
    if(GetDataFromBrowserLocalStorage("jobzz_member") != null)
    {
        var CurrentMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));
        LoginWithIdentity(CurrentMember.MemberId, ServiceKey);
    }
}

//Resets form inputs to their attributes
function ClearForm(EmailAddressTextBoxId, PasswordTextBoxId)
{

    if (document.getElementById(EmailAddressTextBoxId) != null && document.getElementById(PasswordTextBoxId) != null)
    {
        document.getElementById(EmailAddressTextBoxId).value = "";
        document.getElementById(PasswordTextBoxId).value = "";
    }
}

//Checks that the user correctly filled the form
function CheckForm(EmailAddressTextBoxId, PasswordTextBoxId)
{
    var Message = "";

   
    if (document.getElementById(EmailAddressTextBoxId) != null && document.getElementById(PasswordTextBoxId) != null)
    {
        var EmailAddress = document.getElementById(EmailAddressTextBoxId).value;
        var Password = document.getElementById(PasswordTextBoxId).value;


        if (EmailAddress.length == 0)
            Message = "Please enter your email address";
        else if (EmailAddressIsCorrectlyFormatted(EmailAddress) == false)
            Message = "Your email address is not valid";
        else if (Password.length == 0)
            Message = "Please enter your password";

    }

    return (Message);
}







//Logs a member into his (her) Yobbz account using his (her) ID
function LoginWithIdentity(MemberId, ServiceKey)
{
    RenderLoadingAnimation(true);


    $.ajax
   ({
      url: AuthenticationServiceUrl + "LoginWithIdentity",
      type: 'POST',
      data:
      {
          MemberId: MemberId,
          ServiceKey: ServiceKey
      },
      dataType: 'json',
      success:
          function (Result)
          {
              RenderLoadingAnimation(false);
              JobzzMember = Result;


              if (JobzzMember != null && JobzzMember.MemberId.length > 0)
              {
                //We save the Yobbz Member into the local storage and go to the role menu screen
                  StoreDataInBrowserLocalStorage("jobzz_member", JSON.stringify(JobzzMember));
                  ClearForm("EmailAddressTextBox", "PasswordTextBox");

                  var Latitude = GetDataFromBrowserLocalStorage("current_latitude");
                  var Longitude = GetDataFromBrowserLocalStorage("current_longitude");
                  UpdateMemberCurrentLocation(JobzzMember.MemberId, Latitude, Longitude, ServiceKey);
              }
              else
              {
                  RenderLoadingAnimation(false);
                  alert("Sorry, we could not log you in. Please try again");
              }

          },
      error:
          function (xhr, msg)
          {
              RenderLoadingAnimation(false);
              alert("Sorry, an error has occured on our servers");
          }
    });

}

//Logs a member into his (her) Yobbz account
function Login(Username, Password)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: AuthenticationServiceUrl + "Login",
       type: 'POST',
       data:
       {
           Username: Username,
           Password: Password,
           ServiceKey: ServiceKey
       },
       dataType: 'json',
       success:
           function (Result)
           {
               //RenderLoadingAnimation(false);
               JobzzMember = Result;

             
               if (JobzzMember != null && JobzzMember.MemberId.length > 0 )
               {
                 //We save the Yobbz Member into the local storage and go to the role menu screen
                   StoreDataInBrowserLocalStorage("jobzz_member", JSON.stringify(JobzzMember));
                   ClearForm("EmailAddressTextBox", "PasswordTextBox");

                   var Latitude = GetDataFromBrowserLocalStorage("current_latitude");
                   var Longitude = GetDataFromBrowserLocalStorage("current_longitude");
                   UpdateMemberCurrentLocation(JobzzMember.MemberId, Latitude, Longitude, ServiceKey);
               }
               else
               {
                   RenderLoadingAnimation(false);
                   alert("Sorry, your email address or password is incorrect");
               }
                   
           },
       error:
           function (xhr, msg)
           {
               RenderLoadingAnimation(false);
               alert("Sorry, an error has occured on our servers");
           }
   });


}

//Updates member current location
function UpdateMemberCurrentLocation(MemberId, Latitude, Longitude, ServiceKey)
{
        $.ajax
      ({
          url: LocatorServiceUrl + "UpdateMemberCurrentLocation",
          type: 'POST',
          data:
          {
              MemberId: MemberId,
              Latitude: Latitude,
              Longitude: Longitude,
              ServiceKey: ServiceKey
          },
          dataType: 'json',
          success:
              function (Result)
              {
                  RenderLoadingAnimation(false);
                  var LocationUpdated = Result.LocationUpdated;

                  if (LocationUpdated == true)
                      SlideToPage('rolemenu.html');
                  else
                      alert("Sorry an error has occured. Please try loging in again");
              },
          error:
              function (xhr, msg)
              {
                  RenderLoadingAnimation(false);
                  alert("Sorry, an error has occured on our servers");
              }
      });
}