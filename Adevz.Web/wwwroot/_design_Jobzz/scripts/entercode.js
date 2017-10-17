//Stores data on the Yobbz Member that has successfully logged in into his (her) account
var PasswordChanged = null;







//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if (e.keyCode == 13)
    {
        EnteredCodeButtonClickHandler();
    }
}

//Handler called when user clicks on the Login Button
function SubmitButtonClickHandler()
{
    var Message = CheckForm("EnteredCodeTextBox", "NewPasswordTextBox", "ConfirmPasswordTextBox");

    if(Message.length > 0)
    {
        alert(Message, "Jobzz");
    }
    else
    {
        var ResetCode = document.getElementById("EnteredCodeTextBox").value;
        var NewPassword = document.getElementById("NewPasswordTextBox").value;

        ChangePassword(ResetCode, NewPassword);
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
function ClearForm(EnteredCodeTextBoxId, NewPasswordTextBoxId, ConfirmPasswordTextBoxId)
{

    if (document.getElementById(EnteredCodeTextBoxId) != null)
    {
        document.getElementById(EnteredCodeTextBoxId).value = "";
    }
    if (document.getElementById(NewPasswordTextBoxId) != null)
    {
        document.getElementById(NewPasswordTextBoxId).value = "";
    }
    if (document.getElementById(ConfirmPasswordTextBoxId) != null)
    {
        document.getElementById(ConfirmPasswordTextBoxId).value = "";
    }
}

//Checks that the user correctly filled the form
function CheckForm(EnteredCodeTextBoxId, NewPasswordTextBoxId, ConfirmPasswordTextBoxId)
{
    var Message = "";

   
    if (document.getElementById(EnteredCodeTextBoxId) != null && document.getElementById(NewPasswordTextBoxId) != null && document.getElementById(ConfirmPasswordTextBoxId) != null)
    {
        var ResetCode = document.getElementById(EnteredCodeTextBoxId).value;
        var NewPassword = document.getElementById(NewPasswordTextBoxId).value;
        var ConfirmPassword = document.getElementById(ConfirmPasswordTextBoxId).value;

        if (ResetCode.length == 0)
            Message = "Please enter your Code";
        else if (NewPassword.length == 0)
            Message = "Please enter your new password";
        else if (ConfirmPassword.length == 0)
            Message = "Please confirm your new password";
        else if (NewPassword != ConfirmPassword)
            Message = "your confirm password doesnt match the new password";
    }

    return (Message);
}








//Change a memberpassword 
function ChangePassword(ResetCode, NewPassword)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: AuthenticationServiceUrl + "ChangePassword",
       type: 'POST',
       data:
       {
           ResetCode: ResetCode,
           NewPassword: NewPassword,
           ServiceKey: ServiceKey
       },
       dataType: 'json',
       success:
           function (Result)
           {
               RenderLoadingAnimation(false);
               var PasswordChanged = Result;


             
               if (PasswordChanged != null)
               {
                   ClearForm("EnteredCodeTextBox", "NewPasswordTextBox", "ConfirmPasswordTextBox");

                   if (PasswordChanged.PasswordChanged == true)
                   {
                       SlideToPage('login.html');
                   }else
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