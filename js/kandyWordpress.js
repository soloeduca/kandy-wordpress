/**
 * KANDY SETUP AND LISTENER CALLBACK.
 */

setup = function () {
    // initialize KandyAPI.Phone, passing a config JSON object that contains listeners (event callbacks)
    KandyAPI.Phone.setup({
        allowAutoLogin: true,
        // respond to Kandy events...
        listeners: {
            media: function(event) {
                switch (event.type) {
                    case KandyAPI.Phone.MediaErrors.WRONG_VERSION:
                        alert("Media Plugin Version Not Supported");
                        break;
                    case KandyAPI.Phone.MediaErrors.NEW_VERSION_WARNING:
                        promptPluginDownload(event.urlWin32bit, event.urlWin64bit, event.urlMacUnix);
                        break;
                    case KandyAPI.Phone.MediaErrors.NOT_INITIALIZED:
                        alert("Media couldn't be initialized");
                        break;
                    case KandyAPI.Phone.MediaErrors.NOT_FOUND:
                        // YOUR CODE GOES HERE
                        break;
                }

            },
            loginsuccess: kandy_login_success_callback,
            loginfailed: kandy_login_failed_callback,
            callincoming: kandy_incoming_call_callback,
            oncall: kandy_on_call_callback,
            callanswered: kandy_call_answered_callback,
            callended: kandy_call_ended_callback,
            localvideoinitialized: kandy_local_video_initialized_callback,
            remotevideoinitialized: kandy_remote_video_initialized_callback,
            presencenotification: kandy_presence_notification_callback
        }
    });
};

/**
 * Login Success Callback
 */
kandy_login_success_callback = function () {
    KandyAPI.Phone.updatePresence(0);

    //have kandyAddressBook widget
    if ($(".kandyAddressBook").length) {
        kandy_loadContacts_addressBook();
    }
    //have kandyChat widget
    if ($(".kandyChat").length) {
        kandy_loadContacts_chat();
        setInterval(kandy_getIms, 3000);

    }
    //call user callback
    if (typeof login_success_callback == 'function') {
        login_success_callback();
    }

    //call user logout if exists
    if (typeof kandy_logout == 'function') {
        kandy_logout();
    }
};

/**
 * Login Fail Callback
 */
kandy_login_failed_callback = function () {
    if (typeof login_failed_callback == 'function') {
        login_failed_callback();
    }
};

/**
 * Local Video Initialized callback
 * @param videoTag
 */
kandy_local_video_initialized_callback = function (videoTag) {

    //have video widget
    if($(".kandyVideo").length){
        $('#myVideo').append(videoTag);
    }

    if (typeof local_video_initialized_callback == 'function') {
        local_video_initialized_callback(videoTag);
    }

};

/**
 * Remote Video Initialized Callback
 * @param videoTag
 */
kandy_remote_video_initialized_callback = function (videoTag) {

    //have video widget
    if($(".kandyVideo").length){
        $('#theirVideo').append(videoTag);
    }
    //have voice call widget
    if($(".kandyButton .videoVoiceCallHolder").length){
        $('.kandyButton .videoVoiceCallHolder .video').append(videoTag);
    }
    if (typeof remote_video_initialized_callback == 'function') {
        remote_video_initialized_callback(videoTag);
    }
};

/**
 * Status Notification Callback
 * @param userId
 * @param state
 * @param description
 * @param activity
 */
kandy_presence_notification_callback = function (userId, state, description, activity) {
    // HTML id can't contain @ and jquery doesn't like periods (in id)
    var id_attr = '.kandyAddressBook .kandyAddressContactList #presence_' + userId.replace(/[.@]/g, '_');
    $(id_attr).text(description);
    if (typeof presence_notification_callback == 'function') {
        presence_notification_callback(userId, state, description, activity);
    }

    //update chat status
    if($('.kandyChat').length >0){
        var liUser = $('.kandyChat .cd-tabs-navigation li#' +userId.replace(/[.@]/g, '_'));
        var statusItem = liUser.find('i.status');
        statusItem.text(description);

        liUser.removeClass().addClass('kandy-chat-status-' + description.replace(/ /g,'-').toLowerCase());
        liUser.attr('title', description);
    }
};

/**
 * OnCall Callback
 * @param call
 */
kandy_on_call_callback = function (call) {
    if (typeof on_call_callback == 'function') {
        on_call_callback(call);
    }
    changeAnswerButtonState("ON_CALL");
};

