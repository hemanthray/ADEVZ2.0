//Stores the type of job that the contractor selected
var SelectedJobType = "";






//Handler called when the user clicks on the back button
function BackButtonClickHandler()
{
    SlideToPage("rolemenu.html");
}

//Handler called when the user clicks on the construction button
function ConstructionButtonClickHandler()
{
    SelectedJobType = "construction";
    StoreDataInBrowserLocalStorage("selected_job_type", SelectedJobType);
    SlideToPage("workersnearby.html");
}

//Handler called when the user clicks on the Farm Work Button
function FarmWorkButtonClickHandler()
{
    SelectedJobType = "farming";
    StoreDataInBrowserLocalStorage("selected_job_type", SelectedJobType);
    SlideToPage("workersnearby.html");
}

//Handler called when the user clicks on the Landscaping button
function LandscapingButtonClickHandler()
{
    SelectedJobType = "landscaping";
    StoreDataInBrowserLocalStorage("selected_job_type", SelectedJobType);
    SlideToPage("workersnearby.html");
}







//Sets attributes and widgets to their initial state
function SetUp()
{
   //Setting up the buttons height
    var ButtonHeight = ($(window).height() - 40) / 3;

    document.getElementById("ConstructionPanel").setAttribute("style", "width:100% !important;height:" + ButtonHeight + "px !important");
    document.getElementById("FarmWorkPanel").setAttribute("style", "width:100% !important;height:" + ButtonHeight + "px !important");
    document.getElementById("LandscapingPanel").setAttribute("style", "width:100% !important;height:" + ButtonHeight + "px !important");
}