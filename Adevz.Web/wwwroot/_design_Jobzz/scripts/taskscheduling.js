//Stores data on the member that is currently logged in
var JobbzMember = null;
//Stores token we use to call API on behalf of member
var APIToken = "";
//Stores data on the worker that the contractor selected (if any)
var SelectedWorker = null;
//Stores the name of the task that the contarctor needs help with
var SelectedTask = "";











//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("workersnearby.html");
}

//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if (e.keyCode == 13)
    {
        NextButtonClickHandler();
    }
}

//Handler called when member clicks on the Next Button
function NextButtonClickHandler()
{
    var Message = CheckForm();

    if(Message.length > 0)
    {
        alert(Message);
    }
    else
    {
        var Hours = document.getElementById("HoursTextBox").value;
        var HourlyRate = document.getElementById("HourlyPayTextBox").value;
        var MeetingDay = document.getElementById("MeetingDayTextBox").value;
        var MeetingTime = document.getElementById("MeetingTimeTextBox").value;


      //We create a scheduling object and then put in the local storate before going to the meet up address screen
        var TaskScheduling = new Object();
        TaskScheduling.Hours = "" + Hours;
        TaskScheduling.HourlyRate = "" + HourlyRate;
        TaskScheduling.MeetingDay = "" + MeetingDay;
        TaskScheduling.MeetingTime = "" + MeetingTime.toUpperCase();



        StoreDataInBrowserLocalStorage("task_scheduling", JSON.stringify(TaskScheduling));
        SlideToPage("taskmeetup.html");
    }
}










//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));
    SelectedWorker = JSON.parse(GetDataFromBrowserLocalStorage("selected_worker"));
    SelectedTask = GetDataFromBrowserLocalStorage("selected_job_type");


  //If there are task scheduling information in the local storage we then render them on the screen
    if (GetDataFromBrowserLocalStorage("task_scheduling") != null)
    {
        var CurrentTaskScheduling = JSON.parse(GetDataFromBrowserLocalStorage("task_scheduling"));

        document.getElementById("HoursTextBox").value = CurrentTaskScheduling.Hours;
        document.getElementById("HourlyPayTextBox").value = CurrentTaskScheduling.HourlyRate;
        document.getElementById("MeetingDayTextBox").value = CurrentTaskScheduling.MeetingDay;
        document.getElementById("MeetingTimeTextBox").value = CurrentTaskScheduling.MeetingTime;

        if(SelectedWorker != null)
        {
            document.getElementById("HourlyPayTextBox").setAttribute("readonly", "");
            document.getElementById("HourlyPayTextBox").style.backgroundColor = "#FFFFFF";
        }
    }
    else if (SelectedWorker != null)
    {
        document.getElementById("HourlyPayTextBox").value = "" + SelectedWorker.HourlyRate + "";
        document.getElementById("HourlyPayTextBox").setAttribute("readonly", "");
        document.getElementById("HourlyPayTextBox").style.backgroundColor = "#FFFFFF";
    }
    
}

//Checks that the member correctly filled the form
function CheckForm()
{
    var Message = "";

    var Hours = document.getElementById("HoursTextBox").value;
    var HourlyRate = document.getElementById("HourlyPayTextBox").value;
    var MeetingDay = document.getElementById("MeetingDayTextBox").value;
    var MeetingTime = document.getElementById("MeetingTimeTextBox").value.toUpperCase();


    if (Hours.length == 0)
        Message = "Please enter the number of hours you need " + SelectedWorker.FirstName + " for.";
    else if ((StringIsPositiveInteger(Hours) == false) || (StringIsPositiveInteger(Hours) == true && parseInt(Hours) <= 0))
        Message = "Please enter a positive number that is greater than zero for the number of hours";
    else if (HourlyRate.length == 0)
        Message = "Please enter the Hourly Rate you are willing to pay for this work";
    else if ((StringIsPositiveDecimalNumber(HourlyRate) == false) || (StringIsPositiveDecimalNumber(HourlyRate) == true && parseFloat(HourlyRate) < 12))
        Message = "Please enter a positive number that is greater or equal to 12 for the hourly rate you are willing to pay to " + SelectedWorker.FirstName;
    else if (MeetingDay.length == 0)
        Message = "Please enter the day at which you want " + SelectedWorker.FirstName + " to come help you with " + SelectedTask;
    else if (StringIsInSmallAmericanDateFormat(MeetingDay) == false)
        Message = "Please make sure that you enter the meeting date as follow MM/DD/YYYY (i.e. 08/10/2017)";
    else if (MeetingTime.length == 0)
        Message = "Please enter the time at which you want " + SelectedWorker.FirstName + " to come help you with " + SelectedTask;
    else if (StringIsInSmallAmericanTimeFormat(MeetingTime) == false)
        Message = "Please make sure you enter the meeting time as follow: HH:MM AM (or PM - i.e. 09:00 AM)";
    else
    {
        var Today = new Date();
        //var DateText = MeetingDay + " " + MeetingTime.replace(" ", "");
        //var MeetingDate = new Date(Set24Hours(MeetingDay + " " + MeetingTime.replace(" ", "")));


        var DateText = MeetingDay + " " + "12:00AM";
        var MeetingDate = new Date(Set24Hours(DateText));


        if(Today > MeetingDate)
        {
            Message = "Please enter a meeting date and time that is ast least today or later"; 
        }
    }


    return (Message);
}
