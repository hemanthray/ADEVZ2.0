








//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("workersnearby.html");
}

//Handler called when the user clicks on the Profile Button
function ProfileButtonClickHandler()
{
    SlideToPage("profile.html");
}

//Handler called when the user clicks on the Job History Button
function JobHistoryButtonClickHandler()
{
    SlideToPage("jobhistory.html");
}


//Handler called when member clicks on the Billing Button
function BillingButtonClickHandler()
{
    SlideToPage("billing.html");
}

//Handler called when member clicks on the Wallet Button
function WalletButtonClickHandler()
{
    SlideToPage("wallet.html");
}









//Sets attributes and widgets to their initial state
function SetUp()
{
    var MenuPanelYCoordinates = (($(window).height() - document.getElementById("MenuPanel").clientHeight) / (2)) - 30;
    document.getElementById("MenuPanel").setAttribute("style", "margin-top:" + MenuPanelYCoordinates + "px !important;");
}