//Stores Service Key
var ServiceKey = "82882d5c-4ac4-abgt-a6e8-8aaba624c424";
//Stores user current latitude
var YobbzUserCurrentLatitude = 0;
//Stores user curent longitude
var YobbzUserCurrentLongitude = 0;
//Stores Photo Element Id
var PhotoWidgetId = "";
//Stores member picture url
var JobzzMemberPicture = "";
//Stores the fix fee (in dollars) that is charged to a contractor every time they order a worker
var JobzzFees = 1;




//Stores the URL to the Authentication Service
var AuthenticationServiceUrl = "http://api.user.jobzz.pro/AuthenticationService/";
//Stores the URL to the Profile Service
var ProfileServiceUrl = "http://api.user.jobzz.pro/ProfileService/";
//Stores the URL to the Locator Service
var LocatorServiceUrl = "http://api.user.jobzz.pro/LocatorService/";
//Stores the URL of the Notification Service
var NotificationServiceUrl = "http://api.marketplace.jobzz.pro/NotificationService/";
//Stores the URL of the Work Request Service
var WorkRequestServiceUrl = "http://api.marketplace.jobzz.pro/WorkRequestService/";
//Stores the URL of the Wallet Service
var WalletServiceUrl = "http://api.user.jobzz.pro/WalletService/";
//Stores the URL of the Order Service
var OrderServiceUrl = "http://api.marketplace.jobzz.pro/OrderService/";














//Checks that a string represents a well formatted email address
function EmailAddressIsCorrectlyFormatted(elementValue)
{
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue);
}

//Checks if a string has the forllowing date format: MM/DD/YYYY
function ShortDateIsCorrectlyFormatted(DateText)
{
    var CorrectlyFormatted = false;

  //First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(DateText))
        return false;

  //Parse the date parts to integers
    var parts = DateText.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

  //Check the ranges of month and year
    if (year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

  //Check the range of the day
    return day > 0 && day <= monthLength[month - 1];

    
}

//Clears all the values stored in the local browser sorage
function ClearBrowserLocalStorage()
{
    localStorage.clear();
}

//Stores data in the browser local storage if it is supported
function StoreDataInBrowserLocalStorage(name, value)
{
    if ((typeof (Storage) !== "undefined") && (name != null) && (value != null))
    {
        localStorage.setItem(name, value);
    }
}

//Retrieves data from the browser local storage if it is supported
function GetDataFromBrowserLocalStorage(name)
{
    var Value = null;

    if ((typeof (Storage) !== "undefined") && (name != null))
    {
        Value = localStorage.getItem(name)
    }

    return (Value);
}


//This method shows the loading animation if the parameter passed has a value true and the loading panel is on the screen. 
//If the parameter is false the loading animation is removed (if it exists)
function RenderLoadingAnimation(ShowLoadingAnimation)
{
    if(document.getElementById("LoadingPanel") != null && ShowLoadingAnimation == true)
    {
        document.getElementById("LoadingPanel").setAttribute("class", "loading-mask page-content");
    }
    else if(document.getElementById("LoadingPanel") != null)
    {
        document.getElementById("LoadingPanel").setAttribute("class", "loading-mask page-content stop-loading");
    }
}

//Retrieves the user current location. The coordinates are stored in the local storage and more specifically in the following variables: current_latitude and current_longitude
function GetYobbzUserCurrentLocation()
{
  //WE GET THE CURRENT USER LATITUDE AND LONGITUDE. WE THEN SAVE THEM INTO THE LOCAL STORAGE
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition
        (
                function (position)
                {
                    StoreDataInBrowserLocalStorage("current_latitude", "" + position.coords.latitude);
                    StoreDataInBrowserLocalStorage("current_longitude", "" + position.coords.longitude);
                },
                function ()
                {
                    StoreDataInBrowserLocalStorage("current_latitude", "-1");
                    StoreDataInBrowserLocalStorage("current_longitude", "-1");
                }
       );
    }
}

//Makes a web page natively by making it Slide into View
function SlideToPage(PageName)
{
    try
    {
        //if (PageName != null && PageName.length > 0)
        //    window.plugins.nativepagetransitions.slide({ "href": PageName });

        if (PageName != null && PageName.length > 0)
            window.location = PageName;
    }
    catch(err)
    {
        if (PageName != null && PageName.length > 0)
            window.location = PageName;
    }
    
}

//Takes a photo natively on the device
function TakePhoto(PhotoId)
{
    if(PhotoId != null && PhotoId.length > 0)
    {
        PhotoWidgetId = PhotoId;

        try
        {
            navigator.camera.getPicture(TakePhotoSuccessHandler, TakePhotoErrorHandler);

            navigator.camera.getPicture
            (
               TakePhotoSuccessHandler, TakePhotoErrorHandler,
               {
                   quality: 50,
                   destinationType: Camera.DestinationType.DATA_URL
               }
            );
        }
        catch(error)
        {
            alert(error.toString());
        }

       

    }
}

