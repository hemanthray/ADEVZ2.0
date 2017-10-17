//Stores data on the member that is currently logged in
var JobzzMember = null;
//Stores member API Token
var APIToken = "";
//Stores data on all the notifications that the member received
var Notifications = new Array();
//STores the index of the notification that the member deleted
var DeletedNotificationIndex = -1;










//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("workersnearby.html");
}

//Handler called when the user taps on a given notification
function TapNotificationHandler(NotificationIndex)
{
    if (NotificationIndex >= 0 && Notifications != null && Notifications.length > 0 && NotificationIndex < Notifications.length)
    {
        var SelectedNotification = Notifications[NotificationIndex];
        
    }
}

//Handler called when the user double taps a given notification
function DoubleTapNotificationHandler(NotificationIndex)
{
    if(NotificationIndex >= 0 && Notifications != null && Notifications.length > 0 && NotificationIndex < Notifications.length)
    {
        if(confirm("Are you sure you want to delete this notification") == true)
        {
            DeletedNotificationIndex = NotificationIndex;
            var SelectedNotification = Notifications[NotificationIndex];
            DeleteNotification(JobzzMember.MemberId, SelectedNotification.NotificationId, JobzzMember.APIToken);
        }
    }
}








//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));

    GetNotificationsMemberReceived(JobzzMember.MemberId, APIToken);
}


//Renders data on the notifications that the member received
function ShowNotifications(Notifications)
{
    var HTML = "";

    var MemberName = "";
    var MemberPictureUrl = "images/jobzzlogo.png";

    HTML = HTML + '<ul  class="list list-messages">';
   

    if (Notifications != null && Notifications.length > 0)
    {
        var i = 0;
        var CurrentNotification = null;

        for (i; i < Notifications.length; i++)
        {
            CurrentNotification = Notifications[i]

            if (CurrentNotification.OtherMemberPictureUrl != null && CurrentNotification.OtherMemberPictureUrl.length > 0)
            {
                MemberName = CurrentNotification.OtherMemberName;
                MemberPictureUrl = CurrentNotification.OtherMemberPictureUrl;
            }
            else if (CurrentNotification.ReceiverPictureUrl != null && CurrentNotification.ReceiverPictureUrl.length > 0)
            {
                MemberName = CurrentNotification.ReceiverName;
                MemberPictureUrl = CurrentNotification.ReceiverPictureUrl;
            }
            else
                MemberPictureUrl = "images/jobzzlogo.png";


            HTML = HTML +

                '<li class="list-message" data-ix="list-item">' +
                '<a class="w-clearfix w-inline-block" data-load="1" href="#" ondblclick="' + 'DoubleTapNotificationHandler(' + i + ')' + '" ' + 'onclick="' + 'TapNotificationHandler(' + i + ')"' + '>' +
                '<div class="column-left w-clearfix">' +
                '<div class="image-message">' +
                '<img src="' + MemberPictureUrl + '">' +
                '</div>' +
                '</div>' +
                '<div class="column-right">' +
                '<div class="message-title">' + MemberName + '</div>' +
                '<div class="message-text">' + CurrentNotification.NotificationText + '</div>' +

                '<div style="width:130px !important;height:20px !important;background-color:#000000 !important;color:#FDC603 !important;' +
                'font-family:AvenirNextLTW01BoldRegular !important;margin-top:5px !important;margin-left:80px !important;">' +
                '<center>' + CurrentNotification.CreatedSince + '</center>' +
                '</div>' +

                '</div>' +
                '</a>' +
                '</li>'

                    ;
        }

        HTML = HTML + '</ul>';
        document.getElementById("NotificationsPanel").innerHTML = HTML;


        ReinitializeWebFlow(); //See common.js for function definition
    }
}






//Retrieves data on all the notifications that the member received
function GetNotificationsMemberReceived(MemberId, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: NotificationServiceUrl + "GetNotificationsMemberReceived",
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
             RenderLoadingAnimation(false);
             Notifications = Result;

             ShowNotifications(Notifications);

             
         },
       error:
         function (xhr, msg)
         {
             RenderLoadingAnimation(false);
             alert("Sorry, an error has occured on our servers");
         }
   });
}

//Deletes a given notification
function DeleteNotification(MemberId, NotificationId, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: NotificationServiceUrl + "DeleteNotification",
       type: 'POST',
       data:
       {
           MemberId: MemberId,
           NotificationId: NotificationId,
           APIToken: APIToken
       },
       dataType: 'json',
       success:
         function (Result)
         {
             RenderLoadingAnimation(false);
             Deleted = Result.Deleted;

             if (Deleted == true && DeletedNotificationIndex >= 0)
             {
                 Notifications.splice(DeletedNotificationIndex, 1);
                 ShowNotifications(Notifications);

                 DeletedNotificationIndex = -1;
             }
             else
             {
                 alert("Sorry, we could not delete your notification");
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