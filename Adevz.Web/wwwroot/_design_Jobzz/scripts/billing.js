//Stores data on the profile of the member that is currently logged in
var MemberProfile = null;
//Stores data on the member that is currently logged in
var JobbzMember = null;
//Stores token we use to call API on behalf of member
var APIToken = "";
//Stores data on the contractor billing info
var BillingInfo = null;








//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("account.html");
}


//Handler called when the user presses keys in a text box
function KeyDownHandler(e)
{
    if (e.keyCode == 13)
    {
        ChangeBillingButtonClickHandler();
    }
}

//Handler called when member clicks on the Change Billing Button 
function ChangeBillingButtonClickHandler()
{
    var Message = CheckForm();

    if(Message.length > 0)
    {
        alert(Message);
    }
    else
    {
        var Name = document.getElementById("NameTextBox").value;
        var CardNumber = document.getElementById("CardNumberTextBox").value;
        var ExpirationDate = document.getElementById("ExpirationDateTextBox").value;
        var SecurityCode = document.getElementById("SecurityCodeTextBox").value;

        UpdateContractorBillingInfo(JobzzMember.MemberId, Name, CardNumber, ExpirationDate, SecurityCode, APIToken);
    }
}










//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));

    GetContractorBillingInfo(JobzzMember.MemberId, APIToken);
}

//Renders the Billing information of the currently logged in contractor
function ShowContractorBillingInformation(ContractorBillingInfo)
{
    if(ContractorBillingInfo != null)
    {
        document.getElementById("NameTextBox").value = ContractorBillingInfo.NameOnCreditCard;
        document.getElementById("ExpirationDateTextBox").value = ContractorBillingInfo.CreditCardExpirationDate;
        document.getElementById("SecurityCodeTextBox").value = ContractorBillingInfo.CreditCardSecurityCode;
        document.getElementById("CardNumberTextBox").setAttribute("placeholder", "****-****-****-" + ContractorBillingInfo.CreditCardNumber);
    }
}


//Checks that the member correctly filled the form
function CheckForm()
{
    var Message = "";

    var Name = document.getElementById("NameTextBox").value;
    var CardNumber = document.getElementById("CardNumberTextBox").value;
    var ExpirationDate = document.getElementById("ExpirationDateTextBox").value;
    var SecurityCode = document.getElementById("SecurityCodeTextBox").value;


    if (Name.length == 0)
        Message = "Please enter the name on the credit card";
    else if (CardNumber.length == 0)
        Message = "Please enter your credit card number";
    else if (ExpirationDate.length == 0)
        Message = "Please enter your credit card expiration date";
    else if (StringIsCreditCardExpirationDate(ExpirationDate) == false)
        Message = "Please enter your expiration date as MM/YYYY (i.e. 10/2024)";
    else if (SecurityCode.length == 0)
        Message = "Please enter the credit card security code";


    return (Message);
}








//Retrieves contractor billing information
function GetContractorBillingInfo(MemberId, APIToken)
{
    RenderLoadingAnimation(true);

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
            RenderLoadingAnimation(false);
            BillingInfo = Result;

            if (BillingInfo != null)
            {
                ShowContractorBillingInformation(BillingInfo);
            }
            else
            {
                alert("Sorry, we could not retrieve your billing information");
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

//Updates contarctor billing information
function UpdateContractorBillingInfo(MemberId,  CardHolderName,  CardNumber,  CardExpirationDate,  CardSecurityCode,  APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: ProfileServiceUrl + "UpdateContractorBillingInfo",
       type: 'POST',
       data:
       {
           MemberId: MemberId,
           CardHolderName: CardHolderName,
           CardNumber: CardNumber,
           CardExpirationDate: CardExpirationDate,
           CardSecurityCode: CardSecurityCode,
           APIToken: APIToken
       },
       dataType: 'json',
       success:
         function (Result)
         {
             RenderLoadingAnimation(false);
             var UpdatedJobzzMember = Result;

             if (UpdatedJobzzMember != null && UpdatedJobzzMember.MemberId != null && UpdatedJobzzMember.MemberId.length > 0 &&
                 UpdatedJobzzMember.MemberId != "00000000-0000-0000-0000-000000000000")
             {
                 JobbzMember = UpdatedJobzzMember;
                 StoreDataInBrowserLocalStorage("jobzz_member", JSON.stringify(JobzzMember));
                 alert("Your billing information were successfully updated");
             }
             else
             {
                 alert("Sorry, we could not update your billing information. Please make sure you have entered your credit card information correctly");
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