//Handler called when the photo was successfully taken
function TakePhotoSuccessHandler(ImageData)
{
    PictureBytes = ImageData;
    PictureName = "memberpicture_" + GenerateGuid() + ".jpeg";
    var PhotoWidget = document.getElementById(PhotoWidgetId);
    PhotoWidget.src = "data:image/jpeg;base64," + imageData;
}

//Handler called when the photo could not be taken 
function TakePhotoErrorHandler(Message)
{
    
}

//Generates a Guid
function GenerateGuid()
{
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
    {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

//Reinitializes the web flow component
function  ReinitializeWebFlow()
{
    Webflow.require('ix').init([
        { "slug": "menu-mask", "name": "Menu Mask", "value": { "style": { "opacity": 0 }, "triggers": [{ "type": "navbar", "stepsA": [{ "display": "block" }, { "opacity": 0.7000000000000002, "transition": "opacity 500ms ease 0ms" }], "stepsB": [{ "opacity": 0, "transition": "opacity 500ms ease 0ms" }, { "display": "none" }] }] } },
        { "slug": "list-item", "name": "List Item", "value": { "style": { "opacity": 0, "x": "-26px", "y": "0px", "z": "0px" }, "triggers": [{ "type": "scroll", "stepsA": [{ "opacity": 1, "transition": "transform 500ms ease-out-quint 0ms, opacity 500ms ease-out-quint 0ms", "x": "0px", "y": "0px", "z": "0px" }], "stepsB": [] }] } },
        { "slug": "search-box", "name": "Search Box", "value": { "style": {}, "triggers": [{ "type": "click", "selector": ".body", "stepsA": [{ "transition": "transform 500ms ease-out-quint 0ms", "x": "0px", "y": "0px", "z": "0px" }], "stepsB": [{ "transition": "transform 500ms ease-out-quint 0ms", "x": "0px", "y": "-69px", "z": "0px" }] }, { "type": "click", "selector": ".news-mask", "stepsA": [{ "display": "block" }, { "opacity": 1, "transition": "opacity 500ms ease-out-quint 0ms" }], "stepsB": [{ "opacity": 0, "transition": "opacity 500ms ease-out-quint 0ms" }, { "display": "none" }] }] } },
        { "slug": "hide-navbar-icons", "name": "Hide Navbar Icons", "value": { "style": {}, "triggers": [{ "type": "navbar", "selector": ".navbar-button", "stepsA": [{ "opacity": 0, "transition": "opacity 200ms ease 0ms" }], "stepsB": [{ "wait": 200 }, { "opacity": 1, "transition": "opacity 500ms ease 0ms" }] }] } }
    ]);
}

//This method takes a string that has teh following format "MM/DD/YYYY HH:MM AM (PM)" and converts into a 24 hours format thant can then be used to create a vaid Javascript Date object
function Set24Hours(d)
{

    if (d.slice(-2) === "PM")
    {
        var hrs = parseInt(d.slice(-7, -5))
        var mins = d.slice(-4, -2)
        hrs = hrs + 12
        var dd = d.slice(0, 9) + " " + hrs + ":" + mins;
       
        return dd;
    } else if (d.slice(-2) === "AM")
    {
        return (d.slice(0, 16));
    } else
    {
        alert("You have entered an invalid date. Please try again");
        throw ("UNRECOGNIZED_FORMAT", "set24Hrs() Received Unrecognized Formatted String");
    }
}





















//Checks if a Character is a decimal digit
function StringIsDecimalDigit(Character)
{

    var IsDigit = false;

    if ((Character != null) && (Character.length == 1))
    {

        switch (Character)
        {

            case "0":
                IsDigit = true;
                break;
            case "1":
                IsDigit = true;
                break;
            case "2":
                IsDigit = true;
                break;
            case "3":
                IsDigit = true;
                break;
            case "4":
                IsDigit = true;
                break;
            case "5":
                IsDigit = true;
                break;
            case "6":
                IsDigit = true;
                break;
            case "7":
                IsDigit = true;
                break;
            case "8":
                IsDigit = true;
                break;
            case "9":
                IsDigit = true;
                break;

        }//switch(Character)

    }//if((Character!=null)&&(Character.length==1))

    return (IsDigit);

}

//Checks if a string is a positive decimal number
function StringIsPositiveDecimalNumber(DecimalText)
{
    var IsDecimal = false;

    if ((DecimalText != null) && (DecimalText.length > 0))
    {

        var Tokens = DecimalText.split(".");


        if ((Tokens != null) && (Tokens.length == 1) && (StringIsPositiveInteger(Tokens[0]) == true))
        {
            IsDecimal = true;
        }//if((Tokens!=null)&&(Tokens.length==1)&&(StringIsPositiveInteger(Tokens[0])==true))
        else if ((Tokens != null) && (Tokens.length == 2) && (StringIsPositiveInteger(Tokens[1]) == true) &&
                (StringIsPositiveInteger(Tokens[1]) == true))
        {
            IsDecimal = true;
        }//else if(...)


    }//if((DecimalText!=null)&&(DecimalText.length>0))

    return (IsDecimal);
}


//Checks if a string is a positive integer
function StringIsPositiveInteger(IntegerText)
{

    var IsInteger = true;


    if ((IntegerText != null) && (IntegerText.length > 0))
    {

        var i = 0;
        var CurrentCharacter = null;


        for (i; i < IntegerText.length; i++)
        {
            CurrentCharacter = IntegerText[i];

            if (StringIsDecimalDigit(CurrentCharacter) == false)
            {

                IsInteger = false;
                break;

            }//if(StringIsDecimalDigit(CurrentCharacter)==false)


        }//for(i;i<IntegerText.length;i++)

    }//if((IntegerText!=null)&&(IntegerText.length>0))


    return (IsInteger);



}

//Checks if a string represents a valid date. The expected format is mm/dd/yyyy
function StringIsValidDate(DateText)
{
    var Valid = false;
    var DateTextTokens = DateText.split('/');


    if ((DateTextTokens != null) && (DateTextTokens.length >= 3))
    {

        var Month = parseInt(DateTextTokens[0]);
        var Day = parseInt(DateTextTokens[1]);
        var Year = parseInt(DateTextTokens[2]);


        var FullYear = '' + Day + '/' + Month + '/' + Year;
        Valid = IsValidDate(FullYear);


    }//if((DateTextTokens!=null)&&(DateTextTokens.length>=3))

    return (Valid);
}

//Checks if a string with the form dd/mm/yyyy is a valid date
function IsValidDate(s)
{
    var bits = s.split('/');
    var d = new Date(bits[2], bits[1] - 1, bits[0]);
    return d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]);
}

