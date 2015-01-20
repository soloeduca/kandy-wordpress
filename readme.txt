=== Kandy ===
Contributors: kodeplusdev
Tags: Kandy
Requires at least: 1.0
Tested up to: 1.4
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Kandy Plugin is a full-service cloud platform that enables real-time communications for business applications.

== Description ==
Kandy Plugin is a full-service cloud platform that enables real-time communications for business applications.

Home page: http://www.kandy.io/

<strong>Key Features</strong>

KANDY makes use of a variety of Internet technology and for the most part you won't have to be concerned with HOW KANDY manages this and can focus solely on WHAT you're trying to accomplish. However, it's helpful to understand some of the principles of how KANDY works.

* KANDY, of course, makes extensive usage of HTTP/HTTPS on ports 80/443 for much of it's communications between your clients/servers and the KANDY systems.
* Transactions with real-time media such as video and/or voice utilize the emerging standard of WebRTC. The KANDY libraries/SDKs manage all of the WebRTC transactions, so the developer can remain focused on the application. WebRTC is supported by Google's Chrome, Mozilla Firefox and Opera. Microsoft's Internet Explorer does not support WebRTC and KANDY will shortly be providing a plug-in module to provide WebRTC support within IE.
* For some transactions (like instant messaging) and state information (presence), KANDY utilizes WebSockets or Long Polling depending upon the browser specifics. The KANDY JavaScript library creates these connections depending on your application regarding and will manage these without any requirement from your application.

<strong>Documentation</strong>

- Create new page with kandy shortcode syntax:

    + Kandy Video Call Button
        [kandyVideoButton
            class = "myButtonStype"
            id = "my-video-button"
            incomingLabel = 'Incoming Call...'
            incomingButtonText = 'Answer'
            callOutLabel = 'User to call'
            callOutButtonText = 'Call'
            callingLabel = 'Calling...'
            callingButtonText = 'End Call'
            onCallLabel = 'You are connected!'
            onCallButtonText = 'End Call']
        [/kandyVideoButton]

    + Kandy Voice Call Button
        [kandyVoiceButton
            class = "myButtonStype"
            id = "my-voice-button"
            incomingLabel = 'Incoming Call...'
            incomingButtonText = 'Answer'
            callOutLabel = 'User to call'
            callOutButtonText = 'Call'
            callingLabel = 'Calling...'
            callingButtonText = 'End Call'
            onCallLabel = 'You are connected!'
            onCallButtonText = 'End Call']
        [/kandyVoiceButton]

    + Kandy Video
        [kandyVideo
            title = "Me"
            id = "myVideo"
            style = "width: 300px; height: 225px;background-color: darkslategray;"]
        [/kandyVideo]

    + Kandy Status
        [kandyStatus
            class = "myStatusStyle"
            id = "myStatus"
            title = "My Status"
            style = "..."]
        [/kandyStatus]

    + Kandy Address Book
        [kandyAddressBook
            class = "myAddressBookStyle"
            id = "myContact"
            title = "My Contact"
            userLabel = "User"
            searchLabel = "Search"
            searchResultLabel = "Directory Search Results"
            style = "..."
            ]
        [/kandyAddressBook]

    + Kandy Chat
        [kandyChat
            class = "myChatStyle"
            id = "my-chat"
            contactLabel = "Contacts"]
        [/kandyChat]



    - Example:

    + Kandy Voice Call

        [kandyVoiceButton class= "myButtonStyle" id ="my-voice-button"][/kandyVoiceButton]


    + Kandy Video Call

       [kandyVideoButton class="myButtonStype"][/kandyVideoButton]
       [kandyVideo title="Me" id="myVideo" style = "width: 300px; height: 225px;background-color: darkslategray;"] [/kandyVideo]
       [kandyVideo title="Their"  id="theirVideo" style = "width: 300px; height: 225px;background-color: darkslategray;"][/kandyVideo]

    + Kandy Presence

        [kandyStatus class="myStatusStype" id="myStatus"][/kandyStatus]
        [kandyAddressBook class="myAddressBookStyle" id="myContact"][/kandyAddressBook]


    + Kandy Chat

        [kandyChat class="myChatStyle" id ="my-chat"][/kandyChat]

==========================================================================================

KANDY ADMINISTRATION
+Settings


+ User assignment:

Click KANDY USER ASSIGNMENT to sync kandy user for your application
Select user and click edit button to assign kandy user

+ Style customization
Click KANDY STYLE CUSTOMIZATION to edit kandy shortcode(video, voice, chat...) style
Select appropriate file then click edit

+ Script customization

Click KANDY SCRIPT CUSTOMIZATION to edit kandy shortcode(video, voice, chat...) script
Select appropriate file then click edit
All support callback:
window.loginsuccess_callback = function () {
   //do something when you login successfully
}
window.loginfailed_callback = function () {
    //do something when you login fail
}
window.callincoming_callback = function (call, isAnonymous) {
    //do something when your are calling
}
window.oncall_callback = function (call) {
    //do something when you are oncall
}
window.callanswered_callback = function (call, isAnonymous) {
    //do something when someone answer your call
}

window.callended_callback = function () {
   //do something when someone end  your call
}

window.answerVoiceCall_callback = function (stage) {


    //do something when you answer voice call


}

window.answerVideoCall_callback = function (stage) {
    //do something when you answer video call
}
window.makeCall_callback = function (stage) {
   //do something when you make call
}


window.endCall_callback = function (stage) {
   //do something when you click end call button
}

window.remotevideoinitialized_callack(videoTag){

   //do something with your remote video

}

window.localvideoinitialized_callback = function(videoTag){
    //do some thing with your local video
}

window.presencenotification_callack = function() {
    //do something with status notification

}

<strong>Troubleshooting</strong>

* Please include a description of the problem, a link to your site demonstrating the issue, and the host you're using.
* Please do not write a one star review when you encounter a problem with this plugin. <a href="http://www.longtailvideo.com/support/forums/addons/working-with-wordpress">Contact us</a> instead and we will try to help you</a>.
* Keep an eye on this site's <em>Changelog</em> section if you're looking for a specific bugfix of feature enhancement for the plugin.


== Installation ==

HOW TO INSTALL :

    + Install and enable shortcode module https://www.drupal.org/project/shortcode
    + Enable shortcode filter at Configuration > Content Authoring > Text Formats
    + Uncheck auto "Convert line breaks into HTML" . A good point when you  add new text format Configuration > Content Authoring > Text Formats > Add text format (kandy)
    + Configure kandy options at Configuration > Content Authoring > kandy


