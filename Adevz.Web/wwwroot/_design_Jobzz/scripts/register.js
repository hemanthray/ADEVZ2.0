//Stores data on the Yobbz Member that has successfully logged in into his (her) account
var JobzzMember = null;







//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if(e.keyCode == 13)
    {
        SignUpButtonClickHandler();
    }
}


//Handler called whyen user clicks on the Sign Up Button
function SignUpButtonClickHandler()
{
    var Message = CheckForm("NameTextBox", "EmailAddressTextBox", "PasswordTextBox", "ConfirmPasswordTextBox");

    if (Message.length > 0)
    {
        alert(Message, "Jobzz");
    }
    else
    {
        var Name = document.getElementById("NameTextBox").value;
        var EmailAddress = document.getElementById("EmailAddressTextBox").value;
        var Password = document.getElementById("PasswordTextBox").value;

        SignUp(Name, EmailAddress, Password, YobbzUserCurrentLatitude, YobbzUserCurrentLongitude);
    }
}

//Handler called when user clicks on the Close Button
function CloseButtonClickHandler()
{
    SlideToPage('authenticationdashboard.html');
}

//Handler called when user clicks on the Terms Button
function TermsButtonClickHandler()
{
    SlideToPage('terms.html');
}









//Sets attributes and widgets to their initial state
function SetUp()
{
    if(GetDataFromBrowserLocalStorage("current_latitude") != null)
        YobbzUserCurrentLatitude = parseFloat(GetDataFromBrowserLocalStorage("current_latitude"));

    if (GetDataFromBrowserLocalStorage("current_longitude") != null)
        YobbzUserCurrentLongitude = parseFloat(GetDataFromBrowserLocalStorage("current_longitude"));

}

//Resets form inputs to their attributes
function ClearForm(NameTextBoxId, EmailAddressTextBoxId, PasswordTextBoxId, ConfirmPasswordTextBoxId)
{

    if (document.getElementById(EmailAddressTextBoxId) != null && document.getElementById(PasswordTextBoxId) != null)
    {
        document.getElementById(NameTextBoxId).value = "";
        document.getElementById(EmailAddressTextBoxId).value = "";
        document.getElementById(PasswordTextBoxId).value = "";
        document.getElementById(ConfirmPasswordTextBoxId).value = "";
    }
}

//Checks that the user correctly filled the form
function CheckForm(NameTextBoxId, EmailAddressTextBoxId, PasswordTextBoxId, ConfirmPasswordTextBoxId)
{
    var Message = "";


    if (document.getElementById(EmailAddressTextBoxId) != null && document.getElementById(PasswordTextBoxId) != null && document.getElementById(NameTextBoxId) != null &&
        document.getElementById(ConfirmPasswordTextBoxId) != null)
    {
        var Name = document.getElementById(NameTextBoxId).value;
        var EmailAddress = document.getElementById(EmailAddressTextBoxId).value;
        var Password = document.getElementById(PasswordTextBoxId).value;
        var ConfirmedPassword = document.getElementById(ConfirmPasswordTextBoxId).value;


        if (Name.length == 0)
            Message = "Please enter your name";
        else if (EmailAddress.length == 0)
            Message = "Please enter your email address";
        else if (EmailAddressIsCorrectlyFormatted(EmailAddress) == false)
            Message = "Your email address is not valid";
        else if (Password.length == 0)
            Message = "Please enter your password";
        else if (ConfirmedPassword.length == 0)
            Message = "Please confirm your password";
        else if (Password != ConfirmedPassword)
            Message = "Please enter identical passwords";

    }

    return (Message);
}









//Signs up a new user for Yobbz
function SignUp(Name, EmailAddress, Password, CurrentLatitude, CurrentLongitude)
{
    RenderLoadingAnimation(true);
   
    $.ajax
   ({
       url: AuthenticationServiceUrl + "SignUp",
       type: 'POST',
       data:
       {
           Name: Name,
           EmailAddress: EmailAddress,
           Password: Password,
           CurrentLatitude: CurrentLatitude,
           CurrentLongitude: CurrentLongitude,
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
                 //We save the Jobzz Member into the local storage
                   StoreDataInBrowserLocalStorage("jobzz_member", JSON.stringify(JobzzMember));
                   ClearForm("NameTextBox", "EmailAddressTextBox", "PasswordTextBox", "ConfirmPasswordTextBox");

                   SlideToPage("rolemenu.html");
               }
               else
               {
                   alert("Sorry, we could not create your account.");
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