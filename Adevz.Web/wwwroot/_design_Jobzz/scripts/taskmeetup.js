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
    SlideToPage("taskscheduling.html");
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
        var Street = document.getElementById("StreetAddressTextBox").value;
        var City = document.getElementById("CityTextBox").value;
        var State = document.getElementById("StateTextBox").value;
        var PostalCode = document.getElementById("PostalCodeTextBox").value;
        var Country = document.getElementById("CountryTextBox").value;

        
      //We create a meetup object and then put in the local storage before going to the invoice screen
        var TaskMeetUp = new Object();
        TaskMeetUp.Street = Street;
        TaskMeetUp.City = City;
        TaskMeetUp.State = State;
        TaskMeetUp.PostalCode = PostalCode;
        TaskMeetUp.Country = Country;


        StoreDataInBrowserLocalStorage("task_meetup", JSON.stringify(TaskMeetUp)); 
        SlideToPage("invoice.html");

    }
}











//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));
    SelectedWorker = JSON.parse(GetDataFromBrowserLocalStorage("selected_worker"));
    SelectedTask = GetDataFromBrowserLocalStorage("selected_job_type");

    if(GetDataFromBrowserLocalStorage("task_meetup") != null)
    {
        var CurrentTaskMeetUp = JSON.parse(GetDataFromBrowserLocalStorage("task_meetup"));
        ShowTaskMeetUpInformation(CurrentTaskMeetUp);
    }

}

//Renders information on a given task meet up
function ShowTaskMeetUpInformation(CurrentTaskMeetUp)
{
    if(CurrentTaskMeetUp != null)
    {
        document.getElementById("StreetAddressTextBox").value = CurrentTaskMeetUp.Street;
        document.getElementById("CityTextBox").value = CurrentTaskMeetUp.City;
        document.getElementById("StateTextBox").value = CurrentTaskMeetUp.State;
        document.getElementById("PostalCodeTextBox").value = CurrentTaskMeetUp.PostalCode;
        document.getElementById("CountryTextBox").value = CurrentTaskMeetUp.Country;
    }
}

//Checks that the member correctly filled the form
function CheckForm()
{
    var Message = "";


    var Street = document.getElementById("StreetAddressTextBox").value; 
    var City = document.getElementById("CityTextBox").value;
    var State = document.getElementById("StateTextBox").value;
    var PostalCode = document.getElementById("PostalCodeTextBox").value;
    var Country = document.getElementById("CountryTextBox").value;



    if (Street.length == 0)
        Message = "Please enter the street address where you would like " + SelectedWorker.FirstName + " to meet you for the " + SelectedTask + " Work";
    else if (City.length == 0)
        Message = "Please enter the name of the city where you would like " + SelectedWorker.FirstName + " to meet you for the " + SelectedTask + " Work";
    else if (State.length == 0)
        Message = "Please enter the name of the state where you would like " + SelectedWorker.FirstName + " to meet you for the " + SelectedTask + " Work";
    else if (Country.length == 0)
        Message = "Please enter the name of the country where you would like " + SelectedWorker.FirstName + " to meet you for the " + SelectedTask + " Work";



    return (Message);
}
