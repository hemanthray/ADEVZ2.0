//Stores data on all the workers that are near by
var WorkersNearBy = new Array();
//Stores the workers filtering option (i.e. "all", "job type")
var FilteringOption = "all";
//Stores the picture that was selected
var PictureBytes = null;
//Stores the  picture name
var PictureName = "";
//Stores data on the member that is currently logged in
var JobzzMember = null;
//Stores member API Token
var APIToken = "";
//Stores the type of job that the contractor selected
var SelectedJobType = "";
//Stores data on the contractor billing info
var ContractorBillingInfo = null;











//Handler called when member clicks on the market place button
function MarketPlaceButtonClickHandler()
{
    SlideToPage("jobtypeselectionmenu.html")
}

//Handler called when member clicks on the Post Request Button
function PostRequestButtonClickHandler()
{

}

//Handler called when member clciks on the Notifications Button
function NotificationsButtonClickHandler()
{
    SlideToPage("notifications.html")
}

//Handler called when member clicks on the Account Button
function AccountButtonClickHandler()
{
    SlideToPage("account.html");
}

//Handler called when member clicks on the Need A Job Button
function NeedAJobButtonClickHandler()
{

}

//Handler called when member clicks on the log out button
function LogOutButtonClickHandler()
{
    if(confirm("Are you sure you want to log out ?") == true)
    {
        LogOut(JobzzMember.MemberId, ServiceKey);
    }
}

//Handler called when member clicks on the Menu Profile Picture Panel
function MenuProfilePicturePanelClickHandler()
{
    document.getElementById("SelectPictureButtonWidget").click();
}

//Handler called when member clicks on the Order Worker Button
function OrderWorkerButtonClickHandler(WorkerIndex)
{
    var SelectedWorker = WorkersNearBy[WorkerIndex];


  //We first make sure that the contractor has a credit card on file. If not, we direct him (her) to the payment method screen. Otherwise we proceed with the order
    if (
           (ContractorBillingInfo == null) ||
           (ContractorBillingInfo.CreditCardNumber != null && ContractorBillingInfo.CreditCardNumber.length == 0) 
       )
    {
        if(confirm("Sorry you can not order " + SelectedWorker.FirstName + " for this task yet. You need to enter you credit card information. Would you like to do that now ?") == true)
        {
            SlideToPage("paymentmethod.html");
        }
    }
    else
    {
        if (WorkersNearBy != null && WorkersNearBy.length > 0 && WorkerIndex >= 0 && WorkerIndex < WorkersNearBy.length)
        {
            StoreDataInBrowserLocalStorage("selected_worker", JSON.stringify(SelectedWorker));
            SlideToPage("taskscheduling.html");
        }
    }
    
}