/**
 * Incoming Callback
 * @param call
 * @param isAnonymous
 */
kandy_incoming_call_callback = function (call, isAnonymous) {
    if (typeof call_incoming_callback == 'function') {
        call_incoming_callback(call, isAnonymous);
    }
    changeAnswerButtonState('BEING_CALLED');
};

/**
 * kandy call answered callback
 * @param call
 * @param isAnonymous
 */
kandy_call_answered_callback = function (call, isAnonymous) {
    if (typeof call_answered_callback == 'function') {
        call_answered_callback(call, isAnonymous);
    }
    changeAnswerButtonState("ON_CALL");
};

/**
 * kandy call_ended callback
 */
kandy_call_ended_callback = function () {
    //have video widget
    if($(".kandyVideo").length){
        $('#theirVideo').empty();
        $('#myVideo').empty();
    }
    if (typeof call_ended_callback == 'function') {
        call_ended_callback();
    }
    changeAnswerButtonState("READY_FOR_CALLING");
};

/**
 * Change AnswerButtonState with KandyButton Widget
 * @param state
 */
changeAnswerButtonState = function (state) {
    switch (state) {
        case 'READY_FOR_CALLING':

            $('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
            $('.kandyButton .kandyVideoButtonCallOut').show();
            $('.kandyButton .kandyVideoButtonCalling').hide();
            $('.kandyButton .kandyVideoButtonOnCall').hide();
            break;
        case 'BEING_CALLED':
            $('.kandyButton .kandyVideoButtonSomeonesCalling').show();
            $('.kandyButton .kandyVideoButtonCallOut').hide();
            $('.kandyButton .kandyVideoButtonCalling').hide();
            $('.kandyButton .kandyVideoButtonOnCall').hide();
            break;
        case 'CALLING':
            $('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
            $('.kandyButton .kandyVideoButtonCallOut').hide();
            $('.kandyButton .kandyVideoButtonCalling').show();
            $('.kandyButton .kandyVideoButtonOnCall').hide();
            break;
        case 'ON_CALL':
            $('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
            $('.kandyButton .kandyVideoButtonCallOut').hide();
            $('.kandyButton .kandyVideoButtonCalling').hide();
            $('.kandyButton .kandyVideoButtonOnCall').show();
            break;
    }
};

/**
 * Event when answer a call
 * @param target
 */
kandy_answerVideoCall = function (target) {
    KandyAPI.Phone.answerVideoCall();
    changeAnswerButtonState("ANSWERING_CALL");
    if (typeof answer_video_call_callback == 'function') {
        answer_video_call_callback("ANSWERING_CALL");
    }
};

/**
 * Event when click call button
 * @param target
 */
kandy_make_video_call = function (target) {

    KandyAPI.Phone.makeVideoCall($('.kandyButton .kandyVideoButtonCallOut #callOutUserId').val());
    changeAnswerButtonState("CALLING");
};

/*
 Event when answer a voice call
 */
kandy_answerVoiceCall = function (target) {
    KandyAPI.Phone.answerVoiceCall();
    changeAnswerButtonState("ANSWERING_CALL");
    if (typeof answer_voice_call_callback == 'function') {
        answer_voice_call_callback("ANSWERING_CALL");
    }
};

/*
 Event when click call button
 */
kandy_make_voice_call = function (target) {

    KandyAPI.Phone.makeVoiceCall($('.kandyButton .kandyVideoButtonCallOut #callOutUserId').val());
    changeAnswerButtonState("CALLING");
};

/*
 Event when click end call button
 */
kandy_end_call = function (target) {
    KandyAPI.Phone.endCall();
    if (typeof end_call_callback == 'function') {
        end_call_callback('READY_FOR_CALLING');
    }

    changeAnswerButtonState("READY_FOR_CALLING");
};

/**
 * Load contact list for addressBook widget
 */
kandy_loadContacts_addressBook = function () {
    var contactListForPresence = [];
    var i =0;
    KandyAPI.Phone.retrievePersonalAddressBook(
        function (results) {
            // clear out the current address book list
            $(".kandyAddressBook .kandyAddressContactList div:not(:first)").remove();
            var div = null;
            if (results.length == 0) {
                div = "<div class='kandyAddressBookNoResult'>-- No Contacts --</div>";
                $('.kandyAddressBook .kandyAddressContactList').append(div);
            } else {

                for (i = 0; i < results.length; i++) {
                    contactListForPresence.push({full_user_id: results[i].contact_user_name});

                    var id_attr = results[i].contact_user_name.replace(/[.@]/g, '_');
                    $('.kandyAddressBook .kandyAddressContactList').append(
                        // HTML id can't contain @ and jquery doesn't like periods (in id)
                        "<div class='kandyContactItem' id='uid_" + results[i].contact_user_name.replace(/[.@]/g, '_') + "'>" +
                        "<span class='userId'>" + results[i].contact_user_name + "</span>" +
                        "<span id='presence_" + id_attr + "' class='presence'></span>" +
                        "<input class='removeBtn' type='button' value='Remove' " +
                        " onclick='kandy_removeFromContacts(\"" + results[i].contact_id + "\")'>" +
                        "</div>"
                    );
                }
                KandyAPI.Phone.watchPresence(contactListForPresence);
            }
        },
        function () {
            console.log("Error kandy_loadContacts_addressBook");
        }
    );

};

/**
 * Change current user status with kandyAddressBook
 * @param status
 */
kandy_myStatusChanged = function (status) {
    KandyAPI.Phone.updatePresence(status);
};

/**
 * Add a user to contact list with kandyAddressBook
 * @type {null}
 */
var userIdToAddToContacts = null;  // need access to this in anonymous function below
kandy_addToContacts = function (userId) {
    userIdToAddToContacts = userId;
    var contact;
    // HTML id can't contain @ and jquery doesn't like periods (in id)
    if ($('#uid_' + userId.replace(/[.@]/g, '_')).length > 0) {
        alert("This person is already in your contact list.")
    } else {
        // get and AddressBook.Entry object for this contact
        KandyAPI.Phone.searchDirectoryByUserName(
            userId,
            function (results) {
                for (var i = 0; i < results.length; ++i) {
                    if (results[i].primaryContact === userIdToAddToContacts) {
                        // user name and nickname are required
                        contact = {
                            contact_user_name: results[i].primaryContact,
                            contact_nickname: results[i].primaryContact
                        };
                        if (results[i].firstName) {
                            contact['contact_first_name'] = results[i].firstName;
                        }
                        if (results[i].lastName) {
                            contact['contact_last_name'] = results[i].lastName;
                        }
                        if (results[i].homePhone) {
                            contact['contact_home_phone'] = results[i].homePhone;
                        }
                        if (results[i].mobilePhone) {
                            contact['contact_mobile_number'] = results[i].mobilePhone;
                        }
                        if (results[i].workPhone) {
                            contact['contact_business_number'] = results[i].workPhone;
                        }
                        if (results[i].fax) {
                            contact['contact_fax'] = results[i].fax;
                        }
                        if (results[i].email) {
                            contact['contact_email'] = results[i].email;
                        }

                        KandyAPI.Phone.addToPersonalAddressBook(
                            contact,
                            kandy_loadContacts_addressBook, // function to call on success
                            function (message) {
                                alert("Error: " + message);
                            }
                        );
                        break;
                    }
                }
            },
            function (statusCode) {
                console.log("Error getting contact details: " + statusCode)
            }
        );
    }
};

/**
 * Remove a user from Contact List with kandyAddressBook
 * @param nickname
 */
kandy_removeFromContacts = function (nickname) {
    KandyAPI.Phone.removeFromPersonalAddressBook(nickname,
        kandy_loadContacts_addressBook,  // function to call on success
        function () {
            console.log('Error kandy_removeFromContacts ');
        }
    );
};

/**
 * Search contact list by username with kandyAddressBook
 */
kandy_searchDirectoryByUserName = function () {
    var userName = $('.kandyAddressBook .kandyDirectorySearch #kandySearchUserName').val();
    KandyAPI.Phone.searchDirectoryByUserName(
        userName,
        function (results) {
            // clear out the results, but not the first line (results title)
            $(".kandyAddressBook .kandyDirSearchResults div:not(:first)").remove();
            var div = null;
            if (results.length == 0) {
                div = "<div class='kandyAddressBookNoResult'>-- No Matches Found --</div>";
                $('.kandyAddressBook .kandyDirSearchResults').append(div);
            } else {
                for (var i = 0; i < results.length; i++) {
                    $('.kandyDirSearchResults').append(
                        "<div class='kandySearchItem'>" +
                        "<span class='userId'>" + results[i].primaryContact + "</span>" +
                        "<input type='button' value='Add Contact' onclick='kandy_addToContacts(\"" +
                        results[i].primaryContact + "\")' />" +
                        "</div>"
                    );
                }
            }
        },
        function (val) {
            console.log('Error kandy_searchDirectoryByUserName ');
        }
    );
};

/**
 * =================== KANDY CHAT WIDGET FUNCTION ==========================
 */

var wrapDivClass = "kandyChat";
var liTabWrapClass = "cd-tabs-navigation";
var liContentWrapClass = "cd-tabs-content";
var liTabWrapSelector = "." + wrapDivClass + " ." + liTabWrapClass;
var liContentWrapSelector = "." + wrapDivClass + " ." + liContentWrapClass;

var userHoldingAttribute = "data-content";
var activeClass = "selected";
/**
 * Add an example chat box
 */
var addExampleBox = function () {
    var tabId = "example";
    $(liContentWrapSelector).append(getLiContent(tabId));
    $(liContentWrapSelector).find('li[data-content="' + tabId + '"]').addClass('selected').find(".chat-input").attr('disabled', true);
};

/**
 * Get a contact template
 *
 * @param user
 * @param active
 * @returns {string}
 */
var getLiContact = function (user, active) {
    var id = user.replace(/[.@]/g, '_');
    var liClass = (typeof active !== 'undefined') ? active : "";
    return '<li id="'+ id +'" class="' + liClass + '"><a ' + userHoldingAttribute + '="' + user + '" href="#">' + user + '</a><i class="status"></i></li>';

};

/**
 * Get contact content template
 *
 * @param user
 * @returns {string}
 */
var getLiContent = function (user) {
    return '<li ' + userHoldingAttribute + '="' + user + '">\
                <div class="kandyMessages" data-user="' + user + '">\
                </div>\
                <div >\
                    Messages:\
                </div>\
                <div class="kandyChatMessage">\
                            <form class="send-message" data-user="' + user + '">\
                        <div class="input-message">\
                            <input class="imMessageToSend chat-input" type="text" data-user="' + user + '">\
                        </div>\
                        <div class="button-send">\
                            <input class="btnSendMessage chat-input" type="submit" value="Send"  data-user="' + user + '" >\
                        </div>\
                    </form>\
                </div>\
            </li>';

};

var kandy_contactFilterChanged = function(val){
    var liUserChat = $(".kandyChat .cd-tabs-navigation li");
    $.each(liUserChat, function(index, target){
        var liClass = $(target).attr('class');
        var currentClass = "kandy-chat-status-" + val;
        if(val == "all"){
            $(target).show();
        } else if(liClass == currentClass){
            $(target).show();
        } else {
            $(target).hide();
        }
    });
};

/**
 * Load Contact for KandyChat
 */
kandy_loadContacts_chat = function () {
    var contactListForPresence = [];
    var i;
    KandyAPI.Phone.retrievePersonalAddressBook(
        function (results) {
            emptyContact();
            for (i = 0; i < results.length; i++) {
                prependContact(results[i].contact_user_name);
                contactListForPresence.push({full_user_id: results[i].contact_user_name});
            }

            KandyAPI.Phone.watchPresence(contactListForPresence);
            addExampleBox();
        },
        function () {
            console.log("Error");
            addExampleBox();
        }
    );
};

/**
 * Send a message with kandyChat
 */
kandy_sendIm = function (username) {
    var displayName = $('.kandyChat .kandy_current_username').val();
    var inputMessage = $('.kandyChat .imMessageToSend[data-user="' + username + '"]');
    var message = inputMessage.val();
    inputMessage.val('');
    KandyAPI.Phone.sendIm(username, message, function () {
            var newMessage = '<div class="my-message">\
                    <b><span class="imUsername">' + displayName + ':</span></b>\
                    <span class="imMessage">' + message + '</span>\
                </div>';
            var messageDiv = $('.kandyChat .kandyMessages[data-user="' + username + '"]');
            messageDiv.append(newMessage);
            messageDiv.scrollTop(messageDiv[0].scrollHeight);
        },
        function () {
            alert("IM send failed");
        }
    );
};

/**
 * Get messages with kandyChat
 */
kandy_getIms = function () {
    KandyAPI.Phone.getIm(
        function (data) {
            var i;
            for (i = 0; i < data.messages.length; ++i) {
                var msg = data.messages[i];
                if (msg.messageType == 'chat') {
                    // Get user info
                    var username = data.messages[i].sender.full_user_id;
                    var shortName = data.messages[i].sender.user_id;

                    // Process tabs
                    if (!$(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").length) {
                        prependContact(username);
                    }
                    if (!$('input.imMessageToSend').is(':focus')) {
                        moveContactToTopAndSetActive(username);
                    } else {
                        moveContactToTop(username);
                    }

                    // Process message
                    var msg = data.messages[i].message.text;
                    var newMessage = '<div class="their-message">\
                            <b><span class="imUsername">' + shortName + ':</span></b>\
                            <span class="imMessage">' + msg + '</span>\
                        </div>';

                    var messageDiv = $('.kandyChat .kandyMessages[data-user="' + username + '"]');
                    messageDiv.append(newMessage);
                    messageDiv.scrollTop(messageDiv[0].scrollHeight);
                } else {
                    //alert("received " + msg.messageType + ": ");
                }
            }
        },
        function () {
            console.log("error receiving IMs");
        }
    )
};

/* Tab */

/**
 * Empty all contacts
 *
 */
var emptyContact = function () {
    $(liTabWrapSelector).html("");
    $(liContentWrapSelector).html("");
};

/**
 * Prepend a contact
 *
 * @param user
 */
var prependContact = function (user) {
    var liParent = $(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + user + "']").parent();
    var liContact = "";
    if(liParent.length){
        liContact =  liParent[0].outerHTML;
    } else {
        liContact = getLiContact(user);
    }

    $(liTabWrapSelector).prepend(liContact);
    if (!$(liContentWrapSelector + " li[" + userHoldingAttribute + "='" + user + "']").length) {
        var liContent = getLiContent(user);
        $(liContentWrapSelector).prepend(liContent);
    }
};

/**
 * Get current active user name
 *
 * @returns {*}
 */
var getActiveContact = function () {
    return $(liTabWrapSelector + " li." + activeClass).attr(userHoldingAttribute);
};

/**
 * Set focus to a user
 *
 * @param user
 */
var setFocusContact = function (user) {
    $(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + user + "']").trigger("click");
};

/**
 * Move a contact user to top of the list
 *
 * @param user
 */
var moveContactToTop = function (user) {
    var contact = $(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + user + "']").parent();
    var active = contact.hasClass(activeClass);

    // Add to top
    prependContact(user, active);

    // Remove
    contact.remove();
};

/**
 * Move a contact user to top of the list set set focus to it
 *
 * @param user
 */
var moveContactToTopAndSetActive = function (user) {
    moveContactToTop(user);
    setFocusContact(user);
    $(liTabWrapSelector).scrollTop(0);
};

// ======================JQUERY READY =======================
var $ = jQuery;
$(document).ready(function () {
    //register kandy widget event

    if (typeof login == 'function') {
        setup();
        login();
        console.log('login....');
    }

    //only work when kandyChat exists
    if($('.kandyChat').length){
        $("form.send-message").live("submit", function(e) {
            var username = $(this).attr('data-user');
            kandy_sendIm(username);
            e.preventDefault();
        });

        var tabContentWrapper = $(liContentWrapSelector);

        $('.cd-tabs-navigation a').live('click', function (event) {
            event.preventDefault();
            var selectedItem = $(this);
            if (!selectedItem.hasClass('selected')) {
                var selectedTab = selectedItem.data('content'),
                    selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'),
                    selectedContentHeight = selectedContent.innerHeight();

                $('.cd-tabs-navigation a').removeClass('selected');
                selectedItem.addClass('selected');
                selectedContent.addClass('selected').siblings('li').removeClass('selected');

                // Set focus
                selectedContent.find(".imMessageToSend").focus();

                // Set chat heading
                $(".chat-with-message").show();
                $(".chat-friend-name").html(selectedItem.html());

                //animate tabContentWrapper height when content changes
                tabContentWrapper.animate({
                    'height': selectedContentHeight
                }, 200);
            }
        });

        //hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version)
        checkScrolling($('.cd-tabs nav'));

        $(window).live('resize', function () {
            checkScrolling($('.cd-tabs nav'));
        });

        $('.cd-tabs nav').live('scroll', function () {
            checkScrolling($(this));
        });

        function checkScrolling(tabs) {
            var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
                tabsViewPort = parseInt(tabs.width());
            if (tabs.scrollLeft() >= totalTabWidth - tabsViewPort) {
                tabs.parent('.cd-tabs').addClass('is-ended');
            } else {
                tabs.parent('.cd-tabs').removeClass('is-ended');
            }
        }
    }
});
