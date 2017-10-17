//Stores data on the profile of the member that is currently logged in
var MemberProfile = null;
//Stores data on the member that is currently logged in
var JobbzMember = null;
//Stores token we use to call API on behalf of member
var APIToken = "";
//Stores data on contractor financial information
var ContractorWallet = null;









//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("account.html");
}

//Handler called when the member clicks on the cash out button
function AddMoneyButtonClickHandler()
{
    var AmountIsValid = false;

    //If the contractor has a credit card in his (her) wallet, we ask him (her) for the amount he (she) wishes to add into his (her) account.
    //Otherwise we suggest to the member that he (she) adds a credit card first
    if (ContractorWallet.HasCreditCard == true)
    {
        while (AmountIsValid == false)
        {
            var AmountText = prompt("Please enter the amount you wish to add into your account");

            if (AmountText != null && AmountText.length > 0)
            {
                AmountIsValid = StringIsPositiveDecimalNumber(AmountText);

                if (AmountIsValid == false)
                    alert("The text you have entered is not a valid amount. Please enter a positive number for the amount to add into your wallet");
            }
            else
            {
                AmountIsValid = true;
            }

        }

        if(AmountIsValid == true && AmountText != null && AmountText.length > 0)
        {
            var Amount = parseFloat(AmountText);
            AddMoneyToContractorWallet(JobzzMember.MemberId, Amount, APIToken);
        }
    }
    else
    {
        if(confirm("Sorry, you do not have any credit card on file. Would you like to add one ?") == true)
        {
            SlideToPage("billing.html");
        }
    }
   
    


}













//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));

    var SpaceLeftHeight = ($(window).height() - 110 - 240) / (2);
    document.getElementById("SeparatorPanel").setAttribute("style", "height:" + SpaceLeftHeight + "px;display:block");

    GetContractorWallet(JobzzMember.MemberId, APIToken);
}

//Renders the contractor wallet data on the screen
function ShowContractorWallet(Wallet)
{
    if(Wallet != null)
    {
        document.getElementById("AccountBalanceButton").value = "Balance: $" + Wallet.AccountBalance;
        document.getElementById("TotalTipsGivenButton").value = "Tips Given: $" + Wallet.TotalTipsGiven;
        document.getElementById("TotalAmountSpentButton").value = "Total Spent: $" + Wallet.TotalAmountSpent;
    }
}











//Adds a given amount of money to the contractor wallet
function AddMoneyToContractorWallet(MemberId, Amount, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: WalletServiceUrl + "AddMoneyToContractorWallet",
       type: 'POST',
       data:
       {
           MemberId: MemberId,
           Amount: Amount,
           APIToken: APIToken
       },
       dataType: 'json',
       success:
         function (Result)
         {
             RenderLoadingAnimation(false);
             var MoneyAdded = Result.MoneyAdded;

             if (MoneyAdded == true)
             {
                 ContractorWallet.AccountBalance = ContractorWallet.AccountBalance + Amount;
                 alert("Hey " + JobzzMember.FirstName + " we have successfully added $" + Amount + " to your wallet");

                 ShowContractorWallet(ContractorWallet);
             }
             else
             {
                 alert("Sorry, we could not add money into your wallet");
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

//Retrieves financial information on the contractor
function GetContractorWallet(MemberId, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: ProfileServiceUrl + "GetContractorWallet",
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
               ContractorWallet = Result;

               if (ContractorWallet != null && ContractorWallet.MemberId != null && ContractorWallet.MemberId.length > 0)
               {
                   ShowContractorWallet(ContractorWallet);
               }
               else
               {
                   alert("Sorry, we could not retrieve your wallet");
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