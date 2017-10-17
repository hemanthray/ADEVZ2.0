//Stores data on the profile of the member that is currently logged in
var MemberProfile = null;
//Stores data on the member that is currently logged in
var JobbzMember = null;
//Stores token we use to call API on behalf of member
var APIToken = "";
//Stores member current role
var CurrentRole = "";










//Handler called when member clicks on the back button
function BackButtonClickHandler()
{
    switch(CurrentRole.toLowerCase())
    {
        case "contractor":
            SlideToPage("account.html");
            break;
        case "worker":
            SlideToPage("account.html");
            break;
    }
}

//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if (e.keyCode == 13)
    {
        SaveProfileButtonClickHandler();
    }
}

//Handler called when member clicks on the Menu Profile Picture Panel
function MenuProfilePicturePanelClickHandler()
{
    document.getElementById("SelectPictureButtonWidget").click();
}

//Handler called when member clicks on the Save Profile Button
function SaveProfileButtonClickHandler()
{
    var Message = CheckForm();

    if(Message.length > 0)
    {
        alert(Message);
    }
    else
    {
        var MemberId = JobbzMember.MemberId;
        var Name = document.getElementById("NameTextBox").value;
        var EmailAddress = document.getElementById("EmailAddressTextBox").value;
        var MobilePhoneNumber = document.getElementById("MobilePhoneNumberTextBox").value;
        var BirthDay = document.getElementById("BirthDayTextBox").value;

        switch(CurrentRole.toLowerCase())
        {
            case "contractor":
                UpdateContractorProfile(MemberId, Name, EmailAddress, MobilePhoneNumber, BirthDay, APIToken);
                break;
            case "worker":
                break;
        }
    }
}









//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    CurrentRole = GetDataFromBrowserLocalStorage("current_role");

    var ProfileJSON = GetDataFromBrowserLocalStorage("jobzz_member");
    var CurrentProfile = JSON.parse(ProfileJSON);

    MemberProfile = CurrentProfile;
    document.getElementById("SelectPictureButtonWidget").addEventListener("change", SelectPictureButtonWidgetChangeHandler);


    GetJobzzMemberProfile(CurrentProfile.MemberId, ServiceKey);
}

//Renders information on the member profile
function ShowProfile(Profile)
{
    if(Profile != null)
    {
        document.getElementById("NameTextBox").value = Profile.FirstName + " " + Profile.MiddleName + " " + Profile.LastName;
        document.getElementById("EmailAddressTextBox").value = Profile.CardsWallet.ContactInformationsCard.EmailAddress;
        document.getElementById("MobilePhoneNumberTextBox").value = Profile.CardsWallet.ContactInformationsCard.MobilePhoneNumber;
        document.getElementById("BirthDayTextBox").value = Profile.BirthDay;


        if (Profile.PictureUrl != null && Profile.PictureUrl.length > 0)
            document.getElementById("ProfilePicture").src = Profile.PictureUrl;
        else
            document.getElementById("ProfilePicture").src = "images/jobzzlogo.png";

    }
}

//Checks that the member correctly filled the form
function CheckForm()
{
    var Message = "";

    var Name = document.getElementById("NameTextBox").value;
    var EmailAddress = document.getElementById("EmailAddressTextBox").value;
    var BirthDay = document.getElementById("BirthDayTextBox").value;

    if (Name.length == 0)
        Message = "Please enter your name";
    else if (EmailAddress.length == 0)
        Message = "Please enter your email address";
    else if (EmailAddressIsCorrectlyFormatted(EmailAddress) == false)
        Message = "Your email address is not valid";
    else if (BirthDay.length > 0 && ShortDateIsCorrectlyFormatted(BirthDay) == false)
        Message = "Your Birthday is not valid. Please enter it as MM/DD/YYYY (i.e. 01/01/1980)";



    return (Message);
}

