//Stores data on the member that is currently logged in
var JobzzMember = null;
//Stores member API Token
var APIToken = "";
//Stores data on the contractor Jobs History
var JobsHistory = null;










//Handler called when member clicks on the Back Button
function BackButtonClickHandler()
{
    SlideToPage("account.html");
}

//Handler called when the user taps on an item in one of the jobs list
function JobButtonClickHandler(JobIndex, JobsStatus)
{
    var SelectedJob = null;

    switch(JobsStatus.toLowerCase())
    {
        case "booked":
            SelectedJob = JobsHistory.BookedJobs[JobIndex];
            break;
        case "open":
            SelectedJob = JobsHistory.OpenJobs[JobIndex];
            break;
        case "completed":
            SelectedJob = JobsHistory.CompletedJobs[JobIndex];
            break;
        case "cancelled":
            SelectedJob = JobsHistory.CancelledJobs[JobIndex];
            break;
    }


    alert("Show Details For Job With ID: " + SelectedJob.WorkRequestId);
}









//Sets attributes and widgets to their initial state
function SetUp()
{
    APIToken = GetDataFromBrowserLocalStorage("jobbz_member_api_token");
    JobzzMember = JSON.parse(GetDataFromBrowserLocalStorage("jobzz_member"));

    GetContractorJobsHistory(JobzzMember.MemberId, APIToken);
}

//Renders the contractor jobs history on the screen
function ShowContractorJobsHistory(JosbHistory)
{
    var HTML = "";

    
    if (JobsHistory != null && JobsHistory.TotalJobsCount > 0)
    {

        if(JobsHistory.BookedJobs != null && JobsHistory.BookedJobs.length > 0)
        {
            document.getElementById("BookedJobsButton").style.display = "block";
            document.getElementById("BookedJobsPanel").style.display = "block";

            ShowJobs(JobsHistory.BookedJobs, "booked", "BookedJobsPanel");
        }
        else
        {
            document.getElementById("BookedJobsButton").style.display = "none";
            document.getElementById("BookedJobsPanel").style.display = "none";
        }




        if (JobsHistory.OpenJobs != null && JobsHistory.OpenJobs.length > 0)
        {
            document.getElementById("OpenJobsButton").style.display = "block";
            document.getElementById("OpenJobsPanel").style.display = "block";

            ShowJobs(JobsHistory.OpenJobs, "open", "OpenJobsPanel");
        }
        else
        {
            document.getElementById("OpenJobsButton").style.display = "none";
            document.getElementById("OpenJobsPanel").style.display = "none";
        }




        if (JobsHistory.CompletedJobs != null && JobsHistory.CompletedJobs.length > 0)
        {
            document.getElementById("CompletedJobsButton").style.display = "block";
            document.getElementById("CompletedJobsPanel").style.display = "block";

            ShowJobs(JobsHistory.CompletedJobs, "completed", "CompletedJobsPanel");
        }
        else
        {
            document.getElementById("CompletedJobsButton").style.display = "none";
            document.getElementById("CompletedJobsPanel").style.display = "none";
        }





        if (JobsHistory.CancelledJobs != null && JobsHistory.CancelledJobs.length > 0)
        {
            document.getElementById("CancelledJobsButton").style.display = "block";
            document.getElementById("CancelledJobsPanel").style.display = "block";

            ShowJobs(JobsHistory.CancelledJobs, "cancelled", "CancelledJobsPanel");
        }
        else
        {
            document.getElementById("CancelledJobsButton").style.display = "none";
            document.getElementById("CancelledJobsPanel").style.display = "none";
        }
    }
    else
    {
      //If there are no jobs history we display the defaul "No Jobs Yet" message and hide the Jobs History Panel
        document.getElementById("NoJobsPanel").style.display = "block";
        document.getElementById("JobHistoryPanel").style.display = "none";



      //We hide the Jobs Panel
        document.getElementById("BookedJobsButton").style.display = "none";
        document.getElementById("BookedJobsPanel").style.display = "none";

        document.getElementById("OpenJobsButton").style.display = "none";
        document.getElementById("OpenJobsPanel").style.display = "none";

        document.getElementById("CompletedJobsButton").style.display = "none";
        document.getElementById("CompletedJobsPanel").style.display = "none";

        document.getElementById("CancelledJobsButton").style.display = "none";
        document.getElementById("CancelledJobsPanel").style.display = "none";
    }



    ReinitializeWebFlow(); //See common.js for function definition
}

