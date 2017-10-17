// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";


  //We set the copyright message based on the current year
    if (document.getElementById("CopyRightPanel") != null)
    {
        var CurrentYear = new Date().getFullYear();
        document.getElementById("CopyRightPanel").innerHTML = "© Copyright " + CurrentYear + " Tech Finity"
    }


    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady()
    {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');



      
       


       //OVERRIDING THE JAVASCRIPT ALERTS WITH NATIVE DIALOG -- ADDED BY CHRISTIAN RIKONG
        if (navigator.notification)
        { 
            window.alert = function (message)
            {
                navigator.notification.alert
                (
                    message,    // message
                    null,       // callback
                    "Jobzz",    // title
                    'OK'        // buttonName
                );
            };
        }



  


     //SETTING UP NATIVE PAGE TRANSITIONS PARAMETERS GLOBALLY ONCE SO THAT WE DON'T HAVE TO EACH TIME
        window.plugins.nativepagetransitions.globalOptions.duration = 700;
        window.plugins.nativepagetransitions.globalOptions.iosdelay = 100;
        window.plugins.nativepagetransitions.globalOptions.androiddelay = 150;
        window.plugins.nativepagetransitions.globalOptions.winphonedelay = 175;
        window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 8;
        // these are used for slide left/right only currently
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 64;
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 48;


      



    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