//Handler called after the user selects a picture
function SelectPictureButtonWidgetChangeHandler(event)
{
    var i = 0;
    var CurrentSelectedFile = null;
    var FileWidget = document.getElementById(event.target.id);
    var SelectedFiles = FileWidget.files;
    var PictureNameTokens = null;



    if ((SelectedFiles != null) && (SelectedFiles.length > 0))
    {
        var NewFileReader = new FileReader();
        CurrentSelectedFile = SelectedFiles[i];


        NewFileReader.onloadend = function ()
        {
            var SelectedFileMimeType = SelectedFiles[i]['type'];

            if (SelectedFileMimeType.toLowerCase().indexOf("image") >= 0)
            {
                PictureName = CurrentSelectedFile.name;

                var UploadResult = NewFileReader.result;
                var FileBytesTokens = UploadResult.split(",");


                if ((FileBytesTokens != null) && (FileBytesTokens.length >= 2))
                {
                    PictureBytes = FileBytesTokens[1];
                    PictureName = CurrentSelectedFile.name;

                    if (PictureBytes != null && PictureBytes.length > 0 && PictureName != null && PictureName.length > 0)
                        UpdateMemberProfilePicture(MemberProfile.MemberId, PictureBytes, PictureName, APIToken);
                }
            }
            else
            {
                alert("Please select an image or take a picture");
            }


        }


        NewFileReader.readAsDataURL(CurrentSelectedFile);
    }

}









//Retrieves the profile of the member currently logged in
function GetJobzzMemberProfile(MemberId, ServiceKey)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: ProfileServiceUrl + "GetJobzzMemberProfile",
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

             if (Result != null && Result.MemberId != null && Result.MemberId.length > 0 && Result.MemberId != "00000000-0000-0000-0000-000000000000")
             {
                 JobbzMember = Result;
                 ShowProfile(JobbzMember);
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

//Updates contractor profile
function UpdateContractorProfile( MemberId,  Name,  EmailAddress,  MobilePhoneNumber,  BirthDay,  APIToken)
{
    RenderLoadingAnimation(true);
   

    $.ajax
  ({
      url: ProfileServiceUrl + "UpdateContractorProfile",
      type: 'POST',
      data:
      {
          MemberId: MemberId,
          Name: Name,
          EmailAddress: EmailAddress,
          MobilePhoneNumber: MobilePhoneNumber,
          BirthDay: BirthDay,
          
          APIToken: APIToken
      },
      dataType: 'json',
      success:
        function (Result)
        {
            RenderLoadingAnimation(false);

            if (Result != null && Result.MemberId != null && Result.MemberId.length > 0 && Result.MemberId != "00000000-0000-0000-0000-000000000000")
            {
                JobbzMember = Result;
                ShowProfile(JobbzMember);
                StoreDataInBrowserLocalStorage("jobzz_member", JSON.stringify(JobzzMember));
            }
            else
            {
                alert("Sorry we could not update your profile. Please try using another email address");
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

//Updates member profile picture
function UpdateMemberProfilePicture(MemberId, PictureBytes, PictureName, APIToken)
{
    document.getElementById("PictureLabel").innerHTML = "Picture uploading...";
    RenderLoadingAnimation(true);


    $.ajax
   ({
       url: ProfileServiceUrl + "UpdateMemberProfilePicture",
       type: 'POST',
       data:
       {
           MemberId: MemberId,
           PictureBytes: PictureBytes,
           PictureName: PictureName,
           APIToken: APIToken
       },
       dataType: 'json',
       success:
           function (Result)
           {
               RenderLoadingAnimation(false);
               var PictureUpdated = Result.PictureUpdated;

               if (PictureUpdated == true)
               {
                   JobzzMemberPicture = "data:image/jpeg;base64," + PictureBytes;
                   document.getElementById("ProfilePicture").src = JobzzMemberPicture;
                   document.getElementById("PictureLabel").innerHTML = "tap to upload your profile picture.";
               }
               else
               {
                   document.getElementById("PictureLabel").innerHTML = "Your picture could not be uploaded.";
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