//Indicates if the user credentials were successfully reset
var CredentialsReset = false;









//Handler called when user clicks on the Close Button
function CloseButtonClickHandler()
{
    SlideToPage('login.html');
}

//Handler called when user clicks on the Reset Button
function ResetButtonClickHandler()
{
    var Message = CheckForm("EmailAddressTextBox");


    if(Message.length > 0)
    {
        alert(Message);
    }
    else
    {
        var EmailAddress = document.getElementById("EmailAddressTextBox").value;
        
        ResetCredentials(EmailAddress);
    }
}

//Handler called when member clicks on the I Have Code Button
function IHaveCodeButtonClickHandler()
{
    SlideToPage('changepassword.html');
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
function CheckForm(EmailAddressTextBoxId, PasswordTextBoxId)
{
    var Message = "";


    if (document.getElementById(EmailAddressTextBoxId) != null)
    {
        var EmailAddress = document.getElementById(EmailAddressTextBoxId).value;
       
        if (EmailAddress.length == 0)
            Message = "Please enter your email address";
        else if (EmailAddressIsCorrectlyFormatted(EmailAddress) == false)
            Message = "Your email address is not valid";
     

    }

    return (Message);
}









//Resets the Yobbz member credentioals provided that his (her) email address is correct
function ResetCredentials(EmailAddress)
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
               CredentialsReset = Result.CredentialsReset;


               if (CredentialsReset == true)
               {
                   alert("We have successfully reset your password. Please go to your email at " + EmailAddress + ", copy the code we have sent you and come back to this screen to apply your reset code");
                   ClearForm();
               }
               else
               {
                   alert("Sorry, we could not reset your password");
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