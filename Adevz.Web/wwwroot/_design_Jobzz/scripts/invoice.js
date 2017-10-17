//Stores data on the member that is currently logged in
var JobzzMember = null;
//Stores token we use to call API on behalf of member
var APIToken = "";
//Stores data on the worker that the contractor selected (if any)
var SelectedWorker = null;
//Stores the name of the task that the contarctor needs help with
var SelectedTask = "";
//Stores the scheduling information regarding this task
var TaskScheduling = null;
//Stores the meet up (address, city, etc) information regrading this task
var TaskMeetUp = null;
//Stores the contractor billing information
var ContractorBilling = null;









//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("taskmeetup.html");
}

//Handler called when member clicks on the complete button
function CompleteButtonClickHandler()
{
    OrderWorkerForTask(JobzzMember.MemberId, SelectedWorker.WorkerId, SelectedWorker.EmailAddress, SelectedWorker.MobilePhoneNumber, JobzzMember.FirstName + " " + JobzzMember.LastName,
     SelectedWorker.FirstName + " " + SelectedWorker.LastName, JobzzMember.PictureUrl, SelectedWorker.PictureUrl, SelectedTask, parseFloat(TaskScheduling.HourlyRate),
     parseInt(TaskScheduling.Hours), JobzzFees, TaskScheduling.MeetingDay, TaskScheduling.MeetingTime, TaskMeetUp.Street, TaskMeetUp.City, TaskMeetUp.State, TaskMeetUp.Country,
     TaskMeetUp.PostalCode, APIToken);
}










//Sets attributes and widgets to ther initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));
    SelectedWorker = JSON.parse(GetDataFromBrowserLocalStorage("selected_worker"));
    SelectedTask = GetDataFromBrowserLocalStorage("selected_job_type");
    TaskScheduling = JSON.parse(GetDataFromBrowserLocalStorage("task_scheduling"));
    TaskMeetUp = JSON.parse(GetDataFromBrowserLocalStorage("task_meetup"));


    GetContractorBillingInfo(JobzzMember.MemberId, APIToken);
}

//Renders information on the task that the contractor is ordering
function ShowTaskInformation(TaskScheduling, TaskMeetUp, ContractorBilling)
{
    if(TaskScheduling != null && TaskMeetUp != null && ContractorBilling != null)
    {
        document.getElementById("AddressFirstLineButton").value = TaskMeetUp.Street;
        document.getElementById("AddressSecondLineButton").value = TaskMeetUp.City + " " + TaskMeetUp.State + " " + TaskMeetUp.PostalCode + " " + TaskMeetUp.Country;
        document.getElementById("MeetingTimeButton").value = TaskScheduling.MeetingDay + " " + TaskScheduling.MeetingTime;
        document.getElementById("PaymentMethodButton").value = "****-****-" + ContractorBilling.CreditCardNumber;
        document.getElementById("FeesButton").value = "" + TaskScheduling.Hours + " hours * $" + TaskScheduling.HourlyRate + " + " + "$" + JobzzFees;
        document.getElementById("TotalFeesButton").value = parseInt("" + TaskScheduling.Hours) * parseInt("" + TaskScheduling.HourlyRate) + JobzzFees
    }
    
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
            ContractorBilling = Result;

            if (ContractorBilling != null)
            {
                ShowTaskInformation(TaskScheduling, TaskMeetUp, ContractorBilling);
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

//Order a specific worker for a task
function OrderWorkerForTask(ContractorId, WorkerId, WorkerEmailAddress, WorkerMobilePhone, ContractorName,
     WorkerName, ContractorPictureUrl, WorkerPictureUrl, JobType, HourlyRate, HoursRequestedCount, JobzzFees,
     MeetUpDay, MeetUpTime, MeetUpStreet, MeetUpCity, MeetUpState, MeetUpCountry, MeetUpPostalCode, APIToken)
{

    RenderLoadingAnimation(true);

    $.ajax
 ({
     //url: 'http://api.marketplace.jobzz.pro/OrderService/OrderWorkerForTask',
     url: OrderServiceUrl + "OrderWorkerForTask",
     type: 'POST',
     data:
     {
         ContractorId: ContractorId,
         WorkerId: WorkerId,
         WorkerEmailAddress: WorkerEmailAddress,
         WorkerMobilePhone: WorkerMobilePhone,
         ContractorName: ContractorName,

         WorkerName: WorkerName,
         ContractorPictureUrl: ContractorPictureUrl,
         WorkerPictureUrl: WorkerPictureUrl,
         JobType: JobType,
         HourlyRate: HourlyRate,


         HoursRequestedCount: HoursRequestedCount,
         JobzzFees: JobzzFees,
         MeetUpDay: MeetUpDay,
         MeetUpTime: MeetUpTime,
         MeetUpStreet: MeetUpStreet,


         MeetUpCity: MeetUpCity,
         MeetUpState: MeetUpState,
         MeetUpCountry: MeetUpCountry,
         MeetUpPostalCode: MeetUpPostalCode,



         APIToken: APIToken
     },
     dataType: 'json',
     success:
         function (Result)
         {
             RenderLoadingAnimation(false);

             if (Result.OrderId != null && Result.OrderId.length > 0 && Result.OrderId != "00000000-0000-0000-0000-000000000000")
             {
                 alert(JobzzMember.FirstName + " Thank you for placing your order. We have notified " + SelectedWorker.FirstName + ". Please remember that you are responsible for paying " +
                     "$" + (parseInt("" + TaskScheduling.Hours) * parseInt("" + TaskScheduling.HourlyRate)) + " to " + SelectedWorker.FirstName + " after he (she) completes the work");

                 SlideToPage("jobhistory.html"); 
             }
             else
             {
                 alert("Sorry, we could not complete your order. Please make sure you have enough credits in your Jobzz account or that you have enough money in your credit card");
             }
             
         },
     error:
         function (xhr, msg)
         {
             RenderLoadingAnimation(false);
             alert("An error occured when calling the service");
         },
 });
}