//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));


    //var SliderHeight = screen.height - 40;
    //document.getElementById("WorkersSlider").setAttribute("style", "height:" + SliderHeight + "px !important;");



    if (GetDataFromBrowserLocalStorage("current_latitude") != null)
        YobbzUserCurrentLatitude = parseFloat(GetDataFromBrowserLocalStorage("current_latitude"));
    if (GetDataFromBrowserLocalStorage("current_longitude") != null)
        YobbzUserCurrentLongitude = parseFloat(GetDataFromBrowserLocalStorage("current_longitude"));



  

    if (JobzzMember.PictureUrl != null && JobzzMember.PictureUrl.length > 0)
    {
        document.getElementById("ProfilePicture").src = JobzzMember.PictureUrl;
    }

    document.getElementById("SelectPictureButtonWidget").addEventListener("change", SelectPictureButtonWidgetChangeHandler);


    if (GetDataFromBrowserLocalStorage("selected_job_type") != null)
    {
        SelectedJobType = GetDataFromBrowserLocalStorage("selected_job_type");
        GetContractorBillingInfo(JobzzMember.MemberId, APIToken);
        GetWorkersNearByForTask(JobzzMember.MemberId, YobbzUserCurrentLatitude, YobbzUserCurrentLongitude, SelectedJobType, APIToken);
    }
    else
    {

    }
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
            
            if(SelectedFileMimeType.toLowerCase().indexOf("image") >= 0)
            {
                PictureName = CurrentSelectedFile.name;

                var UploadResult = NewFileReader.result;
                var FileBytesTokens = UploadResult.split(",");


                if ((FileBytesTokens != null) && (FileBytesTokens.length >= 2))
                {
                    PictureBytes = FileBytesTokens[1];
                    PictureName = CurrentSelectedFile.name;

                    if (PictureBytes != null && PictureBytes.length > 0 && PictureName != null && PictureName.length > 0)
                        UpdateMemberProfilePicture(JobzzMember.MemberId, PictureBytes, PictureName, APIToken);
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

//Renders data on all the workers that are near by
function ShowWorkers(Workers)
{
    var HTML = "";
    var SliderHeight = $(window).height() - 40;
    document.getElementById("WorkersSlider").setAttribute("style", "height:" + SliderHeight + "px !important;");


    if (Workers != null && Workers.length > 0)
    {
        var i = 0;
        var j = 0;
        var CurrentWorker = null;
        var CurrentWorkerPictureUrl = "images/jobzzlogo.png";
        var RemainingHeight = screen.height - 40 - 500;

        if (RemainingHeight < 0)
            RemainingHeight = RemainingHeight * -1;

        var ButtonHeight = 70;
        var DistanceText = "";
        var DistanceTextTokens = null;
        var LastNameInitials = "";



        for(i; i < Workers.length; i++)
        {
            CurrentWorker = Workers[i];

            if (CurrentWorker.PictureUrl != null && CurrentWorker.PictureUrl.length > 0)
                CurrentWorkerPictureUrl = CurrentWorker.PictureUrl;
            else
                CurrentWorkerPictureUrl = "images/jobzzlogo.png";

            DistanceTextTokens = ("" + CurrentWorker.DistanceAway).split(".");

            if (DistanceTextTokens != null && DistanceTextTokens.length >= 2)
            {
                if (DistanceTextTokens[1].length >= 1)
                    DistanceText = DistanceTextTokens[0] + "." + DistanceTextTokens[1].charAt(0);
            }
            else if (DistanceTextTokens != null && DistanceTextTokens.length == 1)
            {
                DistanceText = DistanceTextTokens[0];
            }

            if (CurrentWorker.LastName != null && CurrentWorker.LastName.length > 0)
                LastNameInitials = "" + CurrentWorker.LastName.charAt(0);
            else
                LastNameInitials = "";

            



            HTML = HTML +

                  '<div class="w-slide" style="background-color:white !important;">' +

                  '<div style="width:100% !important;height:180px;background-color:#000000 !important;' +
                  'margin-left:0px !important;background-image:url(images/constructiontools.jpg);' +
                  'background-position:center" >' +

                  '<center>' +
                  '<img id="ProfilePicture" src="' + CurrentWorkerPictureUrl + '" style="width:96px !important;height:96px !important;margin-top:40px !important;' +
                  'border-radius: 50% !important;" />' +
                  '</center>' +


                   '<div style="width:100px;height:20px;background-color:#FDC603;color:#000000;font-family:AvenirNextLTW01BoldRegular !important;' +
                   'margin-left:auto;margin-right:auto;margin-top:24px !important;">' +
                   '<center>' + DistanceText + ' miles away' + '</center>' +
                   '</div>' +
                                    
                                   
                   '</div>' +


                   '<div style="width:100% !important;">' +
                   '<input class="action-button w-button" type="button" value="' + CurrentWorker.FirstName + " " + LastNameInitials + '"' +
                   'style="width:100% !important;height:70px !important;font-size:18px !important;outline:none !important;color:#FFFFFF !important;' +
                   'font-family:AvenirNextLTW01BoldRegular !important;">' +
                   '</div>' +


                   '<center>' +
                   '<h1 style="font-family:AvenirNextLTW01BoldRegular !important;color:#000000 !important;">$' + CurrentWorker.HourlyRate + '/h</h1>' +
                   '<span style="font-family:AvenirNextLTW01BoldRegular !important;color:#000000 !important;">I CAN HELP WITH</span>' +
                   '</center>' 

            ;



            if(CurrentWorker.Skills != null && CurrentWorker.Skills.length >0)
            {
                j = 0;
                HTML = HTML + '<center>';

                for(j; j < CurrentWorker.Skills.length; j++)
                {
                    HTML = HTML + '<div style="font-family:AvenirNextLTW01RegularRegular !important;color:#000000 !important;margin-top:5px !important;">' + CurrentWorker.Skills[j] + '</div>';       
                }

                
                
                HTML = HTML + '</center>';
            }


            HTML = HTML +

                   '<div style="width:100% !important;position:fixed;bottom:0;">' +
                   '<input class="action-button w-button" type="button" value="ORDER"' +
                   'style="width:100% !important;height:' + ButtonHeight + 'px !important;font-size:18px !important;outline:none !important;color:#FDC603 !important;' +
                   'font-family:AvenirNextLTW01BoldRegular !important;" onclick="' + 'OrderWorkerButtonClickHandler(' + i + ')">' +
                   '</div>' +


                   '</div>'

                    ;

                             
        }

        document.getElementById("WorkersTitleLabel").innerHTML = "Swipe to see workers";
    }
    else
    {
        var BottomPanelHeight = (($(window).height()) - 40 - 120) / (2)
        HTML =

            '<div id="NoWorkersPanel" style="width:100% !important;display:block !important;height:120px;margin-top:' + BottomPanelHeight + 'px !important;">' +
            '<center>' +
            '<h2 style="font-family:AvenirNextLTW01BoldRegular !important;color:#000000 !important;">Sorry, There are</h2>' +
            '<h2 style="font-family:AvenirNextLTW01BoldRegular !important;color:#000000 !important;">No Workers</h2>' +
            '<h2 style="font-family:AvenirNextLTW01BoldRegular !important;color:#000000 !important;">Near You</h2>' +
            '</center>' +
            '</div>'

            ;

        document.getElementById("WorkersTitleLabel").innerHTML = "Swipe to see workers";
    }



    document.getElementById("WorkersPanel").innerHTML = HTML;
    

    LaunchSlider();
}

//Launches the slider on the screen
function LaunchSlider()
{
    Webflow.require("slider").redraw();
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

               if(PictureUpdated == true)
               {
                   JobzzMemberPicture = "data:image/jpeg;base64," + PictureBytes;
                   document.getElementById("ProfilePicture").src = JobzzMemberPicture;
                   document.getElementById("PictureLabel").innerHTML = "Picture Successfully uploaded.";
               }
               else
               {
                   document.getElementById("PictureLabel").innerHTML = "Your picture could not be uploaded.";
               }
              

           },
       error:
           function (xhr, msg)
           {
               //RenderLoadingAnimation(false);
               alert("Sorry, an error has occured on our servers");
           }
   });
}