//We render a list of jobs in a given panel
function ShowJobs(Jobs, JobsStatus, PanelId)
{

    if(Jobs != null && JobsStatus != null && PanelId != null && document.getElementById(PanelId) != null)
    {
        var i = 0;
        var HTML = "";
        var DaysText = "";
        var CurrentJob = null;
        var JobPrice = 0;
        var JobTypePictureUrl = "images/job.png";
        var WorkerPictureUrl = "images/jobbslogo.png";
        var WorkerImageTag = "";
        var WorkerName = "";



        if (Jobs.length > 0 && JobsStatus.length > 0)
        {
            JobsStatus = JobsStatus.toLowerCase();

            for (i; i < Jobs.length; i++)
            {
                CurrentJob = Jobs[i];
                JobTypePictureUrl = "images/job.png"
                WorkerPictureUrl = "images/jobzzlogo.png";
                JobPrice = CurrentJob.HourlyRate * CurrentJob.HoursCount;


                if (CurrentJob.WorkerPictureUrl != null && CurrentJob.WorkerPictureUrl.length > 0)
                    WorkerPictureUrl = CurrentJob.WorkerPictureUrl;


                if (JobsStatus != "open")
                    WorkerImageTag = '<img style="width:25px; height:25px; border-radius: 25px;" src="' + WorkerPictureUrl + '">';
                else
                    WorkerImageTag = '<img style="width:25px; height:25px; border-radius: 25px;" src="' + WorkerPictureUrl + '">';



                if (CurrentJob.DaysAway >= 0)
                    DaysText = "" + CurrentJob.DaysAway + " Days Away";
                else
                    DaysText = "" + CurrentJob.DaysAway + " Days Ago";


                if (CurrentJob.WorkerName != null && CurrentJob.WorkerName.length > 0)
                    WorkerName = CurrentJob.WorkerName;
                else
                    WorkerName = "No Worker Yet";



                switch (CurrentJob.JobType.toLowerCase())
                {
                    case "construction":
                        JobTypePictureUrl = "images/job.png"
                        break;
                    case "farming":
                        JobTypePictureUrl = "images/farming.png"
                        break;
                    case "landscaping":
                        JobTypePictureUrl = "images/landscaping.png"
                        break;
                }



                HTML = HTML +

                       '<li class="list-message" data-ix="list-item">' +
                       '<a class="w-clearfix w-inline-block" data-load="1" href="#" onclick="JobButtonClickHandler(' + i + ',' + '\'' + JobsStatus + '\'' + ')">' +
                       '<div style="width:130px !important;height:20px !important;color:#FDC603 !important; font-family:AvenirNextLTW01BoldRegular !important;float:right;">' +
                       '<center> ' + JobsStatus + ' </center>' +
                       '<center style="margin-top:5px !important;"><span style="font-family:AvenirNextLTW01BoldRegular !important;color:#000000 !important;font-size:16px !important;">' +
                        '$' + JobPrice + '</span></center>' +
                       '</div>' +
                       '<div class="column-left w-clearfix">' +
                       '<div class="image-message">' +
                       '<img src="' + JobTypePictureUrl + '">' +
                       '</div>' +
                       '</div>' +
                       '<div class="column-right">' +
                       '<div class="message-title">' + CurrentJob.JobType + '</div>' +
                       '<div class="message-text">' +
                       WorkerImageTag +
                       WorkerName +
                      '</div>' +
                      '</div>' +
                      '<div style="width:130px !important;height:20px !important;background-color:#000000 !important;color:#FDC603 !important; font-family:AvenirNextLTW01BoldRegular !important;float:right;">' +
                      '<center> ' + DaysText + '</center>' +
                      '</div>' +
                      '</a>' +
                      '</li>'

                ;

            }
        }

        document.getElementById(PanelId).innerHTML = HTML;
    }
}








//Retrieves data on the contractor Jobs History
function GetContractorJobsHistory(ContractorId, APIToken)
{
    RenderLoadingAnimation(true);

    $.ajax
   ({
       url: WorkRequestServiceUrl + "GetContractorJobsHistory",
       type: 'POST',
       data:
       {
           ContractorId: ContractorId,
           APIToken: APIToken
       },
       dataType: 'json',
       success:
         function (Result)
         {
             RenderLoadingAnimation(false);
             JobsHistory = Result;

             ShowContractorJobsHistory(JobsHistory);
         },
       error:
         function (xhr, msg)
         {
             RenderLoadingAnimation(false);
             alert("Sorry, an error has occured on our servers");
         }
   });
}

