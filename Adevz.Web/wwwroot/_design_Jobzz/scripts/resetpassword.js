//Stores data on the Yobbz Member that has successfully logged in into his (her) account
var JobzzMember = null;







//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if (e.keyCode == 13)
    {
        ResetPasswordButtonClickHandler();
    }
}

//Handler called when user clicks on the Login Button
function ResetPasswordButtonClickHandler()
{
    var Message = CheckForm("EmailAddressTextBox");

    if(Message.length > 0)
    {
        alert(Message, "Jobzz");
    }
    else
    {
        var EmailAddress = document.getElementById("EmailAddressTextBox").value;

        ResetPassword(EmailAddress);
    }
}

//Handler called when user clicks on the Close Button
function CloseButtonClickHandler()
{
    SlideToPage('login.html');
}



//Sets attributes and widgets to their initial state
function SetUp()
{

}

//Resets form inputs to their attributes
function ClearForm(EmailAddressTextBoxId)
{

    if (document.getElementById(EmailAddressTextBoxId) != null)
    {
        document.getElementById(EmailAddressTextBoxId).value = "";
    }
}

//Checks that the user correctly filled the form
function CheckForm(EmailAddressTextBoxId)
{
    var Message = "";

   
    if (document.getElementById(EmailAddressTextBoxId) != null)
    {
        var EmailAddress = document.getElementById(EmailAddressTextBoxId).value;


        if (EmailAddress.length == 0)
            Message = "Please enter your email address";
        else if ( EmailAddressIsCorrectlyFormatted( EmailAddress ) == false )
            Message = "Your email address is not valid";
    }

    return (Message);
}








//Reset a memberpassword 
function ResetPassword(EmailAddress)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: AuthenticationServiceUrl + "ResetCredentials",
       type: 'POST',
       data:
       {
           EmailAddress: EmailAddress,
           ServiceKey: ServiceKey
       },
       dataType: 'json',
       success:
           function (Result)
           {
               RenderLoadingAnimation(false);
               var CredentialsReset = Result;



               if (CredentialsReset != null)
               {
                   ClearForm("EmailAddressTextBox");
                   if (CredentialsReset.CredentialsReset == true)
                   {
                       alert("Please go to your Mailbox to get your Reset Code");
                       SlideToPage('entercode.html');
                   } else
                   {
                       alert("Sorry an error has occured. Please try again");
                   }
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