//Retrieves data on all the workers near by that can perform a given task
function GetWorkersNearByForTask(MemberId, Latitude, Longitude, Task, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
        url: LocatorServiceUrl + "GetWorkersNearByForTask",
        type: 'POST',
        data:
        {
            MemberId: MemberId,
            Latitude: Latitude,
            Longitude: Longitude,
            Task: Task,
            APIToken: APIToken
        },
        dataType: 'json',
        success:
          function (Result)
          {
              RenderLoadingAnimation(false);
              var PictureUpdated = Result.PictureUpdated;
              WorkersNearBy = Result;
            
              ShowWorkers(WorkersNearBy);
              

          },
        error:
          function (xhr, msg)
          {
              RenderLoadingAnimation(false);
              alert("Sorry, an error has occured on our servers");
          }
  });

}

//Retrieves contractor billing information
function GetContractorBillingInfo(MemberId, APIToken)
{
    $.ajax
  ({
      url: ProfileServiceUrl + "GetContractorBillingInfo",
      type: 'POST',
      data:
      {
          MemberId: MemberId,
          APIToken: APIToken
      },
      dataType: 'json',
      success:
        function (Result)
        {
            ContractorBillingInfo = Result;
        },
      error:
        function (xhr, msg)
        {
            
        }
  });
}

//Logs out a member from the system
function LogOut(MemberId, ServiceKey)
{
    $.ajax
   ({
       url: AuthenticationServiceUrl + "LogOut",
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
               var LoggedOut = Result.LoggedOut;

               if(LoggedOut == true)
               {
                 //We clear the local storage and redirect the member to the login screen
                   StoreDataInBrowserLocalStorage("jobzz_member", "");
                   SlideToPage("login.html");
               }
               else
               {
                   alert("Sorry, an error occured. We could not log you out. Please try again or restart the app");
               }

           },
         error:
           function (xhr, msg)
           {

           }
   });
}