//Checks if a text represent a valid time written in the American Format (i.e. 10:00 AM)
function StringIsInSmallAmericanTimeFormat(TimeText)
{

    var IsTime = false;


    if ((TimeText != null) && (TimeText.length > 0))
    {

        var FirstTokens = TimeText.split(" ");

        if (
                (FirstTokens != null) && (FirstTokens.length == 2) &&
                ((FirstTokens[1].toLowerCase() == 'am') || (FirstTokens[1].toLowerCase() == 'pm'))
          ) {

            var TimeText = FirstTokens[0];
            var SecondTokens = TimeText.split(":");


            if (
                  (SecondTokens != null) && (SecondTokens.length == 2) &&
                  (StringIsPositiveInteger(SecondTokens[0]) == true) && (StringIsPositiveInteger(SecondTokens[1]) == true)
              )
            {

                IsTime = true;

            }//if(...)


        }//if(...)


    } //if ((TimeText != null) && (TimeText.length > 0))


    return (IsTime);

}

//Checks if a text represents a valid date written in the American Format
function StringIsInSmallAmericanDateFormat(DateText)
{

    var IsDate = false;

    if ((DateText != null) && (DateText.length > 0))
    {

        var DateTextTokens = DateText.split("/");

        if ((DateTextTokens != null) && (DateTextTokens.length >= 3))
        {

            var MonthText = DateTextTokens[0];
            var DayText = DateTextTokens[1];
            var YearText = DateTextTokens[2];


            if
                    (
                    (StringIsPositiveInteger(MonthText) == true) &&
                    (StringIsPositiveInteger(DayText) == true) &&
                    (StringIsPositiveInteger(YearText) == true)
            )
            {

                IsDate = true;

            }//if(...)


        }//if((DateTextTokens!=null)&&(DateTextTokens.length>=2))

    }//if((DateText!=null)&&(DateText.length>0))


    return (IsDate);

}

//Checks if a text represents a credit card expiration date
function StringIsCreditCardExpirationDate(DateText)
{

    var IsDate = false;



    if ((DateText != null) && (DateText.length > 0))
    {

        var DateTextTokens = DateText.split("/");


        if ((DateTextTokens != null) && (DateTextTokens.length >= 2))
        {
            var MonthText = DateTextTokens[0];
            var YearText = DateTextTokens[1];

            if
                    (
                    (MonthText.length == 2) && (StringIsPositiveInteger(MonthText) == true) &&
                    (YearText.length == 4) && (StringIsPositiveInteger(YearText) == true)
            )
            {

                IsDate = true;

            }//if(...)

        }//if((DateTextTokens!=null)&&(DateTextTokens.length>=2))

    }//if((DateText!=null)&&(DateText.length>0))


    return (IsDate);

}




