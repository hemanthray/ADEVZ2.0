//Stores data on the logged in member
var JobzzMember = null;
//Stores the member API Token
var APIToken = null;






//Handler called when the user clicks on the I Need A Job Button
function INeedAJobButtonClickHandler()
{
    if(APIToken != null && APIToken.length > 0)
    {
        UpdateMemberCurrentRole(JobzzMember.MemberId, "worker", APIToken);
    }
    else
    {
        alert("Sorry an authentication error has occured. Please restart The App");
    }
}

//Handler called when the user clicks on the I Need A Worker Button
function INeedAWorkerButtonClickHandler()
{
    if (APIToken != null && APIToken.length > 0)
    {
        UpdateMemberCurrentRole(JobzzMember.MemberId, "contractor", APIToken);
    }
    else
    {
        alert("Sorry an authentication error has occured. Please restart The App");
    }
}








//Sets attributes and widgets to their initial state
function SetUp()
{

  //Getting member information from local storage. 
    if (GetDataFromBrowserLocalStorage("jobzz_member") != null)
    {
        JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));
    }


  //Setting up the buttons height
    var ButtonHeight = screen.height / 2;

    document.getElementById("INeedAWorkerPanel").setAttribute("style", "width:100% !important;height:" + ButtonHeight + "px !important");
    document.getElementById("INeedAJobPanel").setAttribute("style", "width:100% !important;height:" + ButtonHeight + "px !important");


  //Getting member API Token. If there is none, we simply go and retrieve it from the server and then keep it on the local storage
    GetMemberAPIToken(JobzzMember.MemberId);
    
}








//Retrieves member API Token
function GetMemberAPIToken(MemberId)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: AuthenticationServiceUrl + "GetMemberAPIToken",
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
               
               if(Result != null && Result.APIToken != null && Result.APIToken.length > 0)
               {
                   APIToken = Result.APIToken;
                   StoreDataInBrowserLocalStorage("jobbz_member_api_token", APIToken);
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

//Updates the member current role
function UpdateMemberCurrentRole(MemberId, CurrentRole, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: ProfileServiceUrl + "UpdateMemberCurrentRole",
       type: 'POST',
       data:
       {
           MemberId: MemberId,
           CurrentRole: CurrentRole,
           APIToken: APIToken
       },
       dataType: 'json',
       success:
           function (Result)
           {
               RenderLoadingAnimation(false);

               if (Result != null && Result.RoleUpdated == true)
               {
                   switch(CurrentRole.toLowerCase())
                   {
                       case "contractor":
                           StoreDataInBrowserLocalStorage("current_role", "contractor");
                           SlideToPage("jobtypeselectionmenu.html");
                           break;
                       case "worker":

                           StoreDataInBrowserLocalStorage("current_role", "worker");

                         //If the user  is a worker and has registered already we take him (her) directly to the jobs near by screen otherwise we take him (her) to the sign up
                           if (GetDataFromBrowserLocalStorage("worker_registered") != null && GetDataFromBrowserLocalStorage("worker_registered") == "true")
                               SlideToPage("jobsnearby.html");
                           else
                               SlideToPage("workersignup.html");


                           break;
                   }
                   
               }
               else
               {
                   alert("Sorry an error has occured.");
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