let currentWindowSize = window.innerWidth;
let currentWindowHeight = window.innerHeight;
let userOSInfo = null;
let currentPageUrl;
let alertBottomValue = 0;
let bottomNavbarH = 0;
let intervalValue;
let kawaiiAlertTimeoutValue;
let timeoutValue;
let resizeTimeout;
let playerPosition = 0;
let sentRequest = null;
let openedContainers = [];
let openedSmContainers = [];
let openInsideLgCardsArr = [];
let openedCards = [];
const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
let dayOfWeekShortArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let monthsShortArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let trackOrderInQueue = 0;
let reserveOrderInQueue = 0;
let selectSearchBaseItems = [];

let internalVolume = 50;
let playbackRateMultiplier = 1;
let trackQueue = { songs: [], orderChanger: 1, autoPlay: false };
let reserveQueue = [];

let swipeTimeout = 0;
let resizeTimer = 0;
let lastScrollTop = 0;
let lastResizeWidth = 0;
let lastResizeHeight = 0;


//function playlistSongsApplier(); Personal
//GetFavorite GetTrackComments 
//localItemFilter(); SearchForGenres_Form Update Favorites btn-show-field-box EditTrackLyrics
//imagePreviewer() type='file' UpdateTrackCredits_Form Playlists .div-swiper
//SearchForUsers_Form btn-show-the-clock form-control-search ReleaseASingle_Form LoadTheTrack_Form GetPlaylists
//FUNCTION TERRITORY playlistInfoSampler();
//function callAContainer callAModal
//function callASmContainer(); function displayCorrector function callASmContainer() function enlargeMediaPlayer()
window.onload = function () {
    displayCorrector(currentWindowSize);
    currentWindowSize = window.innerWidth;
    currentWindowHeight = window.innerHeight;
    bottomNavbarH = $("#MainBottom_Navbar").innerHeight() + 5;
    mediaPlayerCorrector(currentWindowSize, true);
    setTimeout(function () {
        callAContainer(false, "Primary_Container");
    }, 300);

    lastResizeWidth = currentWindowSize;
    lastResizeHeight = window.innerHeight;
    currentPageUrl = window.location.href;
}

window.onresize = function () {
    clearTimeout(resizeTimeout);
    resizeTimer = setTimeout(function () {
        if (lastResizeHeight !== window.innerHeight && lastResizeWidth !== window.innerWidth) {
            currentWindowSize = window.innerWidth;
            currentWindowHeight = window.innerHeight;
            bottomNavbarH = $("#MainBotton_Navbar").innerHeight() + parseFloat($("#MainBotton_Navbar").css("bottom"));
            displayCorrector(currentWindowSize);
            mediaPlayerCorrector(currentWindowSize, false);
            setTimeout(function () {
                lgPartContainerCorrector(playerPosition);
            }, 750);

            lastResizeWidth = currentWindowSize;
            lastResizeHeight = currentWindowHeight;
        }
    }, 300);
}

window.onoffline = function () {
    callEmergencyAlert("#DC3545", "#fdfdfd", ' <i class="fa-solid fa-link-slash"></i> ', "You're Offline", " It looks like you’re offline. Please check your internet connection", -1);
}

window.ononline = function () {
    callEmergencyAlert("#f0f0f0", "#2b2b2b", ' <i class="fa-solid fa-wifi"></i> ', "Connection Restored", "Looks like your internet access has been restored. All features are now available", 5);
}

//window.onvolumechange
//window.onwaiting

$("#CheckAccountByEmail_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let buttonHtml = $("#CheckAccountByEmail_SbmtBtn").html();
    buttonDisabler(false, "CheckAccountByEmail_SbmtBtn", "Checking...");

    $.get(url, data, function (response) {
        if (!response.success) {
            if (parseInt(response.type) != undefined) {
                switch (parseInt(response.type)) {
                    case 0:
                        $("#CreateAccount_Email_Val").val(response.email);
                        $("#CreateAccount_Email_Span").html(response.email + ' ∙ Edit <i class="fa-solid fa-angle-right"></i>');
                        forwardSlider(0, 1, "SigningInStep_Box");
                        break;
                    case 1:
                        //slideSmContainers(null, "RPS2_Container");
                        //$("#RPS2_Email_Val").val(response.email);
                        //$("#RPS2_BackToEmail_Btn").html(response.email + ' ∙ Edit <i class="fa-solid fa-angle-right"></i>');
                        //break;
                    default:
                        $("#CreateAccount_Email_Val").val(response.email);
                        $("#CreateAccount_Email_Span").html(response.email + ' ∙ Edit <i class="fa-solid fa-angle-right"></i>');
                        forwardSlider(0, 1, "SigningInStep_Box");
                        break;
                }
            }
        }
        else {
            $("#CABE_Email_Val").val(null);
            switch (parseInt(response.type)) {
                case 0:
                    callAlert('<i class="fa-solid fa-triangle-exclamation"></i>', null, null, "An account with <span class='fw-500'>" + response.email + "</span> already exists", 4.5, "Close", 0, null);
                    break;
                case 1:
                    slideSmContainers(null, "RPS2_Container");
                    $("#RPS2_Email_Val").val(response.email);
                    $("#SPRC_Email_Val").val(response.email);
                    $("#ResetPassword_Email_Val").val(response.email);
                    $("#SendPasswordResetCode_Form").submit();
                    $("#RPS2_BackToEmail_Btn").html(response.email + ' ∙ Edit <i class="fa-solid fa-angle-right"></i>');
                    $("#RPS3_BackToEmail_Btn").html(response.email + ' ∙ Edit <i class="fa-solid fa-angle-right"></i>');
                    $("#CodeResendTime_Box").fadeIn(0);
                    break;
                default:
                    callAlert('<i class="fa-solid fa-triangle-exclamation"></i>', null, null, "An account with <span class='fw-500'>" + response.email + "</span> already exists", 4.5, "Close", 0, null);
                    break;
            }
        }
        buttonUndisabler(false, "RPS1_SbmtBtn", "Continue");
        buttonUndisabler(false, "CheckAccountByEmail_SbmtBtn", buttonHtml);
        $("#CABE_Type_Val").val(0);
        $("#CheckAccountByEmail_SbmtBtn").addClass("super-disabled");
    });
});

$("#RPS1_SbmtBtn").on("mousedown", function () {
    let email = $("#RPS1_Email_Val").val();
    if (email != undefined) {
        $("#CABE_Type_Val").val(1);
        $("#CABE_Email_Val").val(email);
        buttonDisabler(false, "RPS1_SbmtBtn", "Verifying & Sending...");
        $("#CheckAccountByEmail_Form").submit();
    }
});
$("#RPStep1_SbmtBtn").on("mousedown", function () {
    let email = $("#SPRC_Email_Val").val();
    if (email != undefined) {
        buttonDisabler(false, "RPStep1_SbmtBtn", "Sending the Code...");
        $("#SendPasswordResetCode_Form").submit();
    }
});

$("#CreateAccount_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let buttonHtml = $("#CreateAccount_SbmtBtn").html();
    buttonDisabler(false, "CreateAccount_SbmtBtn", "Creating...");

    $.post(url, data, function (response) {
        if (response.success) {
            callAlert('<i class="fa-regular fa-circle-check"></i>', null, null, "Your account has been successfully created. Please proceed to the profile page to update your main account information (optional)", 5, "Close", 0, null);
            slideContainers(null, "SignedUp_Container");
        }
        else {
            callAlert('<i class="fa-solid fa-triangle-exclamation"></i>', null, null, response.alert, 4.75, "Close", 0, null);
        }
        buttonUndisabler(false, "CreateAccount_SbmtBtn", buttonHtml);
    });
});

$("#SignIn_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let buttonHtml = $("#SignIn_SbmtBtn").html();
    buttonDisabler(false, "SignIn_SbmtBtn", "Signing In...");

    $.post(url, data, function (response) {
        if (response.success) {
            if (parseInt(response.result) == 1) {
                $("#SignIn_SbmtBtn").html(' <i class="fa-solid fa-circle-check"></i> Signed In Successfully');
                document.location = "/Home/Index";
            }
            else if (parseInt(response.result) == 2) {
                createInsideLgCard("PasscodeSignIn", "Passcode Required", '<div class="box-bordered text-center p-2"> <h3 class="h3"> <i class="fa-solid fa-lock"></i> </h3> <h4 class="h4">Passcode Secured</h4> <small class="card-text text-muted">This account is protected by a passcode. Please enter it to complete the sign-in process</small> </div> <div class="mt-2"> <form method="post" action="/Account/PasscodeSignIn" id="PasscodeSignIn_Form"> <div class="d-none"> <input type="text" name="Password" id="PasscodeSignIn_Password_Val" /> <input type="text" name="Username" id="PasscodeSignIn_Username_Val" /> </div> <div> <input type="text" class="form-control form-textarea form-control-guard" name="Passcode" id="PasscodeSignIn_Passcode_Val" placeholder="Enter the passcode" data-min-length="1" data- data-target="PasscodeSignIn_SbmtBtn" /> </div> <div class="mt-2"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="PasscodeSignIn_SbmtBtn">Sign In</button> </div> </form> </div>', '<form method="post" href="/Account/SendThePasscodeViaInbox" id="SendThePasscodeViaInbox_Form"> <button type="submit" class="btn btn-standard btn-sm" id="SendThePasscodeViaInbox_SbmtBtn">Forgot Passcode</button> </form>', null);
                setTimeout(function () {
                    $("#PasscodeSignIn_Password_Val").val(response.model.password);
                    $("#PasscodeSignIn_Username_Val").val(response.model.username);
                    callAContainer(false, "PasscodeSignIn_Container");
                }, 150);
            }
        }
        else {
            callAlert('<i class="fa-solid fa-triangle-exclamation"></i>', null, null, "Unable to sign in. Email or password incorrect", 4.75, "Close", 0, null);
            buttonUndisabler(false, "SignIn_SbmtBtn", buttonHtml);
            $("#SignIn_Password_Val").val(null);
        }
    });
});

$(document).on("submit", "#PasscodeSignIn_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#PasscodeSignIn_SbmtBtn").html();
    buttonDisabler(false, "PasscodeSignIn_SbmtBtn", "Verifying the Passcode...");

    $.post(url, data, function (response) {
        if (response.success) document.location = "/Home/Index";
        else {
            callAlert('<i class="fa-solid fa-triangle-exclamation"></i>', null, null, "Invalid passcode. Please try again", 3.25, "Close", 0, null);
            $("#PasscodeSignIn_Passcode_Val").val(null);
            buttonUndisabler(false, "PasscodeSignIn_SbmtBtn", baseHtml);
            $("#PasscodeSignIn_SbmtBtn").addClass("super-disabled");
        }
    });
});

$("#SendPasswordResetCode_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#SPRC_SbmtBtn").html();
    buttonDisabler(false, "SPRC_SbmtBtn", "Sending Code...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#CPREC_Id_Val").val(response.id);
            let timerResult = timer(125, "SPRC_SbmtBtn", 0.1, false).then(function () {
                if (timerResult) {
                    $("#SPRC_SbmtBtn").removeClass("super-disabled");
                    $("#SPRC_SbmtBtn").html(' <i class="fa-solid fa-arrow-rotate-right"></i> Resend Code');
                    payAttention("SPRC_SbmtBtn", 9, 1);
                }
            });
            if (currentPageUrl.toLowerCase().includes("/profile/p")) {
                showSwitchableBox(false, "SPRCStep2_Box");
            }
        }
        else {
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Unable to send the code (internal server error). Please try again later", 4.25, "Close", 0, null);
            $("#SPRC_SbmtBtn").html(baseHtml);
        }
    });
});

$(document).on("keyup", ".form-control-guard-code", function () {
    let currentLength = $(this).val().length;
    if (currentLength > 0) {
        $(".char-indicator-active").addClass("char-indicator-empty");
        $(".char-indicator-active").removeClass("char-indicator-active");
        for (let i = 0; i < currentLength; i++) {
            $("#" + i + "-" + $(this).attr("id") + "-Indicator").removeClass("char-indicator-empty");
            $("#" + i + "-" + $(this).attr("id") + "-Indicator").addClass("char-indicator-active");
        }
    }
});

$(document).on("submit", "#CheckPasswordResetEmailCode_Form", function (event) {
    event.preventDefault();
    if (currentPageUrl.toLowerCase().includes("/profile/p")) $("#CPREC_Type_Val").val(1);
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            $("#CPREC_Code_Val").val(null);
            if (response.code != null) {
                $("#UTP_Type_Val").val(1);
                $("#UTP_AdditionalInfo_Val").val(response.code);
                showSwitchableBox("SetNewPassword_Box");
            }
            else slideSmContainers(null, "RPS3_Container");
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Well done. Now, create or generate new strong password for your account", 4.25, "Close", 0, null);
        }
        else {
            $("#CPREC_Code_Val").val(null);
            callAlert('<i class="fa-solid fa-0"></i>', null, null, "Invalid verification code. Please check your inbox and try again, or request a new code", 4.25, "Close", 0, null);
            let localIntervalValue = setInterval(function () {
                let randVal = Math.floor(Math.random() * 9);
                $("#OngakuAlert_Icon_Lbl").html('<i class="fa-solid fa-' + randVal + '"></i>');
            }, 450);
            setTimeout(function () {
                clearInterval(localIntervalValue);
            }, 4500);
        }
    });
});

$(document).on("submit", "#CheckThePassword_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#CheckThePassword_SbmtBtn").html();
    buttonDisabler(false, "CheckThePassword_SbmtBtn", 'Verifying...');
  
    $.get(url, data, function (response) {
        if (response.success) {
            $("#UTP_Type_Val").val(0);
            $("#UTP_AdditionalInfo_Val").val(response.password);
            $("#CTP_Password_Val").val(null);
            showSwitchableBox(false, "SetNewPassword_Box");
        }
        else {
            $("#CTP_Password_Val").val(null);
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Entered password is incorrect. Please review it and try again", 3.5, "Close", 0, null);
        }
        $("#CheckThePassword_SbmtBtn").html(baseHtml);
    });
});

$("#ResetPassword_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#ResetPassword_SbmtBtn").html();
    buttonDisabler(false, "ResetPassword_SbmtBtn", "Updating...");

    $.post(url, data, function (response) {
        if (response.success) {
            uncallASmContainer(false, "RPS3_Container");
            callASmContainer(false, "SignIn_Container");
            $("#CABE_Type_Val").val(0);
            $("#CABE_Email_Val").val(response.email);
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Your password has been successfully reset. You can now sign in with your new password", 4, "Close", 0, null);
        }
        else {
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "The entered passwords do not match. Please review them and try again", 4.25, "Close", 0, null);
        }
        $("#ResetPassword_Password_Val").val(null);
        $("#ResetPassword_ConfirmPassword_Val").val(null);
        buttonUndisabler(false, "ResetPassword_SbmtBtn", baseHtml);
    });
});

$(document).on("submit", "#UpdateThePassword_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#UpdateThePassword_SbmtBtn").html();
    buttonDisabler(false, "UpdateThePassword_SbmtBtn", ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Updating...');

    $.post(url, data, function (response) {
        if (response.success) {
            uncallAContainer(false, "ProfileSecurity_Container");
            setTimeout(function () {
                $("#UTP_Password_Val").val(null);
                $("#UTP_ConfirmPassword_Val").val(null);
                $("#ResetPasswordViaEmail_Box-ShowBtn").removeClass("btn-box-switcher-member-active");
                $("#ResetPasswordViaCurrentPassword_Box-ShowBtn").addClass("btn-box-switcher-member-active");
                showSwitchableBox("ResetPasswordViaCurrentPassword_Box");
            }, 350);
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Your password has been successfully updated. From now on, please use your new password to sign in", 4, "Close", 0, null);
        }
        else {
            $("#UTP_ConfirmPassword_Val").val(null);
            callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "The passwords do not match. Please check and try again before saving", 4, "Close", 0, null);
        }
        $("#UpdateThePassword_SbmtBtn").html(baseHtml);
    });
});

$("#GetAccountGuts_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.guts.email != null) {
                //btn-show-inside-box CheckThePassword_Form
                createAContainer("ProfileSecurity", "Security Settings", '<div class="box-vertical-switcher shadow-sm" id="ProfileSecurity_VS_Box"> <div class="box-vertical-switcher-header hstack gap-1"> <button type="button" class="btn btn-standard-bolded btn-close-vertical-switcher btn-sm ms-auto">Done</button> </div> <div class="mt-2"> <button type="button" class="btn btn-box-vertical-swticher btn-close-vertical-switcher btn-box-vertical-swticher-active btn-show-inside-box" data-switcher-internal-id="0" data-big-switcher="true" id="PasswordSettings_Box-Show_Btn"> <i class="fa-solid fa-shield-halved"></i> Password Settings</button> <button type="button" class="btn btn-box-vertical-swticher btn-close-vertical-switcher btn-show-inside-box" data-switcher-internal-id="0" data-big-switcher="true" id="PasscodeLockSettings_Box-Show_Btn"> <i class="fa-solid fa-lock"></i> Passcode Lock</button> <button type="button" class="btn btn-box-vertical-swticher btn-close-vertical-switcher btn-show-inside-box" data-switcher-internal-id="0" data-big-switcher="true" id="EmailVerification_Box-Show_Btn"> <i class="fa-solid fa-envelope-circle-check"></i> Email Verification</button> <button type="button" class="btn btn-box-vertical-swticher btn-close-vertical-switcher btn-show-inside-box" data-switcher-internal-id="0" id="TFA_VS_Btn"> <i class="fa-solid fa-key"></i> 2FA Settings</button> </div> </div> <div class="ps-1 pe-1"> <div class="big-box-switchable" id="PasswordSettings_Box"> <div class="box-switcher row ms-1 me-1"> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member-active btn-show-inside-box" data-switcher-internal-id="0" id="ResetPasswordViaCurrentPassword_Box-ShowBtn">via Current Password</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-show-inside-box" data-switcher-internal-id="0" id="ResetPasswordViaEmail_Box-ShowBtn">via Email Code</button> </div> </div> <div class="box-switchable" id="ResetPasswordViaCurrentPassword_Box"> <form method="get" action="/Account/CheckThePassword" id="CheckThePassword_Form"> <div class="d-none"> <input type="hidden" name="Email" id="CTP_Email_Val" value="@UserInfo.Email" /> </div> <div class="mt-3"> <span class="form-label fw-500">Current Password</span> <div> <small class="card-text text-muted" id="CTP_Email_Span">@UserInfo.Email</small> </div> <input type="password" class="form-control form-control-guard mt-2" name="Password" id="CTP_Password_Val" data-min-length="8" data-target="CheckThePassword_SbmtBtn" placeholder="Your current password" maxlength="32" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">No verification is required, just enter your account password to confirm ownership</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="CheckThePassword_SbmtBtn">Continue</button> </div> </form> </div> <div class="box-switchable mt-2" id="ResetPasswordViaEmail_Box" style="display: none;"> <div class="box-switchable" id="SPRCStep1_Box" style="display: block;"> <div class="mt-2"> <label class="form-label fw-500">Email</label> <input type="email" name="Email" class="form-control super-disabled" placeholder="Your email address" maxlength="75" value="@UserInfo.Email" id="SPRCStep1_Email_Val" readonly /> </div> <div class="mt-3"> <button type="button" class="btn btn-standard-bolded btn-classic-styled w-100" id="RPStep1_SbmtBtn">Send Code</button> </div> <div class="box-bordered text-center p-2 mt-1"> <small class="card-text text-muted">A one-time verification code will be sent to your email within <span class="fw-500">6</span> minutes after completing the verification process. Please check your inbox for further instructions</small> </div> </div> <div class="box-switchable" id="SPRCStep2_Box" style="display: none;"> <form method="post" action="/Account/CheckPasswordResetEmailCode" id="CheckPasswordResetEmailCode_Form"> <div> <input type="hidden" name="UserId" id="CPREC_Id_Val" /> <input type="hidden" name="Type" id="CPREC_Type_Val" value="1" /> <div class="text-center"> <div class="char-indicator-empty" data-parent="CPREC_Code_Val" id="0-CPREC_Code_Val-Indicator"></div> <div class="char-indicator-empty" data-parent="CPREC_Code_Val" id="1-CPREC_Code_Val-Indicator"></div> <div class="char-indicator-empty" data-parent="CPREC_Code_Val" id="2-CPREC_Code_Val-Indicator"></div> <div class="char-indicator-empty" data-parent="CPREC_Code_Val" id="3-CPREC_Code_Val-Indicator"></div> <div class="char-indicator-empty" data-parent="CPREC_Code_Val" id="4-CPREC_Code_Val-Indicator"></div> <div class="char-indicator-empty" data-parent="CPREC_Code_Val" id="5-CPREC_Code_Val-Indicator"></div> </div> <div> <input type="text" name="Code" id="CPREC_Code_Val" class="form-control form-control-for-numbers-only form-control-guard-code form-control-guard mt-2" data-min-length="6" data-on-fulfill="CheckPasswordResetEmailCode_Form" placeholder="6-digit code" maxlength="6" /> </div> </div> </form> <div class="box-bordered text-center mt-1 p-2" id="CodeResendTime_Box"> <small class="card-text text-muted" id="CodeResendTimer_Lbl">You will be able to receive a new code shortly</small> <div class="mt-1"> <form method="post" action="/Account/SendPasswordResetCode" id="SendPasswordResetCode_Form"> <input type="hidden" name="Email" id="SPRC_Email_Val" value="@UserInfo.Email" /> <button type="submit" class="btn btn-standard-bolded super-disabled w-100" id="SPRC_SbmtBtn"> <i class="fa-solid fa-arrow-rotate-right"></i> Resend Code</button> </form> </div> </div> </div> </div> <div class="box-switchable mt-2" id="SetNewPassword_Box" style="display: none;"> <form method="post" action="/Profile/UpdateThePassword" id="UpdateThePassword_Form"> <div class="d-none"> <input type="hidden" name="Type" id="UTP_Type_Val" value="0" /> <input type="hidden" name="AdditionalInfo" id="UTP_AdditionalInfo_Val" /> </div> <div> <label class="form-label fw-500">New Password</label> <input type="password" name="NewPassword" id="UTP_Password_Val" class="form-control form-control-guard" data-min-length="8" data-target="UpdateThePassword_SbmtBtn" maxlength="32" placeholder="Your new password" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Your new password must be between <span class="fw-500">8</span> and <span class="fw-500">32</span> characters long and must not be the same as your current password</small> </div> <div class="mt-3"> <label class="form-label fw-500">Confirm Password</label> <input type="password" name="ConfirmPassword" id="UTP_ConfirmPassword_Val" class="form-control form-control-guard" data-min-length="8" data-target="UpdateThePassword_SbmtBtn" maxlength="32" placeholder="Confirm your new password" /> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="UpdateThePassword_SbmtBtn">Save Changes</button> </div> </form> </div> </div> <div class="big-box-switchable" id="PasscodeLockSettings_Box" style="display: none;"> <div class="box-bordered p-2"> <div class="dropdown float-end ms-1"> <button class="btn btn-standard-bordered btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button> <ul class="dropdown-menu shadow-sm p-1"> <li><button type="button" class="dropdown-item btn-sm"> <i class="fa-solid fa-clock"></i> Passcode timer</button></li> </ul> </div> <div class="hstack gap-1"> <div> <small class="card-text"><span id="PasscodeLockIcon_Span"><i class="fa-solid fa-lock"></i></span> Passcode Status: <span class="fw-500" id="PasscodeLockStatus_Span">Unlocked</span></small> <div class="mt-1"> <button type="button" class="btn btn-standard-bordered btn-show-inside-box btn-sm text-start me-1" id="PasscodeEdit_Box-OpenBtn"> <i class="fa-solid fa-pencil"></i> Edit</button> <button type="button" class="btn btn-standard-bordered btn-show-inside-box btn-sm text-start text-danger" id="PasscodeDrop_Box-OpenBtn"> <i class="fa-solid fa-xmark"></i> Disable</button> </div> </div> </div> </div> <div class="box-switchable mt-2" id="PasscodeNotSet_Box" style="display: none;"> <div class="box-bordered text-center p-2"> <h3 class="h3"> <i class="fa-solid fa-lock"></i> </h3> <h4 class="h4">Passcode Lock</h4> <small class="card-text text-muted">When a passcode is set, an additional account verification step is required whenever someone attempts to access your account. Another passcode must be entered before the account can be used</small> <div class="mt-2"> <small class="card-text text-muted"><span class="fw-500">Notice: </span>If you forget your passcode, you can disable it through email verification. For standard disabling, only your passcode is required</small> </div> </div> <div class="mt-2"> <form method="post" action="/Account/SetPasscodeLock" id="SetPasscodeLock_Form"> <div> <label class="form-label fw-500">Passcode</label> <input type="text" class="form-control form-control-guard form-textarea" name="Passcode" id="SPL_Passcode_Val" placeholder="Passcode value" data-min-length="1" data-target="SetPasscodeLock_SbmtBtn" maxlength="12" /> </div> <div class="mt-1 ms-1"> <button type="button" class="btn btn-standard-bordered btn-sm float-end ms-1" id="SPL_Passcode_Val-Indicator_Span">0/12</button> <small class="card-text text-muted">The passcode can include any character, but its length cannot exceed <span class="fw-500">12</span> characters</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="SetPasscodeLock_SbmtBtn">Turn On</button> </div> </form> </div> </div> <div class="box-switchable mt-2" id="PasscodeEdit_Box" style="display: none;"> <div class="box-bordered text-center p-2"> <h3 class="h3"> <i class="fa-solid fa-pencil"></i> </h3> <h4 class="h4">Edit Passcode</h4> <small class="card-text text-muted">Modify your passcode without removing it</small> </div> <div class="mt-2"> <form method="post" action="/Account/EditPasscodeLock" id="EditPasscodeLock_Form"> <div> <label class="form-label fw-500">Current Passcode</label> <input type="text" name="CurrentPasscode" id="EPL_CurrentPasscode_Val" class="form-control form-control-guard form-textarea" data-min-length="1" data-target="EditPasscodeLock_SbmtBtn" maxlength="12" placeholder="Current passcode" /> </div> <div class="mt-3"> <label class="form-label fw-500">New Passcode</label> <input type="text" name="Passcode" id="EPL_Passcode_Val" class="form-control form-control-guard form-textarea" data-min-length="1" data-target="EditPasscodeLock_SbmtBtn" maxlength="12" placeholder="New passcode" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">The passcode can include any character, but its length is limited to <span class="fw-500">12</span> characters</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="EditPasscodeLock_SbmtBtn">Save Changes</button> </div> </form> <div class="box-bordered text-center p-2 mt-2"> <small class="card-text text-muted">Forgot your current passcode?</small> <div class="mt-2"> <button type="button" class="btn btn-standard-bordered btn-sm text-center w-100" id="SendPasscodeViaEmail_Btn">Send via Email</button> </div> </div> </div> </div> <div class="box-switchable" id="PasscodeDrop_Box" style="display: none;"> <div class="box-bordered text-center p-2"> <h3 class="h3"> <i class="fa-solid fa-lock-open"></i> </h3> <h4 class="h4">Passcode Disabling</h4> <small class="card-text text-muted">When a passcode is disabled, you will no longer need to enter an additional code to access or manage your account. To remove your passcode, simply enter it here.<br />If you forgot your passcode, you can reset it by receiving a special code in your inbox to verify ownership of the account</small> </div> <div class="mt-2"> <form method="post" action="/Account/DisablePasscodeLock" id="DisablePasscodeLock_Form"> <div> <label class="form-label fw-500">Passcode</label> <input type="text" name="CurrentPasscode" id="DPL_Passcode_Val" class="form-control form-control-guard form-textarea" data-min-length="1" data-target="DisablePasscodeLock_SbmtBtn" maxlength="12" placeholder="Current passcode" /> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="DisablePasscodeLock_SbmtBtn">Turn Off</button> </div> </form> </div> <div class="box-bordered text-center p-2 mt-2"> <small class="card-text text-muted">Forgot your passcode?</small> <div class="mt-2"> <form method="post" action="/Account/SendThePasscodeViaInbox" id="SendThePasscodeViaInbox_Form"> <button type="submit" class="btn btn-standard btn-sm bg-light w-100" id="SendThePasscodeViaInbox_SbmtBtn">Send via Email</button> </form> </div> </div> </div> </div> </div>', '<button type="button" class="btn btn-standard btn-open-vertical-switcher btn-sm" id="ProfileSecurity_VS_Box-Open"> <i class="fa-solid fa-bars"></i> Menu</button>', null);
                $("#SPRC_Email_Val").val(response.guts.email);
                $("#CTP_Email_Val").val(response.guts.email);
                $("#SPRCStep1_Email_Val").val(response.guts.email);
                $("#CTP_Email_Span").text(response.guts.email);//btn-show-inside-box
                
                if (response.guts.passcode == null) {
                    $("#PasscodeSet_Box").fadeOut(0);
                    $("#PasscodeNotSet_Box").fadeIn(0);
                    $("#PasscodeLockStatus_Span").text("Unlocked");
                    $("#PasscodeDrop_Box-OpenBtn").addClass("super-disabled");
                    $("#PasscodeLockIcon_Span").html('<i class="fa-solid fa-lock-open"></i>');
                    showSwitchableBox(false, "PasscodeNotSet_Box");
                }
                else {
                    $("#PasscodeSet_Box").fadeIn(0);
                    $("#PasscodeNotSet_Box").fadeOut(0);
                    $("#PasscodeLockStatus_Span").text("Locked");
                    $("#PasscodeDrop_Box-OpenBtn").removeClass("super-disabled");
                    $("#PasscodeLockIcon_Span").html('<i class="fa-solid fa-lock"></i>');
                    showSwitchableBox(false, "PasscodeEdit_Box");
                }
                $("#ResetPasswordViaCurrentPassword_Box").fadeIn(0);
                setTimeout(function () {
                    slideContainers(null, "ProfileSecurity_Container");
                }, 150);
            }
        }
        else callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Security settings are temporarily unavailable", 3.5, "Close", 0, null);
    });
});

$(document).on("submit", "#SetPasscodeLock_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#SetPasscodeLock_SbmtBtn").html();
    buttonDisabler(false, "SetPasscodeLock_SbmtBtn", "Setting Passcode...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#PasscodeLockStatus_Span").text("Locked");
            $("#PasscodeLockIcon_Span").html('<i class="fa-solid fa-lock"></i>');
            $("#PasscodeDrop_Box-OpenBtn").removeClass("super-disabled");
            showSwitchableBox(false, "PasscodeSet_Box");
            setTimeout(function () {
                $("#SPL_Passcode_Val").val(null);
                callAlert('<i class="fa-solid fa-lock"></i>', null, null, "The passcode lock has been successfully enabled on your account", 3.25, "Close", 0, null);
            }, 350);
        }
        else {
            $("#SPL_Passcode_Val").val(null);
            $("#SetPasscodeLock_SbmtBtn").addClass("super-disabled");
            callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;></i>', null, null, "The passcode is not acceptable. Please try another one", 3.75, "Close", 0, null);
        }
        buttonUndisabler(false, "SetPasscodeLock_SbmtBtn", baseHtml);
    });
});

$(document).on("submit", "#EditPasscodeLock_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#EditPasscodeLock_SbmtBtn").html();
    buttonDisabler(false, "EditPasscodeLock_SbmtBtn", "Editing Passcode...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#PasscodeLockStatus_Span").text("Locked");
            $("#PasscodeLockIcon_Span").html('<i class="fa-solid fa-lock"></i>');
            $("#PasscodeDrop_Box-OpenBtn").removeClass("super-disabled");
            showSwitchableBox(false, "PasscodeSet_Box");
            setTimeout(function () {
                $("#EPL_Passcode_Val").val(null);
                $("#EPL_CurrentPasscode_Val").val(null);
                callAlert('<i class="fa-solid fa-pencil"></i>', null, null, "The passcode has been successfully edited", 3.25, "Close", 0, null);
            }, 350);
        }
        else {
            $("#EPL_Passcode_Val").val(null);
            $("#EPL_CurrentPasscode_Val").val(null);
            $("#EditPasscodeLock_SbmtBtn").addClass("super-disabled");
            callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;></i>', null, null, "Current passcode is not valid. Please try again", 3.5, "Close", 0, null);
        }
        buttonUndisabler(false, "EditPasscodeLock_SbmtBtn", baseHtml);
    });
});

$(document).on("submit", "#DisablePasscodeLock_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#DisablePasscodeLock_SbmtBtn").html();
    buttonDisabler(false, "DisablePasscodeLock_SbmtBtn", "Disabling Passcode...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#PasscodeLockStatus_Span").text("Disabled");
            $("#PasscodeLockIcon_Span").html('<i class="fa-solid fa-lock-open"></i>');
            $("#PasscodeDrop_Box-OpenBtn").addClass("super-disabled");
            showSwitchableBox(false, "PasscodeSet_Box");
            setTimeout(function () {
                $("#SPL_Passcode_Val").val(null);
                $("#DPL_Passcode_Val").val(null);
                callAlert('<i class="fa-solid fa-lock-open"></i>', null, null, "The passcode lock has been successfully disabled on your account", 3.5, "Close", 0, null);
            }, 350);
        }
        else {
            $("#DPL_Passcode_Val").val(null);
            $("#DisablePasscodeLock_SbmtBtn").addClass("super-disabled");
            callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;></i>', null, null, "This passcode is not valid. Please try a different one", 3.25, "Close", 0, null);
        }
        buttonUndisabler(false, "DisablePasscodeLock_SbmtBtn", baseHtml);
    });
});

$(document).on("submit", "#SendThePasscodeViaInbox_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#SendThePasscodeViaInbox_SbmtBtn").html();
    buttonDisabler(false, "SendPasscodeViaEmail_Btn", "Sending the Code...");
    buttonDisabler(false, "SendThePasscodeViaInbox_SbmtBtn", "Sending the Code...");

    $.post(url, data, function (response) {
        if (response.success) {
            callAlert('<i class="fa-solid fa-envelope-open-text"></i>', null, null, "We've sent your passcode to your email. Please check your inbox", 3.5, "Close", -1, null);
            let timerResult = timer(90, "SendThePasscodeViaInbox_SbmtBtn", 1, false).then(function () {
                if (timerResult) {
                    buttonDisabler(false, "SendPasscodeViaEmail_Btn", baseHtml);
                    buttonDisabler(false, "SendThePasscodeViaInbox_SbmtBtn", baseHtml);
                    payAttention("SendPasscodeViaEmail_Btn", 5, 0.5);
                    payAttention("SendThePasscodeViaInbox_SbmtBtn", 5, 0.5);
                }
            });
            $("#SendPasscodeViaEmail_Btn").html("Resend in 90 seconds");
        }
        else {
            callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;></i>', null, null, "Sorry, but we are currently unable to send your passcode to your email. Please try again later", 4, "Close", 0, null);
            buttonUndisabler(false, "SendPasscodeViaEmail_Btn", baseHtml);
            buttonUndisabler(false, "SendThePasscodeViaInbox_SbmtBtn", baseHtml);
        }
    });
});
$("#SendPasscodeViaEmail_Btn").on("mousedown", function () {
    $("#SendThePasscodeViaInbox_Form").submit();
});

$("#ProfileUpdateSearchname_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

   $.post(url, data, function (response) {
        if (response.success) {
            $("#Searchname_Span").html(response.result);
            $("#ProfileMainSearchname_Lbl").html(response.result);
            $("#UpdateSearchname_Searchname_Val").attr("data-base-value", response.result);
            elementDisabler(false, "UpdateSearchname_Searchname_Val", "UpdateSearchname_Status_Span", ' <i class="fa-solid fa-check-double"></i> Updated');
        }
        else {
            $("#UpdateSearchname_Searchname_Val").val($("#UpdateSearchname_Searchname_Val").attr("data-base-value"));
            elementDisabler(false, "UpdateSearchname_Searchname_Val", "UpdateSearchname_Status_Span", ' <i class="fa-solid fa-xmark"></i> Not Updated');
            if (response.result != $("#UpdateSearchname_Searchname_Val").attr("data-base-value")) callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Entered searchname is already taken", 4.25, "Close", 0, null);
        }

        setTimeout(function () {
            elementUndisabler(false, "UpdateSearchname_Searchname_Val", "UpdateSearchname_Status_Span");
        }, 2500);
    });
});

$("#ProfileUpdateMainInfo_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let defaultHtml = $("#UpdateMainInfo_SbmtBtn").html();
    buttonDisabler(false, "UpdateMainInfo_SbmtBtn", "Updating...");

    $.post(url, data, function (response) {
        if (response.success) {
            uncallAContainer(false, "EditProfile_Container");
            $(".profile-avatar").html(response.result.nickname[0]);
            $("#ProfileMainName_Lbl").html(response.result.nickname);
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Your account info has been updated", 4, "Close", 0, null);
        }
        else {
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Information updating is temporarily unavailable. Please try again later", 4, "Close", 0, null);
        }
        buttonUndisabler(false, "UpdateMainInfo_SbmtBtn", defaultHtml);
    });
});

$(document).on("submit", "#EditUserBio_Form", function (event) {
    event.preventDefault();
    $("#EditUser_Bio_Val").val(textPurger($("#EditUser_Bio_Val").val()));

    let url = $(this).attr("action");
    let data = $(this).serialize();
    //callTextCustomizationBar();
    buttonDisabler(false, "EditUser_Bio_Val-DistantSbmt_Btn", "Updating...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#EditUser_Bio_Val-Base_Val").val(response.result);
            $("#EditUser_Bio_Val-DistantSbmt_Btn").removeClass("active");
            $("#EditUser_Bio_Val-DistantSbmt_Btn").html(' <i class="fa-solid fa-check"></i> Saved');
            if (response.result != null) {
                $("#EditResults_Description_Box").fadeIn(300);
                $("#EditResults_Description_Span").html(response.result.length > 0 ? textPurification(response.result) : "No bio for this artist");
                callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Your bio has been successfully updated", 3.5, "Close", -1, null);
            }
            else {
                $("#EditResults_Description_Box").fadeOut(300);
                $("#EditResults_Description_Span").html("No bio for this artist");
                callAlert('<i class="fa-solid fa-delete-left"></i>', null, null, "Your bio has been successfully deleted", 3.5, "Close", -1, null);
            }
            slideElements(false, "BioEdit_Box", "EditUserDescription_Call_Btn");
            swapToRegularNavbar();
            //btn-change-elements

            buttonUndisabler(false, "EditUser_Bio_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
            $("#EditUser_Bio_Val-DistantSbmt_Btn").removeClass("active");
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s; --fa-animation-duration: 0.5s;"></i>', null, null, "Unable to edit your bio due to an unexpected error. Please try again later", 3.75, "Got It", -1, null);

        buttonUndisabler(false, "EditUser_Bio_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
        $("#EditUser_Bio_Val-DistantSbmt_Btn").removeClass("active");
    });
});

$(document).on("submit", "#EditUserType_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize(); /*EditUserType_Type_Val*/
    buttonDisabler(false, "EditUserType_Type_Val-DistantSbmt_Btn", "Pending...");

    $.post(url, data, function (response) {
        if (response.success) {
            const artistTypesArr = ["Solo", "DJ/Producer", "Band/Group", "Duo", "Orchestras", "Ensembles", "Choirs", "Collectives", "Theatre Artists"];
            let artistType = artistTypesArr[parseInt(response.result)];

            if (response.result > 1) $("#YearsOfActivity_Header_Lbl").html("Formed");
            else $("#YearsOfActivity_Header_Lbl").html("Born");

            callAlert('<i class="fa-solid fa-list-check"></i>', null, null, "Your profile type has been successfully changed to <span class='fw-500'>" + artistType + "</span> one", 3.75, "Close", -1, null);
            buttonUndisabler(false, "EditUserType_Type_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
            $("#EditUserType_Type_Val-DistantSbmt_Btn").removeClass("active");
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s; --fa-animation-duration: 0.5s;"></i>', null, null, "Unable to change your profile type due to an unexpected error. Please try again later", 3.75, "Close", -1, null);

        callAlert('<i class="fa-solid fa-list-check"></i>', null, null, "Your profile type has been successfully changed to <span class='fw-500'>" + artistType + "</span> one", 3.75, "Close", -1, null);
        buttonUndisabler(false, "EditUserType_Type_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
    });
});

$(document).on("submit", "#EditUserMainGenre_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "EditUserMainGenre_Id_Val-DistantSbmt_Btn", "Updating...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#EditUserMainGenre_Id_Val-Base_Val").val(response.id);
            if (response.result != null) {
                let separatorDots = document.getElementsByClassName("separator-dot");
                for (let i = 0; i < separatorDots.length; i++) {
                    if (separatorDots[i].id != "EditResults_MainGenre_Span" && $("#" + separatorDots[i].id).hasClass("active")) {
                        $("#EditResults_MainGenre_Span-Separator").fadeIn(0);
                        break;
                    }
                }

                $("#EditResults_MainGenre_Span").fadeIn(0);
                $("#EditResults_MainGenre_Span").addClass("active");
                $("#EditResults_MainGenre_Span").html(' <i class="fa-solid fa-drum"></i> ' + response.result);
            }
            else {
                $("#EditResults_MainGenre_Span").html("Unknown");
                $("#EditResults_MainGenre_Span").removeClass("active");
            }

            callAlert('<i class="fa-solid fa-music"></i>', null, null, "You've successfully updated your main genre", 3.5, "Close", -1, null);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s; --fa-animation-duration: 0.5s;"></i>', null, null, "Something went wrong. Please try to update your main genre information later", 3.75, "Close", -1, null);

        buttonUndisabler(false, "EditUserMainGenre_Id_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
        $("#EditUserType_Type_Val-DistantSbmt_Btn").removeClass("active");
    });
});

$(document).on("submit", "#EditUserYearsOfActivity_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "EditYearsOfActivity_DateTime_Val-DistantSbmt_Btn", "Changing...");

    $.post(url, data, function (response) {
        if (response.success) {
            let artistDateTime = new Date(response.result);
            artistDateTime = dateAndTimeFormation(1, artistDateTime)[1];
            let stringArtistDateTime = artistDateTime[0] + " " + monthsArr[--artistDateTime[1]] + ", " + artistDateTime[2];

            if (stringArtistDateTime != null) {
                let separatorDots = document.getElementsByClassName("separator-dot");

                $("#EditResults_FormedAt_Span").fadeIn(0);
                $("#EditResults_FormedAt_Span").addClass("active");
                $("#EditResults_FormedAt_Span").html(' <i class="fa-solid fa-flag-checkered"></i> ' + stringArtistDateTime);
                for (let i = 0; i < separatorDots.length; i++) {
                    if (separatorDots[i].id != "EditResults_FormedAt_Span" && $("#" + separatorDots[i].id).hasClass("active")) {
                        $("#EditResults_FormedAt_Span-Separator").fadeIn(0);
                        break;
                    }
                }
            }
            else {
                $("#EditResults_FormedAt_Span").html("Unknown");
                $("#EditResults_FormedAt_Span").removeClass("active");
                $("#EditResults_FormedAt_Span-Separator").fadeOut(300);
            }
            buttonUndisabler(false, "EditYearsOfActivity_DateTime_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
            $("#EditYearsOfActivity_DateTime_Val-DistantSbmt_Btn").removeClass("active");

            callAlert('<i class="fa-regular fa-clock fa-spin" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 1; --fa-animation-delay: 0.35s;"></i>', null, null, "The date marking the start of your journey has been updated", 3.5, "Close", -1, null);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s; --fa-animation-duration: 0.5s;"></i>', null, null, "Unfortunately we cannot update this profile settings due to an unexpected error. Please try again later", 3.75, "Close", -1, null);

        buttonUndisabler(false, "EditYearsOfActivity_DateTime_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
        $("#EditYearsOfActivity_DateTime_Val-DistantSbmt_Btn").removeClass("active");
    });
});

$(document).on("submit", "#EditUserLocaion_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "EditUserLocaion_Id_Val-DistantSbmt_Btn", "Relocating...");

    $.post(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                let separatorDots = document.getElementsByClassName("separator-dot");

                $("#EditResults_Location_Span").fadeIn(0);
                $("#EditResults_Location_Span").addClass("active");
                $("#EditResults_Location_Span").html("from <span class='fw-500'>" + response.result + "</span>");
                for (let i = 0; i < separatorDots.length; i++) {
                    if (separatorDots[i].id != "EditResults_Location_Span" && $("#" + separatorDots[i].id).hasClass("active")) {
                        $("#EditResults_Location_Span-Separator").fadeIn(0);
                        break;
                    }
                }
            }
            else {
                $("#EditResults_Location_Span").html("Unknown");
                $("#EditResults_Location_Span").removeClass("active");
                $("#EditResults_Location_Span-Separator").fadeOut(300);
            }
            callAlert('<i class="fa-solid fa-earth-americas"></i>', null, null, "Your location has been updated successfully", 3.25, "Close", -1, null);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s; --fa-animation-duration: 0.5s;"></i>', null, null, "It seems that an unexpected error occured. Please try again later", 3.5, "Close", -1, null);

        buttonUndisabler(false, "EditUserLocaion_Id_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
        $("#EditUserLocaion_Id_Val-DistantSbmt_Btn-DistantSbmt_Btn").removeClass("active");
    });
});

$(document).on("submit", "#EditUserWebsite_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "EditUserWebsite_Webpage_Val-DistantSbmt_Btn", "Websiting...");

    $.post(url, data, function (response) {
        if (response.success) {
            let currentLink = new Location();
            currentLink.href = response.result;

            $("#EditResults_WebsiteLink_Span").html(currentLink.hostname);
            $("#EditResults_WebsiteLink_Btn").attr("data-link", response.result);
            $("#EditResults_WebsiteLink_Span").removeClass("super-disabled");

            callAlert('<i class="fa-solid fa-link"></i>', null, null, "", 3.5, "Close", -1, null);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s; --fa-animation-duration: 0.5s;"></i>', null, null, "Unable to update your website data for your profile due to an unexpected error. Please try again later", 3.75, "Close", -1, null);

        buttonUndisabler(false, "EditUserWebsite_Webpage_Val-DistantSbmt_Btn", ' <i class="fa-regular fa-circle-check"></i> Saved');
        $("#EditUserWebsite_Webpage_Val-DistantSbmt_Btn").removeClass("active");
    });
});

$(document).on("mousedown", ".btn-distance-submitter", function () {
    let thisId = $(this).attr("id");
    let formId = $(this).attr("data-form");
    if (thisId != undefined && formId != undefined) $("#" + formId).submit();
});

$(document).on("submit", "#ProfileUpdatePrivacySettings_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#ProfileUpdatePrivacySettings_SbmtBtn").html();
    buttonDisabler(false, "ProfileUpdatePrivacySettings_SbmtBtn", "Updating...");

    $.post(url, data, function (response) {
        if (response.success) {
            uncallAContainer(false, "PrivacySettings_Container");
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Your account's privacy settings has been updated", 4, "Close", 0, null);
        }
        else {
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Privacy info updating is temporarily unavailable. Please try again later", 4, "Close", 0, null);
        }
        buttonUndisabler(false, "ProfileUpdatePrivacySettings_SbmtBtn", baseHtml);
    });
});

$("#EditProfileImages_Form").on("submit", function (event) {
    event.preventDefault();

    let url = $(this).attr("action");
    let formData = new FormData();
    let files = $("#EditImage_Files_Val").get(0).files;
    let filesLength = files.length > 6 ? 6 : files.length;
    for (let i = 0; i < filesLength; i++) {
        formData.append("files", files[i]);
    }
    buttonDisabler(true, "btn-save-images", "Loading...");
    elementDisabler(true, "btn-save-images", "profile-avatar", '<i class="fa-solid fa-spinner fa-spin-pulse"></i>');

    $.ajax({
        data: formData,
        url: url,
        type: "POST",
        contentType: false,
        processData: false,
        success: function (response) {
            uncallAContainer(false, "ImagePreview_Container");
            if (response.success) {
                $(".profile-avatar-img").attr("src", "/ProfileImages/" + response.result);
                $(".profile-avatar").fadeOut(0);
                $(".profile-avatar-img").fadeIn(0);
            }
            else {
                setTimeout(function () {
                    callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Avatar editing is temporarily unavailable. Please, try again later", 4, "Close", 0, null);
                }, 350);
            }
            buttonUndisabler(true, "btn-save-images", "Save");
            elementUndisabler(true, null, "profile-avatar");
        }
    });
});

$("#ProfileSetImageAsMain_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#PSIAM_SbmtBtn").html();
    buttonDisabler(false, "PSIAM_SbmtBtn", '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Syncinc...');

    $.post(url, data, function (response) {
        if (response.success) {
            $("#PSIAM_ImgUrl_Val").val(null);
            let allNeededInputs = document.getElementsByClassName("form-control-img");
            for (let i = 0; i < allNeededInputs.length; i++) {
                if (allNeededInputs[i].id != "") {
                    if ($("#" + allNeededInputs[i].id).val() == response.result) {
                        $("#" + allNeededInputs[i].id).val($("#0-ImgHdn_Val").val());
                        break;
                    }
                }
            }
            $(".profile-counter-slider").removeClass("bg-chosen");
            $("#0-ImgHdn_Val").val(response.result);
            $("#0-ImgSlider_Box").addClass("bg-chosen");
            $("#PGI_Skip_Val").val(0);
            $("#PDI_ImgUrl_Val").val(response.result);
            $("#PSIAM_ImgUrl_Val").val(response.result);
            $(".profile-avatar-img").attr("src", "/ProfileImages/" + response.result);
            $(".profile-avatar-img-enlarged").attr("src", "/ProfileImages/" + response.result);
        }
        else {
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Avatar editing is temporarily unavailable. Please, try again later", 4, "Close", 0, null);
        }
        buttonUndisabler(false, "PSIAM_SbmtBtn", baseHtml);
    });
});

$("#ProfileDeleteImage_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#ProfileDeleteImage_SbmtBtn").html();
    buttonDisabler(false, "ProfileDeleteImage_SbmtBtn", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Deleting...');

    $.post(url, data, function (response) {
        if (response.success) {
            $("#PSIAM_ImgUrl_Val").val(null);
            let allNeededInputs = document.getElementsByClassName("form-control-img");
            for (let i = 0; i < allNeededInputs.length; i++) {
                if (allNeededInputs[i].id != "") {
                    if ($("#" + allNeededInputs[i].id).val() == response.deleted) {
                        $("#" + allNeededInputs[i].id).remove();
                        $("#AvatarsCounter_Box").empty();
                    }
                    else $("#" + allNeededInputs[i].id).attr("id", i + "-ImgHdn_Val");
                }
            }
            allNeededInputs = document.getElementsByClassName("form-control-img");
            $("#ImagesQty_Val").val(allNeededInputs.length);
            for (let i = 0; i < allNeededInputs.length; i++) {
                let column = $("<div class='col'></div>");
                let slider = $("<div class='profile-counter-slider'></div>");
                if (i == 0) slider.addClass("bg-chosen");
                slider.attr("id", i + "-ImgSlider_Box");
                column.attr("id", i + "-ImgColumn_Box");
                column.append(slider);
                $("#AvatarsCounter_Box").append(column);
            }

            $(".profile-counter-slider").removeClass("bg-chosen");
            $("#0-ImgHdn_Val").val(response.result);
            $("#0-ImgSlider_Box").addClass("bg-chosen");
            $("#PGI_Skip_Val").val(0);
            $("#PDI_ImgUrl_Val").val(response.result);
            $("#PSIAM_ImgUrl_Val").val(response.result);
            $(".profile-avatar-img").attr("src", "/ProfileImages/" + response.result);
            $(".profile-avatar-img-enlarged").attr("src", "/ProfileImages/" + response.result);
        }
        else {
            callAlert('<i class="fa-solid fa-image"></i>', null, null, "Avatar deleting caused an unexpected error. Please, try again later", 4.25, "Close", 0, null);
        }
        buttonUndisabler(false, "ProfileDeleteImage_SbmtBtn", baseHtml);
    });
});

$("#ProfileDeleteAllImages_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#ProfileDeleteAllImages_SbmtBtn").html();
    buttonDisabler(false, "ProfileDeleteAllImages_SbmtBtn", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Deleting...');

    $.post(url, data, function (response) {
        if (response.success) {
            $("#PGI_Skip_Val").val(0);
            $("#PSIAM_ImgUrl_Val").val(null);
            $("#PDI_ImgUrl_Val").val(null);
            $(".form-control-img").remove();
            $(".btn-exit-photo-mode").mousedown();
            setTimeout(function () {
                $(".profile-avatar-img").attr("src", "#");
                $(".profile-avatar-img").fadeOut(0);
                $(".profile-avatar").fadeIn(0);
            }, 600);
        }
        else {
            callAlert('<i class="fa-solid fa-image"></i>', null, null, "An unexpected error occurred while deleting profile images. Please try again later", 4.25, "Close", 0, null);
        }
        buttonUndisabler(false, "ProfileDeleteAllImages_SbmtBtn", baseHtml);
    });
});

$("#GetAccountPersonalInformation_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#GetAccountPersonalInformation_SbmtBtn").html();
    buttonDisabler(false, "GetAccountPersonalInformation_SbmtBtn", "Loading...");

    $.get(url, data, function (response) {
        if (response.success) {
            createAContainer("PersonalInfo", "Personal Info", '<div class="box-vertical-switcher shadow-sm" id="PersonalInfo_VS_Box"> <div class="box-vertical-switcher-header hstack gap-1"> <button type="button" class="btn btn-standard-bolded btn-close-vertical-switcher btn-sm ms-auto">Done</button> </div> <div class="mt-2" id="PersonalInfo_VS_Box-Items_Box"> <span class="h5" id="PersonalInfo_VM_Box-MembersQty_Lbl"></span> <div></div> <small class="card-text text-muted">Tap on each member to remove them</small> <div class="mt-2" id="PersonalInfo_VM_Box-MembersListed_Box"> </div> </div> </div> <div class="box-bordered p-2"> <span class="h4" id="PersonaInfo_RealName_Lbl">Donald J. Trump</span> <div class="hstack gap-1"> <small class="card-text me-1" id="PersonaInfo_CountryInfo_Lbl"> <img src="https://flagcdn.com/16x12/jp.png" srcset="https://flagcdn.com/32x24/jp.png 2x, https://flagcdn.com/48x36/jp.png 3x" width="20" height="15" alt="Japan"> Japan </small> <button type="button" class="btn btn-link btn-sm" id="PersonalInfo_WebpageLink_Btn"><span class="card-text text-muted"> <i class="fa-solid fa-link"></i> </span> <span id="WebpageLink_Span">DonaldJTrump.com</span></button> </div> </div> <div class="mt-2"> <form method="post" action="/Profile/EditPersonalInfo" id="ProfileEditPersonal_Info"> <div> <span class="form-label fw-500 ms-1">Full Name</span> <div class="mt-1" id="EPI_Fullnames_Box"> <button type="button" class="btn btn-standard-bordered btn-add-element btn-sm" id="AddRealNameMember_Btn" data-prototype="EPI_RealName-0" data-remove-btn="PersonalInfo_VS_Box-OpenBtn"> <i class="fa-solid fa-user-plus"></i> Add Member</button> <button type="button" class="btn btn-standard-bordered btn-elements-listed btn-open-vertical-switcher btn-sm" id="PersonalInfo_VS_Box-OpenBtn" data-prototype="EPI_RealName-0" style="display: none;"> <i class="fa-solid fa-user-minus"></i> Remove Member</button> <button type="button" class="btn btn-standard-bordered btn-sm ms-1" id="EPI_RealnamesCounter_Span">0/350</button> <input type="text" class="form-control form-control-juxtaposed mt-1" name="RealName" id="EPI_RealName-0" placeholder="Provide your full name" data-update="PersonaInfo_RealName_Lbl" data-base-value="Unknown" data-target="EditPersonalInfo_SbmtBtn" data-counter-display="EPI_RealnamesCounter_Span" data-counter-maxlength="350" data-index="0" /> <input type="text" class="d-none" name="CountryId" id="EPI_CountryId_Val" value="0" /> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="EPI_RealName-Warn" data-list="false">If you are a band, add extra rows to list all band your names</small > </div > <div class="mt-3"> <label class="form-label fw-500 ms-1">Webpage Link</label> <input type="text" class="form-control form-control-guard" name="WebpageLink" id="EPI_WebPage_Val" data-update="WebpageLink_Span" data-base-value="Not provided" placeholder="https://webpagelink.com/" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Enter the link to your official webpage (if available). This field is optional</small> </div> <div class="mt-3"> <span class="form-label fw-500 ms-1">Country</span> <div class="mt-1" id="CountryBtn_Box"> <button type="button" class="btn btn-standard-bordered btn-load-countries btn-sm" id="LoadCountries_Btn" data-is-loaded="false"> <img src="https://flagcdn.com/20x15/de.png" srcset="https://flagcdn.com/40x30/jp.png 2x, https://flagcdn.com/60x45/jp.png 3x" width="20" height="15" alt="Japan" /> Japan </button> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Tap the button to choose your country</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled w-100" id="EditPersonalInfo_SbmtBtn">Save Changes</button> </div> </form> </div>', null, null);
            if (response.result.realName != null) {
                $("#PersonaInfo_RealName_Lbl").html(response.result.realName);
                let realNames = getCommaSeparatedValues(response.result.realName);
                if (realNames.length > 1) {
                    $("#EPI_RealName-0").val(realNames[0]);
                    for (let i = 0; i < realNames.length - 1; i++) {
                        let acutalIndex = i + 1;
                        let id = copyAnElement("EPI_RealName-" + i, true);
                        $("#" + id).val(realNames[acutalIndex]);
                    }
                    $("#PersonalInfo_VS_Box-OpenBtn").fadeIn(300);
                }
                else {
                    $("#EPI_RealName-0").val(realNames[0]);
                    $("#PersonalInfo_VS_Box-OpenBtn").fadeOut(300);
                }
                let trueLength = parseInt(realNames.length) - 1;
                let maxLength = $("#EPI_RealName-0").attr("data-counter-maxlength");
                $("#AddRealNameMember_Btn").attr("data-prototype", "EPI_RealName-" + trueLength);
                juxtaposedCharsCounter("EPI_RealName-0", maxLength, "EPI_RealnamesCounter_Span");
            }
            else $("#PersonaInfo_RealName_Lbl").text("Unknown");
            if (response.result.countryId > 0) {
                $("#LoadCountries_Btn").html(createCountryFlagIcon(response.result.country.shortname, 20, 15) + " " + response.result.country.name);
                $("#PersonaInfo_CountryInfo_Lbl").html(createCountryFlagIcon(response.result.country.shortname, 20, 15) + " " + response.result.country.name);
            }
            else {
                $("#LoadCountries_Btn").text("Tap to Show");
                $("#PersonaInfo_CountryInfo_Lbl").html(' <i class="fa-solid fa-flag-checkered"></i> ' + 'Country not provided');
            }
            if (response.result.webpage != null) {
                $("#EPI_WebPage_Val").val(response.result.webpage);
                $("#WebpageLink_Span").html(response.result.webpage);
            }
            else {
                $("#EPI_WebPage_Val").val(null);
                $("#WebpageLink_Span").text("Web page not provided");
            }
        }
        else {
            callAlert('<i class="fa-solid fa-image"></i>', null, null, "Personal information is temporarily unavailable", 3.5, "Close", 0, null);
        }
        buttonUndisabler(false, "GetAccountPersonalInformation_SbmtBtn", baseHtml);

        setTimeout(function () {
            slideContainers(null, "PersonalInfo_Container");
        }, 150);
    });
});

$(document).on("submit", "#ReleaseASingle_Form", function (event) {
    event.preventDefault();
    let data = new FormData();
    const url = $(this).attr("action");
    let baseHtml = $("#ReleaseASingle_SbmtBtn").html();

    const trackFile = $("#RAS_TrackFileUrl_Val").get(0).files[0];
    const coverImg = $("#RAS_CoverImg_Url").get(0).files[0];
    const title = $("#RAS_Title_Val").val();
/*    const releaseDate = $("#RAS_ReleaseDate_Val").val();*/
    const hasExplicit = $("#RAS_HasExplicit_Val").val();
    const releaseDateDay = parseInt($("#RAS_ReleaseDate_Val-Day").val());
    const releaseDateMonth = parseInt($("#RAS_ReleaseDate_Val-Month").val());
    const releaseDateYear = parseInt($("#RAS_ReleaseDate_Val-Year").val());
    const genres = document.getElementsByClassName("included-genres");//add-as-genre;
    const artists = document.getElementsByClassName("listed-artist-name-val"); //add-as-artist;
    const genreNames = document.getElementsByClassName("included-genre-names-val"); //add-as-genre;

    data.append("title", title);
    data.append("hasExplicit", hasExplicit);
    data.append("trackFileUrl", trackFile);
    data.append("coverImageUrl", coverImg);
    data.append("releaseDateDay", releaseDateDay);
    data.append("releaseDateMonth", releaseDateMonth);
    data.append("releaseDateYear", releaseDateYear);
    if (genres.length > 0) {
        for (let i = 0; i < genres.length; i++) {
            data.append("genres", $("#" + genres[i].id).val());
            data.append("genreNames", $("#" + genreNames[i].id).val());
        }
    }
    if (artists.length > 0) {
        for (let i = 0; i < artists.length; i++) {
            data.append("featuringArtists", $("#" + artists[i].id).val());
        }
    }
    buttonDisabler(false, "ReleaseASingle_SbmtBtn", "Uploading and Saving...");

    $.ajax({
        url: url,
        type: "POST",
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                if (response.result != null) {     
                    createSmContainer("StudioMusic", "Your Studio ∙ <span id='StudioItemsQty_Span'>0</span>", '<div class="x-row-sliding-only-box mt-2" id="SelfMusic_Box"></div>', null, null, false);
                    let currentLength = parseInt($("#StudioItemsQty_Span").text());
                    $("#StudioItemsQty_Span").text(++currentLength);
                    studioItemSampler(response.result.id, response.result.title, response.result.coverImageUrl, response.result.releasedAtDt, 1, "Singles_Box", true);
                    setTimeout(function () {
                        callASmContainer(false, "StudioMusic_Container");
                    }, 150);
                }
                callAlert(' <i class="fa-solid fa-forward-step"></i> ', null, null, "Track saved successfully. To make it visible to everyone, please submit it and add credits and lyrics (optional)", 4, "Close", -1, null);
            }
            else {
                callAlert('<i class="fa-solid fa-circle-exclamation fa-shake" --fa-animation-duration: 0.8s; --fa-animation-iteration-count: 3; --fa-animation-delay: 0.3s;></i>', null, null, response.alert, 4, "Close", -1, null);
            }
            buttonUndisabler(false, "ReleaseASingle_SbmtBtn", baseHtml);
        }
    });
});

$(document).on("submit", "#GetStudioSingles_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                let isReady = document.getElementById("StudioItems_Container");
                if (isReady == null) createInsideLgCard("StudioItems", null, '<div class="box-standard x-row-sliding-only-box mt-2 p-1"> <button type="button" class="btn btn-standard btn-standard-rounded btn-distance-submitter btn-track-boxes checked me-1" data-form="GetStudioSingles_Form" data-base-class="track-boxes" id="Singles_Box-Select_Btn">Singles ∙ <span class="card-text" id="Studio_SinglesQty_Span">0</span></button> <button type="button" class="btn btn-standard btn-standard-rounded btn-distance-submitter btn-track-boxes checked me-1" data-form="GetStudioAlbums_Form" data-base-class="track-boxes" id="Albums_Box-Select_Btn">Albums ∙ <span class="card-text" id="Studio_AlbumsQty_Span">0</span></button> <button type="button" class="btn btn-standard btn-standard-rounded btn-distance-submitter btn-track-boxes checked me-1" data-form="GetStudioSingles_Form" data-base-class="track-boxes" id="Playlists_Box-Select_Btn">Playlists ∙ <span class="card-text" id="Studio_PlaylistsQty_Span">0</span></button> </div> <div class="box-standard mt-1 p-1"> <form method="get" action="/Search/InStudio" id="SearchInsideOfStudio_Form"> <div class="hstack gap-1"> <input type="hidden" name="Type" id="SIOS_Type_Val" value="0" /> <input type="text" class="form-control liquid-glass-search" placeholder="Search..." name="Keyword" id="SIOS_Search_Val" /> <button type="submit" class="btn btn-standard rounded-af ms-auto" id="SearchInsideOfStudio_SbmtBtn"> <i class="fa-solid fa-magnifying-glass"></i></button> </div> </form> </div> <div class="box-standard track-boxes p-2 mt-1" id="Singles_Box"> <h4 class="h4">Singles</h4> <div class="box-standard mt-2" id="SinglesCollection_Box"> <div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-music"></i> </h2> <h4 class="h4">No Singles</h4> <small class="card-text text-muted">You have not uploaded any singles yet</small> </div> </div> </div> <div class="box-standard track-boxes p-2" id="Albums_Box" style="display: none;"> <h4 class="h4">Albums</h4> <div class="box-standard mt-2" id="AlbumsCollection_Box"> <div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-compact-disc"></i> </h2> <h4 class="h4">No Albums</h4> <small class="card-text text-muted">You have not uploaded any albums yet</small> </div> </div> </div>', null, null);

                $("#SinglesCollection_Box").empty();
                $(".btn-track-boxes").removeClass("checked");
                $("#Singles_Box-Select_Btn").removeClass("active");
                $("#Singles_Box-Select_Btn").removeClass("btn-distance-submitter");
                $("#Singles_Box-Select_Btn").addClass("btn-select-button-bar checked");
                slideBoxes(true, "track-boxes", "Singles_Box");

                $("#Studio_AlbumsQty_Span").text(response.albumsCount.toLocaleString());

                if (response.albumsCount > 0) {
                    $("#Albums_Box-Select_Btn").addClass("active");
                    buttonUndisabler(false, "Albums_Box-Select_Btn", null);
                }
                else {
                    $("#Albums_Box-Select_Btn").removeClass("active");
                    buttonDisabler(false, "Albums_Box-Select_Btn", null);
                }

                if (response.result.length > 0) {
                    $("#Studio_SinglesQty_Span").text(response.result.length.toLocaleString());
                    $.each(response.result, function (index) {
                        studioSinglesSampler(response.result[index].id, response.result[index].title, response.result[index].coverImageUrl, response.result[index].releasedAt, response.result[index].status, "SinglesCollection_Box", true);
                    });
                }
                else {
                    $("#SinglesCollection_Box").html('<div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-music"></i> </h2> <h4 class="h4">No Singles</h4> <small class="card-text text-muted">You have not uploaded any singles yet</small> </div>');
                }

                let isOpen = isContainerOpen("StudioItems_Container");
                if (!isOpen) {
                    setTimeout(function () {
                        callInsideLgContainer(false, "StudioItems_Container", false);
                    }, 150);
                }
            }
        }
        else {
            callAlert('<i class="fa-solid fa-microphone-lines-slash"></i>', null, null, "Studio items are temporarily unavailable", 3.75, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#GetStudioAlbums_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            let isReady = document.getElementById("StudioItems_Container");
            if (isReady == null) createInsideLgCard("StudioItems", null, '<div class="box-standard x-row-sliding-only-box mt-2 p-1"> <button type="button" class="btn btn-standard btn-standard-rounded btn-distance-submitter btn-track-boxes checked me-1" data-form="GetStudioSingles_Form" data-base-class="track-boxes" id="Singles_Box-Select_Btn">Singles ∙ <span class="card-text" id="Studio_SinglesQty_Span">0</span></button> <button type="button" class="btn btn-standard btn-standard-rounded btn-distance-submitter btn-track-boxes checked me-1" data-form="GetStudioAlbums_Form" data-base-class="track-boxes" id="Albums_Box-Select_Btn">Albums ∙ <span class="card-text" id="Studio_AlbumsQty_Span">0</span></button> <button type="button" class="btn btn-standard btn-standard-rounded btn-distance-submitter btn-track-boxes checked me-1" data-form="GetStudioSingles_Form" data-base-class="track-boxes" id="Playlists_Box-Select_Btn">Playlists ∙ <span class="card-text" id="Studio_PlaylistsQty_Span">0</span></button> </div> <div class="box-standard mt-1 p-1"> <form method="get" action="/Search/InStudio" id="SearchInsideOfStudio_Form"> <div class="hstack gap-1"> <input type="hidden" name="Type" id="SIOS_Type_Val" value="0" /> <input type="text" class="form-control liquid-glass-search" placeholder="Search..." name="Keyword" id="SIOS_Search_Val" /> <button type="submit" class="btn btn-standard rounded-af ms-auto" id="SearchInsideOfStudio_SbmtBtn"> <i class="fa-solid fa-magnifying-glass"></i></button> </div> </form> </div> <div class="box-standard track-boxes p-2 mt-1" id="Singles_Box"> <h4 class="h4">Singles</h4> <div class="box-standard mt-2" id="SinglesCollection_Box"> <div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-music"></i> </h2> <h4 class="h4">No Singles</h4> <small class="card-text text-muted">You have not uploaded any singles yet</small> </div> </div> </div> <div class="box-standard track-boxes p-2" id="Albums_Box" style="display: none;"> <h4 class="h4">Albums</h4> <div class="box-standard mt-2" id="AlbumsCollection_Box"> <div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-compact-disc"></i> </h2> <h4 class="h4">No Albums</h4> <small class="card-text text-muted">You have not uploaded any albums yet</small> </div> </div> </div>', null, null);

            $("#AlbumsCollection_Box").empty();
            $(".btn-track-boxes").removeClass("checked");
            $("#Albums_Box-Select_Btn").removeClass("active");
            $("#Albums_Box-Select_Btn").removeClass("btn-distance-submitter");
            $("#Albums_Box-Select_Btn").addClass("btn-select-button-bar checked");
            slideBoxes(true, "track-boxes", "Albums_Box");

            if (response.result.length > 0) {
                $.each(response.result, function (index) {
                    studioAlbumsSampler(response.result[index].id, response.result[index].title, response.result[index].coverImageUrl, response.result[index].premieredAt, response.result[index].status, "AlbumsCollection_Box", true);
                });
            }
            else {
                $("#AlbumsCollection_Box").html('<div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-compact-disc"></i> </h2> <h4 class="h4">No Albums</h4> <small class="card-text text-muted">You have not uploaded any albums yet</small> </div>');
            }

            let isOpen = isContainerOpen("StudioItems_Container");
            if (!isOpen) {
                setTimeout(function () {
                    callInsideLgContainer(false, "StudioItems_Container", false);
                }, 150);
            }
        }
        else {
            callAlert('<i class="fa-solid fa-microphone-lines-slash"></i>', null, null, "You haven't created/added any album yet", 3.75, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#GetAlbumInfo_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.type == 0) {
                let currentDate = new Date();
                let premiereDate = new Date(response.result.premieredAt);
                let isPremiere = premiereDate.getTime() > currentDate.getTime() ? true : false;

                albumInfoSampler(response.result.id, response.result.title, response.result.description, response.result.coverImageUrl, response.result.version, response.result.premieredAt, response.result.tracks.length, response.result.userId, response.result.mainArtist, response.result.genreId, response.result.genre, response.userId, response.result.status, isPremiere, true);
                if (response.result.tracks.length > 0) {
                    albumSongsApplier(response.result.tracks, response.result.mainArtist, "AlbumSongs_Box", "AlbumInfo_SongsQty_Span", false, 0);
                }
                else {
                    $("#AlbumSongs_Box").empty();
                    $("#AlbumSongs_Box").html('<div class="box-standard text-center mt-3"> <h2 class="h2"> <i class="fa-solid fa-compact-disc fa-spin"></i> </h2> <h4 class="h4">Album is Empty</h4> <small class="card-text text-muted">This album doesn’t have any tracks yet</small> </div>');
                }
                createInsideLgCard("EditAlbumMetadata", "Edit Metadata", '<div class="box-standard"> <div> <form method="post" action="/Album/EditMetadata" id="EditAlbumMetadata_Form"> <div class="d-none"> <input type="hidden" name="Id" id="EditAlbumMetadata_Id_Val" value="0" /> </div> <div> <button type="button" class="btn btn-standard-rounded btn-tooltip btn-sm float-end ms-1" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-placement="top" data-bs-title="Prohibited characters: [/ \ ? % * : | < >]"> <i class="fa-regular fa-circle-question"></i> </button> <label class="form-label fw-500 ms-1">Title</label> <input type="text" class="form-control form-control-guard" name="Title" id="EditAlbumMetadata_Title_Val" placeholder="Title of Album" data-min-length="1" data-update="AlbumInfo_Title_Lbl" data-target="EditAlbumMetadata_SbmtBtn" data-base-value="Title of Album" maxlength="100" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Album title can be up to 100 characters. Certain characters are not allowed</small> </div> <div class="mt-3"> <button type="button" class="btn btn-standard-rounded btn-sm float-end ms-1"><span class="card-text" id="EditAlbumMetadata_Description_Val-Indicator_Span">0</span>/1500</button> <label class="form-label fw-500 ms-1">Description</label> <textarea class="form-control form-textarea form-control-guard" rows="1" maxlegth="1500" data-min-length="1" placeholder="Album description..." id="EditAlbumMetadata_Description_Val"></textarea> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Album description is optional</small> </div> <div class="box-standard mt-3"> <button type="submit" class="btn btn-standard-rounded btn-classic-styled super-disabled text-center w-100" id="EditAlbumMetadata_SbmtBtn">Save Changes</button> </div> </form> </div> </div>', null, null);
                $("#EditAlbumMetadata_Id_Val").val(response.result.id);
                $("#EditAlbumMetadata_Title_Val").val(response.result.title);
                $("#EditAlbumMetadata_Description_Val").val(response.result.description);

                uncallLgInsideContainer(false, "StudioItems_Container");
                setTimeout(function () {
                    slideContainers(null, "AlbumInfo_Container");
                    //GetTracksInfo_Form
                }, 300);
            }
        }
        else {
            callAlert('<i class="fa-solid fa-compact-disc fa-spin"></i>', null, null, "Album information is temporarily unavailable", 3.5, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#EditAlbumMetadata_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#EditAlbumMetadata_SbmtBtn").html();
    buttonDisabler(false, "EditAlbumMetadata_SbmtBtn", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Editing...');

    $.post(url, data, function (response) {
        if (response.success) {
            uncallLgInsideContainer(false, "EditAlbumMetadata_Container");
            setTimeout(function () {
                callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Album metadata updated successfully", 3.5, "Close", -1, null);
            }, 600);
            buttonUndisabler(false, "EditAlbumMetadata_SbmtBtn", baseHtml);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Please review the title. It contains prohibited characters", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Please sign in to edit your albums and tracks", 3.5, "Sign In", 2, null);
        }
    });
});

$(document).on("submit", "#EditAlbumCoverImage_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const baseHtml = $("#EditAlbumCoverImage_File_Val-BtnSbmt").html();

    let formData = new FormData();
    let id = $("#EditAlbumCoverImage_Id_Val").val();
    let file = $("#EditAlbumCoverImage_File_Val").get(0).files[0];
    formData.append('id', id);
    formData.append("coverImage", file);

    $("#EditAlbumCoverImage_File_Val-BtnSbmt").removeClass("active");
    buttonDisabler(false, "EditAlbumCoverImage_File_Val-UploadBtn", null);
    buttonDisabler(false, "EditAlbumCoverImage_File_Val-BtnSbmt", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Uploading...');

    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                if (response.result != null) {
                    $("#AlbumInfo_Img").attr("src", "/AlbumCovers/" + response.result + "?ts=" + new Date().getTime());
                    $("#AlbumInfo_Img_Box").fadeOut(0);
                    $("#AlbumInfo_Img").fadeIn(0);
                    //btn-upload-image

                    callKawaiiAlert(0, "Album cover updated", '<i class="fa-solid fa-arrows-rotate anime-spin-shift"></i>', null, null, 2, false);
                    setTimeout(function () {
                        bubbleOut(false, "EditAlbumCoverImage_File_Val-BtnSbmt");
                        $("#EditAlbumCoverImage_File_Val-BtnSbmt").addClass("active");
                        buttonUndisabler(false, "EditAlbumCoverImage_File_Val-UploadBtn", null);
                        buttonUndisabler(false, "EditAlbumCoverImage_File_Val-BtnSbmt", baseHtml);
                    }, 2000);
                    $("#AlbumInfo_Img-DeletePreviewImg_Btn").addClass("super-disabled");
                }
                else {
                    if (response.error == 0) {
                        callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Unsupported image format. Please use .jpg, .jpeg, or .png", 3.5, "Close", -1, null);
                        setTimeout(function () {
                            bubbleOut(false, "EditAlbumCoverImage_File_Val-BtnSbmt");
                            $("#EditAlbumCoverImage_File_Val-BtnSbmt").addClass("active");
                            buttonUndisabler(false, "EditAlbumCoverImage_File_Val-UploadBtn", null);
                            buttonUndisabler(false, "EditAlbumCoverImage_File_Val-BtnSbmt", baseHtml);
                        }, 1500);
                    }
                    else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Please sign in to edit your albums and tracks", 3.5, "Sign In", 2, null);
                }
            }
        }
    });
});

$(document).on("submit", "#SubmitTheAlbum_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#SubmitTheAlbum_SbmtBtn").html();
    buttonDisabler(false, "SubmitTheAlbum_SbmtBtn", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Submitting...');

    $.post(url, data, function (response) {
        if (response.success) {
            albumEnabler(response.result);
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Album submitted! Metadata and cover can be edited only after disabling. Track list can’t be changed anymore", 4.25, "Close", -1, null);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Album submission failed. Please review metadata and track list (minimum 2 tracks) and try again", 3.75, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Please sign in to edit your albums and tracks", 3.5, "Sign In", 2, null);
        }

        setTimeout(function () {
            buttonUndisabler(false, "SubmitTheAlbum_SbmtBtn", baseHtml);
        }, 2000);
    });
});

$(document).on("submit", "#DisableTheAlbum_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#DisableTheAlbum_SbmtBtn").html();
    buttonDisabler(false, "DisableTheAlbum_SbmtBtn", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Disabling...');

    $.post(url, data, function (response) {
        if (response.success) {
            albumDisabler(response.result);
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Album disabled. You can now edit metadata and cover image", 3.75, "Close", -1, null);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Album cannot be disabled right now. Please try again laterr", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Please sign in to edit your albums and tracks", 3.5, "Sign In", 2, null);
        }

        setTimeout(function () {
            buttonUndisabler(false, "DisableTheAlbum_SbmtBtn", baseHtml);
        }, 2000);
    });
});

$(document).on("submit", "#EnableTheAlbum_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#EnableTheAlbum_SbmtBtn").html();
    buttonDisabler(false, "EnableTheAlbum_SbmtBtn", '<i class="fa-solid fa-spinner fa-spin-pulse"></i> Enabling...');
    //albumInfoSampler();
    $.post(url, data, function (response) {
        if (response.success) {
            albumEnabler(response.result);
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Your album is live again. Listeners can play it, but editing is locked", 3.75, "Close", -1, null);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Album cannot be enabled right now. Please try again laterr", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Please sign in to edit your albums and tracks", 3.5, "Sign In", 2, null);
        }

        setTimeout(function () {
            buttonUndisabler(false, "EnableTheAlbum_SbmtBtn", baseHtml);
        }, 2000);
    });
});

function albumEnabler(id) {
    if (parseInt(id) > 0) {
        $("#EnableTheAlbum_Box").fadeOut(0);
        $("#SubmitTheAlbum_Box").fadeOut(0);
        $("#DisableTheAlbum_Box").fadeIn(0);
        $("#EnableTheAlbum_Id_Val").val(0);
        $("#SubmitTheAlbum_Id_Val").val(0);
        $("#DisableTheAlbum_Id_Val").val(id);
        $("#SubmitTheAlbum_SbmtBtn").addClass("super-disabled");
        $("#EnableTheAlbum_SbmtBtn").addClass("super-disabled");
        $("#DisableTheAlbum_SbmtBtn").removeClass("super-disabled");
        $(".btn-album-editing-tool").attr("disabled", true);
        $("#EditAlbumMetadata_Container-OpenBtn").addClass("super-disabled");
        $("#EditAlbumCoverImage_SbmtBtn").addClass("super-disabled");

        $("#AddAlbumTracks_Btn").addClass("super-disabled");
        $("#LoadAlbumTracksToReorder_SbmtBtn").addClass("super-disabled");
    }
}

function albumDisabler(id) {
    if (parseInt(id) > 0) {
        $("#EnableTheAlbum_Box").fadeIn(0);
        $("#SubmitTheAlbum_Box").fadeOut(0);
        $("#DisableTheAlbum_Box").fadeOut(0);
        $("#EnableTheAlbum_Id_Val").val(id);
        $("#SubmitTheAlbum_Id_Val").val(0);
        $("#DisableTheAlbum_Id_Val").val(0);
        $("#SubmitTheAlbum_SbmtBtn").addClass("super-disabled");
        $("#EnableTheAlbum_SbmtBtn").removeClass("super-disabled");
        $("#DisableTheAlbum_SbmtBtn").addClass("super-disabled");
        $(".btn-album-editing-tool").attr("disabled", false);
        $("#EditAlbumCoverImage_SbmtBtn").removeClass("super-disabled");
        $("#EditAlbumMetadata_Container-OpenBtn").removeClass("super-disabled");

        $("#AddAlbumTracks_Btn").removeClass("super-disabled");
        $("#LoadAlbumTracksToReorder_SbmtBtn").removeClass("super-disabled");
    }
}

$(document).on("mousedown", ".btn-get-album-info-as-author", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#GAI_Id_Val").val(trueId);
        $("#GAI_Type_Val").val(0);
        $("#GetAlbumInfo_Form").submit();
    }
});

function isContainerOpen(containerId) {
    if (document.getElementById(containerId) != null) {
        if (parseInt($("#" + containerId).css("bottom")) > 0) return true;
        else return false;
    }
    else return false;
}

$("#LoadTheTrack_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            $("#StreamTheTrack_Id_Val").val(response.result.id); 
            $("#StreamTheTrack_Url_Val").val(response.result.trackFileUrl);

            $("#GetTrackCredits_Id_Val").val(response.result.id);
            if (response.result.isFavorite) {
                $(".btn-track-favor-unfavor").html(' <i class="fa-solid fa-star"></i> ');
                $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/RemoveFromFavorites");
            }
            else {
                $(".btn-track-favor-unfavor").html(' <i class="fa-regular fa-star"></i> ');
                $("#AddOrRemoveTheAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
            }

            console.log(response.result.lyricsId);
            if (response.result.lyricsId == null) {
                $("#GetTrackLyrics_Id_Val").val(0);
                buttonDisabler(false, "GetTrackLyrics_SbmtBtn", null);
            }
            else {
                $("#GetTrackLyrics_Id_Val").val(response.result.id);
                buttonUndisabler(false, "GetTrackLyrics_SbmtBtn", null);
            }
            $(".btn-track-favor-unfavor").attr("data-id", response.result.id);
            $("#GetTrackComments_Id_Val").val(response.result.id);
            $("#GetTrackComments_SbmtBtn").removeClass("super-disabled");
            //GetTrackComments_Form
            $("#OngakuPlayer_Type_Val").val(response.type);
            $("#StreamTheTrack_Form").submit();

            buttonUndisabler(false, "GetTrackCredits_SbmtBtn", null);
            buttonUndisabler(true, "btn-play-pause-track-lg", ' <i class="fa-solid fa-pause"></i> Pause');
            buttonUndisabler(true, "btn-track-favor-unfavor", null);
            buttonUndisabler(true, "btn-track-favor-unfavor-lg", null);
        }
        else {
            $("#GetTrackCredits_Id_Val").val(0);
            $("#GetTrackComments_Id_Val").val(0);
            $("#GetTrackComments_SbmtBtn").addClass("super-disabled");
            $(".btn-track-favor-unfavor").removeAttr("data-id");
            $(".btn-track-favor-unfavor-lg").removeAttr("data-id");
            buttonDisabler(true, "btn-track-favor-unfavor", null);
            buttonDisabler(true, "btn-track-favor-unfavor-lg", null);
            buttonDisabler(false, "GetTrackCredits_SbmtBtn", null);
            buttonUndisabler(true, "btn-play-pause-track-lg", ' <i class="fa-solid fa-play"></i> Play');
        }
    });
});

$(document).on("submit", "#StreamTheTrack_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let streamUrl = url + "?" + data;

    $.get(url, data, function (response) {
        if (response != null) {
            let type = $("#OngakuPlayer_Type_Val").val();
            let trackId = $("#StreamTheTrack_Id_Val").val();

            if (type == 0) {
                let playlistId = $("#OngakuPlayer_PlaylistId_Val").val();
                let trackTitleImg = $("#ReleaseInfo_Img").attr("src");
                let title = $("#" + trackId + "-TrackName_Lbl").html();
                let artistsName = $("#" + trackId + "-TrackArtistsName_Lbl").html();
                trackTitleImg = trackTitleImg == undefined ? $("#" + trackId + "-TrackImg_Box").attr("src") : trackTitleImg;
                audioPlay("OngakuPlayer_Audio", trackTitleImg == undefined ? null : trackTitleImg, streamUrl, 0, trackId, playlistId, title, artistsName, null);
                audioPlayerTypeSwitch("OngakuPlayer_Audio", 0);
            }
            else {
                let title = $("#ETL_TrackTitle_Lbl").html();
                let artistsName = $("#ETL_TrackArtists_Span").html();
                audioPrepare("OngakuPlayer_Audio", streamUrl, null, title, artistsName, null);
                audioPlayerTypeSwitch("OngakuPlayer_Audio", 2);
                slideContainers(null, "LyricSync_Container");
            }
        }
        else {
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake text-danger" style="--fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2;"></i>', null, null, "Track temporarily unavailable", 3.5, "Close", -1, null);
        }
    });
});

$(document).on("mousedown", ".btn-edit-track-credits", function () {
    let trackId = $("#GetTrackCredits_Id_Val").val();
    if (trackId != undefined && parseInt(trackId) > 0) {
        $("#GetTrackCredits_Type_Val").val(1);
        $("#GetTrackCredits_Form").submit();
    }
});

$(document).on("mousedown", ".btn-edit-track-lyrics", function () {
    let trackId = $("#GetTrackCredits_Id_Val").val();
    if (trackId != undefined && parseInt(trackId) > 0) {
        $("#GetTrackLyrics_Type_Val").val(1);
        $("#GetTrackLyrics_Form").submit();
    }
});

function formButtonDeactivator(buttonId, addingClasses = [], addingAttributes = [], addingAttributeValues = []) {
    if (buttonId != null) {
        $("#" + buttonId).attr("type", "button");
        if (addingClasses.length > 0) {
            $.each(addingClasses, function (index) {
                $("#" + buttonId).addClass(addingClasses[index]);
            });
        }
        if (addingAttributes.length > 0 && addingAttributeValues.length > 0) {
            if (addingAttributes.length >= addingAttributeValues.length) {
                for (let i = 0; i < addingAttributes.length; i++) {
                    $("#" + buttonId).attr(addingAttributes[i], addingAttributeValues[i]);
                }
            }
            else {
                for (let i = 0; i < addingAttributeValues.length; i++) {
                    $("#" + buttonId).attr(addingAttributes[i], addingAttributeValues[i]);
                }
            }
        }
        return true;
    }
    else return false;
}

function formButtonActivator(buttonId, addedClasses = [], addedAttributes = []) {
    if (buttonId != null) {
        $("#" + buttonId).attr("type", "submit");
        if (addedClasses.length > 0) {
            $.each(addedClasses, function (index) {
                $("#" + buttonId).removeClass(addedClasses[index]);
            });
        }
        if (addedAttributes.length > 0) {
            $.each(addedAttributes, function (index) {
                $("#" + buttonId).removeAttr(addedAttributes[index]);
            });
        }
        return true;
    }
    else return false;
}

$(document).on("submit", "#GetTrackCredits_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#GetTrackCredits_SbmtBtn").html();
    buttonDisabler(false, "GetTrackCredits_SbmtBtn", "");
    //slideBoxes(false, "OngakuPlayer_NonMainAddLayer_Box", "OngakuPlayer_MainAddLayer_Box");

    $.get(url, data, function (response) {
        if (response.type == 1) {
            let trackName = $("#" + response.id + "-TrackName_Lbl").html();
            let trackArtists = $("#" + response.id + "-TrackArtistsName_Lbl").html();
            let trackType = $("#ReleaseInfo_Type_Span").html();
            let trackImg = $("#ReleaseInfo_Img").attr("src");
            if (trackImg == undefined || trackImg == "#") {
                $("#ETC_Img").fadeOut(0);
                $("#ETC_Img_Box").fadeIn(0);
            }
            else {
                $("#ETC_Img").attr("src", trackImg);
                $("#ETC_Img").fadeIn(0);
                $("#ETC_Img_Box").fadeOut(0);
            }
            $("#ETC_TrackId_Val").val(response.id);
            $("#ETC_TrackTitle_Lbl").html(trackName);
            $("#ETC_TrackArtists_Span").html(trackArtists + " ∙ " + trackType);

            setTimeout(function () {
                slideContainers(null, "EditTrackCredits_Container");
            }, 150);
        }

        if (response.success) {
            if (response.type == 0) {
                if (response.result != null) {
                    $("#OngakuPlayer_CreditsInfo_Box").remove();

                    let statsInfoMainBox = $("<div class='box-standard box-standard-player' id='OngakuPlayer_CreditsInfo_Box'></div>");
                    let vocalArrHeaders = ["Main Vocalist", "Featuring Artist"];
                    let productionArrHeaders = ["Composer", "Lyricist", "Producer", "Arranger", "Instrumentalist"];
                    let engineersArrHeaders = ["Mixing Engineer", "Mastering Engineer", "Recording Engineer", "Sound Designer"];
                    let vocalArr = [response.result.mainVocalist, response.result.featuringArtists];
                    let productionArr = [response.result.composer, response.result.lyricist, response.result.producer, response.result.arranger, response.result.instrumentalist];
                    let engineersArr = [response.result.mixingEngineer, response.result.masteringEngineer, response.result.recordingEngineer, response.result.soundDesigner];
                    let vocalBox = $("<div class='box-bordered mh-250 mt-2 p-1 pt-2 pb-2'></div>");
                    let productionBox = $("<div class='box-bordered mt-2 p-1 pt-2 pb-2'></div>");
                    let engineersBox = $("<div class='box-bordered mt-2 p-1 pt-2 pb-2'></div>");
                    let vocalHeader = $("<h6 class='h6 ps-1'>Vocal and Artists</h6>");
                    let productionHeader = $("<h6 class='h6 ps-1'>Lyrics, Composition and Production</h6>");
                    let engineersHeader = $("<h6 class='h6 ps-1'>Engineers and Designers</h6>");
                    let boxBtnGroupVocals = $("<div class='box-btn-group'></div>");
                    let boxBtnGroupProduction = $("<div class='box-btn-group'></div>");
                    let boxBtnGroupEngineers = $("<div class='box-btn-group'></div>");
                    let vocalsQty = nonNullCounter(vocalArr);
                    let productionsQty = nonNullCounter(productionArr);
                    let engineersQty = nonNullCounter(engineersArr);
                    let counter = 0;

                    let tempElement;
                    if (vocalsQty > 1) {
                        counter = 0;
                        for (let i = 0; i < vocalArr.length; i++) {
                            if (vocalArr[i] != null) {
                                if (counter == 0) {
                                    if (vocalArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-top-member text-start", vocalArr[i] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-top-member text-start", vocalArr[i] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[i] + "</small>");
                                }
                                else if (counter == vocalsQty - 1) {
                                    if (vocalArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-bot-member text-start", vocalArr[i] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-bot-member text-start", vocalArr[i] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[i] + "</small>");
                                }
                                else {
                                    if (vocalArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-mid-member text-start", vocalArr[i] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-mid-member text-start", vocalArr[i] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[i] + "</small>");
                                }
                                if (tempElement != null) {
                                    counter++;
                                    boxBtnGroupVocals.append(tempElement);
                                }
                            }
                        }
                    }
                    else {
                        let index = nonNullElementIndexes(vocalArr);
                        if (index != null) {
                            if (vocalArr[index].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-solo-member text-start", vocalArr[index] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[index] + "s</small>");
                            else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-solo-member text-start", vocalArr[index] + "<br/><small class='card-text text-muted'>" + vocalArrHeaders[index] + "</small>");
                            if (tempElement != null) boxBtnGroupVocals.append(tempElement);
                        }
                    }

                    if (productionsQty > 1) {
                        counter = 0;
                        for (let i = 0; i < productionArr.length; i++) {
                            if (productionArr[i] != null) {
                                if (counter == 0) {
                                    if (productionArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-top-member text-start", productionArr[i] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-top-member text-start", productionArr[i] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[i] + "</small>");
                                }
                                else if (counter == productionsQty - 1) {
                                    if (productionArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-bot-member text-start", productionArr[i] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-bot-member text-start", productionArr[i] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[i] + "</small>");
                                }
                                else {
                                    if (productionArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-mid-member text-start", productionArr[i] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-mid-member text-start", productionArr[i] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[i] + "</small>");
                                }
                                if (tempElement != null) {
                                    counter++;
                                    boxBtnGroupProduction.append(tempElement);
                                }
                            }
                        }
                    }
                    else {
                        let index = nonNullElementIndexes(productionArr);
                        if (index != null) {
                            if (productionArr[index].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-solo-member text-start", productionArr[index] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[index] + "s</small>");
                            else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-solo-member text-start", productionArr[index] + "<br/><small class='card-text text-muted'>" + productionArrHeaders[index] + "</small>");
                            if (tempElement != null) boxBtnGroupProduction.append(tempElement);
                        }
                    }

                    if (engineersQty > 1) {
                        counter = 0;
                        for (let i = 0; i < engineersArr.length; i++) {
                            if (engineersArr[i] != null) {
                                if (counter == 0) {
                                    if (engineersArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-top-member btn-vocal-group text-start", engineersArr[i] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-top-member btn-vocal-group text-start", engineersArr[i] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[i] + "</small>");
                                }
                                else if (counter == engineersQty - 1) {
                                    if (engineersArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-bot-member btn-production-group text-start", engineersArr[i] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-bot-member btn-production-group text-start", engineersArr[i] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[i] + "</small>");
                                }
                                else {
                                    if (engineersArr[i].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-mid-member btn-engineers-group text-start", engineersArr[i] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[i] + "s</small>");
                                    else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-mid-member btn-engineers-group text-start", engineersArr[i] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[i] + "</small>");
                                }
                                if (tempElement != null) {
                                    counter++;
                                    boxBtnGroupEngineers.append(tempElement);
                                }
                            }
                        }
                    }
                    else {
                        let index = nonNullElementIndexes(engineersArr);
                        if (index != null) {
                            if (engineersArr[index].includes(",")) tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-solo-member btn-engineers-group text-start", engineersArr[index] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[index] + "s</small>");
                            else tempElement = elementDesigner("button", "btn box-btn-group-member box-btn-group-solo-member btn-engineers-group text-start", engineersArr[index] + "<br/><small class='card-text text-muted'>" + engineersArrHeaders[index] + "</small>");
                            if (tempElement != null) boxBtnGroupEngineers.append(tempElement);
                        }
                    }
                    vocalBox.append(vocalHeader);
                    vocalBox.append(boxBtnGroupVocals);
                    productionBox.append(productionHeader);
                    productionBox.append(boxBtnGroupProduction);
                    engineersBox.append(engineersHeader);
                    engineersBox.append(boxBtnGroupEngineers);

                    if (vocalsQty > 0) statsInfoMainBox.append(vocalBox);
                    if (productionsQty > 0) statsInfoMainBox.append(productionBox); 
                    if (engineersQty > 0) statsInfoMainBox.append(engineersBox);
                    $("#OngakuPlayer_NonMainAddLayer_Box").append(statsInfoMainBox);

                    $(".btn-double-slide-boxes").attr("data-is-active", true);
                    $("#GetTrackCredits_SbmtBtn").attr("data-is-active", true);
                    buttonUnchooser(true, "btn-ongaku-player-additional");
                    buttonChooser(false, "GetTrackCredits_SbmtBtn", false);
                    buttonUndisabler(false, "GetTrackCredits_SbmtBtn", baseHtml);
                    formButtonDeactivator("GetTrackCredits_SbmtBtn", ["btn-double-slide-boxes"], ["data-close-first", "data-close-second", "data-open-box", "data-is-active"], [".box-standard-player", "#OngakuPlayer_CreditsInfo_Box", "#OngakuPlayer_MainAddLayer_Box", false]);
                    slideBoxes(true, "box-standard-player", "OngakuPlayer_CreditsInfo_Box");
                    slideBoxes(false, "OngakuPlayer_MainAddLayer_Box", "OngakuPlayer_NonMainAddLayer_Box");
                }
            }
        }
        else {
            if(response.type == 0) callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;"></i>', null, null, "Credits for this track have not been provided yet", 3.5, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#GetTrackLyrics_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#GetTrackLyrics_SbmtBtn").html();
    buttonDisabler(false, "GetTrackLyrics_SbmtBtn", "");

    $.get(url, data, function (response) {
        if (response.type == 1) {
            let trackName = $("#" + response.id + "-TrackName_Lbl").html();
            let trackArtists = $("#" + response.id + "-TrackArtistsName_Lbl").html();
            let trackType = $("#ReleaseInfo_Type_Span").html();
            let trackImg = $("#ReleaseInfo_Img").attr("src");
            if (trackImg == undefined || trackImg == "#") {
                $("#ETL_Img").fadeOut(0);
                $("#ETL_Img_Box").fadeIn(0);
            }
            else {
                $("#ETL_Img").attr("src", trackImg);
                $("#ETL_Img").fadeIn(0);
                $("#ETL_Img_Box").fadeOut(0);
            }
            $("#UTL_TrackId_Val").val(response.id);
            if (response.result != null) {
                $("#UTL_LanguageId_Val").val(response.result.languageId);
                $("#UTL_LanguageDisplay_Val").val("Main Language: " + response.result.language.name);
                $("#UTL_Content_Val").val(response.result.content);
                $("#ETL_TrackTitle_Lbl").html(trackName);
                $("#ETL_TrackArtists_Span").html(trackArtists + " ∙ " + trackType);
                $("#DTL_Id_Val").val(response.id);
                $("#DeleteTrackLyrics_Box").fadeIn(0);
                buttonUndisabler(false, "DeleteTrackLyrics_SbmtBtn", ' <i class="fa-solid fa-trash-can"></i> Delete');
                getElementLength("UTL_Content_Val", "UTL_Content_Val-Indicator_Span", false);
                buttonUndisabler(false, "UpdateTrackLyrics_SbmtBtn", "Save Lyrics");
                adjustTextareaRows("UTL_Content_Val");
                let textLength = getElementRows("UTL_Content_Val", "UTL_Content_Val-RowsIndicator_Span", false);
                $("#UTL_Content_Val").css("height", "auto");

                if (textLength > 0) {
                    $("#TimeSyncLyrics_Btn").removeClass("super-disabled");
                    $("#TimeSyncLyrics_Btn").attr("data-bs-title", "Apply lyrics and sync timing for karaoke");
                }
                else {
                    $("#TimeSyncLyrics_Btn").addClass("super-disabled");
                    $("#TimeSyncLyrics_Btn").attr("data-bs-title", "Start syncing tracks lyrics. Perfect feature for a karaoke-style experience");
                }
            }
            else {
                $("#DTL_Id_Val").val(0);
                $("#DeleteTrackLyrics_Box").fadeOut(0);
                $("#TimeSyncLyrics_Btn").removeClass("super-disabled");
                $("#TimeSyncLyrics_Btn").attr("data-bs-title", "Apply lyrics and sync timing for karaoke");
                buttonDisabler(false, "DeleteTrackLyrics_SbmtBtn", null);
            }
            setTimeout(function () {
                slideContainers(null, "EditTrackLyrics_Container");
            }, 150);
            uncallASmContainer(false, "StudioMusic_Container");
        }
        else if (response.type == 0) {
            if (response.success) {
                $("#OngakuPlayer_LyricsMain_Box").remove();
                const lyricsMainBox = $("<div class='box-standard box-standard-player' id='OngakuPlayer_LyricsMain_Box'></div>");
                const lyricsBox = $("<div class='box-bordered mh-250 mt-2 p-1 pt-2 pb-2'></div>");
                const lyricStatsBox = $("<div class='badge-bar shadow-sm'></div>");
                const lyricsTimeSynced = $("<span class='badge-icon btn-tooltip me-2' data-bs-toggle='tooltip' data-bs-placement='bottom' data-bs-custom-class='tooltip-standard shadow-sm' data-bs-html='true' data-bs-title='This song is synced'> <i class='fa-solid fa-arrows-rotate'></i> </span>");
                const lyricsTranslated = $("<span class='badge-icon btn-tooltip me-2' data-bs-toggle='tooltip' data-bs-placement='bottom' data-bs-custom-class='tooltip-standard shadow-sm' data-bs-html='true' data-bs-title='This song is synced'></span>");
                const lyricsLanguage = $("<span class='badge-icon btn-tooltip' data-bs-toggle='tooltip' data-bs-placement='bottom' data-bs-custom-class='tooltip-standard shadow-sm' data-bs-html='true' data-bs-title='Translations for this song are available'></span>");

                const lyricsText = $("<p class='lyric-text'></span>");
                lyricsTimeSynced.html(' <i class="fa-solid fa-group-arrows-rotate"></i> ');
                lyricsTimeSynced.attr("data-bs-title", "This song's lyrics are not synced");
                lyricsLanguage.html(' <i class="fa-solid fa-earth-americas"></i> ' + response.result.language.name);
                lyricsLanguage.attr("data-bs-title", "This song's native language is <span class='fw-500'>" + response.result.language.name + "</span>");
                lyricsTranslated.html(' <i class="fa-solid fa-language"></i> ');
                lyricsTranslated.addClass("super-disabled");
                lyricStatsBox.append(lyricsTimeSynced);
                lyricStatsBox.append(lyricsTranslated);
                lyricStatsBox.append(lyricsLanguage);

                lyricsText.html(response.result.content);
                lyricsBox.append(lyricsText);
                lyricsBox.append(lyricStatsBox);
                lyricsMainBox.append(lyricsBox);
                $("#OngakuPlayer_NonMainAddLayer_Box").append(lyricsMainBox);

                $(".btn-double-slide-boxes").attr("data-is-active", true);
                $("#GetTrackLyrics_SbmtBtn").attr("data-is-active", true);
                buttonUnchooser(true, "btn-ongaku-player-additional");
                buttonChooser(false, "GetTrackLyrics_SbmtBtn", false);
                buttonUndisabler(false, "GetTrackLyrics_SbmtBtn", baseHtml);
                formButtonDeactivator("GetTrackLyrics_SbmtBtn", ["btn-double-slide-boxes"], ["data-close-first", "data-close-second", "data-open-box", "data-is-active"], [".box-standard-player", "#OngakuPlayer_LyricsMain_Box", "#OngakuPlayer_MainAddLayer_Box", false]);
                slideBoxes(true, "box-standard-player", "OngakuPlayer_LyricsMain_Box");
                slideBoxes(false, "OngakuPlayer_MainAddLayer_Box", "OngakuPlayer_NonMainAddLayer_Box");
            }
            else {

            }
            buttonUnchooser(true, "btn-ongaku-player-additional");
            buttonDisabler(false, "GetTrackLyrics_SbmtBtn", baseHtml);
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;"></i>', null, null, "This track has no lyrics... yet", 3.25, "Close", -1, null);
        }
        else {
            if (response.success) {
                let rowedText = rowsToSpan("LyricSyncRow_Span", response.result.content, ["lyric-text", "lyric-row-choose"]);
                if (rowedText[1].length > 0) {
                    $("#TimeSync_RowNumber_Span").text(1);
                    for (let i = 0; i < rowedText[1].length; i++) {
                        if (i == 0) {
                            rowedText[1][i] = rowedText[1][i].addClass("lyric-text-active");
                            $("#TimeSync_Lyrics_Box").append(rowedText[1][i]);
                            $("#TimeSync_Lyrics_Box").append("<br/>");
                        }
                        else {
                            $("#TimeSync_Lyrics_Box").append(rowedText[1][i]);
                            $("#TimeSync_Lyrics_Box").append("<br/>");
                        }
                    }
                    $("#OngakuPlayer_TrackId_Val").val(response.id);
                    $("#LyricSync_TrackId_Val").val(response.id);
                    $("#LyricSync_LyricsId_Val").val(response.result.id);
                    $("#LyricSync_Lyrics_Val").val(response.result.content);
                    $("#OngakuPlayer_Type_Val").val(2);
                    $("#LoadTheTrack_Form").submit();
                }
                else buttonDisabler(false, "TimeSyncLyrics_Btn", null);
            }
        }
        //if (response.success) {
        //    if (response.type == 0) {
        //        $("#OngakuPlayer_LyricsMain_Box").remove();
        //        const lyricsMainBox = $("<div class='box-standard box-standard-player' id='OngakuPlayer_LyricsMain_Box'></div>");
        //        const lyricsBox = $("<div class='box-bordered mh-250 mt-2 p-1 pt-2 pb-2'></div>");
        //        const lyricStatsBox = $("<div class='badge-bar shadow-sm'></div>");
        //        const lyricsTimeSynced = $("<span class='badge-icon btn-tooltip me-2' data-bs-toggle='tooltip' data-bs-placement='bottom' data-bs-custom-class='tooltip-standard shadow-sm' data-bs-html='true' data-bs-title='This song is synced'> <i class='fa-solid fa-arrows-rotate'></i> </span>");
        //        const lyricsTranslated = $("<span class='badge-icon btn-tooltip me-2' data-bs-toggle='tooltip' data-bs-placement='bottom' data-bs-custom-class='tooltip-standard shadow-sm' data-bs-html='true' data-bs-title='This song is synced'></span>");
        //        const lyricsLanguage = $("<span class='badge-icon btn-tooltip' data-bs-toggle='tooltip' data-bs-placement='bottom' data-bs-custom-class='tooltip-standard shadow-sm' data-bs-html='true' data-bs-title='Translations for this song are available'></span>");

        //        const lyricsText = $("<p class='lyric-text'></span>");
        //        lyricsTimeSynced.html(' <i class="fa-solid fa-group-arrows-rotate"></i> ');
        //        lyricsTimeSynced.attr("data-bs-title", "This song's lyrics are not synced");
        //        lyricsLanguage.html(' <i class="fa-solid fa-earth-americas"></i> ' + response.result.language.name);
        //        lyricsLanguage.attr("data-bs-title", "This song's native language is <span class='fw-500'>" + response.result.language.name + "</span>");
        //        lyricsTranslated.html(' <i class="fa-solid fa-language"></i> ');
        //        lyricsTranslated.addClass("super-disabled");
        //        lyricStatsBox.append(lyricsTimeSynced);
        //        lyricStatsBox.append(lyricsTranslated);
        //        lyricStatsBox.append(lyricsLanguage);

        //        lyricsText.html(response.result.content);
        //        lyricsBox.append(lyricsText);
        //        lyricsBox.append(lyricStatsBox);
        //        lyricsMainBox.append(lyricsBox);
        //        $("#OngakuPlayer_NonMainAddLayer_Box").append(lyricsMainBox);

        //        $(".btn-double-slide-boxes").attr("data-is-active", true);
        //        $("#GetTrackLyrics_SbmtBtn").attr("data-is-active", true);
        //        buttonUnchooser(true, "btn-ongaku-player-additional");
        //        buttonChooser(false, "GetTrackLyrics_SbmtBtn", false);
        //        buttonUndisabler(false, "GetTrackLyrics_SbmtBtn", baseHtml);
        //        formButtonDeactivator("GetTrackLyrics_SbmtBtn", ["btn-double-slide-boxes"], ["data-close-first", "data-close-second", "data-open-box", "data-is-active"], [".box-standard-player", "#OngakuPlayer_LyricsMain_Box", "#OngakuPlayer_MainAddLayer_Box", false]);
        //        slideBoxes(true, "box-standard-player", "OngakuPlayer_LyricsMain_Box");
        //        slideBoxes(false, "OngakuPlayer_MainAddLayer_Box", "OngakuPlayer_NonMainAddLayer_Box");
        //    }
        //    else if (response.type == 2) {
        //        //Sync
        //        //createTutorialContainer(null, "LyricSyncTutorials", "lyric-sync-tutorials", ['<i class="fa-solid fa-arrows-rotate anime-sync-forever"></i>', '<i class="fa-regular fa-lightbulb"></i>'], ['Welcome to <span class="fw-500">Lyric Sync</span>!<br /><br />Easily align your track’s lyrics with the music timeline, making playback smoother and karaoke more enjoyable for everyone. We recommend reading these quick tips before you start syncing. They will help you understand everything you need to do here', 'Start by exploring the audio player.<br />New controls have been added to assist with syncing. Hover or tap each button below to see its function']);

        //        }
        //    }
    });
});

$(document).on("submit", "#LyricSync_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#LyricSync_SbmtBtn").html();
    buttonDisabler(false, "LyricSync_SbmtBtn", "Saving...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#LyricSync_SbmtBtn").html(' <i class="fa-regular fa-circle-check anime-sync-shift"></i> Saved');
            callAlert(' <i class="fa-regular fa-circle-check anime-sync-shift"></i> ', null, null, "Lyrics synced successfully", 3.5, "Done", -1, null);
            slideContainers("LyricSync_Container", "Primary_Container");
        }
        else {
            if(response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Sync interrupted due to an unexpected error. Please try again later", 3.75, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket"></i>', null, null, "Please sign in to interact with lyrics and tracks", 3.75, "Got It", -1, null);
        }
        buttonUndisabler(false, "LyricSync_SbmtBtn", baseHtml);
    });
});

let g_EditingRowIndex = 0; //LyricSync_EditingRowIndex_Val
let g_RowsCounter = 0; //LyricSync_RowsCounter_Val
let g_CurrentRowIndex = 0; //LyricSync_CurrentRowIndex_Val
let g_CurrentTimestamp = 0; //LyricSync_CurrentTimestamp_Val
let g_PreviousTimestamp = 0; //LyricSync_PreviousTimestamp_Val
let g_LastUndoTimestamp = 0; //LyricSync_LastUndoTimestamp_Val
let g_LyricLinedCounter = 0; //LyricSync_LyricLinesCounter_Val
let g_InstrumentalBreaksCounter = 0; //LyricSync_InstrumentalBreaksCounter_Val

function submitLyricSync(audioPlayer, isForInstrumentalBreak = false, currentTime) {
    if (audioPlayer != null) {
        if (audioPlayer.paused) {
            if (!isForInstrumentalBreak) callAlert(' <i class="fa-solid fa-forward-fast anime-keeps-going-on-shift"></i> ', null, null, "Lyrics can only be synced while the track is playing", 3.75, "Got It", -1, null);
            else callAlert(' <i class="fa-solid fa-forward-fast anime-keeps-going-on-shift"></i> ', null, null, "Instrumental breaks can only be applied while the track keeps going", 3.75, "Got It", -1, null);
        }
        else {
            let baseHtml;
            let currentRowLyrics = null;

            if (!isForInstrumentalBreak) {
                g_LyricLinedCounter++;
                baseHtml = ' <i class="fa-solid fa-arrows-rotate"></i> ';
                buttonDisabler(true, "btn-sync-lyrics", ' <i class="fa-solid fa-arrows-rotate anime-sync-shift"></i> ');
                currentRowLyrics = $("#" + g_CurrentRowIndex + "-LyricSyncRow_Span").html();
            }
            else {
                g_InstrumentalBreaksCounter++;
                baseHtml = ' <i class="fa-solid fa-guitar"></i> ';
                buttonDisabler(true, "btn-sync-instrumental-break", ' <i class="fa-solid fa-circle-notch anime-sync-shift"></i> ');
            }

            if (g_PreviousTimestamp == 0) {
                $(".lyric-sync-row").remove();
                $("#LyricSync_Timestamps_Box").empty();
                $("#LyricSync_CurrentRowIndex_Val").val(0);
                $("#LyricSync_CurrentTimestamp_Val").val(0);
            }

            let currentTimestampToParce = currentTime;
            currentTime = secondsToRegularDuration(currentTime);
            g_PreviousTimestamp = secondsToRegularDuration(g_PreviousTimestamp);
            currentTime = currentTime == null ? "00:00" : currentTime[0] + ":" + currentTime[1];
            g_PreviousTimestamp = g_PreviousTimestamp == null ? "00:00" : g_PreviousTimestamp[0] + ":" + g_PreviousTimestamp[1];

            let doesThisRowAlreadyExists = document.getElementById(g_RowsCounter + "-LyricSyncRow_Box");
            let mainRow = elementDesigner("div", "row lyric-sync-row", null);
            let rowIndexCol = elementDesigner("div", "col col-1 regular-start-table-cell text-center", null);
            let timestampCol = elementDesigner("div", "col col-3 regular-mid-table-cell text-center", null);
            let lyricShortInfoCol = elementDesigner("div", "col col-6 regular-end-table-cell text-center", null);
            let actionBtnsCol = elementDesigner("div", "col col-2 regular-end-table-cell text-center", null);
            let lineIndexInput = $("<input type='hidden' class='lyric-sync-lines' name='Lines' />");
            let timestampInput = $("<input type='hidden' class='lyric-sync-timestamps' name='Timestamps' />");

            mainRow.attr("id", g_RowsCounter + "-LyricSyncRow_Box");
            lineIndexInput.attr("id", g_RowsCounter + "-LyricSync_LineIndex_Val");
            timestampInput.attr("id", g_RowsCounter + "-LyricSync_Timestamp_Val");
            if (!isForInstrumentalBreak) lineIndexInput.val(g_CurrentRowIndex);
            else lineIndexInput.val(-256);
            timestampInput.val(currentTimestampToParce);

            let rowIndexSpan = isForInstrumentalBreak == false ? elementDesigner("span", "console-log-text", g_LyricLinedCounter) : elementDesigner("span", "console-log-text", ' <i class="fa-solid fa-music"></i> ');
            let timestampSpan = elementDesigner("span", "console-log-text text-muted", g_PreviousTimestamp + " to " + currentTime);
            let lyricShortInfoSpan = isForInstrumentalBreak == false ? elementDesigner("span", "console-log-text", currentRowLyrics) : elementDesigner("span", "console-log-text", " <i class='fa-solid fa-ellipsis fa-fade'></i> Instrumental Break");
            let rewindBtn = elementDesigner("button", "btn btn-cybepunked btn-lyric-sync-rewind btn-sm me-2", ' <i class="fa-solid fa-clock-rotate-left"></i> ');
            let undoBtn = elementDesigner("button", "btn btn-cybepunked btn-lyric-sync-undo btn-sm text-danger", ' <i class="fa-solid fa-xmark"></i> ');

            timestampSpan.attr("id", g_RowsCounter + "-LyricSync_ElementTimestamp_Span");

            rowIndexCol.append(rowIndexSpan);
            timestampCol.append(timestampSpan);
            lyricShortInfoCol.append(lyricShortInfoSpan);
            actionBtnsCol.append(rewindBtn);
            actionBtnsCol.append(undoBtn);

            mainRow.append(rowIndexCol);
            mainRow.append(timestampCol);
            mainRow.append(lyricShortInfoCol);
            mainRow.append(actionBtnsCol);
      
            buttonUndisabler(true, "btn-undo-last-sync", null);
            buttonUndisabler(true, "btn-undo-total-prepare", null);
            $(".btn-undo-last-sync").attr("data-last-sync-index", g_RowsCounter);
            if (doesThisRowAlreadyExists != null) {
                let rewindingRowIndex = g_RowsCounter - 1;
                buttonDisabler(true, "btn-un-undo-last-sync", null);
                $("#" + rewindingRowIndex + "-LyricSyncRow_Box").remove();
            }

            $("#LyricSync_Stats_Box").append(mainRow);
            $("#LyricSync_Timestamps_Box").append(lineIndexInput);
            $("#LyricSync_Timestamps_Box").append(timestampInput);

            g_EditingRowIndex = 0;
            g_CurrentTimestamp = 0;
            g_PreviousTimestamp = currentTimestampToParce;
            $(".btn-lyric-sync-undo").addClass("super-disabled");
            $(".btn-lyric-sync-rewind").addClass("super-disabled");
            undoBtn.attr("id", g_RowsCounter + "-LyricSyncUndo_Btn");
            rewindBtn.attr("id", g_RowsCounter + "-LyricSyncRewind_Btn");
            undoBtn.removeClass("super-disabled");
            rewindBtn.removeClass("super-disabled");

            buttonUndisabler(false, "LyricSync_SbmtBtn", null);
            buttonUndisabler(true, "btn-lyric-sync-preview", null);

            g_RowsCounter++;
            $("#LyricSync_TotalRowsQty_Span").text(g_RowsCounter);
            if (g_RowsCounter == 1) $("#LyricSync_TotalRowsQtyText_Span").text("line synced");
            else $("#LyricSync_TotalRowsQtyText_Span").text("lines synced");
            if (!isForInstrumentalBreak) {
                g_CurrentRowIndex++; 
                if (g_LyricLinedCounter == 0) {
                    $("#LyricSync_LyricLinesQty_Span").text("no");
                    $("#LyricSync_LyricLinesQtyText_Span").text("lyric lines synced");
                }
                else if (g_LyricLinedCounter == 1) {
                    $("#LyricSync_LyricLinesQty_Span").text("one");
                    $("#LyricSync_LyricLinesQtyText_Span").text("lyric line synced");
                }
                else {
                    $("#LyricSync_LyricLinesQty_Span").text(g_LyricLinedCounter);
                    $("#LyricSync_LyricLinesQtyText_Span").text("lyric lines synced");
                }
                $("#" + g_CurrentRowIndex + "-LyricSyncRow_Span").mousedown();
                setTimeout(function () {
                    buttonUndisabler(true, "btn-sync-lyrics", baseHtml);
                }, 750);
            }
            else {
                if (g_InstrumentalBreaksCounter == 0) {
                    $("#LyricSync_InstrumentalBreaksQty_Span").text("no");
                    $("#LyricSync_InstrumentalBreaksQtyText_Span").text("instrumental breaks applied");
                }
                else if (g_InstrumentalBreaksCounter == 1) {
                    $("#LyricSync_InstrumentalBreaksQty_Span").text("one");
                    $("#LyricSync_InstrumentalBreaksQtyText_Span").text("instrumental break applied");
                }
                else {
                    $("#LyricSync_InstrumentalBreaksQty_Span").text(g_InstrumentalBreaksCounter);
                    $("#LyricSync_InstrumentalBreaksQtyText_Span").text("instrumental breaks applied");
                }
                $("#" + g_CurrentRowIndex + "-LyricSyncRow_Span").mousedown();

                setTimeout(function () {
                    buttonUndisabler(true, "btn-sync-instrumental-break", baseHtml);
                }, 750);
            }
        }
    }
}

function editLyricSync(audioPlayer, editingLineIndex, endTime) {
    if (editingLineIndex != null && endTime != null) {
        if (audioPlayer != null) {
            let prevElementIndex = editingLineIndex - 1;
            let startTime = $("#" + prevElementIndex + "-LyricSync_Timestamp_Val").val();
            if (startTime != undefined) {
                let checkIfLineAlreadyExists = document.getElementById(editingLineIndex + "-LyricSync_LineIndex_Val");
                if (checkIfLineAlreadyExists != null) {
                    g_EditingRowIndex = 0;
                    g_PreviousTimestamp = endTime;

                    $("#" + editingLineIndex + "-LyricSync_Timestamp_Val").val(endTime);
                    endTime = secondsToRegularDuration(endTime);
                    startTime = secondsToRegularDuration(startTime);
                    endTime = endTime == null ? "--:--" : endTime[0] + ":" + endTime[1];
                    startTime = startTime == null ? "--:--" : startTime[0] + ":" + startTime[1];
                    $("#" + editingLineIndex + "-LyricSync_ElementTimestamp_Span").text(startTime + " to " + endTime);
                    $("#" + editingLineIndex + "-LyricSyncRow_Box").removeClass("box-mark-for-editing");
                    $("#" + g_RowsCounter + "-LyricSyncRow_Span").mousedown();

                    buttonUndisabler(true, "btn-sync-lyrics", null);
                    buttonUndisabler(true, "btn-undo-last-sync", null);
                    buttonUndisabler(true, "btn-sync-instrumental-break", null);
                    buttonUndisabler(false, g_RowsCounter + "-LyricSyncRewind_Btn", null);
                }
            }
        }
    }
}

function rewindLyricSyncProcess(audioPlayer, rewindingLineIndex) {
    if (rewindingLineIndex != null || rewindingLineIndex != undefined) {
        audioPlayer = document.getElementById(audioPlayer);
        if (audioPlayer != null) {
            let prevElementIndex = rewindingLineIndex - 1;
            let lineValue = $("#" + rewindingLineIndex + "-LyricSync_LineIndex_Val").val();
            let startTime = $("#" + prevElementIndex + "-LyricSync_Timestamp_Val").val();

            if (lineValue >= 0) {
                buttonUndisabler(true, "btn-sync-lyrics", null);
                buttonDisabler(true, "btn-sync-instrumental-break", null);
            }
            else {
                buttonDisabler(true, "btn-sync-lyrics", null);
                buttonUndisabler(true, "btn-sync-instrumental-break", null);
            }
            buttonDisabler(true, "btn-lyric-sync-rewind", null);

            $("#" + rewindingLineIndex + "-LyricSyncRow_Span").mousedown();
            $("#" + rewindingLineIndex + "-LyricSyncRow_Box").addClass("box-mark-for-editing");
            $("#" + rewindingLineIndex + "-LyricSync_ElementTimestamp_Span").attr("data-timestamp-text", $("#" + rewindingLineIndex + "-LyricSync_ElementTimestamp_Span").html());
            $("#" + rewindingLineIndex + "-LyricSync_ElementTimestamp_Span").html("Tap to stop edit<br/><small class='card-text text-muted'>" + $("#" + rewindingLineIndex + "-LyricSync_ElementTimestamp_Span").attr("data-timestamp-text"));

            g_EditingRowIndex = rewindingLineIndex;
            g_CurrentRowIndex = parseInt(rewindingLineIndex) + 1;

            audioPlayer.currentTime = startTime;
        }
    }
}

$(document).on("mousedown", ".btn-sync-lyrics", function () {
    let audioPlayer = document.getElementById("OngakuPlayer_Audio");
    let currentTime = audioPlayer.currentTime;

    if (g_EditingRowIndex == null || g_EditingRowIndex == 0) submitLyricSync(audioPlayer, false, currentTime);
    else editLyricSync(audioPlayer, g_EditingRowIndex, currentTime);
});

$(document).on("mousedown", ".btn-sync-instrumental-break", function () {
    let audioPlayer = document.getElementById("OngakuPlayer_Audio");
    let currentTime = audioPlayer.currentTime;
    let editingRowIndex = $("#LyricSync_EditingRowIndex_Val").val();

    if (editingRowIndex == null || editingRowIndex == 0) submitLyricSync(audioPlayer, true, currentTime);
    else editLyricSync(audioPlayer, editingRowIndex, currentTime);
});

$(document).on("mousedown", ".btn-lyric-sync-rewind", function () {
    let rowIndex = getTrueId($(this).attr("id"), false);
    if (rowIndex != undefined) rewindLyricSyncProcess("OngakuPlayer_Audio", rowIndex);
});

$(document).on("mousedown", ".box-mark-for-editing", function () {
    let audioPlayer = document.getElementById("OngakuPlayer_Audio");
    let rowIndex = getTrueId($(this).attr("id"), false);
    if (rowIndex != undefined && audioPlayer != null) {
        let lastAppliedTime = $("#LyricSync_PreviousTimestamp_Val").val();
        $("#" + rowIndex + "-LyricSyncRow_Box").removeClass("box-mark-for-editing");
        $("#" + rowIndex + "-LyricSync_ElementTimestamp_Span").html($("#" + rowIndex + "-LyricSync_ElementTimestamp_Span").attr("data-timestamp-text"));
        $("#" + rowIndex + "-LyricSync_ElementTimestamp_Span").removeAttr("data-timestamp-text");
        buttonUndisabler(true, "btn-sync-lyrics", null);
        buttonUndisabler(true, "btn-sync-instrumental-break", null);
        buttonUndisabler(false, rowIndex + "-LyricSyncRewind_Btn", null);

        audioPlayer.currentTime = lastAppliedTime;
    }
});

$(document).on("mousedown", ".btn-undo-last-sync", function () {
    let lastSyncIndex = $(this).attr("data-last-sync-index");
    if (lastSyncIndex != undefined) {
        $("#" + lastSyncIndex + "-LyricSyncRewind_Btn").mousedown();
    }
});

$(document).on("mousedown", ".btn-undo-total-prepare", function () {
    buttonDisabler(true, "btn-undo-total-prepare", null);
    callAProposal(' <i class="fa-solid fa-rotate-right anime-sync-shift"></i> ', "Reset All?", "All saved timestamps will be permanently removed. You'll need to start syncing from the beginning", "Yes, Restart", ["btn-undo-total"], null, null, false, null, 30);
});

$(document).on("mousedown", ".btn-undo-total", function () {
    uncallAProposal();
    hideBySlidingToLeft(true, null, "lyric-sync-row");

    g_RowsCounter = 0;
    g_EditingRowIndex = 0;
    g_CurrentRowIndex = 0;
    g_CurrentTimestamp = 0;
    g_PreviousTimestamp = 0;
    g_LyricLinedCounter = 0;
    g_InstrumentalBreaksCounter = 0;

    audioPause("OngakuPlayer_Audio");
    audioEdit("OngakuPlayer_Audio", null, null, null, 0);
    $("#0-LyricSyncRow_Span").mousedown();
    $("#LyricSync_Timestamps_Box").empty();

    $("#LyricSync_TotalRowsQty_Span").text("No");
    $("#LyricSync_LyricLinesQty_Span").text("no");
    $("#LyricSync_InstrumentalBreaksQty_Span").text("no");
    $("#LyricSync_TotalRowsQtyText_Span").text("lines synced");
    $("#LyricSync_LyricLinesQtyText_Span").text("lyric lines synced");
    $("#LyricSync_IntrumentalBreaksQtyText_Span").text("instrumental breaks applied");

    setTimeout(function () {
        $("#LyricSync_Stats_Box").empty();
        $("#LyricSync_Stats_Box").append('<div class="row lyric-sync-row" id="Initial-LyricSyncRow_Box"> <div class="col col-1 regular-start-table-cell text-center" id="0-RowRank_Col_Box"> <span class="console-log-text">1</span> </div> <div class="col col-3 regular-mid-table-cell text-center" id="0-Timestamp_Col_Box"> <span class="console-log-text text-muted">00:00 to --:--</span> </div> <div class="col col-6 regular-end-table-cell text-center" id="0-Lyrics_Col_Box"> <span class="console-log-text">start to show here</span> </div> <div class="col col-2 regular-end-table-cell text-center" id="0-Lyrics_Col_Box"> <button type="button" class="btn btn-cybepunked btn-sm me-2" disabled> <i class="fa-solid fa-clock-rotate-left"></i> </button> <button type="button" class="btn btn-cybepunked btn-sm text-danger" disabled> <i class="fa-solid fa-xmark"></i> </button> </div> </div>');
    }, 750);
    buttonDisabler(true, "btn-undo-last-sync", null);
    buttonDisabler(true, "btn-lyric-sync-preview", null);
    buttonDisabler(true, "btn-undo-total-prepare", null);
});

$(document).on("mousedown", ".btn-lyric-sync-undo", function () {
    let rowIndex = getTrueId($(this).attr("id"), false);
    if (rowIndex != undefined) {
        let prevRowIndex = rowIndex - 1;
        let currentLineIndex = parseInt($("#" + rowIndex + "-LyricSync_LineIndex_Val").val());
        let prevTimestampStart = Math.round(parseInt($("#" + prevRowIndex + "-LyricSync_Timestamp_Val").val()));

        buttonDisabler(false, $(this).attr("id"), ' <i class="fa-regular fa-circle-xmark anime-sync-shift"></i> ');
        buttonUndisabler(false, prevRowIndex + "-LyricSyncUndo_Btn", null);
        buttonUndisabler(false, prevRowIndex + "-LyricSyncRewind_Btn", null);
        
        if (currentLineIndex >= 0) {
            g_LyricLinedCounter--;
            $("#" + g_LyricLinedCounter + "-LyricSyncRow_Span").mousedown();
        }
        else g_InstrumentalBreaksCounter--;

        $("#TimeSync_RowNumber_Span").text(rowIndex);
        g_RowsCounter--;
        g_CurrentRowIndex = prevRowIndex;
        currentLineIndex = g_LyricLinedCounter;
        g_PreviousTimestamp = g_RowsCounter > 0 ? prevTimestampStart : 0;

        $("#" + rowIndex + "-LyricSync_LineIndex_Val").remove();
        $("#" + rowIndex + "-LyricSync_Timestamp_Val").remove();
        if (prevRowIndex >= 0) $(".btn-undo-last-sync").attr("data-last-sync-index", prevRowIndex);
        else {
            buttonDisabler(true, "btn-undo-last-sync", null);
            buttonDisabler(true, "btn-undo-total-prepare", null);
            $(".btn-undo-last-sync").removeAttr("data-last-sync-index");
        }

        if (g_RowsCounter <= 0) {
            buttonDisabler(false, "LyricSync_SbmtBtn", null);
            $("#LyricSync_TotalRowsQty_Span").text("No");
            $("#LyricSync_TotalRowsQtyText_Span").text("lines synced");
        }
        else if (g_RowsCounter == 1) {
            buttonUndisabler(false, "LyricSync_SbmtBtn", null);
            $("#LyricSync_TotalRowsQty_Span").text("One");
            $("#LyricSync_TotalRowsQtyText_Span").text("line synced");
        }
        else {
            $("#LyricSync_TotalRowsQty_Span").text(g_RowsCounter);
            $("#LyricSync_TotalRowsQtyText_Span").text("lines synced");
        }
        if (g_LyricLinedCounter <= 0) {
            $("#LyricSync_LyricLinesQty_Span").text("no");
            $("#LyricSync_LyricLinesQtyText_Span").text("lyric lines synced");
        }
        else if (g_LyricLinedCounter == 1) {
            $("#LyricSync_LyricLinesQty_Span").text("one");
            $("#LyricSync_LyricLinesQtyText_Span").text("lyric line synced");
        }
        else {
            $("#LyricSync_LyricLinesQty_Span").text(g_LyricLinedCounter);
            $("#LyricSync_LyricLinesQtyText_Span").text("lyric lines synced");
        }
        if (g_InstrumentalBreaksCounter <= 0) {
            $("#LyricSync_InstrumentalBreaksQty_Span").text("no");
            $("#LyricSync_IntrumentalBreaksQtyText_Span").text("instrumental breaks applied");
        }
        else if (g_InstrumentalBreaksCounter == 1) {
            $("#LyricSync_InstrumentalBreaksQty_Span").text("one");
            $("#LyricSync_IntrumentalBreaksQtyText_Span").text("instrumental break applied");
        }
        else {
            $("#LyricSync_InstrumentalBreaksQty_Span").text(g_InstrumentalBreaksCounter);
            $("#LyricSync_IntrumentalBreaksQtyText_Span").text("instrumental breaks applied");
        }

        audioPause("OngakuPlayer_Audio");
        audioEdit("OngakuPlayer_Audio", null, null, null, isNaN(prevTimestampStart) ? 0 : prevTimestampStart);

        hideBySlidingToLeft(false, null, rowIndex + "-LyricSyncRow_Box");
        setTimeout(function () {
            $("#" + rowIndex + "-LyricSyncRow_Box").remove();
            buttonUndisabler(false, $(this).attr("id"), ' <i class="fa-solid fa-rotate"></i> ');
            if (rowsTotalQty <= 0) {
                $("#LyricSync_Stats_Box").append('<div class="row lyric-sync-row" id="Initial-LyricSyncRow_Box"> <div class="col col-1 regular-start-table-cell text-center" id="0-RowRank_Col_Box"> <span class="console-log-text">1</span> </div> <div class="col col-3 regular-mid-table-cell text-center" id="0-Timestamp_Col_Box"> <span class="console-log-text text-muted">00:00 to --:--</span> </div> <div class="col col-6 regular-end-table-cell text-center" id="0-Lyrics_Col_Box"> <span class="console-log-text">start to show here</span> </div> <div class="col col-2 regular-end-table-cell text-center" id="0-Lyrics_Col_Box"> <button type="button" class="btn btn-cybepunked btn-sm me-2" disabled> <i class="fa-solid fa-clock-rotate-left"></i> </button> <button type="button" class="btn btn-cybepunked btn-sm text-danger" disabled> <i class="fa-solid fa-xmark"></i> </button> </div> </div>');
                buttonDisabler(true, "btn-undo-last-sync", null);
                buttonDisabler(true, "btn-undo-total-prepare", null);
            }
        }, 750);
    }
});

$(document).on("mousedown", ".lyric-row-choose", function () {
    let rowIndex = getTrueId($(this).attr("id"), false);
    if (rowIndex != undefined) {
        $("#LyricSync_CurrentRowIndex_Val").val(rowIndex);
        $("#TimeSync_RowNumber_Span").text(++rowIndex);
        $(".lyric-text").removeClass("lyric-text-active");
        $(this).addClass("lyric-text-active");
    }
});

$(document).on("mousedown", ".btn-lyric-sync-preview", function () {
    let lyricRows = document.getElementsByClassName("lyric-sync-lines");
    let lyricTimestamps = document.getElementsByClassName("lyric-sync-timestamps");
    let lyrics = $("#LyricSync_Lyrics_Val").val();
    if (lyrics != null && lyricRows.length > 0 && lyricTimestamps.length > 0) {
        let lyricRowValues = [];
        let lyricTimestampValues = [];
        for (let i = 0; i < lyricRows.length; i++) {
            if ($("#" + lyricRows[i].id != undefined)) lyricRowValues.push($("#" + lyricRows[i].id).val());
        }
        for (let i = 0; i < lyricTimestamps.length; i++) {
            if ($("#" + lyricTimestamps[i].id != undefined) != undefined) lyricTimestampValues.push($("#" + lyricTimestamps[i].id).val());
        }
        lyricSyncPreview("OngakuPlayer_Audio", lyricRowValues, lyricTimestampValues);
    }
});

$(document).on("mousedown", ".btn-stop-lyric-sync-preview", function () {
    stopLyricSyncPreview("OngakuPlayer_Audio");
});

$(document).on("mousedown", ".btn-track-backward-for", function () {
    let audioPlayer = document.getElementById("OngakuPlayer_Audio");
    if (audioPlayer != null) {
        let rewindDuration = $(this).attr("data-rewind-for");
        rewindDuration = rewindDuration == undefined ? 15 : rewindDuration;
        audioPlayerRewind(audioPlayer.id, rewindDuration, true, false);
        $(".btn-track-backward-for").html(' <i class="fa-solid fa-arrow-rotate-left anime-rewind-shift"></i> ');
        //function audioEdit

    }
});
$(document).on("mousedown", ".btn-track-forward-for", function () {
    let audioPlayer = document.getElementById("OngakuPlayer_Audio");
    if (audioPlayer != null) {
        let rewindDuration = $(this).attr("data-rewind-for");
        rewindDuration = rewindDuration == undefined ? 15 : rewindDuration;
        audioPlayerRewind(audioPlayer.id, rewindDuration, false, false);
        $(".btn-track-forward-for").html(' <i class="fa-solid fa-arrow-rotate-right anime-sync-shift"></i> ');
    }
});

function lyricSyncPreview(audioPlayerId = null, lyricRowsArr = [], timestampsArr = []) {
    if (lyricRowsArr.length > 0 && timestampsArr.length > 0 && audioPlayerId != null) {
        let audioPlayer = document.getElementById(audioPlayerId);
        audioPlayerTypeSwitch(audioPlayerId, 1);
        audioEdit(audioPlayerId, null, null, null, 0);

        let currentTime = 0;
        let currentRowIndex = 0;
        let rowTimeStamp = timestampsArr[currentRowIndex];

        $(audioPlayer).on("timeupdate", function () {
            currentTime = audioPlayer.currentTime;
            rowTimeStamp = timestampsArr[currentRowIndex];
            $(".lyric-text").removeClass("lyric-text-active");
            $("#" + currentRowIndex + "-LyricSyncRow_Span").addClass("lyric-text-active");
            if (currentTime > rowTimeStamp) {
                currentRowIndex++;
            }
        });

        $(".btn-lyric-sync-preview").addClass("btn-stop-lyric-sync-preview");
        $(".btn-lyric-sync-preview").removeClass("btn-lyric-sync-preview");
        $(".btn-stop-lyric-sync-preview").html(' <i class="fa-solid fa-stop"></i> Stop Previewing');
        $(".btn-stop-lyric-sync-preview-sm").html(' <i class="fa-solid fa-stop"></i> ');
    }
}

function lyricSynchronization(audioPlayerId = null, lyrics = null, lyricRowsArr = [], timestampsArr = []) {
    if (lyrics != null && lyricRowsArr.length > 0 && timestampsArr.length > 0 && audioPlayerId != null) {
        let audioPlayer = document.getElementById(audioPlayerId);
        if (audioPlayer != null) {
            let currentTime = 0;
            let currentRowIndex = 0;
            let rowTimeStamp = timestampsArr[currentRowIndex];
            audioEdit(audioPlayerId, null, null, null, 0);

            $("audio").on("timeupdate", function () {
                currentTime = audioPlayer.currentTime;
                $(".lyric-text").removeClass("lyric-text-active");
                $("#" + currentRowIndex + "-LyricSyncRow_Span").addClass("lyric-text-active");
                if (currentTime > rowTimeStamp) {
                    currentRowIndex++;
                }
            });
        }
    }
}

function stopLyricSyncPreview(audioPlayerId) {
    if (audioPlayerId != null) {
        let recentSyncRowIndex = $("#LyricSync_CurrentRowIndex_Val").val();
        let recentSyncTimestamp = $("#LyricSync_PreviousTimestamp_Val").val();
        audioPlayerTypeSwitch(audioPlayerId, 2);
        audioEdit(audioPlayerId, null, null, null, recentSyncTimestamp);
        $("#" + recentSyncRowIndex + "-LyricSyncRow_Span").mousedown();

        $(".btn-stop-lyric-sync-preview").addClass("btn-lyric-sync-preview");
        $(".btn-stop-lyric-sync-preview").html(' <i class="fa-regular fa-eye"></i> Preview');
        $(".btn-lyric-sync-preview").removeClass("btn-stop-lyric-sync-preview");
        $(".btn-stop-lyric-sync-preview-sm").html(' <i class="fa-solid fa-stop"></i> ');
    }
}

$(document).on("submit", "#DeleteTrackLyrics_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "DeleteTrackLyrics_SbmtBtn", "Deleting...");

    $.post(url, data, function (response) {
        if (response.success) {
            slideContainers("EditTrackLyrics_Container", "ReleaseInfo_Container");
            callAlert('<i class="fa-solid fa-trash-can fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "Lyrics were deleted successfully", 3.5, "Hide", -1, null);
            setTimeout(function () {
                $("#DTL_Id_Val").val(0);
                $("#UTL_Hint_Val").val(null);
                $("#UTL_Content_Val").val(null);
                $("#UTL_LanguageId_Val").val(0);
                $("#UTL_LanguageDisplay_Val").val(null);
                $("#UTL_Content_Val-RowsIndicator_Span").html("0");
                $("#UTL_Content_Val-Indicator_Span").html("0/4 000");
                $("#DeleteTrackLyrics_Box").fadeOut(0);
                buttonDisabler(false, "UpdateTrackLyrics_SbmtBtn", null);
            }, 300);
        }
        else {
            $("#GetTrackLyrics_Id_Val").val(0);
            buttonDisabler(false, "GetTrackLyrics_SbmtBtn", null);
            buttonDisabler(false, "UpdateTrackLyrics_SbmtBtn", null);
            slideContainers("EditTrackLyrics_Container", "ReleaseInfo_Container");
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "The text lyrics are currently unavailable for deletion", 3.75, "Close", -1, null);
        }
        buttonDisabler(false, "DeleteTrackLyrics_SbmtBtn", null);
        $("#DeleteTrackLyrics_SbmtBtn").html(' <i class= "fa-solid fa-trash-can"></i> Delete');
    });
});

function rowsToSpan(identifierNonUniquePart = null, text, spanClassList = []) {
    const cleanedText = text.replace(/\s{2,}/g, '\n').trim();
    const inlinedToLines = cleanedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (inlinedToLines != null && inlinedToLines.length > 0) {
        let index = 0;
        let currentSpan;
        let spanRowsArr = [];
        let fullClasslist = null;
        if (spanClassList != null && spanClassList.length > 0) {
            for (let i = 0; i < spanClassList.length; i++) {
                if (i == 0) fullClasslist = spanClassList[i];
                else fullClasslist += " " + spanClassList[i];
            }
        } 

        for (let i = 0; i < inlinedToLines.length; i++) {
            currentSpan = fullClasslist != null ? elementDesigner("span", fullClasslist, inlinedToLines[i]) : elementDesigner("span", "card-text", inlinedToLines[i]);
            if (identifierNonUniquePart == null || identifierNonUniquePart == undefined) currentSpan.attr("id", index + "-RowList_Span");
            else currentSpan.attr("id", index + "-" + identifierNonUniquePart);
            spanRowsArr.push(currentSpan);
            index++;
        }
        return [inlinedToLines, spanRowsArr];
    } 

    return inlinedToLines;
}

$(document).on("submit", "#UpdateTrackCoverImage_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let formData = new FormData();

    let imgFile = $("#UTCI_File_Val").get(0).files[0];
    formData.append("id", $("#UTCI_Id_Val").val());
    formData.append("coverImageUrl", imgFile);
    buttonDisabler(true, "btn-save-images", "Applying...");

    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.success) {
                $("#ReleaseInfo_Img_Box").fadeOut(0);
                $("#" + response.id + "-StudioRelease_Img_Box").fadeOut(0);
                $("#ReleaseInfo_Img").attr("src", "/TrackCovers/" + response.result + "?" + new Date().getTime());
                $("#" + response.id + "-StudioRelease_Img").attr("src", "/TrackCovers/" + response.result + "?" + new Date().getTime());
                $("#ReleaseInfo_Img").fadeIn(0);
                $("#" + response.id + "-StudioRelease_Img").fadeIn(0);
                uncallAContainer(false, "ImagePreview_Container");
                callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "The cover image has been successfully updated for this track", 3.25, "Close", -1, null);
            }
            else {
                uncallAContainer(false, "ImagePreview_Container");
                callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-duration: 0.85s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.3s;></i>', null, null, "Invalid cover image format. Please select a supported format such as <span class='fw-500'>.jpg (.jpeg)</span>, <span class='fw-500'>.png</span>, <span class='fw-500'>.webp</span>, or another common image type", 3.5, "Close", -1, null);
            }
            buttonUndisabler(true, "btn-save-images", "Save");
        }
    });
});

$(document).on("submit", "#UpdateTrackCredits_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            slideContainers(null, "Primary_Container");
            callAlert('<i class="fa-solid fa-user-check"></i>', null, null, "The track credits have been successfully updated", 3.5, "Okay", -1, null);
            //Edit Credits
            /*GetTrackCredits_Id_Val*/
        }
        else {
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.75s; --fa-animation-iteration-count: 2;"></i>', null, null, "There appears to be an issue with the entered credit details. Please review the information and try again", 3.75, "Okay", -1, null);
        }
    });
});

$(document).on("submit", "#UpdateTrackLyrics_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            slideContainers(null, "Primary_Container");
            buttonUndisabler(false, "TimeSyncLyrics_Btn", null);
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Lyrics saved. Use time-synced lyrics for this track?", 4.5, " <i class='fa-solid fa-group-arrows-rotate'></i> Apply Sync", 1, "$('#TimeSyncLyrics_Btn').mousedown();");
        }
        else {
            buttonDisabler(false, "TimeSyncLyrics_Btn", null);
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.75s; --fa-animation-iteration-count: 2;"></i>', null, null, "There appears to be an issue with the entered lyrics and its details. Please review them and try again", 3.75, "Okay", -1, null);
        }
    });
});

$(document).on("mousedown", "#TimeSyncLyrics_Btn", function () {
    $("#GetTrackLyrics_Type_Val").val(2);
    $("#GetTrackLyrics_Form").submit();
});

$(document).on("submit", "#UpdateTrackStatus_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            $("#UpdateTrackStatus_Status_Val").val(response.updatedStatus);
            switch (parseInt(response.status)) {
                case 0:
                    $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                    $("#UpdateTrackStatus_SbmtBtn").html('Mute <span class="float-end ps-2"> <i class="fa-solid fa-volume-xmark"></i> </span>');
                    $("#TrackReleaseDropdownText_Span").html("Released and public.<br/>Tap to mute and hide");
                    $("#" + response.id + "-ReleaseInfo_Badge").html(' <i class="fa-solid fa-check-double"></i> Active');
                    callAlert('<i class="fa-solid fa-volume-high"></i>', null, null, "Track unmuted successfully", 4.25, "Close", -1, null);
                    break;
                case 1:
                    $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                    $("#UpdateTrackStatus_SbmtBtn").html('Mute <span class="float-end ps-2"> <i class="fa-solid fa-volume-xmark"></i> </span>');
                    $("#TrackReleaseDropdownText_Span").html("Released and public.<br/>Tap to mute and hide");
                    $("#" + response.id + "-ReleaseInfo_Badge").html(' <i class="fa-solid fa-check-double"></i> Active');
                    callAlert('<i class="fa-solid fa-check-double"></i>', null, null, " The track has been successfully released and is now available for listening", 4.25, "Close", -1, null);
                    break;
                case 3:
                    $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                    $("#UpdateTrackStatus_SbmtBtn").html('Unmute <span class="float-end ps-2"> <i class="fa-solid fa-volume-high"></i> </span>');
                    $("#TrackReleaseDropdownText_Span").html("You manually muted this track.< br /> Tap to unmute and make it visible to everyone");
                    $("#" + response.id + "-ReleaseInfo_Badge").html(' <i class="fa-solid fa-volume-xmark"></i> Muted');
                    callAlert('<i class="fa-solid fa-volume-xmark"></i>', null, null, "This track was manually muted. It’s hidden from search, playback, and your artist page. You can unmute it anytime, or set a date to unmute automatically", 3.5, "Close", -1, null);
                    break;
                default:
                    $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                    $("#UpdateTrackStatus_SbmtBtn").html('Mute <span class="float-end ps-2"> <i class="fa-solid fa-volume-xmar"></i> </span>');
                    $("#TrackReleaseDropdownText_Span").html("Released and public.<br/>Tap to mute and hide");
                    $("#" + response.id + "-ReleaseInfo_Badge").html(' <i class="fa-solid fa-check-double"></i> Active');
                    callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Track unmuted successfully", 4.25, "Close", -1, null);
                    break;
            }
            $("#TrackReleaseDropdownText_Span").fadeIn(0);
        }
        else {
            callAlert('<i class="fa-solid fa-xmark fa-shake" --fa-animation-duration: 0.85s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.3s;></i>', null, null, "Track status can’t be edited right now. Try again later", 3.5, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#CreateNewPlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let formData = new FormData();
    let baseHtml = $("#CreatePlaylist_SbmtBtn").html();
    const title = $("#CNP_Title_Val").val();
    const privacyValue = $("#CNP_Privacy_Val").val();
    const image = $("#CNP_ImageUrl_Val").get(0).files[0];

    formData.append("title", title);
    formData.append("imageUrl", image);
    formData.append("privacyStatus", privacyValue);
    buttonDisabler(false, "CreatePlaylist_SbmtBtn", "Processing...");

    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                let divExists = document.getElementById("Playlists_Container");
                if (divExists != null) { 
                    let resultBox = playlistSampler(response.result.id, response.result.title, response.result.imgUrl != null ? response.result.imgUrl : null, 0, 0, response.result.trueId, response.userId, response.userId, true);
                    if (resultBox != null) {
                        let songsQty = $("#PlaylistsSongs_Qty_Span").text();
                        let count = $("#PlaylistsQty_Span").text();

                        if (songsQty == undefined) songsQty = 0;
                        if (count != undefined) count = count == "One" ? 1 : parseInt(count);
                        else count = 0;
                        count++;
                        $("#PlaylistsListed_Box").append(resultBox);
                        if (parseInt(count) > 1) $("#PlaylistsStats_Span").html("<span class='fw-500'>" + count > 1 + "</span> playlists containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
                        else $("#PlaylistsStats_Span").html("<span class='fw-500'>One</span> playlist containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsTotalQty + "</span> song(s)");
                    }
                }
                buttonUndisabler(false, "CreatePlaylist_SbmtBtn", baseHtml);
                callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "The playlist has been successfully created. You may now proceed to edit it and add songs as desired", 4, "Got It", -1, null);
            }
            else {
                buttonDisabler(false, "CreatePlaylist_SbmtBtn", baseHtml);
                callAlert('<i class="fa-solid fa-xmark" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, response.alert, 3.75, "Close", -1, null);
            }
        }
    });
});

$(document).on("submit", "#EditPlaylistsCoverImage_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let formData = new FormData();

    let id = $("#EPCI_Id_Val").val();
    let imgUrl = $("#EPCI_ImageUrl_Val").get(0).files[0];
    formData.append("id", id);
    formData.append("imageUrl", imgUrl);

    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.success) {
                //playlistSampler();
                let currentUrl = $("#" + response.id + "-PlaylistInfo_Img").attr("src");
                if (currentUrl != undefined) $("#" + response.id + "-PlaylistInfo_Img").attr("src", "/PlaylistCovers/" + response.result + "?" + new Date().getTime());
                else {
                    let newImgElement = $("<img class='release-img-sm' alt='This image cannot be displayed' />");
                    newElement.attr("id", response.id + "-PlaylistInfo_Img");
                    newImgElement.attr("src", "/PlaylistCovers/" + response.result + "?" + new Date().getTime());
                    $("#" + response.id + "-PlaylistInfo_Img").replaceWith(newElement);
                }
                callAlert(' <i class="fa-solid fa-check-double"></i> ', null, null, "The playlist cover image has been updated", 3.5, "Hide", -1, null);
            }
            else callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i>', null, null, "Updating the playlist cover image is temporarily unavailable", 3.75, "Close", -1, null);
            uncallAContainer(false, "ImagePreview_Container");
        }
    });
});

$(document).on("submit", "#PinThePlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "btn-pin-the-playlist", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let isPinnedIcon = $("<small class='card-text text-muted'>Pinned ∙ </small>");
            isPinnedIcon.attr("id", response.id + "-PlaylistPinned_Span");

            $("#" + response.id + "-PlaylistPinned_Span").fadeIn(300);
            $("#" + response.id + "-PlaylistStats_Span").prepend(isPinnedIcon);
            $("#" + response.id + "-PinOrUnpinThePlaylist_Btn").addClass("btn-unpin-the-playlist");
            $("#" + response.id + "-PinOrUnpinThePlaylist_Btn").removeClass("btn-pin-the-playlist");
            $("#" + response.id + "-PinOrUnpinThePlaylist_Btn").html('Unpin <span class="float-end ms-1"><i class="fa-solid fa-thumbtack-slash"></i></span> ');
            callAlert('<i class="fa-solid fa-thumbtack fa-bounce" style="--fa-animation-duration: 0.95s; --fa-animation-iteration-count: 1; --fa-animation-delay: 0.45s;"></i>', null, null, "Playlist pinned successfully", 3.25, "Got It", -1, null);
        }
        else callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i>', null, null, "Pinning is currently disabled", 3.5, "Hide", -1, null);
        $("#PTP_Id_Val").val(0);
        buttonUndisabler(false, "btn-pin-the-playlist", null);
    });
});

$(document).on("submit", "#UnpinThePlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "btn-unpin-the-playlist", null);

    $.post(url, data, function (response) {
        if (response.success) {
            $("#" + response.id + "-PlaylistPinned_Span").fadeOut(300);
            $("#" + response.id + "-PinOrUnpinThePlaylist_Btn").addClass("btn-pin-the-playlist");
            $("#" + response.id + "-PinOrUnpinThePlaylist_Btn").removeClass("btn-unpin-the-playlist");
            $("#" + response.id + "-PinOrUnpinThePlaylist_Btn").html('Pin <span class="float-end ms-1"><i class="fa-solid fa-thumbtack"></i></span> ');
            setTimeout(function () {
                $("#" + response.id + "-PlaylistPinned_Span").remove();
            }, 350);
            callAlert('<i class="fa-solid fa-thumbtack-slash"></i>', null, null, "Playlist unpinned", 3.25, "Got It", -1, null);
        }
        else callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i>', null, null, "Playlist unpinning is currently unavailable", 3.5, "Hide", -1, null);
        $("#UnTP_Id_Val").val(0);
        buttonUndisabler(false, "btn-unpin-the-playlist", null);
    });
});

$(document).on("submit", "#EditPlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            $("#" + response.id + "-PlaylistTitle_Lbl").html(response.result.title);
            slideContainers("EditPlaylist_Container", "Primary_Container");
            setTimeout(function () {
                callAlert('<i class="fa-regular fa-circle-check fa-spin" --fa-animation-delay: 0.35s; --fa-animation-iteration-count: 1; --fa-animation-duration: 0.1s;></i>', null, null, "Playlist info edited successfully", 3.75, null, -1, null);
            }, 350);
        }
        else {
            buttonDisabler(false, "EditPlaylist_SbmtBtn", null);
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i>', null, null, "Playlist info editing unavailable", 3.5, "Hide", -1, null);
        }
    });
});

$(document).on("submit", "#EditPlaylistShortname_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = "Save Changes";

    $.post(url, data, function (response) {
        if (response.success) {
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "PlayThe playlist's short name was updated successfully", 3.5, "Close", -1, null);
            buttonDisabler(false, "EditPlaylistShortname_SbmtBtn", ' <i class="fa-solid fa-check-double"></i> Shortname Changed');
            setTimeout(function () {
                $("#EditPlaylistShortname_SbmtBtn").html(baseHtml);
            }, 2500);
        }
        else {
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "The playlist's short name cannot be updated at this time", 3.75, "Close", -1, null);
            buttonDisabler(false, "EditPlaylistShortname_SbmtBtn", baseHtml);
        }
    });
});

$(document).on("submit", "#SaveOrRemoveThePlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(true, "btn-save-the-playlist", null);
    buttonDisabler(true, "btn-remove-the-playlist", null);
    buttonDisabler(true, "btn-pre-remove-the-playlist", null);

    $.post(url, data, function (response) {
        if (response.success) {
            if (!response.isSaved) {
                let statsFullInfoSpan = $("<small class='card-text text-muted' id='PlaylistsStats_Span'></small>");
                let playlistsQty = parseInt($("#PlaylistsQty_Span").html());
                let songsQty = $("#PlaylistsSongs_Qty_Span").text();
                playlistsQty = (isNaN(playlistsQty) ? 1 : playlistsQty);
                playlistsQty--;
                $("#PlaylistsStats_Box").empty();
                if (playlistsQty > 1) statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>" + playlistsQty + "</span> playlists containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
                else statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>One</span> playlist containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
                $("#PlaylistsHeaderQty_Span").text(playlistsQty);
                $("#PlaylistsStats_Box").append(statsFullInfoSpan);

                $(".btn-save-the-playlist").fadeIn(0);
                $(".btn-save-the-playlist").attr("data-id", response.id);
                $(".btn-save-the-playlist").removeClass("super-disabled");
                $(".btn-remove-the-playlist").fadeOut(0);
                $(".btn-remove-the-playlist").attr("data-id", 0);
                $(".btn-remove-the-playlist").addClass("super-disabled");
                uncallAProposal();
                buttonUndisabler(true, "btn-remove-the-playlist", null);
                buttonUndisabler(true, "btn-pre-remove-the-playlist", null);
                setTimeout(function () {
                    animahider(false, response.id + "-PlaylistInfo_Box");
                    setTimeout(function () {
                        $("#" + response.id + "-PlaylistInfo_Box").remove();
                    }, 750);
                    callAlert('<i class="fa-regular fa-circle-check fa-spin" style="--fa-animation-delay: 0.35s; --fa-animation-duration: 0.25s; --fa-animation-iteration-count: 2;"></i>', null, null, "Playlist removed successfully", 3.5, "Got It", -1, null);
                }, 350);
            }
            else {
                //playlistInfoSampler();
                let savedPlaylist = playlistSampler(response.id, response.playlist.name, response.playlist.imageUrl, response.playlist.songsQty, 0, response.playlist.id, response.userId, response.playlist.userId, true);
                if (savedPlaylist != null) {
                    $(".btn-save-the-playlist").fadeOut(0);
                    $(".btn-save-the-playlist").attr("data-id", 0);
                    $(".btn-save-the-playlist").addClass("super-disabled");
                    $(".btn-remove-the-playlist").fadeIn(0);
                    $(".btn-remove-the-playlist").attr("data-id", response.id);
                    $(".btn-remove-the-playlist").removeClass("super-disabled");
                    $("#PlaylistsListed_Box").append(savedPlaylist);
                }
                buttonUndisabler(true, "btn-save-the-playlist", null);
                setTimeout(function () {
                    callAlert('<i class="fa-regular fa-circle-check fa-spin" style="--fa-animation-delay: 0.35s; --fa-animation-duration: 0.25s; --fa-animation-iteration-count: 2;"></i>', null, null, "Playlist saved successfully", 3.5, "Got It", -1, null);
                }, 350);
            }
        }
        else callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "Removing playlists is temporarily unavailable", 3.75, "Close", -1, null);
    });
});

$(document).on("submit", "#DeleteThePlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = ' <i class="fa-regular fa-trash-can"></i> Delete';
    buttonDisabler(true, "btn-delete-the-playlist", "Deleting...");

    $.post(url, data, function (response) {
        uncallAProposal();
        if (response.success) {
            let statsFullInfoSpan = $("<small class='card-text text-muted' id='PlaylistsStats_Span'></small>");
            let playlistsQty = parseInt($("#PlaylistsQty_Span").html());
            let songsQty = $("#PlaylistsSongs_Qty_Span").text();
            playlistsQty = (isNaN(playlistsQty) ? 1 : playlistsQty);
            playlistsQty--;

            $("#PlaylistsStats_Box").empty();
            if (playlistsQty > 1) statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>" + playlistsQty + "</span> playlists containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
            else statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>One</span> playlist containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
            $("#PlaylistsHeaderQty_Span").text(playlistsQty);
            $("#PlaylistsStats_Box").append(statsFullInfoSpan);
            setTimeout(function () {
                animahider(false, response.id + "-PlaylistInfo_Box");
                callAlert('<i class="fa-solid fa-wave-square"></i>', null, null, "Playlist successfully deleted", 3.5, "Got It", -1, null);
            }, 450);
            setTimeout(function () {
                $("#" + playlistId + "-PlaylistInfo_Box").remove();
            }, 900);
            buttonUndisabler(true, "btn-delete-the-playlist", baseHtml);
        }
        else callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "Deleting this playlist is temporarily unavailable", 3.75, "Close", -1, null);
    });
});

$(document).on("submit", "#CheckShortnameAvailability_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#EditPlaylistShortname_SbmtBtn").html();
    buttonDisabler(false, "EditPlaylistShortname_SbmtBtn", "Checking...");
    $("#EditPlaylistShortname_SbmtBtn").html(' <i class="fa-solid fa-xmark"></i> Shortname is Taken');

    $.get(url, data, function (response) {
        if (!response.success) {
            buttonUndisabler(false, "EditPlaylistShortname_SbmtBtn", "");
            $("#EditPlaylistShortname_SbmtBtn").html(' <i class="fa-solid fa-check-double"></i> Shortname is Free');
            setTimeout(function () {
                buttonUndisabler(false, "EditPlaylistShortname_SbmtBtn", "Save Changes");
            }, 2500);
        }
        else {
            buttonDisabler(false, "EditPlaylistShortname_SbmtBtn", "");
            $("#EditPlaylistShortname_SbmtBtn").html(' <i class="fa-solid fa-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i> Shortname is Taken');
            setTimeout(function () {
                buttonDisabler(false, "EditPlaylistShortname_SbmtBtn", baseHtml);
            }, 2500);
        }
    });
});

$(document).on("submit", "#GetPlaylists_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.type == 0) {
                createSmContainer("Playlists", "Playlists ∙ <span id='PlaylistsHeaderQty_Span'>0</span>", "<div class='d-none' id='PlaylistSettingForms_Box'><div class='d-none'><form method='get' action='/Playlists/GetEditInfo' id='GetEditInfo_Form'><input type='hidden' name='Id' id='GEI_Id_Val' value='0' /></form><form method='post' action='/Playlists/EditCoverImage' id='EditPlaylistsCoverImage_Form'> <input type='hidden' name='Id' id='EPCI_Id_Val' value='0' /> <input type='file' name='ImageUrl' id='EPCI_ImageUrl_Val' data-trigger='EditPlaylistsCoverImage_Form' accept='image/png, image/gif, image/jpeg' /> </form> </div> <form method='get' action='/Playlists/GetShortname' id='GetPlaylistShortname_Form'><input type='hidden' name='Id' id='GPS_Id_Val' value='0' /></form><form method='post' action='/Playlists/Pin' id='PinThePlaylist_Form'> <input type='hidden' name='Id' id='PTP_Id_Val' value='0' /> </form> <form method='post' action='/Playlists/Unpin' id='UnpinThePlaylist_Form'> <input type='hidden' name='Id' id='UnTP_Id_Val' value='0' /> </form> </div><div class='box-standard' id='PlaylistsListed_Box'></div><div class='box-standard mt-2' id='PlaylistsStatsInfoMain_Box'></div>", null, null, false);
                $("#PlaylistsListed_Box").empty();
                $("#PlaylistsHeaderQty_Span").text(response.count + 1);
                let songsTotalQty = response.favoriteSongsQty;
                let statsFullInfoBox = $("<div class='box-standard text-center mt-1 p-1' id='PlaylistsStats_Box'></div>");
                let statsFullInfoSpan = $("<small class='card-text text-muted' id='PlaylistsStats_Span'></small>");
                //playlistInfoSampler(); GetFavorites
                let favoriteElement = favoriteSampler(response.favoriteSongsQty);
                if (favoriteElement != null) $("#PlaylistsListed_Box").append(favoriteElement);
                if (response.count > 0) {
                    $.each(response.result, function (index) {
                        let element = playlistSampler(response.result[index].id, response.result[index].playlist.name, response.result[index].playlist.imageUrl, response.result[index].playlist.songsQty, response.result[index].pinOrder, response.result[index].playlistId, response.userId, response.result[index].playlist.userId, true);
                        if (element != null) {
                            $("#PlaylistsListed_Box").append(element);
                            songsTotalQty += response.result[index].playlist.songsQty;
                        }
                    });
                }

                if (parseInt(response.count + 1) > 1) statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>" + parseInt(response.count + 1) + "</span> playlists containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsTotalQty + "</span> song(s)");
                else statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>One</span> playlist containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsTotalQty + "</span> song(s)");
                statsFullInfoBox.append(statsFullInfoSpan);
                $("#PlaylistsStatsInfoMain_Box").append(statsFullInfoBox);
                setTimeout(function () {
                    callASmContainer(false, "Playlists_Container");
                }, 150);
            }
            else {
                let trackId = $("#GetPlaylists_Type_Val").attr("data-track-id");
                if (response.result.length > 0 && trackId != undefined) {
                    //playlistSongsApplier()
                    createHeadlessContainer("TrackManagement", '<div class="box-standard p-1"> <div class="box-standard mt-2"> <h6 class="h6">Available Playlists</h6> <div class="box-standard mt-1" id="AvailablePlaylists_Box"></div> </div> </div> <div class="box-standard sticky-bottom text-center mt-2"> <form method="post" action="/Playlists/AddTo" id="AddToPlaylist_Form"> <input type="hidden" name="Id" id="ATP_Id_Val" value="0" /> <input type="hidden" name="PlaylistId" id="ATP_PlaylistId_Val" value="0" /> <button type="submit" class="btn btn-standard-bolded br-max-corners text-center super-disabled w-100" id="AddToPlaylist_SbmtBtn">Save Changes</button> </form> </div>', false);
                    $("#AvailablePlaylists_Box").empty();
                    $(".track-adding-to-favorites-val").remove();
                    $("#ATP_ChosenPlaylistsQty_Lbl").text("No Chosen Playlist");
                    $.each(response.result, function (index) {
                        let playlistBox = trackManagemenetPlaylistsSampler(response.result[index].playlistId, response.result[index].id, response.result[index].playlist.name, response.result[index].playlist.imageUrl, false);
                        if (playlistBox != null) {
                            $("#AvailablePlaylists_Box").append(playlistBox);
                        }
                    });
                    displayCorrector(currentWindowSize);
                    setTimeout(function () {
                        $("#ATP_Id_Val").val(trackId);
                        $("#GetPlaylists_Type_Val").removeAttr('data-track-id');
                        callAContainer(false, "TrackManagement_Container", false);
                    }, 150);
                }            
            }
        }
        else callAlert('<i class="fa-solid fa-bars-staggered"></i>', null, null, "Playlists are temporarily unavailable", 4, "Okay", -1, null);
        $("#GetPlaylists_Type_Val").val(0);
    });
});

$(document).on("submit", "#GetPlaylistShortname_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {//GetTrackLyrics
            createSmContainer("EditPlaylistShortname", "Edit Shortname", '<div class="box-bordered bg-light text-center p-2"> <h2 class="h2"> <i class="fa-solid fa-at"></i> </h2> <h4 class="h4">Shortname</h4> <small class="card-text text-muted">Edit the short name of your playlist to make it easier for other users to find and access it directly via its link (this feature is only available for public playlists)</small> </div> <div class="box-standard mt-2"> <div class="d-none"> <form method="get" action="/Playlists/CheckShortnameAvailability" id="CheckShortnameAvailability_Form"> <input type="hidden" name="Id" id="CSA_Id_Val" value="0" /> <input type="hidden" name="Shortname" id="CSA_Shortname_Val" /> </form> </div> <form method="post" action="/Playlists/EditShortname" id="EditPlaylistShortname_Form"> <div> <input type="hidden" name="Id" id="EPS_Id_Val" value="0" /> <button type="button" class="btn btn-standard btn-tooltip btn-sm float-end ms-1" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-html="true" data-bs-title="Shortname makes it easier to find your playlist (<strong>if public</strong>) via its link, like: ongaku.com/playlists/plist/<strong>shortname</strong>"> <i class="fa-solid fa-circle-info"></i> </button> <label class="form-label fw-500 ms-1">Shortname</label> <input type="text" class="form-control form-control-guard form-control-restricted form-control-checker" id="EPS_Shortname_Val" data-form="CheckShortnameAvailability_Form" data-form-target="CSA_Shortname_Val" data-form-base-html="Save Changes" name="Shortname" maxlength="15" placeholder="Set a shortname for your playlist" data-min-length="3" data-change="EditPlaylistShortname_SbmtBtn" data-update="EPS_Shortname_Val-Warn" data-base-value="(unavailable)" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted"> <i class="fa-solid fa-link"></i> Link: onugaku.com/playlists/plist/<span class="fw-500" id="EPS_Shortname_Val-Warn"></span></small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="EditPlaylistShortname_SbmtBtn">Save Changes</button> </div> </form> </div>', null, null);
            $("#CSA_Id_Val").val(response.id);
            $("#EPS_Id_Val").val(response.id);
            if (response.result != null) {
                $("#EPS_Shortname_Val").val(response.result);
                $("#CSA_Shortname_Val").val(response.result);
                $("#EPS_Shortname_Val-Warn").html(response.result);
            }
            else {
                $("#EPS_Shortname_Val").val(null);
                $("#CSA_Shortname_Val").val(null);
                $("#EPS_Shortname_Val-Warn").html("(undefined)");
            }
            displayCorrector(currentWindowSize);
            setTimeout(function () {
                slideSmContainers(null, "EditPlaylistShortname_Container");
            }, 150);
        }
    });
});

$(document).on("submit", "#GetEditInfo_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = 'Edit <span class="float-end ms-1"> <i class="fa-solid fa-pencil"></i> </span>';
    buttonDisabler(false, "btn-edit-playlist", "Loading...");

    $.get(url, data, function (response) {
        if (response.success) {
            createAContainer("EditPlaylist", "Edit " + response.result.name + " Playlist", '<div class="mt-1"> <div class="d-none"> <form method="post" action="/Playlists/Delete" id="DeleteThePlaylist_Form"> <input type="hidden" name="Id" id="DTP_Id_Val" value="0" /> </form> </div> <form method="post" action="/Playlists/Edit" id="EditPlaylist_Form"> <div> <span class="form-label fw-500 ms-1">Title</span> <div class="mt-1"> <input type="hidden" name="Id" id="EP_Id_Val" value="0" /> <input type="text" class="form-control form-control-guard" name="Title" id="EP_Title_Val" maxlength="90" data-min-length="1" data-target="EditPlaylist_SbmtBtn" placeholder="Set a name for this playlist" /> </div> </div> <div class="mt-3"> <span class="form-label fw-500 ms-1">Description</span> <div class="mt-1"> <button type="button" class="btn btn-standard-bordered btn-sm"><i class="fa-solid fa-font"></i> Chars: <span id="EPD_Counter_Span">0/360</span></button> </div> <div class="mt-1"> <textarea class="form-control form-control-guard form-textarea" rows="1" id="EP_Description_Val" data-length-display="EPD_Counter_Span" maxlength="360" name="Description" placeholder="Set a description for this playlist"></textarea> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Description is optional for playlists</small> </div> <div class="mt-3"> <label class="form-label fw-500 ms-1">Privacy</label> <div class="box-switcher row mt-1 ms-1 me-1"> <input type="hidden" name="Privacy" id="EP_Privacy_Val" value="0" /> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="EP_Privacy_Val" data-value="2" data-description="This playlist is visible to everyone" id="EP_Privacy_Val-0_Btn">Public</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="EP_Privacy_Val" data-value="1" data-description="Visible to you and your subscribers only" id="EP_Privacy_Val-1_Btn">Semi-Private</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member-active btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="EP_Privacy_Val" data-value="0" data-description="Only you can see this playlist" id="EP_Privacy_Val-2_Btn">Private</button> </div> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="EP_Privacy_Val-Warn">Only you can see this playlist</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="EditPlaylist_SbmtBtn">Save Changes</button> </div> </form> <div class="box-bordered text-center mt-2 p-2"> <small class="card-text text-muted">Additional details — including the <span class="fw-500">cover image</span>, <span class="fw-500">shortname</span>, <span class="fw-500">pinning</span>, and <span class="fw-500">unpinning</span> — must be modified outside of this container</small> </div> </div>', '<button type="button" class="btn btn-standard btn-pre-delete-the-playlist btn-sm text-danger"> <i class="fa-regular fa-trash-can"></i> Delete</button>', null);
            $("#EP_Id_Val").val(response.result.id);
            $("#EP_Title_Val").val(response.result.name);
            if (response.result.description != null) {
                $("#EP_Description_Val").val(response.result.description);
                getElementLength("EP_Description_Val", "EPD_Counter_Span", false);
            }
            else {
                $("#EP_Description_Val").val(null);
                $("#EPD_Counter_Span").text("0/360");
            }
            $("#EP_Privacy_Val").val(response.result.privacyStatus);
            $("#EP_Privacy_Val-" + response.result.privacyStatus + "_Btn").mousedown();
            if (response.result.name != null) $("#EditPlaylist_SbmtBtn").removeAttr("super-disabled");

            $(".btn-pre-delete-the-playlist").attr('id', response.result.id + "-DeleteThePlaylist_Btn");
            $(".btn-pre-delete-the-playlist").removeAttr("super-disabled");
            buttonUndisabler(true, "btn-edit-playlist", baseHtml);

            displayCorrector(currentWindowSize);
            setTimeout(function () {
                slideContainers(null, "EditPlaylist_Container");
            }, 150);
        }
        else callAlert('<i class="fa-regular fa-pen-to-square"></i>', null, null, "Playlist editing is temporarily unavailable", 4, "Okay", -1, null);
    });
});

$(document).on("mousedown", ".btn-pin-the-playlist", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#PTP_Id_Val").val(trueId);
        $("#PinThePlaylist_Form").submit();
    }
});

$(document).on("mousedown", ".btn-unpin-the-playlist", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#UnTP_Id_Val").val(trueId);
        $("#UnpinThePlaylist_Form").submit();
    }
});

$(document).on("mousedown", ".btn-pre-remove-the-playlist", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        let playlistName = $("#" + trueId + "-PlaylistTitle_Lbl").html();
        callAProposal('<i class="fa-regular fa-square-minus"></i>', "Remove '" + playlistName + "' Playlist", "Are you sure you want to remove <span class='fw-500'>" + playlistName + "</span> playlist?", ' <i class="fa-regular fa-square-minus"></i> Remove', ["btn-remove-the-playlist"], ["data-id"], [trueId], false, null, 40);
    }
});

$(document).on("mousedown", ".btn-save-the-playlist", function () {
    let thisId = $(this).attr("data-id");
    if (thisId != undefined) {
        $("#SORTP_Id_Val").val(thisId);
        $("#SaveOrRemoveThePlaylist_Form").attr("action", "/Playlists/Save");
        $("#SaveOrRemoveThePlaylist_Form").submit();
    }
});

$(document).on("mousedown", ".btn-remove-the-playlist", function () {
    let thisId = $(this).attr("data-id");
    if (thisId != undefined) {
        $("#SORTP_Id_Val").val(thisId);
        $("#SaveOrRemoveThePlaylist_Form").attr("action", "/Playlists/Remove");
        $("#SaveOrRemoveThePlaylist_Form").submit();
    }
    else {
        uncallAProposal();
        callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Playlist removal unavailable", 3.5, "Close", -1, null);
    }
});

$(document).on("mousedown", ".btn-delete-the-playlist", function () {
    let thisId = $(this).attr("data-id");
    if (thisId != undefined) {
        $("#DTP_Id_Val").val(thisId);
        $("#DeleteThePlaylist_Form").submit();
    }
});

$(document).on("mousedown", ".btn-pre-delete-the-playlist", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let playlistName = $("#" + trueId + "-PlaylistTitle_Lbl").html();
        callAProposal('<i class="fa-regular fa-trash-can text-danger"></i>', "Delete '" + playlistName + "' Playlist", "Are you sure you want to delete <span class='fw-500'>" + playlistName + "</span> playlist? All songs and related information will be permanently deleted. This action cannot be undone", ' <i class="fa-regular fa-trash-can"></i> Delete', ["btn-delete-the-playlist", "bg-soft-danger", "text-light"], ["data-id"], [trueId], false, null, 35);
    }
});

$(document).on("mousedown", ".btn-edit-playlist", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#GEI_Id_Val").val(trueId);
        $("#GetEditInfo_Form").submit();
    }
    else $("#GEI_Id_Val").val(0);
});

$(document).on("mousedown", ".btn-edit-playlist-shortname", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#GPS_Id_Val").val(trueId);
        $("#GetPlaylistShortname_Form").submit();
    }
});

$(document).on("mousedown", ".btn-remove-from-playlist", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    let playlistId = $(this).attr("data-playlist-id");
    if (trueId != undefined && playlistId != undefined) {
        $("#RFP_Id_Val").val(trueId);
        $("#RFP_PlaylistId_Val").val(playlistId);
        $("#RemoveFromPlaylist_Form").submit();
    }
});

$(document).on("submit", "#GetSingleInfo_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                singleSampler(response.isForAuthor, response.result.isFavorite, response.result.id, response.result.status, response.result.title, response.result.coverImageUrl, response.result.genres, response.result.releasedAt, response.result.user, response.result.userId, response.result.trackArtists, response.result.trackFileUrl);
            }
            displayCorrector(currentWindowSize);
            setTimeout(function () {
                slideContainers(null, "ReleaseInfo_Container");
            }, 150);
        }
        else {
            callAlert('<i class="fa-solid fa-music"></i>', null, null, "This single is temporarily unavailable to see", 3.75, "Close", -1, null);
        }
        $("#GSI_IsForAuthor_Val").val(false);
    });
});

$(document).on("submit", "#GetTracksInfo_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.type == 0) {
                let isReady = isContainerOpen("PushTracksToAlbum_Container");
                if (!isReady) {
                    createInsideLgCard("PushTracksToAlbum", "Push Tracks", '<div class="box-standard"> <span class="h4">Choose Tracks</span> <br/> <small class="card-text text-muted">Select the tracks you’d like to include in your album</small> </div> <div class="box-standard mt-3 p-1" id="ChosenTracks_Box"> <h5 class="h5" id="AddTracksToAlbum_IncludedTracks_Lbl">Included Tracks</h6> <div class="box-standard mt-3" id="ChosenTracks_Collection_Box" style="display: none;"> </div> <div class="box-standard mt-3" id="ChosenTracks_EmptyCollection_Box"> <h6 class="h6">No Included Tracks</h6> <small class="card-text text-muted">Select the tracks you want from <span class="fw-500">Available Tracks</span>, then tap <i class="fa-solid fa-plus"></i> to add them to this album</small> </div> </div> <div class="box-standard mt-3 p-1" id="TracksList_Box"> <h5 class="h5" id="AddTracksToAlbum_AvailableTracks_Lbl">Available Tracks</h5> <div class="box-standard" id="TracksList_Collection_Box" style="display: none;"> </div> <div class="box-standard mt-3" id="TracksList_EmptyCollection_Box"> <h5 class="h6">No Available Tracks</h5> <small class="card-text text-muted">You do not have any tracks yet. Add some to include them in your albums</small> </div> </div> <div class="box-standard liquid-glass sticky-bottom text-center mt-2 p-1"> <input type="hidden" id="PushAlbumTracks_TracksQty_Val" value="0" /> <small class="card-text text-muted" id="PushAlbumTracks_TracksQty_Span">No Included Tracks</small> <form method="post" action="/Album/PushTracks" id="PushAlbumTracks_Form"> <input type="hidden" name="Id" id="PushAlbumTracks_Id_Val" value="0" /> <div class="d-none" id="PushAlbumTracks_Tracks_Box"></div> <button type="submit" class="btn btn-standard-rounded btn-classic-styled text-center super-disabled w-100 mt-2" id="PushAlbumTracks_SbmtBtn">Save Tracks</button> </form> </div>', null, '<button type="button" class="btn btn-standard-rounded btn-tooltip" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-placement="bottom" data-bs-html="true" data-bs-title="Albums need at least 2 tracks (EP if up to 6). Premieres without tracks won’t be released"> <i class="fa-regular fa-circle-question"></i> </button>');

                    if (response.result != null && response.result.length > 0) {
                        let albumId = parseInt($("#AlbumInfo_Identifier_Val").val());
                        trackPushSongsApplier(response.result, "TracksList_Collection_Box", false);

                        $.each(response.result, function (index) {
                            let includedOnes = [];

                            if (response.result[index].isIncluded) {
                                includedOnes.push(response.result[index]);
                            }

                            if (includedOnes.length > 0) {
                                $("#ChosenTracks_Collection_Box").empty();
                                $.each(includedOnes, function (index) {
                                    let featuringArtistIds = [];
                                    let featuringArtistsNames = [];
                                    $.each(includedOnes[index].featuringArtists, function (index) {
                                        featuringArtistIds.push(includedOnes.featuringArtists.id);
                                        featuringArtistIds.push(includedOnes.featuringArtists.nickname);
                                    });
                                    trackUnpushSongApplier(includedOnes[index].id, includedOnes[index].coverImageUrl, includedOnes[index].title, includedOnes[index].artistName, featuringArtistIds, featuringArtistsNames, includedOnes[index].hasExplicit, "ChosenTracks_Collection_Box");
                                });
                                $("#ChosenTracks_Collection_Box").fadeIn(0);
                                $("#ChosenTracks_EmptyCollection_Box").fadeOut(0);
                            }
                            else {
                                $("#ChosenTracks_Collection_Box").fadeOut(0);
                                $("#ChosenTracks_EmptyCollection_Box").fadeIn(0);
                                $("#ChosenTracks_Collection_Box").empty();
                            }
                        });

                        $("#TracksList_Collection_Box").fadeIn(0);
                        $("#TracksList_EmptyCollection_Box").fadeOut(0);
                        $("#PushAlbumTracks_Id_Val").val(albumId);
                    }
                    else {
                        $("#PushAlbumTracks_Id_Val").val(0);
                        $("#TracksList_Collection_Box").fadeOut(0);
                        $("#TracksList_EmptyCollection_Box").fadeIn(0);
                        $("#TracksList_Collection_Box").empty();
                    }

                    setTimeout(function () {
                        callInsideLgContainer(false, "PushTracksToAlbum_Container", false);
                    }, 150);
                }
            }
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-folder-open"></i>', null, null, "No tracks uploaded — add some to continue", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket"></i>', null, null, "Access to tracks is unavailable. Please sign in to continue", 3.5, "Sign In", 2, null);
        }
    });
});

$(document).on("submit", "#PushAlbumTracks_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#PushAlbumTracks_SbmtBtn").html();
    buttonDisabler(false, "PushAlbumTracks_SbmtBtn", ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Pushing...');
    //SubmitTheAlbum_SbmtBtn
    $.post(url, data, function (response) {
        if (response.success) {
            $("#AlbumInfo_SongsQty_Span").text(response.count);

            if (response.result > 0) {
                albumSongsApplier(albumPushedTracks, albumPushedTracks.artistName, "AlbumSongs_Box", "AlbumInfo_SongsQty_Span", false, 0);
            }
            else {
                $("#AlbumSongs_Box").empty();
                $("#AlbumSongs_Box").html('<div class="box-standard text-center mt-3"> <h2 class="h2"> <i class="fa-solid fa-compact-disc fa-spin"></i> </h2> <h4 class="h4">Album is Empty</h4> <small class="card-text text-muted">This album doesn’t have any tracks yet</small> </div>');
            }
            buttonUndisabler(false, "PushAlbumTracks_SbmtBtn", baseHtml);
            slideContainers("PushTracksToAlbum_Container", "AlbumInfo_Container");
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Tracks successfully pushed to album", 3.5, "Close", -1, null);
        }
        else {
            setTimeout(function () {
                buttonUndisabler(false, "PushAlbumTracks_SbmtBtn", baseHtml);
            }, 2500);
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "An error occurred while adding tracks to the album. Please try again late", 3.75, "Got It", -1, null);
        }
    });
});
let albumPushedTracks = [];
$(document).on("mousedown", ".btn-push-to-album", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let result = pushTheTrackToAlbum(0, trueId, "PushAlbumTracks_Tracks_Box");
        if (result >= 0) {
            let trackTitle = $("#" + trueId + "-PushToAlbum_TrackTitle_Lbl").html();
            let isExplicit = $("#" + trueId + "-PushToAlbum_IsExplicit_Span").css("display");
            let trackImgUrl = $("#" + trueId + "-PushToAlbum_TrackCover_Img").attr("src");
            let trackArtist = $("#" + trueId + "-PushToAlbum_ArtistInfo_Span").html();

            let trackMainArtistName = null;
            let trackSecondaryArtists = [];
            let trackSecondaryArtistIds = [];
            let trackSecondaryArtistNames = [];
            let trackArtistChilds = $(trackArtist).children();
            isExplicit = isExplicit == "none" ? false : true;

            if (trackArtistChilds.prevObject.length > 0) {
                for (let i = 0; i < trackArtistChilds.prevObject.length; i++) {
                    let object = $(trackArtistChilds.prevObject[i]);

                    if (i == 0) trackMainArtistName = $(object).html();
                    else {
                        if ($(object).attr("id") != undefined) {
                            let artistId = parseInt(getTrueId($(object).attr("id"), false));
                            let artistName = $(object).html();

                            trackSecondaryArtistIds.push(artistId);
                            trackSecondaryArtistNames.push(artistName);
                            trackSecondaryArtists.push({ id: artistId, artistName: artistName });
                        }
                    }
                }
            }

            let pushedTrackElement = {
                id: trueId,
                title: trackTitle,
                hasExplicit: isExplicit,
                coverImageUrl: trackImgUrl,
                artistName: trackMainArtistName,
                featuringArtists: trackSecondaryArtists,
            };
            $("#ChosenTracks_Collection_Box").fadeIn(0);
            $("#ChosenTracks_EmptyCollection_Box").fadeOut(0);
            $("#PushAlbumTracks_TracksQty_Val").val(result);
            buttonDisabler(false, "PushAlbumTracks_SbmtBtn", null);

            if (result > 1) {
                buttonUndisabler(false, "PushAlbumTracks_SbmtBtn", null);
                $("#PushAlbumTracks_TracksQty_Span").html(result + " Tracks Included");
            }
            else if (result == 1) $("#PushAlbumTracks_TracksQty_Span").html("One Track Included");
            else $("#PushAlbumTracks_TracksQty_Span").html("No Included Tracks");

            albumPushedTracks.push(pushedTrackElement);
            buttonDisabler(false, trueId + "-PushToAlbum_Btn", '<i class="fa-solid fa-check"></i>');
            trackUnpushSongApplier(trueId, trackImgUrl, trackTitle, trackMainArtistName, trackSecondaryArtistIds, trackSecondaryArtistNames, isExplicit, "ChosenTracks_Collection_Box");
        }
    }
});

$(document).on("mousedown", ".btn-unpush-from-album", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let result = unpushTheTrackFromAlbum(trueId);
        if (result >= 0) {
            $("#PushAlbumTracks_TracksQty_Val").val(result);
            buttonDisabler(false, "PushAlbumTracks_SbmtBtn", null);
            hideBySlidingToLeft(false, null, trueId + "-UnpushFromAlbum_Box");

            setTimeout(function () {
                $("#" + trueId + "-UnpushFromAlbum_Box").remove();
                buttonUndisabler(false, trueId + "-PushToAlbum_Btn", '<i class="fa-solid fa-plus"></i>');

                if (result <= 0) {
                    $("#ChosenTracks_Collection_Box").fadeOut(0);
                    $("#ChosenTracks_EmptyCollection_Box").fadeIn(0);
                }
            }, 600);

            if (result > 1) {
                buttonUndisabler(false, "PushAlbumTracks_SbmtBtn", null);
                $("#PushAlbumTracks_TracksQty_Span").html(result + " Tracks Included");
            }
            else if (result == 1) $("#PushAlbumTracks_TracksQty_Span").html("One Track Included");
            else $("#PushAlbumTracks_TracksQty_Span").html("No Included Tracks");

            if (albumPushedTracks.length > 0) {
                for (let i = 0; i < albumPushedTracks.length; i++) {
                    if (albumPushedTracks[i].trueId == trueId) {
                        albumPushedTracks[i].splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
});

function pushTheTrackToAlbum(order = 0, trackId = 0, parentElementId = null) {
    if (parentElementId != null || parentElementId != undefined) {
        let checkAvailability = document.getElementById(trackId + "-TrackPush_Box");
        if (checkAvailability) return -1;
        else {
            let trackPushId_Input = $("<input type='hidden' name='TrackId' />");
            let trackPushOrder_Input = $("<input type='hidden' name='Order' />");
            let trackPushBox = elementDesigner("div", "track-push-box d-none", null);
            let quantity = document.getElementsByClassName("track-push-box").length;

            if (order <= 0) order = quantity + 1;

            trackPushId_Input.val(trackId);
            trackPushId_Input.attr("id", trackId + "-TrackPush_Id_Val");
            trackPushOrder_Input.val(order);
            trackPushOrder_Input.attr("id", trackId + "-TrackPush_Order_Val");
            trackPushBox.attr("id", trackId + "-TrackPush_Box");

            trackPushBox.append(trackPushId_Input);
            trackPushBox.append(trackPushOrder_Input);
            $("#" + parentElementId).append(trackPushBox);

            return ++quantity;
        }
    }
    else return -1;
}

function unpushTheTrackFromAlbum(id = 0) {
    if (id != null && id != undefined) {
        let checkAvailability = document.getElementById(id + "-TrackPush_Box");
        if (checkAvailability) {
            $("#" + id + "-TrackPush_Box").remove();
            let quantity = document.getElementsByClassName("track-push-box").length;

            return quantity;
        }
        else return -1;
    }
    else return -1;
}

$(document).on("submit", "#GetFavorites_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#GetFavorites_SbmtBtn").html();
    buttonDisabler(false, "GetFavorites_SbmtBtn", "Loading...");

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                let songsArr = [];
                let userId = $("#CSA_Id_Val").val();
                let nickname = $("#CurrentUserNickname_Val").val();
                let imageUrl = $("#CurrentUserProfile_Img").attr("src");
                imageUrl = imageUrl == undefined ? $("#CurrentUserProfile_Img").html() : imageUrl;

                for (let i = 0; i < response.result.length; i++) {
                    songsArr.push(response.result[i].track);
                }
                favoritesInfoSampler(response.count, songsArr, response.lastUpdatedAt);
                setTimeout(function () {
                    slideContainers(null, "PlaylistInfo_Container");
                }, 150);
            }
        }
        else {
            callAlert('<i class="fa-solid fa-music"></i>', null, null, "Access to favorite songs is temporarily unavailable", 3.5, "Close", -1, null);
        }
        buttonUndisabler(false, "GetFavorites_SbmtBtn", baseHtml);
    });
});

$(document).on("submit", "#AddToPlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#AddToPlaylist_SbmtBtn").html();
    buttonDisabler(false, "AddToPlaylist_SbmtBtn", "Saving...");

    $.post(url, data, function (response) {
        uncallAContainer(false, "TrackManagement_Container");
        if (response.success) {
            let songsQty = parseInt($("#" + response.playlistId + "-PlaylistInfo_Box").attr("data-tracks-qty")) + 1;
            $("#" + response.playlistId + "-PlaylistInfo_Box").attr("data-tracks-qty", songsQty);

            $("#ATP_Id_Val").val(0);
            buttonUndisabler(false, "AddToPlaylist_SbmtBtn", baseHtml);
            $("#" + response.id + "-PlaylistInfo_Box").attr("data-tracks-qty", songsQty);
            if (songsQty <= 0) $("#" + response.playlistId + "-PlaylistSongsQty_Span").html(" ∙ No Songs");
            else if (songsQty == 1) $("#" + response.playlistId + "-PlaylistSongsQty_Span").html(" ∙ One Song");
            else $("#" + response.playlistId + "-PlaylistSongsQty_Span").html(" ∙ " + songsQty + " Songs");

            setTimeout(function () {
                callAlert('<i class="fa-regular fa-circle-check fa-beat-fade" style="--fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2;"></i>', null, null, "Track added to your selected playlist(s)", 3.5, "Close", -1, null);
            }, 350);
        }
        else {
            setTimeout(function () {
                callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2;"></i>', null, null, "Failed to add track to playlist", 3.75, "Close", -1, null);
            }, 350);
        }
    });
});

$(document).on("submit", "#RemoveFromPlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            let songsQty = parseInt($("#" + response.playlistId + "-PlaylistInfo_Box").attr("data-tracks-qty"));
            songsQty = isNaN(songsQty) ? 0 : --songsQty;
            if (songsQty > 0) {
                hideBySlidingToLeft(false, null, response.id + "-TrackMain_Box");
                setTimeout(function () {
                    $("#" + response.id + "-TrackMain_Box").remove();
                }, 750);
            }
            else {
                hideBySlidingToLeft(false, null, response.id + "-TrackMain_Box");
                setTimeout(function () {
                    $("#PlaylistInfo_TrackBoxes_Box").empty();
                    $("#PlaylistInfo_TrackBoxes_Box").html('<div class="box-bordered text-center p-2 mt-1"> <h2 class="h2"> <i class="fa-regular fa-folder-open"></i> </h2> <h5 class="h5">Your Playlist is Empty</h5> <small class="card-text text-muted">Looks like there is nothing here yet! Start adding your favorite songs and create the perfect playlist</small> </div>');
                    $(".btn-play-pause-track-lg").removeAttr();
                    $(".btn-play-pause-track-lg").attr("data-id", 0);
                    $(".btn-audio-shuffle").addClass("super-disabled");
                    $(".btn-play-pause-track-lg").addClass("super-disabled");
                }, 750);
            }
            $("#" + response.playlistId + "-PlaylistInfo_Box").attr("data-tracks-qty", songsQty);
            if (songsQty <= 0) {
                $("#PlaylistInfo_SongsQty_Span").html("No Songs");
                $("#" + response.playlistId + "-PlaylistSongsQty_Span").html(" ∙ No Songs");
            }
            else if (songsQty == 1) {
                $("#PlaylistInfo_SongsQty_Span").html("<span class='fw-500'>One</span> Songs");
                $("#" + response.playlistId + "-PlaylistSongsQty_Span").html(" ∙ One Song");
            }
            else {
                $("#PlaylistInfo_SongsQty_Span").html("<span class='fw-500'>" + songsQty + "</span> Songs");
                $("#" + response.playlistId + "-PlaylistSongsQty_Span").html(" ∙ " + songsQty + " Songs");
            }
            callAlert('<i class="fa-regular fa-circle-check fa-spin" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 1; --fa-animation-duration: 0.25s;"></i>', null, null, "Song deleted from playlist", 3.5, "Close", -1, null);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "Song removal failed due to an error", 3.75, "Close", -1, null);
    });
});

$(document).on("submit", "#GetArtistInfo_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            createHeadlessContainer("ArtistInfo", null, '<div class="box-lg-part-header-for-artist box-lg-part-header"> <div class="hstack gap-1"> <button type="button" class="btn btn-artist-top-fixed-header me-1"> <i class="fa-solid fa-angle-left"></i> </button> <span class="artist-top-fixed-header-lbl">Artist Name</span> <button type="button" class="btn btn-artist-top-fixed-header btn-artist-page-play-pause-btn btn-play-pause-track ms-auto" id="Header_ArtistTracks_StartToPlay_Btn"> <i class="fa-solid fa-play"></i> </button> </div> </div> <div class="box-lg-part-body box-lg-part-body-for-artist"> <div class="artist-page-avatar-box" id="ArtistAvatar_Box"> <div class="artist-page-avatar-content"> <div class="avatar-page-legacy-img-box" id="ArtistLegacyAvatar_Img_Box">A</div> <img class="avatar-page-legacy-img" src="#" alt="This image cannot be loaded" style="display: none;" id="ArtistLegacyAvatar_Img" /> <div class="hstack gap-2"> <button type="button" class="btn btn-user-page-special btn-artist-page-play-pause-btn btn-play-pause-track me-1" id="ArtistTracks_StartToPlay_Btn"> <i class="fa-solid fa-play"></i> </button> <h1 class="avatar-page-title" id="ArtistName_Lbl">Imagine Dragons</h1> </div> </div> </div> <div class="artist-page-head-buttons-box"> <div class="row"> <div class="col"> <form method="get" action="/Artist/GetPageTracks" id="GetArtistPageTracks_Form"> <input type="hidden" name="Id" id="GetArtistPageTracks_Id_Val" value="0" /> <button type="submit" class="btn btn-artist-page-header focused" id="GetArtistPageTracks_SbmtBtn">Music</button> </form> </div> <div class="col"> <form method="get" action="/Posts/Load" id="LoadUserPosts_Form"> <input type="hidden" name="Id" id="LoadUserPosts_Id_Val" value="0" /> <input type="hidden" name="Id" id="LoadUserPosts_Skip_Val" value="0" /> <button type="submit" class="btn btn-artist-page-header" id="LoadUserPosts_SbmtBtn">Posts</button> </form> </div> <div class="col"> <div id="AlreadySubscribed_Box" style="display: none;"> <form method="post" action="/Artist/Unsubscribe" id="UnsubscribeFromArtist_Form"> <input type="hidden" name="Id" id="UnsubscribeFromArtist_Id_Val" value="0" /> <button type="submit" class="btn btn-artist-page-header" id="UnsubscribeFromArtist_SbmtBtn"> <i class="fa-solid fa-star"></i> </button> </form> </div> <div id="NotYetSubscribed_Box"> <form method="post" action="/Artist/Subscribe" id="SubscribeForArtist_Form"> <input type="hidden" name="Id" id="SubscribeForArtist_Id_Val" value="0" /> <button type="submit" class="btn btn-artist-page-header" id="SubscribeForArtist_SbmtBtn"> <i class="fa-regular fa-star"></i> </button> </form> </div> </div> <div class="col"> <div class="dropup"> <button class="btn btn-artist-page-header" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button> <ul class="dropdown-menu dro shadow-sm"> <li><button type="button" class="dropdown-item btn-artist-page-play-pause-btn btn-play-pause-track" id="Dropdown_ArtistTracks_StartToPlay_Btn">Play <span class="float-end"> <i class="fa-solid fa-play"></i> </span></button></li> <li><button type="button" class="dropdown-item">Share <span class="float-end"> <i class="fa-solid fa-arrow-up-from-bracket"></i> </span></button></li> <li><button type="button" class="dropdown-item">Statistics <span class="float-end"> <i class="fa-regular fa-chart-bar"></i> </span></button></li> <li> <form method="get" action="/Artist/GetCredits" id="GetArtistCredits_Form"> <input type="hidden" name="Id" id="GetArtistCredits_Id_Val" value="0" /> <button type="button" class="dropdown-item">Get Credits <span class="float-end"> <i class="fa-solid fa-circle-info"></i> </span></button> </form> </li> </ul> </div> </div> </div> </div> <div class="slide-box p-2" id="ArtistAllReleases_Box"> <div class="release-box-lg mt-2" id="ArtistLastRelease_Box"> <div class="hstack gap-1"> <div class="release-img-box-standard" id="ALR_Img_Box"> <i class="fa-solid fa-music"></i> </div> <img src="#" class="release-img-standard" alt="This image cannot be displayed" id="ALR_Img" style="display: none;" /> <div class="ms-1"> <div class="box-forced-top pt-2"> <small class="card-text">Released <span class="fw-500" id="ALR_ReleaseDate_Span">Fri, 16 May</span></small> </div> <div class="box-forced-bottom pb-2"> <span class="badge-standard badge-sm"> <i class="fa-solid fa-certificate"></i> Latest Release </span> <div class="mt-1"> <span class="h5" id="ALR_Title_Lbl">Popular Release</span> <br /> <small class="card-text text-muted" id="ALR_Artists_Span">Main Artist feat. Artists</small> </div> </div> </div> <div class="ms-auto"> <button type="button" class="btn btn-standard btn-sm me-1"> <i class="fa-solid fa-plus"></i> </button> <button type="button" class="btn btn-standard btn-sm"> <i class="fa-solid fa-star"></i> </button> </div> </div> </div> <div class="box-standard mt-2" id="PopularSongs_Box"> <h5 class="h5 ms-1"> Popular Songs <small class="card-text text-muted"> <i class="fa-solid fa-angle-right"></i> </small> </h5> <div class="box-standard mt-2" id="PopularSongs_Row"> </div> </div> <div class="box-standard mt-2" id="Albums_Box" style="display: none;"> <h5 class="h5 ms-1"> Albums <small class="card-text text-muted"> <i class="fa-solid fa-angle-right"></i> </small> </h5> <div class="box-standard mt-2" id="Albums_Row"> </div> </div> </div> <div class="slide-box re-transformed p-2" id="ArtistAllPosts_Box" style="display: none;"> </div> </div>', false, true);

            $("#ArtistName_Lbl").html(response.result.nickname);
            $(".artist-top-fixed-header-lbl").html(response.result.nickname);
            if (response.result.imgUrl == null) {
                $("#ArtistLegacyAvatar_Img").fadeOut(0);
                $("#ArtistLegacyAvatar_Img_Box").fadeIn(0);
                $("#ArtistLegacyAvatar_Img").attr("src", "#");
                $("#ArtistAvatar_Box").css("background-image", "none");
                $("#ArtistLegacyAvatar_Img_Box").html(response.result.nickname[0]);

                $(".artist-top-fixed-header-lbl").css("color", "#2b2b2b");
                $(".btn-artist-top-fixed-header").css("color", "#2b2b2b");
                $(".box-lg-part-header-for-artist").removeClass("with-image");
            }
            else {
                if (response.result.pageDesignPattern == 0) {
                    $("#ArtistLegacyAvatar_Img").fadeIn(0);
                    $("#ArtistLegacyAvatar_Img_Box").fadeOut(0);
                    $("#ArtistAvatar_Box").css("background-image", "none");
                    $("#ArtistLegacyAvatar_Img").attr("src", "/ProfileImages/" + response.result.imgUrl);

                    $(".artist-top-fixed-header-lbl").css("color", "#2b2b2b");
                    $(".btn-artist-top-fixed-header").css("color", "#2b2b2b");
                    $(".box-lg-part-header-for-artist").removeClass("with-image");
                    $(".box-lg-part-header-for-artist").css("background-image", "none");
                }
                else if (response.pageDesignPatter == 1) {
                    $("#ArtistLegacyAvatar_Img").fadeOut(0);
                    $("#ArtistLegacyAvatar_Img").attr("src", "#");
                    $("#ArtistLegacyAvatar_Img_Box").fadeOut(0);
                    $("#ArtistAvatar_Box").css("background-image", "url('/ProfileImages/" + response.result.imgUrl + "')");

                    $(".artist-top-fixed-header-lbl").css("color", "#fdfdfd");
                    $(".btn-artist-top-fixed-header").css("color", "#fdfdfd");
                    $(".box-lg-part-header-for-artist").addClass("with-image");
                    $(".box-lg-part-header-for-artist").css("background-image", "url('/ProfileImages/" + response.result.imgUrl + "')");
                }
                else {
                    $("#ArtistLegacyAvatar_Img").fadeIn(0);
                    $("#ArtistLegacyAvatar_Img_Box").fadeOut(0);
                    $("#ArtistLegacyAvatar_Img").attr("src", "/ProfileImages/" + response.result.imgUrl);
                    $("#ArtistAvatar_Box").css("background-image", "url('/ProfileImages/" + response.result.imgUrl + "')");

                    $(".artist-top-fixed-header-lbl").css("color", "#fdfdfd");
                    $(".btn-artist-top-fixed-header").css("color", "#fdfdfd");
                    $(".box-lg-part-header-for-artist").addClass("with-image");
                    $(".box-lg-part-header-for-artist").css("background-image", "url('/ProfileImages/" + response.result.imgUrl + "')");
                }
            }

            if (response.userId > 0) {
                if (response.isSubscribed) {
                    $("#AlreadySubscribed_Box").fadeIn(0);
                    $("#NotYetSubscribed_Box").fadeOut(0);
                    $("#SubscribeForArtist_Id_Val").val(0);
                    $("#UnsubscribeFromArtist_Id_Val").val(response.userId);
                    $("#SubscribeForArtist_SbmtBtn").addClass("super-disabled");
                    $("#UnsubscribeFromArtist_SbmtBtn").removeClass("super-disabled");
                }
                else {
                    $("#AlreadySubscribed_Box").fadeOut(0);
                    $("#UnsubscribeFromArtist_Id_Val").val(0);
                    $("#SubscribeForArtist_Id_Val").val(response.userId);
                    $("#SubscribeForArtist_SbmtBtn").removeClass("super-disabled");
                    $("#UnsubscribeFromArtist_SbmtBtn").addClass("super-disabled");
                }
            }
            else {
                $("#AlreadySubscribed_Box").fadeIn(0);
                $("#NotYetSubscribed_Box").fadeOut(0);
                $("#SubscribeForArtist_Id_Val").val(0);
                $("#UnsubscribeFromArtist_Id_Val").val(0);
                $("#SubscribeForArtist_SbmtBtn").addClass("super-disabled");
                $("#UnsubscribeFromArtist_SbmtBtn").addClass("super-disabled");
            }

            if (response.latestRelease != null) {
                let artistNames = response.result.nickname;
                if (response.latestRelease.coverImageUrl != null) {
                    $("#ALR_Img_Box").fadeOut(0);
                    $("#ALR_Img").attr("src", "/TrackCovers/" + response.latestRelease.coverImageUrl);
                    $("#ALR_Img").fadeIn(0);
                }
                else {
                    $("#ALR_Img").fadeOut(0);
                    $("#ALR_Img").attr("src", "#");
                    $("#ALR_Img_Box").fadeIn(0);
                }
                $("#ALR_Title_Lbl").html(response.latestRelease.title);
                $("#ALR_ReleaseDate_Span").html(dateAndTimeFormation(userLocale, response.latestRelease.addedAt)[0]);
                if (response.latestRelease.trackArtists != null) {
                    artistNames += " feat. ";
                    for (let i = 0; i < response.latestRelease.trackArtists.length; i++) {
                        if (i == 0) artistNames += response.latestRelease.trackArtists[i].artistName;
                        else artistNames += ", " + response.latestRelease.trackArtists[i].artistName;
                    }
                }
                $("#ALR_Artists_Span").html(artistNames);
                $("#ArtistLastRelease_Box").fadeIn(0);
            }
            else {
                $("#ArtistLastRelease_Box").fadeOut(0);
            }

            if (response.releases.length > 0) {
                let playPauseBtns = document.getElementsByClassName("btn-artist-page-play-pause-btn");
                $(".btn-artist-page-play-pause-btn").removeClass("super-disabled");
                for (let i = 0; i < playPauseBtns.length; i++) {
                    $("#" + playPauseBtns[i].id).attr("id", response.releases[0].id + "_Play_Btn_" + i);
                }
                artistPageSongsApplier(response.releases, "PopularSongs_Row", false, true);
            }
            else {
                $("#PopularSongs_Row").empty();
                $(".btn-artist-page-play-pause-btn").addClass("super-disabled");
                $("#PopularSongs_Row").html('<div class="box-standard text-center mt-1 p-2"> <h2 class="h2"> <i class="fa-solid fa-music"></i> </h2> <h4 class="h4">Music Coming Soon</h4> <small class="card-text text-muted">This artist is yet to release any songs</small> </div>');
            }
            //GetCountries
            //function createInsideLgCard();
            displayCorrector(currentWindowSize);
            setTimeout(function () {
                slideContainers(null, "ArtistInfo_Container");
            }, 150);
        }
        else callAlert('<i class="fa-solid fa-user-slash"></i>', null, null, "Artist info is temporarily inaccessible", 3.75, "Close", -1, null);
    });
});

$(document).on("submit", "#CreateNewAlbum_Form", function (event) {
    event.preventDefault();
    const title = $("#CNA_Title_Val").val();
    const description = $("#CNA_Description_Val").val();
    const upcCode = $("#CNA_UPC_Code_Val").val();
    const isExplicit = $("#CNA_IsExplicit_Val").val();
    const version = $("#CNA_Version_Val").val();
    const releaseDate = $("#CNA_ReleaseDate_Val").val();
    const genreId = $("#CNA_GenreId_Val").val();
    const files = $("#CNA_CoverImageFile_Val").get(0).files[0];
    const baseHtml = $("#CreateAlbum_SbmtBtn").html();
    //GetSingleInfo_Form
    let formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("IsExplicit", isExplicit);
    formData.append("UPC_Code", upcCode);
    formData.append("Version", version);
    formData.append("PremieredAt", releaseDate);
    formData.append("GenreId", genreId);
    formData.append("CoverImageFile", files);
    buttonDisabler(false, "CreateAlbum_SbmtBtn", ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + "Uploading Metadata...");

    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response) {
                buttonUndisabler(false, "CreateAlbum_SbmtBtn", baseHtml);
                slideContainers("CreateAlbum_Container", "AddAlbumTracks_Container");
                callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "Album created! Continue to add tracks", 4, "Proceed", 1, null);
            }
            else {
                if (response.error == 0) {
                    setTimeout(function () {
                        buttonUndisabler(false, "CreateAlbum_SbmtBtn", baseHtml);
                    }, 2500);
                    callAlert('<i class="fa-regular fa-circle-xmark" style="--fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s;"></i>', null, null, "Some metadata wasn’t entered correctly. Please review the fields and try again", 4, "Got It", -1, null);
                }
                else {
                    uncallAContainer(false, "CreateAlbum_Container");
                    callAlert('<i class="fa-solid fa-right-to-bracket"></i>', null, null, "Please sign in to create, edit, or delete your albums and tracks", 3.75, "Sign In", 2, null);
                }
            }
        }
    });
});

$(document).on("submit", "#SubscribeForArtist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = ' <i class="fa-regular fa-heart"></i> Subscribe';
    buttonDisabler(true, "btn-subscribe-for-artist", "Tuning you in...");

    $.post(url, data, function (response) {
        $("#SubscribeForArtist_Id_Val").val(0);
        if (response.success) {
            $("#SubscribeForArtist_SbmtBtn").fadeOut(0);
            $("#UnsubscribeForArtist_SbmtBtn").fadeIn(0);
            $("#UnsubscribeForArtist_Id_Val").val(response.userId);
            $("#SubscribeForArtist_SbmtBtn").addClass("super-disabled");
            $("#UnsubscribeForArtist_SbmtBtn").removeClass("super-disabled");
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "You're now following this artist", 3.5, "Close", -1, null);
        }
        else {
            $("#UnsubscribeForArtist_Id_Val").val(0);
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 1; --fa-animation-delay: 0.35s;"></i>', null, null, "Something went wrong. Please try again later", 3.75, "Close", -1, null);
        }
        buttonUndisabler(true, "btn-subscribe-for-artist", baseHtml);
    });
});

$(document).on("submit", "#UnsubscribeFromArtist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = ' <i class="fa-solid fa-heart"></i> Subscribed';
    buttonDisabler(true, "btn-unsubscribe-for-artist", "Unfollowing...");

    $.post(url, data, function (response) {
        $("#UnsubscribeForArtist_Id_Val").val(0);
        if (response.success) {
            $("#SubscribeForArtist_SbmtBtn").fadeIn(0);
            $("#UnsubscribeForArtist_SbmtBtn").fadeOut(0);
            $("#SubscribeForArtist_Id_Val").val(response.userId);
            $("#UnsubscribeForArtist_SbmtBtn").addClass("super-disabled");
            $("#SubscribeForArtist_SbmtBtn").removeClass("super-disabled");
            callAlert('<i class="fa-regular fa-circle-check anime-spin-shift"></i>', null, null, "You’re no longer following this artist", 3.5, "Close", -1, null);
        }
        else {
            $("#SubscribeForArtist_Id_Val").val(0);
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 1; --fa-animation-delay: 0.35s;"></i>', null, null, "Unfollow failed. Please try againr", 3.75, "Close", -1, null);
        }
        buttonUndisabler(true, "btn-unsubscribe-for-artist", baseHtml);
    });
});

$(document).on("mousedown", ".btn-subscribe-for-artist", function () {
    let artistId = $(this).attr("data-artist-id");
    if (artistId != undefined) $("#SubscribeForArtist_Id_Val").val(artistId);
    $("#SubscribeForArtist_Form").submit();
});
$(document).on("mousedown", ".btn-unsubscribe-for-artist", function () {
    let artistId = $(this).attr("data-artist-id");
    if (artistId != undefined) $("#UnsubscribeForArtist_Id_Val").val(artistId);
    $("#UnsubscribeForArtist_Form").submit();
});

$(document).on("mousedown", ".get-artist-info", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#GetArtistInfo_Id_Val").val(trueId);
        $("#GetArtistInfo_Form").submit();
    }
});

$(document).on("mousedown", ".btn-get-library", function () {
    let trackId = getTrueId($(this).attr("id"), false);
    let checkFormAvailability = document.getElementById("GetPlaylists_Form");
    if (checkFormAvailability != null && trackId != undefined) {
        $("#GetPlaylists_Type_Val").val(1);
        $("#GetPlaylists_Type_Val").attr("data-track-id", trackId);
        $("#GetPlaylists_Form").submit();
    }
});

$(document).on("mousedown", ".btn-mark-the-playlist", function () {
    let playlistId = getTrueId($(this).attr("id"), false);
    if (playlistId != undefined) {
        chooseOrUnchoosePlaylist(playlistId, false);
    }
});
$(document).on("mousedown", ".btn-unmark-the-playlist", function () {
    let playlistId = getTrueId($(this).attr("id"), false);
    if (playlistId != undefined) {
        chooseOrUnchoosePlaylist(playlistId, true);
    }
});

function chooseOrUnchoosePlaylist(playlistId, isChosen = false) {
    if (playlistId > 0) {
        let allChosenPlaylists;

        if (isChosen) {
            $("#ATP_PlaylistId_Val").val(0);
            $("#" + playlistId + "-MarkThePlaylist_Box").addClass("btn-mark-the-playlist");
            $("#" + playlistId + "-MarkThePlaylist_Box").removeClass("btn-unmark-the-playlist");
            $("#" + playlistId + "-MarkThePlaylist_Status_Span").html(' <i class="fa-regular fa-circle"></i> Not Chosen');
        }
        else {
            $("#ATP_PlaylistId_Val").val(playlistId);
            $(".btn-unmark-the-playlist").addClass("btn-mark-the-playlist");
            $(".btn-unmark-the-playlist").removeClass("btn-unmark-the-playlist");
            $(".playlist-status-text").html(' <i class="fa-regular fa-circle"></i> Not Chosen');
            $("#" + playlistId + "-MarkThePlaylist_Box").removeClass("btn-mark-the-playlist");
            $("#" + playlistId + "-MarkThePlaylist_Box").addClass("btn-unmark-the-playlist");
            $("#" + playlistId + "-MarkThePlaylist_Status_Span").html(' <i class="fa-regular fa-circle-check"></i> Chosen');
        }
        allChosenPlaylists = document.getElementsByClassName("btn-unmark-the-playlist");

        if (allChosenPlaylists != undefined && allChosenPlaylists.length > 0) buttonUndisabler(false, "AddToPlaylist_SbmtBtn", "Save Changes");
        else buttonDisabler(false, "AddToPlaylist_SbmtBtn", "Choose Playlist to Save");
    }
}


$(document).on("submit", "#GetPlaylistInfo_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(true, "btn-get-playlist-info", null);

    $.get(url, data, function (response) {
        if (response.success) { 
            let imageUrl = $("#" + response.result.id + "-PlaylistInfo_Img").attr("src");
            imageUrl = imageUrl == undefined ? null : imageUrl;
            playlistInfoSampler(response.result.id, response.result.name, imageUrl, new Date(response.result.createdAt), response.result.songsQty, response.userId, response.result.userId, response.result.user.nickname, response.result.user.imgUrl, null, response.isSaved);
            displayCorrector(currentWindowSize);
            setTimeout(function () {
                slideContainers(null, "PlaylistInfo_Container");
            }, 150);
            buttonUndisabler(true, "btn-get-playlist-info", null);
            $("#GetPlaylistTracks_Form").submit();
        }
        else callAlert('<i class="fa-solid fa-music"></i>', null, null, "Access to this playlist is temporarily unavailable", 3.5, "Close", -1, null);
        buttonUndisabler(true, "btn-get-playlist-info", null);
    });
});

$(document).on("submit", "#GetPlaylistTracks_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            let fullSkipQty = response.result.length + response.skip;
            if (response.skip > 0) playlistSongsApplier(response.id, response.result, "PlaylistInfo_TrackBoxes_Box", "PlaylistInfo_SongsQty_Span", true, response.skip);
            else playlistSongsApplier(response.id, response.result, "PlaylistInfo_TrackBoxes_Box", "PlaylistInfo_SongsQty_Span", false, 0);
            $("#GPT_Skip_Val").val(fullSkipQty);
        }
        else {
            $("#GPT_Skip_Val").val(0);
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "Playlist is currently unavailable", 3.75, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#AddOrRemoveTheTrackAsFavorite_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "ARTAF_SbmtBtn", "");
    buttonDisabler(true, "btn-track-favor-unfavor", null);
    buttonDisabler(true, "btn-track-favor-unfavor-lg", null);

    $.post(url, data, function (response) {
        if (response.success) {
            $("#ARTAF_Id_Val").val(response.id);
            buttonUndisabler(false, "ARTAF_SbmtBtn", '<i class="fa-solid fa-star"></i>');
            if (response.isAdded) {
                $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/RemoveFromFavorites");
                $(".btn-track-favor-unfavor").html(' <i class="fa-solid fa-star fa-flip" style="--fa-animation-duration: 0.75s; --fa-animation-iteration-count: 1;"></i> ');
                $(".btn-track-favor-unfavor-lg").html(' <i class="fa-solid fa-star fa-flip" style="--fa-animation-duration: 0.75s; --fa-animation-iteration-count: 1;"></i> ');
                callAlert('<i class="fa-solid fa-star fa-flip" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i>', null, null, "Added to your <span class='fw-500'>Favorites</span>", 3, 5, "Hide", -1, null);
            }
            else {
                let songsQty = parseInt($("#PlaylistSongsQty_Val").val());
                hideBySlidingToLeft(false, null, response.id + "-TrackMain_Box");
                $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
                $(".btn-track-favor-unfavor").html(' <i class="fa-regular fa-star fa-flip" style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 1;"></i> ');
                $(".btn-track-favor-unfavor-lg").html(' <i class="fa-regular fa-star fa-flip" style="--fa-animation-duration: 1s; --fa-animation-iteration-count: 1;"></i> ');
                callAlert('<i class="fa-regular fa-star fa-flip" style="--fa-flip-angle: -360; --fa-animation-delay: 0.3s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i>', null, null, "Removed from your <span class='fw-500'>Favorites</span>", 3.25, "Hide", -1, null);
                setTimeout(function () {
                    $("#" + response.id + "-TrackMain_Box").remove();
                }, 450);
                if (--songsQty <= 0) {
                    $("#PlaylistInfo_TrackBoxes_Box").empty();
                    $("#PlaylistInfo_TrackBoxes_Box").html('<div class="box-bordered text-center p-2 mt-1"> <h2 class="h2"> <i class="fa-regular fa-folder-open"></i> </h2> <h5 class="h5">Your Playlist is Empty</h5> <small class="card-text text-muted">Looks like there is nothing here yet! Start adding your favorite songs and create the perfect playlist</small></div>');
                }
            }
            buttonUndisabler(true, "btn-track-favor-unfavor", null);
            buttonUndisabler(true, "btn-track-favor-unfavor-lg", null);
        }
        else {
            $("#ARTAF_Id_Val").val(0);
            $(".btn-track-favor-unfavor-lg").removeClass("super-disabled");
            $(".btn-track-favor-unfavor-lg").html(' <i class="fa-solid fa-circle-exclamation"></i> ');
            $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
            callAlert('<i class="fa-solid fa-circle-exclamation fa-shake" --fa-animation-duration: 0.85s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, response.alert, 3.75, "Hide", -1, null);
        }
    });
});

function searchTopResultSampler(id = 0, type = 0, title, imageUrl, additionalInfoHtmls = [], additionalInfoClasses = [], additionalInfoIds = []) {
    let searchResultBox = elementDesigner("div", "best-search-result-box", null);
    let searchResultImg;
    let searchResultInfoBox = elementDesigner("div", "mt-1", null);
    let bottomElementsBox = elementDesigner("div", "bottom-element", null);
    let titleSpan = elementDesigner("span", "h6 standard-search-result-header", null);
    let additionalInfoMainSpan = elementDesigner("small", "card-text text-muted", "");
    let typeSpan = $("<span class='badge badge-sm'></span>");
    let imageFolderName = null;

    switch (parseInt(type)) {
        case 0:
            if (imageUrl != null) imageFolderName = "/PlaylistCovers/";
            else imageFolderName = ' <i class="fa-solid fa-wave-square"></i> ';
            searchResultBox.addClass("btn-get-playlist-info");
            searchResultBox.attr("id", id + "-GetPlaylistInfo_BtnSearch");
            typeSpan.html(' <i class="fa-solid fa-wave-square"></i> Playlist');
            additionalInfoMainSpan.append(typeSpan);
            break;
        case 1:
            if (imageUrl != null) imageFolderName = "/ProfileImages/";
            else imageFolderName = ' <i class="fa-solid fa-circle-user"></i> ';
            searchResultBox.addClass("btn-get-user-info");
            searchResultBox.attr("id", id + "-GetUserInfo_BtnSearch");
            typeSpan.html(' <i class="fa-solid fa-circle-user"></i> Artist');
            additionalInfoMainSpan.append(typeSpan);
            break;
        default:
            searchResultBox.removeAttr("id");
            break;
    }

    if (additionalInfoHtmls != null && additionalInfoHtmls.length > 0) {
        for (let i = 0; i < additionalInfoHtmls.length; i++) {
            if (additionalInfoClasses[i] != undefined && additionalInfoHtmls[i] != undefined) {
                let additionalInfoSpan = elementDesigner("span", additionalInfoClasses[i], " ∙ " + additionalInfoHtmls[i]);
                if (additionalInfoIds[i] != undefined) additionalInfoSpan.attr("id", additionalInfoIds[i]);
                additionalInfoMainSpan.append(additionalInfoSpan);
            }
        }
    }

    titleSpan.html(title);
    if (imageUrl != null) {
        searchResultImg = $("<img src='#' class='standard-search-result-img' alt='This image cannot be displayed' />");
        searchResultImg.attr("src", imageFolderName + "/" + imageUrl);
    }
    else searchResultImg = elementDesigner("div", "standard-search-result-img-box", imageFolderName);

    bottomElementsBox.append(additionalInfoMainSpan);
    searchResultInfoBox.append(titleSpan);
    searchResultInfoBox.append(bottomElementsBox);
    searchResultBox.append(searchResultImg);
    searchResultBox.append(searchResultInfoBox);

    return searchResultBox;
}

function searchPlaylistResultsSampler(id = 0, title = null, imageUrl = null, creatorUserId = 0, creatorName = null, songsQty = 0) {
    let searchResultBox = elementDesigner("div", "standard-search-result-box btn-get-playlist-info", null);
    let searchResultImg;
    let searchResultInfoBox = elementDesigner("div", "mt-1", null);
    let bottomElementsBox = elementDesigner("div", "bottom-element", null);
    let titleSpan = elementDesigner("span", "h6 standard-search-result-header", null);
    let additionalInfoMainSpan = elementDesigner("span", "card-text text-muted", "");
    let songsQtySpan = elementDesigner("small", "card-text text-muted", "");
    let creatorInfoSpan = elementDesigner("small", "card-text text-muted text-get-user-info", "");
    let imageFolderName = null;

    titleSpan.html(title);
    creatorInfoSpan.html(creatorName);
    creatorInfoSpan.attr("id", creatorUserId + "-GetUserInfo_Span");
    searchResultBox.attr("id", id + "-GetPlaylistSearchResult_Box");
    if (parseInt(songsQty) == 0) songsQtySpan.html("Empty Playlist ∙ ");
    else if (parseInt(songsQty) == 1) ssongsQtySpanongsQty.html("One Song ∙ ");
    else songsQtySpan.html(songsQty + " Songs ∙ ");
    if (imageUrl == null) {
        imageFolderName = ' <i class="fa-solid fa-wave-square"></i> ';
        searchResultImg = elementDesigner("div", "standard-search-result-img-box", imageFolderName);
    }
    else {
        imageFolderName = "/PlaylistCovers/" + imageUrl;
        searchResultImg = $("<img src='#' class='standard-search-result-img' alt='This image cannot be displayed' />");
        searchResultImg.attr('src', imageFolderName);
    }
    additionalInfoMainSpan.append(songsQtySpan);
    additionalInfoMainSpan.append(creatorInfoSpan);

    searchResultInfoBox.append(titleSpan);
    bottomElementsBox.append(additionalInfoMainSpan);
    searchResultInfoBox.append(bottomElementsBox);
    searchResultBox.append(searchResultImg);
    searchResultBox.append(searchResultInfoBox);

    return searchResultBox;
}

$(document).on("submit", "#FindPlaylists_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(true, "btn-submit-the-search", "Searching...");

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                $("#BestSearchResult_Box").empty();
                $("#PlaylistsSearchResult_Box").empty();
                $("#SearchResult_PlaylistsQty_Span").text(response.result.length);
                let topResult = response.result[0];
                if (topResult != null) {
                    let topResultBox = searchTopResultSampler(topResult.id, 0, topResult.name, topResult.imageUrl, [topResult.songsQty != 0 ? topResult.songsQty : "No" + " Songs", topResult.user.nickname], ["card-text", "card-text"], [null, null]);
                    $("#BestSearchResult_Box").append(topResultBox);
                }
                $.each(response.result, function (index) {
                    let resultBox = searchPlaylistResultsSampler(response.result[index].id, response.result[index].name, response.result[index].imageUrl, response.result[index].user.id, response.result[index].user.nickname, response.result[index].songsQty);
                    $("#PlaylistsSearchResult_Box").append(resultBox);
                });
            }
        }
        else {
            callAlert('<i class="fa-solid fa-circle-exclamation fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2;"></i>', null, null, "Playlist search is temporarily disabled (unavailable)", 3.75, "Close", -1, null);
        }
        buttonUndisabler(true, "btn-submit-the-search", "Search");
    });
});

$(document).on("submit", "#GetTrackComments_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    //LoadTheTrack btn-get-more
    $.get(url, data, function (response) {
        if (response.success) {
            createSmContainer("CommentsAndReplies", "Comments & Replies", '<div class="d-none"><form method="post" action="/Comment/Pin" id="PinComment_Form"> <input type="hidden" name="Id" id="PinComment_Id_Val" value="0" /> <input type="hidden" name="TrackId" id="PinComment_TrackId_Val" value="0" /> </form> <form method="post" action="/Comment/Unpin" id="UnpinComment_Form"> <input type="hidden" name="Id" id="UnpinComment_Id_Val" value="0" /> <input type="hidden" name="TrackId" id="UnpinComment_TrackId_Val" value="0" /> </form> <form method="post" action="/Comment/Like" id="LikeTheComment_Form"> <input type="hidden" name="Id" id="LikeTheComment_Id_Val" value="0" /> </form> <form method="post" action="/Comment/Unlike" id="UnlikeTheComment_Form"> <input type="hidden" name="Id" id="UnlikeTheComment_Id_Val" value="0" /> </form> <form method="post" action="/Comment/Delete" id="DeleteTrackComment_Form"> <input type="hidden" name="Id" id="DeleteTrackComment_Id_Val" value="0" /> </form> <form method="post" action="/Comment/DeleteReply" id="DeleteTrackRecomment_Form"> <input type="hidden" name="Id" id="DeleteTrackRecomment_Id_Val" value="0" /> </form><form method="get" action="/Comment/TrackRecomments" id="GetTrackRecomments_Form"><input type="hidden" name="Id" id="GetTrackRecomments_Id_Val" value="0" /></form></div><div class="slide-box re-scaled mt-2 p-0" id="Replies_Box" style="display: none;"> <div class="slide-box-header hstack gap-2"> <button type="button" class="btn btn-standard btn-change-boxes" data-close="Replies_Box" data-open="Comments_Box"> <i class="fa-solid fa-angle-left"></i> Back</button> <div class="ms-1"> <span class="h5">Replies ∙ <span class="card-text" id="CommentRepliesQty_Span">0</span></span> </div> </div> <div class="box-standard" id="RepliesBody_Box"> <div class="box-standard text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-comment-dots"></i> </h2> <h4 class="h4">No Replies</h4> <small class="card-text text-muted">No replies for this comment has been sent yet</small> </div> </div> </div> <div class="slide-box mt-2 p-0" id="Comments_Box"> <div class="slide-box-header"> <span class="h5">Comments ∙ <span id="CommentsQty_Span">0</span></span> <br /> <small class="card-text text-muted" id="CommentParent_Span">per <span class="fw-500" id="CommsParentTrackName_Span"></span></small><small class="card-text fw-normal" id="CommsRepliesStatus_Span">with replies</small></div> <div class="box-standard" id="CommentsBody_Box"> <div class="box-standard text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-message"></i> </h2> <h4 class="h4">No Comments</h4> <small class="card-text text-muted">Be the first to comment</small> </div> </div> </div>', null, null, false);
            $("#CommentsBody_Box").empty();

            if (response.result != undefined && response.result.length > 0) {
                if (response.likedComments != undefined || response.likedComments != null) {
                    $.each(response.likedComments, function (likedCommentsIndex) {
                        $.each(response.result, function (index) {
                            if (response.likedComments[likedCommentsIndex] == response.result[index].id) response.result[index].isLiked = true;
                        });
                    });
                }

                $.each(response.result, function (index) {
                    createCommentBox("CommentsBody_Box", "Track", null, response.result[index].id, response.currentUserId, response.result[index].user.imgUrl, response.result[index].userId, response.result[index].user.nickname, response.result[index].text, response.result[index].sentAt, response.result[index].likesQty, response.result[index].isEdited, response.result[index].isLiked, response.result[index].isPinned, response.isOwner, true);
                });
                $("#CommentsQty_Span").html(response.result.length);
            }
            else {
                $("#CommentsQty_Span").html("0");
                $("#CommentsBody_Box").html('<div class="box-standard text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-message"></i> </h2> <h4 class="h4">No Comments</h4> <small class="card-text text-muted">Be the first to comment</small> </div>');
            }
            $("#CommsParentTrackName_Span").text("1 track");
            $("#CommsRepliesStatus_Span").text(", with replies");

            swapToTextBoxNavbar();
            bottomNavbarTextFormCustomization("/Comment/Send", "SendComment_Form", "SendComment_Text_Val", "Text", "SendComment_SbmtBtn", ["TrackId"], [0], ["SendComment_TrackId_Val"], ["form-control", "form-control-bar-standard", "form-control-bottom-navbar", "form-control-guard"], ["data-min-length", "maxlength", "data-on-fulfill"], [1, 1500, "SendComment_SbmtBtn"], "Comment content...", ' <i class="fa-solid fa-arrow-up"></i> ', ["btn", "btn-standard-rounded", "btn-bottom-navbar-form-control"]);
            displayCorrector(currentWindowSize);
            setTimeout(function () {
                $("#PinComment_TrackId_Val").val(response.id);
                $("#SendComment_TrackId_Val").val(response.id);
                $("#UnpinComment_TrackId_Val").val(response.id);
                callASmContainer(false, "CommentsAndReplies_Container", false);
            }, 150);
        }
        else {
            callAlert('<i class="fa-regular fa-message"></i>', null, null, "Comments are currently unavailable. Please try again later", 4, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#GetTrackRecomments_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $(".btn-reply-to-comment").html();
    buttonDisabler(true, "btn-reply-to-comment", "Loading...");

    $.get(url, data, function (response) {
        if (response.success) {
            $("#RepliesBody_Box").empty();
            if (response.result != undefined && response.result.length > 0) {
                buttonDisabler(true, "btn-reply-to-comment", 'Loaded');
                $("#CommentRepliesQty_Span").text(response.result.length.toLocaleString());
                $.each(response.result, function (index) {
                    createCommentBox("RepliesBody_Box", "Track", null, response.result[index].id, response.currentUserId, response.result[index].user.imgUrl, response.result[index].userId, response.result[index].user.nickname, response.result[index].text, response.result[index].sentAt, 0, response.result[index].isEdited, false, false, false, false);
                });
            }
            else {
                $("#CommentRepliesQty_Span").text("0");
                buttonDisabler(true, "btn-reply-to-comment", 'Empty');
                $("#RepliesBody_Box").html('<div class="box-standard text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-comment-dots"></i> </h2> <h4 class="h4">No Replies</h4> <small class="card-text text-muted">No replies for this comment has been sent yet</small> </div>');
            }
            const replyParentContent = $("#" + response.id + "-CommentContent_Span").html();
            setTimeout(function () {
                slideBoxes(false, "Comments_Box", "Replies_Box");
                if (replyParentContent != undefined) swapToReplyMode(replyParentContent, false);
                $("#RTC_TrackCommentId_Val").val(response.id);
            }, 300);
        }
        else callAlert('<i class="fa-solid fa-reply"></i>', null, null, "Replies are temporarily unavailable", 3.5, "Close", -1, null);

        setTimeout(function () {
            buttonUndisabler(true, "btn-reply-to-comment", baseHtml);
        }, 2000);
    });
});

$(document).on("submit", "#SendComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    const baseHtml = $("#SendComment_SbmtBtn").html();
    buttonDisabler(false, "SendComment_SbmtBtn", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let currentCommentsQty = parseInt($("#CommentsQty_Span").text());
            if (currentCommentsQty != undefined && currentCommentsQty <= 0) $("#CommentsBody_Box").empty();       

            let currentUserImgSrc = $("#CurrentUserProfile_Img").attr("src");
            createCommentBox("CommentsBody_Box", "Track", null, response.id, response.currentUserId, currentUserImgSrc == undefined ? null : currentUserImgSrc, response.result.userId, "You", response.result.text, new Date(), 0, response.result.editedAt == null ? false : true, false, false, response.isOwner, true);
            $("#CommentsQty_Span").text(++currentCommentsQty);
            buttonDisabler(false, "SendComment_SbmtBtn", ' <i class="fa-regular fa-circle-check"></i> ');
        }
        else {
            buttonDisabler(false, "SendComment_SbmtBtn", ' <i class="fa-regular fa-circle-xmark"></i> ');
            callAlert('<i class="fa-regular fa-message"></i>', null, null, "An error occured. Please try to sent your comment later", 3.75, "Close", -1, null);
        }

        $("#SendComment_Text_Val").val(null);
        setTimeout(function () {
            buttonUndisabler(false, "SendComment_SbmtBtn", baseHtml);
        }, 2000);
    });
});

$(document).on("submit", "#EditTrackComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#EditTrackComment_SbmtBtn").html();
    buttonDisabler(false, "EditTrackComment_SbmtBtn", null);

    $.post(url, data, function (response) {
        $("#EditTrackComment_Text_Val").val(null);
        if (response.success) {
            swapToDefaultMode();
            $("#" + response.id + "-IsCommentEdited_Span").fadeIn(300);
            $("#" + response.id + "-CommentContent_Span").html(response.result);
            $("#EditTrackComment_SbmtBtn").html(' <i class="fa-solid fa-check"></i> ');
            setTimeout(function () {
                buttonUndisabler(false, "EditTrackComment_SbmtBtn", ' <i class="fa-solid fa-arrow-up"></i> ');
            }, 1500);
        }
        else {
            $("#EditTrackComment_SbmtBtn").html(' <i class="fa-solid fa-xmark"></i> ');
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s;"></i>', null, null, "An error occured. Please try to reply later", 3.75, "Close", -1, null);
            setTimeout(function () {
                buttonUndisabler(false, "EditTrackComment_SbmtBtn", baseHtml);
            }, 1500);
        }
    });
});

$(document).on("submit", "#EditTrackRecomment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#EditTrackRecomment_SbmtBtn").html();
    buttonDisabler(false, "EditTrackRecomment_SbmtBtn", null);

    $.post(url, data, function (response) {
        $("#EditTrackRecomment_Text_Val").val(null);
        if (response.success) {
            swapToDefaultMode();
            $("#" + response.id + "-IsRecommentEdited_Span").fadeIn(300);
            $("#" + response.id + "-RecommentContent_Span").html(response.result);
            $("#EditTrackRecomment_SbmtBtn").html(' <i class="fa-solid fa-check"></i> ');
        }
        else {
            $("#EditTrackRecomment_SbmtBtn").html(' <i class="fa-solid fa-xmark"></i> ');
        }

        setTimeout(function () {
            buttonUndisabler(false, "EditTrackRecomment_SbmtBtn", baseHtml);
        }, 1500);
    });
});

$(document).on("submit", "#ReplyToTrackComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#RTC_SbmtBtn").html();
    buttonDisabler(false, "RTC_SbmtBtn", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let repliesQty = parseInt($("#CommentRepliesQty_Span").text());
            if (repliesQty <= 0) $("#RepliesBody_Box").empty();
            let currentUserImgSrc = $("#CurrentUserProfile_Img").attr("src");
            $("#RTC_SbmtBtn").html(' <i class="fa-regular fa-circle-check"></i> ');

            createCommentBox("RepliesBody_Box", "Track", null, response.id, response.currentUserId, currentUserImgSrc, response.currentUserId, "You", response.result.text, new Date(), 0, false, false, false, false, false);
            $("#CommentRepliesQty_Span").text(++repliesQty);
        }
        else {
            $("#RTC_SbmtBtn").html(' <i class="fa-regular fa-circle-xmark"></i> ');
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s; --fa-animation-delay: 0.35s;"></i>', null, null, "An error occured. Please try to reply later", 3.75, "Close", -1, null);
        }
        setTimeout(function () {
            buttonUndisabler(false, "RTC_SbmtBtn", baseHtml);
        }, 2000);
    });
});

$(document).on("submit", "#LikeTheComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(true, "btn-like-comment", null);
    buttonDisabler(true, "btn-unlike-comment", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let likesQty = parseInt($("#" + response.id + "-LikeComment_Btn").attr("data-qty")) + 1;
            $("#" + response.id + "-LikeComment_Btn").attr("data-qty", likesQty);
            $("#" + response.id + "-LikeComment_Btn").html(' <i class="fa-solid fa-heart fa-beat" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.25s;"></i> ' + likesQty.toLocaleString());
            $("#" + response.id + "-LikeComment_Btn").addClass("btn-unlike-comment");
            $("#" + response.id + "-LikeComment_Btn").removeClass("btn-like-comment");
            $("#" + response.id + "-LikeComment_Btn").attr("id", response.id + "-UnlikeComment_Btn");
        }
        else callAlert(' <i class="fa-solid fa-heart-crack fa-beat-fade" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i> ', null, null, "An error occured. Please try to like this comment later", 3.75, "Close", -1, null);

        buttonUndisabler(true, "btn-like-comment", null);
        buttonUndisabler(true, "btn-unlike-comment", null);
    });
});

$(document).on("submit", "#UnlikeTheComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            let likesQty = parseInt($("#" + response.id + "-UnlikeComment_Btn").attr("data-qty")) - 1;
            $("#" + response.id + "-UnlikeComment_Btn").attr("data-qty", likesQty);
            $("#" + response.id + "-UnlikeComment_Btn").html(' <i class="fa-solid fa-heart-crack fa-beat" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.25s;"></i> ' + likesQty.toLocaleString());
            $("#" + response.id + "-UnlikeComment_Btn").addClass("btn-like-comment");
            $("#" + response.id + "-UnlikeComment_Btn").removeClass("btn-unlike-comment");
            $("#" + response.id + "-UnlikeComment_Btn").attr("id", response.id + "-LikeComment_Btn");
            setTimeout(function () {
                $("#" + response.id + "-LikeComment_Btn").html(' <i class="fa-regular fa-heart"></i> ' + likesQty.toLocaleString());
            }, 1500);
        }
        else callAlert(' <i class="fa-solid fa-heart-crack fa-beat-fade" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i> ', null, null, "An error occured. Please try to unlike this comment later", 3.75, "Close", -1, null);

        buttonUndisabler(true, "btn-like-comment", null);
        buttonUndisabler(true, "btn-unlike-comment", null);
    });
});

$(document).on("submit", "#PinComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $(".btn-pin-comment").html();
    buttonDisabler(true, "btn-pin-comment", "Pinning...");

    $.post(url, data, function (response) {
        if (response.success) {
            $("#" + response.result + "-IsCommentPinned_Span").fadeIn(300);
            $("#" + response.result + "-CommentDropdown_Box").removeClass("ms-auto");

            $("#" + response.result + "-PinComment_Btn").html(' <i class="fa-solid fa-thumbtack-slash"></i> Unpin');
            $("#" + response.result + "-PinComment_Btn").removeClass("super-disabled");
            $("#" + response.result + "-PinComment_Btn").addClass("btn-unpin-comment");
            $("#" + response.result + "-PinComment_Btn").removeClass("btn-pin-comment");
            $("#" + response.result + "-PinComment_Btn").attr("id", response.result + "-UnpinComment_Btn");

            callKawaiiAlert(0, "Comment pinned", '<i class="fa-solid fa-thumbtack fa-bounce" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, 2, false);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "An error occured. Please try to pin this comment later", 3.5, "Close", -1, null);

        setTimeout(function () {
            buttonUndisabler(true, "btn-pin-comment", baseHtml);
        }, 1500);
    });
});

$(document).on("submit", "#UnpinComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $(".btn-unpin-comment").html();
    buttonDisabler(false, "btn-unpin-comment", null);

    $.post(url, data, function (response) {
        if (response.success) {
            $("#" + response.result + "-IsCommentPinned_Span").fadeOut(300);
            setTimeout(function () {
                $("#" + response.result + "-CommentDropdown_Box").addClass("ms-auto");
            }, 350);

            $("#" + response.result + "-UnpinComment_Btn").html(' <i class="fa-solid fa-thumbtack"></i> Pin');
            $("#" + response.result + "-UnpinComment_Btn").addClass("btn-pin-comment");
            $("#" + response.result + "-UnpinComment_Btn").removeClass("super-disabled");
            $("#" + response.result + "-UnpinComment_Btn").removeClass("btn-unpin-comment");
            $("#" + response.result + "-UnpinComment_Btn").attr("id", response.result + "-PinComment_Btn");

            callKawaiiAlert(0, "Comment unpinned", '<i class="fa-solid fa-thumbtack-slash fa-bounce" style="--fa-animation-delay: 0.25s; --fa-animation-iteration-count: 1; --fa-animation-duration: 0.5s;"></i>', null, null, 2, false);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.5s;"></i>', null, null, "An error occured. Please try to unpin this comment later", 3.5, "Close", -1, null);

        setTimeout(function () {
            buttonUndisabler(true, "btn-unpin-comment", baseHtml);
        }, 1500);
    });
});

$(document).on("submit", "#DeleteTrackComment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $(".btn-delete-track-comment").html();
    uncallAProposal();
    buttonDisabler(true, "btn-delete-track-comment", "Deleting...");

    $.post(url, data, function (response) {
        if (response.success) {
            let commentsQty = parseInt($("#CommentsQty_Span").html()) - 1;
            hideBySlidingToLeft(false, null, response.result + "-Comment_Box");
            setTimeout(function () {
                $("#CommentsQty_Span").html(commentsQty);
                $("#" + response.result + "-Comment_Box").remove();
            }, 750);

            if (commentsQty <= 0) $("#CommentsBody_Box").html('<div class="box-standard text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-message"></i> </h2> <h4 class="h4">No Comments</h4> <small class="card-text text-muted">Be the first to comment</small> </div>');
            callKawaiiAlert(0, "Comment deleted", '<i class="fa-regular fa-trash-can text-danger"></i>', null, null, 2, false);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Couldn’t delete the comment. Please try again later", 3.75, "Close", -1, null);
        buttonUndisabler(true, "btn-delete-track-comment", baseHtml);
    });
});

$(document).on("submit", "#DeleteTrackRecomment_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $(".btn-delete-track-recomment").html();
    uncallAProposal();
    buttonDisabler(true, "btn-delete-track-recomment", "Deleting...");
      
    $.post(url, data, function (response) {
        if (response.success) {
            let repliesQty = parseInt($("#CommentRepliesQty_Span").text()) - 1;
            $("#CommentRepliesQty_Span").html(repliesQty);
            setTimeout(function () {
                hideBySlidingToLeft(false, null, response.result + "-Recomment_Box");
            }, 350);
            setTimeout(function () {
                $("#" + response.result + '-Recomment_Box').remove();
                if (repliesQty <= 0) $("#RepliesBody_Box").html('<div class="box-standard text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-comment-dots"></i> </h2> <h4 class="h4">No Replies</h4> <small class="card-text text-muted">No replies for this comment has been sent yet</small> </div>');
            }, 1100);
            callKawaiiAlert(0, "Reply deleted", '<i class="fa-regular fa-trash-can text-danger"></i>', null, null, 2, false);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Couldn’t delete your reply. Please try again later", 3.75, "Close", -1, null);
        buttonUndisabler(true, "btn-delete-track-recomment", baseHtml);
    });
});

$(document).on("submit", "#CreatePoll_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#CreatePost_Form-DistantSbmt_Btn").html();
    buttonDisabler(false, "CreatePost_Form-DistantSbmt_Btn", "Creating...");

    $.post(url, data, function (response) {
        if (response.success) {
            callAlert(' <i class="fa-regular fa-circle-check anime-spin-shift"></i> ', null, null, "Poll has been successfully posted", 3.75, "Done", -1, null);
            uncallAContainer(false, 'CreatePoll_Container');
            setTimeout(function () {
                $("#IsAnonym_Val").val(false);
                $("#IsSkippable_Val").val(false);
                $("#PollMaxOptions_Val").val(1);
                $("#PollDuration_Val").val(1440);
                for (let i = 0; i < 6; i++) {
                    if (i > 2) $("#" + i + "-PollOption_Box").remove();
                    else $("#" + i + "-CreatePoll_Option_Val").val(null);
                }
                $("#2-PollOption_Box").append('<button type="button" class="btn btn-standard-rounded btn-delete-created-item btn-sm super-disabled" id="PollOption_Box-DeleteItem_Btn"> <i class="fa-solid fa-xmark"></i> </button>');
            }, 350);
        }
        else {
            if(response.error == 0) callAlert(' <i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-iteration-delay: 0.35s; --fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2;"></i> ', null, null, "An internal error prevented the poll from being posted", 4, "Got It", -1, null);
            else callAlert(' <i class="fa-solid fa-right-to-bracket"></i> ', null, null, "Please sign in to post a poll", 3.5, "Got It", -1, null);
        }

        setTimeout(function () {
            buttonUndisabler(false, "CreatePost_Form-DistantSbmt_Btn", baseHtml);
        }, 1500);
    });
});

$(document).on("submit", "#GetUserPolls_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#GetUserPolls_SbmtBtn").html();
    buttonDisabler(false, "GetUserPolls_SbmtBtn", '<div class="box-btn-group-member-icon"> <i class="fa-solid fa-spinner fa-spin-pulse"></i> </div><span class="card-text ms-1">Loading...</span><small class="card-text text-muted ms-auto"> <i class="fa-solid fa-angle-right"></i> </small>');

    $.get(url, data, function (response) {
        if (response.success) {
            callInsideLgContainer()
            //function createInsideLgCard CreateNewPoll_Btn
/*            <form method="post" action="/Poll/End" id="EndThePoll_Form"><input type="hidden" name="Id" id="EndThePoll_Id_Val" value="0" /></form>*/
            createInsideLgCard("PollsInformation", "User Polls", null, '<button type="button" class="btn btn-standard btn-open-polls-filter btn-sm"> <i class="fa-solid fa-sort"></i> Sort</button>', '<button type="button" class="btn btn-standard btn-create-new-poll btn-sm ms-auto"> <i class="fa-solid fa-plus"></i> New Poll</button>');
            $("#PollsInformation_Box").empty();
            $("#PollsInformation_Box").append('<div class="d-none"><input type="hidden" id="PollQty_Val" value="0" /> <form method="get" action="/Poll/GetLiveDatas" id="GetPollLiveDatas_Form"> <input type="hidden" name="Id" id="GetPollLiveDatas_Id_Val" value="0" /> </form> <form method="post" action="/Poll/Like" id="LikeThePoll_Form"> <input type="hidden" name="Id" id="LikeThePoll_Id_Val" value="0" /> </form> <form method="post" action="/Poll/RemoveLike" id="RemovePollLike_Form"> <input type="hidden" name="Id" id="RemovePollLike_Id_Val" /> </form> <form method="post" action="/Poll/Vote" id="VoteInPoll_Form"><input type="hidden" name="Id" id="VoteInPoll_Id_Val" value="0" /><input type="hidden" name="PollId" id="VoteInPoll_PollId_Val" value="0" /><input type="hidden" name="LoadResults" id="VoteInPoll_LoadResults_Val" value="true" /></form> <form method="get" action="/PollComment/Get" id="GetPollComments_Form"><input type="hidden" name="Id" id="GetPollComments_Id_Val" value="0" /> <input type="hidden" name="Skip" id="GetPollComments_SkipQty_Val" value="0" /></form></div>');

            if (response.result.length > 0) {
                $.each(response.result, function (index) {
                    //let pollBox = createPollAuthorBox(response.result[index].id, response.result[index].question, response.result[index].pollOptions, response.result[index].expiresAt, response.result[index].totalVotesQty, response.result[index].isAnonymous, response.result[index].isSkippable, response.result[index].votedOptionId);
                    let pollBox = createRegularPollBox(response.result[index].id, 1, "Ado", "12658-0de.jpg", response.result[index].expiresAt, response.result[index].question, response.result[index].pollOptions, response.result[index].votedOptionId, response.result[index].totalVotesQty, response.result[index].isAnonymous, response.result[index].isSkippabled, response.result[index].isLiked, response.result[index].likesQty);
                    if (pollBox != null) {
                        $("#PollsInformation_Box").append(pollBox);
                        //function playlistInfoSampler
                    }
                });
            }
            else {
                $("#PollsInformation_Box").append('<div class="box-backgrounded text-center p-2"> <h2 class="h2"> <i class="fa-solid fa-square-poll-vertical"></i> </h2> <h4 class="h4">No Polls</h4> <small class="card-text text-muted">You haven’t created any polls yet</small> </div>');
            }
            $("#PollQty_Val").val(response.result.length);

            setTimeout(function () {
                callInsideLgContainer(false, "PollsInformation_Container");
            }, 150);
        }
        else {
            if (response.error == 0) callAlert(' <i class="fa-solid fa-square-poll-vertical"></i> ', null, null, "Polls can’t be accessed right now", 3.5, "Got It", -1, null);
            else callAlert(' <i class="fa-solid fa-right-to-bracket"></i> ', null, null, "Sign in to view your polls", 3.5, "Okay", -1, null);
        }

        setTimeout(function () {
            buttonUndisabler(false, "GetUserPolls_SbmtBtn", baseHtml);
        }, 500);
    });
});

$(document).on("submit", "#GetPollLiveDatas_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    const baseHtml = $(".btn-load-poll-datas").html();
    buttonDisabler(true, "btn-load-poll-datas", " <i class='fa-solid fa-spinner fa-spin-pulse'></i> Loading...");

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result.length > 0) {
                const totalVotesFormatted = new Intl.NumberFormat("en", {
                    notation: "compact",
                    compactDisplay: "short"
                }).format(response.totalVotesQty);

                setPollResults(response.id, response.votedOptionId, response.totalVotesQty, response.result);
                if (response.totalVotesQty == 1) {
                    $("#" + response.id + "-PollTotalVotesQty_Span").html(" ∙ One vote");
                    $("#" + response.id + "-TotalVotesQty_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> One vote');
                }
                else {
                    $("#" + response.id + "-PollTotalVotesQty_Span").html(" ∙ " + totalVotesFormatted + " votes");
                    $("#" + response.id + "-TotalVotesQty_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> ' + totalVotesFormatted);
                }
            }
            else {
                $("#" + response.id + "-PollTotalVotesQty_Span").html(" ∙ No votes");
                $("#" + response.id + "-TotalVotesQty_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> No Votes');
            }

            $("#" + response.id + "-OptionsParent_Box").attr("data-results-loaded", true);
            $("#" + response.id + "-AuthorOptionsParent_Box").attr("data-results-loaded", true);

            setTimeout(function () {
                buttonUndisabler(true, "btn-load-poll-datas", baseHtml);
                $("#" + response.id + "-GetPollLiveDatas_Btn").addClass("super-disabled");
                $("#" + response.id + "-GetPollLiveDatas_Btn").html(' <i class="fa-solid fa-bars-progress"></i> Datas Loaded');
            }, 750);
        }
        else callAlert(' <i class="fa-solid fa-right-to-bracket"></i> ', null, null, "Sign in to view your polls", 3.5, "Okay", -1, null);
    });
});

$(document).on("submit", "#EndThePoll_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    const baseHtml = $("#EndThePoll_SbmtBtn").html();
    buttonDisabler(false, "EndThePoll_SbmtBtn", " <i class='fa-solid fa-spinner fa-spin-pulse'></i> Loading...");

    $.post(url, data, function (response) {
        if (response.success) {
            let pollOptionButtons = document.getElementsByClassName("box-poll-in-post-option");
            $("#" + response.result + "-ForceFinishPoll_Btn").remove();
            $("#" + response.result + "-ParticipateInPoll_Btn").addClass("super-disabled");
            $("#" + response.result + "-ParticipateInPoll_Btn").removeClass("btn-participate-in-poll");
            $("#" + response.result + "-ParticipateInPoll_Btn").html(' ∙ <i class="fa-solid fa-flag-checkered"></i> Poll Finished');
            $("#" + response.result + "-ExpirationDuration_Span").html("poll finished");

            if (pollOptionButtons.length > 0) {
                for (let i = 0; i < pollOptionButtons.length; i++) {
                    if ($(pollOptionButtons[i]).attr("data-poll-id") == response.result) {
                        $(pollOptionButtons[i]).removeClass("btn-vote-in-poll");
                    }
                }
            }
            buttonUndisabler(false, "EndThePoll_SbmtBtn", baseHtml);
            callAlert('<i class="fa-solid fa-flag-checkered"></i>', null, null, "Poll finalized successfully", 3.5, "Done", -1, null);
        }
        else {
            if(response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Unable to finalize the poll. Please try again", 3.75, "Got It", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket"></i>', null, null, "Sign in to create and edit polls and posts", 4, "Got It", -1, null);
        }
        uncallAProposal();
    });
});

$(document).on("submit", "#DeleteThePoll_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#DeleteThePoll_SbmtBtn").html();
    buttonDisabler(false, "DeleteThePoll_SbmtBtn", ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Deleting...');

    $.post(url, data, function (response) {
        if (response.success) {
            let pollsQty = parseInt($("#PollQty_Val").val()) - 1;
            $("#PollQty_Val").val(pollsQty);

            if (pollsQty > 0) {
                hideBySlidingToLeft(false, null, response.result + "-AuthorPoll_Box");
                setTimeout(function () {
                    $("#" + response.result + "-AuthorPoll_Box").remove();
                }, 750);
            }
            else {
                hideBySlidingToLeft(false, null, response.result + "-AuthorPoll_Box");
                setTimeout(function () {
                    $("#" + response.result + "-AuthorPoll_Box").remove();
                    $("#PollsInformation_Box").append('<div class="box-backgrounded text-center p-2"> <h2 class="h2"> <i class="fa-solid fa-square-poll-vertical"></i> </h2> <h4 class="h4">No Polls</h4> <small class="card-text text-muted">You haven’t created any polls yet</small> </div>');
                }, 750);
            }

            hideBySlidingToLeft(false, null, response.result + "-AuthorPoll_Box");
            setTimeout(function () {
                $("#" + response.result + "-AuthorPoll_Box").remove();
            }, 750);
            setTimeout(function () {
                buttonUndisabler(false, "DeleteThePoll_SbmtBtn", baseHtml);
            }, 1000);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Unable to delete the poll. Please try again later", 3.75, "Got It", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket"></i>', null, null, "Sign in to create, edit or delete posts & polls", 4, "Got It", -1, null);
        }
        uncallAProposal();
    });
});

$(document).on("submit", "#VoteInPoll_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    $(".btn-vote-in-poll").addClass("super-disabled");

    $.post(url, data, function (response) {
        if (response.success) {
            let optionButtons = document.getElementsByClassName("box-poll-in-post-option");
            let optionText = $("#" + response.result + "-AuthorPollOptionText_Lbl").html();

            $("#" + response.result + "-AuthorPollOptionText_Lbl").html(optionText);
            $("#" + response.result + "-AuthorOptionsParent_Box").attr("data-results-loaded", true);
            $("#" + response.result + "-AuthorPoll_IsVoted_Span").html(' <i class="fa-regular fa-circle-check"></i> ');

            $("#" + response.result + "-PollOptionText_Lbl").html(optionText);
            $("#" + response.result + "-OptionsParent_Box").attr("data-results-loaded", true);
            $("#" + response.result + "-Poll_IsVoted_Span").html(' <i class="fa-regular fa-circle-check"></i> ');

            $("#" + response.pollId + "-ParticipateInPoll_Btn").addClass("super-disabled");
            $("#" + response.pollId + "-ParticipateInPoll_Btn").removeClass("btn-participate-in-poll");
            $("#" + response.pollId + "-ParticipateInPoll_Btn").removeClass("btn-stop-participating-in-poll");
            $("#" + response.pollId + "-ParticipateInPoll_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> Voted');
            $("#" + response.pollId + "-PollStatus_Span").html(null);
            $("#" + response.pollId + "-PollStatus_Span").fadeOut(300);

            if (optionButtons.length > 0) {
                for (let i = 0; i < optionButtons.length; i++) {
                    if ($(optionButtons).attr("data-poll-id") == response.pollId) {
                        $(optionButtons).removeClass("super-disabled");
                        $(optionButtons).removeClass("btn-vote-in-poll");
                    }
                }
            }

            if (response.liveDatas != null && parseInt(response.totalVotesQty) > 0) {
                const totalVotesFormatted = new Intl.NumberFormat("en", {
                    notation: "compact",
                    compactDisplay: "short"
                }).format(response.totalVotesQty);

                setPollResults(response.pollId, response.id, response.totalVotesQty, response.liveDatas);
                if (response.totalVotesQty == 1) {
                    $("#" + response.id + "-PollTotalVotesQty_Span").html(" ∙ One vote");
                    $("#" + response.id + "-TotalVotesQty_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> One vote');
                }
                else {
                    $("#" + response.id + "-PollTotalVotesQty_Span").html(" ∙ " + totalVotesFormatted + " votes");
                    $("#" + response.id + "-TotalVotesQty_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> ' + totalVotesFormatted);
                }
            }
            else {
                $("#" + response.pollId + "-PollTotalVotesQty_Span").html(" ∙ No votes");
                $("#" + response.id + "-TotalVotesQty_Btn").html(' <i class="fa-solid fa-check-to-slot"></i> No votes');
            }
            $("#" + response.pollId + "-AuthorOptionsParent_Box").attr("data-results-loaded", true);

            setTimeout(function () {
                buttonUndisabler(true, "btn-load-poll-datas", baseHtml);
                $("#" + response.id + "-GetPollLiveDatas_Btn").addClass("super-disabled");
                $("#" + response.id + "-GetPollLiveDatas_Btn").html(' <i class="fa-solid fa-bars-progress"></i> Datas Loaded');
            }, 750);

            callAlert('<i class="fa-solid fa-check-to-slot"></i>', null, null, "You've successfully voted", 3.5, "Done", -1, null);
        }
        else {
            callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "You cannot participate in this poll. Please try again later", 3.75, "Got It", -1, null);
        }

        setTimeout(function () {
            $(".btn-vote-in-poll").removeClass("super-disabled");
        }, 1500);
    });
});

$(document).on("submit", "#GetPollComments_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    let baseHtml = ' <i class="fa-regular fa-message"></i> ';
    buttonDisabler(true, "btn-poll-comments", null);

    $.get(url, data, function (response) {
        if (response.success) {
            let isReady = createInsideLgCard("PollComments", "Poll Comments", '<div class="box-bordered p-2"> <div class="d-none"><input type="hidden" id="PollCommentReplies_Qty_Val" value="0" /> <form method="get" action="/PollComment/GetReplies" id="GetPollCommentReplies_Form"><input type="hidden" name="Id" id="GetPollCommentReplies_Id_Val" value="0" /> </form> <form method="post" action="/PollComment/DeleteReply" id="DeletePollCommentReply_Form"><input type="hidden" name="Id" id="DeletePollCommentReply_Id_Val" value="0" /></form> <form method="post" action="/PollComment/Delete" id="DeletePollComment_Form"><input type="hidden" name="Id" id="DeletePollComment_Id_Val" value="0" /></form> <input type="hidden" id="PollComments_CommsQty_Val" value="0" /> </div> <h5 class="h5"><i class="fa-solid fa-square-poll-vertical"></i> Poll Comments</h5> <span class="card-text" id="PollSample_Question_Lbl">Poll Question (Shortened)</span> <br/> <small class="card-text text-muted"><span class="card-text" id="PollSample_ExpirationDate_Span">expires in 6h</span> ∙ <span class="card-text" id="PollSample_VotesQty_Span">153k votes</span></small> <div class="d-none"> <form method="post" action="/PollComments/Send" id="SendPollComments_Form"> <input type="hidden" name="SendPollComments_PollId_Val" value="0" /> </form> </div> </div> <div class="box-standard mt-3" id="AvailablePollComments_Box"> </div> <div class="box-standard slide-box" id="PollCommentReplies_Box" style="display: none;"></div>', '<button type="button" class="btn btn-standard btn-close-inside-lg-card btn-sm" id="PollComments_Container-Close_Btn"><i class="fa-solid fa-angle-left"></i> Back</button>', null);

            const pollQuestion = $("#" + response.pollId + "-Question_Lbl").html();
            const pollVotesQty = $("#" + response.pollId + "-TotalVotesQty_Span").html();
            const pollExpirationDate = $("#" + response.pollId + "-ExpiresIn_Span").html();

            if(pollQuestion != undefined) $("#PollSample_Question_Lbl").html(pollQuestion);
            if (pollVotesQty != undefined) $("#PollSample_VotesQty_Span").html(pollVotesQty + " vote(s)");
            if (pollExpirationDate != undefined) $("#PollSample_ExpirationDate_Span").html(pollExpirationDate);

            $("#AvailablePollComments_Box").empty();
            $("#PollComments_CommsQty_Val").val(response.result.length);
            slideBoxes(false, "PollCommentReplies_Box", "AvailablePollComments_Box");
            if (response.result.length > 0) {
                $.each(response.result, function (index) {
                    createCommentBox("AvailablePollComments_Box", "Poll", "poll", response.result[index].id, response.userId, response.result[index].user.imgUrl, response.result[index].userId, response.result[index].user.nickname, response.result[index].text, response.result[index].sentAt, 0, response.result[index].isEdited, false, false);
                });
            }
            else {
                $("#AvailablePollComments_Box").append('<div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-comment-slash"></i> </h2> <h4 class="h4">No Comments</h4> <small class="card-text text-muted">There are no comments on this poll yet</small> </div>');
            }

            swapToTextBoxNavbar();
            bottomNavbarTextFormCustomization("/PollComment/Send", "SendPollComment_Form", "SendPollComment_Text_Val", "Text", "SendPollComment_SbmtBtn", ["PollId"], [0], ["SendPollComment_PollId_Val"], ["form-control-guard"], ["maxlength", "data-min-length"], [750, 1], "Comment text...", ' <i class="fa-solid fa-arrow-up"></i> ', "btn-standard-rounded");
            $("#SendPollComment_PollId_Val").val(response.pollId);

            if (isReady) {
                setTimeout(function () {
                    callInsideLgContainer(false, "PollComments_Container", false);
                }, 150);
            }
        }
        else {
            callAlert(' <i class="fa-solid fa-comment-slash"></i> ', null, null, "We couldn’t load comments for this poll. Please try again", 3.75, "Close", -1, null);
        }

        setTimeout(function () {
            buttonUndisabler(true, "btn-poll-comments", baseHtml);
        }, 750);
    });
});

$(document).on("submit", "#SendPollComment_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const buttonHtml = $("#SendPollComment_SbmtBtn").html();
    buttonDisabler(false, "SendPollComment_SbmtBtn", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let commsQty = parseInt($("#PollComments_CommsQty_Val").val()) + 1;
            if (commsQty == 1) $("#AvailablePollComments_Box").empty();

            createCommentBox("AvailablePollComments_Box", "Poll", response.result, response.model.userId, response.userImg, response.model.userId, "You", response.model.text, new Date(), 0, false, false, false);
            $("#PollComments_CommsQty_Val").val(commsQty);
            slideBoxes(false, "PollCommentReplies_Box", "AvailablePollComments_Box");
            setTimeout(function () {
                buttonUndisabler(false, "SendPollComment_SbmtBtn", buttonHtml);
            }, 750);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Failed to send comment due to an unexpected error. Please try again later", 3.75, "Okay", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to send, edit or like comments", 3.5, "Okay", -1, null);
        }

        $("#SendPollComment_Text_Val").val(null);
    });
});

$(document).on("submit", "#EditPollComment_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#EditPollComment_SbmtBtn").html();
    buttonDisabler(false, "EditPollComment_SbmtBtn", null);

    $.post(url, data, function (response) {
        if (response.success) {
            $("#" + response.result + "-PollIsCommentEdited_Span").fadeIn(300);
            $("#" + response.result + "-PollCommentContent_Span").html(response.text);
            callKawaiiAlert(0, "Comment edited", '<i class="fa-solid fa-pencil"></i>', null, null, 2, false);
        }
        else {
            if(response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Failed to edit the comment. Please try again later", 3.75, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to edit comments", 3.25, "Okay", -1, null);
        }
        swapToDefaultMode();
        bottomNavbarTextFormCustomization("/PollComment/Send", "SendPollComment_Form", "SendPollComment_Text_Val", "Text", "SendPollComment_SbmtBtn", ["PollId"], [0], ["SendPollComment_PollId_Val"], ["form-control-guard"], ["maxlength", "data-min-length"], [750, 1], "Comment text...", ' <i class="fa-solid fa-arrow-up"></i> ', "btn-standard-rounded");
        setTimeout(function () {
            buttonUndisabler(false, "EditPollComment_SbmtBtn", baseHtml);
        }, 750);
    });
});

$(document).on("submit", "#DeletePollComment_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $(".btn-submit-delete-poll-comment").html();
    buttonDisabler(true, "btn-submit-delete-poll-comment", ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Loading...');

    $.post(url, data, function (response) {
        if (response.success) {
            let currentCommsQty = parseInt($("#PollComments_CommsQty_Val").val()) - 1;
            if (currentCommsQty > 0) {
                hideBySlidingToLeft(false, null, response.result + "-PollComment_Box");
                setTimeout(function () {
                    $("#" + response.result + "-PollComment_Box").remove();
                }, 750);
            }
            else {
                hideBySlidingToLeft(false, null, response.result + "-PollComment_Box");
                setTimeout(function () {
                    $("#AvailablePollComments_Box").empty();
                    $("#AvailablePollComments_Box").append('<div class="box-standard text-center"> <h2 class="h2"> <i class="fa-solid fa-comment-slash"></i> </h2> <h4 class="h4">No Comments</h4> <small class="card-text text-muted">There are no comments on this poll yet</small> </div>');
                }, 750);

                callKawaiiAlert(0, "Comment deleted", '<i class="fa-regular fa-trash-can"></i>', null, null, 2.25, false);
            }
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Failed to delete the comment. Please try again later", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to delete your comments", 3.25, "Got It", -1, null);
        }

        uncallAProposal();
        setTimeout(function () {
            buttonUndisabler(false, "btn-submit-delete-poll-comment", baseHtml);
        }, 750);
    });
});

$(document).on("submit", "#GetPollCommentReplies_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $(".btn-reply-to-poll-comment").html();
    buttonDisabler(true, "btn-reply-to-poll-comment", null);

    $.get(url, data, function (response) {
        if (response.success) {
            $("#PollCommentReplies_Box").empty();
            $("#PollCommentReplies_Qty_Val").val(response.result.length);
            if (response.result.length > 0) {
                $.each(response.result, function (index) {
                    createCommentBox("PollCommentReplies_Box", "Poll", "poll", response.result[index].id, response.userId, response.result[index].user.imgUrl, response.result[index].userId, response.result[index].user.nickname, response.result[index].text, response.result[index].sentAt, 0, response.result[index].isEdited, false, false, false, false);
                });
            }
            else $("#PollCommentReplies_Box").append('<div class="box-standard text-center mt-1 p-2"> <h2 class="h2"> <i class="fa-solid fa-reply"></i> </h2> <h4 class="h4">No Replies</h4> <small class="card-text text-muted">This poll comment has no replies yet</small> </div>');

            swapToTextBoxNavbar();
            bottomNavbarTextFormCustomization("/PollComment/Reply", "ReplyToPollComment_Form", "ReplyToPollComment_Text_Val", "Text", "ReplyToPollComment_SbmtBtn", ["PollCommentId"], [response.id], ["ReplyToPollComment_PollCommentId_Val"], ["form-control-guard"], ["data-min-length", "maxlength"], [1, 500], "Reply text...", ' <i class="fa-solid fa-arrow-up"></i> ', ["btn-standard-rounded"]);
            slideBoxes(false, "AvailablePollComments_Box", "PollCommentReplies_Box");
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Failed to get this comment replies. Please try again later", 3.5, "Close", -1, null);

        setTimeout(function () {
            buttonUndisabler(true, "btn-reply-to-poll-comment", baseHtml);
        }, 750);
    });
});

$(document).on("submit", "#ReplyToPollComment_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#ReplyToPollComment_SbmtBtn").html();
    buttonDisabler(false, "ReplyToPollComment_SbmtBtn", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let repliesQty = parseInt($("#PollCommentReplies_Qty_Val").val());
            if (repliesQty <= 0) $("#PollCommentReplies_Box").empty();

            $("#PollCommentReplies_Qty_Val").val(++repliesQty);
            $("#ReplyToPollComment_Text_Val").val(null);
            createCommentBox("PollCommentReplies_Box", "Poll", "poll", response.result, response.model.userId, response.userImg, response.model.userId, "You", response.model.text, response.model.sentAt, 0, false, false, false, true, false);
        }
        else callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Couldn’t post your reply. Please try again later", 3.5, "Got It", -1, null);

        setTimeout(function () {
            buttonUndisabler(false, "ReplyToPollComment_SbmtBtn", baseHtml);
        }, 750);
    });
});

$(document).on("submit", "#EditPollReply_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    const baseHtml = $("#EditPollReply_SbmtBtn").html();
    buttonDisabler(false, "EditPollReply_SbmtBtn", null);

    $.post(url, data, function (response) {
        if (response.success) {
            $("#" + response.result + "-PollRecommentEdited_Span").fadeIn(300);
            $("#" + response.result + "-PollRecommentContent_Span").html(response.text);

            swapToDefaultMode();
            bottomNavbarTextFormCustomization("/PollComment/Reply", "ReplyToPollComment_Form", "ReplyToPollComment_Text_Val", "Text", "ReplyToPollComment_SbmtBtn", ["PollCommentId"], [response.id], ["ReplyToPollComment_PollCommentId_Val"], ["form-control-guard"], ["data-min-length", "maxlength"], [1, 500], "Reply text...", ' <i class="fa-solid fa-arrow-up"></i> ', ["btn-standard-rounded"]);
            callKawaiiAlert(0, "Comment reply edited", '<i class="fa-solid fa-pencil"></i>', null, null, 2, false);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Failed to edit your reply. Please try again later", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to edit your comments and replies", 3.5, "Got It", -1, null);
        }

        $("#EditPollReply_Text_Val").val(null);
        setTimeout(function () {
            buttonUndisabler(false, "EditPollReply_SbmtBtn", baseHtml);
        }, 1000);
    });
});

$(document).on("submit", "#DeletePollCommentReply_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    buttonDisabler(false, "DeletePollCommentReply_SbmtBtn", ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Deleting...');

    $.post(url, data, function (response) {
        if (response.success) {
            let repliesQty = parseInt($("#PollCommentReplies_Qty_Val").val()) - 1;

            hideBySlidingToLeft(false, null, response.result + "-PollRecomment_Box");
            if (repliesQty > 0) {
                setTimeout(function () {
                    $("#" + response.result + "-PollRecomment_Box").remove();
                }, 750);
            }
            else {
                setTimeout(function () {
                    $("#PollCommentReplies_Box").empty();
                    $("#PollCommentReplies_Box").append('<div class="box-standard text-center mt-1 p-2"> <h2 class="h2"> <i class="fa-solid fa-reply"></i> </h2> <h4 class="h4">No Replies</h4> <small class="card-text text-muted">This poll comment has no replies yet</small> </div>');
                }, 750);
            } 
            $("#PollCommentReplies_Qty_Val").val(repliesQty);
            callKawaiiAlert(0, "Comment reply deleted", '<i class="fa-regular fa-trash-can"></i>', null, null, 2.25, false);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Failed to delete your reply. Please try again later", 3.25, "Hide", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to edit or delete your comment replies", 3.5, "Got It", -1, null);
        }
        uncallAProposal();
    });
});

$(document).on("mousedown", ".btn-participate-in-poll", function () {
    let pollId = getTrueId($(this).attr("id"), false);
    if (pollId != undefined) {
        $("#" + pollId + "-PollStatus_Span").html(' ∙ <i class="fa-solid fa-check-to-slot"></i> Vote Mode On');
        $("#" + pollId + "-PollStatus_Span").fadeIn(300);

        let pollOptionButtons = document.getElementsByClassName("box-poll-in-post-option");
        if (pollOptionButtons.length > 0) {
            for (let i = 0; i < pollOptionButtons.length; i++) {
                if ($(pollOptionButtons[i]).attr("data-poll-id") == pollId) {
                    $(pollOptionButtons[i]).addClass("btn-vote-in-poll");
                }
            }
        }

        $(this).removeClass("btn-participate-in-poll");
        $(this).addClass("btn-stop-participating-in-poll");
        $(this).html(' <i class="fa-solid fa-circle-stop"></i> Stop Voting');
    }
});

$(document).on("mousedown", ".btn-stop-participating-in-poll", function () {
    let pollId = getTrueId($(this).attr("id"), false);
    if (pollId != undefined) {
        $("#" + pollId + "-PollStatus_Span").html(null);
        $("#" + pollId + "-PollStatus_Span").fadeOut(300);

        let pollOptionButtons = document.getElementsByClassName("box-poll-in-post-option");
        if (pollOptionButtons.length > 0) {
            for (let i = 0; i < pollOptionButtons.length; i++) {
                if ($(pollOptionButtons[i]).attr("data-poll-id") == pollId) {
                    $(pollOptionButtons[i]).removeClass("btn-vote-in-poll");
                }
            }
        }

        $(this).addClass("btn-participate-in-poll");
        $(this).removeClass("btn-stop-participating-in-poll");
        $(this).html(' <i class="fa-solid fa-check-to-slot"></i> Vote');
    }
});

$(document).on("mousedown", ".btn-pre-finish-poll", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        //callAProposal('<i class="fa-solid fa-flag-checkered"></i>', "End Poll", "Ending the poll will stop new votes. Results will be finalized and shown to viewers. A special flag will indicate it was ended early", "End", ["btn-finish-poll"], ["data-poll-id"], [trueId], false, null, 20);
        callAProposal('<i class="fa-solid fa-flag-checkered"></i>', "End Poll", "Ending the poll will stop new votes. Results will be finalized and shown to viewers. A special flag will indicate it was ended early", "End", null, null, null, true, '<form method="post" action="/Poll/End" id="EndThePoll_Form"><input type="hidden" name="Id" id="EndThePoll_Id_Val" value="0" /><button type="submit" class="btn btn-standard-bolded bg-chosen-bright w-100" id="EndThePoll_SbmtBtn"> <i class="fa-solid fa-flag-checkered"></i> End</button></form>', 20);

        setTimeout(function () {
            $("#EndThePoll_Id_Val").val(trueId);
        }, 300);
    }
});

$(document).on("mousedown", ".btn-pre-delete-poll", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        //function uncallAProposal
        callAProposal('<i class="fa-regular fa-trash-can text-danger"></i>', "Delete Poll", "Are you sure you want to delete this poll? This action is permanent and cannot be undone. All votes and results will be lost", null, null, null, null, true, '            <form method="post" action="/Poll/Delete" id="DeleteThePoll_Form"><input type="hidden" name="Id" id="DeleteThePoll_Id_Val" value="0" /><button type="submit" class="btn btn-standard-bolded btn-classic-styled bg-danger text-light w-100" id="DeleteThePoll_SbmtBtn"> <i class="fa-regular fa-trash-can"></i> Delete</button></form>', 30);
        setTimeout(function () {
            $("#DeleteThePoll_Id_Val").val(trueId);
        }, 300);
    }
});

$(document).on("mousedown", ".btn-vote-in-poll", function () {
    let pollId = $(this).attr("data-poll-id");
    let trueId = getTrueId($(this).attr("id"), false);

    if (trueId != undefined && pollId != undefined) {
        let areResultsLoaded = $("#" + pollId + "-AuthorOptionsParent_Box").attr("data-results-loaded");
        areResultsLoaded = areResultsLoaded == undefined ? $("#" + pollId + "-OptionsParent_Box").attr("data-results-loaded") : areResultsLoaded;
        areResultsLoaded = areResultsLoaded == "false" ? true : false;

        $("#VoteInPoll_Id_Val").val(trueId);
        $("#VoteInPoll_PollId_Val").val(pollId);
        $("#VoteInPoll_LoadResults_Val").val(areResultsLoaded);
        $("#VoteInPoll_Form").submit();
    }
});

$(document).on("mousedown", ".btn-load-poll-datas", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        let areResultsLoaded = $("#" + trueId + "-AuthorOptionsParent_Box").attr("data-results-loaded");
        areResultsLoaded = areResultsLoaded == "true" ? true : false;
        if (!areResultsLoaded) {
            $("#GetPollLiveDatas_Id_Val").val(trueId);
            $("#GetPollLiveDatas_Form").submit();
        }
    }
});

$(document).on("mousedown", ".btn-poll-comments", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#GetPollComments_Id_Val").val(trueId);
        $("#GetPollComments_Form").submit();
    }
});

$(document).on("mousedown", ".btn-like-the-poll", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#LikeThePoll_Id_Val").val(trueId);
        $("#LikeThePoll_Form").submit();
    }
});

$(document).on("mousedown", ".btn-remove-poll-like", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#RemovePollLike_Id_Val").val(trueId);
        $("#RemovePollLike_Form").submit();
    }
});

$(document).on("submit", "#LikeThePoll_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    $(".btn-like-the-poll").attr("disabled", true);
    $(".btn-remove-poll-like").attr("disabled", true);

    $.post(url, data, function (response) {
        if (response.success) {
            let likesQty = parseInt($("#" + response.id + "-LikesQtyBtn_Span").html());
            likesQty = isNaN(likesQty) ? 1 : ++likesQty;

            $("#" + response.id + "-LikesQtyBtn_Span").html(likesQty);
            $("#" + response.id + "-LikesHeartBtn_Span").html('<i class="fa-solid fa-heart"></i>');
            $("#" + response.id + "-LikeThePoll_Btn").removeClass("btn-like-the-poll");
            $("#" + response.id + "-LikeThePoll_Btn").addClass("btn-remove-poll-like");
            callKawaiiAlert(0, "Poll liked successfully", '<i class="fa-solid fa-heart fa-beat"></i>', 0, null, 2, false);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Failed to like this poll. Please try again later", 3.25, "Hide", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to like polls, tracks, and much more", 3.5, "Got It", -1, null);
        }

        setTimeout(function () {
            $(".btn-like-the-poll").attr("disabled", false);
            $(".btn-remove-poll-like").attr("disabled", false);
        }, 750);
    });
});

$(document).on("submit", "#RemovePollLike_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();
    $(".btn-like-the-poll").attr("disabled", true);
    $(".btn-remove-poll-like").attr("disabled", true);

    $.post(url, data, function (response) {
        if (response.success) {
            let likesQty = parseInt($("#" + response.id + "-LikesQtyBtn_Span").html());
            likesQty = isNaN(likesQty) ? 0 : --likesQty;

            if (likesQty > 0) $("#" + response.id + "-LikesQtyBtn_Span").html(likesQty);
            else $("#" + response.id + "-LikesQtyBtn_Span").html(null);

            $("#" + response.id + "-LikesHeartBtn_Span").html('<i class="fa-regular fa-heart"></i>');
            $("#" + response.id + "-LikeThePoll_Btn").addClass("btn-like-the-poll");
            $("#" + response.id + "-LikeThePoll_Btn").removeClass("btn-remove-poll-like");
            callKawaiiAlert(0, "Like removed from poll", '<i class="fa-regular fa-heart fa-beat"></i>', 0, null, 2, false);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "Couldn’t remove your like from this poll. Please try again later", 3.75, "Hide", -1, null);
            else callAlert('<i class="fa-solid fa-arrow-up anime-rewind-shift"></i>', null, null, "Sign in to like polls, tracks, and much more", 3.5, "Got It", -1, null);
        }

        setTimeout(function () {
            $(".btn-like-the-poll").attr("disabled", false);
            $(".btn-remove-poll-like").attr("disabled", false);
        }, 750);
    });
});

$(document).on("mousedown", ".btn-edit-poll-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        const currentText = $("#" + trueId + "-PollCommentContent_Span").html();
        if (currentText != undefined) {
            swapToTextBoxNavbar();
            swapToEditMode(-1, currentText);
            bottomNavbarTextFormCustomization("/PollComment/Edit", "EditPollComment_Form", "EditPollComment_Text_Val", "Text", "EditPollComment_SbmtBtn", ["Id"], [trueId], ["EditPollComment_Id_Val"], ["form-control-guard"], ["maxlength", "data-min-length"], [500, 1], "Edit your comment...", ' <i class="fa-solid fa-check"></i> ', "btn-standard-rounded");
            $("#EditPollComment_Text_Val").val(currentText);
        }
    }
});

$(document).on("mousedown", ".btn-pre-delete-poll-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        callAProposal('<i class="fa-regular fa-trash-can text-danger"></i>', "Delete Comment", "Are you sure you want to delete this comment?", "Yes, Certainly", ["btn-delete-poll-comment", "bg-danger text-light"], ["data-comment-id"], [trueId], false, null);
    }
});

$(document).on("mousedown", ".btn-delete-poll-comment", function () {
    let id = $(this).attr("data-comment-id");
    if (id != undefined) {
        $("#DeletePollComment_Id_Val").val(id);
        $("#DeletePollComment_Form").submit();
    }
});

$(document).on("mousedown", ".btn-reply-to-poll-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#GetPollCommentReplies_Id_Val").val(trueId);
        $("#GetPollCommentReplies_Form").submit();
    }
});

$(document).on("mousedown", ".btn-edit-poll-recomment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        const currentText = $("#" + trueId + "-PollRecommentContent_Span").html();
        if (currentText != undefined) {
            swapToTextBoxNavbar();
            swapToEditMode(0, currentText);
            bottomNavbarTextFormCustomization("/PollComment/EditReply", "EditPollReply_Form", "EditPollReply_Text_Val", "Text", "EditPollReply_SbmtBtn", ["Id"], [trueId], ["EditPollReply_Id_Val"], ["form-control-guard"], ["maxlength", "data-min-length"], [500, 1], "Edit your reply...", ' <i class="fa-solid fa-check"></i> ', "btn-standard-rounded");
            $("#EditPollReply_Text_Val").val(currentText);
        }
    }
});

$(document).on("mousedown", ".btn-pre-delete-poll-recomment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        callAProposal('<i class="fa-regular fa-trash-can text-danger"></i>', "Delete Comment Reply", "Are you sure you want to delete this reply?", "Yes, Delete", ["btn-delete-poll-recomment"], ["data-reply-id"], [trueId], false, null, 25);
    }
});

$(document).on("mousedown", ".btn-delete-poll-recomment", function () {
    let id = $(this).attr("data-reply-id");
    if (id != undefined) {
        $("#DeletePollCommentReply_Id_Val").val(id);
        $("#DeletePollCommentReply_Form").submit();
    }
});
  
function setPollResults(poll_Id, currentUser_VoteOption_Id, totalVoicesQty = 0, resultsArr = []) {
    if ((poll_Id != undefined && poll_Id != null) && (resultsArr.length > 0) && (parseInt(totalVoicesQty) > 0)) {
        for (let i = 0; i < resultsArr.length; i++) {
            const percFromTotal = (parseFloat(resultsArr[i].groupVotesQty) / totalVoicesQty) * 100;

            $("#" + resultsArr[i].pollOptionId + "-Poll_VoicePercLine_Box").fadeIn(300);
            $("#" + resultsArr[i].pollOptionId + "-Poll_VoiceQtyBadge_Span").fadeIn(300);
            $("#" + resultsArr[i].pollOptionId + "-Poll_VoicePercLine_Box").css("width", percFromTotal + "%");
            $("#" + resultsArr[i].pollOptionId + "-Poll_VoiceQtyBadge_Span").html(percFromTotal.toFixed(1) + "% ∙ " + resultsArr[i].groupVotesQty.toLocaleString());

            $("#" + resultsArr[i].pollOptionId + "-AuthorPoll_VoicePercLine_Box").fadeIn(300);
            $("#" + resultsArr[i].pollOptionId + "-AuthorPoll_VoiceQtyBadge_Span").fadeIn(300);
            $("#" + resultsArr[i].pollOptionId + "-AuthorPoll_VoicePercLine_Box").css("width", percFromTotal + "%");
            $("#" + resultsArr[i].pollOptionId + "-AuthorPoll_VoiceQtyBadge_Span").html(percFromTotal.toFixed(1) + "% ∙ " + resultsArr[i].groupVotesQty.toLocaleString());
        }

        if (currentUser_VoteOption_Id != null || currentUser_VoteOption_Id != undefined) {
            $("#" + currentUser_VoteOption_Id + "-AuthorPoll_IsVoted_Span").html(' <i class="fa-regular fa-circle-check"></i> ');
            $("#" + currentUser_VoteOption_Id + "-AuthorPoll_IsVoted_Span").fadeIn(300);
        }
    }
}

function createRegularPollBox(poll_Id = 0, user_Id = 0, user_Nickname = null, user_ImgSrc = null, expiration_Date = new Date(), questionText, options = [], votedOptionId = null, totalVotesQty = 0, isAnonym = false, isSkippable = false, isLiked = false, likesQty = 0) {
    if ((poll_Id != null || poll_Id != undefined) && (user_Id != null || user_Id != undefined) && (user_Nickname != null || user_Nickname != undefined) && (questionText != null || questionText != undefined)) {
        let mainBox = elementDesigner("div", "box-post-or-poll", null);
        let headerStackBox = elementDesigner("div", "hstack gap-2", null);
        let avatarBox = null;
        let headerInfoBox = elementDesigner("div", "ms-2", null);
        let userName_Lbl = elementDesigner("span", "h6", user_Nickname);
        let infoBoxSeparator = $("<br />");
        let statsMain_Span = elementDesigner("small", "card-text text-muted", null);
        let statsType_Span = elementDesigner("span", "card-text", null);
        let statsExpiresIn_Span = elementDesigner("span", "card-text", null);
        let statsIsAnonym_Span = elementDesigner("span", "card-text", null);

        let expiresIn_Html = null;
        let todayDate = new Date();
        let expiresIn_DateDiff = getDateDiffs(todayDate, new Date(expiration_Date));

        let question_Box = elementDesigner("div", "box-standard mt-2", null);
        let question_Lbl = elementDesigner("p", "card-text white-space-on", questionText);

        let optionsParentBox = elementDesigner("div", "box-bordered mt-1 p-1", null);
        let additionalBtnsBox = elementDesigner("div", "box-standard row mt-2", null);
        let additionalBtnsCol0 = elementDesigner("div", "col", null);
        let additionalBtnsCol1 = elementDesigner("div", "col", null);
        let additionalBtnsCol2 = elementDesigner("div", "col", null);
        let additionalBtnsCol3 = elementDesigner("div", "col", null);

        let likesQtySpan = elementDesigner("span", "card-text", null);
        let likesHeartSpan = elementDesigner("span", "card-text", null);
        let additionalBtn0 = elementDesigner("button", "btn btn-poll-or-post-settings btn-sm", null);
        let additionalBtn1 = elementDesigner("button", "btn btn-poll-or-post-settings btn-poll-comments btn-sm", ' <i class="fa-regular fa-message"></i> ');
        let additionalBtn2 = elementDesigner("button", "btn btn-poll-or-post-settings btn-poll-votes-display btn-sm", ' <i class="fa-solid fa-check-to-slot"></i> ');
        let additionalBtn3 = $('<button type="button" class="btn btn-poll-or-post-settings btn-sm" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
        let dropdownBox = elementDesigner("div", "dropdown", null);
        let dropdownMenuBox = $("<ul class='dropdown-menu shadow-sm'></ul>");
        let dropdownLi0 = $("<li></li>");
        let dropdownLi1 = $("<li></li>");
        let dropdownLi2 = $("<li></li>");
        let dropdownBtn0 = elementDesigner("button", "dropdown-item btn-skip-the-poll", ' <i class="fa-solid fa-bars-progress"></i> Show Results');
        let dropdownBtn1 = elementDesigner("button", "dropdown-item", ' <i class="fa-regular fa-chart-bar"></i> Show Stats Chart');
        let dropdownBtn2 = elementDesigner("button", "dropdown-item text-danger", ' <i class="fa-regular fa-flag"></i> Report');
        let onlyVotesQtySpan = elementDesigner("span", "card-text", null);

        if (user_ImgSrc != null || user_ImgSrc != undefined) {
            avatarBox = $("<img src='#' class='profile-avatar-img-md' alt='This image cannot be displayed' />");
            avatarBox.attr("src", "/ProfileImages/" + user_ImgSrc);
        }
        else {
            avatarBox = elementDesigner("div", "profile-avatar-md", user_Nickname[0]);
        }

        if (expiresIn_DateDiff != null) {
            expiresIn_Html = "expires in ";
            if (expiresIn_DateDiff.days > 0) expiresIn_Html += expiresIn_DateDiff.days + "d ";
            if (expiresIn_DateDiff.hours > 0) expiresIn_Html += expiresIn_DateDiff.hours + "h";
            else expiresIn_Html += "less than an hour";

            statsExpiresIn_Span.html(expiresIn_Html);
            statsExpiresIn_Span.attr("id", poll_Id + "-ExpiresIn_Span");
        }

        if (isAnonym) statsIsAnonym_Span.html(' ∙ <i class="fa-solid fa-masks-theater"></i> anonym poll');
        else statsIsAnonym_Span.html(' ∙ <i class="fa-regular fa-square-check"></i> open poll');

        let totalVotesFormatted = new Intl.NumberFormat("en", {
            notation: "compact",
            compactDisplay: "short"
        }).format(totalVotesQty);

        optionsParentBox.attr("data-results-loaded", false);
        optionsParentBox.attr("id", poll_Id + "-OptionsParent_Box");
        onlyVotesQtySpan.html(totalVotesFormatted);
        additionalBtn2.html(' <i class="fa-solid fa-check-to-slot"></i> ');
        additionalBtn2.append(onlyVotesQtySpan);

        for (let i = 0; i < options.length; i++) {
            let optionIsVotedSpan = elementDesigner("span", "card-text", null);
            let optionChildBox = elementDesigner("div", "box-poll-in-post-option", null);
            let optionText = elementDesigner("span", "card-text", options[i].option);
            let optionVotePercLineBox = elementDesigner("div", "box-poll-in-post-voice-part", null);
            let optionVoteQtyBadgeSpan = elementDesigner("small", "badge-voice-qty float-end ms-1", null);

            optionChildBox.append(optionVoteQtyBadgeSpan)
            optionChildBox.append(optionIsVotedSpan);
            optionChildBox.append(optionText);
            optionChildBox.append(optionVotePercLineBox);

            optionVoteQtyBadgeSpan.attr("id", options[i].id + "-Poll_VoiceQtyBadge_Span");
            optionVotePercLineBox.attr("id", options[i].id + "-Poll_VoicePercLine_Box");
            optionIsVotedSpan.attr("id", options[i].id + "-Poll_IsVoted_Span");
            optionText.attr("id", options[i].id + "-PollOptionText_Lbl");
            optionChildBox.attr("id", options[i].id + "-PollOption_Box");
            optionChildBox.attr("data-poll-id", poll_Id);

            if (parseInt(options[i].votesQty) > 0) {
                let currentPercFromTotal = parseFloat(options[i].votesQty) / parseFloat(totalVotesQty) * 100;
                let currentVotesFormatted = new Intl.NumberFormat("en", {
                    notation: "compact",
                    compactDisplay: "short"
                }).format(options[i].votesQty);

                optionVotePercLineBox.fadeIn(300);
                optionVoteQtyBadgeSpan.fadeIn(300);
                optionVotePercLineBox.css("width", currentPercFromTotal + "%");
                optionVoteQtyBadgeSpan.html(currentPercFromTotal.toFixed(1) + "% ∙ " + currentVotesFormatted);
            }
            else {
                optionVotePercLineBox.fadeOut(0);
                optionVoteQtyBadgeSpan.fadeOut(0);
            }

            if (parseInt(votedOptionId) == undefined || parseInt(votedOptionId) == 0) optionChildBox.addClass("btn-vote-in-poll");
            else {
                if (parseInt(votedOptionId) == options[i].id) {
                    optionIsVotedSpan.fadeIn(300);
                    optionChildBox.addClass("active");
                    optionIsVotedSpan.html(' <i class="fa-regular fa-circle-check"></i> ');
                }
                else optionIsVotedSpan.fadeOut(0);
            }
            optionsParentBox.append(optionChildBox);
        }

        if (isSkippable && (votedOptionId == null || votedOptionId == undefined)) {
            let skipBox = elementDesigner("div", "box-poll-in-post-option btn-skip-the-poll", null);
            let skipText = elementDesigner("span", "card-text", ' <i class="fa-solid fa-bars-progress"></i> Show Results');
            skipBox.append(skipText);

            skipBox.attr("id", poll_Id + "-SkipThePoll_Box");
            optionsParentBox.append(skipBox);
        }

        likesQty = parseInt(likesQty);
        if (likesQty != undefined && likesQty > 0) likesQtySpan.html(likesQty);
        else likesQtySpan.html("");

        if (isLiked) {
            additionalBtn0.addClass("btn-remove-poll-like");
            likesHeartSpan.html(' <i class="fa-solid fa-heart"></i> ');
        }
        else {
            additionalBtn0.addClass("btn-like-the-poll");
            likesHeartSpan.html(' <i class="fa-regular fa-heart"></i> ');
        }
        additionalBtn0.append(likesHeartSpan);
        additionalBtn0.append(likesQtySpan);

        likesHeartSpan.attr("id", poll_Id + "-LikesHeartBtn_Span");
        likesQtySpan.attr("id", poll_Id + "-LikesQtyBtn_Span");
        additionalBtn0.attr("id", poll_Id + "-LikeThePoll_Btn");
        additionalBtn1.attr("id", poll_Id + "-GetPollComments_Btn");
        additionalBtn2.attr("id", poll_Id + "-TotalVotesQty_Btn");
        onlyVotesQtySpan.attr("id", poll_Id + "-TotalVotesQty_Span");
        question_Lbl.attr("id", poll_Id + "-Question_Lbl");

        statsMain_Span.append(statsType_Span);
        statsMain_Span.append(statsExpiresIn_Span);
        statsMain_Span.append(statsIsAnonym_Span);

        headerInfoBox.append(userName_Lbl);
        headerInfoBox.append(infoBoxSeparator);
        headerInfoBox.append(statsMain_Span);

        headerStackBox.append(avatarBox);
        headerStackBox.append(headerInfoBox);

        question_Box.append(question_Lbl);

        dropdownLi0.append(dropdownBtn0);
        dropdownLi1.append(dropdownBtn1);
        dropdownLi2.append(dropdownBtn2);
        dropdownMenuBox.append(dropdownLi0);
        dropdownMenuBox.append(dropdownLi1);
        dropdownMenuBox.append(dropdownLi2);
        dropdownBox.append(additionalBtn3);
        dropdownBox.append(dropdownMenuBox);

        additionalBtnsCol0.append(additionalBtn0);
        additionalBtnsCol1.append(additionalBtn1);
        additionalBtnsCol2.append(additionalBtn2);
        additionalBtnsCol3.append(dropdownBox);
        additionalBtnsBox.append(additionalBtnsCol0);
        additionalBtnsBox.append(additionalBtnsCol1);
        additionalBtnsBox.append(additionalBtnsCol2);
        additionalBtnsBox.append(additionalBtnsCol3);

        mainBox.append(headerStackBox);
        mainBox.append(question_Box);
        mainBox.append(optionsParentBox);
        mainBox.append(additionalBtnsBox);

        return mainBox;
    }
    else return null;
}

function createPollAuthorBox(poll_Id, pollQuestion, pollOptions = [], expiresAt_Date = new Date(), totalVotesQty = 0, isAnonym = false, isSkippable = false, votedOptionId) {
    if ((poll_Id != null || poll_Id != undefined) && (pollQuestion != undefined || pollQuestion != null) && (pollOptions.length > 1)) {
        expiresAt_Date = new Date(expiresAt_Date);
        let todayDate = new Date();
        let pollExpirationHtml = null;
        let pollExpirationDuration = getDateDiffs(todayDate, expiresAt_Date);

        if (pollExpirationDuration != null) {
            if (pollExpirationDuration.days > 0) pollExpirationHtml = pollExpirationDuration.days + "d ";
            else pollExpirationHtml = "";

            if (pollExpirationDuration.hours > 0) pollExpirationHtml += pollExpirationDuration.hours + "h";
            else pollExpirationHtml = "less than an hour";
        }

        let pollBox = elementDesigner("div", "box-post-or-poll", null);
        let headerStackBox = elementDesigner("div", "hstack gap-1", null);
        let headerStackInfoDiv = elementDesigner("div", "box-standard", null);

        let pollQuestionLbl = elementDesigner("span", "card-text white-space-on", pollQuestion);
        let pollTypeIcon = elementDesigner("small", "card-text text-muted", null);
        let pollExpiresAfter = elementDesigner("small", "card-text text-muted", null);
        let pollTotalVotesQtySpan = elementDesigner("small", "card-text text-muted", null);
        let pollStatusSpan = elementDesigner("small", "card-text text-muted", null);
        let pollInfoSeparator = $("<br />");

        let dropdownMoreInfoBox = elementDesigner("div", "dropdown ms-auto", null);
        let dropdownBtn = $('<button class="btn btn-standard btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
        let dropdownUl = $('<ul class="dropdown-menu shadow-sm"></ul>');
        let participateInPollBtn = elementDesigner("button", "dropdown-item btn-participate-in-poll", ' <i class="fa-solid fa-check-to-slot"></i> Participate');
        let getLiveDatasBtn = elementDesigner("button", "dropdown-item btn-load-poll-datas", ' <i class="fa-solid fa-bars-progress"></i> Show Datas');
        let finishPollBtn = elementDesigner("button", "dropdown-item btn-pre-finish-poll", ' <i class="fa-solid fa-flag-checkered"></i> Finish Poll');
        let deletePollBtn = elementDesigner("button", "dropdown-item text-danger btn-pre-delete-poll", ' <i class="fa-regular fa-trash-can"></i> Delete Poll');
        let dropdownLi0 = $("<li></li>");
        let dropdownLi1 = $('<li></li>');
        let dropdownLi2 = $('<li></li>');
        let dropdownLi3 = $('<li></li>');

        getLiveDatasBtn.attr("id", poll_Id + "-GetPollLiveDatas_Btn");
        finishPollBtn.attr("id", poll_Id + "-ForceFinishPoll_Btn");
        deletePollBtn.attr("id", poll_Id + "-PreDeletePoll_Btn");
        pollExpiresAfter.attr("id", poll_Id + "-ExpirationDuration_Span");
        pollTotalVotesQtySpan.attr("id", poll_Id + "-PollTotalVotesQty_Span");
        pollStatusSpan.attr("id", poll_Id + "-PollStatus_Span");
        pollStatusSpan.fadeOut(0);

        dropdownLi0.append(participateInPollBtn);
        dropdownLi1.append(getLiveDatasBtn);
        dropdownLi2.append(finishPollBtn);
        dropdownLi3.append(deletePollBtn);
        dropdownUl.append(participateInPollBtn);
        dropdownUl.append(dropdownLi1);
        dropdownUl.append(dropdownLi2);
        dropdownUl.append(dropdownLi3);
        dropdownMoreInfoBox.append(dropdownUl);
        dropdownMoreInfoBox.append(dropdownBtn);

        headerStackInfoDiv.append(pollQuestionLbl);
        headerStackInfoDiv.append(pollInfoSeparator);
        headerStackInfoDiv.append(pollTypeIcon);
        headerStackInfoDiv.append(pollExpiresAfter.html(" ∙ " + pollExpiresAfter));
        headerStackInfoDiv.append(pollTotalVotesQtySpan);
        headerStackInfoDiv.append(pollStatusSpan);

        let optionsParentBox = elementDesigner("div", "box-bordered mt-1", null);
        optionsParentBox.attr("data-results-loaded", false);
        optionsParentBox.attr("id", poll_Id + "-AuthorOptionsParent_Box");
        for (let i = 0; i < pollOptions.length; i++) {
            let optionIsVotedSpan = elementDesigner("span", "card-text", null);
            let optionChildBox = elementDesigner("div", "box-poll-in-post-option", null);
            let optionText = elementDesigner("span", "card-text", pollOptions[i].option);
            let optionVotePercLineBox = elementDesigner("div", "box-poll-in-post-voice-part", null);
            let optionVoteQtyBadgeSpan = elementDesigner("small", "badge-voice-qty float-end ms-1", null);

            optionChildBox.append(optionVoteQtyBadgeSpan)
            optionChildBox.append(optionIsVotedSpan);
            optionChildBox.append(optionText);
            optionChildBox.append(optionVotePercLineBox);

            if (parseInt(pollOptions[i].votesQty) > 0) {
                let currentPercFromTotal = parseFloat(pollOptions[i].votesQty) / parseFloat(totalVotesQty) * 100;
                let currentVotesFormatted = new Intl.NumberFormat("en", {
                    notation: "compact",
                    compactDisplay: "short"
                }).format(pollOptions[i].votesQty);

                optionIsVotedSpan.fadeIn(300);
                optionVotePercLineBox.fadeIn(300);
                optionVotePercLineBox.css("width", currentPercFromTotal + "%");
                optionVoteQtyBadgeSpan.html(currentPercFromTotal.toFixed(1) + "% ∙ " + currentVotesFormatted);
            }
            else {
                optionVoteQtyBadgeSpan.fadeOut(0);
                optionVotePercLineBox.fadeOut(0);
            }
            
            if (parseInt(votedOptionId) == undefined || parseInt(votedOptionId) == 0) optionChildBox.addClass("btn-vote-in-poll");
            else {
                if (parseInt(votedOptionId) == options[i].id) {
                    optionIsVotedSpan.fadeIn(300);
                    optionChildBox.addClass("active");
                    optionIsVotedSpan.html(' <i class="fa-regular fa-circle-check"></i> ');
                }
                else optionIsVotedSpan.fadeOut(0);
            }

            optionVoteQtyBadgeSpan.attr("id", pollOptions[i].id + "-AuthorPoll_VoiceQtyBadge_Span");
            optionVotePercLineBox.attr("id", pollOptions[i].id + "-AuthorPoll_VoicePercLine_Box");
            optionIsVotedSpan.attr("id", pollOptions[i].id + "-AuthorPoll_IsVoted_Span");
            optionText.attr("id", pollOptions[i].id + "-AuthorPollOptionText_Lbl");
            optionChildBox.attr("id", pollOptions[i].id + "-AuthorPollOption_Box");
            optionChildBox.attr("data-poll-id", poll_Id);
            optionsParentBox.append(optionChildBox);
        }

        let pollAdditionalInfoBox = elementDesigner("div", "box-standard row mt-1", null);
        let pollAddCol1 = elementDesigner("div", "col", null);
        let pollAddCol2 = elementDesigner("div", "col", null);
        let pollAddCol3 = elementDesigner("div", "col", null);
        let pollOptionsQtyBtn = elementDesigner("button", "btn btn-poll-or-post-settings btn-sm", null);
        let pollIsAnonymBtn = elementDesigner("button", "btn btn-poll-or-post-settings btn-sm", null);
        let pollIsSkippableBtn = elementDesigner("button", "btn btn-poll-or-post-settings btn-sm", null);

        pollOptionsQtyBtn.html(' <i class="fa-solid fa-list-ul"></i> Options: ' + pollOptions.length);
        if (isAnonym) pollIsAnonymBtn.html(' <i class="fa-solid fa-masks-theater"></i> Anonym');
        else pollIsAnonymBtn.html(' <i class="fa-solid fa-check-to-slot"></i> Open Poll');
        if (isSkippable) pollIsSkippableBtn.html(' <i class="fa-solid fa-angles-right"></i> Skippable');
        else pollIsSkippableBtn.html('  <i class="fa-solid fa-angle-right"></i> Unskippable');

        pollAddCol1.append(pollOptionsQtyBtn);
        pollAddCol2.append(pollIsAnonymBtn);
        pollAddCol3.append(pollIsSkippableBtn);

        pollAdditionalInfoBox.append(pollAddCol1);
        pollAdditionalInfoBox.append(pollAddCol2);
        pollAdditionalInfoBox.append(pollAddCol3);

        pollTypeIcon.html(' <i class="fa-solid fa-square-poll-vertical"></i> ');
        pollExpiresAfter.html(" expires in " + pollExpirationHtml);

        headerStackBox.append(headerStackInfoDiv);
        headerStackBox.append(dropdownMoreInfoBox);

        pollBox.attr("id", poll_Id + "-AuthorPoll_Box");

        pollBox.append(headerStackBox);
        pollBox.append(optionsParentBox);
        pollBox.append(pollAdditionalInfoBox);

        return pollBox;
    }
    else return null;
}

function getDateDiffs(firstDate = new Date(), secondDate = new Date()) {
    if ((firstDate != null || firstDate != undefined) && (secondDate != null || secondDate != undefined)) {
        firstDate = new Date(firstDate);
        secondDate = new Date(secondDate);

        let dateDiff = Math.abs(firstDate - secondDate);
        if (dateDiff > 0) {
            const seconds = Math.round(dateDiff / 1000);
            const minutes = Math.round(dateDiff / (1000 * 60));
            let hours = Math.round(dateDiff / (1000 * 60 * 60));
            let days = hours > 24 ? Math.round(hours / 24) : 0;
            if (days > 0) hours = hours - (days * 24);

            return {
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        }
        else return null;
    }
    else return null;
}

function createCommentBox(applyTo_BoxId, uniqueIdPart = null, uniqueClassPart = null, index = 0, currentUserId, avatarImgSrc, userId, username, text, sentAt_Date = new Date(), likesQty = 0, isEdited = false, isLiked = false, isPinned = false, isForParentOwner = false, canBeReplied = true) {
    if (applyTo_BoxId != null || applyTo_BoxId != undefined) {
        sentAt_Date = new Date(sentAt_Date);
        uniqueIdPart = (uniqueIdPart == null || uniqueIdPart == undefined) ? "" : uniqueIdPart;
        uniqueClassPart = (uniqueClassPart == null || uniqueClassPart == undefined) ? "" : uniqueClassPart + "-";

        let elementBox = elementDesigner("div", "box-comment", null);
        let elementHeaderBox = elementDesigner("div", "box-comment-header hstack gap-2", null);
        let senderAvatarBox = null;
        let senderUserInfoBox = elementDesigner("div", "box-standard", null);
        let senderUsernameLbl = elementDesigner("span", "h6", username);
        let dropdownBox = elementDesigner("div", "dropdown", null);
        let dropdownBtn = $('<button class="btn btn-standard btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
        let dropdownUl = elementDesigner("ul", "dropdown-menu dropdown-menu-sm-end shadow-sm", null);
        let dropdownLi1 = $("<li></li>");
        let dropdownLi2 = $("<li></li>");
        let dropdownLi3 = $("<li></li>");
        let dropdownLi4 = $("<li></li>");
        let dropdownLi5 = null;
        let dropdownLi6 = null;
        let dropdownLi7 = null;
        let dropdownBtn1 = null;
        let dropdownBtn2 = null;
        let dropdownBtn3 = null;
        let dropdownBtn4 = null;
        let dropdownBtn5 = null;
        let dropdownDivider1 = $('<hr class="dropdown-divider" />');
        let elementBodyBox = elementDesigner("div", "box-comment-body", null);
        let elementTextSpan = elementDesigner("small", "card-text white-space-on", text);
        let elementFooterBox = elementDesigner("div", "box-comment-footer hstack gap-2", null);
        let elementReplyBtn = $('<button type="button" class="btn btn-standard-bolded btn-sm"> <i class="fa-solid fa-reply"></i> Reply</button>');
        let elementLikeBtn = $('<button type="button" class="btn btn-standard btn-sm me-1"> <i class="fa-regular fa-heart"></i> </button>');
        let elementFooterAdditionalInfoBox = elementDesigner("div", "ms-auto", null);
        let sentAtDateSpan = elementDesigner("small", "card-text text-muted me-1", dateAndTimeFormation(4, sentAt_Date)[0]);
        let isEditedSpan = elementDesigner("small", "badge-sm", ' <i class="fa-solid fa-pencil"></i> Edited');
        let isPinnedSpan = elementDesigner("small", "badge-sm ms-auto", ' <i class="fa-solid fa-thumbtack"></i> Pinned');

        if (!isEdited) isEditedSpan.fadeOut(0);
        else isEditedSpan.fadeIn(0);
        if (isPinned) {
            isPinnedSpan.fadeIn(0);
            dropdownBox.removeClass("ms-auto");
        }
        else {
            isPinnedSpan.fadeOut(0);
            dropdownBox.addClass("ms-auto");
        }

        if (avatarImgSrc != null) {
            senderAvatarBox = $("<img src='#' class='profile-avatar-img-sm me-1' alt='This image cannot be displayed' />");
            senderAvatarBox.attr("src", "/ProfileImages/" + avatarImgSrc);
        }
        else senderAvatarBox = elementDesigner("div", "profile-avatar-sm me-1", username[0]);

        dropdownBtn2 = $('<button type="button" class="dropdown-item"> <i class="fa-solid fa-reply"></i> Reply</button>');
        dropdownBtn3 = $('<button type="button" class="dropdown-item"> <i class="fa-regular fa-circle-user"></i> Go to ' + username + '`s Page</button>');
        dropdownBtn4 = $('<button type="button" class="dropdown-item"> <i class="fa-regular fa-flag"></i> Report</button>');
        if (currentUserId == userId) {
            dropdownLi5 = $("<li></li>");
            dropdownLi6 = $("<li></li>");
            dropdownBtn1 = $('<button type="button" class="dropdown-item"> <i class="fa-solid fa-pencil"></i> Edit</button>');
            dropdownBtn6 = $('<button type="button" class="dropdown-item text-danger"> <i class="fa-regular fa-trash-can"></i> Delete</button>');

            dropdownLi1.append(dropdownBtn1);
            dropdownLi5.append(dropdownDivider1);
            dropdownLi6.append(dropdownBtn6);

            if (canBeReplied) {
                dropdownBtn1.addClass("btn-edit-" + uniqueClassPart + "comment");
                dropdownBtn2.addClass("btn-reply-to-" + uniqueClassPart + "comment");
                dropdownBtn6.addClass("btn-pre-delete-" + uniqueClassPart + "comment");
                dropdownBtn1.attr("id", index + "-" + uniqueIdPart + "EditComment_Btn");
                dropdownBtn6.attr("id", index + "-" + uniqueIdPart + "PreDeleteComment_Btn");
            }
            else {
                dropdownBtn1.addClass("btn-edit-" + uniqueClassPart + "recomment");
                dropdownBtn2.addClass("btn-reply-to-" + uniqueClassPart + "recomment");
                dropdownBtn6.addClass("btn-pre-delete-" + uniqueClassPart + "recomment");
                dropdownBtn1.attr("id", index + "-" + uniqueIdPart + "EditReComment_Btn");
                dropdownBtn6.attr("id", index + "-" + uniqueIdPart + "PreDeleteReComment_Btn");
            }
        }

        dropdownLi2.append(dropdownBtn2);
        dropdownLi3.append(dropdownBtn3);
        dropdownLi4.append(dropdownBtn4);

        if (dropdownLi1 != null) dropdownUl.append(dropdownLi1);
        dropdownUl.append(dropdownLi2);
        dropdownUl.append(dropdownLi3);
        dropdownUl.append(dropdownLi4);
        if (dropdownLi5 != null) dropdownUl.append(dropdownLi5);
        if (dropdownLi6 != null) dropdownUl.append(dropdownLi6);
        dropdownBox.append(dropdownBtn);
        dropdownBox.append(dropdownUl);

        senderUserInfoBox.append(senderUsernameLbl);
        elementHeaderBox.append(senderAvatarBox);
        elementHeaderBox.append(senderUserInfoBox);
        elementHeaderBox.append(isPinnedSpan);
        elementHeaderBox.append(dropdownBox);
        elementBodyBox.append(elementTextSpan);

        elementFooterAdditionalInfoBox.append(sentAtDateSpan);
        elementFooterAdditionalInfoBox.append(isEditedSpan);
        elementFooterBox.append(elementReplyBtn);
        elementFooterBox.append(elementFooterAdditionalInfoBox);

        elementBox.append(elementHeaderBox);
        elementBox.append(elementBodyBox);
        elementBox.append(elementFooterBox);
       
        elementLikeBtn.addClass("btn-like-the-" + uniqueClassPart + "comment");
        elementReplyBtn.addClass("btn-reply-to-" + uniqueClassPart + "comment");

        if (!canBeReplied) {
            dropdownBtn2.remove();
            elementReplyBtn.remove();
            elementBox.attr("id", index + "-" + uniqueIdPart + "Recomment_Box");
            isEditedSpan.attr("id", index + "-" + uniqueIdPart + "IsRecommentEdited_Span");
            elementTextSpan.attr("id", index + "-" + uniqueIdPart + "RecommentContent_Span");
            dropdownBox.attr("id", index + "-" + uniqueIdPart + "RecommentDropdown_Box");
        }
        else {
            elementBox.attr("id", index + "-" + uniqueIdPart + "Comment_Box");
            isEditedSpan.attr("id", index + "-" + uniqueIdPart + "IsCommentEdited_Span");
            isPinnedSpan.attr("id", index + "-" + uniqueIdPart + "IsCommentPinned_Span");
            elementTextSpan.attr("id", index + "-" + uniqueIdPart + "CommentContent_Span");
            elementReplyBtn.attr("id", index + "-" + uniqueIdPart + "ReplyToComment_Btn");
            dropdownBtn2.attr("id", index + "-" + uniqueIdPart + "ReplyToComment_Dropdown_Btn");
            dropdownBox.attr("id", index + "-" + uniqueIdPart + "CommentDropdown_Box");

            elementLikeBtn.attr("data-qty", likesQty);
            if (isLiked) {
                elementLikeBtn.addClass("btn-unlike-" + uniqueClassPart + "comment");
                elementLikeBtn.attr("id", index + "-" + uniqueIdPart + "UnlikeComment_Btn");
                elementLikeBtn.html(likesQty > 0 ? ' <i class="fa-solid fa-heart"></i> ' + likesQty.toLocaleString() : ' <i class="fa-solid fa-heart"></i> ');
            }
            else {
                elementLikeBtn.addClass("btn-like-" + uniqueClassPart + "comment");
                elementLikeBtn.attr("id", index + "-" + uniqueIdPart + "LikeComment_Btn");
                elementLikeBtn.html(likesQty > 0 ? ' <i class="fa-regular fa-heart"></i> ' + likesQty.toLocaleString() : ' <i class="fa-regular fa-heart"></i> ');
            }
            elementFooterBox.prepend(elementLikeBtn);

            if (isForParentOwner) {
                dropdownLi7 = $("<li></li>");
                dropdownBtn5 = $("<button type='button' class='dropdown-item'></button>");
                if (isPinned) {
                    dropdownBtn5.addClass("btn-unpin-" + uniqueClassPart + "comment");
                    dropdownBtn5.attr("id", index + "-UnpinComment_Btn");
                    dropdownBtn5.html(' <i class="fa-solid fa-thumbtack-slash"></i> Unpin');
                }
                else {
                    dropdownBtn5.addClass("btn-pin-" + uniqueClassPart + "comment");
                    dropdownBtn5.attr("id", index + "-PinComment_Btn");
                    dropdownBtn5.html(' <i class="fa-solid fa-thumbtack"></i> Pin');
                }
                dropdownLi7.append(dropdownBtn5);
                dropdownUl.prepend(dropdownLi7);
            }
        }
        $("#" + applyTo_BoxId).append(elementBox);

        return true;
    }
    else return false;
}

function numberToHexPart(colorNumber) {
    if (parseInt(colorNumber) >= 0 && colorNumber <= 255) {
        const hex = colorNumber.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    else return null;
}

function rgbToHex(r, g, b) {
    let rPart = numberToHexPart(r);
    let gPart = numberToHexPart(g);
    let bPart = numberToHexPart(b);

    if (rPart != null || gPart != null || bPart != null) return "#" + rPart + gPart + bPart;
}

function hexToRgba(hex, opacity = 1) {
    let color;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        color = hex.substring(1).split("");
        opacity = parseInt(opacity) <= 1 ? opacity : 1;
        if (color.length == 3) {
            color = [color[0], color[0], color[1], color[1], color[2], color[2]];
        }
        color = "0x" + color.join("");
        return "rgba(" + [(color >> 16) & 255, (color >> 8) & 255, color & 255].join(",") + "," + opacity + ")";
    }
    else return null;
}

function uncallEmergencyAlert() {
    $("#TopStatusNavbar_Box").css("top", "-1200px");
    setTimeout(function () {
        $("#TopStatusNavbar_Box").remove();
    }, 350);
}

function callEmergencyAlert(backgroundColor_Hex, foregroundColor_Hex, icon, header, description, duration_InSec = 0) {
    if ((header != null || header != undefined) && (description != undefined || description != null)) {
        let foregroundColor = "#2b2b2b";
        let rgbaBgColor = "rgba(248, 249, 250, 0.35)";
        let checkAlertAvailability = document.getElementById("TopStatusNavbar_Box");

        if (checkAlertAvailability == null) {
            $("body").append('<div class="top-status-navbar shadow-sm" id="TopStatusNavbar_Box"> <div class="hstack gap-2"> <h2 class="h2" id="TSN_Icon_Lbl"></h2> <div class="ms-2"> <span class="h6" id="TSN_Header_Lbl"></span> <br/> <small class="card-text" id="TSN_Description_Span"></small> </div> </div> </div>');
            $("#TopStatusNavbar_Box").fadeIn(0);
        }
        else $("#TopStatusNavbar_Box").css("top", "-1200px");

        if (icon != null || icon != undefined) $("#TSN_Icon_Lbl").html(icon);
        else $("#TSN_Icon_Lbl").html(' <i class="fa-regular fa-lightbulb"></i> ');
        $("#TSN_Header_Lbl").html(header);
        $("#TSN_Description_Span").html(description);

        if ((backgroundColor_Hex != null || backgroundColor_Hex != undefined) && backgroundColor_Hex[0] == "#") {
            rgbaBgColor = hexToRgba(backgroundColor_Hex, 0.8);
        }
        if ((foregroundColor_Hex != null || foregroundColor_Hex != undefined) && foregroundColor_Hex[0] == "#") foregroundColor = foregroundColor_Hex;
        $(".top-status-navbar").css("color", foregroundColor);
        $(".top-status-navbar").css("background-color", rgbaBgColor);

        setTimeout(function () {
            $("#TopStatusNavbar_Box").css("top", 0);
        }, 350);

        if (parseInt(duration_InSec) > 0) {
            timeoutValue = setTimeout(function () {
                uncallEmergencyAlert();
                clearTimeout(timeoutValue);
            }, duration_InSec * 1000);
        }
    }
}

function swapToDefaultMode() {
    if (defaultFormAction != null && defaultFormId != null) {
        $("#MainBottom_TextBoxPageAdditional_Box").slideUp(250);
        setTimeout(function () {
            $("#TextBox_Icon_Span").html(null);
            $("#TextBox_Reason_Span").html(null);
            $("#TextBox_ActionDescription_Span").html(null);
        }, 300);

        $(".bottom-navbar-text-form").attr("id", defaultFormId);
        $(".bottom-navbar-text-form").attr("action", defaultFormAction);
        if (defaultAdditionalInputs != null) {
            $("#MainBottom_AdditionalInputs_Box").empty();
            $("#MainBottom_AdditionalInputs_Box").html(defaultAdditionalInputs);
        }

        if (defaultInputPlaceholder != null) $(".form-control-bar-standard").attr("placeholder", defaultInputPlaceholder);
        if (defaultSubmitBtnClasses.length > 0) $(".btn-bottom-navbar-form-control").addClass(defaultSubmitBtnClasses);
        if (defaultSubmitBtnHtml != null) $(".btn-bottom-navbar-form-control").html(defaultSubmitBtnHtml);
        else $(".btn-bottom-navbar-form-control").html(' <i class="fa-solid fa-arrow-up"></i> ');
    }
}

let defaultInput = null;
let defaultFormId = null;
let defaultFormAction = null;
let defaultAdditionalInputs = null;
let defaultSubmitBtnHtml = null;
let defaultSubmitBtnClasses = null;
let defaultInputPlaceholder = null;
//user page change
//bot navbar height change -> padding-bottom change
//user-info

function swapToEditMode(type = 0, editing_Message_Text) {
    if (editing_Message_Text != null || editing_Message_Text != undefined) {
        //types: 0 - Legacy Chat Message; 1 - Track Comment; 2 - Track Recomment;
        defaultFormId = $(".bottom-navbar-text-form").attr("id");
        defaultFormAction = $(".bottom-navbar-text-form").attr("action");
        defaultAdditionalInputs = $("#MainBottom_AdditionalInputs_Box").html();
        defaultSubmitBtnHtml = $(".btn-bottom-navbar-form-control").html();
        defaultInputPlaceholder = $(".form-control-bar-standard").attr("placeholder");
        defaultSubmitBtnClasses = document.getElementsByClassName("btn-bottom-navbar-form-control")[0].className;

        $("#TextBox_Icon_Span").html(' <i class="fa-solid fa-pencil"></i> ');
        switch (parseInt(type)) {
            case 0:
                $("#TextBox_ActionDescription_Span").html('Edit Message');
                break;
            case 1:
                bottomNavbarTextFormCustomization("/Comment/Edit", "EditTrackComment_Form", "EditTrackComment_Text_Val", "Text", "EditTrackComment_SbmtBtn", ["Id"], [0], ["EditTrackComment_Id_Val"], ["form-control", "form-control-bar-standard", "form-control-bottom-navbar", "form-control-guard"], ["data-min-length", "maxlength", "data-on-fulfill"], [1, 1500, "EditTrackComment_SbmtBtn"], "Edit your comment...", ' <i class="fa-solid fa-check-double"></i> ', ["btn-standard"]);
                $(".form-control-bar-standard").val(editing_Message_Text);
                $("#TextBox_ActionDescription_Span").html('Edit Comment');
                break;
            case 2:
                bottomNavbarTextFormCustomization("/Comment/EditReply", "EditTrackRecomment_Form", "EditTrackRecomment_Text_Val", "Text", "EditTrackRecomment_SbmtBtn", ["Id"], [0], ["EditTrackRecomment_Id_Val"], ["form-control", "form-control-bar-standard", "form-control-bottom-navbar", "form-control-guard"], ["data-min-length", "maxlength", "data-on-fulfill"], [1, 750, "EditTrackRecomment_SbmtBtn"], "Edit your reply...", ' <i class="fa-solid fa-check-double"></i> ', ["btn-standard"]);
                $(".form-control-bar-standard").val(editing_Message_Text);
                $("#TextBox_ActionDescription_Span").html('Edit Comment');
            default:
                $(".form-control-bar-standard").val(editing_Message_Text);
                $("#TextBox_ActionDescription_Span").html('Edit Comment Reply');
                break;
        }
        $("#TextBox_Reason_Span").html(editing_Message_Text);

        swapToTextBoxNavbar();
        setTimeout(function () {
            $("#MainBottom_TextBoxPageAdditional_Box").slideDown(250);
        }, 150);
    }
}

function swapToReplyMode(replyTo_Message_Text, replyingToMessage = true) {
    if (replyTo_Message_Text != null || replyTo_Message_Text != undefined) {
        defaultFormId = $(".bottom-navbar-text-form").attr("id");
        defaultFormAction = $(".bottom-navbar-text-form").attr("action");
        defaultAdditionalInputs = $("#MainBottom_AdditionalInputs_Box").html();
        defaultSubmitBtnHtml = $(".btn-bottom-navbar-form-control").html();
        defaultInputPlaceholder = $(".form-control-bar-standard").attr("placeholder");
        defaultSubmitBtnClasses = document.getElementsByClassName("btn-bottom-navbar-form-control")[0].className;

        $("#TextBox_Icon_Span").html(' <i class="fa-solid fa-reply"></i> ');
        if (replyingToMessage) {
            $("#TextBox_ActionDescription_Span").html('Reply to Message');
        }
        else {
            bottomNavbarTextFormCustomization("/Comment/Reply", "ReplyToTrackComment_Form", "RTC_Text_Val", "Text", "RTC_SbmtBtn", ["TrackCommentId"], [0], ["RTC_TrackCommentId_Val"], ["form-control", "form-control-bar-standard", "form-control-bottom-navbar", "form-control-guard"], ["data-min-length", "maxlength", "data-on-fulfill"], [1, 750, "RTC_SbmtBtn"], "Enter your reply...", null, ["btn-standard"]);
            $("#TextBox_ActionDescription_Span").html('Reply to Comment');
        }
        $("#TextBox_Reason_Span").html(replyTo_Message_Text);

        swapToTextBoxNavbar();
        setTimeout(function () {
            $("#MainBottom_TextBoxPageAdditional_Box").slideDown(250);
        }, 150);
    }
}

$(document).on("mousedown", ".btn-edit-track-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let thisMessageText = $("#" + trueId + "-CommentContent_Span").html();
        if (thisMessageText != undefined) {
            swapToEditMode(thisMessageText, false);
            $("#EditTrackComment_Id_Val").val(trueId);
            slideBoxes(false, "Replies_Box", "Comments_Box");
        }
    }
});

$(document).on("mousedown", ".btn-edit-track-recomment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let thisReplyText = $("#" + trueId + "-RecommentContent_Span").html();
        if (thisReplyText != undefined) {
            swapToEditMode(2, thisReplyText);
            $("#EditTrackRecomment_Id_Val").val(trueId);
        }
    }
});

$(document).on("mousedown", ".btn-reply-to-track-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let currentId = $("#GetTrackRecomments_Id_Val").val();
        if (currentId != trueId) {
            $("#GetTrackRecomments_Id_Val").val(trueId);
            $("#GetTrackRecomments_Form").submit();
        }
        else {
            let thisCommentContent = $("#" + trueId + "-CommentContent_Span").html();
            if (thisCommentContent != undefined) {
                swapToReplyMode(thisCommentContent, false);
                slideBoxes(false, "Comments_Box", "Replies_Box");
            }
        }
    }
});

$(document).on("mousedown", ".btn-pin-comment", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#PinComment_Id_Val").val(trueId);
        $("#PinComment_Form").submit();
    }
});

$(document).on("mousedown", ".btn-unpin-comment", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#UnpinComment_Id_Val").val(trueId);
        $("#UnpinComment_Form").submit();
    }
});

$(document).on("mousedown", ".btn-like-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#LikeTheComment_Id_Val").val(trueId);
        $("#LikeTheComment_Form").submit();
    }
});

$(document).on("mousedown", ".btn-unlike-comment", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#UnlikeTheComment_Id_Val").val(trueId);
        $("#UnlikeTheComment_Form").submit();
    }
});

$(document).on("mousedown", ".btn-pre-delete-track-comment", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        callAProposal('<i class="fa-regular fa-trash-can text-danger"></i>', "Delete Comment", "Are you sure you want to delete this comment?", "Yes, Certainly", ["btn-delete-track-comment"], ["id"], [trueId + "-DeleteTrackComment"], false, null, 15);
    }
});
$(document).on("mousedown", ".btn-pre-delete-track-recomment", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        callAProposal('<i class="fa-regular fa-trash-can text-danger"></i>', "Delete Reply", "Are you sure you want to delete this comment reply?", "Yes, Certainly", ["btn-delete-track-recomment"], ["id"], [trueId + "-DeleteTrackRecomment"], false, null, 15);
    }
});

$(document).on("mousedown", ".btn-delete-track-comment", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#DeleteTrackComment_Id_Val").val(trueId);
        $("#DeleteTrackComment_Form").submit();
    }
});
$(document).on("mousedown", ".btn-delete-track-recomment", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#DeleteTrackRecomment_Id_Val").val(trueId);
        $("#DeleteTrackRecomment_Form").submit();
    }
});

$(document).on("mousedown", ".btn-cancel-text-box-modes", function () {
    swapToDefaultMode();
});
$(document).on("mousedown", ".btn-swap-to-standard-navbar", function () {
    swapToRegularNavbar();
});
$(document).on("mousedown", ".btn-swap-to-textbox-navbar", function () {
    swapToTextBoxNavbar();
});

$(document).on("mousedown", ".btn-create-new-poll", function () {
    let isReady = createInsideLgCard('CreatePoll', 'New Poll', '<div> <form method="post" action="/Poll/Create" id="CreatePoll_Form"> <div> <div class="d-none" id="PollMisc_Box"> <input type="hidden" name="IsAnonym" id="IsAnonym_Val" value="false" /> <input type="hidden" name="DurationInMinutes" id="PollDuration_Val" value="1440" /> <input type="hidden" name="IsSkippable" id="IsSkippable_Val" value="false" /> <input type="hidden" name="MaxChoicesQty" id="PollMaxOptions_Val" value="1" /> <input type="hidden" name="NecessaryVoicesQty" id="PollMaxVotesQty_Val" value="-1" /> </div> <textarea class="form-textarea form-control form-control-guard min-height-150" name="Question" id="CreatePoll_Question_Val" placeholder="Ask a question..." data-min-length="1" maxlength="140"></textarea> </div> <div class="mt-2" id="PollOptionDesign_Box"> <input type="hidden" id="PollOption_Box_MinVal" value="1" /> <input type="hidden" id="PollOption_Box_Val" value="1" /> <input type="hidden" id="PollOption_Box_MaxVal" value="6" /> <div class="hstack gap-2 mt-2" id="0-PollOption_Box"> <input type="text" class="form-control form-control-guard" name="Options" id="0-CreatePoll_Option_Val" placeholder="Add Option 1" maxlength="45" /> </div> <div class="hstack gap-2 mt-2" id="1-PollOption_Box"> <input type="text" class="form-control form-control-guard" name="Options" id="1-CreatePoll_Option_Val" placeholder="Add Option 2" maxlength="45" /> <button type="button" class="btn btn-standard-rounded btn-delete-created-item btn-sm super-disabled" id="PollOption_Box-DeleteItem_Btn"> <i class="fa-solid fa-xmark"></i> </button> </div> </div> </form> </div> </div> <div class="box-sticky-bottom x-row-sliding-only-box shadow-sm"> <button type="button" class="btn btn-standard btn-horizontally-scrolling btn-create-new-item btn-sm me-2" id="PollOption_Box-CreateNew_Btn" data-parent="PollOptionDesign_Box" data-placeholder="Add Option"> <i class="fa-solid fa-plus"></i> Add Option</button> <button type="button" class="btn btn-standard btn-horizontally-scrolling btn-call-select btn-sm me-2" id="PollMaxOptions-Select_Btn" data-unique="select-poll-options" data-values="1,2,3,4,5,6" data-text="1,2,3,4,5,6"> <i class="fa-solid fa-list-check"></i> Options ∙ <span class="text-muted" id="PollMaxOptions_Span">1</span></button> <button type="button" class="btn btn-standard btn-horizontally-scrolling btn-call-duration-select btn-sm me-2" id="PollDuration-Select_Btn" data-type="0"> <i class="fa-regular fa-clock"></i> Duration ∙ <span class="text-muted" id="PollDuration_Span">1 day</span></button> <button type="button" class="btn btn-standard btn-horizontally-scrolling btn-call-unlim-number-slider btn-sm me-2" id="PollMaxVotesQty-Select_Btn" data-min="0" data-max="1000000" data-step="10" data-header="Vote Limit"> <i class="fa-solid fa-bars-progress"></i> Max Votes ∙ <span class="text-muted" id="PollMaxVotesQty_Span"> <i class="fa-solid fa-infinity"></i> </span></button> <button type="button" class="btn btn-standard btn-horizontally-scrolling btn-switcher btn-sm me-2" data-value="IsAnonym_Val" data-tt="On" data-ft="Off"> <i class="fa-solid fa-masks-theater"></i> Anonym Poll ∙ <span class="text-muted" id="IsAnonym_Val_Span">Off</span></button> <button type="button" class="btn btn-standard btn-horizontally-scrolling btn-switcher btn-sm me-2" data-value="IsSkippable_Val" data-tt="Yes" data-ft="No"> <i class="fa-solid fa-angles-right"></i> Skippable Poll ∙ <span class="text-muted" id="IsSkippable_Val_Span">No</span></button> </div>', '<button type="button" class="btn btn-standard btn-close-inside-lg-card btn-sm" id="CreatePoll_Container-Close_Btn"> <i class="fa-solid fa-xmark"></i> Cancel</button>', '<div class="dropdown ms-auto"> <button type="button" class="btn btn-standard btn-sm" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-check"></i> Save</button> <ul class="dropdown-menu shadow-sm"> <li><button type="button" class="dropdown-item btn-distance-submitter active bg-transparent text-dark" data-form="CreatePoll_Form" id="CreatePost_Form-DistantSbmt_Btn"> <i class="fa-solid fa-check-double"></i> Save Now</button></li> <li><button type="button" class="dropdown-item btn-distance-submitter super-disabled"> <i class="fa-solid fa-clock"></i> Delayed Poll</button></li> </ul> </div>');
    if (isReady) {
        setTimeout(function () {
            callInsideLgContainer(false, "CreatePoll_Container", false);
        }, 150);
    }
});

$(document).on("mousedown", ".btn-create-new-album", function () {
    //Remastered
    let isReady = createInsideLgCard('CreateAlbum', 'New Album', '<div class="mt-3"> <form method="post" action="/Album/Create" id="CreateNewAlbum_Form"> <div class="box-standard box-add-album" id="0-AlbumMetadata_Box"> <div class="box-backgrounded text-center p-2"> <div class="hstack gap-2"> <button type="button" class="btn btn-standard"> <i class="fa-solid fa-ellipsis"></i> </button> <h2 class="h2 ms-auto text-center"> <i class="fa-solid fa-compact-disc"></i> </h2> <button type="button" class="btn btn-standard btn-tooltip ms-auto" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" data-bs-title="Album – a full-length release, usually 6+ tracks<br/>EP – a shorter release, typically 2 to 6"> <i class="fa-regular fa-circle-question"></i> </button> </div> <h4 class="h4">New Album</h4> <small class="card-text text-muted"> Create a new album to organize and share your tracks. Add a title, description, cover image and some other metadatas to get started </small> </div> <div> <button type="button" class="btn btn-standard btn-tooltip ms-auto btn-sm float-end ms-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" data-bs-title="Prohibited characters: \ / : * <> ? | # % & { } $ ! @@ + ; ="> <i class="fa-regular fa-circle-question"></i> </button> <label class="form-label fw-500 ms-1" for="CNA_Title_Val">Title</label> <input type="text" class="form-control form-control-guard form-control-for-characters-only" id="CNA_Title_Val" name="Title" placeholder="Enter the title of your album" maxlength="100" data-min-length="1" data-update="CNA_AlbumTitle_Span" data-base-value="Album Title" /> </div> <div class="ms-1 mt-1"> <small class="card-text text-muted">Album titles cannot contain some special characters. Tap the question button to display them</small> </div> <div class="mt-3"> <button type="button" class="btn btn-standard btn-sm float-end ms-1" id="CNA_Description_Val-Indicator_Span">0/1500</button> <label class="form-label fw-500 ms-1" for="CNA_Description_Val">Description</label> <textarea class="form-control form-textarea form-control-guard" id="CNA_Description_Val" name="Description" placeholder="Set some description for your album (optional)" maxlength="1500" rows="1"></textarea> </div> <div class="ms-1 mt-1"> <small class="card-text text-muted">Description is optional. You may leave this field empty</small> </div> <div class="mt-3"> <div> <input type="hidden" name="GenreId" id="CNA_GenreId_Val" value="0" /> <label class="form-label fw-500 ms-1">Genre</label> <button type="button" class="btn btn-select-primary-skin" id="CNA_GetGenres_Btn"><span class="card-text" id="CNA_MainGenre_Span">Unknown</span> <span class="float-end text-muted ms-1"> <i class="fa-solid fa-angle-down"></i> </span></button> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Select the primary genre of your album</small> </div> </div> <div class="box-standard box-add-album" id="1-AlbumMetadata_Box" style="display: none;"> <div class="box-standard text-center"> <div class="box-backgrounded p-2"> <h2 class="h2"> <i class="fa-solid fa-barcode"></i> </h2> <h4 class="h4">UPC Code</h4> <small class="card-text text-muted">Universal Product Code — a unique identifier for your album, used for sales tracking and distribution. Usually contains 12 digits</small> </div> <div class="box-code-digit-parent text-center mx-auto mt-2"> <input type="hidden" name="UPC_Code" id="CNA_UPC_Code_Val" /> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="0-CNA_UPC_Code_Val" placeholder="1" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="1-CNA_UPC_Code_Val" placeholder="2" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="2-CNA_UPC_Code_Val" placeholder="3" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="3-CNA_UPC_Code_Val" placeholder="4" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="4-CNA_UPC_Code_Val" placeholder="5" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="5-CNA_UPC_Code_Val" placeholder="6" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="6-CNA_UPC_Code_Val" placeholder="7" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="7-CNA_UPC_Code_Val" placeholder="8" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="8-CNA_UPC_Code_Val" placeholder="9" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="9-CNA_UPC_Code_Val" placeholder="10" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="10-CNA_UPC_Code_Val" placeholder="11" maxlength="1" /> </div> <div class="box-code-digit"> <input type="text" class="form-control form-control-invisible" id="11-CNA_UPC_Code_Val" placeholder="12" maxlength="1" /> </div> </div> <div class="mt-2"> <small class="card-text text-muted">Do not have a UPC code? You can skip this step</small> </div> </div> </div> <div class="box-standard box-add-album" id="2-AlbumMetadata_Box" style="display: none;"> <div class="box-backgrounded text-center p-2"> <h2 class="h2"> <i class="fa-regular fa-image"></i> </h2> <h4 class="h4">Almost There</h4> <small class="card-text text-muted">Add your cover image, choose a release date, and set a few last options</small> </div> <div class="box-standard mt-2"> <div class="d-none"> <input type="file" name="CoverImageFile" id="CNA_CoverImageFile_Val" data-preview="CNA_CoverImageUrl_Example_Val_Img" accept=".png, .jpg, .jpeg" /> </div> <div class="hstack gap-2"> <div> <img src="#" class="track-album-release-img" id="CNA_CoverImageUrl_Example_Val_Img" style="display: none;" /> <div class="track-album-release-box" id="CNA_CoverImageUrl_Example_Val_Img_Box"> <i class="fa-solid fa-compact-disc"></i> </div> </div> <div class="ms-1"> <small class="card-text text-muted"><span class="card-text" id="CNA_ReleaseType_Span">Album</span> ∙ <span class="card-text CNA_Version_Val_Span" id="CNA_ReleaseVersion_Span">Regular</span></small> <br/> <span class="h4" id="CNA_AlbumTitle_Span">Album Title</span> <br/> <small class="card-text"><span class="card-text cna-release-date-span" id="CNA_ReleaseInfo_Span">Unknown date</span> ∙ <span class="card-text" id="CNA_TracksQty_Span">Unknown tracks qty</span> (Preview)</small> <div class="mt-1"> <button type="button" class="btn btn-standard-bolded btn-delete-preview-image btn-input-file-emptier btn-sm text-danger super-disabled me-1" id="CNA_CoverImageUrl_Example_Val_Img-DeletePreviewImg_Btn" data-target="CNA_CoverImageFile_Val"> <i class="fa-solid fa-xmark"></i> </button> <button type="button" class="btn btn-standard-bolded btn-upload-image btn-sm" id="CNA_CoverImageFile_Val-UploadImg_Btn"> <i class="fa-solid fa-paperclip"></i> Upload Cover</button> </div> </div> </div> <div class="mt-3"> <button type="button" class="btn btn-standard btn-tooltip ms-auto btn-sm float-end ms-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" data-bs-title="Albums set for the future will be marked as “Premiere” and hidden until release day. You can give early access to specific users you choose"> <i class="fa-regular fa-circle-question"></i> </button> <label class="form-label ms-1" id="CNA_ReleaseDate_Lbl">Release Date</label> <button type="button" class="btn btn-select-primary-skin btn-select-date" id="CNA_ReleaseDate_Call_Btn" data-display="cna-release-date-span" data-result="CNA_ReleaseDate_Val"><span class="cna-release-date-span" id="CNA_ReleaseDate_Result_Span">Unknown</span> <span class="float-end text-muted ms-1"> <i class="fa-regular fa-clock"></i> </span></button> </div> <div class="mt-1 ms-1"> <input type="hidden" name="PremieredAt" id="CNA_ReleaseDate_Val" /> <small class="card-text text-muted">Choose when your album will be released (premiere date).</small> </div> <div class="mt-3"> <label class="form-label fw-500 ms-1">Version</label> <button type="button" class="btn btn-select-primary-skin btn-select-primary" id="CNA_Version_Val-Select_Btn" data-val="0" data-class="cna-version" data-unique-id="CNA_Version" data-texts="Regular,Remastered,Deluxe,Extended,Anniversary,Live,Instrumental,Re-release,Explicit,Clean,Special Edition"><span class="CNA_Version_Val_Span" id="CNA_Version_Val_Span">Regular</span> <span class="float-end text-muted ms-1"> <i class="fa-solid fa-angle-down"></i> </span></button> <div class="mt-1 ms-1"> <input type="hidden" name="Version" id="CNA_Version_Val" value="0" /> <small class="card-text text-muted ">Specify the version of your album (default: Regular)</small> </div> </div> <div class="mt-3"> <div class="form-check form-switch ms-1"> <input class="form-check-input" type="checkbox" id="CNA_IsExplicit_Val" value="false" /> <label class="form-check-label fw-500" for="CNA_IsExplicit_Val">Explicit Content</label> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Contains tracks with explicit content</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-rounded btn-classic-styled text-center w-100" id="CreateAlbum_SbmtBtn">Save and Proceed</button> </div> </div> </div> <div class="box-standard sticky-bottom mt-3 pb-2"> <div class="row"> <div class="col col-2"> <button type="button" class="btn btn-standard-rounded btn-swipe-box-indicator text-center text-muted w-100"><span class="card-text" id="PageQty-AlbumMetadata_Box_Span">1</span>/3</button> </div> <div class="col"> <button type="button" class="btn btn-standard-rounded btn-swipe-prev-box btn-box-add-album bg-chosen-bright text-center super-disabled w-100" title="Go to prev part" data-class="box-add-album" data-step="0" id="Prev-AlbumMetadata_Box">Prev Step</button> </div> <div class="col"> <button type="button" class="btn btn-standard-rounded btn-swipe-next-box btn-box-add-album bg-chosen-bright text-center w-100" title="Go to next part" data-class="box-add-album" data-step="0" id="Next-AlbumMetadata_Box">Next Step</button> </div> </div> </div> </form> </div>');
    if (isReady) {
        setTimeout(function () {
            callInsideLgContainer(false, "CreateAlbum_Container", false);
        }, 150);
    }
});

$(document).on("mousedown", ".btn-upload-image", function () {
    let trueId = getTrueId($(this).attr("id"), false);//input[type"file"
    if (trueId != undefined) {
        $("#" + trueId).click();
    }
});

function bottomNavbarTextFormCustomization(formActionUrl, formId, formInputId = null, formInputName = null, formSubmitButtonId = null, formNewInputNames = [], formNewInputValues = [], formNewIds = [], formInputClasses = [], formInputAttributes = [], formInputAttributeValues = [], formInputPlaceholderText = null, formSubmitButtonHtml = null, formSubmitButtonClasses = []) {
    if ((formId != null || formId != undefined) && (formActionUrl != null || formActionUrl != undefined)) {
        let newInput = null;
        let newButton = null;

        $(".bottom-navbar-text-form").attr("id", formId);
        $(".bottom-navbar-text-form").attr("action", formActionUrl);
        if (formInputId != null) {
            newInput = $("<input type='text' class='form-control form-control-bar-standard form-control-bottom-navbar' />");
            if (formInputAttributes.length > 0 && formInputAttributeValues.length > 0) {
                for (let i = 0; i < formInputAttributes.length; i++) {
                    newInput.attr(formInputAttributes[i], formInputAttributeValues[i]);
                }
            }
            newInput.attr("id", formInputId);
        }

        if (formInputClasses.length > 0 && newInput != null) {
            for (let i = 0; i < formInputClasses.length; i++) {
                newInput.addClass(formInputClasses[i]);
            }
        }

        if (formInputPlaceholderText != null || formInputPlaceholderText != undefined) newInput.attr("placeholder", formInputPlaceholderText);
        else newInput.attr("placeholder", "Comment text...");

        if (formSubmitButtonClasses.length > 0) {
            newButton = elementDesigner("button", "btn btn-standard-rounded btn-bottom-navbar-form-control", ' <i class="fa-solid fa-arrow-up"></i> ');
            $(".btn-bottom-navbar-form-control").remove();
            $("#MainBottom_TextBoxButton_Box").append(newButton);
            for (let i = 0; i < formSubmitButtonClasses.length; i++) {
                newButton.addClass(formSubmitButtonClasses[i]);
            }
        }

        if (formNewInputNames.length > 0 && formNewIds.length > 0 && formNewInputValues.length > 0) {
            $("#MainBottom_AdditionalInputs_Box").empty();
            for (let i = 0; i < formNewInputNames.length; i++) {
                let newAdditionalInput = $("<input type='hidden' />");
                newAdditionalInput.attr("name", formNewInputNames[i]);
                if (formNewIds[i] != null || formNewIds[i] != undefined) newAdditionalInput.attr("id", formNewIds[i]);
                if (formNewInputValues[i] != null || formNewInputValues[i] != undefined) newAdditionalInput.attr("value", formNewInputValues[i]);
                $("#MainBottom_AdditionalInputs_Box").append(newAdditionalInput);
            }
        }

        if (newInput != null && (formInputName != null || formInputName != undefined)) {
            newInput.attr("name", formInputName);
            $("#MainBottom_TextBoxInput_Box").empty();
            $("#MainBottom_TextBoxInput_Box").append(newInput);
        }

        if (formSubmitButtonId != null || formSubmitButtonId != undefined) $(".btn-bottom-navbar-form-control").attr("id", formSubmitButtonId);

        if (formSubmitButtonHtml != null || formSubmitButtonHtml != undefined) $(".btn-bottom-navbar-form-control").html(formSubmitButtonHtml);
        else $(".btn-bottom-navbar-form-control").html(' <i class="fa-solid fa-arrow-up"></i> ');
    } 
} 

function swapToTextBoxNavbar() {
    $(".navbar-main-page").addClass("re-transformed");
    $(".navbar-aux-page").addClass("re-transformed");
    $(".navbar-main-page").fadeOut(300);
    $(".navbar-aux-page").fadeOut(300);
    setTimeout(function () {
        $("#MainBottom_TextBoxPage_Box").fadeIn(0);
        $("#MainBottom_TextBoxPage_Box").removeClass("re-transformed");
    }, 300);
}

function swapToCustomNavbar(navbarChildren_Id) {
    $(".navbar-main-page").addClass("re-transformed");
    $(".navbar-aux-page").addClass("re-transformed");
    $(".navbar-main-page").fadeOut(300);
    $(".navbar-aux-page").fadeOut(300);
    setTimeout(function () {
        $("#" + navbarChildren_Id).fadeIn(0);
        $("#" + navbarChildren_Id).removeClass("re-transformed");
    }, 300);
}

function swapToRegularNavbar() {
    $(".navbar-main-page").addClass("re-transformed");
    $(".navbar-aux-page").addClass("re-transformed");
    $(".navbar-main-page").fadeOut(300);
    $(".navbar-aux-page").fadeOut(300);
    setTimeout(function () {
        $("#MainBottomNavbar_MainPage_Box").fadeIn(0);
        $("#MainBottomNavbar_MainPage_Box").removeClass("re-transformed");
    }, 300);
}

$(document).on("mousedown", ".btn-submit-the-search", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let checkForm = document.getElementById(trueId);
        if (checkForm != null) $("#" + trueId).submit();
    }
});

$(document).on("mousedown", ".btn-create-container", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        switch (trueId) {
            case "Search_Container":
                createHeadlessContainer("Search", '<div class="hstack gap-1 mt-1"> <div class="box-standard"> <button type="button" class="btn btn-standard-bolded btn-tooltip btn-sm" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Search settings"> <i class="fa-solid fa-sliders"></i> </button> </div> <div class="w-100"> <form class="search-form" method="get" action="/Search/Find" data-keyword="MainSearch" id="FindOnSearch_Form"> <div class="form-control-search-container w-100"> <span class="card-text text-muted"> <i class="fa-solid fa-magnifying-glass"></i> </span> <input type="text" class="form-control form-control-search form-control-guard" data-keyword="MainSearch" id="FindOnSearch_Form-Keyword_Val" name="Keyword" data-min-length="1" data-target="SubmitSearch_Btn" placeholder="What are we looking for..." maxlength="150" /> </div> </form> </div> <button type="button" class="btn btn-standard-bolded btn-submit-the-search btn-sm super-disabled text-primary ms-auto" id="SubmitSearch_Btn" data-keyword="MainSearch">Search</button> </div> <div class="box-top-hidden x-row-sliding-only-box" id="SearchFilters_Box"> <button type="button" class="btn btn-filter btn-form-filter btn-sm" id="SearchFormFilter_Btn-0" data-keyword="MainSearch">All</button> <button type="button" class="btn btn-filter btn-form-filter btn-sm" id="SearchFormFilter_Btn-1" data-keyword="MainSearch">Artists</button> <button type="button" class="btn btn-filter btn-form-filter btn-sm" id="SearchFormFilter_Btn-2" data-keyword="MainSearch">Playlists</button> <button type="button" class="btn btn-filter btn-form-filter btn-sm" id="SearchFormFilter_Btn-3" data-keyword="MainSearch">Tracks</button> <button type="button" class="btn btn-filter btn-form-filter btn-sm" id="SearchFormFilter_Btn-4" data-keyword="MainSearch">Albums</button> <button type="button" class="btn btn-filter btn-form-filter btn-sm" id="SearchFormFilter_Btn-5" data-keyword="MainSearch">Audiobooks</button> </div>', '<div class="box-standard row mt-5" id="SearchResult_FirstStep_Box"> <div class="col col-6 col-lg-5"> <div class="box-standard" id="BestSearch_Box"> <div class="hstack gap-1"> <h6 class="h6 search-title-label"> <i class="fa-regular fa-star"></i> Best Match</h6> </div> <div class="box-standard" id="BestSearchResult_Box"> </div> </div> </div> <div class="col col-6 col-lg-7"> <div class="box-standard" id="PlaylistsSearch_Box"> <div class="hstack gap-1"> <h6 class="h6 search-title-label">Playlists ∙ <span class="card-text" id="SearchResult_PlaylistsQty_Span"></span> <i class="fa-solid fa-angle-right"></i> </h6> </div> <div class="x-row-sliding-only-box" id="PlaylistsSearchResult_Box"> </div> </div> </div> </div>', true);
                break;
            default:
                break;
        }
    }
});

$(document).on("mousedown", ".btn-form-filter", function () {
    let keyword = $(this).attr("data-keyword");
    let formTypeIndex = getTrueId($(this).attr("id"), true);
    if (formTypeIndex != undefined && keyword != undefined) {
        let neededInputs = [];
        let neededSubmitBtns = [];
        let neededForms = [];
        const allInputs = document.getElementsByClassName("form-control-search");
        const submitBtns = document.getElementsByClassName("btn-submit-the-search");
        const allForms = document.getElementsByClassName("search-form");
        const formActions = ["/Search/FindAll", "/Search/FindArtists", "/Search/FindPlaylists", "/Search/FindTracks", "/Search/FindAlbums", "/Search/FindAudiobooks"];
        const formIds = ["FindAll_Form", "FindArtists_Form", "FindPlaylists_Form", "FindTracks_Form", "FindAlbums_Form", "FindAudiobooks_Form"];
        let currentFormAction = formActions[formTypeIndex];
        let currentFormId = formIds[formTypeIndex];

        if (allForms != null && allForms.length > 0) {
            for (let i = 0; i < allForms.length; i++) {
                if (allForms[i].id != undefined && $("#" + allForms[i].id).attr("data-keyword") == keyword) {
                    neededForms.push(allForms[i].id);
                }
            }
        }
        if (allInputs != null && allInputs.length > 0) {
            for (let i = 0; i < allInputs.length; i++) {
                if (allInputs[i].id != undefined && $("#" + allInputs[i].id).attr("data-keyword") == keyword) {
                    neededInputs.push(allInputs[i].id);
                }
            }
        }
        if (submitBtns != null && submitBtns.length > 0) {
            for (let i = 0; i < submitBtns.length; i++) {
                if (submitBtns[i].id != undefined && $("#" + submitBtns[i].id).attr("data-keyword") == keyword) {
                    neededSubmitBtns.push(submitBtns[i].id);
                }
            }
        }

        if ((currentFormAction != null || currentFormAction != undefined) && (currentFormId != null || currentFormId != undefined)) {
            if (neededInputs.length > 0) {
                for (let i = 0; i < neededInputs.length; i++) {
                    $("#" + neededInputs[i]).attr("data-target", currentFormId + "-SbmtBtn");
                    $("#" + neededInputs[i]).attr("id", currentFormId + "-Keyword_Val");
                }
            }
            if (neededSubmitBtns.length > 0) {
                for (let i = 0; i < neededSubmitBtns.length; i++) {
                    $("#" + neededSubmitBtns[i]).attr("id", currentFormId + "-SbmtBtn");
                }
            }
            if (neededForms.length > 0) {
                for (let i = 0; i < neededForms.length; i++) {
                    $("#" + neededForms[i]).attr("action", currentFormAction);
                    $("#" + neededForms[i]).attr("id", currentFormId);
                }
            }
            $(".btn-form-filter").removeClass("bg-chosen-bright");
            $(this).addClass("bg-chosen-bright");
        }
    }
});

$(document).on("mousedown", ".btn-track-favor-unfavor", function () {
    let id = $(this).attr("data-id");
    if (id != undefined) {
        $("#ARTAF_Id_Val").val(id);
        let status = $(this).attr("data-unfavor");
        if (status == undefined) $("#AddOrRemoveTheTrackAsFavorite_Form").submit();
        else {
            status = status == "true" ? true : false;
            if (status == true) $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/RemoveFromFavorites");
            else $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
            $("#AddOrRemoveTheTrackAsFavorite_Form").submit();
        }
    }
});

$(document).on("dblclick", ".btn-get-playlist-info", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined || trueId != null) {
        if (trueId === "fvr") $("#GetFavorites_Form").submit();
        else {
            trueId = parseInt(trueId);
            if (trueId != undefined) {
                $("#GPI_Id_Val").val(trueId);
                $("#GetPlaylistInfo_Form").submit();
            }
            else $("#GPI_Id_Val").val(0);
        }
    }
});

$(document).on("mousedown", ".btn-get-release-info-as-author", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $("#GSI_Id_Val").val(trueId);
        $("#GSI_IsForAuthor_Val").val(true);
        $("#GetSingleInfo_Form").submit();
    }
});

$("#GetPrivacySettings_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#ProfileUpdatePrivacySettings_SbmtBtn").html();
    buttonDisabler(false, "ProfileUpdatePrivacySettings_SbmtBtn", "Loading Setting...");

    $.get(url, data, function (response) {
        if (response.success) {
            createAContainer("PrivacySettings", "Privacy Settings", '<div> <form method="post" href="/Profile/UpdatePrivacySettings" id="ProfileUpdatePrivacySettings_Form"> <div> <label class="form-label fw-500">Who is able to send you messages?</label> <div class="box-switcher row ms-1 me-1"> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member-active btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="UPS_WhoCanChat_Val" data-value="0" data-description="Everyone can send you messages and receive your replies" id="WhoCanChat-0_Btn">Everyone</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="UPS_WhoCanChat_Val" data-value="1" data-description="Only your subscribers can send you messages and receive your replies" id="WhoCanChat-1_Btn">Subscribers</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="UPS_WhoCanChat_Val" data-value="2" data-description="Only individually by you chosen people will be able to send you messages and receive your replies" id="WhoCanChat-2_Btn">Individual</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="0" data-target="UPS_WhoCanChat_Val" data-value="3" data-description="Your direct messages will remain completely silent" id="WhoCanChat-3_Btn">No One</button> </div> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="UPS_WhoCanChat_Val-Warn">Everyone can send you messages and receive your replies</small> </div> <div class="mt-3"> <div> <label class="form-label fw-500">Who is able to download content from your page?</label> <div class="box-switcher row ms-1 me-1"> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member-active btn-change-the-value btn-sm" data-switcher-internal-id="1" data-target="UPS_WhoCanDownload_Val" data-value="0" data-description="Everyone can save content from your page" id="WhoCanDownload-0_Btn">Everyone</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="1" data-target="UPS_WhoCanDownload_Val" data-value="1" data-description="Only subscribers can save your content" id="WhoCanDownload-1_Btn">Subscribers</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="1" data-target="UPS_WhoCanDownload_Val" data-value="2" data-description="Only individually chosen users can save your content" id="WhoCanDownload-2_Btn">Individual</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="1" data-target="UPS_WhoCanDownload_Val" data-value="3" data-description="No one can save your content" id="WhoCanDownload-3_Btn">No One</button> </div> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="UPS_WhoCanDownload_Val-Warn">Everyone can save content from your page</small> </div> </div> <div class="mt-3"> <div> <label class="form-label fw-500">Who can see your last seen date and time?</label> <div class="box-switcher row ms-1 me-1"> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member-active btn-change-the-value btn-sm" data-switcher-internal-id="2" data-target="UPS_WhoCanSeeLastSeenInfo_Val" data-value="0" data-description="Your last seen date and time are visible to everyone" id="WhoCanSeeLastSeen-0_Btn">Everyone</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="2" data-target="UPS_WhoCanSeeLastSeenInfo_Val" data-value="1" data-description="Only your subscribers can see your last seen date and time" id="WhoCanSeeLastSeen-1_Btn">Subscribers</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="2" data-target="UPS_WhoCanSeeLastSeenInfo_Val" data-value="2" data-description="No one can see your last seen date and time" id="WhoCanSeeLastSeen-2_Btn">No One</button> </div> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="UPS_WhoCanSeeLastSeenInfo_Val-Warn">Your last seen date and time are visible to everyone</small> </div> </div> <div class="mt-3"> <div> <label class="form-label fw-500">Is your account visible?</label> <div class="box-switcher row ms-1 me-1"> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-box-switcher-member-active btn-change-the-value btn-sm" data-switcher-internal-id="3" data-target="UPS_IsVisible_Val" data-value="true" data-description="Your account can be found through a regular user search" id="IsVisible-0_Btn">Standard</button> </div> <div class="col"> <button type="button" class="btn btn-box-switcher-member btn-change-the-value btn-sm" data-switcher-internal-id="3" data-target="UPS_IsVisible_Val" data-value="false" data-description="Your account cannot be found through regular search, but you can still gain new subscribers and users via your special link" id="IsVisible-1_Btn">Hidden</button> </div> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="UPS_IsVisible_Val-Warn">Your account can be found through a regular user search</small> </div> </div> <div class="d-none"> <input type="number" name="WhoCanChat" id="UPS_WhoCanChat_Val" value="0" /> <input type="number" name="WhoCanDownload" id="UPS_WhoCanDownload_Val" value="0" /> <input type="number" name="WhoCanSeeLastSeenInfo" id="UPS_WhoCanSeeLastSeenInfo_Val" value="0" /> <input type="text" name="IsVisible" id="UPS_IsVisible_Val" value="true" /> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled w-100" id="ProfileUpdatePrivacySettings_SbmtBtn">Save Changes</button> </div> </form> </div> </div>', null, null);
            unsetCurrentSwitcherValues("WhoCanChat", 0);
            unsetCurrentSwitcherValues("WhoCanDownload", 1);
            unsetCurrentSwitcherValues("WhoCanSeeLastSeen", 2);
            if (response.result.isVisible) {
                $("#IsVisible-0_Btn").addClass("btn-box-switcher-member-active");
                $("#IsVisible-1_Btn").removeClass("btn-box-switcher-member-active");
            }
            else {
                $("#IsVisible-0_Btn").removeClass("btn-box-switcher-member-active");
                $("#IsVisible-1_Btn").addClass("btn-box-switcher-member-active");
            }
            $("#WhoCanChat-" + response.result.whoCanChat + "_Btn").mousedown();
            $("#WhoCanDownload-" + response.result.whoCanDownload + "_Btn").mousedown();
            $("#WhoCanSeeLastSeen-" + response.result.whoCanSeeLastSeenInfo + "_Btn").mousedown();
            $("#UPS_WhoCanChat_Val").val(response.result.whoCanChat);
            $("#UPS_WhoCanDownload_Val").val(response.result.whoCanDownload);
            $("#UPS_WhoCanSeeLastSeenInfo_Val").val(response.result.whoCanSeeLastSeenInfo);
            $("#UPS_IsVisible_Val").val(response.result.isVisible);

            setTimeout(function () {
                slideContainers(null, "PrivacySettings_Container");
            }, 150);
        }
        else {
            callAlert('<i class="fa-solid fa-shield-halved"></i>', null, null, "Privacy settings are temporarily unavailable", 3.5, "Close", 0, null);
        }
        buttonUndisabler(false, "ProfileUpdatePrivacySettings_SbmtBtn", baseHtml);
    });
});

$(document).on("mousedown", "#PersonalInfo_Container-Open", function () {
    $("#GetAccountPersonalInformation_Form").submit();
});

$(document).on("submit", "#GetCountries_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#GetCountries_SbmtBtn").html();
    buttonDisabler(false, "GetCountries_SbmtBtn", "Loading...");
   
    $.get(url, data, function (response) {
        if (response.success) {
            let countryIdsArr = [];
            let countryNamesArr = [];
            $.each(response.result, function (index) {
                countryIdsArr.push(response.result[index].id);
                countryNamesArr.push(response.result[index].name + "<span class='float-end ms-1'>" + createCountryFlagIcon(response.result[index].shortname, 22, 17) + "</span>");
            });

            callASelect("CountrySelect", "GetCountries_SbmtBtn", "UserCountryInfo_Btn_Span", "EditUserLocaion_Id_Val", "country-select-option", "CountrySelectOption", 0, countryNamesArr, countryIdsArr, true);
        }
        else callAlert('<i class="fa-solid fa-globe"></i>', null, null, "Countries are temporarily unavailable. Please try again later", 3.5, "Close", 0, null);

        buttonUndisabler(false, "GetCountries_SbmtBtn", baseHtml);
    });
});

$(document).on("keyup", ".form-control-juxtaposed", function () {
    let elementTrueId = getTrueId($(this).attr("id"));
    if (elementTrueId != undefined) {
        let maxLength = parseInt($(this).attr("data-counter-maxlength"));
        let resultDisplay = $(this).attr("data-counter-display");
        let updateDisplay = $(this).attr("data-update");
        let baseValue = $(this).attr("data-base-value");
        let dataTarget = $(this).attr("data-target");
        juxtaposedCharsUpdater(elementTrueId, baseValue, updateDisplay);
        juxtaposedCharsCounter(elementTrueId, maxLength, resultDisplay);
        if (dataTarget != undefined) {
            let maxLength = $(this).attr("maxlength");
            let necessaryChars = $(this).attr("data-necessary-chars");
            if (necessaryChars != undefined) necessaryChars = getCommaSeparatedValues(necessaryChars);
            juxtaposedCharsRestrictions(elementTrueId, dataTarget, maxLength, necessaryChars);
        }
    }
});

$(document).on("submit", "#MentionSearch_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = $("#MentionedUsersQty_Span").html();
    $("#MentionedUsersQty_Span").html('<small class="card-text"> <i class="fa-solid fa-spinner fa-spin-pulse"></i> Searching...</small>');

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result.length > 0) {
                let mentionBoxId = $("#MentionSearch_MentionBoxId_Val").val();
                if (mentionBoxId != null || mentionBoxId != undefined) {
                    $("#FoundMentions_Box").empty();
                    $.each(response.result, function (index) {
                        let boxMentionSearchResult = elementDesigner("div", "box-mention-search btn-add-mention", null);
                        let boxMentionSearchInsight = elementDesigner("div", "hstack gap-2", null);
                        let boxMentionSearchInsightInfoBox = elementDesigner("div", "box-standard ms-1", null);
                        let boxMentionAvatar = null;
                        let boxMentionNicknameLbl = elementDesigner("span", "h6", response.result[index].nickname);
                        let boxMentionSearchnameSpan = elementDesigner("small", "card-text text-muted", "@" + response.result[index].searchname);
                        let boxMentionNameSeparator = $("<br/>");

                        if (response.result[index].imgUrl != null) {
                            boxMentionAvatar = $("<img class='profile-avatar-img-md' alt='This image cannot be displayed' />");
                            boxMentionAvatar.attr("src", "/ProfileImages/" + response.result[index].imgUrl);
                        }
                        else boxMentionAvatar = elementDesigner("div", "profile-avatar-md", response.result[index].nickname[0]);

                        boxMentionSearchInsightInfoBox.append(boxMentionNicknameLbl);
                        boxMentionSearchInsightInfoBox.append(boxMentionNameSeparator);
                        boxMentionSearchInsightInfoBox.append(boxMentionSearchnameSpan);
                        boxMentionSearchInsight.append(boxMentionAvatar);
                        boxMentionSearchInsight.append(boxMentionSearchInsightInfoBox);
                        boxMentionSearchResult.append(boxMentionSearchInsight);

                        boxMentionSearchResult.attr("data-text-box", mentionBoxId);
                        boxMentionSearchResult.attr("data-searchname", response.result[index].searchname);
                        boxMentionSearchResult.attr("id", response.result[index].id + "-UserMentionSearch_Box");

                        $("#FoundMentions_Box").append(boxMentionSearchResult);
                    });
                    openInsideBottomBox("FoundMentionsMain_Box");
                }
                else closeInsideBottomBox("FoundMentionsMain_Box");
            }
            else $("#PostMentions_Box").html("You haven't mentioned anyone in your post yet");
        }
        else $("#PostMentions_Box").html("You haven't mentioned anyone in your post yet");
        $("#MentionedUsersQty_Span").html(baseHtml);
    });
});
//btn-select-primary
$(document).on("mousedown", ".btn-add-mention", function () {
    let trueId = getTrueId($(this).attr("id"));
    let textBoxId = $(this).attr("data-text-box");
    let searchname = $(this).attr("data-searchname");
    if (trueId != undefined && searchname != undefined && textBoxId != undefined) {
        applyUserMentionToTextBox(textBoxId, searchname);

        //const mentionedUsersQty = getMentionedUsers(textBoxId, "PostMentions_Box");
        //if (mentionedUsersQty != null) {
        //    $("#MentionedUsersQty_Separator").fadeIn(300);
        //    $("#MentionedUsersQty_Span").text(mentionedUsersQty.length);
        //}
        //else {
        //    $("#MentionedUsersQty_Span").text(0);
        //    $("#MentionedUsersQty_Separator").fadeOut(300);
        //}
        closeInsideBottomBox("FoundMentionsMain_Box");
    }
});

function applyUserMentionToTextBox(textBox_Id, username_or_searchname) {
    if (textBox_Id != null || textBox_Id != undefined) {
        let wholeValue = null;
        let caretStartPosition = 0;
        let wholeNodeValue = null;
        let lastAtIndexBeforeCaret = 0;
        let textBoxElement = $("#" + textBox_Id);
        if (textBoxElement != null) {
            if (textBoxElement.attr("contenteditable")) {
                const selection = window.getSelection();
                let range = selection.getRangeAt(0);
                console.log(range);

                caretStartPosition = selection.focusOffset;
                wholeValue = $("#" + textBox_Id + "_Val").val();
                wholeNodeValue = $("#" + textBox_Id).text();
            }
            else {
                wholeValue = $("#" + textBox_Id).val();
                caretStartPosition = $("#" + textBox_Id).prop("selectionStart");
            }
        }
        console.log(caretStartPosition);
        wholeNodeValue = wholeNodeValue.substring(0, caretStartPosition);
        console.log(wholeNodeValue);
        lastAtIndexBeforeCaret = wholeNodeValue.substring(0, caretStartPosition).lastIndexOf("@", 0);
        console.log(lastAtIndexBeforeCaret);
    }
}

function getMentionedUsers(elementId, appendElementId = null) {
    if (elementId != null || elementId != undefined) {
        let element = $("#" + elementId);
        if (element != null) {
            let fullValue = element.attr("contenteditable") ? $("#" + elementId + "_Val").val() : $("#" + elementId).val();
            if (fullValue != undefined && fullValue.length > 0) {
                let endIndex = 0;
                let mentionedUsersArr = [];
                for (let i = 0; i < fullValue.length; i++) {
                    if (fullValue[i] == "@") {
                        endIndex = fullValue.indexOf("]]", i);
                        mentionedUsersArr.push(fullValue.substring(i, endIndex));
                    }
                }

                if (mentionedUsersArr.length > 0) {
                    if (appendElementId != null || appendElementId != undefined) {
                        $("#" + appendElementId).empty();
                        for (let i = 0; i < mentionedUsersArr.length; i++) {
                            let mentionSpan = elementDesigner("span", "mention-span", mentionedUsersArr[i]);
                            mentionSpan.attr("id", i + "-MentionedUser_Span");
                            $("#" + appendElementId).append(mentionSpan);
                        }
                    }

                    return mentionedUsersArr;
                }
                else {
                    if (appendElementId != null || appendElementId != undefined) $("#" + appendElementId).html("You haven't mentioned anyone in your post yet");
                    return null;
                }
            }
        }
        else return null;
    }
    else return null;
}

$(document).on("keyup", ".form-control-undetermined", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let thisHtml = $(this).html();
        $("#" + thisId + "_Val").val(textPurger(thisHtml));
        $("#" + thisId + "_Val").keyup();
        /*        if (keyCode == 50 && event.shiftKey) {*/
        //@([A-Za-z0-9_]{1,15})
        //(?:^|[^A-Za-z0-9_])@([A-Za-z0-9_]{1,15})

        let searchnameRegex = "@([A-Za-z0-9_]{1,15})";
        let thisValue = $("#" + thisId + "_Val").val();
        let lastAtIndex = thisValue.lastIndexOf("@");
        let valueAfterLastMention = thisValue.substring(lastAtIndex, thisValue.length);

        let currentSearchString = $("#MentionSearch_Searchname_Val").val();
        let matchingSearchnameValue = valueAfterLastMention.match(searchnameRegex);

        if ((matchingSearchnameValue != null) && (currentSearchString.toLowerCase() != matchingSearchnameValue[1].toLowerCase())) {
            clearTimeout(timeoutValue);
            setTimeout(function () {
                $("#MentionSearch_Searchname_Val").val(matchingSearchnameValue[1]);
                $("#MentionSearch_Form").submit();
            }, 500);
        }

        //let mentionedUsersArr = getMentionedUsers(thisId + "_Val", "PostMentions_Box");
        //if (mentionedUsersArr != null) $("#MentionedUsersQty_Span").html("∙ " + mentionedUsersArr.length);
        //slideElements(false, "FoundMentionsMain_Box", "PostMentionsMain_Box");
    }
});

$(document).on("mousedown", ".btn-text-editor", function () {
    const thisId = $(this).attr("id");
    const targetId = $(this).attr("data-target");
    const type = parseInt($(this).attr("data-type"));

    if (thisId != undefined && targetId != undefined && type != undefined) {
        if ($(this).hasClass("bg-chosen-bright")) {
            $(".btn-text-editor").removeClass("bg-chosen-bright");
            textCustomization(targetId, targetId, -1);
        }
        else {
            $(".btn-text-editor").removeClass("bg-chosen-bright");
            $(this).addClass("bg-chosen-bright");
            textCustomization(targetId, targetId, type);
        }
    }
});

function callTextCustomizationBar(texteditorElement_Id) {
    if (texteditorElement_Id != undefined || texteditorElement_Id != null) {
        let attributesComponent = {
            id: ["0-TextEditor", "1-TextEditor", "2-TextEditor", "3-TextEditor", "4-TextEditor", "5-TextEditor", "6-TextEditor", "7-TextEditor", "8-TextEditor", "9-TextEditor"],
            attr: [["data-type", "data-type", "data-type", "data-type", "data-type", "data-type", "data-type", "data-type", "data-type", "data-type"], ["data-target", "data-target", "data-target", "data-target", "data-target", "data-target", "data-target", "data-target", "data-target", "data-target"]],
            attrValue: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id, texteditorElement_Id]]
        }
        callBottomNavbarBox("CustomNavbar_ButtonsBoxPage_Box", [' <i class="fa-solid fa-bold"></i> ', ' <i class="fa-solid fa-italic"></i> ', ' <i class="fa-solid fa-underline"></i> ', ' <i class="fa-solid fa-strikethrough"></i> ', ' <i class="fa-solid fa-indent"></i> ', ' <i class="fa-solid fa-outdent"></i> ', ' <i class="fa-solid fa-list-ul"></i> ', ' <i class="fa-solid fa-list"></i> ', ' <i class="fa-solid fa-list-ol"></i> ', ' <i class="fa-solid fa-border-top-left"></i> '], ["btn-text-editor"], ["Bold-TextEditor", "Italic-TextEditor", "Underline-TextEditor", "Strikethrough-TextEditor", "Indent_TextEditor", "Outdent_TextEditor", "UnorderedList_TextEditor", 'UnorderedSquaredList_TextEditor', 'UnorderedCheckedList_TextEditor', "Quote_TextEditor"], attributesComponent, true);
    }
}

function textCustomization(inputTarget_Id, previewTarget_Id, type) {
    if ((inputTarget_Id != undefined || inputTarget_Id != null) && (previewTarget_Id != undefined || previewTarget_Id != null)) {
        type = parseInt(type);
        let currentText = null;
        let customElement = null;
        let parentCustomElement = null;
        let thisInputElement = $("#" + inputTarget_Id);
        let isContentEditableElement = $("#" + inputTarget_Id).attr("contenteditable");

        if (isContentEditableElement) currentText = $("#" + inputTarget_Id).html();
        else currentText = textPurger($("#" + inputTarget_Id).val());

        let range = null;
        const selection = window.getSelection();
        if (selection.rangeCount) {
            if (selection.anchorOffset != selection.focusOffset) range = selection.getRangeAt(0);
            else {
                if (selection.anchorOffset != currentText.length) {
                    range = selection.getRangeAt(0);
                    let lastChild = thisInputElement[0].lastChild;
                    range.setEnd(lastChild, lastChild.length);
                    selection.removeAllRanges();
                }
                else {
                    range = selection.getRangeAt(0);
                    let lastChild = thisInputElement[0].lastChild;
                    range.setStart(range.startContainer, --range.startOffset);
                    range.setEnd(lastChild, lastChild.length);
                    selection.removeAllRanges();
                }
            }
        }
        else range = null;

        switch (type) {
            case 0:
                customElement = document.createElement("span");
                customElement.classList.add("fw-500");
                break;
            case 1:
                customElement = document.createElement("span");
                customElement.classList.add("fst-italic");
                break;
            case 2:
                customElement = document.createElement("span");
                customElement.classList.add("text-decoration-underline");
                break;
            case 3:
                customElement = document.createElement("span");
                customElement.classList.add("text-decoration-line-through");
                break;
            case 4:
                customElement = document.createElement("span");
                customElement.classList.add("text-indent");
                break;
            case 5:
                customElement = document.createElement("span");
                customElement.classList.add("text-outdent");
                break;
            case 6:
                customElement = document.createElement("li");
                parentCustomElement = document.createElement("ul");
                customElement.classList.add("list-standard");
                parentCustomElement.append(customElement);
                break;
            case 7:
                customElement = document.createElement("li");
                parentCustomElement = document.createElement("ul");
                customElement.classList.add("list-squared");
                parentCustomElement.append(customElement);
                break;
            case 8:
                customElement = document.createElement("li");
                parentCustomElement = document.createElement("ul");
                customElement.classList.add("list-dashed");
                parentCustomElement.append(customElement);
                break;
            case 9:
                customElement = document.createElement("span");
                parentCustomElement = document.createElement("div");
                customElement.classList.add("quote-box");
                parentCustomElement.append(customElement);
                break;
            default:
                customElement = document.createElement("span");
                break;
        }

        if (customElement != null) {
            customElement.append(range.extractContents());
            if (parentCustomElement == null) {
                range.insertNode(customElement);
                range.setStartAfter(customElement);
                range.collapse(true);
            }
            else {
                range.insertNode(parentCustomElement);
                range.setStartAfter(parentCustomElement);
                range.collapse(true);
            }
            selection.removeAllRanges();
            selection.addRange(range);
        }

        currentText = $("#" + inputTarget_Id).html();
        if (isContentEditableElement) {
            $("#" + inputTarget_Id + "_Val").val(textPurger(currentText));
            $("#" + inputTarget_Id + "_Val").keyup();
        }
    }
} 

function openInsideBottomBox(elementId) {
    if (elementId != undefined || elementId != null) {
        let parentElement = $("#" + elementId)[0].parentElement;
        if (parentElement != null) {
            const parentElementHeight = parentElement.offsetHeight;
            $("#" + elementId).fadeIn(0);
            $("#" + elementId).addClass("pending");
            $("#" + elementId).css("max-height", parentElementHeight + "px");
            setTimeout(function () {
                $("#" + elementId).removeClass("pending");
                $("#" + elementId).addClass("active");
            }, 300);
        }
    }
}

function closeInsideBottomBox(elementId) {
    if (elementId != undefined || elementId != null) {
        $("#" + elementId).removeClass("active");
        $("#" + elementId).addClass("pending");
        setTimeout(function () {
            $("#" + elementId).removeClass("pending");
        }, 300);
        setTimeout(function () {
            $("#" + elementId).css("max-height", 0);
            $("#" + elementId).fadeOut(0);
        }, 450);
    }
}

$(document).on("mousedown", ".btn-close-bot-hidden-box", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        closeInsideBottomBox(trueId);
    }
});

function getRichTextBoxCaretPosition(elementId) {
    if (elementId != undefined || elementId != null) {
        const selector = window.getSelection();
        let element = document.getElementById(elementId);
        if (element != null) {
            let caretEndPosition = 0;
            let caretStartPosition = 0;
            if (selector.rangeCount > 0) {
                const range = selector.getRangeAt(0);
                const preRange = range.cloneRange();
                const postRange = range.cloneRange();
                preRange.selectNodeContents(element);
                postRange.selectNodeContents(element);
                preRange.setEnd(range.startContainer, range.startOffset);
                postRange.setEnd(range.endContainer, range.endOffset);

                caretEndPosition = postRange.toString().length;
                caretStartPosition = preRange.toString().length;
            }

            return [caretStartPosition, caretEndPosition];
        }
        else return null;
    }
    else return null;
}

function textPurification(text) {
    if (text != undefined || text != null) {
        text = text.replaceAll("<br>", "\n");
        text = text.replaceAll("<br/>", "\n");
        text = text.replaceAll("[~", "<br/>");
        text = text.replaceAll("{{", "<span>");
        text = text.replaceAll("[[", '<span class="fw-500">');
        text = text.replaceAll("[{", "<span class='fst-italic'>");
        text = text.replaceAll("[_", "<span class='text-decoration-underline'>");
        text = text.replaceAll("[-", "<span class='text-decoration-line-through'>");
        text = text.replaceAll("[#", "<span class='text-user-mention'>");
        text = text.replaceAll("[>", "<p class='text-indent'>");
        text = text.replaceAll("[<", "<p class='text-outdent'>");
        text = text.replaceAll("[|", "<ul><li class='list-squared'>");
        text = text.replaceAll("[%", "<ul><li class='list-standard'>");
        text = text.replaceAll("[&", "<ul><li class='list-dashed'>");
        text = text.replaceAll("[)", "<div class='quote-box'>");
        text = text.replaceAll("(]", "</div>");
        text = text.replaceAll("%]", "</li></ul>");
        text = text.replaceAll("]]", "</span>");
        text = text.replaceAll("<]", "</p>");

        const cleanText = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: ["div", "ul", "li", "p", "span", "br"]
        });
        return cleanText;
    }
    else return null;
}

function textPurger(text) {
    if (text != undefined || text != null) {
        text = text.replaceAll('<span>', "{{");
        text = text.replaceAll('<span class="fw-500">', "[[");
        text = text.replaceAll("<span class='fw-500'>", "[[");
        text = text.replaceAll("<span class='fst-italic'>", "[{");
        text = text.replaceAll('<span class="fst-italic">', "[{");
        text = text.replaceAll("<span class='text-decoration-underline'>", "[_");
        text = text.replaceAll('<span class="text-decoration-underline">', "[_");
        text = text.replaceAll("<span class='text-decoration-line-through'>", "[-");
        text = text.replaceAll('<span class="text-decoration-line-through">', "[-");
        text = text.replaceAll('<span class="text-user-mention">', "[#");
        text = text.replaceAll("<span class='text-user-mention'>", "[#");
        text = text.replaceAll("<p class='text-indent'>", "[>");
        text = text.replaceAll('<p class="text-indent">', "[>");
        text = text.replaceAll("<p class='text-outdent'>", "[<");
        text = text.replaceAll('<p class="text-outdent">', "[<");

        text = text.replaceAll("<ul><li class='list-squared'>", "[|");
        text = text.replaceAll('<ul><li class="list-squared">', "[|");
        text = text.replaceAll("<ul><li class='list-standard'>", "[%");
        text = text.replaceAll('<ul><li class="list-standard">', "[%");
        text = text.replaceAll("<ul><li class='list-dashed'>", "[&");
        text = text.replaceAll('<ul><li class="list-dashed">', "[&");
        text = text.replaceAll("</li></ul>", "%]");

        text = text.replaceAll("</span>", "]]");
        text = text.replaceAll("</p>", "<]");
        text = text.replaceAll("\n", "<br/>");
        text = text.replaceAll("<br/>", "[~");

        return text;
    }
    else return null;
}

function textDiffuser(text) {
    if (text != undefined || text != null) {
        text = text.replaceAll("{{", "");
        text = text.replaceAll("[[", "");
        text = text.replaceAll("[{", "");
        text = text.replaceAll("[_", "");
        text = text.replaceAll("[-", "");
        text = text.replaceAll("[#", "");
        text = text.replaceAll("[>", "");
        text = text.replaceAll("[<", "");
        text = text.replaceAll("[$", "");
        text = text.replaceAll("$]", "");
        text = text.replaceAll("[%", "");
        text = text.replaceAll("%]", "");
        text = text.replaceAll("]]", "");
        text = text.replaceAll("<]", "");
        text = text.replaceAll("<br/>", "\n");
        text = text.replaceAll("[~", "\n");

        return text;
    }
    else return null;
}

function callBottomNavbarBox(parentBox_Id, buttonsHtmlArr = [], buttonClassesArr = [], buttonsIdsArr = [], buttonsAttrsArr = { id: [], attr: [], attrValue: [] }, openOnCreate = false) {
    if (parentBox_Id != null || parentBox_Id != undefined) {
        let divExists = document.getElementById(parentBox_Id);
        if (divExists == null) {
            let parentBox = elementDesigner("div", "box-standard navbar-aux-page re-transformed", null);
            let parentBoxRoomBox = elementDesigner("div", "hstack gap-1", null);
            let parentMenuRoomBox = elementDesigner("div", "bottom-navbar-pagination me-1", null);
            let parentMainRoomBox = elementDesigner("div", "box-standard w-100", null);

            parentBox.fadeOut(0);
            parentBox.attr("id", parentBox_Id);
            parentMainRoomBox.attr("id", parentBox_Id + "-MainRoom_Box");
            parentMenuRoomBox.attr("id", parentBox_Id + "-MenuRoom_Box");

            parentBoxRoomBox.append(parentMenuRoomBox);
            parentBoxRoomBox.append(parentMainRoomBox);
            parentBox.append(parentBoxRoomBox);

            if ((buttonsHtmlArr.length > 0) && (buttonsHtmlArr.length == buttonsIdsArr.length)) {
                let newButton;
                let buttonBox;
                let rowIndex = 0;
                let rowsQty = Math.ceil(buttonsHtmlArr.length / 5);
                let buttonParentBoxSample;
                let buttonParentBoxes = [];

                const closeBtn = elementDesigner("button", "btn btn-bottom-navbar rounded btn-swap-to-standard-navbar btn-sm", ' <i class="fa-solid fa-xmark"></i> ');
                const nextPageBtn = elementDesigner("button", "btn btn-bottom-navbar rounded btn-bottom-navbar-pagination btn-to-next-navbar-page btn-sm", ' <i class="fa-solid fa-angle-right"></i> ');
                const prevPageBtn = elementDesigner("button", "btn btn-bottom-navbar rounded btn-bottom-navbar-pagination btn-to-prev-navbar-page btn-sm super-disabled", ' <i class="fa-solid fa-angle-left"></i> ');

                nextPageBtn.attr("data-page", 0);
                prevPageBtn.attr("data-page", 0);
                nextPageBtn.attr("data-page-qty", rowsQty);
                prevPageBtn.attr("data-page-qty", rowsQty);
                nextPageBtn.attr("data-parent-id", parentBox_Id);
                prevPageBtn.attr("data-parent-id", parentBox_Id);

                parentMenuRoomBox.append(closeBtn);
                parentMenuRoomBox.append(prevPageBtn);
                parentMenuRoomBox.append(nextPageBtn);

                closeBtn.fadeIn(0);
                if (rowsQty < 1) {
                    prevPageBtn.fadeOut(0);
                    nextPageBtn.fadeOut(0);
                }
                else {
                    nextPageBtn.fadeIn(0);
                    prevPageBtn.fadeIn(0);
                }

                for (let i = 0; i < rowsQty; i++) {
                    buttonParentBoxSample = elementDesigner("div", "bottom-navbar-custom-row-box", null);
                    buttonParentBoxSample.attr("id", i + "-" + parentBox_Id + "_AuxButtonsParent_Box");
                    buttonParentBoxes.push(buttonParentBoxSample);
                }

                for (let i = 0; i < buttonParentBoxes.length; i++) {
                    $(parentMainRoomBox).append(buttonParentBoxes[i]);
                }

                $(buttonParentBoxes[0]).css("display", "flex");
                $(buttonParentBoxes[0]).css("opacity", 1);
                $(buttonParentBoxes[0]).css("transform", "translateX(0)");

                for (let i = 0; i < buttonsHtmlArr.length; i++) {
                    buttonBox = elementDesigner("div", "col", null);
                    newButton = elementDesigner("button", "btn btn-bottom-navbar btn-sm w-100", buttonsHtmlArr[i]);

                    if (i > 0 && i % 5 == 0) rowIndex++;
                    newButton.attr("id", buttonsIdsArr[i]);

                    if (buttonsAttrsArr.attr.length > 0) {
                        if (buttonsAttrsArr.attr.length == 1) {
                            for (let j = 0; j < buttonsAttrsArr.id.length; j++) {
                                if (newButton.attr("id") == buttonsIdsArr[j]) newButton.attr(buttonsAttrsArr.attr[j], buttonsAttrsArr.attrValue[j]);
                            }
                        }
                        else {
                            for (let j = 0; j < buttonsAttrsArr.attr.length; j++) {
                                for (let k = 0; k < buttonsAttrsArr.attr[j].length; k++) {
                                    if (newButton.attr("id") == buttonsIdsArr[k])  newButton.attr(buttonsAttrsArr.attr[j][k], buttonsAttrsArr.attrValue[j][k]);
                                } 
                            }
                        }
                    }

                    if (buttonClassesArr.length > 0) {
                        for (let c = 0; c < buttonClassesArr.length; c++) {
                            newButton.addClass(buttonClassesArr[c]);
                        }
                    }

                    buttonBox.append(newButton);
                    $(buttonParentBoxes[rowIndex]).append(buttonBox);
                }
                $("#MainBottom_Navbar").append(parentBox);

                if (openOnCreate) swapToCustomNavbar(parentBox_Id);
            }
        }
        else swapToCustomNavbar(parentBox_Id);
    }
}

$(document).on("mousedown", ".btn-to-prev-navbar-page", function () {
    let currentPage = $(this).attr("data-page");
    let parenBoxId = $(this).attr("data-parent-id");

    if (currentPage != undefined && parenBoxId != undefined) {
        currentPage = parseInt(currentPage) - 1;
        let checkPageAvailability = document.getElementById(currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box");

        if (checkPageAvailability != null) {
            $(".bottom-navbar-custom-row-box").fadeOut(300);
            $(".bottom-navbar-custom-row-box").css("opacity", 0);
            $(".bottom-navbar-custom-row-box").css("transform", "translateX(250px)");
            setTimeout(function () {
                $("#" + currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box").css("opacity", 1);
                $("#" + currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box").css("display", "flex");
            }, 300);
            setTimeout(function () {
                $("#" + currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box").css("transform", "translateX(0)");
            }, 325);

            if (currentPage == 0) {
                $(".btn-to-prev-navbar-page").addClass("super-disabled");
                $(".btn-to-next-navbar-page").removeClass("super-disabled");
            }
            else {
                $(".btn-to-next-navbar-page").addClass("super-disabled");
                $(".btn-to-prev-navbar-page").removeClass("super-disabled");
            }
            $(".btn-to-prev-navbar-page").attr("data-page", currentPage);
            $(".btn-to-next-navbar-page").attr("data-page", currentPage);
        }
    }
});

$(document).on("mousedown", ".btn-to-next-navbar-page", function () {
    let currentPage = $(this).attr("data-page");
    let parenBoxId = $(this).attr("data-parent-id");
    const pagesQty = parseInt($(this).attr("data-page-qty")) - 1;

    if (currentPage != undefined && parenBoxId != undefined) {
        currentPage = parseInt(currentPage) + 1;
        let checkPageAvailability = document.getElementById(currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box");

        if (checkPageAvailability != null) {
            $(".bottom-navbar-custom-row-box").fadeOut(300);
            $(".bottom-navbar-custom-row-box").css("opacity", 0);
            $(".bottom-navbar-custom-row-box").css("transform", "translateX(250px)");
            setTimeout(function () {
                $("#" + currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box").css("opacity", 1);
                $("#" + currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box").css("display", "flex");
            }, 300);
            setTimeout(function () {
                $("#" + currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box").css("transform", "translateX(0)");
            }, 325);
            $(".btn-to-prev-navbar-page").removeClass("super-disabled");
        }
        else {
            currentPage = 0;
            checkPageAvailability = document.getElementById(currentPage + "-" + parenBoxId + "_AuxButtonsParent_Box");

            $(".bottom-navbar-custom-row-box").fadeOut(300);
            $(".bottom-navbar-custom-row-box").css("opacity", 0);
            $(".bottom-navbar-custom-row-box").css("transform", "translateX(250px)");
            setTimeout(function () {
                checkPageAvailability.style.display = "flex";
                checkPageAvailability.style.opacity = 1;
            }, 300);
            setTimeout(function () {
                $("#" + checkPageAvailability.id).css("transform", "translateX(0)");
            }, 325);
        }

        if (currentPage > 0 && currentPage < pagesQty) {
            $(".btn-to-next-navbar-page").removeClass("super-disabled");
            $(".btn-to-prev-navbar-page").removeClass("super-disabled");
        }
        else if (currentPage <= pagesQty) {
            $(".btn-to-next-navbar-page").addClass("super-disabled");
            $(".btn-to-prev-navbar-page").removeClass("super-disabled");
        }
        else {
            $(".btn-to-next-navbar-page").removeClass("super-disabled");
            $(".btn-to-prev-navbar-page").removeClass("super-disabled");
        }

        $(".btn-to-prev-navbar-page").attr("data-page", currentPage);
        $(".btn-to-next-navbar-page").attr("data-page", currentPage);
    }
});

$(document).on("mousedown", ".btn-select-element", function () {
    let val = $(this).attr("data-val");
    let selectBoxId = $(this).attr("data-box-id");
    let callerBtn = $(this).attr("data-caller-btn");
    let resultSpan = $(this).attr("data-text-label");
    let trueId = getTrueId($(this).attr("id"), false);
    let valuePlace = $(this).attr("data-value-place");
    let uniqueClass = $(this).attr("data-unique-class");
    if (trueId != undefined && uniqueClass != undefined && valuePlace != undefined && val != undefined) {
        let allTheseRowElements = $("." + uniqueClass);
        if (allTheseRowElements.length > 0) {
            $(allTheseRowElements).each(function (index) {
                let inId = $(allTheseRowElements[index]).attr("id");
                let inHtml = $("#" + inId).html();
                if (inHtml.toLowerCase().includes("fa-solid fa-check")) {
                    inHtml = inHtml.replace('<i class="fa-solid fa-check text-primary"></i>', "");
                    $("#" + inId).html(inHtml);
                }
            });
        }

        if (callerBtn != undefined) $("#" + callerBtn).attr("data-val", val);
        if (resultSpan != undefined) {
            $("." + resultSpan).html($(this).html());
            $("#" + resultSpan).html($(this).html());
        }

        $("#" + valuePlace).val(val);
        $("#" + valuePlace).change();

        $("." + uniqueClass).removeClass("selected");
        $(this).addClass("selected");
        $(this).html(' <i class="fa-solid fa-check text-primary"></i> ' + $(this).html());

        uncallASelect(selectBoxId, callerBtn);
    }
});

$(document).on("mousedown", "#ArtistType-Select_Btn", function () {
    let currentVal = $(this).attr("data-val");
    callASelect("ArtistType", "ArtistType-Select_Btn", "ArtistType_Result_Span", "EditUserType_Type_Val", "select-artist-type", "ArtistType_Select", currentVal == undefined ? 0 : currentVal, ["Solo Artist", "DJ/Producer", "Group/Band", "Duo", "Orchestra", "Ensembles", "Choir", "Collective", "Theatre Artists"], [0, 1, 2, 3, 4, 5, 6, 7, 8], false);
});

$(document).on("mousedown", ".btn-call-select", function () {
    let trueId = getTrueId($(this).attr("id"));
    let uniqueClassname = $(this).attr("data-unique");
    let values = $(this).attr("data-values");
    let texts = $(this).attr("data-text");
    if (trueId != undefined && uniqueClassname != undefined && values != undefined && texts != undefined) {
        values = getCommaSeparatedValues(values);
        texts = getCommaSeparatedValues(texts);

        callASelect(trueId, $(this).attr("id"), trueId + "_Span", trueId + "_Val", uniqueClassname, trueId, 0, values, texts, false);
    }
});

$(document).on("mousedown", ".btn-close-select", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    let callerBtn = $(this).attr("data-caller-btn");
    if (trueId != undefined && callerBtn != undefined) {
        uncallASelect(trueId, callerBtn);
    }
});

$(document).on("keyup", ".form-control-select-search", function () {
    let keyword = $(this).val();
    let uniqueClassname = $(this).attr("data-select-between");

    if (keyword != undefined && uniqueClassname != undefined) selectSearch(keyword, uniqueClassname);
});

$(document).on("mousedown", ".btn-create-new-item", function () {
    const thisId = $(this).attr("id");
    const trueId = getTrueId(thisId, false);
    const parentId = $(this).attr("data-parent");
    let currentIndex = $("#" + trueId + "_Val").val();
    let maxIndex = $("#" + trueId + "_MaxVal").val();
    let placeholderSample = $(this).attr("data-placeholder");

    if (thisId != undefined && trueId != undefined && parentId != undefined && currentIndex != undefined) {
        let lastBoxCopy = $("#" + currentIndex + "-" + trueId).clone();
        let lastBoxCopyChildrens = lastBoxCopy.children();
        currentIndex++;

        if (currentIndex < maxIndex) {
            let canBeAppended = false;
            let placeholderCurrentIndex = currentIndex + 1;
            lastBoxCopy.attr("id", currentIndex + "-" + trueId);

            if (lastBoxCopyChildrens != null) {
                for (let i = 0; i < lastBoxCopyChildrens.length; i++) {
                    let tempElement = lastBoxCopyChildrens[i];
                    let tempTrueId = getTrueId(lastBoxCopyChildrens[i].id, true);
                    let tempElementNodeType = tempElement.nodeName.toLowerCase();

                    if (tempElementNodeType == "input") {
                        if ($(tempElement).val().length > 0) {
                            canBeAppended = true;
                            $(tempElement).val(null);
                            $("#" + trueId + "-DeleteItem_Btn").remove();
                            $(tempElement).attr("placeholder", placeholderSample + " " + placeholderCurrentIndex);
                        }
                        else {
                            canBeAppended = false;
                            break;
                        }
                    }
                    else {
                        canBeAppended = true;
                        $("#" + trueId + "-DeleteItem_Btn").remove();
                    }

                    if (!$(tempElement).hasClass("btn-delete-created-item")) $(tempElement).attr("id", currentIndex + "-" + tempTrueId);
                }

                if (canBeAppended) {
                    $("#" + parentId).append(lastBoxCopy);
                    $("#" + trueId + "_Val").val(currentIndex);
                    $("#" + trueId + "-DeleteItem_Btn").removeClass("super-disabled");
                }
                else callKawaiiAlert(0, "Fill current one to add new", '<i class="fa-solid fa-keyboard"></i>', null, null, 2.75, false);

                if (++currentIndex >= maxIndex) {
                    $(".btn-create-new-item").addClass("super-disabled");
                    $(".btn-create-new-item").html(' <i class="fa-solid fa-circle-notch"></i> Fully Filled');
                }
                else {
                    $(".btn-create-new-item").removeClass("super-disabled");
                    $(".btn-create-new-item").html(' <i class="fa-solid fa-plus"></i> Add Option');
                }
            }
        }
    }
});

$(document).on("mousedown", ".btn-delete-created-item", function (event) {
    event.preventDefault();
    const trueId = getTrueId($(this).attr("id"), false);
    let currentIndex = $("#" + trueId + "_Val").val();
    let minValueIndex = $("#" + trueId + "_MinVal").val();
    if (trueId != undefined && currentIndex != undefined) {
        if (currentIndex > 1) {
            minValueIndex = minValueIndex == undefined ? 0 : parseInt(minValueIndex);
            let deleteButton = elementDesigner("button", "btn btn-standard-rounded btn-delete-created-item btn-sm", ' <i class="fa-solid fa-xmark"></i> ');
            deleteButton.attr("id", trueId + "-DeleteItem_Btn");

            $("#" + currentIndex + "-" + trueId).remove();
            $("#" + trueId + "_Val").val(--currentIndex);
            $("#" + currentIndex + "-" + trueId).append(deleteButton);

            if (currentIndex <= minValueIndex) deleteButton.addClass("super-disabled");
            else deleteButton.removeClass("super-disabled");

            $(".btn-create-new-item").removeClass("super-disabled");
            $(".btn-create-new-item").html(' <i class="fa-solid fa-plus"></i> Add Option');
        }
    }
});

$(document).on("mousedown", ".btn-call-duration-select", function () {
    let type = $(this).attr("data-type");
    let thisId = $(this).attr("id");
    let trueId = getTrueId(thisId);
    if (type != undefined && thisId != undefined && trueId != undefined) {
        type = parseInt(type);
        switch (type) {
            case 0:
                callDurationSelect(trueId, thisId, type, trueId + "_Val", trueId + "_Span", true, true, true);
                break;
            case 1:
                callDurationSelect(trueId, thisId, type, trueId + "_Val", trueId + "_Span", true, true, false);
                break;
            case 2:
                callDurationSelect(trueId, thisId, type, trueId + "_Val", trueId + "_Span", true, false, false);
                break;
            default:
                callDurationSelect(trueId, thisId, type, trueId + "_Val", trueId + "_Span", true, true, true);
                break;
        }
    }
});
//CreatePoll_Container
$(document).on("mousedown", ".btn-call-number-slider", function () {
    let thisId = $(this).attr("id");
    let trueId = getTrueId(thisId);
    let minValue = $(this).attr("data-min");
    let maxValue = $(this).attr("data-max");
    let stepValue = $(this).attr("data-step");
    let baseValue = $("#" + trueId + "_Val").val();
    let header = $(this).attr("data-header");
    if (thisId != undefined && trueId != undefined) {
        callRangeSelect(trueId, thisId, trueId + "_Val", trueId + "_Span", header, baseValue, minValue, maxValue, stepValue, false);
    }
});

$(document).on("mousedown", ".btn-call-unlim-number-slider", function () {
    let thisId = $(this).attr("id");
    let trueId = getTrueId(thisId);
    let minValue = $(this).attr("data-min");
    let maxValue = $(this).attr("data-max");
    let stepValue = $(this).attr("data-step");
    let baseValue = $("#" + trueId + "_Val").val();
    let header = $(this).attr("data-header");
    if (thisId != undefined && trueId != undefined) {
        callRangeSelect(trueId, thisId, trueId + "_Val", trueId + "_Span", header, baseValue, minValue, maxValue, stepValue, true);
    }
});

$(document).on("mousedown", ".btn-submit-duration-select", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    let valuePlaceId = $(this).attr("data-value-place");
    let displayPlaceId = $(this).attr("data-display-place");
    let callerBtnId = $("#" + trueId + "-Close_Btn").attr("data-caller-btn");
    if (valuePlaceId != undefined && displayPlaceId != undefined && trueId != undefined && callerBtnId != undefined) {
        let finalValue = 0;
        let daysDisp = null;
        let minsDisp = null;
        let hoursDisp = null;
        let displayFinalValue = null;
        let parseType = $(this).attr("data-parse-type");
        let daysValue = parseInt($("#DurationSelect_Day_Val").val());
        let hoursValue = parseInt($("#DurationSelect_Hour_Val").val());
        let minutesValue = parseInt($("#DurationSelect_Min_Val").val());

        parseType = parseType == undefined ? 0 : parseType;
        switch (parseType) {
            case 0:
                //parse to minutes
                finalValue = (daysValue * 24 * 60) + (hoursValue * 60) + minutesValue;
                break;
            case 1:
                //parse to hours (ignore minutes)
                finalValue = (daysValue * 24) + hoursValue;
                break;
            case 2:
                //parse to days (ignore hours and minutes)
                finalValue = daysValue * 24;
                break;
            default:
                finalValue = (daysValue * 24 * 60) + (hoursValue * 60) + minutesValue;
                break;
        }

        if (daysValue > 1) daysDisp = daysValue + " days ";
        else if (daysValue == 1) daysDisp = daysValue + " day ";
        else daysDisp = null;

        if (hoursValue > 1) hoursDisp = hoursValue + " hours ";
        else if (hoursValue == 1) hoursDisp = hoursValue + " hour ";
        else hoursDisp = null;

        if (minutesValue > 1) minsDisp = minutesValue + " mins";
        else if (minutesValue == 1) minsDisp = minutesValue + " min";
        else minutesValue = null;

        displayFinalValue = daysDisp != null ? daysDisp : "";
        displayFinalValue += hoursDisp != null ? hoursDisp : "";
        displayFinalValue += minsDisp != null ? minsDisp : "";

        if (finalValue > 0) {
            $("#" + valuePlaceId).val(finalValue);
            $("#" + displayPlaceId).html(displayFinalValue);
        }
        else {
            $("#" + valuePlaceId).val(1);
            $("#" + displayPlaceId).html("1 min");
        }

        uncallASelect(trueId, callerBtnId);
    }
});

$(document).on("mousedown", ".btn-submit-range-slider", function () {
    let trueId = getTrueId($(this).attr("id"));
    const valuePlace = $(this).attr("data-value-place");
    const callerButtonId = $(this).attr("data-caller-btn");
    const displayPlace = $(this).attr("data-display-place");

    if (callerButtonId != undefined && trueId != undefined && valuePlace != undefined && displayPlace != undefined) {
        const value = parseFloat($("#" + trueId + "-Slider_Val").val());
        const minValue = parseFloat($("#" + trueId + "-Slider_Val").attr("min"));
        const maxValue = parseFloat($("#" + trueId + "-Slider_Val").attr("max"));

        if ((value >= minValue) && (value <= maxValue)) {
            $("#" + valuePlace).val(value);
            $("#" + displayPlace).html(value.toLocaleString());
        }
        else {
            $("#" + valuePlace).val(minValue);
            $("#" + displayPlace).html(minValue.toLocaleString());
        }
        uncallASelect(trueId, callerButtonId);
    }
});

function uncallASelect(id, callerButtonId) {
    if ((id != null || id != undefined) && (callerButtonId != undefined || callerButtonId != null)) {
        let bottomNavbarH = alertBottomValue;

        $("#" + id + "_Select_Box").css("transform", "scale(1.1) translateX(-50%)");
        $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + 60);
        $("#" + callerButtonId).css("transform", "scale(0.95)");
        setTimeout(function () {
            $(".box-select-overlay").removeClass("active");
            $("#" + callerButtonId).css("transform", "scale(1.1) ");
            $("#" + id + "_Select_Box").css("transform", "scale(1) translateX(-50%)");
            $("#" + id + "_Select_Box").css("bottom", "-1200px");
        }, 300);
        setTimeout(function () {
            $(".box-select-overlay").remove();
            $("#" + id + "_Select_Box").fadeOut(0);
            $("#" + callerButtonId).css("transform", "scale(1)");
        }, 600);
    }
    else {
        $(".box-select").css("transform", "scale(1.1) translateX(-50%)");
        $(".box-select").css("bottom", bottomNavbarH + 60);
        $(".btn-select-primary").css("transform", "scale(0.95)");
        setTimeout(function () {
            $(".box-select-overlay").removeClass("active");
            $(".btn-select-primary").css("transform", "scale(1.1) ");
            $(".box-select").css("transform", "scale(1) translateX(-50%)");
            $(".box-select").css("bottom", "-1200px");
        }, 300);
        setTimeout(function () {
            $(".box-select-overlay").remove();
            $(".box-select").fadeOut(0);
            $(".btn-select-primary").css("transform", "scale(1)");
        }, 600);
    }
}

function selectSearch(keyword, uniqueClassName) {
    if (uniqueClassName != undefined || uniqueClassName != null) {
        let allSamples = document.getElementsByClassName(uniqueClassName);
        if (keyword != null || keyword != undefined) {
            keyword = keyword.toLowerCase();
            if (allSamples != null && allSamples.length > 0) {
                for (let i = 0; i < allSamples.length; i++) {
                    selectSearchBaseItems.push(allSamples[i]);
                    if (!$("#" + allSamples[i].id).html().toLowerCase().includes(keyword)) {
                        $("#" + allSamples[i].id).fadeOut(0);
                    }
                    else $("#" + allSamples[i].id).fadeIn(0);
                }
            }
        }
        else {
            $("." + uniqueClassName).fadeIn(0);
            selectSearchBaseItems = [];
        }
    }
}

function callASelect(id, callerButtonId, selectOption_Text_PlaceId, selectOption_Value_PlaceId, selectOptionUniqueClassname, selectOptionMainId, initiallyChosenItemId = 0, selectOptionTexts = [], selectOptionValues = [], includeSearchBar = false) {
    if ((selectOption_Value_PlaceId != null || selectOption_Value_PlaceId != undefined) && (selectOptionUniqueClassname != null || selectOptionUniqueClassname != undefined) && (id != null || id != undefined) && (callerButtonId != null || callerButtonId != undefined) && (selectOptionMainId != null || selectOptionMainId != undefined)) {
        let divExists = document.getElementById(id + "-SelectBody_Box");
        let bottomNavbarH = alertBottomValue;

        if (divExists == null) {
            $(".form-control-select-search").removeAttr("data-select-between");
            if (!includeSearchBar) $("body").append('<div class="box-select shadow-sm" id="' + id + '_Select_Box"><div class="box-select-header"> <button type="button" class="btn btn-standard-rounded btn-close-select float-end ms-1" id="' + id + '-SelectClose_Btn" data-caller-btn="' + callerButtonId + '"> <i class="fa-solid fa-xmark"></i> </button > </div> <div class="box-select-body mt-2" id="' + id + '-SelectBody_Box"> </div> </div>');
            else {
                $("body").append('<div class="box-select shadow-sm" id="' + id + '_Select_Box"><div class="box-select-header"><div class="hstack gap-2"><div class="form-control-search-container w-100"> <span class="card-text text-muted"> <i class="fa-solid fa-magnifying-glass"></i> </span> <input type="text" class="form-control form-control-select-search form-control-search" placeholder="Search..." /> </div> <button type="button" class="btn btn-standard-rounded btn-close-select ms-auto" id="' + id + '-SelectClose_Btn" data-caller-btn="' + callerButtonId + '"> <i class="fa-solid fa-xmark"></i> </button > </div></div > <div class="box-select-body mt-2" id="' + id + '-SelectBody_Box"> </div> </div>');
                $(".form-control-select-search").attr("data-select-between", selectOptionUniqueClassname);
            }
        }
        else $("#" + id + "-SelectBody_Box").empty();

        let index = 0;
        if (selectOptionTexts.length > 0 && selectOptionValues.length > 0) {
            for (let i = 0; i < selectOptionTexts.length; i++) {
                let selectBtn = elementDesigner("button", "btn btn-select-element " + selectOptionUniqueClassname, selectOptionTexts[i]);
                if (selectOptionValues[i] != null) selectBtn.attr("data-val", selectOptionValues[i]);
                selectBtn.attr("id", index + "-" + selectOptionMainId);
                selectBtn.attr("data-box-id", id);
                selectBtn.attr("data-value-place", selectOption_Value_PlaceId);
                selectBtn.attr("data-text-label", selectOption_Text_PlaceId);
                selectBtn.attr("data-unique-class", selectOptionUniqueClassname);
                selectBtn.attr("data-caller-btn", callerButtonId);
                $("#" + id + "-SelectBody_Box").append(selectBtn);
                index++;
            }

            initiallyChosenItemId = parseInt(initiallyChosenItemId) <= 0 ? 0 : initiallyChosenItemId;
            $("#" + initiallyChosenItemId + "-" + selectOptionMainId).addClass("selected");
            $("#" + initiallyChosenItemId + "-" + selectOptionMainId).html(' <i class="fa-solid fa-check text-primary"></i> ' + $("#" + initiallyChosenItemId + "-" + selectOptionMainId).html());
            $("#" + selectOption_Value_PlaceId).val($("#" + initiallyChosenItemId + "-" + selectOptionMainId).attr("data-val"));
        }

        $("body").append("<div class='box-select-overlay'></div>");
        setTimeout(function () {
            bottomNavbarH += 50;
            $(".box-select-overlay").addClass("active");
            $("#" + id + "_Select_Box").fadeIn(0);
            $("#" + callerButtonId).css("transform", "scale(0.95)");
            $("#" + id + "_Select_Box").css("transform", "scale(1.1) translateX(-50%)");
            $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + "px");
            setTimeout(function () {
                bottomNavbarH -= 40;
                $("#" + id + "_Select_Box").css("transform", "scale(1) translateX(-50%)");
                $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + "px");
            }, 300);
        }, 150);
    }
}

function callDurationSelect(id = null, callerButtonId = null, type = 0, valuePlace_Id = null, displayPlace_Id = null, includeDays = true, includeHours = true, includeMinutes = true) {
    if ((id != null || id != undefined) && (callerButtonId != null || callerButtonId != undefined) && (displayPlace_Id != null || displayPlace_Id != undefined) && (valuePlace_Id != null || valuePlace_Id != undefined)) {
        let bottomNavbarH = alertBottomValue;
        let checkSelectAvailability = document.getElementById(id + "_Select_Box");
        if (checkSelectAvailability == null) {
            $("body").append('<div class="box-select shadow-sm" id="' + id + '_Select_Box"> <div class="box-select-header hstack gap-2"> <button type="button" class="btn btn-standard-rounded btn-submit-duration-select" data-value-place="' + id + '_Val" data-display-place="' + id + '_Span" data-parse-type="' + type + '" id="' + id + '-Done_Btn">Done</button> <button type="button" class="btn btn-standard-rounded btn-close-select ms-auto" id="' + id + '-Close_Btn" data-caller-btn="' + id + '-Select_Btn"> <i class="fa-solid fa-xmark"></i> </button> </div> <div class="box-select-body mt-3"> <div class="row"> <div class="col text-center" id="DaysSelector_Col_Box"> <h5 class="h5">Days</h5> <div class="box-standard liquid-glass mt-2 p-2" id="DaysSelector_Box"> <button type="button" class="btn btn-standard-rounded btn-reduce-the-value text-center w-100" data-target="DurationSelect_Day_Val"> <i class="fa-solid fa-chevron-up"></i> </button> <input type="number" class="form-control form-control-for-numbers-only text-center mt-2 mb-2" id="DurationSelect_Day_Val" placeholder="Days" step="1" min="0" max="28" value="1" readonly /> <button type="button" class="btn btn-standard-rounded btn-increase-the-value text-center w-100" data-target="DurationSelect_Day_Val"> <i class="fa-solid fa-chevron-down"></i> </button> </div> </div> <div class="col text-center" id="HoursSelector_Col_Box"> <h5 class="h5">Hours</h5> <div class="box-standard" id="HoursSelector_Box"> <div class="box-standard liquid-glass p-2" id="HoursSelector_Box"> <button type="button" class="btn btn-standard-rounded btn-reduce-the-value text-center w-100" data-target="DurationSelect_Hour_Val"> <i class="fa-solid fa-chevron-up"></i> </button> <input type="number" class="form-control form-control-for-numbers-only text-center mt-2 mb-2" id="DurationSelect_Hour_Val" placeholder="Hours" step="1" min="0" max="23" value="0" readonly /> <button type="button" class="btn btn-standard-rounded btn-increase-the-value text-center w-100" data-target="DurationSelect_Hour_Val"> <i class="fa-solid fa-chevron-down"></i> </button> </div> </div> </div> <div class="col text-center" id="MinsSelector_Col_Box"> <h5 class="h5">Minutes</h5> <div class="box-standard" id="MinsSelector_Box"> <div class="box-standard liquid-glass p-2" id="MinsSelector_Box"> <button type="button" class="btn btn-standard-rounded btn-reduce-the-value text-center w-100" data-target="DurationSelect_Min_Val"> <i class="fa-solid fa-chevron-up"></i> </button> <input type="number" class="form-control form-control-for-numbers-only text-center mt-2 mb-2" id="DurationSelect_Min_Val" placeholder="Mins" step="1" min="0" max="59" value="0" readonly /> <button type="button" class="btn btn-standard-rounded btn-increase-the-value text-center w-100" data-target="DurationSelect_Min_Val"> <i class="fa-solid fa-chevron-down"></i> </button> </div> </div> </div> </div> </div> </div>');
        }

        if (includeDays) {
            $("#DaysSelector_Col_Box").fadeIn(0);
        }
        else {
            $("#DurationSelect_Day_Val").val(0);
            $("#DaysSelector_Col_Box").fadeOut(0);
        }

        if (includeHours) {
            $("#HoursSelector_Col_Box").fadeIn(0);
        }
        else {
            $("#DurationSelect_Hour_Val").val(0);
            $("#HoursSelector_Col_Box").fadeOut(0);
        }

        if (includeMinutes) {
            $("#MinsSelector_Col_Box").fadeIn(0);
        }
        else {
            $("#DurationSelect_Min_Val").val(0);
            $("#MinsSelector_Col_Box").fadeOut(0);
        }

        $("body").append("<div class='box-select-overlay'></div>");
        setTimeout(function () {
            bottomNavbarH += 50;
            $(".box-select-overlay").addClass("active");
            $("#" + id + "_Select_Box").fadeIn(0);
            $("#" + callerButtonId).css("transform", "scale(0.95)");
            $("#" + id + "_Select_Box").css("transform", "scale(1.1) translateX(-50%)");
            $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + "px");
            setTimeout(function () {
                bottomNavbarH -= 40;
                $("#" + id + "_Select_Box").css("transform", "scale(1) translateX(-50%)");
                $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + "px");
            }, 300);
        }, 150);
    }
}

function callRangeSelect(id, callerButtonId = null, valuePlace_Id, displayPlace_Id, headerText = null, base_Value = 0, min_Value = 0, max_Value = 100, step_Value = 1, includeUnlimButton = false) {
    if ((id != null || id != undefined) && (callerButtonId != undefined || callerButtonId != null) && (valuePlace_Id != undefined || valuePlace_Id != null) || (displayPlace_Id != null || displayPlace_Id != undefined)) {
        let bottomNavbarH = alertBottomValue;
        const element = document.getElementById(id);

        min_Value = parseFloat(min_Value) != undefined ? parseFloat(min_Value) : 0;
        max_Value = parseFloat(max_Value) != undefined ? parseFloat(max_Value) : 100;
        step_Value = parseFloat(step_Value) != undefined ? parseFloat(step_Value) : 1;
        base_Value = parseFloat(base_Value) != undefined ? parseFloat(base_Value) : 1;

        if (element == null) $("body").append('<div class="box-select shadow-sm" id="' + id + '_Select_Box"> <div class="box-select-header hstack gap-2"> <button type="button" class="btn btn-standard-rounded btn-submit-range-slider" data-value-place="' + valuePlace_Id + '" data-display-place="' + displayPlace_Id + '" data-caller-btn="' + callerButtonId + '" id = "' + id + '-Done_Btn" > Done</button > <button type="button" class="btn btn-standard-rounded btn-close-select ms-auto" id="' + id + '-Close_Btn" data-caller-btn="' + id + '-Select_Btn"> <i class="fa-solid fa-xmark"></i> </button> </div > <div class="box-select-body mt-3"> <div class="box-standard liquid-glass p-2"><label class="form-label fw-500"><span class="fw-500" id="' + id + '_RangeHeader_Lbl">Max Voices</span> ∙ <span class="card-text" id="' + id + '_RangeValue_Span">1</span></label> <input type="range" class="form-range" id="' + id + '-Slider_Val" /> </div> <div class="box-standard row mt-2"> <div class="col"> <button type="button" class="btn btn-standard-rounded btn-range-slider-set-unlim text-center w-100"> <i class="fa-solid fa-infinity"></i> Unlimited</button> </div> <div class="col"> <button type="button" class="btn btn-standard-rounded btn-range-slider-val-round text-center w-100"> <i class="fa-solid fa-arrow-down-9-1"></i> Round</button> </div> </div> </div>');
        $("#" + id + "-Slider_Val").val(base_Value);
        $("#" + id + "-Slider_Val").attr("min", min_Value);
        $("#" + id + "-Slider_Val").attr("max", max_Value);
        $("#" + id + "-Slider_Val").attr("step", step_Value);

        if (headerText != null) $("#" + id + "_RangeHeader_Lbl").html(headerText);
        else $("#" + id + "_RangeHeader_Lbl").text("Slide to Change");

        if (includeUnlimButton) {
            $(".btn-range-slider-set-unlim").removeClass("super-disabled");
            $(".btn-range-slider-set-unlim").attr("data-value", id + "-Slider_Val");
            $(".btn-range-slider-set-unlim").attr("data-display", id + "_RangeValue_Span");
        }
        else {
            $(".btn-range-slider-set-unlim").removeAttr("data-value");
            $(".btn-range-slider-set-unlim").removeAttr("data-display");
            $(".btn-range-slider-set-unlim").addClass("super-disabled");
        }

        if (max_Value >= 10000) {
            $(".btn-range-slider-val-round").removeClass("super-disabled");
            $(".btn-range-slider-val-round").attr("data-value", id + "-Slider_Val");
        }
        else {
            $(".btn-range-slider-val-round").removeAttr("data-value");
            $(".btn-range-slider-val-round").addClass("super-disabled");
        }

        $("body").append("<div class='box-select-overlay'></div>");
        setTimeout(function () {
            bottomNavbarH += 50;
            $(".box-select-overlay").addClass("active");
            $("#" + id + "_Select_Box").fadeIn(0);
            $("#" + callerButtonId).css("transform", "scale(0.95)");
            $("#" + id + "_Select_Box").css("transform", "scale(1.1) translateX(-50%)");
            $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + "px");
            setTimeout(function () {
                bottomNavbarH -= 40;
                $("#" + id + "_Select_Box").css("transform", "scale(1) translateX(-50%)");
                $("#" + id + "_Select_Box").css("bottom", bottomNavbarH + "px");
            }, 300);
        }, 150);
    }
}

$(document).on("mousedown", ".btn-range-slider-set-unlim", function () {
    let valueTarget = $(this).attr("data-value");
    if (valueTarget != undefined) {
        let displayPlaceId = $(this).attr("data-display");
        if (!$(this).hasClass("triggered")) {
            $("#" + valueTarget).val(-1);
            $("#" + valueTarget).addClass("super-disabled");

            $(this).addClass("triggered");
            $(this).html(' <i class="fa-solid fa-infinity"></i> Ready');
            if (displayPlaceId != undefined) $("#" + displayPlaceId).html(' <i class="fa-solid fa-infinity"></i> ');
        }
        else {
            let minValue = parseFloat($("#" + valueTarget).attr("min"));
            minValue = minValue == undefined ? 0 : minValue;
            $("#" + valueTarget).val(minValue);
            $("#" + valueTarget).removeClass("super-disabled");

            $(this).removeClass("triggered");
            $(this).html(' <i class="fa-solid fa-infinity"></i> Unlimited');
            if (displayPlaceId != undefined) $("#" + displayPlaceId).html(minValue);
        }
    }
});

$(document).on("mousedown", ".btn-range-slider-val-round", function () {
    let valueTarget_Id = $(this).attr("data-value");
    if (valueTarget_Id != undefined) {
        let value = parseFloat($("#" + valueTarget_Id).val());
        let maxValue = parseFloat($("#" + valueTarget_Id).attr("max"));
        let zerosQty = maxValue / 10;

        if (value >= zerosQty) {
            value = Math.round(value / zerosQty);
            $("#" + valueTarget_Id).val(value * zerosQty);
            $("#" + valueTarget_Id).change();
        }
        else $("#" + valueTarget_Id).val(zerosQty);
        $("#" + valueTarget_Id).change();
    }
});

$(document).on("mousedown", ".btn-select-primary", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    let textPlaceId = trueId + "_Span";
    let uniqueClassname = $(this).attr("data-class");
    let unqiueIdentifier = $(this).attr("data-unique-id");
    let optionTexts = getCommaSeparatedValues($(this).attr("data-texts"));
    let mainId = $(this).attr("data-val");
    let optionValues = [];

    //AlbumInfo_Version_Span
    //form-control-distance
    if (trueId != undefined) {
        for (let i = 0; i < optionTexts.length; i++) {
            optionValues.push(i);
        }
        callASelect(trueId + "_SO", $(this).attr("id"), textPlaceId, trueId, uniqueClassname, unqiueIdentifier, mainId, optionTexts, optionValues, false);
    }
});

$(document).on("mousedown", ".btn-add-element", function () {
    let prototype = $(this).attr("data-prototype");
    let newElementId = copyAnElement(prototype, true);
    let removeBtn = $(this).attr("data-remove-btn");
    if (removeBtn != undefined) {
        $("#" + removeBtn).fadeIn(300);
        $("#" + removeBtn).removeClass("super-disabled");
    }
    $(this).attr("data-prototype", newElementId);
});

$(document).on("mousedown", ".btn-remove-element", function () {
    let trueId = getTrueId($(this).attr("id"), true);
    if (trueId != undefined) {
        //createInsideLgCard()
        $("#" + trueId).remove();
        $(".btn-close-vertical-switcher").mousedown();
    }
});

$(document).on("mousedown", ".btn-elements-listed", function () {
    let trueId = getTrueId($(this).attr("id"));
    let prototype = $(this).attr("data-prototype");
    if (trueId != undefined && prototype != undefined) {
        let qty = 0;
        let prototypeTrueId = getTrueId(prototype, false);
        let allItems = $("[id*='" + prototypeTrueId + "']");
        $("#" + trueId + "-MembersListed_Box").empty();
        if (allItems.length > 0) {
            for (let i = 0; i < allItems.length; i++) {
                if ($("#" + allItems[i].id).attr("data-list") != "false") {
                    qty++;
                    let itemsToEdit = $("<button type='button' class='btn btn-standard btn-standard-bordered btn-remove-element btn-sm w-100 mb-1'></button>");
                    itemsToEdit.attr("id", "ToRemove-" + allItems[i].id);
                    if ($("#" + allItems[i].id).val() != "") itemsToEdit.html($("#" + allItems[i].id).val());
                    else itemsToEdit.text("Not provided");
                    $("#" + trueId + "-MembersListed_Box").append(itemsToEdit);
                }
            }
            $("#" + trueId + "-MembersQty_Lbl").html("Members: " + qty);
        }
    }
});

$(document).on("mousedown", ".btn-load-countries", function () {
    let isCurrentlyLoaded = $(this).attr("data-is-loaded");
    if (isCurrentlyLoaded == "true") {
        callAContainer(false, "CountriesList_Container", true);
    }
    else $("#GetCountries_Form").submit();
});

$(document).on("keyup", ".form-control-search", function () {
    let trueId = $(this).attr("id");
    if (trueId != undefined) {
        let itemsArr = [];
        let currentLength = $(this).val().length;
        let filterMembersClassname = $(this).attr("data-search-in");
        let items = document.getElementsByClassName(filterMembersClassname);

        if (currentLength > 0) $("#" + trueId + "-Icon_Span").html('<i class="fa-solid fa-ellipsis fa-fade"></i>');
        else $("#" + trueId + "-Icon_Span").html('<i class="fa-solid fa-magnifying-glass"></i>');

        if (filterMembersClassname != undefined && currentLength > 0) {
            for (let i = 0; i < items.length; i++) {
                itemsArr.push(items[i]);
            }
            localItemFilter(itemsArr, $(this).val());
        }
        else {
            for (let i = 0; i < items.length; i++) {
                $("#" + items[i].id).fadeIn(0);
            }
        }
    }
});

$(document).on("mousedown", ".country-search-member", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $(".country-search-member").removeClass("bg-chosen-bright");
        $(this).addClass("bg-chosen-bright");
        $("#EPI_CountryId_Val").val(trueId);
        $("#LoadCountries_Btn").html($(this).html());
    }
});

$(document).on("mousedown", ".profile-avatar-img", function () {
    if (currentPageUrl.toLowerCase().includes("/profile/p")) {
        if ($(this).hasClass("loaded")) {
            slideBoxes(true, "standard-profile-bar", "standard-image-bar");
            setTimeout(function () {
                $(".profile-avatar-img").addClass("profile-avatar-img-enlarged");
                $(".profile-avatar-img-enlarged").removeClass("profile-avatar-img");
                $(".standard-profile-initials-box").fadeOut(300);
            }, 300);
        } 
        else $("#GetImagesQty_Form").submit();
    }
});

$(document).on("mousedown", ".btn-exit-photo-mode", function () {
    slideBoxes(true, "standard-image-bar", "standard-profile-bar");
    setTimeout(function () {
        $(".standard-profile-initials-box").fadeIn(300);
        $(".profile-avatar-img-enlarged").addClass("profile-avatar-img");
        $(".profile-avatar-img").removeClass("profile-avatar-img-enlarged");
    }, 300);
});

function boxSlider(byClassname = false, boxElementId = null, triggerButtonId = null) {
    if (boxElementId != undefined || boxElementId != null) {
        if (byClassname) {
            $(".slide-box").addClass("closing");
            $("." + boxElementId).addClass("opening");
            $("." + boxElementId).removeClass("closing");

            setTimeout(function () {
                $(".slide-box").fadeOut(0);
                $(".slide-box").removeClass("closing");
                $("." + boxElementId).fadeIn(0);
                $("." + boxElementId).removeClass("opening");
            }, 300);
        }
        else {
            $(".slide-box").addClass("closing");
            $("#" + boxElementId).addClass("opening");
            $("#" + boxElementId).removeClass("closing");

            setTimeout(function () {
                $(".slide-box").fadeOut(0);
                $(".slide-box").removeClass("closing");
                $("#" + boxElementId).fadeIn(0);
                $("#" + boxElementId).removeClass("opening");
            }, 300);
        }

        if (triggerButtonId != null || triggerButtonId != undefined) {
            $(".btn-slide-boxes").removeClass("bg-chosen-bright");
            $("#" + triggerButtonId).addClass("bg-chosen-bright");
        }
    }
}

$(document).on("keyup", ".form-control-invisible", function (event) {
    let keyCode = event.keyCode || event.which;
    let identifier = getTrueId($(this).attr("id"), true);
    let trueId = parseInt(getTrueId($(this).attr("id"), false));
    let thisTrueIdValue = $(this).val();
    let baseFullValue = $("#" + identifier).val();
    //btn-select-primary
    if (keyCode != 8) {
        if (trueId != undefined && identifier != undefined && thisTrueIdValue != undefined) {
            let nextInputValue = trueId + 1;
            if (baseFullValue.length > 0) {
                if (baseFullValue.length > trueId) baseFullValue[trueId] = thisTrueIdValue;
                else baseFullValue += thisTrueIdValue;
            }
            else {
                baseFullValue = thisTrueIdValue;
            }
            $("#" + identifier).val(baseFullValue);
            if ($("#" + nextInputValue + "-" + identifier) != null) $("#" + nextInputValue + "-" + identifier).focus();
        }
    }
    else {
        let prevInputValue = trueId - 1;
        baseFullValue[trueId] = "";
        if ($("#" + prevInputValue + "-" + identifier) != null) $("#" + prevInputValue + "-" + identifier).focus();

    }
});

$(document).on("mousedown", ".btn-swipe-prev-box", function () {
    let targetBoxUniqueClass = $(this).attr("data-class");
    let targetBoxUniqueIdentifier = getTrueId($(this).attr("id"), true);
    let currentBoxId = parseInt($(this).attr("data-step"));

    if (targetBoxUniqueClass != undefined && currentBoxId != undefined && targetBoxUniqueIdentifier != undefined) {
        let prevBoxId = currentBoxId--;
        let superPrevBoxId = currentBoxId - 1;
        let checkSuperPrevBoxAvailability = document.getElementById(superPrevBoxId + "-" + targetBoxUniqueIdentifier);

        slideBoxes(false, prevBoxId + "-" + targetBoxUniqueIdentifier, currentBoxId + "-" + targetBoxUniqueIdentifier);
        if (checkSuperPrevBoxAvailability != null) $(".btn-" + targetBoxUniqueClass).removeClass("super-disabled");
        else {
            $(".btn-" + targetBoxUniqueClass).removeClass("super-disabled");
            $(this).addClass("super-disabled");
        }
        $(".btn-" + targetBoxUniqueClass).attr("data-step", currentBoxId);
        $("#PageQty-" + targetBoxUniqueIdentifier + "_Span").text(++currentBoxId);
    }
});

$(document).on("mousedown", ".btn-swipe-next-box", function () {
    let targetBoxUniqueClass = $(this).attr("data-class");
    let targetBoxUniqueIdentifier = getTrueId($(this).attr("id"), true);
    let currentBoxId = parseInt($(this).attr("data-step"));

    if (targetBoxUniqueClass != undefined && currentBoxId != undefined && targetBoxUniqueIdentifier != undefined) {
        let prevBoxId = currentBoxId++;
        let superNextBoxId = currentBoxId + 1;
        let checkNextBoxAvailability = document.getElementById(superNextBoxId + "-" + targetBoxUniqueIdentifier);

        slideBoxes(false, prevBoxId + "-" + targetBoxUniqueIdentifier, currentBoxId + "-" + targetBoxUniqueIdentifier);
        if (checkNextBoxAvailability != null) $(".btn-" + targetBoxUniqueClass).removeClass("super-disabled");
        else {
            $(".btn-" + targetBoxUniqueClass).removeClass("super-disabled");
            $(this).addClass("super-disabled");
        }
        $(".btn-" + targetBoxUniqueClass).attr("data-step", currentBoxId);
        $("#PageQty-" + targetBoxUniqueIdentifier + "_Span").text(++currentBoxId);
    }
});

$(document).on("mousedown", ".btn-change-boxes", function () {
    let closingBox = $(this).attr("data-close");
    let openingBox = $(this).attr("data-open");
    if (closingBox != undefined && openingBox != undefined) {
        swapToDefaultMode();
        slideBoxes(false, closingBox, openingBox);
    }
});

$(document).on("mousedown", ".btn-slide-boxes", function () {
    let targetBox = $(this).attr("data-box");
    let isByClassname = $(this).attr("data-by-classname");
    if (targetBox != undefined) {
        boxSlider(isByClassname != undefined ? isByClassname : false, targetBox, $(this).attr("id"));
    }
});

$(document).on("mousedown", ".btn-select-button-bar", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    let boxClassname = $(this).attr("data-base-class");
    if (trueId != undefined && boxClassname != undefined) {
        $(".btn-" + boxClassname).removeClass("checked");
        $(this).addClass("checked");

        slideBoxes(true, boxClassname, trueId);
    }
});

$(document).on("mousedown", ".btn-double-slide-boxes", function () {
    let thisId = $(this).attr("id");
    let firstClose = $(this).attr('data-close-first');
    let secondClose = $(this).attr("data-close-second");
    let open = $(this).attr("data-open-box");
    let isActive = $(this).attr("data-is-active");

    if (thisId != undefined && firstClose != undefined && secondClose != undefined && open != undefined) {
        let allDoubleSlideElements = document.getElementsByClassName("btn-double-slide-boxes");
        if (allDoubleSlideElements.length > 0) {
            let closeFirstAttr;
            let closeSecondAttr;
            let openLastAttr;
            for (let i = 0; i < allDoubleSlideElements.length; i++) {
                closeFirstAttr = $("#" + allDoubleSlideElements[i].id).attr("data-close-first");
                closeSecondAttr = $("#" + allDoubleSlideElements[i].id).attr("data-close-second");
                openLastAttr = $("#" + allDoubleSlideElements[i].id).attr("data-open-box");
                $(closeFirstAttr).fadeOut(300);
                $(closeSecondAttr).fadeOut(300);
                $(openLastAttr).fadeOut(300);
            }
        }
        $(".btn-double-slide-boxes").attr("data-is-active", true);
        isActive = isActive == "false" ? false : true;

        if (isActive) {
            $(firstClose).fadeOut(300);
            $(open).fadeOut(300);
            setTimeout(function () {
                $(secondClose).fadeIn(300);
            }, 300);

            let needBold = $(this).attr("data-bold");
            if (needBold != undefined) buttonChooser(false, thisId, true);
            else buttonChooser(false, thisId, false);
            $(this).attr("data-is-active", false);
        }
        else {
            $(firstClose).fadeOut(300);
            $(secondClose).fadeOut(300);
            setTimeout(function () {
                $(open).fadeIn(300);
            }, 300);
            buttonUnchooser(false, thisId);
            $(this).attr("data-is-active", true);
        }
    }
});

$(document).on("mousedown", ".btn-open-sticky-box", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) callAStickyBox(trueId, $(this).html(), $(this).attr("id"));
});
$(document).on("mousedown", ".btn-close-sticky-box", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) uncallAStickyBox(false, trueId, $(this).attr("data-base-html"), $(this).attr("id"));
    else uncallAStickyBox(true, null, $(this).attr("data-base-html"), null);
});

$(document).on("mousedown", ".btn-show-field-box", function () {
    let thisId = $(this).attr("id");
    let trueId = getTrueId(thisId);
    if (trueId != undefined && thisId != undefined) {
        let btnHtml = $(this).html();
        if (!$(this).hasClass("btn-field-added")) {
            fieldMarker(trueId, thisId, btnHtml);
        }
        else {
            let inputValue = $("#" + trueId).attr("data-input");
            fieldUnmarker(trueId, inputValue, thisId, btnHtml);
        }
    }
});

$(document).on("mousedown", ".btn-show-inside-box", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let isBigBox = $(this).attr("data-big-switcher");
        if (isBigBox == "true") showSwitchableBox(true, trueId);
        else showSwitchableBox(false, trueId);
    }
});

$(document).on("mousedown", ".btn-change-the-value", function () {
    let value = $(this).attr("data-value");
    let target = $(this).attr("data-target");
    if (value != undefined && target != undefined) {
        if (Number.isInteger(value)) value = parseInt(value);
        else if (value == "true" || value == "false") value = value == "false" ? false : true;
        $("#" + target).val(value);
    }
});

$(document).on("mousedown", ".btn-box-switcher-member", function () {
    let currentSwitchers = [];
    let allSwitchers = document.getElementsByClassName("btn-box-switcher-member");
    let currentSwitcherInternalId = $(this).attr("data-switcher-internal-id");
    let description = $(this).attr("data-description");
    if (allSwitchers.length > 0 && currentSwitcherInternalId != undefined) {
        for (let i = 0; i < allSwitchers.length; i++) {
            if ($("#" + allSwitchers[i].id).attr("data-switcher-internal-id") == currentSwitcherInternalId) currentSwitchers.push(allSwitchers[i]);
        }
    }

    if (currentSwitchers.length > 0) {
        for (let i = 0; i < currentSwitchers.length; i++) {
            $("#" + currentSwitchers[i].id).removeClass("btn-box-switcher-member-active");
        }
        $(this).addClass("btn-box-switcher-member-active");
    }
    if (description != undefined) {
        let targetId = $(this).attr('data-target');
        if (targetId != undefined) $("#" + targetId + "-Warn").html(description);
        $("#" + targetId + "-Preview_Span").html($(this).html());
    }
});

$(document).on("mousedown", '.btn-open-vertical-switcher', function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#" + trueId).fadeIn(0);
        $(".btn-sticky-at-bottom").css("opacity", 0);
        $(".box-sticky-at-bottom").css("opacity", 0);
        $("#" + trueId).css("bottom", bottomNavbarH + 20 + "px");
        setTimeout(function () {
            $("#" + trueId).css("bottom", bottomNavbarH + 4 + "px");
        }, 350);
    }
});
$(document).on("mousedown", ".btn-close-vertical-switcher", function () {
    $(".box-vertical-switcher").css("bottom", bottomNavbarH + 18 + "px");
    setTimeout(function () {
        $(".btn-sticky-at-bottom").css("opacity", 1);
        $(".box-sticky-at-bottom").css("opacity", 1);
        $(".box-vertical-switcher").css("bottom", "-1200px");
    }, 350);
});

$(document).on("mousedown", ".btn-box-vertical-swticher", function () {
    let currentSwitchers = [];
    let allSwitchers = document.getElementsByClassName("btn-box-vertical-swticher");
    let currentSwitcherInternalId = $(this).attr("data-switcher-internal-id");
    if (allSwitchers.length > 0 && currentSwitcherInternalId != undefined) {
        for (let i = 0; i < allSwitchers.length; i++) {
            if ($("#" + allSwitchers[i].id).attr("data-switcher-internal-id") == currentSwitcherInternalId) currentSwitchers.push(allSwitchers[i]);
        }
    }

    if (currentSwitchers.length > 0) {
        for (let i = 0; i < currentSwitchers.length; i++) {
            $("#" + currentSwitchers[i].id).removeClass("btn-box-vertical-swticher-active");
        }
        $(this).addClass("btn-box-vertical-swticher-active");
    }
});

$(document).on("mousedown", ".profile-avatar-img-enlarged", function () {
    let filesMaxLength = $("#ImagesQty_Val").val();
    let thisFileUrl = loadAnotherFile(true, 1, filesMaxLength, "PGI_Skip_Val", "ProfileGetImage_Form");

    if (thisFileUrl != undefined || thisFileUrl != null) {
        $("#PDI_ImgUrl_Val").val(thisFileUrl);
        $("#PSIAM_ImgUrl_Val").val(thisFileUrl);
    }
    else {
        $("#PDI_ImgUrl_Val").val(null);
        $("#PSIAM_ImgUrl_Val").val(null);
    } 
});

$("#ProfileGetImage_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            let imgHdnUrl = $("<input type='hidden' class='form-control-img' />");
            imgHdnUrl.attr("id", response.skip + "-ImgHdn_Val");
            imgHdnUrl.val(response.result);
            $("#ImgHdnValues_Box").append(imgHdnUrl);
            $(".profile-counter-slider").removeClass("bg-chosen");
            $("#" + response.skip + "-ImgSlider_Box").addClass("bg-chosen");
            $(".profile-avatar-img-enlarged").attr("src", "/ProfileImages/" + response.result);
            $("#PDI_ImgUrl_Val").val(response.result);
            $("#PSIAM_ImgUrl_Val").val(response.result);
        }
        else {
            let firstImgUrl = $("#0-ImgHdn_Val").val();
            if (firstImgUrl != null) {
                $("#PDI_ImgUrl_Val").val(firstImgUrl);
                $("#PSIAM_ImgUrl_Val").val(firstImgUrl);
                $(".profile-avatar-img-enlarged").attr("src", "/ProfileImages/" + firstImgUrl);
            } 
            else {
                $('.btn-exit-photo-mode').mousedown();
                $(".profile-avatar-img-enlarged").fadeOut(0);
                $(".profile-avatar").fadeIn(0);
                $("#PDI_ImgUrl_Val").val(null);
                $("#PSIAM_ImgUrl_Val").val(null);
            }
        }
    });
});

$("#GetImagesQty_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (parseInt(response.result) > 0) {
            if (currentPageUrl.toLowerCase().includes("/profile/p")) {
                $("#AvatarsCounter_Box").empty();
                $("#ImagesQty_Val").val(response.result);
                $(".profile-avatar-img").addClass("loaded");
                slideBoxes(true, "standard-profile-bar", "standard-image-bar");
                for (let i = 0; i < response.result; i++) {
                    let column = $("<div class='col'></div>");
                    let slider = $("<div class='profile-counter-slider'></div>");
                    if (i == 0) slider.addClass("bg-chosen");
                    slider.attr("id", i + "-ImgSlider_Box");
                    column.attr("id", i + "-ImgColumn_Box");
                    column.append(slider);
                    $("#AvatarsCounter_Box").append(column);
                }
                setTimeout(function () {
                    $(".profile-avatar-img").addClass("profile-avatar-img-enlarged");
                    $(".profile-avatar-img-enlarged").removeClass("profile-avatar-img");
                    $(".standard-profile-initials-box").fadeOut(300);
                }, 300);
            }
        }
        else {
            callAlert('<i class="fa-solid fa-image"></i>', null, null, "Images are temporarily unavailable to preview. Please try again later", 3.75, "Hide", 0, null);
        }
    });
});

$("#SearchForUsers_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(false, "SearchForUsers_SbmtBtn", "Searching...");

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                $("#ArtistsSearchResult_Box").empty();
                $.each(response.result, function (index) {
                    let imgTag;
                    let stackDiv = $("<div class='hstack gap-1'></div>");
                    let nameSpan = $("<span class='listed-artist-name-span ms-1'></span>");
                    let resultBtn = $("<button type='button' class='btn btn-profile-tag btn-add-as-artist btn-sm me-1'></button>");
                    if (response.result[index].imgUrl != null) {
                        imgTag = $("<img class='profile-avatar-img-sm' alt='This image cannot be displayed' />");
                        imgTag.attr("src", "/ProfileImages/" + response.result[index].imgUrl);
                    }
                    else {
                        imgTag = $("<div class='profile-avatar-sm'></div>");
                        imgTag.html(response.result[index].nickname[0]);
                    }
                    nameSpan.html(response.result[index].nickname);
                    imgTag.attr("id", response.result[index].id + "-AddedArtistImg_Tag");
                    nameSpan.attr("id", response.result[index].id + "-AddedArtistName_Span");
                    resultBtn.attr("id", response.result[index].id + "-AddedArtist_Btn");
                    stackDiv.append(imgTag);
                    stackDiv.append(nameSpan);
                    resultBtn.append(stackDiv);

                    $("#ArtistsSearchResult_Box").append(resultBtn);
                });
                $("#FoundArtistsQty_Span").text(response.result.length);
                slideBoxes(false, "AlreadyAddedArtists_Box", "ArtistSearch_Box");
            }
            else {
                $("#ArtistsSearchResult_Box").empty();
                let alert = $("<small class='card-text'>No artists found</small>");
                $("#ArtistsSearchResult_Box").append(alert);
                slideBoxes(false, "AlreadyAddedArtists_Box", "ArtistSearch_Box");
            }
        }
        else {
            console.log(response);
        }
        buttonUndisabler(false, "SearchForUsers_SbmtBtn", "");
    });
});

$(document).on("mousedown", "#CNA_GetGenres_Btn", function () {
    $('#SearchForGenres_Type_Val').val(2);
    $('#SearchForGenres_Form').submit(); 
});

$(document).on("submit", "#SearchForGenres_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            let genreIds = [];
            let genreNames = [];

            $.each(response.result, function (index) {
                genreIds.push(response.result[index].id);
                genreNames.push(response.result[index].name);
            });

            if(response.type == 1) callASelect("GenreSelect", "SearchForGenres_SbmtBtn", "UserMainGenre_Span", "EditUserMainGenre_Id_Val", "genre-select", "GenreSelect", 0, genreNames, genreIds, true);
            else callASelect("GenreSelect", "SearchForGenres_SbmtBtn", "CNA_MainGenre_Span", "CNA_GenreId_Val", "genre-select", "GenreSelect", 0, genreNames, genreIds, true);
            //btn-add-as-genre
        }
        else {
            textAlert("RAS_LoadGenres_Btn-Warn", 0, "No matching genres found", 3.5);
        }
        buttonUndisabler(false, "RAS_LoadGenres_Span", null);
    });
});

$("#GetLanguages_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    let baseHtml = '<i class="fa-solid fa-language"></i> Choose a Language';
    buttonDisabler(true, "btn-get-form-languages", "Loading...");

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.type == 0) {

            }
            else {
                if (response.result != null) {
                    createInsideLgCard("LanguagesResult", "Available Languages ∙ " + response.result.length, "<div class='box-standard'><span class='card-text fs-6 ms-1' id='LanguageSearchKeyword_Lbl'></span></div><div class='box-standard mt-1' id='LanguagesResult_Box'></div></div>", null, null);
                    $("#LanguagesResult_Box").empty();
                    $("#LanguagesResult_Box").append("<div class='box-standard' id='FoundLanguages_Box'><div class='form-control-search-container mb-1'><span class='form-control-search-icon' id='LanguageNativeSearch_Val-Icon_Span'><i class='fa-solid fa-magnifying-glass'></i></span><input type='text' class='form-control form-control-search' placeholder='Search for languages' id='LanguageNativeSearch_Val' data-search-in='btn-add-as-language' /></div></div>");
                    if (response.keyword == null) $("#LanguageSearchKeyword_Lbl").html("All available languages are listed");
                    else $("#LanguageSearchKeyword_Lbl").html("Matching languages for <span class='fw-500'>'" + response.keyword + "'</span>");

                    $.each(response.result, function (index) {
                        let languageButton = $("<button type='button' class='btn btn-standard-bordered btn-add-as-language w-100 mt-1'></button>");
                        languageButton.html(response.result[index].name);
                        languageButton.attr("id", response.result[index].id + "-AddAsLanguage_Btn");
                        $("#LanguagesResult_Box").append(languageButton);
                    });
                    setTimeout(function () {
                        callAContainer(false, "LanguagesResult_Container", false);
                    }, 150);
                    $(".btn-get-form-languages").addClass("btn-open-inside-lg-card");
                    $(".btn-get-form-languages").attr("id", "LanguagesResult_Container-BtnOpen");
                }
            }
        }
        else {
            textAlert("UTL_LanguageId_Val-Warn", 0, "No available languages found", 3.5);
        }
        buttonUndisabler(true, "btn-get-form-languages", baseHtml);
    });
});

$(document).on("mousedown", ".btn-add-as-genre", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        if (!$(this).hasClass("bg-chosen-bright")) {
            let isCurrentGenreAvailable = true;
            let currentGenresQty = document.getElementsByClassName("included-genres");
            if (currentGenresQty.length < 3) {
                for (let i = 0; i < currentGenresQty.length; i++) {
                    if (trueId == getTrueId(currentGenresQty[i].id)) {
                        uncallAContainer(false, "ChooseGenres_Container");
                        textAlert("RAS_LoadGenres_Btn-Warn", 0, "This genre is on your list already", 3.5);
                        isCurrentGenreAvailable = false;
                        break;
                    }
                    else isCurrentGenreAvailable = true;
                }

                if (isCurrentGenreAvailable) {
                    let genreInput = $("<input type='text' name='Genres' class='included-genres d-none' />");
                    let genreNameInput = $("<input type='text' name='Genres' class='included-genre-names-val d-none' />");
                    let genreBtn = $("<button type='button' class='btn btn-profile-tag btn-remove-as-genre me-1 mb-1'></button>");
                    genreBtn.attr("id", trueId + "-RemoveAsGenre_Btn");
                    genreBtn.html($(this).html());
                    genreInput.attr("id", trueId + "-AddedGenre_Val");
                    genreInput.val(trueId);
                    genreNameInput.attr("id", trueId + "-AddedGenreName_Val");
                    genreNameInput.val($(this).html());
                    $(this).addClass("bg-chosen-bright");

                    $("#ChosenGenres_Box").append(genreBtn);
                    $("#ChosenGenreInputs_Box").append(genreInput);
                    $("#ChosenGenreNameInputs_Box").append(genreNameInput);
                    $("#ChosenGenres_Box").fadeIn(300);
                }
            }
            else {
                uncallAContainer(false, "ChooseGenres_Container");
                textAlert("RAS_LoadGenres_Btn-Warn", 0, "You've already selected <span class='fw-500'>3</span> genres for your track — just enough for us to recommend and showcase it", 3.75);
            }
        }
        else $("#" + trueId + "-RemoveAsGenre_Btn").mousedown();
    }
});

$(document).on("mousedown", ".btn-remove-as-genre", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        let currentGenresQty = document.getElementsByClassName("included-genres");
        if (currentGenresQty.length > 0) {
            $(this).fadeOut(300);
            $("#" + trueId + "-AddedGenre_Val").remove();
            $("#" + trueId + "-AddedGenreName_Val").remove();
            $("#" + trueId + "-AddAsGenre_Btn").removeClass("bg-chosen-bright");
            setTimeout(function () {
                $(this).remove();
            }, 350);

            if (currentGenresQty == 1) {
                $("#ChosenGenres_Box").fadeOut(300);
                uncallAContainer(false, "ChooseGenres_Container");
            }
        }
        else {
            $("#SPC_Genres_Span").text("No Genre");
        }
    }
});

$(document).on("mousedown", ".btn-add-as-language", function () {
    let thisId = $(this).attr("id");
    let trueId = getTrueId(thisId, false);
    if (trueId != undefined) {
        buttonUnchooser(true, "btn-add-as-language");
        buttonChooser(false, thisId, false);
        $("#UTL_LanguageId_Val").val(trueId);
        $("#UTL_LanguageDisplay_Val").val("Main Language: " + $(this).html());
    }
});

$(document).on("change", ".form-check-input", function () {
    let isChecked = $(this).prop("checked");
    let onCheckChangeItem = $(this).attr("data-checked");
    if (isChecked) {
        if (onCheckChangeItem != undefined) {
            let onCheckChangeText = $(this).attr("data-checked-text");
            if (onCheckChangeText != undefined) $("#" + onCheckChangeItem).html(onCheckChangeText);
            $("#" + onCheckChangeItem).fadeIn(300);
        }
        $(this).val(true);
    }
    else {
        $(this).val(false);
        if (onCheckChangeItem != undefined) {
            let onUncheckChangeText = $(this).attr("data-unchecked-text");
            if (onUncheckChangeText != undefined) $("#" + onCheckChangeItem).html(onUncheckChangeText);
            else $("#" + onCheckChangeItem).fadeOut(300);
        }
    }
});

$(document).on("mousedown", "#RAS_LoadAllGenres_Btn", function () {
    $("#RAS_GenreSearch_Val").val(null);
    $("#RAS_GenreSearch_Val").change();
});
$(document).on("mousedown", ".btn-get-form-languages", function () {
    if (!($(this).hasClass("btn-open-inside-lg-card") || $(this).hasClass("btn-open-container"))) {
        $("#GetLanguages_Type_Val").val(1);
        $("#GetLanguages_Form").submit();
    }
});

$(document).on("change", ".form-control-date-year", function () {
    let value = $(this).val();
    if (value > 0 && value != undefined) {
        let targetValue = $(this).attr("data-target");
        if (targetValue != undefined) {
            let formatType = $(this).attr("data-type");
            let dateDisplayElement = $(this).attr("data-date-display");
            switch (parseInt(formatType)) {
                case 0:
                    callDateAndTimeContainer(targetValue, dateDisplayElement, value, true, true, true, true, false);
                    break;
                case 1:
                    callDateAndTimeContainer(targetValue, dateDisplayElement, value, true, true, true, false, false);
                    break;
                case 2:
                    callDateAndTimeContainer(targetValue, dateDisplayElement, value, true, false, false, true, false);
                    break;
                case 3:
                    callDateAndTimeContainer(targetValue, dateDisplayElement, value, false, false, false, true, false);
                    break;
                default:
                    callDateAndTimeContainer(targetValue, dateDisplayElement, value, true, true, true, true, false);
                    break;
            }
        }
        //btn-decrease-the-value
    }
});

function numberPicker(readyValue = 0, minValue = 0, maxValue = 0, step = 0, targetElement_Id, displayElement_Id) {
    if (targetElement_Id != null || targetElement_Id != undefined) {
        readyValue = parseFloat(readyValue);
        step = parseFloat(step);
        readyValue += step;
        readyValue = readyValue >= parseFloat(minValue) ? readyValue : minValue;
        readyValue = readyValue <= parseFloat(maxValue) ? readyValue : maxValue;

        $("#" + targetElement_Id).val(readyValue);
        if (displayElement_Id != undefined) {
            readyValue = parseInt(readyValue) < 10 ? "0" + readyValue : readyValue;
            let elementExists = document.getElementById(displayElement_Id);
            if (elementExists != null) $("#" + display).html(readyValue);
            else $("." + displayElement_Id).html(readyValue);
        }
    }
}

function getWeek(currentDate = new Date()) {
    currentDate = new Date(currentDate);
    let weekIndex = 1;
    let thisYear = new Date(currentDate.getFullYear(), 0, 1);

    for (let i = thisYear; i < currentDate; i.setDate(i.getDate() + 1)) {
        if (i.getDay() == 0) weekIndex++;
    }
    return weekIndex;
}

function calendarUpdate(startDateInfo = new Date(), endDateInfo = new Date()) {
    endDateInfo = new Date(endDateInfo);
    startDateInfo = new Date(startDateInfo);

    let dates = {
        weeks: [],
        days: []
    };
    let current = startDateInfo;

    while (current <= endDateInfo) {
        dates.days.push(current.toDateString());
        current.setDate(current.getDate() + 1);
    }

    if (dates.days.length > 0) {
        let loopDate;
        let loopWeekIndex = 0;
        for (let i = 0; i < dates.days.length; i++) {
            loopDate = new Date(dates.days[i]);
            loopWeekIndex = getWeek(loopDate);
            dates.weeks.push(loopWeekIndex);
        }
        return dates;
    }
    else return null;
}

function calendarUIUpdate(calendarDaysArr = [], calendarWeeksArr = [], mainDisplayBox_Id, weekDisplayBox_Id) {
    if ((calendarDaysArr.length > 0 && calendarWeeksArr.length > 0) && (mainDisplayBox_Id != null || mainDisplayBox_Id != undefined) && (weekDisplayBox_Id != null || weekDisplayBox_Id != undefined)) {
        let currentWeekIndex = 0;
        let zeroDate = new Date(calendarDaysArr[0]);  
        let finalDate = new Date(calendarDaysArr[calendarDaysArr.length - 1]);
        const initialMonthIndex = finalDate.getMonth();

        if (parseInt(zeroDate.getDay()) != 1) {
            let zeroLengthIndex = zeroDate.getDay() == 0 ? 7 : zeroDate.getDay();
            for (let i = 1; i < zeroLengthIndex; i++) {
                let reverseDate = new Date(zeroDate).setDate(zeroDate.getDate() - i -1);
                calendarWeeksArr.unshift(calendarWeeksArr[0]);
                calendarDaysArr.unshift(new Date(reverseDate).toDateString());
            }
        }
        if (finalDate.getDay() > 0) {
            for (let i = 0; i < 7 - finalDate.getDay(); i++) {
                let futureDate = new Date(finalDate).setDate(finalDate.getDate() + i + 1);
                calendarDaysArr.push(new Date(futureDate).toDateString());
                calendarWeeksArr.push(calendarWeeksArr[calendarWeeksArr.length - 1]);
            }
        }

        $("#" + mainDisplayBox_Id).empty();
        for (let i = 0; i < calendarWeeksArr.length; i++) {
            let weekRowBox = null;
            if (calendarWeeksArr[i] != currentWeekIndex) {
                currentWeekIndex = calendarWeeksArr[i];
                weekRowBox = elementDesigner("div", "row", null);
                weekRowBox.attr("id", currentWeekIndex + "-" + weekDisplayBox_Id);
                $("#" + mainDisplayBox_Id).append(weekRowBox);
            }
        }

        for (let i = 0; i < calendarDaysArr.length; i++) {
            let dayBtn = null;
            let dayDate = null;
            let dayWeekIndex = 0;
            let weekDayColumn = null;

            for (let j = 0; j < 6; j++) {
                dayWeekIndex = calendarWeeksArr[i];
                dayDate = new Date(calendarDaysArr[i]);
                weekDayColumn = elementDesigner("div", "col", null);
                weekDayColumn.attr("id", dayWeekIndex + dayDate.getDate() + "-DTP_Col_Box");

                dayBtn = elementDesigner("button", "btn btn-date-time-picker", dayDate.getDate());
                if (dayDate.getMonth() != initialMonthIndex) dayBtn.addClass("passive");
                dayBtn.attr("data-display", "day-span");
                dayBtn.attr("data-val", dayDate.getDate());
                dayBtn.attr("id", dayWeekIndex.toString() + dayDate.getDate() + "-DTP_Day_Val");
                weekDayColumn.append(dayBtn);

                $("#" + dayWeekIndex + "-" + weekDisplayBox_Id).append(weekDayColumn);
                break;
            }
        }
    }
}

function slideElements(byClassName = false, closingElement_Id, openingElement_Id, type = 0) {
    let activeClass = "active";
    let pendingClass = "pending";
    if (type == 0) {
        activeClass = "active";
        pendingClass = "pending";
    }
    else {
        activeClass = "type1-active";
        pendingClass = "type1-pending";
    }

    if (byClassName) {
        $("." + closingElement_Id).removeClass(activeClass);
        $("." + closingElement_Id).addClass(pendingClass);
        setTimeout(function () {
            $("." + openingElement_Id).fadeIn(0);
            $("." + closingElement_Id).removeClass(pendingClass);
            $("." + openingElement_Id).addClass(pendingClass);
            $("." + closingElement_Id).fadeOut(0);
        }, 250);
        setTimeout(function () {
            $("." + openingElement_Id).removeClass(pendingClass);
            $("." + openingElement_Id).addClass(activeClass);
        }, 500);
    }
    else {
        $("#" + closingElement_Id).removeClass(activeClass);
        $("#" + closingElement_Id).addClass(pendingClass);
        setTimeout(function () {
            $("#" + openingElement_Id).fadeIn(0);
            $("#" + closingElement_Id).removeClass(pendingClass);
            $("#" + openingElement_Id).addClass(pendingClass);
            $("#" + closingElement_Id).fadeOut(0);
        }, 250);
        setTimeout(function () {
            $("#" + openingElement_Id).removeClass(pendingClass);
            $("#" + openingElement_Id).addClass(activeClass);
        }, 500);
    }
}

$(document).on("change keyup", ".form-control-distance", function () {
    let thisId = $(this).attr("id");
    //albumInfoSampler();
    if (thisId != undefined) {
        let thisValue = $(this).val();
        let isByAlert = $(this).attr("data-by-alert");
        let baseValue = $("#" + thisId + "-Base_Val").val();

        isByAlert = isByAlert == "true" ? true : false;
        baseValue = baseValue == undefined ? "" : baseValue;

        if (!isByAlert) {
            if (baseValue != thisValue) {
                $("#" + thisId + "-DistantSbmt_Btn").addClass("active");
                $("#" + thisId + "-DistantSbmt_Btn").html(' <i class="fa-solid fa-circle-exclamation"></i> Save');
            }
            else {
                $("#" + thisId + "-DistantSbmt_Btn").removeClass("active");
                $("#" + thisId + "-DistantSbmt_Btn").html(' <i class="fa-regular fa-circle-check"></i> Saved');
            }
        }
        else {
            let alert = $(this).attr("data-alert");
            let formId = $(this).attr("data-form");
            if (formId != undefined) {
                alert = alert != undefined ? alert : "You have unsaved changes. Do you want to save them?";
                if (baseValue != thisValue) {
                    callAlert('<i class="fa-regular fa-bell fa-shake" style="--fa-animation-delay: 0.35s; --fa-animation-duration: 0.75s; --fa-animation-iteration-count: 3;"></i>', "#f8f9fa", "#2b2b2b", alert, 7.5, ' <i class="fa-regular fa-circle-check"></i> Save', 3, formId);
                }
            }
        }
    }
});

const albumVersion = ["Regular", "Remastered", "Deluxe", "Extended", "Anniversary", "Live", "Instrumental", "Re-release", "Explicit", "Clean", "Special Edition"];

$(document).on("submit", "#EditAlbumVersion_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            uncallAlert();
            const versionStr = albumVersion[response.version];
            $("#AlbumInfo_Version_Val-BtnEdit").html(versionStr);
            setTimeout(function () {
                callKawaiiAlert(0, "Album version updated", '<i class="fa-regular fa-circle-check"></i>', null, null, 2, false);
            }, 600);
        }
        else {
            if(response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "You’ve selected the same version as the current one", 3.5, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Sign in to edit your albums and tracks", 3.5, "Close", -1, null);
        }
    });
});

$(document).on("submit", "#EditPremiereDate_Form", function (event) {
    event.preventDefault();
    const url = $(this).attr("action");
    const data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            uncallAlert();
            //albumInfoSampler();
            //btn-select-date
            const newDateInfo = new Date(response.date);
            $("#AlbumInfo_PremiereDate_Val_Span").html(newDateInfo.getFullYear());
            setTimeout(function () {
                callKawaiiAlert(0, "Album release date updated", '<i class="fa-regular fa-circle-check"></i>', null, null, 2, false);
            }, 600);
        }
        else {
            if (response.error == 0) callAlert('<i class="fa-regular fa-circle-xmark fa-shake" style="--fa-animation-duration: 0.5s; --fa-animation-iteration-count: 2; --fa-animation-delay: 0.35s;"></i>', null, null, "An unexpected error occurred. Please try again later", 3.75, "Close", -1, null);
            else callAlert('<i class="fa-solid fa-right-to-bracket fa-fade"></i>', null, null, "Sign in to edit your albums and tracks", 3.5, "Close", -1, null);
        }
    });
});

$(document).on("mousedown", ".btn-change-elements", function () {
    let closingElement = $(this).attr("data-close");
    let openingElement = $(this).attr("data-open");
    if (openingElement != undefined && closingElement != undefined) {
        let type = $(this).attr("data-anima-type");
        if ($("#" + openingElement).hasClass("slide-element") && $("#" + closingElement).hasClass("slide-element")) {
            slideElements(false, closingElement, openingElement, type == undefined ? 0 : type);
            if ($(this).hasClass('hide-text-bar')) swapToRegularNavbar();
        }
    }
});

$(document).on("mousedown", ".btn-solo-input", function () {
    let thisId = $(this).attr("id");
    let input = $(this).attr("data-input");
    if (input != undefined && thisId != undefined) {
        slideElements(false, thisId, input, 0);
        //albumInfoSampler();
        if ($(this).hasClass("call-text-editor")) {
            const textBoxId = $(this).attr("data-text-box");
            if (textBoxId != undefined) callTextCustomizationBar(textBoxId);
        }
    }
});

$(document).on("mousedown", ".btn-select-date", function () {
    let resultValElement = $(this).attr("data-result");
    if (resultValElement != undefined) {
        let initialDate = $(this).attr("data-initial");
        let displayLabel = $(this).attr("data-display");
        if (initialDate == undefined) callDateTimePicker(resultValElement, displayLabel, false);
        else {
            initialDate = new Date(initialDate);
            callDateTimePicker(resultValElement, displayLabel, false, initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate(), initialDate.getHours(), initialDate.getMinutes());
        }
    }
});

$(document).on("mousedown", ".btn-select-date-time", function () {
    let resultValElement = $(this).attr("data-result");
    if (resultValElement != undefined) {
        let initialDate = $(this).attr("data-initial");
        let displayLabel = $(this).attr("data-display");
        if (initialDate == undefined) callDateTimePicker(resultValElement, displayLabel, true);
        else {
            initialDate = new Date(initialDate);
            callDateTimePicker(resultValElement, displayLabel, true, initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate(), initialDate.getHours(), initialDate.getMinutes());
        }
    }
});

$(document).on("mousedown", ".btn-apply-date-time", function () {
    let resultElement = $(this).attr("data-result");
    if (resultElement != undefined) {
        let yearValue = $("#DTP_Year_Val").val();
        let monthValue = $("#DTP_Month_Val").val();
        let dayValue = $("#DTP_Day_Val").val();
        let hourValue = $("#DTP_Hour_Val").val();
        let minValue = $("#DTP_Min_Val").val();
        let displayResultElement = $(this).attr("data-display");
        let formedDate = new Date(yearValue, --monthValue, dayValue, hourValue, minValue, 0, 0);
        $("#" + resultElement).val(formedDate.toISOString());

        formedDate = (hourValue > 0 && minValue >= 0) ? dateAndTimeCompiller(userLocale, formedDate.getDate(), formedDate.getDay(), formedDate.getMonth(), formedDate.getFullYear(), formedDate.getHours(), formedDate.getMinutes(), true, true) : dateAndTimeCompiller(userLocale, formedDate.getDate(), formedDate.getDay(), formedDate.getMonth(), formedDate.getFullYear(), formedDate.getHours(), formedDate.getMinutes(), false, true);

        if (displayResultElement != undefined || displayResultElement != null) {
            let divExists = document.getElementById(displayResultElement);
            if (divExists) $("#" + displayResultElement).html(formedDate);
            else $("." + displayResultElement).html(formedDate);
        }
        uncallDateTimePicker();
        $("#" + resultElement).change();
    }
});

function callDateTimePicker(resultValueElement_Id, displayLabelElement_Id, showTheClock = true, initialYear, initialMonth, initialDay, initialHour, initialMinute) {
    if (resultValueElement_Id != null || resultValueElement_Id != undefined) {
        let todayDate = new Date();
        let bottomH = alertBottomValue;

        initialYear = initialYear == null ? todayDate.getFullYear() : initialYear;
        initialMonth = initialMonth == null ? todayDate.getMonth() - 1 : --initialMonth;
        initialDay = initialDay == null ? todayDate.getDate() : initialDay;
        initialHour = initialHour == null ? todayDate.getHours() : 12;
        initialMinute = initialMinute == null ? todayDate.getMinutes() : "00";
        let monthName = monthsArr[++initialMonth];
        let startDate = new Date(initialYear, initialMonth, 0, 0, 0, 0, 0);
        let endDate = new Date(initialYear, ++initialMonth, 0, 0, 0, 0, 0);

        let dayWeekIndex = getWeek(todayDate);
        dayWeekIndex = todayDate.getDay() == 0 ? --dayWeekIndex : dayWeekIndex;

        let divExists = document.getElementById("DateTimePicker_Box");
        if (divExists == null) $("body").append('<div class="box-date-time-picker shadow-sm" id="DateTimePicker_Box"> <div class="d-none"> <input type="number" class="d-none" min="1" max="31" step="1" value="12" id="DTP_Day_Val" /> <input type="number" class="d-none" min="0" max="11" step="1" value="7" id="DTP_Month_Val" /> <input type="number" class="d-none" min="1750" max="2050" value="2025" step="1" id="DTP_Year_Val" /> </div> <div class="box-date-time-picker-bones slide-box" id="DateTimePicker_Main_Box"> <div class="box-standard hstack gap-2"> <button type="button" class="btn btn-standard-rounded btn-load-prev-month me-1" id="ToPreviousMonth_Btn" data-display="month-span"> <i class="fa-solid fa-chevron-left"></i> </button> <button type="button" class="btn btn-standard-rounded btn-load-next-month me-1" id="ToNextMonth_Btn" data-display="month-span"> <i class="fa-solid fa-chevron-right"></i> </button> <div class="text-center mx-auto me-auto"> <span class="h6" id="DTP_Result_Lbl"><span class="month-span">July</span> <span class="day-span">12</span><span class="year-span" style="display: none;"> 2025</span></span><span class="text-muted time-span fw-normal">, <span class="hour-span">20</span>:<span class="min-span">00</span></span> </div> <div> <button type="button" class="btn btn-standard-rounded btn-apply-date-time me-1"> <i class="fa-solid fa-check"></i> </button> <button type="button" class="btn btn-standard-rounded btn-close-date-time ms-auto"> <i class="fa-solid fa-xmark"></i> </button> </div> </div> <div class="box-standard mx-auto text-center"> <div class="row" id="WeekDays_Row_Box"> <div class="col"> <small class="date-time-picker-header">Mon</small> </div> <div class="col"> <small class="date-time-picker-header">Tue</small> </div> <div class="col"> <small class="date-time-picker-header">Wed</small> </div> <div class="col"> <small class="date-time-picker-header">Thu</small> </div> <div class="col"> <small class="date-time-picker-header">Fri</small> </div> <div class="col"> <small class="date-time-picker-header">Sat</small> </div> <div class="col"> <small class="date-time-picker-header">Sun</small> </div> </div> </div> <div class="box-standard mx-auto mt-1" id="MonthDays_Row_Box"> </div> <div class="box-standard hstack gap-2 bottom-0 mt-3"> <button type="button" class="btn btn-standard-bolded btn-to-year-month-edit btn-change-boxes text-start" data-close="DateTimePicker_Main_Box" data-open="DateTimePicker_Aux_Box" id="YearMonthInstantEdit_Btn"><span class="h6 month-span" id="YearMonth_Result_Lbl">July</span> <small class="card-text text-muted"><i class="fa-solid fa-angle-right"></i></small><br /><small class="card-text text-muted year-span d-block" id="YearResult_Span">2025</small></button> <div class="box-standard text-center ms-auto" id="TimeMin_Select_Box"> <div class="row"> <div class="col"> <span class="date-time-picker-header">Hour</span> </div> <div class="col"> <span class="date-time-picker-header">Min</span> </div> </div> <div class="row mt-1"> <div class="col"> <input type="number" class="form-control time-form-control d-inline me-1" min="0" max="24" value="20" step="1" placeholder="Hour" id="DTP_Hour_Val" data-target="DTP_Hour_Val" data-display="hour-span" /> </div> <div class="col"> <input type="number" class="form-control time-form-control" min="0" max="59" value="00" step="1" placeholder="Min" id="DTP_Min_Val" data-target="DTP_Min_Val" data-display="min-span" /> </div> </div> </div> </div> </div> <div class="box-date-time-picker-skin slide-box re-scaled" id="DateTimePicker_Aux_Box" style="display: none;"> <div class="box-standard hstack gap-2"> <button type="button" class="btn btn-standard-rounded btn-to-date-time-picker btn-change-boxes" data-close="DateTimePicker_Aux_Box" data-open="DateTimePicker_Main_Box"> <i class="fa-solid fa-angle-left"></i> Back</button> <span class="h6 mx-auto me-auto"><span class="month-span">July</span>, <span class="year-span d-inline">2025</span></span> <button type="button" class="btn btn-standard-rounded btn-set-today">Today</button> </div> <div class="box-standard text-center mt-3"> <div class="row"> <div class="col"> <button type="button" class="btn btn-standard-rounded btn-load-prev-month text-center w-100 mb-2" data-display="month-span"> <i class="fa-solid fa-angle-up"></i> </button> <span class="date-time-picker-header month-span text-dark">July</span> <button type="button" class="btn btn-standard-rounded btn-load-next-month text-center w-100 mt-2" data-display="month-span"> <i class="fa-solid fa-angle-down"></i> </button> </div> <div class="col"> <button type="button" class="btn btn-standard-rounded btn-load-prev-year text-center w-100 mb-2" data-display="year-span"> <i class="fa-solid fa-angle-up"></i> </button> <span class="date-time-picker-header year-span text-dark d-block">2025</span> <button type="button" class="btn btn-standard-rounded btn-load-next-year text-center w-100 mt-2" data-display="year-span"> <i class="fa-solid fa-angle-down"></i> </button> </div> </div> </div> </div> </div>');

        let updatedCalendar = calendarUpdate(startDate, endDate);
        if (updatedCalendar != null) calendarUIUpdate(updatedCalendar.days, updatedCalendar.weeks, "MonthDays_Row_Box", "Week_Row_Box");
        $("#DTP_Year_Val").val(initialYear);
        $("#DTP_Month_Val").val(initialMonth);
        $("#DTP_Day_Val").val(initialDay);

        if (showTheClock) {
            $(".time-span").fadeIn(0);
            $("#DTP_Hour_Val").val(initialHour);
            $("#DTP_Min_Val").val(initialMinute);
            $("#TimeMin_Select_Box").fadeIn(0);
        }
        else {
            $("#DTP_Min_Val").val(0);
            $("#DTP_Hour_Val").val(0);
            $(".time-span").fadeOut(0);
            $("#TimeMin_Select_Box").fadeOut(0);
        }

        $(".day-span").html(initialDay);
        $(".year-span").html(initialYear);
        $(".month-span").html(monthName);
        $(".hour-span").html(initialHour < 10 ? "0" + initialHour : initialHour);
        $(".min-span").html(initialMinute < 10 ? "0" + initialMinute : initialMinute);

        $(".btn-date-time-picker").removeClass("active");
        $("#" + dayWeekIndex.toString() + initialDay + "-DTP_Day_Val").addClass("active");

        $("body").append("<div class='box-select-overlay'></div>");
        $(".box-select-overlay").addClass("active");
        $("#DateTimePicker_Box").fadeIn(0);
        $("#DateTimePicker_Box").css("bottom", bottomH + 45 + "px");
        setTimeout(function () {
            $("#DateTimePicker_Box").addClass("active");
            $("#DateTimePicker_Box").css("bottom", bottomH - 30 + "px");
        }, 300);
        setTimeout(function () {
            $("#DateTimePicker_Box").css("bottom", bottomH + "px");
        }, 600);

        $(".btn-apply-date-time").attr("data-result", resultValueElement_Id);
        if (displayLabelElement_Id != undefined || displayLabelElement_Id != null) $(".btn-apply-date-time").attr("data-display", displayLabelElement_Id);
        else $(".btn-apply-date-time").removeAttr("data-display");
    }
}

function uncallDateTimePicker() {
    let bottomH = alertBottomValue;
    $("#DateTimePicker_Box").css("bottom", bottomH + 60 + "px");
    setTimeout(function () {
        $(".box-select-overlay").removeClass("active");
        $("#DateTimePicker_Box").css("bottom", "-1200px");
    }, 300);
    setTimeout(function () {
        $(".box-select-overlay").remove();
        $("#DateTimePicker_Box").fadeOut(0);
        $("#DateTimePicker_Box").removeClass("active");
    }, 600);
}

$(document).on("change", "input[type=number]", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let minValue = $("#" + target).attr("min");
        let maxValue = $("#" + target).attr("max");
        let display = $("#" + target).attr("data-display");
        let readyValue = $("#" + target).val();

        numberPicker(readyValue, minValue, maxValue, 0, target, display);
    }
});

$(document).on("mousedown", ".btn-close-date-time", function () {
    uncallDateTimePicker();
});

$(document).on("mousedown", ".btn-load-prev-month", function () {
    let currentYear = $("#DTP_Year_Val").val();
    let currentMonth = $("#DTP_Month_Val").val() - 1;
    let currentDay = $("#DTP_Day_Val").val();
    let nextYear = currentYear;
    let nextMonth = currentMonth;

    let display = $(this).attr("data-display");
    let realTimeYear = new Date().getFullYear();

    currentMonth--;
    if (currentMonth < 0) {
        currentYear--;
        currentMonth = 11;
    }
    let monthName = monthsArr[currentMonth];
    let currentMonthThisDayInfo = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
    let newDateInfo = new Date(currentYear, currentMonth, 0, 0, 0, 0, 0);
    let nextMonthInfo = new Date(nextYear, nextMonth, 0, 0, 0, 0, 0);

    $("#DTP_Year_Val").val(currentYear);
    $("#DTP_Month_Val").val(++currentMonth);

    let updatedCalendar = calendarUpdate(newDateInfo, nextMonthInfo);
    if (updatedCalendar != null) calendarUIUpdate(updatedCalendar.days, updatedCalendar.weeks, "MonthDays_Row_Box", "Week_Row_Box");

    if (display != undefined) {
        let divExists = document.getElementById(display);
        if (divExists != null) $("#" + display).html(monthName);
        else $("." + display).html(monthName);

        $(".year-span").html(" " + currentYear);
        if (currentYear != realTimeYear) $(".year-span").fadeIn(0);
        else $(".year-span").fadeOut(0);
    }

    let dayWeekIndex = getWeek(currentMonthThisDayInfo);
    $(".btn-date-time-picker").removeClass("active");
    $("#" + dayWeekIndex + currentDay + "-DTP_Day_Val").addClass("active");
});

$(document).on("mousedown", ".btn-load-next-month", function () {
    let currentYear = $("#DTP_Year_Val").val();
    let currentMonth = parseInt($("#DTP_Month_Val").val()) - 1;
    let currentDay = $("#DTP_Day_Val").val();
    let prevYear = currentYear;
    let prevMonth = currentMonth;

    let display = $(this).attr("data-display");
    let realTimeYear = new Date().getFullYear();

    currentMonth++;
    if (currentMonth >= 11) {
        currentMonth = 0;
        currentYear++;
    }

    let monthName = monthsArr[currentMonth];
    let newMonthThisDayInfo = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 0);
    let newDateInfo = new Date(currentYear, ++currentMonth, 0, 0, 0, 0, 0);
    let prevMonthInfo = new Date(prevYear, ++prevMonth, 0, 0, 0, 0, 0);

    let updatedCalendar = calendarUpdate(prevMonthInfo, newDateInfo);
    if (updatedCalendar != null) calendarUIUpdate(updatedCalendar.days, updatedCalendar.weeks, "MonthDays_Row_Box", "Week_Row_Box");

    $("#DTP_Year_Val").val(currentYear);
    $("#DTP_Month_Val").val(currentMonth);
    if (display != undefined) {
        let divExists = document.getElementById(display);
        if (divExists != null) $("#" + display).html(monthName);
        else $("." + display).html(monthName);

        $(".year-span").html(" " + currentYear);
        if (currentYear != realTimeYear) $(".year-span").fadeIn(0);
        else $(".year-span").fadeOut(0);
    }

    let dayWeekIndex = getWeek(newMonthThisDayInfo);
    $(".btn-date-time-picker").removeClass("active");
    $("#" + dayWeekIndex + currentDay + "-DTP_Day_Val").addClass("active");
});

$(document).on("mousedown", ".btn-load-prev-year", function () {
    let currentYear = parseInt($("#DTP_Year_Val").val()) - 1;
    let currentMonth = $("#DTP_Month_Val").val();
    let display = $(this).attr("data-display");

    $("#DTP_Year_Val").val(currentYear);
    $("#DTP_Month_Val").val(currentMonth);

    let prevYear = new Date(currentYear, currentMonth, 0, 0, 0, 0, 0);
    let nextMonthOfPrevYearDate = new Date(currentYear, ++currentMonth, 0, 0, 0, 0, 0);

    let updatedCalendar = calendarUpdate(prevYear, nextMonthOfPrevYearDate);
    if (updatedCalendar != null) calendarUIUpdate(updatedCalendar.days, updatedCalendar.weeks, "MonthDays_Row_Box", "Week_Row_Box");

    if (display != undefined) {
        let divExists = document.getElementById(display);
        if (divExists != null) $("#" + display).html(currentYear);
        else $("." + display).html(currentYear);
    }
});

$(document).on("mousedown", ".btn-load-next-year", function () {
    let currentYear = parseInt($("#DTP_Year_Val").val()) + 1;
    let currentMonth = $("#DTP_Month_Val").val();
    let display = $(this).attr("data-display");

    $("#DTP_Year_Val").val(currentYear);
    $("#DTP_Month_Val").val(currentMonth);

    let nextYear = new Date(currentYear, currentMonth, 0, 0, 0, 0, 0);
    let nextMonthOfPrevYearDate = new Date(currentYear, ++currentMonth, 0, 0, 0, 0, 0);

    let updatedCalendar = calendarUpdate(nextYear, nextMonthOfPrevYearDate);
    if (updatedCalendar != null) calendarUIUpdate(updatedCalendar.days, updatedCalendar.weeks, "MonthDays_Row_Box", "Week_Row_Box");

    if (display != undefined) {
        let divExists = document.getElementById(display);
        if (divExists != null) $("#" + display).html(currentYear);
        else $("." + display).html(currentYear);
    }
});

$(document).on("mousedown", ".btn-set-today", function () {
    let nowDate = new Date();
    let nowDateMonthFirst = new Date(nowDate.getFullYear(), nowDate.getMonth(), 0, 0, 0, 0);
    let nextMonthDate = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0, 0, 0, 0, 0);
    let dayWeekIndex = getWeek(nowDate);
    let updatedCalendar = calendarUpdate(nowDateMonthFirst, nextMonthDate);

    if (updatedCalendar != null) calendarUIUpdate(updatedCalendar.days, updatedCalendar.weeks, "MonthDays_Row_Box", "Week_Row_Box");
    $(".day-span").html(nowDate.getDate());
    $(".year-span").html(nowDate.getFullYear());
    $(".month-span").html(monthsArr[nowDate.getMonth()]);

    $(".btn-date-time-picker").removeClass("active");
    $("#DTP_Day_Val").val(nowDate.getDate());
    $("#DTP_Year_Val").val(nowDate.getFullYear());
    $("#DTP_Month_Val").val(nowDate.getMonth() + 1);

    dayWeekIndex = nowDate.getDay() == 0 ? --dayWeekIndex : dayWeekIndex;
    $("#" + dayWeekIndex.toString() + nowDate.getDate() + "-DTP_Day_Val").addClass("active");
});

$(document).on("mousedown", ".btn-reduce-the-value", function () {
    //btn-decrease-the-value
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let step = $("#" + target).attr("step");
        let minValue = $("#" + target).attr("min");
        let maxValue = $("#" + target).attr("max");
        let display = $("#" + target).attr("data-display");
        let readyValue = $("#" + target).val();

        numberPicker(readyValue, minValue, maxValue, step * -1, target, display);
    }
});
$(document).on("mousedown", ".btn-increase-the-value", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let step = $("#" + target).attr("step");
        let minValue = $("#" + target).attr("min");
        let maxValue = $("#" + target).attr("max");
        let display = $("#" + target).attr("data-display");
        let readyValue = $("#" + target).val();

        numberPicker(readyValue, minValue, maxValue, step, target, display);
    }
});

$(document).on("mousedown", ".btn-date-time-picker", function () {
    let thisValue = $(this).attr("data-val");
    let trueId = getTrueId($(this).attr("id"), true);
    if (trueId != undefined && thisValue != undefined) {
        let display = $(this).attr("data-display");

        $("#" + trueId).val(thisValue);
        $(".btn-date-time-picker").removeClass("active");
        $(this).addClass("active");
        if (display != undefined) {
            let divExists = document.getElementById(display);
            if (divExists != null) $("#" + display).html(thisValue);
            else $("." + display).html(thisValue);
        }
    }
});

//$("body").on("mousedown", function () {
//    callDateAndTimeContainer("Primary_Container", "YearMonthInstantEdit_Btn", new Date(), true, true, true, true, true);
//});

$(document).on("mousedown", ".btn-year-day-update", function () {
    let dayValue = $(this).attr("data-val");
    if (dayValue != undefined) {
        let formatType = $(this).attr("data-format-type");
        let newDayValue = new Date(dayValue);
        newDayValue = dateAndTimeFormation(formatType, newDayValue);
        $(".btn-year-day-update").removeClass("bg-chosen-bright");
        $(this).addClass("bg-chosen-bright");

        if (newDayValue != null) $(".calendar-chosen-dt-span").html(newDayValue[0]);
        else $(".calendar-chosen-dt-span").text("today");
    }
    else $(".calendar-chosen-dt-span").text("today");
});

$(document).on("mousedown", ".btn-dtformat-update", function () {
    let value = $(this).attr("data-val");
    if (value != undefined) {
        let formatType = $(this).attr("data-format-type");
        let newDayValue = new Date(dayValue);
        newDayValue = dateAndTimeFormation(formatType, newDayValue);
        $(".btn-dtformat-update").removeClass("bg-chosen-bright");
        $(this).addClass("bg-chosen-bright");

        if (newDayValue != null) $(".calendar-chosen-dt-span").html(newDayValue[0]);
        else $(".calendar-chosen-dt-span").text("today");
    }
    else $(".calendar-chosen-dt-span").text("today");
});

$(document).on("mousedown", ".btn-show-the-clock", function () {
    let type = $(this).attr("data-type");
    let targetValue = $(this).attr("data-target");
    if (targetValue != undefined) {
        let dateResultDisplay = $(this).attr("data-date-display");
        let currentYear = $(this).attr("data-current-year");
        currentYear = currentYear != undefined ? currentYear : 1000;
        let currentDate = new Date(currentYear);
        switch (parseInt(type)) {
            case 0:
                callDateAndTimeContainer(targetValue, dateResultDisplay, currentDate, true, true, true, true, true);
                break;
            case 1:
                callDateAndTimeContainer(targetValue, dateResultDisplay, currentDate, true, true, true, false, true);
                break;
            case 2:
                callDateAndTimeContainer(targetValue, dateResultDisplay, currentDate, true, false, false, true, true);
                break;
            case 3:
                callDateAndTimeContainer(targetValue, dateResultDisplay, currentDate, false, false, false, true, true);
                break;
            default:
                callDateAndTimeContainer(targetValue, dateResultDisplay, currentDate, true, true, true, true, true);
                break;
        }
        $(".form-control-date-year").attr("data-type", type);
        $(".form-control-date-year").attr("data-target", targetValue);
        $(".form-control-date-year").attr("data-date-display", dateResultDisplay);
    }
    //let endDate = new Date(endYear, endMonth, endDay);
    //if (currentYear == endYear && restrictPrevDaysForCurrentYear) endDate = startDate > endDate ? new Date(currentYear, 11, 31) : endDate;

    //for (let i = new Date(startDate); i < endDate; i.setDate(i.getDate() + 1)) {
    //    yearDays.push(new Date(i));
    //}
    //if (yearDays.length > 0) return yearDays;
    //else return null;
});

$(document).on("change", "#RAS_ReleaseDateTrigger_Val", function () {
    let result = $(this).val();
    result = dateAndTimeDeparser(result);

    if (result != null) $("#SPC_ReleaseYear_Span").html(", " + new Date(result).getFullYear());
    else $("#SPC_ReleaseYear_Span").html(", " + new Date().getFullYear());
});

$(document).on("mousedown", ".btn-clock-dt-reset", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let newDate = new Date();
        let display = $(this).attr("data-date-display");
        newDate = dateAndTimeParser(newDate.getDate(), newDate.getMonth(), newDate.getFullYear, newDate.getHours(), newDate.getMinutes());
        newDate.setMonth(newDate.getMonth() + 1);
        $("#" + target).val(newDate);
        if (display != undefined && display != null) {
            $("#" + display).val("Set for Today");
            $("#" + display).html("Set for Today");
            $(".date-and-time-display").change();
        }
        $(".btn-clock-dt-reset").addClass("super-disabled");
    }
});

$(document).on("mousedown", ".btn-calendar-submit", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let formatType = $("#CalendarYear_Val").attr("data-format-type");
        let dateResultDisplay = $(this).attr("data-date-display");
        let dayValue = $("#CalendarDay_Val").val();
        let monthValue = $("#CalendarMonth_Val").val();
        let yearValue = $("#CalendarYear_Val").val();
        let hrValue = $("#CalendarHr_Val").val();
        let minValue = $("#CalendarMin_Val").val();

        let newDayValue = dateAndTimeFormation(formatType, new Date(yearValue, monthValue, dayValue, hrValue, minValue));
        if (newDayValue != null) {
            if (newDayValue[0] != null) $("#" + target).val(newDayValue[0]);
            if (newDayValue[1] != null) {
                $("#" + target + "-Year").val(parseInt(newDayValue[1][2]));
                $("#" + target + "-Month").val(parseInt(newDayValue[1][1]));
                $("#" + target + "-Day").val(parseInt(newDayValue[1][0]));
                $("#" + target + "-Hour").val(parseInt(newDayValue[1][3]));
                $("#" + target + "-Min").val(parseInt(newDayValue[1][4]));
            }
        }
        else $("#" + target).val(null);
        if (newDayValue != null && dateResultDisplay != undefined) {
            $("#" + dateResultDisplay).val("Set for " + newDayValue[0]);
            $("#" + dateResultDisplay).html("Set for " + newDayValue[0]);
        }
        $(".btn-clock-dt-reset").removeClass("super-disabled");
        $(".date-and-time-display").change();
        uncallAContainer(false, "DateAndTime_Container");
    }
    uncallAContainer(false, "DateAndTime_Container");
});

$("#UpdateSearchname_Searchname_Val").on("change", function () {
    sentRequest = null;

    $("#UpdateSearchname_Status_Span").html(' <i class="fa-solid fa-circle-notch"></i> Updating (tap to cancel)');
    sentRequest = waitCounter("UpdateSearchname_Status_Span", 2.5).then(function () {
        if (sentRequest) $("#ProfileUpdateSearchname_Form").submit();
    });
});
$("#UpdateSearchname_Status_Span").on("mousedown", function () {
    let baseValue = $("#UpdateSearchname_Searchname_Val").attr("data-base-value");
    if (baseValue != undefined) {
        sentRequest = null;
        $("#UpdateSearchname_Searchname_Val").val(baseValue);
        $("#UpdateSearchname_Status_Span").fadeOut(300);
    }
});

$(document).on("change", "#RAS_CoverImg_Url", function () {
    let firstImg = $(this).get(0).files[0];
    if (firstImg != null || firstImg != undefined) {
        $("#SPC_Img").attr("src", window.URL.createObjectURL(firstImg));
        $("#SPC_Img_Box").fadeOut(0);
        $("#SPC_Img").fadeIn(0);
        $("#RAS_AddCoverImg_Btn").addClass("super-disabled");
        $("#RAS_RemoveCoverImg_Btn").removeClass("super-disabled");
        $("#RAS_AddCoverImg_Btn").html(' <i class="fa-solid fa-check-double"></i> Thumbnail is Set');
    }
    else {
        $("#SPC_Img").fadeOut(0);
        $("#SPC_Img_Box").fadeIn(0);
        $("#SPC_Img").attr("src", "#");
        $("#RAS_AddCoverImg_Btn").removeClass("super-disabled");
        $("#RAS_RemoveCoverImg_Btn").addClass("super-disabled");
        $("#RAS_AddCoverImg_Btn").html(' <i class="fa-solid fa-image"></i> Upload Cover');
        fileRenewer("RAS_CoverImg_Url", null, 6, true);
    }
});

$(document).on("mousedown", "#RAS_RemoveCoverImg_Btn", function () {
    fileRenewer("RAS_CoverImg_Url", new DataTransfer(), 6, true);
    $("#RAS_CoverImg_Url").change();
});

$(document).on("mousedown", ".btn-reorder", function () {
    let postIdValue = getTrueId($(this).attr("id"), true);
    let reorderTarget = $(this).attr("data-reorder-target");
    let currentOrder = parseInt(getTrueId($(this).attr("id")));
    let maxOrder = parseInt($(this).attr("data-max-order"));
    let triggerTarget = $(this).attr("data-trigger");
    if (postIdValue != undefined && reorderTarget != undefined && triggerTarget != undefined) {
        let files = $("#" + reorderTarget).get(0).files;
        let isAudio = $(this).attr("data-is-audio");
        if (currentOrder < maxOrder) {
            let tempOrder = currentOrder + 1;
            maxOrder = currentOrder + 2;
            $(this).html(maxOrder);
            $("#" + tempOrder + postIdValue).attr("id", currentOrder + postIdValue);
            $(this).attr("id", tempOrder + postIdValue);
            $("#" + currentOrder + postIdValue).html(tempOrder);

            let dataTransfer = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
                if (i == currentOrder) {
                    dataTransfer.items.add(files[tempOrder]);
                }
                else if (i == tempOrder) {
                    dataTransfer.items.add(files[currentOrder]);
                }
                else dataTransfer.items.add(files[i]);
            }
            if (isAudio != undefined) audioPreviewer(dataTransfer.files, triggerTarget, reorderTarget, true, false);
            else imagePreviewer(dataTransfer.files, triggerTarget, reorderTarget, true, false);
            fileRenewer(reorderTarget, dataTransfer, 6, "ImagePreview_Container");
        }
        else {
            currentOrder = maxOrder + 1;
            $(this).html(1);
            $("#0" + postIdValue).attr("id", maxOrder + postIdValue);
            $(this).attr("id", "0" + postIdValue);
            $("#" + maxOrder + postIdValue).html(currentOrder);

            let dataTransfer = new DataTransfer();
            for (let i = 0; i < files.length; i++) {
                if (i == 0) {
                    dataTransfer.items.add(files[currentOrder]);
                }
                else if (i == currentOrder) {
                    dataTransfer.items.add(files[0]);
                }
                else dataTransfer.items.add(files[i]);
            }
            if (isAudio != undefined) audioPreviewer(dataTransfer.files, triggerTarget, reorderTarget, true, false);
            else imagePreviewer(dataTransfer.files, triggerTarget, reorderTarget, true, false);
            fileRenewer(reorderTarget, dataTransfer, 6, "ImagePreview_Container");
        }
    }
/*    else {*/
        //let currentFileIndex = getTrueId($(this).attr("id"));
        //if (currentFileIndex != undefined) {
        //    let newDataTransfer = new DataTransfer();
        //    let currentFiles = $("#EditImage_Files_Val").get(0).files;
        //    for (let i = 0; i < currentFiles.length; i++) {
        //        if (i != currentFileIndex) {
        //            newDataTransfer.items.add(currentFiles[i]);
        //        }
        //    }
        //    uncallAContainer(false, "ImagePreview_Container");
        //    setTimeout(function () {
        //        fileRenewer("EditImage_Files_Val", newDataTransfer, 6, null);
        //    }, 600);
        //}
/*    }*/
});

$(document).on("mousedown", ".btn-delete-from-order", function () {
    let currentFileIndex = getTrueId($(this).attr('id'));
    let reorderTarget = $(this).attr("data-reorder-target");
    let triggerTarget = $(this).attr("data-trigger");
    if (currentFileIndex != undefined && reorderTarget != undefined && triggerTarget) {
        let currentFiles = $("#" + reorderTarget).get(0).files;
        let dataTransfer = new DataTransfer();
        if (parseInt(currentFiles.length) > 1) {
            for (let i = 0; i < currentFiles.length; i++) {
                if (i != currentFileIndex) dataTransfer.items.add(currentFiles[i]);
            }
            imagePreviewer(dataTransfer.files, triggerTarget, reorderTarget, true, false);
            fileRenewer(reorderTarget, dataTransfer, 6, "ImagePreview_Container");
        }
        else imagePreviewer(null, triggerTarget, reorderTarget, true, false);
    }
});

$(document).on("mousedown", ".btn-save-images", function () {
    let saveFormId = getTrueId($(this).attr("id"));
    if (saveFormId != undefined) {
        $("#" + saveFormId).submit();
    }
});

//$(document).on("mousedown", "input[type='file']", function () {
//    let thisId = $(this).attr("id");
//    if (thisId != undefined) $("#" + thisId).click();
//}); EditAlbumCoverImage_Form

let tempInputFiles = null;

$(document).on("click", "input[type='file']", function () {
    let currentFiles = $(this).get(0).files;
    if (currentFiles.length > 0) {
        tempInputFiles = currentFiles;
    }
    else tempInputFiles = null;
});

$(document).on("input", "input[type='file']", function () {
    let thisId = $(this).attr("id");
    let files = $("#" + thisId).get(0).files;
    let trigger = $(this).attr("data-trigger");
    let previewElement = $(this).attr("data-preview");
    let areAudio = false;

    if (files != undefined) {
        for (let i = 0; i < files.length; i++) {
            let fileType = getFileExtension(files[i].name);
            if (fileType == ".mp3" || fileType == ".ogg" || fileType == ".wav" || fileType == ".aac" || fileType == ".flac" || fileType == ".m4a") {
                areAudio = true;
                break;
            }          
        }

        let isMultiple = $(this).attr("multiple");
        let updateBtn = $(this).attr('data-update-btn');
        let dataPreview = $(this).attr("data-preview");
        let orderTarget = $(this).attr("data-order-target");
        if (isMultiple != undefined) {
            if (!areAudio) {
                if (previewElement == undefined || previewElement == null || previewElement == "") {
                    imagePreviewer(files, trigger != undefined ? trigger : null, orderTarget, true, true, dataPreview);
                    $("#" + previewElement + "-DeletePreviewImg_Btn").addClass("super-disabled");
                }
                else {
                    if (files.length > 0) {
                        let imagePreviewUrl = window.URL.createObjectURL(files[0]);
                        $("#" + previewElement).attr("src", imagePreviewUrl);
                        $("#" + previewElement).fadeIn(0);
                        $("#" + previewElement + "_Box").fadeOut(0);
                        $("#" + previewElement + "-DeletePreviewImg_Btn").removeClass("super-disabled");
                    }
                    else {
                        $("#" + previewElement).fadeOut(0);
                        $("#" + previewElement + "_Box").fadeIn(0);
                        $("#" + previewElement + "-DeletePreviewImg_Btn").addClass("super-disabled");
                    }
                }
            }
            else audioPreviewer(files, trigger != undefined ? trigger : null, orderTarget, true, true);
        }
        else {
            if (!areAudio) {
                if (previewElement == undefined || previewElement == null || previewElement == "")
                {
                    imagePreviewer(files, trigger != undefined ? trigger : null, orderTarget, false, true, dataPreview);
                    $("#" + previewElement + "-DeletePreviewImg_Btn").addClass("super-disabled");
                }
                else {
                    if (files.length > 0) {
                        let imagePreviewUrl = window.URL.createObjectURL(files[0]);
                        $("#" + previewElement).attr("src", imagePreviewUrl);
                        $("#" + previewElement).fadeIn(0);
                        $("#" + previewElement + "_Box").fadeOut(0);
                        $("#" + previewElement + "-DeletePreviewImg_Btn").removeClass("super-disabled");
                    }
                    else {
                        $("#" + previewElement).fadeOut(0);
                        $("#" + previewElement + "_Box").fadeIn(0);
                        $("#" + previewElement + "-DeletePreviewImg_Btn").addClass("super-disabled");
                    }
                }
            }
            else audioPreviewer(files, trigger != undefined ? trigger : null, orderTarget, false, true);
        }

        if (updateBtn != undefined) bubbleIn(false, updateBtn, true);
    }
});

function bubbleIn(byClassname = false, elementId, showFlexed = false) {
    if (elementId != undefined || elementId != null) {
        if (!byClassname) {
            $("#" + elementId).fadeIn(300);
            $("#" + elementId).removeClass("hidden");
            $("#" + elementId).addClass("bubble-show show");
            if (showFlexed) $("#" + elementId).addClass("d-inline");
            setTimeout(function () {
                $("#" + elementId).removeClass("show");
            }, 250);
        }
        else {
            $("." + elementId).fadeIn(300);
            $("." + elementId).removeClass("hidden");
            $("." + elementId).addClass("bubble-show show");
            if (showFlexed) $("." + elementId).addClass("d-inline");
            setTimeout(function () {
                $("." + elementId).removeClass("show");
            }, 250);
        }
    }
}

function bubbleOut(byClassname = false, elementId) {
    if (elementId != undefined || elementId != null) {
        if (!byClassname) {
            $("#" + elementId).addClass("show");
            setTimeout(function () {
                $("#" + elementId).removeClass("show");
                $("#" + elementId).addClass("hidden");
                $("#" + elementId).removeClass("d-inline");
                $("#" + elementId).fadeOut(300);
            }, 250);
        }
        else {
            $("." + elementId).addClass("show");
            setTimeout(function () {
                $("." + elementId).removeClass("show");
                $("." + elementId).addClass("hidden");
                $("." + elementId).removeClass("d-inline");
                $("." + elementId).fadeOut(300);
            }, 250);
        }
    }
}


$(document).on("mousedown", ".btn-input-file-emptier", function () {
    let thisId = $(this).attr("id");
    let trueId = getTrueId(thisId, true);
    let target = $(this).attr("data-target");

    if (target != undefined && thisId != undefined) {
        thisId = getTrueId(thisId, false);
        let dataTransfer = new DataTransfer();

        console.log(tempInputFiles);
        if (tempInputFiles != null && tempInputFiles.length > 0) {
            for (let i = 0; i < tempInputFiles.length; i++) {
                let f = tempInputFiles[i];
                dataTransfer.items.add(f);
            }
            tempInputFiles = null;
        }
        $("#" + target).val(null);
        bubbleOut(false, target + "-BtnSbmt");

        if (thisId != undefined) {
            if (dataTransfer.files.length > 0) {
                console.log(dataTransfer.files);
                //albumInfoSampler();
                $("#" + thisId).attr("src", window.URL.createObjectURL(dataTransfer.files[0]));
            }
            else {
                $("#" + thisId).fadeOut(0);
                $("#" + thisId).attr("src", "#");
                $("#" + thisId + "_Box").fadeIn(0);
            }

            if (trueId != undefined) {
                $("#" + trueId).fadeOut(0);
                $("#" + trueId).attr("src", "#");
                $("#" + trueId + "_Box").fadeIn(0);
            }
        }

        $(this).addClass("super-disabled");
    }
});

$(document).on("mousedown", ".btn-switcher", function () {
    let switchValue = $(this).attr("data-value");
    if (switchValue != undefined) {
        let trueText = $(this).attr("data-tt");
        let falseText = $(this).attr("data-ft");
        let currentValue = $("#" + switchValue).val();

        currentValue = currentValue == "false" ? false : true;
        currentValue = !currentValue;
        //btn-call-select
        trueText = trueText == undefined ? ' <i class="fa-regular fa-circle-check"></i> ' : trueText;
        falseText = falseText == undefined ? ' <i class="fa-regular fa-circle-xmark"></i> ' : falseText;

        $("#" + switchValue).val(currentValue);
        if (currentValue) $("#" + switchValue + "_Span").html(trueText);
        else $("#" + switchValue + "_Span").html(falseText);
    }
});

//Potential delete
//$(document).on("mousedown", ".btn-trigger", function () {
//    let triggerElement = $(this).attr("data-trigger");
//    if (triggerElement != undefined) {
//        $("#" + triggerElement).mousedown();
//    }
//});

//$(document).on("change", ".form-control-trigger", function () {
//    let triggeringElement = $(this).attr("data-trigger");
//    if (triggeringElement != undefined) {
//        let triggerActivationInterval = $(this).attr("data-trigger-interval");
//        let idleLabel = $(this).attr("data-idle-label");
//        if (idleLabel != undefined) {
//            let idleText = $(this).attr("data-idle-text");
//            if (idleText != undefined) $("#" + idleLabel).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + idleText);
//            else $("#" + idleLabel).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Pending...');
//        }

//        clearTimeout(timeoutValue);
//        triggerActivationInterval = triggerActivationInterval != undefined ? parseFloat(triggerActivationInterval) : 1.75;
//        $("#" + triggeringElement).val($(this).val());
//        timeoutValue = setTimeout(function () {
//            $("#" + triggeringElement).change();
//        }, triggerActivationInterval * 1000);
//    }
//});

$(document).on("mousedown", ".btn-open-container", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined || trueId != null) {
        slideContainers(null, trueId);
    }
});

$(document).on("mousedown", ".btn-open-inside-lg-card", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined || trueId != null) {
        callAContainer(null, trueId, false);
    }
});

$(document).on("mousedown", ".btn-open-sm-container", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined || trueId != null) {
        slideSmContainers(null, trueId);
    }
});

$(document).on("mousedown", ".btn-close-sm-container", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        uncallASmContainer(false, trueId);
    }
});

$(document).on("mousedown", ".btn-close-inside-lg-card", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        uncallLgInsideContainer(false, trueId);
    }
});

$(document).on("mousedown", ".btn-box-backslide", function () {
    let currentStep = $(this).attr("data-step");
    let currentTargetId = $(this).attr("data-target-id");

    backwardSlider(currentStep, currentTargetId);
});

$(document).on("mousedown", ".btn-previewer", function () {
    let titles = $(this).attr("data-titles");
    let content = $(this).attr("data-content");
    let previewerTitle = $(this).attr("data-previewer-title");
    titles = getCommaSeparatedValues(titles);
    content = getCommaSeparatedValues(content);

    contentPreviewer(titles, content, previewerTitle == undefined ? null : previewerTitle, true);
});

$(document).on("mousedown", ".btn-add-hint", function () {
    let valueElement = $(this).attr("data-value");
    if (valueElement != undefined) {
        let value = $("#" + valueElement).val();
        if (value.length > 0) {
            const allWhitespaceSequences = value.match(/\s{3,}/g);
            if (allWhitespaceSequences != null) {
                for (let i = 0; i < allWhitespaceSequences.length; i++) {
                    value = value.replaceAll(allWhitespaceSequences[i], "");
                }
            }
            value = value.replaceAll("\n", " \n ");
            value = textSplitter(value, " ");
            for (let i = 0; i < value.length; i++) {
                if (value[i] == "") continue;
                else if (value[i] != "\n") {
                    let hintPreparator = $("<span class='btn-hint-select'></span>");
                    hintPreparator.attr("id", i + "-UTL_HintText_Val");
                    hintPreparator.html(value[i]);
                    $("#HintPreview_Box").append(hintPreparator);
                }
                else {
                    let separator = $("<br/>");
                    $("#HintPreview_Box").append(separator);
                }
            }
        }
    }
});

$(document).on("mousedown", ".btn-form-replacer", function () {
    let valueTarget = $(this).attr("data-target");
    let initialTarget = $(this).attr("data-initial-target");
    let thisId = $(this).attr("id");
    if (valueTarget != undefined && initialTarget != undefined) {
        let trueId = getTrueId(thisId, false);
        let value = $("#" + trueId).val();
        let listFullValue = addToPseudolist(value, valueTarget);
        let listElementsArray = getCommaSeparatedValues(listFullValue);
        if (listElementsArray.length > 0) {
            for (let i = 0; i < listElementsArray.length; i++) {
                let element = elementDesigner("button", "btn btn-standard-bordered btn-form-unplacer btn-sm me-1", ' <i class="fa-solid fa-candy-cane"></i> ' + value.substring(0, value.indexOf(" ")));
                if (element != null) {
                    $("#" + trueId + "-Box").append(element);
                }
            }
        }
        $("#" + trueId).val(null);
    }
});

$(document).on("mousedown", ".btn-hint-select", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let trueId = getTrueId($(this).attr("id"), true);
        let result = addToPseudolist($(this).html(), trueId, '');
        if (result != null) {
            $("#" + trueId).val(result);
            $(this).removeClass("btn-hint-select");
            $(this).addClass("btn-hint-select-chosen");
        }
    }
});
$(document).on("mousedown", ".btn-hint-select-chosen", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let trueId = getTrueId($(this).attr("id"), true);
        let result = removeFromPseudolist($(this).html(), trueId, '');
        if (result != null) {
            $("#" + trueId).val(result);
            $(this).addClass("btn-hint-select");
            $(this).removeClass("btn-hint-select-chosen");
        }
    }
});

$(document).on("mouseenter", ".hint-span", function () {
    let thisId = $(this).attr("id");
    let thisHint = $(this).attr("data-hint");
    if (thisHint != undefined && thisId != undefined) {
        blur(thisId, 0.25);
        let thisHtml = $(this).html();
        let initialHintBox = $("<div class='box-hint-initial'></div>");
        let hintInitial = $("<small class='hint-initial-sm'></small>");
        let hintElement = $("<span class='card-text'></span>");
        let hintHtml = $("<span class='hint-description'></span>");

        initialHintBox.append(hintInitial);
        hintInitial.html(' <i class="fa-solid fa-candy-cane"></i> ' + thisHtml);
        hintHtml.html(thisHint);
        hintElement.append(initialHintBox);
        hintElement.append(hintHtml);

        $(this).html(null);
        $(this).append(hintElement);
        $(this).attr("data-text", thisHint);
        $(this).attr("data-hint", thisHtml);
    }
});
$(document).on("mouseleave", ".hint-span", function () {
    let thisId = $(this).attr("id");
    let thisText = $(this).attr("data-text");
    let thisHint = $(this).attr("data-hint");
    if (thisHint != undefined && thisId != undefined && thisText != undefined) {
        blur(thisId, 0.25);
        $(this).html(thisHint);
        $(this).attr("data-hint", thisText);
    }
});

$(document).on("mousedown", ".btn-play-pause-track", function () {
    let thisButtonId = $(this).attr("id");
    if (thisButtonId != undefined) {
        let element = $(this).attr("data-player");
        if (element == undefined) element = document.getElementById("OngakuPlayer_Audio");
        else element = document.getElementById(element);
        const elementId = element.id;

        if (element != null) {
            let playlistId = null;
            let isForPreview = $(this).attr("data-preview");
            if (isForPreview) {
                let objectSrc = $(this).attr("data-src");
                let objectTitle = $(this).attr("data-title");
                let trackId = $(this).attr("data-order-index");
                let currentSrc = document.getElementById(elementId).src;
 
                if ((objectSrc != undefined) && (currentSrc == objectSrc)) {
                    let currentTime = document.getElementById(elementId).currentTime;
                    audioPlay(elementId, objectSrc, playlistId, trackId, currentTime, objectTitle, "Track Preview", null);
                }
                else audioPlay(elementId, objectSrc, playlistId, trackId, 0, objectTitle, "Track Preview", null);
            }
            else {
                let thisId = $(this).attr("data-id");
                let currentTrackId = $("#OngakuPlayer_TrackId_Val").val();
                let currentPlaylistId = $("#OngakuPlayer_PlaylistId_Val").val();

                if (thisId == undefined) {
                    if (element.paused) audioContinue(elementId, currentTrackId);
                    else audioPause(elementId);
                }
                else {
                    if ((currentTrackId == thisId) && (playlistId == null || currentPlaylistId == playlistId)) {
                        if (!element.paused) audioPause(elementId);
                        else audioContinue(elementId, thisId);
                    }
                    else {
                        trackOrderInQueue = trackQueue.songs.indexOf(parseInt(thisId), 0);
                        trackOrderInQueue = trackOrderInQueue != -1 ? trackOrderInQueue : 0;
                        audioChange(elementId, playlistId, thisId);
                    }
                }
            }
        }
    }
    else buttonDisabler(false, thisButtonId, "");
});

$(document).on("mousedown", ".btn-ongaku-player-backward", function () {
    let trackId = $("#OngakuPlayer_TrackId_Val").val();
    let playlistId = $("#OngakuPlayer_PlaylistId_Val").val();
    if (playlistId != undefined && trackId != undefined) {
        let currentTime = document.getElementById("OngakuPlayer_Audio").currentTime;
        if (currentTime <= 3.5) {
            trackQueue.orderChanger = -1;
/*            audioEdit("OngakuPlayer_Audio", null, null, 1, null);*/
            let trackId = getTrackFromQueue(trackQueue.songs, trackOrderInQueue, trackQueue.orderChanger, trackQueue.autoPlay);
            if (trackId != null) audioChange("OngakuPlayer_Audio", playlistId, trackId);
        }
        else audioEdit("OngakuPlayer_Audio", 100, 1, false, 0);
    }
});

$(document).on("mousedown", ".btn-ongaku-player-forward", function () {
    let trackId = $("#OngakuPlayer_TrackId_Val").val();
    let playlistId = $("#OngakuPlayer_PlaylistId_Val").val();
    if (playlistId != undefined && trackId != undefined) {
        trackQueue.orderChanger = 1;
        let trackId = getTrackFromQueue(trackQueue.songs, trackOrderInQueue, trackQueue.orderChanger, trackQueue.autoPlay);
        if (trackId != null) audioChange("OngakuPlayer_Audio", playlistId, trackId);
    }
});

$(document).on("mousedown", ".ongaku-track-duration-line, .ongaku-track-duration-line-enlarged", function (event) {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let currentRect = document.getElementById(thisId).getBoundingClientRect();
        let totalDuration = document.getElementById("OngakuPlayer_Audio").duration;
        if (totalDuration != undefined) {
            const tapX = ((event.clientX - currentRect.x) / currentRect.width * 100);
            totalDuration = totalDuration * tapX / 100;
            audioEdit("OngakuPlayer_Audio", null, null, null, totalDuration);
        }
    }
});

$(document).on("mouseleave", ".ongaku-track-duration-line", function () {
    let audioPlayer = $(this).attr("data-audio-player");
    if (audioPlayer != undefined) {
        clearInterval(intervalValue);
        $("#OngakuPlayer_Forward_Btn").html(' <i class="fa-solid fa-forward"></i> ');
        $("#OngakuPlayer_Backward_Btn").html(' <i class="fa-solid fa-backward"></i>');
    }
});

$(document).on("mouseenter", ".ongaku-track-duration-line", function () {
    let audioPlayer = $(this).attr("data-audio-player");
    if (audioPlayer != undefined) {
        let durations = getAudioPlayerDuration(audioPlayer);
        if (durations != null) {
            let currentDurationInTime = secondsToRegularDuration(durations[0]);
            let timeLeft = secondsToRegularDuration(durations[1] - durations[0]);
            $("#OngakuPlayer_Forward_Btn").html("<span class='fw-500'>-" + timeLeft[0] + ":" + timeLeft[1] + "</span>");
            $("#OngakuPlayer_Backward_Btn").html("<span class='fw-500'>" + currentDurationInTime[0] + ":" + currentDurationInTime[1] + "</span>");
        }

        intervalValue = setInterval(function () {
            durations = getAudioPlayerDuration(audioPlayer);
            if (durations != null) {
                currentDurationInTime = secondsToRegularDuration(durations[0]);
                timeLeft = secondsToRegularDuration(durations[1] - durations[0]);
                $("#OngakuPlayer_Forward_Btn").html("<span class='fw-500'>-" + timeLeft[0] + ":" + timeLeft[1] + "</span>");
                $("#OngakuPlayer_Backward_Btn").html("<span class='fw-500'>" + currentDurationInTime[0] + ":" + currentDurationInTime[1] + "</span>");
            }
        }, 500);
    }
});

$("audio").on("ended", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        trackQueue.orderChanger = trackQueue.orderChanger < 0 ? 1 : trackQueue.orderChanger;
        let playlistId = $("#OngakuPlayer_PlaylistId_Val").val();
        let trackId = getTrackFromQueue(trackQueue.songs, trackOrderInQueue, trackQueue.orderChanger, trackQueue.autoPlay);
        if (trackId != null) audioChange("OngakuPlayer_Audio", playlistId, trackId);
        else {
            audioPause("OngakuPlayer_Audio");
            const playerType = $("#OngakuPlayer_Type_Val").val();
            if (playerType == 2) {
                $("#LyricSync_PreviousTimestamp_Val").val(0);
                callAlert('<i class="fa-regular fa-circle-check"></i>', null, null, "Check lyrics and timings, tap <kbd> <i class='fa-solid fa-check-double'></i> Save</kbd> to confirm. To re-sync lyrics, play from the start or update timings manually", 5.75, "Close", -1, null);
            }
        }
    }
});

$("audio").on("timeupdate", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let durationArr = audioDuration(thisId, false);
        let durationArrInSec = audioDuration(thisId, true);
        if (durationArr != null && durationArrInSec != null) {
            $(".ongaku-track-duration-current").text(durationArr[1][0] + ":" + durationArr[1][1]);
            $(".ongaku-track-duration-left").text("-" + durationArr[2][0] + ":" + durationArr[2][1]);
            $(".ongaku-track-current-duration-line").css("width", (durationArrInSec[1] / durationArrInSec[0] * 100) + "%");
            $(".ongaku-track-current-duration-line-enlarged").css("width", (durationArrInSec[1] / durationArrInSec[0] * 100) + "%");
        }
        else {
            //$(".ongaku-track-duration-current").text("--:--");
            //$(".ongaku-track-duration-left").text("--:--");
            //$(".ongaku-track-current-duration-line").css("width", 0);
            //$(".ongaku-track-current-duration-line-enlarged").css("width", 0);
        }
    }
    else {
        //$(".ongaku-track-duration-left").text("--:--");
        //$(".ongaku-track-duration-current").text("--:--");
        //$(".ongaku-track-current-duration-line").css("width", 0);
        //$(".ongaku-track-current-duration-line-enlarged").css("width", 0);
    }
});

$(document).on("keyup", ".form-control-guard", function () {
    let thisValue = $(this).val();
    let neccessaryChars = getCommaSeparatedValues($(this).attr("data-chars"));
    let minLength = $(this).attr("data-min-length");
    let target = $(this).attr("data-target");
    let result = checkTheInput(thisValue, minLength, neccessaryChars, target);
    if (result) $("#" + target).removeClass("super-disabled");
    else $("#" + target).addClass("super-disabled");

    let updateWidth = $(this).attr("data-update");
    updateWidth = getCommaSeparatedValues(updateWidth);
    if (updateWidth != undefined) {
        if (updateWidth.length > 0) {
            let baseValue = $(this).attr("data-base-value");
            for (let i = 0; i < updateWidth.length; i++) {
                if (baseValue != undefined) updateWithInput($(this).attr("id"), updateWidth[i], baseValue);
                else updateWithInput($(this).attr("id"), updateWidth[i], null);
            }
        } 
    }
});

$(document).on("keyup", ".form-control-checker", function () {
    let formBtn = $(this).attr("data-change");
    let baseHtml = $(this).attr("data-form-base-html");

    baseHtml = baseHtml == undefined ? "Not Defined" : baseHtml;
    if (formBtn != undefined) {
        let form = $(this).attr("data-form");
        let target = $(this).attr("data-form-target");
        let thisId = $(this).attr("id");
        if (target != undefined && form != undefined) {
            clearTimeout(timeoutValue);
            buttonDisabler(false, target, "Checking...");
            timeoutValue = setTimeout(function () {
                let value = $("#" + thisId).val();
                if (value != "") {
                    $("#" + target).val(value);
                    $("#" + form).submit();
                    buttonUndisabler(false, formBtn, baseHtml);
                }
                else {
                    $("#" + target).val(null);
                    buttonDisabler(false, formBtn, baseHtml);
                }
            }, 2000);
        }
        else {
            $("#" + target).val(null);
            clearTimeout(timeoutValue);
            buttonDisabler(false, formBtn, baseHtml);
        }
    }
});

$(document).on("keyup", ".form-textarea", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let indicatorId = $(this).attr("data-length-display");
        let rowsIndicatorId = $(this).attr("data-rows-display");
        getElementLength(thisId, indicatorId == undefined ? null : indicatorId, false);
        getElementRows(thisId, rowsIndicatorId == undefined ? null : rowsIndicatorId, false);
        adjustTextareaRows(thisId);
    }
});

$(document).on("keyup", ".form-control-for-numbers-only", function () {
    let onFulFill = $(this).attr("data-on-fulfill");
    let maxLength = $(this).attr("maxlength");
    if (onFulFill != undefined && maxLength != undefined) {
        if ($(this).val().length >= maxLength) $("#" + onFulFill).submit();
    }
});
$(document).on("keydown", ".form-control-for-numbers-only", function (event) {
    let eventKeyCode = event.keyCode;
    let thisMax = $(this).attr("maxlength");
    let targetElement = $(this).attr("data-target");
    if (targetElement != undefined) {
        let charsLeft = thisMax - $(this).val().length;
        if (charsLeft > 1) $("#" + targetElement).html("<span class='fw-500'>" + charsLeft + "</span> chars left");
        else if (charsLeft == 1) $("#" + targetElement).html("<span class='fw-500'>one</span> char left");
        else $("#" + targetElement).html(' <i class="fa-solid fa-check-double"></i> Complete');
    }

    if ($(this).val().length <= thisMax) {
        if (eventKeyCode >= 48 && eventKeyCode <= 57) return true;
        else if (eventKeyCode == 8) return true;
        else if (eventKeyCode == 37 && eventKeyCode == 39) return true;
        else return false;
    }
    else return false;
});

$(document).on("keydown", ".form-control-restricted", function (event) {
    let eventKeyCode = event.keyCode;
    if (eventKeyCode != undefined) {
        if (eventKeyCode >= 65 && eventKeyCode <= 90) return true;
        else if (eventKeyCode >= 48 && eventKeyCode <= 57) return true;
        else if (eventKeyCode == 189) return true;
        else if (eventKeyCode == 20) return true;
        else if (eventKeyCode == 16) return true;
        else if (eventKeyCode == 8) return true;
        else return false;
    }
    else return false;
});

$(document).on("mousedown", ".btn-add-as-artist", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        if (document.getElementById(trueId + "-ReadyArtist_Btn") == null) {
            let imgTag = $("#" + trueId + "-AddedArtistImg_Tag");
            let stackDiv = $("<div class='hstack gap-1'></div>");
            let nameSpan = $("<span class='listed-artist-name-span ms-1'></span>");
            let resultBtn = $("<button type='button' class='btn btn-profile-tag btn-remove-as-artist btn-sm me-1'></button>");
            let artistInput = $("<input type='text' name='FeaturingArtist' class='listed-artist-name-val d-none' />");

            nameSpan.html($("#" + trueId + "-AddedArtistName_Span").html());
            nameSpan.attr("id", trueId + "-ReadyArtistName_Span");
            resultBtn.attr("id", trueId + "-ReadyArtist_Btn");
            imgTag.attr("id", trueId + "-ReadyArtistImg_Tag");
            artistInput.val(trueId);
            artistInput.attr("data-name", nameSpan.html());
            artistInput.attr("id", trueId + "-FeaturingArtist_Id_Val");

            stackDiv.append(imgTag);
            stackDiv.append(nameSpan);
            resultBtn.append(stackDiv);

            $("#ArtistsAddedResult_Box").append(resultBtn);
            $("#FeaturingArtistInputs_Box").append(artistInput);
            slideBoxes(false, "ArtistSearch_Box", "AlreadyAddedArtists_Box");
            $("#ArtistsSearchResult_Box").empty();

            let artists = document.getElementsByClassName("listed-artist-name-val");
            if (artists.length > 0) {
                thisBtnCopy = [];
                for (let i = 0; i < artists.length; i++) {
                    thisBtnCopy.push($("#" + artists[i].id).attr("data-name"));
                }
                artists = listToText(thisBtnCopy, true);
                if (artists != null) $("#SPC_Artists_Span").html(artists);
            }
        }
        else {
            let artistName = $("#" + trueId + "-AddedArtistName_Span").html();
            textAlert("FeaturingArtistsSearch_Val-Warn", 0, "<span class='fw-500'>" + artistName + "</span> is already listed as a featured artist", 3);
        }
        $("#FeaturingArtistsSearch_Val").val(null);
    }
});

$(document).on("mousedown", ".btn-remove-as-artist", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        $(this).fadeOut(300);
        setTimeout(function () {
            let artists = document.getElementsByClassName("listed-artist-name-val");
            if (artists.length > 0) {
                let thisBtnCopy = [];
                for (let i = 0; i < artists.length; i++) {
                    if (getTrueId(artists[i].id) != trueId) thisBtnCopy.push($("#" + artists[i].id).attr("data-name"));
                }
                artists = listToText(thisBtnCopy, true);
                if (artists != null) {
                    $("#SPC_Artists_Span").html(artists);
                    $("#AlreadyAddedArtists_Box").fadeIn(300);
                }
                else {
                    $("#SPC_Artists_Span").text(null);
                    $("#FeaturingArtistsSearch_Val").val(null);
                    $("#ArtistsAddedResult_Box").empty();
                    $("#AlreadyAddedArtists_Box").fadeOut(300);
                }
                $(this).remove();
                $("#" + trueId + "-FeaturingArtist_Id_Val").remove();
            }
        }, 350);
    }
});

$(document).on("change", "#SearchForUsers_Keyword_Val", function () {
    $("#SearchForUsers_Form").submit();
});

$(document).on("mousedown", ".btn-audio-loop", function () {
    let status = $(this).attr("data-status");
    if (status != undefined) {
        status = parseInt(status) + 1;
        status = status > 2 ? 0 : status;
        audioEdit("OngakuPlayer_Audio", null, null, status, null);
    }
});

$(document).on("mousedown", ".btn-audio-shuffle", function () {
    let status = $(this).attr("data-status");
    if (status != undefined) {
        status = parseInt(status);
        status = status < 3 ? ++status : 0;
        switch (status) {
            case 0:
                $(".btn-audio-shuffle").addClass("text-unchosen");
                $(".btn-audio-shuffle").removeClass("text-chosen");
                $(".btn-audio-shuffle").html(' <i class="fa-solid fa-shuffle"></i> ');
                break;
            case 1:
                $(".btn-audio-shuffle").addClass("text-chosen");
                $(".btn-audio-shuffle").removeClass("text-unchosen");
                $(".btn-audio-shuffle").html(' <i class="fa-solid fa-shuffle"></i> ');
                break;
            case 2:
                $(".btn-audio-shuffle").addClass("text-chosen");
                $(".btn-audio-shuffle").removeClass("text-unchosen");
                $(".btn-audio-shuffle").html(' <i class="fa-solid fa-arrows-turn-to-dots"></i> ');
                break;
            case 3:
                $(".btn-audio-shuffle").addClass("text-chosen");
                $(".btn-audio-shuffle").removeClass("text-unchosen");
                $(".btn-audio-shuffle").html('<span class="fa-layers fa-fw"> <i class="fa-solid fa-shuffle"></i> <span class="fa-layers-counter"> <i class="fa-solid fa-bolt"></i> </span></span>');
                break;
            default:
                $(".btn-audio-shuffle").addClass("text-unchosen");
                $(".btn-audio-shuffle").removeClass("text-chosen");
                $(".btn-audio-shuffle").html(' <i class="fa-solid fa-shuffle"></i> ');
                break;
        }
        $(".btn-audio-shuffle").attr("data-status", status);
    }
});

$(document).on("mousedown", ".btn-playback-rate", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let playbackRate = parseFloat($(this).attr("data-speed"));
        playbackRate += 0.5;
        playbackRate = playbackRate != undefined ? playbackRate : 1.0;
        audioEdit(target, null, playbackRate > 2.5 ? 0.5 : playbackRate, null, null);
    }
});

$(document).on("mousedown", ".btn-volume-down", function () {
    let target = $(this).attr("data-target");
    target = target == undefined ? "OngakuPlayer_Audio" : target;
    if (target != undefined) {
        internalVolume -= 2;
        audioEdit(target, internalVolume >= 0 ? internalVolume : 0, null, null, null);
    }
});

$(document).on("mousedown", ".btn-volume-up", function () {
    let target = $(this).attr("data-target");
    target = target == undefined ? "OngakuPlayer_Audio" : target;
    if (target != undefined) {
        internalVolume += 2;
        audioEdit(target, internalVolume <= 100 ? internalVolume : 100, null, null, null);
    }
});

$(document).on("mousedown", ".btn-volume-mute", function () {
    let target = $(this).attr("data-target");
    target = target == undefined ? "OngakuPlayer_Audio" : target;
    if (target != undefined) {
        internalVolume = 0;
        audioEdit(target, internalVolume, null, null, null);
    }
});

$(document).on("mousedown", ".btn-volume-max", function () {
    let target = $(this).attr("data-target");
    target = target == undefined ? "OngakuPlayer_Audio" : target;
    if (target != undefined) {
        audioEdit(target, 100, null, null, null);
    }
});

$(document).on("input", ".volume-range-slider", function () {
    let currentValue = parseFloat($(this).val());
    let target = $(this).attr("data-target");
    target = target == undefined ? "OngakuPlayer_Audio" : target;

    if (target != undefined && currentValue != undefined) {
        audioEdit(target, currentValue, null, null, null);
    }
});

$(document).on("change", ".form-range-slider", function () {
    let currentValue = parseFloat($(this).val());
    let maxValue = parseFloat($(this).attr("max"));
    let valueLabel = $(this).attr("data-value-label");

    if (currentValue != undefined && maxValue != undefined) {
        if (valueLabel != undefined) $("#" + valueLabel).html(currentValue);
    }
});

$(document).on("change", ".form-range", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let value = $(this).val();
        $("#" + trueId + "_RangeValue_Span").html(parseFloat(value).toLocaleString());
    }
});

$(document).on("mousedown", ".btn-ongaku-player-extend", function () {
    if ($("#OngakuPlayerMainPart_Box").css("display") != "none") showBySlidingToRight(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    else hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
});

$(document).on("dblclick", ".ongaku-player-box", function () {
    if (!$(this).hasClass("ongaku-player-box-enlarged")) enlargeMediaPlayer(currentWindowSize);
});
$(document).on("mousedown", ".ongaku-div-swiper", function () {
    dwindleMediaPlayer(currentWindowSize);
});
$(document).on("touchstart", ".ongaku-div-swiper", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".ongaku-div-swiper", function (event) {
    let moveDirection = handleTouchMove(event);
    if (moveDirection == 1) enlargeMediaPlayer(currentWindowSize);
    else dwindleMediaPlayer(currentWindowSize);

    xDown = null;
    yDown = null;
});

$(document).on("touchstart", ".ongaku-player-box", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".ongaku-player-box", function (event) {
    let moveDirection = handleTouchMove(event);
    if (moveDirection == 1) enlargeMediaPlayer(currentWindowSize);
    else if (moveDirection == 2) {
        if ($("#OngakuPlayerMainPart_Box").css("display") != "none") showBySlidingToRight(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
        else hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    }
    else if (moveDirection == 3) {
        hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    }

    xDown = null;
    yDown = null;
});

$(document).on("mousedown", ".btn-prev-page", function () {
    let maxPageQty = $(this).attr("data-max-pages");
    let currentPage = $(this).attr("data-current-page");
    let paginationMainId = getTrueId($(this).attr("id"), false);
    if (paginationMainId != undefined && currentPage != undefined && maxPageQty != undefined) {
        slideToPrevPage(paginationMainId, currentPage, maxPageQty);
    }
});

$(document).on("mousedown", ".btn-next-page", function () {
    let maxPageQty = $(this).attr("data-max-pages");
    let currentPage = $(this).attr("data-current-page");
    let paginationMainId = getTrueId($(this).attr("id"), false);
    if (paginationMainId != undefined && currentPage != undefined && maxPageQty != undefined) {
        slideToNextPage(paginationMainId, currentPage, maxPageQty);
    }
});

$(document).on("touchstart", ".pagination-child-box", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".pagination-child-box", function (event) {
    let moveDirection = handleTouchMove(event);
    let maxPages = $(this).attr("data-max-pages");
    let currentPage = getTrueId($(this).attr("id"), false);
    let paginationMainId = getTrueId($(this).attr("id"), true);
    if (paginationMainId != undefined && currentPage != undefined && maxPages != undefined) {
        if (swipeTimeout == 0) {
            clearTimeout(swipeTimeout);
            swipeTimeout = setTimeout(function () {
                if (moveDirection == 3) slideToNextPage(paginationMainId, currentPage, maxPages);
                else if (moveDirection == 2) slideToPrevPage(paginationMainId, currentPage, maxPages);
                swipeTimeout = 0;
            }, 100);
        }
    }

    //xDown = null;
    //yDown = null;
});


$(document).on("keydown", function (event) {
    //event.preventDefault();
    const keyCode = event.keyCode;
    const metaKey = event.metaKey;
    const altKey = event.altKey;
    const ctrlKey = event.ctrlKey;
    const shiftKey = event.shiftKey;

    if (userOSInfo == null) {
        getOSInfo().then(response => {
            userOSInfo = response
            shortcutImplementation(userOSInfo, keyCode, metaKey, ctrlKey, altKey, shiftKey);
        });
    }
    else shortcutImplementation(userOSInfo, keyCode, metaKey, ctrlKey, altKey, shiftKey);
});

$("#ShowBasicShortcutsInfo_Btn").on("mousedown", function () {
    getOSInfo().then(userOSInfo => {
        createModal("KeyboardShortcuts", "Keyboard Shortcuts", '<div class="pagination-parent-box mx-auto" id="KeyboardShortcutsPagination_Box"> <div class="pagination-child-box faded" id="0-KeyboardShortcutsPagination_Box" data-max-pages="1"> <div> <small class="card-text">Play/Pause Track <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">S</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Go to Next Track <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">D</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Go to Previous Track <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">A</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Loop the Track <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">R</span> </span></small> </div> <div class="box-border-top pt-2 mt-1"> <small class="card-text">Enlarge Media Player <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon"><i class="fa-regular fa-circle-up"></i> </span> </span></small> </div> <div class="mt-2"> <small class="card-text">Minimize Media Player <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon"><i class="fa-regular fa-circle-down"></i> </span> </span></small> </div> <div class="box-border-top pt-2 mt-1"> <small class="card-text">Volume Down <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon"><i class="fa-regular fa-circle-left"></i> </span> </span></small> </div> <div class="mt-2"> <small class="card-text">Volume Up <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon"><i class="fa-regular fa-circle-right"></i> </span> </span></small> </div> <div class="mt-2"> <small class="card-text">Volume Mute <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">F </span> </span></small> </div> <div class="box-border-top pt-2 mt-1"> <small class="card-text">Home Page <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">H</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Open Chats <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">C</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Open Library <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">A</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Start Search <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">S</span> </span></small> </div> </div> <div class="pagination-child-box" id="1-KeyboardShortcutsPagination_Box" data-max-pages="1"> <div> <small class="card-text">Favorite/Unfavorite Current Track <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-meta-key-shortcut me-1"> <i class="fa-brands fa-microsoft"></i> </span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">S</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Change Playback Rate <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon">Q</span> </span></small> </div> <div class="mt-2"> <small class="card-text">Rewind for 15 sec <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon"><i class="fa-solid fa-minus"></i> </span> </span></small> </div> <div class="mt-2"> <small class="card-text">Fast-Forward for 15 sec <span class="float-end ms-1"> <span class="uncolored-badge-icon kbd-main-shortcut me-1">Alt</span><span class="uncolored-badge-icon kbd-secondary-shortcut me-1">Shift</span><span class="uncolored-badge-icon"><i class="fa-solid fa-plus"></i> </span> </span></small> </div> </div> <div class="pagination-info-box hstack gap-1 mt-2"> <div class="pagination-buttons-box"> <button type="button" class="btn btn-pagination btn-prev-page" data-current-page="0" data-max-pages="1" id="KeyboardShortcutsPagination_Box-ToPrev_Btn"> <i class="fa-solid fa-angle-left"></i> </button> </div> <div class="pagination-index-box mx-auto"> <div class="pagination-index-dot active" id="0-KeyboardShortcutsPagination_Box_PaginationDot"></div> <div class="pagination-index-dot" id="1-KeyboardShortcutsPagination_Box_PaginationDot"></div> </div> <div class="pagination-buttons-box ms-auto"> <button type="button" class="btn btn-pagination btn-next-page" data-current-page="0" data-max-pages="1" id="KeyboardShortcutsPagination_Box-ToNext_Btn"> <i class="fa-solid fa-angle-right"></i> </button> </div> </div> </div>', true, '<small class="card-text text-muted">These shortcuts fit for <span class="fw-500 platform-info" id="PlatformInformation_Span"> <i class="fa-brands fa-microsoft"></i> Windows</span></small>', false);
        setTimeout(function () {
            switch (userOSInfo) {
                case "Windows":
                    $(".platform-info").html(' <i class="fa-brands fa-microsoft"></i> ' + userOSInfo);
                    break;
                case "Linux":
                    $(".platform-info").html(' <i class="fa-brands fa-linux"></i> ' + userOSInfo);
                    break;
                case "Mac":
                    $(".kbd-main-shortcut").html("⌥ Option");
                    $(".kbd-meta-key-shortcut").html("⌘ Command");
                    $(".platform-info").html(' <i class="fa-brands fa-apple"></i> ' + userOSInfo);
                    break;
                case "Android":
                    $(".platform-info").html(' <i class="fa-brands fa-android"></i> ' + userOSInfo + ' <span class="fw-normal">(external keyboard required)</span>');
                    break;
                case "iOS":
                    $(".kbd-main-shortcut").html("⌥ Option");
                    $(".platform-info").html(' <i class="fa-brands fa-apple"></i> ' + userOSInfo + ' <span class="fw-normal">(external keyboard required)</span>');
                    break;
                default:
                    $(".platform-info").html(' <i class="fa-brands fa-microsoft"></i> ' + userOSInfo);
                    break;
            }
            callAModal(false, "KeyboardShortcuts_Modal");
        }, 150);
    });
});

//# FUNCTION TERRIROY #//

function getTrueId(id, afterwards = false) {
    if (id != null) {
        if (afterwards) id = id.substring(id.indexOf("-") + 1, id.length);
        else id = id.substring(0, id.indexOf("-"));
        return id;
    }
    else return null;
}

function payAttention(elementId, duration, intervals) {
    if (elementId != null) {
        let secondIntervalValue;
        let baseBackgroundColor = $("#" + elementId).css("background-color");
        intervals = intervals != null ? intervals : 1;
        duration = duration != null ? duration : 9;

        intervalValue = setInterval(function () {
            $("#" + elementId).css("background-color", "#f0f0f0");
        }, intervals * 1000);
        setTimeout(function () {
            secondIntervalValue = setInterval(function () {
                $("#" + elementId).css("background-color", baseBackgroundColor);
            }, intervals * 1000);
        }, intervals * 1000 * 0.5);

        setTimeout(function () {
            clearInterval(intervalValue);
            clearInterval(secondIntervalValue);
            $("#" + elementId).css("background-color", baseBackgroundColor);
        }, duration * 1000);
    }
}

function createCountryFlagIcon(countryISO, width, height) {
    if (countryISO != null || countryName != undefined) {
        width = parseInt(width) == undefined ? 16 : width;
        height = parseInt(height) == undefined ? 12 : height;
        let countryImgTag = '<img src="https://flagcdn.com/16x12/' + countryISO.toLowerCase() + '.png" srcset = "https://flagcdn.com/32x24/' + countryISO.toLowerCase() + '.png 2x, https://flagcdn.com/48x36/' + countryISO.toLowerCase() + '.png 3x" "width="' + width + '" height="' + height + '" alt="' + countryISO + '"> ';
        return countryImgTag;
    }
    else return null;
}

function localItemFilter(items, keyword) {
    if (items != null && keyword != null) {
        let newItems = [];
        const mainTags = [
            "BUTTON", "P", "IMG", "DIV", "SPAN", "A", "INPUT", "TEXTAREA",
            "SELECT", "FORM", "TABLE", "TR", "TD", "UL", "OL", "LI",
            "H1", "H2", "H3", "H4", "H5", "H6", "SECTION", "ARTICLE", "NAV"
        ];
        if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
                if (mainTags.includes($("#" + items[i].id).prop("tagName"))) {
                    if (!$("#" + items[i].id).html().toLowerCase().includes(keyword.toLowerCase())) {
                        $("#" + items[i].id).fadeOut(0);
                    }
                }
                else {
                    if (items[i].toLowerCase().includes(keyword.toLowerCase())) {
                        newItems.push(items[i]);
                    }
                }
            }
        }
        return newItems;
    }
    else return null;
}

function textSplitter(value, splitter = "\r\n") {
    if (value != null && splitter != null) {
        value = value.split(splitter);
        if (value.length > 0) return value;
    }
    else return null;
}

function blur(elementId, durationInSec = 0.5) {
    if (elementId != null) {
        durationInSec = parseFloat(durationInSec) != undefined ? durationInSec : 0.5;
        $("#" + elementId).addClass("blurred");
        setTimeout(function () {
            $("#" + elementId).removeClass("blurred");
        }, durationInSec * 1000);
    }
}

function juxtaposedCharsRestrictions(elementTrueId, restrictionButtonId, maxCharsQty = 0, necessaryCharsList = []) {
    if (elementTrueId != null && restrictionButtonId != null) {
        maxCharsQty = parseInt(maxCharsQty);
        let isAccepted = 0;
        let necessaryNeedsQty = necessaryCharsList.length;
        let totalCharsQty = 0;
        let similarItems = $("[id*='" + elementTrueId + "']");
        if (similarItems.length > 0) {
            for (let i = 0; i < similarItems.length; i++) {
                totalCharsQty += $("#" + similarItems[i].id).val().length;
            }
        }

        if (maxCharsQty > 0) {
            necessaryNeedsQty++;
            if (maxCharsQty >= totalCharsQty) {
                isAccepted++;
            }
            else isAccepted = isAccepted > 0 ? --isAccepted : 0;
        }
        else {
            isAccepted++;
            necessaryNeedsQty = necessaryNeedsQty > 0 ? --necessaryNeedsQty : 0;
        }
        if (Array.isArray(necessaryCharsList) && necessaryCharsList.length > 0) {
            for (let i = 0; i < similarItems.length; i++) {
                for (let j = 0; j < necessaryCharsList.length; j++) {
                    if ($("#" + similarItems[i].id).val().includes(necessaryCharsList[i])) {
                        isAccepted++;
                    }
                    else {
                        break;
                    }
                }
            }
        }
        if (isAccepted >= necessaryNeedsQty) $("#" + restrictionButtonId).removeClass("super-disabled");
        else $("#" + restrictionButtonId).addClass("super-disabled");
    }
    else $("#" + restrictionButtonId).addClass("super-disabled");
}

function slideBoxes(byClassname, closingBox, openingBox) {
    if (byClassname) {
        let divExists = document.getElementById(openingBox);
        $("." + closingBox).addClass("re-scaled");
        $("." + closingBox).fadeOut(300);
        setTimeout(function () {
            if (divExists == null) {
                $("." + openingBox).fadeIn(0);
                $("." + openingBox).removeClass("re-scaled");
            }
            else {
                $("#" + openingBox).fadeIn(0);
                $("#" + openingBox).removeClass("re-scaled");
            }
        }, 300);
    }
    else {
        $("#" + closingBox).addClass("re-scaled");
        $("#" + closingBox).fadeOut(300);
        setTimeout(function () {
            $("#" + openingBox).fadeIn(0);
            $("#" + openingBox).removeClass("re-scaled");
        }, 300);
    }
}

function buttonChooser(byClassname, elementId, boldChoose = false) {
    if (byClassname) {
        if (!boldChoose) {
            $("." + elementId).addClass("text-dark");
            $("." + elementId).addClass("bg-chosen-bright");
        }
        else {
            $("." + elementId).addClass("text-light");
            $("." + elementId).addClass("bg-chosen");
        }
    }
    else {
        if (!boldChoose) {
            $("#" + elementId).addClass("text-dark");
            $("#" + elementId).addClass("bg-chosen-bright");
        }
        else {
            $("#" + elementId).addClass("text-light");
            $("#" + elementId).addClass("bg-chosen");
        }
    }
}

function buttonUnchooser(byClassname, elementId) {
    if (byClassname) {
        $("." + elementId).removeClass("bg-chosen");
        $("." + elementId).removeClass("bg-chosen-bright");
        $("." + elementId).removeClass("text-light");
        $("." + elementId).removeClass("text-dark");
    }
    else {
        $("#" + elementId).removeClass("bg-chosen");
        $("#" + elementId).removeClass("bg-chosen-bright");
        $("#" + elementId).removeClass("text-light");
        $("#" + elementId).removeClass("text-dark");
    }
}

function nonNullCounter(arraySample = []) {
    if (arraySample != null && arraySample.length > 0) {
        let qty = 0;
        $.each(arraySample, function (index) {
            if (arraySample[index] != null) qty++;
        });
        return qty;
    }
    else return null;
}

function nonNullElementIndexes(arraySample = []) {
    if (arraySample != null && arraySample.length > 0) {
        let indexArr = [];
        for (let i = 0; i < arraySample.length; i++) {
            if (arraySample[i] != null) indexArr.push(i);
        }

        if (indexArr.length > 0) {
            if (indexArr.length == 1) return indexArr[0];
            else return indexArr;
        }
        else return null;
    }
    else return null;
}

function secondsToRegularDuration(durationInSeconds = 0) {
    if (durationInSeconds > 0) {
        let mins = Math.floor(durationInSeconds / 60);
        let secondsLeft = Math.round(durationInSeconds - Math.floor(mins * 60));
        mins = mins < 10 ? "0" + mins : mins;
        secondsLeft = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
        return [mins, secondsLeft];
    }
    else return null;
}

function regularToSecondsDuration(durationInMins = 0, seconds = 0) {
    if (durationInMins != null && seconds != null) {
        let fullDuration = parseInt(durationInMins) * 60 + parseInt(seconds);
        return fullDuration;
    }
    else return -1;
}

function favoriteSampler(songsQty) {
    let playlistBox = $("<div class='playlist-box btn-get-playlist-info mb-1'></div>");
    let playlistBoxStack = $('<div class="hstack gap-1"></div>');
    let playlistImg = $("<div class='release-img-box-sm text-primary'> <i class='fa-solid fa-star'></i> </div>")
    let playlistInfoBox = $("<div class='ms-1'></div>");
    let playlistNameTitle = $("<span class='h6'>Favorite Songs</h6>");
    let playlistInfoSeparator = $("<br/>");
    let playlistBadge = $("<span class='badge badge-standard'> <i class='fa-solid fa-star text-primary'></i> Favorites</span>");
    let playlistSongsQtySpan = $("<small class='card-text text-muted'></small>");
    let playlistStatsSpan = $("<span class='card-text'></span>");

    if (songsQty <= 0) playlistSongsQtySpan.text(" ∙ No Songs");
    else if (songsQty == 1) playlistSongsQtySpan.text(" ∙ One Song");
    else playlistSongsQtySpan.text(" ∙ " + songsQty + " Songs");
    playlistBox.attr("id", "fvr-Playlist_Box");

    playlistStatsSpan.append(playlistBadge);
    playlistStatsSpan.append(playlistSongsQtySpan);
    playlistInfoBox.append(playlistNameTitle);
    playlistInfoBox.append(playlistInfoSeparator);
    playlistInfoBox.append(playlistStatsSpan);
    playlistBoxStack.append(playlistImg);
    playlistBoxStack.append(playlistInfoBox);
    playlistBox.append(playlistBoxStack);

    return playlistBox;
}

function playlistSampler(id, title, coverImageUrl, songsQty, pinOrder = 0, trueId = 0, currentUserId = 0, authorId = 0, editable = false) {
    if (id != null && title != null) {
        let playlistBox = $("<div class='playlist-box mb-1'></div>");
        let playlistBoxStack = $('<div class="btn-get-playlist-info hstack gap-1"></div>');
        let playlistImg;
        let playlistInfoBox = $("<div class='ms-1'></div>");
        let playlistNameTitle = $("<span class='h6'></h6>");
        let playlistInfoSeparator = $("<br/>");
        let playlistBadge = $("<span class='badge badge-standard'> <i class='fa-solid fa-wave-square'></i> Playlist</span>");
        let playlistSongsQtySpan = $("<small class='card-text text-muted'></small>");
        let playlistStatsSpan = $("<span class='card-text'></span>");

        playlistNameTitle.html(title);
        playlistNameTitle.attr("id", trueId + "-PlaylistTitle_Lbl");
        if (songsQty > 0) playlistSongsQtySpan.text(parseInt(songsQty) > 1 ? " ∙ " + songsQty + " songs" : " ∙ One song");
        else playlistSongsQtySpan.text(" ∙ No Songs");

        playlistBox.attr("data-tracks-qty", songsQty);
        playlistBox.attr("id", trueId + "-PlaylistInfo_Box");
        playlistStatsSpan.attr("id", trueId + "-PlaylistStats_Span");
        playlistBoxStack.attr("id", trueId + "-GetPlaylistInfo_Box");
        playlistSongsQtySpan.attr("id", trueId + "-PlaylistSongsQty_Span");

        if (coverImageUrl != null) {
            playlistImg = $("<img class='release-img-sm' alt='This image cannot be displayed yet' />");
            playlistImg.attr("src", "/PlaylistCovers/" + coverImageUrl);
        }
        else {
            playlistImg = $("<div class='release-img-box-sm'></div>");
            playlistImg.html(' <i class="fa-solid fa-wave-square"></i> ');
        }
        playlistImg.attr("id", trueId + "-PlaylistInfo_Img");

        playlistStatsSpan.append(playlistBadge);
        playlistStatsSpan.append(playlistSongsQtySpan);
        playlistInfoBox.append(playlistNameTitle);
        playlistInfoBox.append(playlistInfoSeparator);
        playlistInfoBox.append(playlistStatsSpan);
        playlistBoxStack.append(playlistImg);
        playlistBoxStack.append(playlistInfoBox);
        playlistBox.append(playlistBoxStack);

        let playlistDropdownBox = $("<div class='dropdown ms-auto' data-untrack='true'></div>");
        let playlistDropdownUl = $("<ul class='dropdown-menu shadow-sm' data-untrack='true'></ul>");
        let playlistDropdownBtn = $('<button class="btn btn-standard ms-auto" type="button" data-bs-toggle="dropdown" data-untrack="true" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
        let playlistDropdownLi5 = $("<li></li>");
        let playlistDropdownBtn5 = $("<button type='button' class='dropdown-item btn-pre-remove-the-playlist text-danger'>Remove <span class='float-end ms-1'> <i class='fa-solid fa-folder-minus'></i> </span></button>");
        playlistDropdownBtn5.attr("id", trueId + "-RemoveThePlaylist_Btn");

        if (editable && authorId == currentUserId) {
            let playlistDropdownLi0 = $("<li></li>");
            let playlistDropdownLi1 = $("<li></li>");
            let playlistDropdownLi2 = $("<li></li>");
            let playlistDropdownLi3 = $("<li></li>");
            let playlistDropdownLi4 = $("<li></li>");

            let playlistDropdownBtn0 = $("<button type='button' class='dropdown-item btn-edit-playlist btn-sm'>Edit <span class='float-end ms-1'> <i class='fa-solid fa-pencil'></i> </span</button>");
            let playlistDropdownBtn1 = $("<button type='button' class='dropdown-item btn-edit-playlist-shortname btn-sm'>Shortname <span class='float-end ms-1'> <i class='fa-solid fa-at'></i> </span</button>");
            let playlistDropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Cover Image <span class='float-end ms-1'> <i class='fa-solid fa-panorama'></i> </span></button>");
            let playlistDropdownBtn3 = $("<button type='button' class='dropdown-item'>Pin <span class='float-end ms-1'> <i class='fa-solid fa-thumbtack'></i> </span></button>");
            let playlistDropdownBtn4 = $("<button type='button' class='dropdown-item'>Reorder <span class='float-end ms-1'> <i class='fa-solid fa-sort'></i> </span></button>");

            if (trueId > 0) {
                $("#EPCI_Id_Val").val(trueId);
                $("#GetEditInfo_SbmtBtn").attr("type", "submit");
                $("#GetEditInfo_SbmtBtn").removeClass("super-disabled");
                playlistDropdownBtn0.attr("id", trueId + "-EditPlaylist_Btn");
                playlistDropdownBtn1.attr("id", trueId + "-GetPlaylistShortname_Btn");
                playlistDropdownBtn2.attr("id", trueId + "-EditPlaylistCoverImage_Btn");
                playlistDropdownBtn2.attr("onmousedown", '$("#EPCI_ImageUrl_Val").mousedown();');
                playlistDropdownBtn0.fadeIn(0);
                playlistDropdownBtn1.fadeIn(0);
                playlistDropdownBtn2.fadeIn(0);
            }
            else {
                $("#EPCI_Id_Val").val(0);
                playlistDropdownBtn0.removeAttr("id");
                playlistDropdownBtn1.removeAttr("id");
                playlistDropdownBtn2.removeAttr("id");
                playlistDropdownBtn2.removeAttr("onmousedown");
                playlistDropdownBtn0.fadeOut(0);
                playlistDropdownBtn1.fadeOut(0);
                playlistDropdownBtn2.fadeOut(0);
            }

            playlistDropdownBtn3.removeClass("super-disabled");
            playlistDropdownBtn3.attr("id", id + "-PinOrUnpinThePlaylist_Btn");

            switch (parseInt(pinOrder)) {
                case 0:
                    playlistDropdownBtn3.html('Pin <span class="float-end"> <i class="fa-solid fa-thumbtack"></i> </span>');
                    playlistDropdownBtn3.addClass("btn-pin-the-playlist");
                    playlistDropdownBtn3.removeClass("btn-unpin-the-playlist");
                    break;
                case 1:
                    let isPinnedIcon = $("<small class='card-text text-muted'>Pinned ∙ </small>");
                    isPinnedIcon.attr("id", id + "-PlaylistPinned_Span");
                    playlistStatsSpan.append(isPinnedIcon);

                    playlistDropdownBtn3.html('Unpin <span class="float-end"> <i class="fa-solid fa-thumbtack-slash"></i> </span>');
                    playlistDropdownBtn3.addClass("btn-unpin-the-playlist");
                    playlistDropdownBtn3.removeClass("btn-pin-the-playlist");
                    break;
                case 2:
                    playlistDropdownBtn3.fadeOut(0);
                    playlistDropdownBtn3.removeAttr("id");
                    playlistDropdownBtn3.addClass("super-disabled");
                    playlistDropdownBtn3.removeClass("btn-pin-the-playlist");
                    playlistDropdownBtn3.removeClass("btn-unpin-the-playlist");
                    break;
                default:
                    playlistDropdownBtn3.html('Pin <span class="float-end"> <i class="fa-solid fa-thumbtack"></i> </span>');
                    playlistDropdownBtn3.addClass("btn-pin-the-playlist");
                    playlistDropdownBtn3.removeClass("btn-unpin-the-playlist");
                    break;
            }

            playlistDropdownLi0.append(playlistDropdownBtn0);
            playlistDropdownLi1.append(playlistDropdownBtn1);
            playlistDropdownLi2.append(playlistDropdownBtn2);
            playlistDropdownLi3.append(playlistDropdownBtn3);
            playlistDropdownLi4.append(playlistDropdownBtn4);
            playlistDropdownUl.append(playlistDropdownLi0);
            playlistDropdownUl.append(playlistDropdownLi1);
            playlistDropdownUl.append(playlistDropdownLi2);
            playlistDropdownUl.append(playlistDropdownLi3);
            playlistDropdownUl.append(playlistDropdownLi4);
        }
        playlistDropdownLi5.append(playlistDropdownBtn5);
        playlistDropdownUl.append(playlistDropdownLi5);
        playlistDropdownBox.append(playlistDropdownBtn);
        playlistDropdownBox.append(playlistDropdownUl);
        playlistBoxStack.append(playlistDropdownBox);

        return playlistBox;
    }
    else return null;
}

function trackManagemenetPlaylistsSampler(playlistId = 0, userPlaylistId = 0, title, imageUrl, isChosen = false) {
    if (playlistId > 0 && userPlaylistId > 0 && (title != null || title != undefined)) {
        let playlistBox = $("<div class='playlist-box mb-1'></div>");
        let playlistBoxStack = $('<div class="btn-get-playlist-info hstack gap-1"></div>');
        let playlistImg;
        let playlistInfoBox = $("<div class='ms-1'></div>");
        let playlistNameTitle = $("<span class='h6'></h6>");
        let playlistInfoSeparator = $("<br/>");
        let playlistIsChosenSpan = $("<small class='card-text playlist-status-text'></small>");

        playlistNameTitle.html(title);
        playlistBox.attr("data-user-playlist-id", userPlaylistId);
        playlistBox.attr("id", playlistId + "-MarkThePlaylist_Box");
        playlistIsChosenSpan.attr("id", playlistId + "-MarkThePlaylist_Status_Span");
        if (isChosen) {
            playlistBox.addClass("btn-unmark-the-playlist bg-chosen-bright");
            playlistIsChosenSpan.html(' <i class="fa-regular fa-circle-check"></i> Chosen');
        }
        else {
            playlistBox.removeClass("bg-chosen-bright");
            playlistBox.removeClass("btn-unmark-the-playlist");
            playlistBox.addClass("btn-mark-the-playlist");
            playlistIsChosenSpan.html(' <i class="fa-regular fa-circle"></i> Not Chosen');
        }
        if (imageUrl != null) {
            playlistImg = $("<img class='release-img-sm' alt='This image cannot be displayed yet' />");
            playlistImg.attr("src", "/PlaylistCovers/" + imageUrl);
        }
        else {
            playlistImg = $("<div class='release-img-box-sm'></div>");
            playlistImg.html(' <i class="fa-solid fa-wave-square"></i> ');
        }
        playlistInfoBox.append(playlistNameTitle);
        playlistInfoBox.append(playlistInfoSeparator);
        playlistInfoBox.append(playlistIsChosenSpan);
        playlistBoxStack.append(playlistImg);
        playlistBoxStack.append(playlistInfoBox);
        playlistBox.append(playlistBoxStack);

        return playlistBox;
    }
    else return null;
}

function elementDesigner(elementTag, elementClass, elementHtml) {
    if (elementTag != null && elementClass != null) {
        let element = $("<" + elementTag + " class='" + elementClass + "'></" + elementTag + ">");
        if (elementHtml != null) element.html(elementHtml);
        return element;
    }
    else return null;
}

function createInsideLgCard(id, title, body, headerBtn1 = null, headerBtn2 = null) {
    let divExists = document.getElementById(id + "_Container");
    if (divExists == null) {
        let headerBox = elementDesigner("div", "box-lg-inner-part-header", null);
        headerBox.attr("id", id + "-HeaderBtns_Box");

        $("body").append('<div class="box-lg-part-inner shadow-sm" id="' + id + '_Container"> <div class="box-lg-inner-part-header" id="' + id + '-Header_Box"> <div class="div-swiper mx-auto" id="' + id + '_Container-Swiper"></div></div> <div class="mt-1 p-1" id="' + id + '_Box"></div></div>');
        $("#" + id + "_Container-Header_Lbl").html(title);
        $("#" + id + "_Box").append(body);

        if ((headerBtn1 != null || headerBtn1 != undefined) || (headerBtn2 != null || headerBtn2 != undefined)) {
            let stackDiv = elementDesigner("div", "hstack gap-2", null);
            if (headerBtn1 != null) stackDiv.append(headerBtn1);
            if (headerBtn2 != null) {
                $(headerBtn2).addClass("ms-auto");
                stackDiv.append(headerBtn2);
            }
            $("#" + id + "-Header_Box").append(stackDiv);
            $("#" + id + "-Header_Box").removeClass("border-0");
        }
        else $("#" + id + "-Header_Box").addClass("border-0");
        //if (headerBtn1 != null) {
        //    let headerStackRightPartBox = $("<div class='ms-auto'></div>");
        //    headerStackRightPartBox.append(headerBtn1);
        //    $("#" + id + "-HeaderBtns_Box").append(headerStackRightPartBox);
        //    if (headerBtn2 != null) headerStackRightPartBox.append(headerBtn2);
        //}
        displayCorrector(currentWindowSize);
        return true;
    }
    else {
        displayCorrector(currentWindowSize);
        setTimeout(function () {
            callInsideLgContainer(false, id + "_Container");
        }, 150);
        return false;
    }
}

function createAContainer(id, title, body, headerBtn1 = null, headerBtn2 = null, updateTheBody = false) {
    let divExists = document.getElementById(id + "_Container");
    if (divExists == null) {
        $("body").append('<div class="box-lg-part shadow-sm" id="' + id + '_Container"> <div class="box-lg-part-header p-2"> <div class="div-swiper mx-auto" id="' + id + '_Container-Swiper"></div> <div class="hstack gap-1"> <button type="button" class="btn btn-standard btn-back btn-sm"> <i class="fa-solid fa-chevron-left"></i> Back</button> <div class="ms-2"> <span class="h5" id="' + id + '_Container-Header_Lbl">' + title + '</span> </div> <div class="ms-auto" id="' + id + '-Header_Box"></div></div> </div> <div class="box-lg-part-body mt-5" id="' + id + '_Box"> </div> </div>');
        $("#" + id + "_Box").append(body);
        if (headerBtn1 != null) {
            let firstButton = $(headerBtn1);
            $("#" + id + "-Header_Box").append(firstButton);

            if (headerBtn2 != null) {
                let secondBtn = $(headerBtn2);
                $("#" + id + "-Header_Box").append(secondBtn);
            }
        }

        if (currentWindowSize > 1024) {
            $(".box-lg-part").css("left", "37%");
            $(".box-lg-part").css("width", "63%");
            $(".box-lg-part-header").css("left", "37%");
            $(".box-lg-part-header").css("width", "63%");
            $(".box-vertical-switcher").css("width", "62%");
            $(".box-vertical-switcher").css("left", "37.5%");
        }
        else {
            $(".box-lg-part").css("left", "0");
            $(".box-lg-part").css("width", "100%");
            $(".box-lg-part-header").css("width", "100%");
            $(".box-lg-part-header").css("width", "100%");
            $(".box-vertical-switcher").css("left", "0.75%");
            $(".box-vertical-switcher").css("width", "98.25%");
        }
    }
    else {
        if ((updateTheBody) && (body != undefined && body != null)) {
            $("#" + id + "_Box").empty();
            $("#" + id + "_Box").append(body);
        }
    }
}

function createHeadlessContainer(id, headerHtml, body, openOnCreate = false, forArtistPage = false) {
    let divExists = document.getElementById(id + "_Container");
    if (divExists == null) {
        if (!forArtistPage) $("body").append('<div class="box-lg-part shadow-sm" id="' + id + '_Container"> <div class="box-lg-part-header p-2" id="' + id + '-Header"> <div class="div-swiper mx-auto" id="' + id + '_Container-Swiper"></div> <div class="mt-1" id="' + id + '-Header_Box"></div> </div> <div class="box-lg-part-body mt-5" id="' + id + '_Box"></div></div>');
        else $("body").append('<div class="box-lg-part box-lg-part-for-artist shadow-sm" id="' + id + '_Container"> <div class="box-lg-part-body box-lg-part-body-for-artist" id="' + id + '_Box"></div></div>');
        $("#" + id + "_Box").append(body);

        if (headerHtml != null || headerHtml != undefined) {
            $("#" + id + "-Header_Box").fadeIn(0);
            $("#" + id + "-Header_Box").append(headerHtml);
            $("#" + id + "_Box").addClass("mt-5");
            $("#" + id + "-Header").css("border-bottom", "1px solid #f0f0f0");
            $("#" + id + "-Header").css("background-color", "rgba(248, 249, 250, 0.7)");
        }
        else {
            $("#" + id + "-Header_Box").fadeOut(0);
            $("#" + id + "_Box").removeClass("mt-5");
            $("#" + id + "-Header").css("border", "none");
            $("#" + id + "-Header").css("background-color", "transparent");
        }
        displayCorrector(currentWindowSize);
        //if (currentWindowSize > 1024) {
        //    $(".box-lg-part").css("left", "37%");
        //    $(".box-lg-part").css("width", "63%");
        //    $(".box-lg-part-header").css("left", "37%");
        //    $(".box-lg-part-header").css("width", "63%");
        //    $(".box-vertical-switcher").css("width", "62%");
        //    $(".box-vertical-switcher").css("left", "37.5%");
        //}
        //else {
        //    $(".box-lg-part").css("left", "0");
        //    $(".box-lg-part").css("width", "100%");
        //    $(".box-lg-part-header").css("width", "100%");
        //    $(".box-lg-part-header").css("width", "100%");
        //    $(".box-vertical-switcher").css("left", "0.75%");
        //    $(".box-vertical-switcher").css("width", "98.25%");
        //}
    }
    else {
        $("#" + id + "_Box").empty();
        $("#" + id + "_Box").append(body);
    }
    if (openOnCreate) slideContainers(null, id + "_Container");
}

function textAlert(element, type, text, durationInSeconds = 3.5) {
    let elementInitialText = $("#" + element).html();
    let addedClass = "text-danger";
    let classesToKeepForLater = [];
    let currentClassList = document.getElementById(element).classList;
    $("#" + element).html(text);
    for (let i = 0; i < currentClassList.length; i++) {
        if (getTrueId(currentClassList[i], false) == "text") {
            classesToKeepForLater.push(currentClassList[i]);
            $("#" + element).removeClass(currentClassList[i]);
        }
    }

    switch (parseInt(type)) {
        case 0:
            addedClass = "text-danger";
            break;
        case 1:
            addedClass = "text-warning";
            break;
        case 2:
            addedClass = "text-success";
            break;
        case 3:
            addedClass = "text-primary";
            break;
        case 4:
            addedClass = "text-muted";
            break;
        default:
            addedClass = "text-danger";
            break;
    }
    $("#" + element).addClass(addedClass);
    setTimeout(function () {
        $("#" + element).html(elementInitialText);
        $("#" + element).removeClass(addedClass);
        if (classesToKeepForLater.length > 0) {
            for (let i = 0; i < classesToKeepForLater.length; i++) {
                $("#" + element).addClass(classesToKeepForLater[i]);
            }
        }
    }, durationInSeconds * 1000);
}

function juxtaposedCharsCounter(elementId, maxLength, displayId) {
    elementId = elementId.includes("-") ? getTrueId(elementId, false) : elementId;
    if (elementId != null) {
        let fullValueLength = 0;
        let similarItemsArr = [];
        let similarItems = $("[id*='" + elementId + "']");
        for (let i = 0; i < similarItems.length; i++) {
            if ($("#" + similarItems[i].id).hasClass("form-control-juxtaposed")) similarItemsArr.push(similarItems[i]);
        }

        if (similarItemsArr.length > 0) {
            for (let i = 0; i < similarItemsArr.length; i++) {
                if ($("#" + similarItemsArr[i].id).hasClass("form-control-juxtaposed") && $("#" + similarItemsArr[i].id).val() != "") {
                    fullValueLength += $("#" + similarItemsArr[i].id).val().length;
                }
            }
        }
        if (displayId != null) $("#" + displayId).html(fullValueLength + "/" + maxLength);
        return fullValueLength;
    }
    else 0;
}

function juxtaposedCharsUpdater(elementId, baseValue, updatingDisplayId) {
    elementId = elementId.includes("-") ? getTrueId(elementId, false) : elementId;
    if (elementId != null && updatingDisplayId != null) {
        let fullValue;
        let similarItemsArr = [];
        let similarItems = $("[id*='" + elementId + "']");
        for (let i = 0; i < similarItems.length; i++) {
            if ($("#" + similarItems[i].id).hasClass("form-control-juxtaposed")) similarItemsArr.push(similarItems[i]);
        }

        if (similarItemsArr.length > 0) {
            for (let i = 0; i < similarItemsArr.length; i++) {
                if ($("#" + similarItemsArr[i].id).hasClass("form-control-juxtaposed") && $("#" + similarItemsArr[i].id).val() != "") {
                    if (i == 0) fullValue = $("#" + similarItemsArr[i].id).val();
                    else fullValue += ", " + $("#" + similarItemsArr[i].id).val();
                }
            }
        }
        if (updatingDisplayId != undefined) {
            if (fullValue.length > 0) $("#" + updatingDisplayId).html(fullValue);
            else {
                if (baseValue != undefined) $("#" + updatingDisplayId).html(baseValue);
                else $("#" + updatingDisplayId).html("Not provided");
            }
        }
        return fullValue;
    }
    else return null;
}

function getElementLength(id, indicatorId, isText = false) {
    if (id != null) {
        let maxLength = 0;
        let currentLength = 0;
        if (!isText) {
            currentLength = $("#" + id).attr("contenteditable") ? $("#" + id + "_Val").val().length : $("#" + id).val().length;
            maxLength = parseInt($("#" + id).attr("maxlength"));
        }
        else currentLength = $("#" + id).text().length;

        if (isNaN(maxLength) || maxLength == undefined || maxLength == 0) currentLength = currentLength.toLocaleString();
        else currentLength = currentLength.toLocaleString() + "/" + maxLength.toLocaleString();
        if (indicatorId == null) $("#" + id + "-Indicator_Span").text(currentLength);
        else $("#" + indicatorId).text(currentLength);

        return currentLength;
    }
    else return null;
}

function getElementRows(elementId, indicatorId, isText = false) {
    let value;
    if (isText) value = $("#" + elementId).html();
    else value = $("#" + elementId).val();

    value = value.length > 0 ? value.split(/\r?\n/) : "";
    if (indicatorId != null || indicatorId != undefined) $("#" + indicatorId).html(value.length);
    else $("#" + elementId + "-RowsIndicator_Span").html(value.length);

    return value.length;
}

function getCommaSeparatedValues(initialValue) {
    if (initialValue != null) {
        initialValue = initialValue.replaceAll(", ", ",");
        let commaIndex = 0;
        let values = [];
        for (let i = 0; i < initialValue.length; i++) {
            let newValue;
            if (initialValue[i] == ",") {
                newValue = initialValue.substring(commaIndex, i);
                values.push(newValue);
                commaIndex = i;
                ++commaIndex;
            }
            if (i == initialValue.length - 1) {
                newValue = initialValue.substring(commaIndex, initialValue.length);
                values.push(newValue);
            }
        }
        return values;
    }
    else return null;
}

function adjustTextareaRows(elementId) {
    if (elementId != null) {
        let thisValLength = $("#" + elementId).val().length;
        if (thisValLength > 0) {
            let thisTextarea = document.getElementById(elementId);
            let thisTextareaH = thisTextarea.scrollHeight;
            $("#" + elementId).css("height", "auto");
            $("#" + elementId).css("height", thisTextareaH + "px");
        }
        else {
            $("#" + elementId).css("height", "auto");
        }
    }
}

function updateWithInput(initialElement, target, defaultValue) {
    if (initialElement != null && target != null) {
        let value = $("#" + initialElement).val();
        if (value != null && value.length > 0) $("#" + target).html(value);
        else {
            if (defaultValue != null) $("#" + target).html(defaultValue);
            else $("#" + target).html("Not Defined");
        }
    }
}

function checkTheInput(value, minLength, necessaryChars, target) {
    if (target != null && value != null) {
        if (necessaryChars != null && !Array.isArray(necessaryChars)) necessaryChars = getCommaSeparatedValues(necessaryChars);
        let truthsQty = 0;
        let necessaryTruths = necessaryChars != null ? necessaryChars.length + 1 : 1;

        if (parseInt(value.length) > parseInt(minLength)) truthsQty++;
        if (necessaryChars != null) {
            for (let i = 0; i < necessaryChars.length; i++) {
                for (let j = 0; j < value.length; j++) {
                    if (value[j] == necessaryChars[i]) {
                        truthsQty++;
                        break;
                    }
                }
            }
        }
        if (truthsQty >= necessaryTruths) return true;
        else return false;
    }
    else return false;
}

function sliderSlideToLeft(currentIndex = 0, nonIdentical_Id_Part) {
    if (nonIdentical_Id_Part != null || nonIdentical_Id_Part != "") {
        if (currentIndex > 0) {
            let prevIndex = currentIndex;
            currentIndex--;

            $("#" + prevIndex + "-" + nonIdentical_Id_Part).addClass("anime-slide-to-right");
            setTimeout(function () {
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("to-left");
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("to-right");
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).addClass("anime-slide-from-left-to-mid");
                $("#" + prevIndex + "-" + nonIdentical_Id_Part).addClass("to-right");
            }, 400);
            setTimeout(function () {
                $("#" + prevIndex + "-" + nonIdentical_Id_Part).removeClass("anime-slide-to-right");
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("anime-slide-from-left-to-mid");
            }, 800);

            $(".slider-dots").removeClass('active');
            $(".btn-sliders-slide-to-left").attr("data-index", currentIndex);
            $(".btn-sliders-slide-to-right").attr("data-index", currentIndex);
            $("#" + currentIndex + "-TutorialDot_Box").addClass("active");
        }
        else {
            $("#" + currentIndex + "-" + nonIdentical_Id_Part).addClass("anime-empty-slide-to-right");
            setTimeout(function () {
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("anime-empty-slide-to-right");
            }, 400);
        }
    }
}

function sliderSlideToRight(slidersClassname, currentIndex, nonIdentical_Id_Part) {
    if ((slidersClassname != null || slidersClassname != "") && (nonIdentical_Id_Part != null || nonIdentical_Id_Part != "")) {
        let thisSlidersFamily = document.getElementsByClassName(slidersClassname);
        if (thisSlidersFamily != null && thisSlidersFamily.length > 0) thisSlidersFamily = thisSlidersFamily.length - 1;
        else thisSlidersFamily = 0;

        if (currentIndex < thisSlidersFamily) {
            let prevIndex = currentIndex;
            currentIndex++;

            $("#" + prevIndex + "-" + nonIdentical_Id_Part).addClass("anime-slide-to-left");
            setTimeout(function () {
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("to-left");
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("to-right");
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).addClass("anime-slide-from-right-to-mid");
                $("#" + prevIndex + "-" + nonIdentical_Id_Part).addClass("to-left");
            }, 400);
            setTimeout(function () {
                $("#" + prevIndex + "-" + nonIdentical_Id_Part).removeClass("anime-slide-to-left");
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("anime-slide-from-right-to-mid");
            }, 800);

            $(".slider-dots").removeClass('active');;
            $(".btn-sliders-slide-to-left").attr("data-index", currentIndex);
            $(".btn-sliders-slide-to-right").attr("data-index", currentIndex);
            $("#" + currentIndex + "-TutorialDot_Box").addClass("active");
        }
        else {
            $("#" + currentIndex + "-" + nonIdentical_Id_Part).addClass("anime-empty-slide-to-left");
            setTimeout(function () {
                $("#" + currentIndex + "-" + nonIdentical_Id_Part).removeClass("anime-empty-slide-to-left");
            }, 400);
        }
    }
}

function createGUID() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

//Sync
function createTutorialContainer(header = null, nonUniqueIdentifierName = null, familyClassname = null, icons = [], htmls = []) {
    if ((icons != null && icons.length > 0) && (htmls != null && htmls.length > 0)) {
        let divExists = document.getElementById("Tutorials_Container");
        familyClassname = familyClassname == null ? createGUID() : familyClassname;
        nonUniqueIdentifierName = nonUniqueIdentifierName == null ? createGUID() : nonUniqueIdentifierName;

        if (divExists == null) createHeadlessSmContainer("Tutorials", '<div class="div-swiper mx-auto"></div> <div class="box-standard mt-2" id="TutorialSamples_Box"> </div> <div class="box-standard hstack gap-2 text-center mt-2"> <button type="button" class="btn btn-standard btn-sliders-slide-to-left me-2" id="TutorialSample_Box-ToLeft_Btn" data-index="0"> <i class="fa-solid fa-circle-left"></i> </button> <div class="box-standard text-center mx-auto" id="TutorialDots_Box"> </div> <button type="button" class="btn btn-standard btn-sliders-slide-to-right ms-2" id="TutorialSample_Box-ToRight_Btn" data-index="0" data-family="lyrics-sync-tutorials"> <i class="fa-solid fa-circle-right"></i> </button> </div>', false);
        $("#TutorialDots_Box").empty();
        $("#TutorialSamples_Box").empty();
        $(".btn-sliders-slide-to-left").attr("data-index", 0);
        $(".btn-sliders-slide-to-right").attr("data-index", 0);
        $("#TutorialSample_Box-ToRight_Btn").attr("data-family", familyClassname);

        for (let i = 0; i < htmls.length; i++) {
            let dotBox;
            let mainBox;
            if (i != 0) {
                dotBox = elementDesigner("div", "slider-dots", null);
                mainBox = elementDesigner("div", "box-sm-part-sliding to-right" + familyClassname, null);
            }
            else {
                dotBox = elementDesigner("div", "slider-dots active", null);
                mainBox = elementDesigner("div", "box-sm-part-sliding " + familyClassname, null);
            }
            let stackBox = elementDesigner("div", "box-tutorial row", null);
            let iconCol = elementDesigner("div", "col col-3", null);
            let textCol = elementDesigner("div", "col col-9", null);
            let iconBox = elementDesigner("div", "tutorial-icon", null);
            let textSpan = elementDesigner("span", "card-text white-space-on", htmls[i]);

            if (icons[i] != null || icons[i] != undefined) iconBox.html(icons[i]);
            iconCol.append(iconBox);
            textCol.append(textSpan);
            stackBox.append(iconCol);
            stackBox.append(textCol);
            mainBox.append(stackBox);
            dotBox.attr("id", i + "-TutorialDot_Box");
            mainBox.attr("id", i + "-" + nonUniqueIdentifierName);

            $("#TutorialDots_Box").append(dotBox);
            $("#TutorialSamples_Box").append(mainBox);

            displayCorrector(currentWindowSize);
            setTimeout(function () {
                callASmContainer(false, "Tutorials_Container");
            }, 150);
        }
    }
}

$(document).on("mousedown", ".btn-sliders-slide-to-left", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let currentIndex = $(this).attr("data-index");
        let nonIdenticalPart = getTrueId(thisId, false);
        if (currentIndex != undefined && nonIdenticalPart != null) sliderSlideToLeft(currentIndex, nonIdenticalPart);
    }
});
$(document).on("mousedown", ".btn-sliders-slide-to-right", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        let currentIndex = $(this).attr("data-index");
        let nonIdenticalPart = getTrueId(thisId, false);
        let familyClassname = $(this).attr("data-family");
        if (currentIndex != undefined && nonIdenticalPart != null && familyClassname != undefined) sliderSlideToRight(familyClassname, currentIndex, nonIdenticalPart);
    }
});

$(document).on("touchstart", ".box-sm-part-sliding", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".box-sm-part-sliding", function (event) {
    let thisId = $(this).attr("id");
    if (thisId != undefined || thisId != "") {
        let moveDirection = handleTouchMove(event);
        let currentIndex = getTrueId(thisId, false);
        let nonIdenticalPart = getTrueId(thisId, true);

        if (moveDirection === 3) {
            sliderSlideToRight("lyric-sync-tutorials", currentIndex, nonIdenticalPart);
            $(".box-sm-part-sliding").removeClass("untouchable");
        }
        else if (moveDirection == 2) {
            sliderSlideToLeft(currentIndex, nonIdenticalPart);
            $(".box-sm-part-sliding").removeClass("untouchable");
        }
        xDown = null;
        yDown = null;
    }
});

function slideSmContainers(closingContainerId, id) {
    if (closingContainerId == null) {
        uncallASmContainer(true, null);
        setTimeout(function () {
            callASmContainer(false, id);
        }, 600);
    }
    else {
        uncallASmContainer(false, closingContainerId);
        setTimeout(function () {
            callASmContainer(false, id);
        }, 600);
    }
}

function slideContainers(closingContainerId, id) {
    if (closingContainerId == null) {
        uncallAContainer(true, null);
        setTimeout(function () {
            callAContainer(false, id);
        }, 600);
    }
    else {
        uncallAContainer(false, closingContainerId);
        setTimeout(function () {
            callAContainer(false, id);
        }, 600);
    }
}

$(document).on("mousedown", ".box-card-manager", function () {
    let activeCardsQty = openedSmContainers.length;
    if (activeCardsQty > 1) {
        createSmContainer("ActiveSmCards", "Active Cards", null, null, null, false);
        $("#ActiveSmCards_Box").empty();
        for (let i = 0; i < openedSmContainers.length; i++) {
            let cardTitle = $("#" + openedSmContainers[i]).attr("data-title");
            let cardNameSeparator = $("<br/>");
            let cardMainBox = elementDesigner("div", "box-standard hstack gap-2", null);
            let cardSampleBox = elementDesigner("div", "box-listed box-reopen w-100", null);
            let cardSampleInfoBox = elementDesigner("div", "box-standard", null);
            let cardSampleBtnsBox = elementDesigner("div", "box-standard ms-auto", null);
            let cardNameLbl = elementDesigner("span", "h6", cardTitle != undefined ? cardTitle : "Untitled Card");
            let cardSmallSpan = elementDesigner("small", "card-text text-muted", "Tap to reopen");
            let cardRemoveBtn = elementDesigner("button", "btn btn-standard btn-remove-the-card btn-sm", ' <i class="fa-solid fa-xmark"></i> ');

            cardMainBox.attr("id", openedSmContainers[i] + "-CardInfo_Box");
            cardRemoveBtn.attr("id", openedSmContainers[i] + "-RemoveTheCard_Btn");

            cardSampleInfoBox.append(cardNameLbl);
            cardSampleInfoBox.append(cardNameSeparator);
            cardSampleInfoBox.append(cardSmallSpan);
            cardSampleBtnsBox.append(cardRemoveBtn);
            cardSampleBox.append(cardSampleInfoBox);
            cardMainBox.append(cardSampleBox);
            cardMainBox.append(cardSampleBtnsBox);

            $("#ActiveSmCards_Box").append(cardMainBox);
        }
        let cardsQtyLbl = elementDesigner("p", "card-text text-muted text-center mt-2", null);
        let cardsOnlyQtySpan = elementDesigner("small", "card-text fw-500", null);
        let cardsQtyTextSpan = elementDesigner("small", "card-text", null);
        cardsOnlyQtySpan.attr("id", "ActiveCardsQty_Span");
        cardsQtyTextSpan.attr("id", "ActiveCardsText_Span");
        cardsQtyLbl.append(cardsOnlyQtySpan);
        cardsQtyLbl.append(cardsQtyTextSpan);
        cardsOnlyQtySpan.html(activeCardsQty);
        if (activeCardsQty > 1) cardsQtyTextSpan.text(" active cards");
        else cardsQtyTextSpan.text(" active card");

        $("#ActiveSmCards_Box").append(cardsQtyLbl);
        displayCorrector(currentWindowSize);
        setTimeout(function () {
            callASmContainer(false, "ActiveSmCards_Container", true);
        }, 150);
    }
});

$(document).on("mousedown", ".box-reopen", function () {
    let thisId = getTrueId($(this).attr("id"), false);
    if (thisId != undefined) {
        uncallASmContainer(false, "ActiveSmCards_Container");
        setTimeout(function () {
            callASmContainer(false, thisId, false);
        }, 600);
    }
});

$(document).on("mousedown", ".btn-remove-the-card", function () {
    let thisId = getTrueId($(this).attr("id"), false);
    if (thisId != undefined) {
        //.div-swiper
        unpushLastSmContainerFromList(thisId);
        hideBySlidingToLeft(false, null, thisId + "-CardInfo_Box");
        let getLastCardId = getLastOpenedSmContainer();
        setTimeout(function () {
            uncallASmContainer(false, "ActiveSmCards_Container", true);
        }, 300);
        setTimeout(function () {
            $(this).remove();
            slideSmContainers(thisId, getLastCardId);
        }, 900);
    }
});

function uncallCardManager() {
    $(".box-card-manager").removeClass("active");
    $(".box-card-manager").css("bottom", "-1200px");
    setTimeout(function () {
        $(".box-card-manager").empty();
        $(".box-card-manager").fadeOut(300);
    }, 300);
}

function callASmContainer(callByClassname, id, doNotTrack = false) {
    let alertBottom = 0;
    let lastOpenedContainer = null;
    let isThisCardStocked = openedSmContainers.includes(id);
    let isPlayerActive = $(".ongaku-player-box").css("bottom");
    let anySideBar = document.getElementsByClassName("side-navbar");
    //let checkCardManagerAvailability = document.getElementById("SmCardsManager_Box");

    $(".btn-sticky-at-bottom").css("opacity", 0);
    if (anySideBar != null && anySideBar.length > 0) {
        $(".box-sm-part-inner").css("left", "6%");
        $(".box-sm-part-inner").css("width", "93.25%");
    }

    if (isPlayerActive != undefined) isPlayerActive = parseInt(parseInt($(".ongaku-player-box").css("bottom")) + parseInt($(".ongaku-player-box").innerHeight()));
    if (parseInt(currentWindowSize) < 1024) alertBottom += bottomNavbarH;
    alertBottom = isPlayerActive > 0 ? alertBottom + isPlayerActive : 0;

    if (callByClassname) {
        $(".box-sm-part-inner").addClass("passive");
        $(".box-sm-part-inner").removeClass("active");
        $("." + id).addClass("active");
        $("." + id).removeClass("passive");
        setTimeout(function () {
            $("." + id).css("bottom", alertBottom + 45 + "px");
        }, 300);
        setTimeout(function () {
            $("." + id).css("bottom", alertBottom + "px");
        }, 600);
        setTimeout(function () {
            $("." + id).css("bottom", alertBottom + 10 + "px");
        }, 900);
    }
    else {
        $("#" + id).fadeIn(0);
        lastOpenedContainer = getLastOpenedSmContainer();

        if (lastOpenedContainer != null && isThisCardStocked) {
            $("#" + lastOpenedContainer).css("bottom", alertBottom + 25 + "px");
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + 200 + "px");
                $("#" + lastOpenedContainer).css("bottom", alertBottom - 150 + "px");
            }, 300);
            setTimeout(function () {
                $("#" + lastOpenedContainer).addClass("passive");
                $("#" + lastOpenedContainer).removeClass("active");
                $("#" + id).addClass("active");
                $("#" + id).removeClass("passive");
                $("#" + id).css("bottom", alertBottom + "px");
                $("#" + lastOpenedContainer).css("bottom", alertBottom + 10 + "px");
            }, 600);
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + 10 + "px");
            }, 900);
        }
        else {
            $(".box-sm-part-inner").addClass("passive");
            $(".box-sm-part-inner").removeClass("active");
            $("#" + id).addClass("active");
            $("#" + id).removeClass("passive");
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + 45 + "px");
            }, 300);
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + "px");
            }, 600);
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + 10 + "px");
                $(".box-sm-part-inner").css("bottom", alertBottom + 10 + "px");
            }, 900);
        }

        if (!doNotTrack) pushSmContainerToList(id);
    }
}
//release-img
function uncallASmContainer(callByClassname, id, doNotReopenLastCard = false) {
    let alertBottom = 0;
    let isPlayerActive = $(".ongaku-player-box").css("bottom");
    if (isPlayerActive != undefined) isPlayerActive = parseInt(isPlayerActive) + parseInt($(".ongaku-player-box").innerHeight());
    else isPlayerActive = 0;

    if (parseInt(currentWindowSize) < 1024) alertBottom = bottomNavbarH;
    else alertBottom = 10;
    if (isPlayerActive != undefined && parseInt(isPlayerActive) > 0) {
        if (!$(".ongaku-player-box").hasClass("ongaku-player-box-enlarged")) alertBottom += isPlayerActive;
    }

    if (callByClassname) {
        $("." + id).css("bottom", alertBottom + 45 + "px");
        setTimeout(function () {
            $("." + id).addClass("passive");
            $("." + id).removeClass("active");
            $("." + id).css("bottom", "-1200px");
        }, 300);
        setTimeout(function () {
            $("." + id).fadeOut(0);
            $(".box-sm-part-inner").addClass('active');
            $(".box-sm-part-inner").removeClass('passive');
        }, 600);
    }
    else {
        unpushLastSmContainerFromList(id);
        let lastOpenedContainer = getLastOpenedSmContainer();
        $("#" + id).css("bottom", alertBottom + 45 + "px");
        setTimeout(function () {
            $("#" + id).addClass("passive");
            $("#" + id).removeClass("active");
            $("#" + id).css("bottom", "-1200px");
        }, 300);
        setTimeout(function () {
            $("#" + id).fadeOut(0);
            if (lastOpenedContainer != null) {
                $("#" + lastOpenedContainer).addClass('active');
                $("#" + lastOpenedContainer).removeClass("passive");
            }
        }, 600);
    }

    $(".btn-sticky-at-bottom").css("opacity", 1);
    $(".box-sticky-at-bottom").css("opacity", 1);
}

function makePassiveAllActiveSmContainers(openSmContainers = []) {
    if (openSmContainers.length > 0) {
        for (let i = 0; i < openSmContainers.length; i++) {
            if ($("#" + openSmContainers[i]).hasClass("active")) {
                $("#" + openSmContainers[i]).addClass("passive");
                $("#" + openSmContainers[i]).removeClass("active");
            }
        }
    }
}

function getLastOpenedSmContainer() {
    if (openedSmContainers != null && openedSmContainers.length > 0) return openedSmContainers[openedSmContainers.length - 1];
    else return null;
}

function pushSmContainerToList(elementId) {
    if (elementId != null || elementId != undefined) {
        if (openedSmContainers.length > 0) {
            for (let i = 0; i < openedSmContainers.length; i++) {
                if (openedSmContainers[i] == elementId) {
                    openedSmContainers.splice(i, 1);
                }
            }
        }
        openedSmContainers.push(elementId);

        return openedSmContainers;
    }
    else return null;
}

function unpushLastSmContainerFromList(elementId) {
    if (elementId != null || elementId != undefined) {
        let lastElementIndex = openedSmContainers.lastIndexOf(elementId);
        if (lastElementIndex != -1) {
            openedSmContainers.splice(lastElementIndex, 1);
            return openedSmContainers;
        }
        else return null;
    }
    else return null;
}

function uncallAContainer(callByClassname, id) {
    let newOpenedContainersArr = [];
    let alertBottom = 0;
    if (callByClassname) {
        $(".box-lg-part").css("bottom", alertBottom + 24 + "px");
        setTimeout(function () {
            $(".box-lg-part").css("bottom", "-1200px");
        }, 300);
        setTimeout(function () {
            $(".box-lg-part").fadeOut(0);
        }, 600);

        for (let i = 0; i < openedContainers.length; i++) {
            if (openedContainers[i] != "." + id) {
                newOpenedContainersArr.push(openedContainers[i]);
            }
        }
    }
    else {
        $("#" + id).css("bottom", alertBottom + 24 + "px");
        setTimeout(function () {
            $("#" + id).css("bottom", "-1200px");
        }, 300);
        setTimeout(function () {
            $("#" + id).fadeOut(0);
        }, 600);

        for (let i = 0; i < openedContainers.length; i++) {
            if (openedContainers[i] != "." + id) {
                newOpenedContainersArr.push(openedContainers[i]);
            }
        }
    }
    $(".btn-sticky-at-bottom").css("opacity", 1);
    $(".box-sticky-at-bottom").css("opacity", 1);
    openedContainers = newOpenedContainersArr;
}

function fieldMarker(fieldBoxElementId, buttonId, buttonBaseHtml) {
    if (fieldBoxElementId != null) {
        $("#" + fieldBoxElementId).fadeIn(300);
        if (buttonId != null && buttonBaseHtml != null) {
            $("#" + buttonId).html(' <i class="fa-solid fa-check-double"></i> ' + buttonBaseHtml);
            $("#" + buttonId).addClass("btn-field-added");
        }
    }
}

function fieldUnmarker(fieldBoxElementId, fieldElementId, buttonId, buttonBaseHtml) {
    if (fieldElementId != null) {
        $("#" + fieldBoxElementId).fadeOut(300);
        if (fieldElementId != null) {
            $("#" + fieldBoxElementId).val(null);
        }
        if (buttonId != null && buttonBaseHtml != null) {
            buttonBaseHtml = buttonBaseHtml.split("</i>");
            buttonBaseHtml.shift();
            $("#" + buttonId).removeClass("btn-field-added");
            if (buttonBaseHtml != undefined) $("#" + buttonId).html(buttonBaseHtml);
        }
    }
}

function callAStickyBox(id, baseHtmlToSet, buttonElementId) {
    if (id != null) {
        let bottomValue = 80;
        $("#" + id).fadeIn(0);
        $("#" + id).css("bottom", bottomValue + "px");
        setTimeout(function () {
            bottomValue -= 32;
            $("#" + id).css("bottom", bottomValue + "px");
        }, 300);
        setTimeout(function () {
            bottomValue += 12;
            $("#" + id).css("bottom", bottomValue + "px");
        }, 600);
    }

    if (buttonElementId != null) {
        baseHtmlToSet = baseHtmlToSet == null ? "Open" : baseHtmlToSet;
        $("#" + buttonElementId).html('&times; Close');
        $("#" + buttonElementId).removeClass("btn-open-sticky-box");
        $("#" + buttonElementId).addClass("btn-close-sticky-box");
        $("#" + buttonElementId).attr("data-base-html", baseHtmlToSet);
    }
}

function uncallAStickyBox(closeAll = false, id, baseHtml, buttonElementId) {
    if (!closeAll) {
        if (id != null) {
            let bottomValue = 80;
            $("#" + id).css("bottom", bottomValue + "px");
            setTimeout(function () {
                bottomValue = -1200;
                $("#" + id).css("bottom", bottomValue + "px");
            }, 300);
            setTimeout(function () {
                $("#" + id).fadeOut(0);
            }, 600);
        }
    }
    else {
        let bottomValue = 80;
        $(".box-sticky-at-bottom").css("bottom", bottomValue + "px");
        setTimeout(function () {
            bottomValue = -1200;
            $(".box-sticky-at-bottom").css("bottom", bottomValue + "px");
        }, 300);
        setTimeout(function () {
            $(".box-sticky-at-bottom").fadeOut(0);
        }, 600);
    }

    if (buttonElementId != null) {
        baseHtml = baseHtml == undefined ? "Open" : baseHtml;
        $("#" + buttonElementId).html(baseHtml);
        $("#" + buttonElementId).addClass("btn-open-sticky-box");
        $("#" + buttonElementId).removeClass("btn-close-sticky-box");
    }
    else {
        $(".btn-close-sticky-box").html(baseHtml);
    }
}

async function getOSInfo() {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    if (platform.includes("win")) return "Windows";
    if (platform.includes("linux")) return "Linux";
    if (platform.includes("mac")) return "Mac";
    if (/android/.test(userAgent)) return "Android";
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';

    return "Unknown";
}

function shortcutImplementation(osInfo = null, keyCode = 0, metaKeyPressed = false, ctrlPressed = false, altPressed = false, shiftPressed = false) {
    if (osInfo != null || osInfo != undefined) {
        let isMac = false;
        let audioPlayer = null;

        if (osInfo.toLowerCase() == "mac" || osInfo.toLowerCase() == "ios") isMac = true;
        if (isMac) ctrlPressed = metaKeyPressed; //Mac

        if (altPressed && shiftPressed) {
            switch (parseInt(keyCode)) {
                case 83:
                    audioPlayer = audioPlayer == null ? document.getElementById("OngakuPlayer_Audio") : audioPlayer;
                    if (audioPlayer.paused) audioContinue(audioPlayer.id, null);
                    else audioPause(audioPlayer.id);
                    break;
                case 68:
                    $(".btn-ongaku-player-forward").mousedown();
                    break;
                case 65:
                    $(".btn-ongaku-player-backward").mousedown();
                    break;
                case 82:
                    $(".btn-audio-loop").mousedown();
                    break;
                case 38:
                    enlargeMediaPlayer(currentWindowSize);
                    break;
                case 40:
                    dwindleMediaPlayer(currentWindowSize);
                    break;
                case 72:
                    let pathName = (window.location.pathname).toLowerCase();
                    if (pathName == "/" || pathName == "/home/index") slideContainers(null, "Primary_Container");
                    else window.location.href = "/Home/Index";
                    break;
                case 90:
                    $("#GetPlaylists_Type_Val").val(0);
                    $("#GetPlaylists_Form").submit();
                    break;
                case 37:
                    internalVolume = internalVolume <= 2 ? 0 : internalVolume - 2;
                    audioEdit("OngakuPlayer_Audio", internalVolume, null, null, null, true);
                    break;
                case 39:
                    internalVolume = internalVolume <= 98 ? internalVolume + 2 : 100;
                    audioEdit("OngakuPlayer_Audio", internalVolume, null, null, null, true);
                    break;
                case 70:
                    internalVolume = 0;
                    audioEdit("OngakuPlayer_Audio", internalVolume, null, null, null, true);
                    break;
                case 81:
                    playbackRateMultiplier += 0.5;
                    playbackRateMultiplier = playbackRateMultiplier > 2.5 ? 0.5 : playbackRateMultiplier;
                    audioEdit("OngakuPlayer_Audio", null, playbackRateMultiplier, null, null, true);
                    break;
                case 189:
                    audioPlayerRewind("OngakuPlayer_Audio", 15, false, true);
                    break;
                case 187:
                    audioPlayerRewind("OngakuPlayer_Audio", 15, true, true);
                    break;
                default:
                    break;
            }
        }
    }
}
function slideToPrevPage(paginationMainId, currentPage, maxPages) {
    if ((paginationMainId != null || paginationMainId != undefined) && (currentPage <= maxPages && currentPage >= 0)) {
        maxPages = parseInt(maxPages);
        currentPage = parseInt(currentPage);
        let prevPage = currentPage > 0 ? currentPage - 1 : maxPages;

        $(".btn-next-page").addClass("super-disabled");
        $(".btn-prev-page").addClass("super-disabled");
        $("#" + currentPage + "-" + paginationMainId).removeClass("faded");
        $("#" + currentPage + "-" + paginationMainId).addClass("fading");
        setTimeout(function () {
            $("#" + currentPage + "-" + paginationMainId).removeClass("fading");
            $("#" + prevPage + "-" + paginationMainId).addClass("fading");
        }, 250);
        setTimeout(function () {
            $("#" + prevPage + "-" + paginationMainId).removeClass("fading");
            $("#" + prevPage + "-" + paginationMainId).addClass("faded");
            $(".btn-next-page").removeClass("super-disabled");
            $(".btn-prev-page").removeClass("super-disabled");
        }, 500);
        $(".pagination-index-dot").removeClass("active");
        $("#" + prevPage + "-" + paginationMainId + "_PaginationDot").addClass("active");
        $("#" + paginationMainId + "-ToPrev_Btn").attr("data-current-page", prevPage);
        $("#" + paginationMainId + "-ToNext_Btn").attr("data-current-page", prevPage);
    }
}

function slideToNextPage(paginationMainId, currentPage, maxPages) {
    if ((paginationMainId != null || paginationMainId != undefined) && (currentPage <= maxPages && currentPage >= 0)) {
        maxPages = parseInt(maxPages);
        currentPage = parseInt(currentPage);
        let nextPage = currentPage == maxPages ? 0 : currentPage + 1;

        $(".btn-next-page").addClass("super-disabled");
        $(".btn-prev-page").addClass("super-disabled");
        $("#" + currentPage + "-" + paginationMainId).removeClass("faded");
        $("#" + currentPage + "-" + paginationMainId).addClass("fading");
        setTimeout(function () {
            $("#" + currentPage + "-" + paginationMainId).removeClass("fading");
            $("#" + nextPage + "-" + paginationMainId).addClass("fading");
        }, 250);
        setTimeout(function () {
            $("#" + nextPage + "-" + paginationMainId).removeClass("fading");
            $("#" + nextPage + "-" + paginationMainId).addClass("faded");
            $(".btn-next-page").removeClass("super-disabled");
            $(".btn-prev-page").removeClass("super-disabled");
        }, 500);

        $(".pagination-index-dot").removeClass("active");
        $("#" + nextPage + "-" + paginationMainId + "_PaginationDot").addClass("active");
        $("#" + paginationMainId + "-ToPrev_Btn").attr("data-current-page", nextPage);
        $("#" + paginationMainId + "-ToNext_Btn").attr("data-current-page", nextPage);
    }
}

async function createModal(id, title, body, hasFooter = false, footerBody, openOnCreate = false) {
    if ((id != null || id != undefined) || (body != null || body != undefined)) {
        $("body").append('<div class="modal fade" id="' + id + '_Modal" tabindex="-1" aria-labelledby="' + id + '_Modal_Lbl" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="btn btn-modal-close float-end ms-1" data-bs-dismiss="modal" aria-label="Close"> <i class="fa-solid fa-xmark"></i> </button> <h5 class="modal-title" id="' + id + '_Modal_Lbl">Modal Title</h5> </div> <div class="modal-body" id="' + id + '_ModalBody"> </div> <div class="modal-footer" id="' + id + '_ModalFooter"> </div> </div> </div> </div>');
        if (title != null || title != undefined) $("#" + id + "_Modal_Lbl").html(title);
        else $("#" + id + "_Modal_Lbl").fadeOut(0);

        $("#" + id + "_ModalBody").html(body);

        if (!hasFooter) $("#" + id + "_ModalFooter").fadeOut(0);
        else $("#" + id + "_ModalFooter").html(footerBody);

        if (openOnCreate) {
            setTimeout(function () {
                $("#" + id + "_Modal").modal("show");
            }, 300);
        }
    }
}

function callAModal(callByClassname = false, id = null) {
    if (id != undefined || id != null) {
        if (callByClassname) $("." + id).modal("show");
        else $("#" + id).modal("show");
    }
}

async function callAContainer(callByClassname, id, doNotList) {
    let alertBottom = 0;
    if (callByClassname) {
        setTimeout(function () {
            $("." + id).css("bottom", alertBottom + 24 + "px");
        }, 600);
        setTimeout(function () {
            $("." + id).css("bottom", alertBottom + "px");
        }, 900);
    }
    else {
        if ($("#" + id).hasClass("box-lg-part-inner")) {
            alertBottom += 12;
            $(".btn-sticky-at-bottom").css("opacity", 0);
            $(".box-sticky-at-bottom").css("opacity", 0);
        }

        $("#" + id).fadeIn(0);
        $("#" + id).css("bottom", alertBottom + 24 + "px");
        setTimeout(function () {
            $("#" + id).css("bottom", alertBottom + "px");
        }, 300);
    }

    if (!doNotList) openedContainers.push(id);
    setTimeout(function () {
        lgPartContainerCorrector(playerPosition);
    }, 300);
}

async function callInsideLgContainer(callByClassname = false, elementId = null, doNotList = false) {
    if (elementId != null || elementId != undefined) {
        let alertBottom = alertBottomValue;
        if (callByClassname) {
            alertBottom += 60;
            $("." + elementId).fadeIn(0);
            $(".box-lg-part-inner").addClass("passive");
            $("." + elementId).removeClass("passive");
            $("." + elementId).css("bottom", alertBottom + "px");
            setTimeout(function () {
                alertBottom -= 75;
                $("." + elementId).css("bottom", alertBottom + "px");
            }, 350);
            setTimeout(function () {
                alertBottom += 15;
                $("." + elementId).css("bottom", alertBottom + "px");
            }, 700);
        }
        else {
            alertBottom += 55;
            $("#" + elementId).fadeIn(0);
            $(".box-lg-part-inner").addClass("passive");
            $("#" + elementId).removeClass("passive");
            $("#" + elementId).css("bottom", alertBottom + "px");
            setTimeout(function () {
                alertBottom -= 65;
                $("#" + elementId).css("bottom", alertBottom + "px");
            }, 350);
            setTimeout(function () {
                alertBottom += 10;
                if (!doNotList) openInsideLgCardsArr.push(elementId);
                $("#" + elementId).css("bottom", alertBottom + "px");
            }, 700);
        }
    }
}

function uncallLgInsideContainer(callByClassname = false, elementId = null) {
    if (elementId != null || elementId != undefined) {
        let lastCardId = undefined;
        let alertBottom = alertBottomValue;
        if (callByClassname) {
            alertBottom += 60;
            $("." + elementId).css("bottom", alertBottom);
            setTimeout(function () {
                $("." + elementId).css("bottom", "-1200px");
            }, 350);
            setTimeout(function () {
                $("." + elementId).fadeOut(0);
                $("." + elementId).addClass("hidden");
            }, 600);

            let thisCardIndex = openInsideLgCardsArr.length - 1;
            if (thisCardIndex != -1) {
                openInsideLgCardsArr.splice(thisCardIndex, 1);
                lastCardId = openInsideLgCardsArr.length > 0 ? openInsideLgCardsArr[openInsideLgCardsArr.length - 1] : undefined;
            }
            if (lastCardId != undefined) callInsideLgContainer(false, lastCardId);
        }
        else {
            alertBottom += 45;

            $("#" + elementId).css("bottom", alertBottom);
            setTimeout(function () {
                $("#" + elementId).css("bottom", "-1200px");
            }, 350);
            setTimeout(function () {
                $("#" + elementId).fadeOut(0);
                $("#" + elementId).addClass("hidden");

                let thisCardIndex = openInsideLgCardsArr.lastIndexOf(elementId);
                if (thisCardIndex != -1) {
                    openInsideLgCardsArr.splice(thisCardIndex, 1);
                    lastCardId = openInsideLgCardsArr.length > 0 ? openInsideLgCardsArr[openInsideLgCardsArr.length - 1] : undefined;
                }
                if (lastCardId != undefined) callInsideLgContainer(false, lastCardId, true);
            }, 600);
        }
    }
}

function callKawaiiAlert(purpose = 0, bodyHtml = null, additionalIcon = null, additionalValue = 0, additionalBtnAction = null, duration = 3, isDestructable = true) {
    if (purpose != null || purpose != undefined) {
        let bottomH = alertBottomValue;
        if ($("#Ongaku_Alert").hasClass("active") && currentWindowSize >= 1024) bottomH += parseInt($("#Ongaku_Alert").innerHeight()) + 10;
        $("#Kawaii_Alert").css("bottom", bottomH + "px");
        //0 - regular short alert;
        //1 - change or edit alert (more important actions);
        //2 - volume change alert;
        //3 - other player settings alert;
        //4 - alert with additional button instead of destruction button;
        //5 - ROFL alert;
        clearTimeout(kawaiiAlertTimeoutValue);
        $("#KawaiiAlert_Box").empty();
        $("#KawaiiAlert_Additional_Btn").html("");
        $("#KawaiiAlert_Additional_Btn").fadeOut(0);
        $("#KawaiiAlert_Additional_Btn").removeAttr("onmousedown");
        $("#KawaiiAlert_Additional_Btn").addClass("super-disabled untouched");
        switch (parseInt(purpose)) {
            case 0:
                $("#KawaiiAlert_Box").html("<span class='card-text'>" + bodyHtml + "</span>");
                $("#KawaiiAlertIcon_Span").html(' <i class="fa-solid fa-circle-info"></i> ');
                if (isDestructable) $(".btn-kawaii-alert-close").fadeIn(0);
                else $(".btn-kawaii-alert-close").fadeOut(0);
                break;
            case 1:
                $("#KawaiiAlert_Box").html("<span class='card-text'>" + bodyHtml + "</span>");
                $("#KawaiiAlertIcon_Span").html(' <i class="fa-regular fa-star fa-flip" --fa-animation-duration="0.75s;" --fa-animation-iteration-count: 2;></i> ');
                if (isDestructable) $(".btn-kawaii-alert-close").fadeIn(0);
                else $(".btn-kawaii-alert-close").fadeOut(0);
                break;
            case 2:
                additionalValue = parseFloat(additionalValue);
                additionalValue = additionalValue != undefined ? additionalValue : 50;

                $(".btn-kawaii-alert-close").fadeOut(0);
                $("#KawaiiAlert_Additional_Btn").fadeIn(0);
                $("#KawaiiAlertIcon_Span").html(' <i class="fa-solid fa-music"></i> ');
                $("#KawaiiAlert_Box").html('<div class="volume-level-box"><div class="volume-level-bar"></div></div>');
                $(".volume-level-bar").css("width", additionalValue + "%");
                if (additionalIcon == undefined || additionalIcon == null) {
                    if (additionalValue == 0) $("#KawaiiAlert_Additional_Btn").html(' <i class="fa-solid fa-volume-xmark p-2 pt-1 pb-1"></i> ');
                    else if (additionalValue > 0 && additionalValue <= 33) $("#KawaiiAlert_Additional_Btn").html(' <i class="fa-solid fa-volume-off p-2 pt-1 pb-1"></i> ');
                    else if (additionalValue > 33 && additionalValue <= 66) $("#KawaiiAlert_Additional_Btn").html(' <i class="fa-solid fa-volume-low p-2 pt-1 pb-1"></i> ');
                    else $("#KawaiiAlert_Additional_Btn").html(' <i class="fa-solid fa-volume-high p-2 pt-1 pb-1"></i> ');
                }
                else $("#KawaiiAlert_Additional_Btn").html(' ' + additionalIcon + ' ');
                break;
            case 3:
                if ((bodyHtml != undefined || bodyHtml != null) && (additionalIcon != undefined || additionalIcon != null) && (additionalValue != undefined || additionalValue != null)) {
                    additionalValue = parseFloat(additionalValue);
                    $("#KawaiiAlertIcon_Span").html(' <i class="fa-solid fa-sliders"></i> ')
                    $(".btn-kawaii-alert-close").fadeOut(0);
                    $("#KawaiiAlert_Additional_Btn").fadeIn(0);
                    $("#KawaiiAlert_Additional_Btn").html(' ' + additionalIcon + ' ');
                    $("#KawaiiAlert_Box").html(bodyHtml);
                }
                break;
            case 4:
                if (additionalBtnAction != null || additionalBtnAction != undefined) {
                    $("#KawaiiAlertIcon_Span").html('')
                    $(".btn-kawaii-alert-close").fadeOut(0);
                    $("#KawaiiAlert_Additional_Btn").fadeIn(0);
                    $("#KawaiiAlert_Additional_Btn").attr("onmousedown", additionalBtnAction);
                    $("#KawaiiAlert_Additional_Btn").html(additionalIcon == undefined ? ' <i class="fa-regular fa-circle"></i> ' : additionalIcon);
                }
                break;
            case 5:
                $("#KawaiiAlertIcon_Span").html(' <i class="fa-solid fa-code"></i> ');
                $("#KawaiiAlert_Box").html("<span class='card-text'>For development purposes only (DO NOT TOUCH THIS)</span>");
                if (isDestructable) $(".btn-kawaii-alert-close").fadeIn(0);
                else $(".btn-kawaii-alert-close").fadeOut(0);
                break;
            default:
                $("#KawaiiAlertIcon_Span").html(' <i class="fa-solid fa-circle-info"></i> ');
                if (isDestructable) $(".btn-kawaii-alert-close").fadeIn(0);
                else $(".btn-kawaii-alert-close").fadeOut(0);
                break;
        }

        duration = duration <= 3.5 ? duration : 2.75;
        setTimeout(function () {
            $("#Kawaii_Alert").fadeIn(150);
            $("#Kawaii_Alert").addClass("active");
            kawaiiAlertTimeoutValue = setTimeout(function () {
                $("#Kawaii_Alert").fadeOut(150);
                $("#Kawaii_Alert").removeClass("active");
            }, duration * 1000);
        }, 350);
    }
}

function callAlert(icon, backgroundColor, foregroundColor, text, duration, buttonText, buttonActionType, buttonAction) {
    let kawaiiAlertBottom = 0;
    let alertBottom = bottomNavbarH;
    if (icon != null) $("#OngakuAlert_Icon_Lbl").html(" " + icon + " ");
    else $("#OngakuAlert_Icon_Lbl").html(' <i class="fa-solid fa-circle-info"></i> ');

    clearInterval(intervalValue);
    clearTimeout(timeoutValue);

    if (backgroundColor != null) {
        $(".ongaku-alert").css("background-color", "#" + backgroundColor);
        $("#OngakuAlert_Btn").css("background-color", "#" + foregroundColor);
        $("#OngakuAlert_Btn").css("color", "#" + backgroundColor);
        $(".ongaku-alert-icon").css("color", "#" + foregroundColor);
        $(".ongaku-alert-text").css("color", "#" + foregroundColor);
    }
    else {
        $(".ongaku-alert").css("background-color", "rgba(43, 43, 43, 0.55)");
        $("#OngakuAlert_Btn").css("background-color", "#fdfdfd");
        $("#OngakuAlert_Btn").css("color", "#2B2B2B");
        $(".ongaku-alert-icon").css("color", "#fdfdfd");
        $(".ongaku-alert-text").css("color", "#fdfdfd");
    }

    let isVisible = isElementVisible(false, "Ongaku_Alert");
    if ($("#Kawaii_Alert").hasClass("active") && currentWindowSize >= 1024) kawaiiAlertBottom = alertBottomValue + parseInt($("#Ongaku_Alert").innerHeight()) + 10;
    else kawaiiAlertBottom = alertBottomValue;

    if (isVisible) {
        $(".ongaku-alert").fadeIn(0);
        $(".ongaku-alert").addClass("active");
        $(".ongaku-alert").css("bottom", alertBottom + 48 + "px");
        $("#Kawaii_Alert").css("bottom", kawaiiAlertBottom + 35 + "px");
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", "-1200px");
            $("#Kawaii_Alert").css("bottom", alertBottomValue + "px");
        }, 350);
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", alertBottom + 48 + "px");
            $("#Kawaii_Alert").css("bottom", kawaiiAlertBottom + 35 + "px");
        }, 700);
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", alertBottom + 16 + "px");
            $("#Kawaii_Alert").css("bottom", kawaiiAlertBottom + "px");
        }, 1050);
    }
    else {
        $(".ongaku-alert").fadeIn(0);
        $(".ongaku-alert").addClass("active");
        $(".ongaku-alert").css("bottom", alertBottom + 48 + "px");
        $("#Kawaii_Alert").css("bottom", kawaiiAlertBottom + 35 + "px");
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", alertBottom + 16 + "px");
            $("#Kawaii_Alert").css("bottom", kawaiiAlertBottom + "px");
        }, 350);
    }

    if (buttonText == null) $("#OngakuAlert_Btn").fadeOut(300);
    else {
        $("#OngakuAlert_Btn").fadeIn(300);
        $("#OngakuAlert_Btn").html(buttonText);
    }

    switch (parseInt(buttonActionType)) {
        case 0:
            $("#OngakuAlert_Btn").attr("onmousedown", "uncallAlert();");
            break;
        case 1:
            $("#OngakuAlert_Btn").attr("onmousedown", buttonAction);
            break;
        case 3:
            $("#OngakuAlert_Btn").attr("onmousedown", '$("#' + buttonAction + '").submit();');
            break;
        default:
            $("#OngakuAlert_Btn").attr("onmousedown", "uncallAlert();");
            break;
    }

    $("#OngakuAlert_Text_Lbl").html(text);
    if (duration != Infinity) {
        timeoutValue = setTimeout(function () {
            uncallAlert();
            clearInterval(intervalValue);
        }, duration * 1000);
    }
}

function createHeadlessSmContainer(id, body, openOnCreate = false) {
    let divExists = document.getElementById(id + "_Container");
    if (divExists == null) {
        $("body").append('<div class="box-sm-part-inner shadow-sm" id="' + id + '_Container"><div class="box-standard p-1" id="' + id + '_Box"> </div></div>');
        if (body != null || body != undefined) {
            $("#" + id + "_Box").append(body);
        }
    }
    else {
        $("#" + id + "_Box").empty();
        $("#" + id + "_Box").append(body);
    }
    if (openOnCreate) {
        displayCorrector(currentWindowSize, false);
        callASmContainer(false, id + "_Container");
    }
}

function createSmContainer(id, title, body, headerBtn1 = null, headerBtn2 = null, openOnCreate = false) {
    let divExists = document.getElementById(id + "_Container");
    if (divExists == null) {
        $("body").append('<div class="box-sm-part-inner" id="' + id + '_Container" data-title="' + title + '"><div class="div-swiper div-swiper-sm mx-auto" id="' + id + '_Container-SwiperSm"></div><div class="box-standard p-2" id="' + id + '_Box"></div></div>');
        $("#" + id + "_Box").append(body);
        if (headerBtn1 != null) {
            let firstButton = $(headerBtn1);
            $("#" + id + "-Header_Box").append(firstButton);

            if (headerBtn2 != null) {
                let secondBtn = $(headerBtn2);
                $("#" + id + "-Header_Box").append(secondBtn);
            }
        }
        if (currentWindowSize > 1024) {
            $(".box-sm-part-inner").css("left", "0.4%");
            $(".box-sm-part-inner").css("width", "36%");
        }
        else {
            $(".box-sm-part-inner").css("left", "0.75%");
            $(".box-sm-part-inner").css("width", "98.25%");
        }
    }
    else {
        $("#" + id + "_Box").empty();
        $("#" + id + "_Box").append(body);
    }

    if (openOnCreate) {
        displayCorrector(currentWindowSize);
        callASmContainer(false, id + "_Container");
    }
}

function unsetCurrentSwitcherValues(elementId, switcherInternalIndex) {
    elementId = elementId.includes("-") ? getTrueId(elementId, false) : elementId;
    let neccessarySwitchers = [];
    let allSwitchersOnPage = document.getElementsByClassName("btn-box-switcher-member");
    if (allSwitchersOnPage.length > 0) {
        for (let i = 0; i < allSwitchersOnPage.length; i++) {
            if (($("#" + allSwitchersOnPage[i].id).attr("data-switcher-internal-id") == switcherInternalIndex) && (getTrueId(allSwitchersOnPage[i].id) == elementId)) {
                neccessarySwitchers.push(allSwitchersOnPage[i]);
            }
        }

        if (neccessarySwitchers.length > 0) {
            for (let i = 0; i < neccessarySwitchers.length; i++) {
                $("#" + neccessarySwitchers[i].id).removeClass("btn-box-switcher-member-active");
            }
        }
    }
}

function uncallAlert() {
    let kawaiiAlertBottom = 0;
    let alertBottom = bottomNavbarH + 48;
    if ($("#Kawaii_Alert").hasClass("active")) kawaiiAlertBottom = parseInt($("#Kawaii_Alert").css("bottom")) + 48;

    $(".ongaku-alert").css("bottom", alertBottom + "px");
    if (kawaiiAlertBottom > 0) $("#Kawaii_Alert").css("bottom", kawaiiAlertBottom + "px");
    setTimeout(function () {
        $(".ongaku-alert").css("bottom", "-1200px");
        if (kawaiiAlertBottom > 0) $("#Kawaii_Alert").css("bottom", alertBottomValue + "px");
    }, 350);
    setTimeout(function () {
        $(".ongaku-alert").fadeOut(0);
        $(".ongaku-alert").removeClass("active");
        $(".ongaku-alert-timer").css('width', 0);
    }, 700);
    clearInterval(intervalValue);
    clearTimeout(timeoutValue);
}

function audioDuration(element, parseToSeconds = false) {
    if (element != null || element != undefined) {
        let audioElement = document.getElementById(element);
        let totalDuraiton = audioElement.duration;
        let currentTime = audioElement.currentTime;
        if (!isNaN(totalDuraiton) && !isNaN(currentTime)) {
            if (totalDuraiton != undefined && currentTime != undefined) {
                if (!parseToSeconds) {
                    let totalMin = Math.floor(totalDuraiton / 60);
                    let totalSec = Math.floor(totalDuraiton - (totalMin * 60));
                    let currentMin = Math.floor(currentTime / 60);
                    let currentSec = Math.floor(currentTime - (currentMin * 60));
                    let totalTimeLeft = Math.floor(totalDuraiton - currentTime);
                    let timeLeftMin = Math.floor(totalTimeLeft / 60);
                    let timeLeftSec = Math.floor(totalTimeLeft - (timeLeftMin * 60));

                    totalMin = totalMin < 10 ? "0" + totalMin : totalMin;
                    totalSec = totalSec < 10 ? "0" + totalSec : totalSec;
                    currentMin = currentMin < 10 ? "0" + currentMin : currentMin;
                    currentSec = currentSec < 10 ? "0" + currentSec : currentSec;
                    timeLeftMin = timeLeftMin < 10 ? "0" + timeLeftMin : timeLeftMin;
                    timeLeftSec = timeLeftSec < 10 ? "0" + timeLeftSec : timeLeftSec;

                    return [[totalMin, totalSec], [currentMin, currentSec], [timeLeftMin, timeLeftSec]];
                }
                else return [totalDuraiton, currentTime];
            }
            else return null;
        }
        else return null;
    }
    else return null;
}

function audioPlayerTypeSwitch(element, type) {
    if (element != null) {
        const audioPlayer = document.getElementById(element);
        if (audioPlayer != null) {
            $(".box-audio-player-buttons").fadeOut(300);
            switch (parseInt(type)) {
                //Regular buttons
                case 0:
                    $(".ongaku-player-album-box").html(' <i class="fa-solid fa-music"></i> ');
                    setTimeout(function () {
                        $("#" + element + "_StandardTrackButtons_Box").fadeIn(300);
                    }, 300);
                    break;
                //Ad and track preview buttons
                case 1:
                    $(".ongaku-player-album-box").html(' <i class="fa-solid fa-ellipsis fa-fade"></i> ');
                    setTimeout(function () {
                        $("#" + element + "_PreviewAndAdButtons_Box").fadeIn(300);
                    }, 300);
                    break;
                //Lyric Sync buttons
                case 2:
                    $(".ongaku-player-album-box").html(' <i class="fa-solid fa-arrows-rotate"></i> ');
                    setTimeout(function () {
                        $("#" + element + "_LyricSyncButtons_Box").fadeIn(300);
                    }, 300);
                    break;
                default:
                    $(".ongaku-player-album-box").html(' <i class="fa-solid fa-music"></i> ');
                    setTimeout(function () {
                        $("#" + element + "_StandardTrackButtons_Box").fadeIn(300);
                    }, 300);
                    break;
            }
        }
    }
}

//for preloading the track without playing (Just UI)
function audioPrepare(element, streamUrl, coverImgSrc = null, title = null, mainArtist = null, featuringArtists = []) {
    if (element != null || element != undefined) {
        const audioPlayer = document.getElementById(element);
        if (audioPlayer != null) {
            let allArtists;
            buttonDisabler(true, "btn-play-pause-track-lg", "Loading...");

            audioPlayer.src = streamUrl;//Polish the UI (hide or disable other player buttons and etc.);
            if (title != null || title != undefined) $(".ongaku-track-name-lbl").html(title);
            if (mainArtist != null) allArtists = mainArtist;
            else allArtists = "Track Preview";
            if (featuringArtists != null && featuringArtists.length > 0) {
                for (let i = 0; i < featuringArtists.length; i++) {
                    if (i == 0) mainArtist += " feat. " + featuringArtists[i];
                    else mainArtist += ", " + featuringArtists[i];
                }
            }

            if (allArtists != null) $(".ongaku-artist-name-lbl").html(allArtists);
            $(".ongaku-track-current-duration-line").css("width", 0);
            $(".ongaku-track-duration-left").text(audioPlayer.duration);
            $(".ongaku-track-name-lbl").removeClass("super-disabled");

            if (coverImgSrc != null) {
                $(".ongaku-player-album-img").attr("src", coverImgSrc);
                $(".ongaku-player-album-img-enlarged").attr("src", coverImgSrc);
                $(".ongaku-player-album-img").fadeIn(0);
                $(".ongaku-player-album-img-enlarged").fadeIn(0);
                $(".ongaku-player-album-box").fadeOut(0);
                $(".ongaku-player-album-box-enlarged").fadeOut(0);
            }
            else {
                $(".ongaku-player-album-img").attr("src", "#");
                $(".ongaku-player-album-img-enlarged").attr("src", "#");
                $(".ongaku-player-album-img").fadeOut(0);
                $(".ongaku-player-album-img-enlarged").fadeOut(0);
                $(".ongaku-player-album-box").fadeIn(0);
                $(".ongaku-player-album-box-enlarged").fadeIn(0);
            }
        }
    } 
}

//only for regular playlists, albums (song playling)
function audioChange(element, playlistId, trackId, addToQueue = false) {
    if (element != null || element != undefined) {
        let audioPlayer = document.getElementById(element);
        if (audioPlayer != null) {
            buttonDisabler(true, "btn-play-pause-track-lg", "Loading...");
            $("#OngakuPlayer_Type_Val").val(0);
            $("#OngakuPlayer_TrackId_Val").val(trackId);
            $("#OngakuPlayer_PlaylistId_Val").val(playlistId);
            $("#LoadTheTrack_Form").submit();

            if (trackQueue.orderChanger == 0) trackId = 2;
            else {
                if (trackQueue.autoPlay) trackId = 1;
                else trackId = 0;
            }
            audioEdit(element, null, null, trackId, null);
        }
    }
}

function audioPreviewChange(element, currentTrackId = 0, orderChangeValue = -1) {
    if (element != undefined) {
        if (orderChangeValue != 0) {
            currentTrackId += orderChangeValue;
            currentTrackId = currentTrackId >= 0 ? currentTrackId : 0;

            let audioSrc = $("#" + currentTrackId + "-TrackPrePlay_Btn").attr("data-src");
            if (audioSrc != undefined) {
                let audioTitle = $("#" + currentTrackId + "-TrackPrePlay_Btn").attr("data-title");
                audioPlay(element, audioSrc, null, currentTrackId, 0, audioTitle, null, null);
            }
            else audioEdit(element, 100, 1, false, 0);
        }
    }
}

function audioPlay(element, coverImgSrc = null, fileSrc, playlistId, trackId, startingTimeInSec, title, mainArtist, featuringArtists = []) {
    if (element != null && fileSrc != null) {
        let allArtists;
        const allPlayBtns = document.getElementsByClassName("btn-play-pause-track");
        const audioPlayer = document.getElementById(element);
        audioPlayer.src = fileSrc;
        if (startingTimeInSec != null) {
            startingTimeInSec = parseInt(startingTimeInSec) >= 0 ? startingTimeInSec : 0;
            audioPlayer.currentTime = startingTimeInSec;
        }
        else audioPlayer.currentTime = 0;
        if (title != null || title != undefined) $(".ongaku-track-name-lbl").html(title);
        if (mainArtist != null) allArtists = mainArtist;
        else allArtists = "Track Preview";
        if (featuringArtists != null && featuringArtists.length > 0) {
            for (let i = 0; i < featuringArtists.length; i++) {
                if (i == 0) mainArtist += " feat. " + featuringArtists[i];
                else mainArtist += ", " + featuringArtists[i];
            }
        }

        if (coverImgSrc != null) {
            $(".ongaku-player-album-img").attr("src", coverImgSrc);
            $(".ongaku-player-album-img-enlarged").attr("src", coverImgSrc);
            $(".ongaku-player-album-img").fadeIn(0);
            $(".ongaku-player-album-img-enlarged").fadeIn(0);
            $(".ongaku-player-album-box").fadeOut(0);
            $(".ongaku-player-album-box-enlarged").fadeOut(0);
        }
        else {
            $(".ongaku-player-album-box").html(' <i class="fa-solid fa-music"></i> ');
            $(".ongaku-player-album-img").attr("src", "#");
            $(".ongaku-player-album-img-enlarged").attr("src", "#");
            $(".ongaku-player-album-img").fadeOut(0);
            $(".ongaku-player-album-img-enlarged").fadeOut(0);
            $(".ongaku-player-album-box").fadeIn(0);
            $(".ongaku-player-album-box-enlarged").fadeIn(0);
        }

        audioPlayer.load();
        audioPlayer.play();
        if (allPlayBtns.length > 0) {
            for (let i = 0; i < allPlayBtns.length; i++) {
                if (allPlayBtns[i].id != "") {
                    if ($("#" + allPlayBtns[i].id).attr("data-untrack") == undefined) $("#" + allPlayBtns[i].id).html(' <i class="fa-solid fa-pause"></i> ');
                }
            }
        }
        buttonUndisabler(true, "btn-play-pause-track-lg", ' <i class="fa-solid fa-pause"></i> Pause');
        $(".btn-pre-play-pause-track").html(' <i class="fa-solid fa-pause"></i> Pause');
        $(".btn-player-play-pause-track").html(' <i class="fa-solid fa-pause"></i> ');
        $("#" + trackId + "-TrackPrePlay_Btn").attr("data-src", fileSrc);
        $("#" + trackId + "-PlayTheTrack_Btn").html(' <i class="fa-solid fa-pause"></i> ');
        $("#" + trackId + "-TrackPrePlay_Btn").html(' <i class="fa-solid fa-pause"></i> Pause');

        if (allArtists != null) $(".ongaku-artist-name-lbl").html(allArtists);
        $(".ongaku-track-name-lbl").removeClass("super-disabled");
        $(".ongaku-track-duration-left").text(audioPlayer.duration);
        $(".ongaku-track-current-duration-line").css("width", 0);

        if (playlistId == null || playlistId == undefined) $("#OngakuPlayer_PlaylistId_Val").val(-256);
        else $("#OngakuPlayer_PlaylistId_Val").val(playlistId);
        if (trackId != null || trackId != undefined) $("#OngakuPlayer_TrackId_Val").val(trackId);
        else $("#OngakuPlayer_TrackId_Val").val(0);
    }
}

function audioContinue(element, trackId) {
    const audioPlayer = document.getElementById(element);
    if (audioPlayer != null) {
        audioPlayer.play();
        const allPlayBtns = document.getElementsByClassName("btn-play-pause-track");
        if (!audioPlayer.paused) {
            $(".ongaku-track-name-lbl").removeClass("super-disabled");
            $("#" + trackId + "-PlayTheTrack_Btn").html(' <i class="fa-solid fa-play"></i> ');
            $("#" + trackId + "-TrackPrePlay_Btn").html(' <i class="fa-solid fa-play"></i> Play');

            if (allPlayBtns.length > 0) {
                for (let i = 0; i < allPlayBtns.length; i++) {
                    if (allPlayBtns[i].id != "") {
                        if ($("#" + allPlayBtns[i].id).attr("data-untrack") == undefined) $("#" + allPlayBtns[i].id).html(' <i class="fa-solid fa-pause"></i> ');
                    }
                }
            }
            $(".btn-player-play-pause-track").html(' <i class="fa-solid fa-pause"></i> ');
            $("#" + trackId + "-PlayTheTrack_Btn").html(' <i class="fa-solid fa-pause"></i> ');
            buttonUndisabler(true, "btn-play-pause-track-lg", ' <i class="fa-solid fa-pause"></i> Pause');
        }
    }
}

function audioPause(element) {
    if (element != null) {
        const audioPlayer = document.getElementById(element);
        const allPlayBtns = document.getElementsByClassName("btn-play-pause-track");
        audioPlayer.pause();
        if (audioPlayer.paused) {
            $(".ongaku-track-name-lbl").addClass("super-disabled");
            if (allPlayBtns.length > 0) {
                for (let i = 0; i < allPlayBtns.length; i++) {
                    if (allPlayBtns[i].id != "") {
                        if ($("#" + allPlayBtns[i].id).attr("data-untrack") == undefined) $("#" + allPlayBtns[i].id).html(' <i class="fa-solid fa-play"></i> ');
                    }
                }
            }
            $(".btn-player-play-pause-track").html(' <i class="fa-solid fa-play"></i> ');
            $(".btn-pre-play-pause-track").html(' <i class="fa-solid fa-play"></i> Play');
            buttonUndisabler(true, "btn-play-pause-track-lg", ' <i class="fa-solid fa-play"></i> Play');
        }
    }
}

function audioEdit(element, volume = 100, playbackSpeed = 1.0, loop = 0, currentTime = 0, needAlert = false) {
    if (element != null) {
        let audioElement = document.getElementById(element);
        if (volume != null || volume != undefined) {
            volume = parseInt(volume);
            volume = volume > 0 ? volume / 100 : 0;
            audioElement.volume = volume;
            $(".volume-range-slider").val(volume * 100);

            if (needAlert) callKawaiiAlert(2, null, null, internalVolume, null, 2, false);
        }
        if (playbackSpeed != null || playbackSpeed != undefined) {
            playbackSpeed = parseFloat(playbackSpeed);
            audioElement.playbackRate = playbackSpeed;
            let playbackAnimationDuration = 0.3 / playbackSpeed;
            $(".btn-playback-rate").html(playbackSpeed.toFixed(1) + "x");
            $(".btn-playback-rate").attr("data-speed", playbackSpeed);

            if (needAlert) callKawaiiAlert(3, '<div class="test-field-box"> <div class="test-field-bar"></div> </div>', '<span class="test-field-icon">' + playbackSpeed.toFixed(1) + 'x</span>', playbackSpeed, null, 1.8, false);
            setTimeout(function () {
                $(".test-field-bar").animate({ width: "100%" }, playbackAnimationDuration * 1000);
            }, 300);
        }

        if (loop != null || loop != undefined) {
            loop = parseInt(loop);
            loop = loop == undefined ? 0 : loop;
            let loopStatus = null;
            let loopStatusIcon = null;

            switch (parseInt(loop)) {
                case 0:
                    $(".btn-audio-loop").addClass("text-unchosen");
                    $(".btn-audio-loop").removeClass("text-chosen");
                    $(".btn-audio-loop").html(' <i class="fa-solid fa-repeat"></i> ');

                    trackQueue.autoPlay = false;
                    trackQueue.orderChanger = 1;
                    loopStatus = "Repeat disabled";
                    loopStatusIcon = '<i class="fa-solid fa-repeat text-muted p-2 pt-1 pb-1"></i>';
                    break;
                case 1:
                    trackQueue.autoPlay = true;
                    trackQueue.orderChanger = 1;
                    loopStatus = "Playlist repeat enabled";
                    loopStatusIcon = '<i class="fa-solid fa-repeat p-2 pt-1 pb-1"></i>';

                    $(".btn-audio-loop").addClass("text-chosen");
                    $(".btn-audio-loop").removeClass("text-unchosen");
                    $(".btn-audio-loop").html(' <i class="fa-solid fa-repeat"></i> ');
                    break;
                case 2:
                    $(".btn-audio-loop").addClass("text-chosen");
                    $(".btn-audio-loop").removeClass("text-unchosen");
                    $(".btn-audio-loop").html(' <span class="fa-layers fa-fw p-2 pt-1 pb-1"><i class= "fa-solid fa-repeat"></i> <span class="fa-layers-counter">1</span></span>');
                    if (trackQueue.songs.length > 0) {
                        trackQueue.autoPlay = true;
                        trackQueue.orderChanger = 0;
                    }
                    loopStatus = "Single track repeat enabled";
                    loopStatusIcon = '<i class="fa-solid fa-repeat p-2 pt-1 pb-1"></i>';
                    break;
                default:
                    $(".btn-audio-loop").addClass("text-unchosen");
                    $(".btn-audio-loop").removeClass("text-chosen");
                    $(".btn-audio-loop").html(' <i class="fa-solid fa-repeat"></i> ');
                    trackQueue.autoPlay = false;
                    trackQueue.orderChanger = 1;
                    loopStatus = "Repeat disabled";
                    loopStatusIcon = '<i class="fa-solid fa-repeat text-muted"></i>';
                    break;
            }
            $(".btn-audio-loop").attr("data-status", loop);
            if (needAlert) callKawaiiAlert(3, '<span class="card-text">' + loopStatus + '</span>', loopStatusIcon, trackQueue.orderChanger, null, 2, false);
        }
        if (currentTime != null || currentTime != undefined) audioElement.currentTime = currentTime;
    }
}

function audioPlayerRewind(audioPlayerId, duration = 15, isForRewind = false, needAnAlert = false) {
    if (audioPlayerId != null || audioPlayerId != undefined) {
        let audioPlayer = document.getElementById(audioPlayerId);
        if (audioPlayer != null) {
            let totalDuration = audioPlayer.duration;
            let currentTime = audioPlayer.currentTime;

            if (isForRewind) {
                currentTime += duration;
                currentTime = currentTime <= totalDuration ? currentTime : 0;
            }
            else {
                currentTime -= duration;
                currentTime = currentTime >= 0 ? currentTime : 0;
            }
            audioEdit(audioPlayerId, null, null, null, currentTime);
            duration = duration.toFixed(0);
            if (needAnAlert && currentTime != 0) callKawaiiAlert(3, isForRewind ? "<span class='card-text'>Forwarded for " + duration + " sec</span>" : "<span class='card-text'>Rewinded for " + duration + " sec</span>", isForRewind ? '<i class="fa-solid fa-rotate-right anime-spin-shift"></i>' : '<i class="fa-solid fa-rotate-left anime-rewind-shift"></i>', currentTime, null, 2, false);
        }
    }
}

function getAudioPlayerDuration(elementId) {
    if (elementId != undefined || elementId != null) {
        let audioPlayer = document.getElementById(elementId);
        if (audioPlayer != undefined) {
            let totalDuration = audioPlayer.duration;
            let currentDuration = audioPlayer.currentTime;

            return [currentDuration, totalDuration];
        }
        else return null;
    }
    else return null;
}

function getTrackFromQueue(songsArr = [], trackIndex = 0, trackOrderChange = 1, autoPlayOn = true) {
    if (songsArr != null) {
        trackIndex = trackIndex + trackOrderChange;
        trackIndex = trackIndex < 0 ? 0 : trackIndex;
        if (!autoPlayOn) trackIndex = trackIndex > songsArr.length - 1 ? null : trackIndex;
        else trackIndex = trackIndex > songsArr.length - 1 ? 0 : trackIndex;
        if (trackIndex != null) {
            if (songsArr[trackIndex] != undefined) {
                trackOrderInQueue = trackIndex;
                return songsArr[trackIndex];
            }
            else {
                trackOrderInQueue = 0;
                return songsArr[0];
            }
        }
        else {
            trackOrderInQueue = 0;
            return null;
        }
    }
    else return null;
}

async function timeoutCounter(displayElementId, holdText, durationInSec) {
    if (displayElementId != null) {
        let elementBaseHtml = $("#" + displayElementId).html();
        elementDisabler(false, displayElementId, displayElementId, holdText);
        if (holdText != null) elementDisabler(false, displayElementId, displayElementId, ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + holdText);
        else elementDisabler(false, displayElementId, displayElementId, ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Pending...');
        timeoutValue = await new Promise(resolve => setTimeout(resolve, durationInSec * 1000));

        elementUndisabler(false, displayElementId, displayElementId);
        $("#" + displayElementId).html(elementBaseHtml);
        clearTimeout(timeoutValue);
        return true;
    }
    else return false;
}

async function waitCounter(displayElementId, durationInSec) {
    if (displayElementId != null) {
        clearInterval(intervalValue);
        let baseElementHtml = $("#" + displayElementId).html();
        let newDuration = parseFloat(durationInSec);
        durationInSec = parseFloat(durationInSec) > 0 ? durationInSec : 1;
        $("#" + displayElementId).fadeIn(300);
        intervalValue = setInterval(function () {
            newDuration -= 0.1;
            if (newDuration % 1 === 0) $("#" + displayElementId).html(baseElementHtml + " ∙ " + newDuration + " sec");
            else $("#" + displayElementId).html(baseElementHtml + " ∙ " + newDuration.toFixed(1) + " sec");
        }, 100);
        await new Promise(resolve => setTimeout(resolve, durationInSec * 1000));
        $("#" + displayElementId).html(baseElementHtml);
        $("#" + displayElementId).fadeOut(300);
        clearInterval(intervalValue);

        return true;
    }
    else return false;
}

function copyAnElement(prototypeElementId, insertAfter = true) {
    let prototypeElement = $("#" + prototypeElementId);
    if (prototypeElement != undefined) {
        if ($("#" + prototypeElementId).val().length > 0) {
            let currentIndex = $("#" + $("#" + prototypeElementId).attr("id")).attr("data-index");
            if (parseInt(currentIndex) != undefined) {
                let newElementTrueId = getTrueId(prototypeElementId, false);
                if (insertAfter) $("#" + prototypeElementId).clone().attr("id", newElementTrueId + "-" + ++currentIndex).insertAfter($("#" + prototypeElementId));
                else $("#" + prototypeElementId).clone().attr("id", newElementTrueId + "-" + ++currentIndex).insertBefore($("#" + prototypeElementId));
                $("#" + newElementTrueId + "-" + currentIndex).val(null);
                $("#" + newElementTrueId + "-" + currentIndex).attr("data-index", currentIndex);

                return newElementTrueId + "-" + currentIndex;
            }
            else return null;
        }
        else {
            prototypeElementId = getTrueId(prototypeElementId, false);
            textAlert(prototypeElementId + "-Warn", 0, "Start by naming the first one to add more rows", 3.5);
        }
    }
    else return null;
}

$(document).on("mousedown", ".btn-announcer", function () {
    let thisId = $(this).attr("id");
    let baseHtml = $(this).attr("data-base-html");
    let announcements = getCommaSeparatedValues($(this).attr("data-announcements"));

    if (thisId != undefined && baseHtml != undefined && announcements != null) {
        announcer(false, true, thisId, baseHtml, announcements, 3);
    }
});

function announcer(byClassname = false, animateOnChange = true, elementId, baseHtml, announcements = [], intervalInSeconds = 2.5) {
    if ((elementId != null) && (Array.isArray(announcements) && announcements.length > 0) && (baseHtml != null)) {
        let currentElementIndex = 1;
        let currentAnnouncement;
        clearInterval(intervalValue);
        announcements.unshift(baseHtml);

        intervalValue = setInterval(function () {
            if (announcements[currentElementIndex] != undefined) currentAnnouncement = announcements[currentElementIndex];
            else currentAnnouncement = baseHtml;

            if (byClassname) {
                $("." + elementId).html(currentAnnouncement);
            }
            else {
                if (animateOnChange) {
                    let blurDuration = intervalInSeconds * 0.1;
                    blur(elementId, blurDuration);
                }
                $("#" + elementId).html(currentAnnouncement);
            }
            if (currentElementIndex >= announcements.length - 1) currentElementIndex = 0;
            else currentElementIndex++;
        }, intervalInSeconds * 1000);

        return elementId;
    }
    else return null;
}

function elementDisabler(byClassname, id, displayId, displayText) {
    if (!byClassname) $("#" + id).attr("disabled", true);
    else $("." + id).attr("disabled", true);

    if (displayId != null) {
        if (!byClassname) $("#" + displayId).fadeIn(300);
        else $("." + displayId).fadeIn(300);
        if (displayText != null) $("#" + displayId).html(displayText);
        else $("#" + displayId).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Waiting...');
    }
}
function elementUndisabler(byClassname, id, displayId) {
    if (!byClassname) $("#" + id).attr("disabled", false);
    else $("." + id).attr("disabled", false);

    if (displayId != null) {
        if (!byClassname) $("#" + displayId).fadeOut(300);
        else $("." + displayId).fadeOut(300);
    }
}

function buttonDisabler(byClassname, id, specialText) {
    if (specialText != null) specialText = specialText == "" ? ' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' : specialText;
    if (!byClassname) {
        if (specialText != null) $("#" + id).html(specialText);
        $("#" + id).addClass("super-disabled");
    }
    else {
        if (specialText != null) $("." + id).html(specialText);
        $("." + id).addClass("super-disabled");
    }
}
function buttonUndisabler(byClassname, id, defaultText) {
    if (!byClassname) {
        if (defaultText != null) $("#" + id).html(defaultText);
        $("#" + id).removeClass("super-disabled");
    }
    else {
        if (defaultText != null) $("." + id).html(defaultText);
        $("." + id).removeClass("super-disabled");
    }
}

function backwardSlider(currentStep, id) {
    if (id != null) {
        if (currentStep > 0) {
            $("#" + currentStep + "-" + id).fadeOut(300);
            currentStep--;
            setTimeout(function () {
                $("#" + currentStep + "-" + id).fadeIn(300);
            }, 300);
        }
    }
}

function forwardSlider(currentStep, maxStep, id) {
    if (id != null) {
        if (currentStep < maxStep) {
            $("#" + currentStep + "-" + id).fadeOut(300);
            currentStep++;
            setTimeout(function () {
                $("#" + currentStep + "-" + id).fadeIn(300);
            }, 300);
        }
    }
}

function lgPartContainerCorrector(playerPosition_Px) {
    playerPosition_Px += bottomNavbarH;
    $(".box-lg-part").css("padding-bottom", playerPosition_Px + "px");
    $(".box-lg-part-inner").css("padding-bottom", playerPosition_Px + "px");
}

function enlargeMediaPlayer(currentWidth) {
    if (parseInt(currentWidth) < 1024) {
        uncallSmMediaPlayer();
        $(".ongaku-player-box-enlarged").fadeIn(0);
        setTimeout(function () {
            $(".ongaku-player-box-enlarged").css("bottom", bottomNavbarH + 45 + "px");
        }, 450);
        setTimeout(function () {
            $(".ongaku-player-box").fadeOut(0);
            $(".ongaku-player-box-enlarged").css("bottom", bottomNavbarH + 10 + "px");
        }, 800);
    }
    else {
        $(".ongaku-player-box-enlarged").fadeIn(0);
        $(".ongaku-player-box").addClass("inactive");
        $(".ongaku-player-box").css("bottom", "5.5%");
        $(".ongaku-player-box-enlarged").css("bottom", bottomNavbarH + 45 + "px");
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", "-1200px");
            $(".ongaku-player-box-enlarged").css("bottom", bottomNavbarH + 10 + "px");
        }, 350);
    }
}

function dwindleMediaPlayer(currentWidth) {
    if (parseInt(currentWidth) < 1024) {
        let bottomH = parseInt($(".ongaku-player-box-enlarged").css("bottom"));
        $(".ongaku-player-box").fadeIn(0);
        $(".ongaku-player-box-enlarged").css("bottom", bottomH + 45 + "px");
        setTimeout(function () {
            $(".ongaku-player-box-enlarged").css("bottom", "-1200px");
        }, 350);
        setTimeout(function () {
            callCurrentMediaPlayer(currentWidth);
        }, 450);
    }
    else {
        $(".ongaku-player-box").fadeIn(0);
        $(".ongaku-player-box-enlarged").css("bottom", bottomNavbarH + 45 + "px");
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", "5.5%");
            $(".ongaku-player-box-enlarged").css("bottom", "-1200px");
        }, 350);
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", "1.5%");
            $(".ongaku-player-box").removeClass("inactive");
        }, 700);
    }
}

function uncallSmMediaPlayer() {
    let bottomH = parseInt($(".ongaku-player-box").css("bottom"));
    $(".ongaku-player-box").css("bottom", bottomH + 45 + "px");
    setTimeout(function () {
        $(".ongaku-player-box").css("bottom", "-1200px");
    }, 350);
}

function uncallLgMediaPlayer() {
    let bottomH = 10;
    $(".ongaku-player-box").css("bottom", bottomH + 45 + "px");
    setTimeout(function () {
        $(".ongaku-player-box").css("bottom", "-1200px");
    }, 350);
}

function callCurrentMediaPlayer(currentWidth) {
    let isForSmSize = false;
    let bottomH = bottomNavbarH;
    if (parseInt(currentWidth) < 1024) isForSmSize = true;

    if (isForSmSize) {
        $(".ongaku-player-box").fadeIn(0);
        $(".ongaku-player-box").css("bottom", bottomH + 55 + "px");
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", bottomH + 10 + "px");
        }, 350);
    }
    else {
        bottomH = 10;
        $(".ongaku-player-box").fadeIn(0);
        $(".ongaku-player-box").css("bottom", bottomH + 45 + "px");
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", "1.25%");
        }, 350);
    }
}

$(document).on("focusin", ".form-control-bar-search", function () {
    $(".bottom-navbar-adjustable").addClass("bottom-navbar-adjustable-dwindled");
    $(".bottom-navbar-adjustable").removeClass("bottom-navbar-adjustable");
    $(".bottom-navbar-unadjustable").addClass("bottom-navbar-unadjustable-enlarged");
    $(".bottom-navbar-unadjustable").removeClass("bottom-navbar-unadjustable");
});
$(document).on("focusout", ".form-control-bar-search", function () {
    $(".bottom-navbar-adjustable-dwindled").addClass("bottom-navbar-adjustable");
    $(".bottom-navbar-adjustable-dwindled").removeClass("bottom-navbar-adjustable-dwindled");
    $(".bottom-navbar-unadjustable-enlarged").addClass("bottom-navbar-unadjustable");
    $(".bottom-navbar-unadjustable-enlarged").removeClass("bottom-navbar-unadjustable-enlarged");
});

$(document).on("mousedown", ".btn-toggleable", function () {
    if ($(this).hasClass("bg-chosen-bright")) $(this).removeClass("bg-chosen-bright");
    else $(this).hasClass("bg-chosen-bright");
});

$(document).on("mousedown", ".btn-open-audio-player-additionals", function () {
    $(".ongaku-player-additional-buttons-box").css("opacity", 0);
    $(".ongaku-player-additional-buttons-box").addClass("re-scaled");
    setTimeout(function () {
        $(".ongaku-player-upsliding-box").fadeIn(0);
        $(".ongaku-player-upsliding-box").removeClass("re-scaled");
        $(".ongaku-player-additional-buttons-box").fadeOut(0);
        $(".ongaku-player-upsliding-box").css("opacity", 1);

        $(".btn-ongaku-player-enlarged").removeClass("enlarged");
        $(".ongaku-enlarged-track-name-lbl").removeClass("enlarged");
        $(".ongaku-enlarged-artist-name-lbl").removeClass("enlarged");
        $(".ongaku-player-album-box-enlarged").removeClass("enlarged");
        $(".ongaku-player-album-img-enlarged").removeClass("enlarged");
        $(".ongaku-enlarged-track-name-lbl").addClass("dwindled");
        $(".ongaku-enlarged-artist-name-lbl").addClass("dwindled");
        $(".ongaku-player-album-box-enlarged").addClass("dwindled");
        $(".ongaku-player-album-img-enlarged").addClass("dwindled");
    }, 300);
});

$(document).on("mousedown", ".btn-close-audio-player-additionals", function () {
    $(".ongaku-player-upsliding-box").css("opacity", 0);
    $(".ongaku-player-upsliding-box").addClass("re-scaled");
    setTimeout(function () {
        $(".ongaku-player-additional-buttons-box").fadeIn(0);
        $(".ongaku-player-additional-buttons-box").removeClass("re-scaled");
        $(".ongaku-player-upsliding-box").fadeOut(0);
        $(".ongaku-player-additional-buttons-box").css("opacity", 1);

        $(".ongaku-enlarged-track-name-lbl").removeClass("dwindled");
        $(".ongaku-enlarged-artist-name-lbl").removeClass("dwindled");
        $(".ongaku-player-album-box-enlarged").removeClass("dwindled");
        $(".ongaku-player-album-img-enlarged").removeClass("dwindled");
        $(".btn-ongaku-player-enlarged").addClass("enlarged");
        $(".ongaku-enlarged-track-name-lbl").addClass("enlarged");
        $(".ongaku-enlarged-artist-name-lbl").addClass("enlarged");
        $(".ongaku-player-album-box-enlarged").addClass("enlarged");
        $(".ongaku-player-album-img-enlarged").addClass("enlarged");
    }, 300);
});

function botScrollLogicCorrector(currentWidth) {
    let scale = 0;
    if (parseInt(currentWidth) < 1024) {
        $(".bottom-navbar").addClass("backgrounded");
        $(".ongaku-player-box").addClass("facefocused");
        $(".ongaku-player-box").css("bottom", "1.75%");

        scale = $("#MainBottom_Navbar")[0].getBoundingClientRect().height;
        bottomNavbarH = scale - 25;
        lgPartContainerCorrector(playerPosition);
    }
    else {     
        $(".bottom-navbar").addClass("dwindled");
        scale = $("#MainBottom_Navbar")[0].getBoundingClientRect().height;
        bottomNavbarH = scale + 5;
        lgPartContainerCorrector(playerPosition);
    }
}
function topScrollLogicCorrector(currentWidth) {
    if ($(".bottom-navbar").hasClass("backgrounded") || $(".bottom-navbar").hasClass('dwindled')) {
        if (parseInt(currentWidth) < 1024) {
            $(".bottom-navbar").removeClass("backgrounded");
            $(".ongaku-player-box").removeClass("facefocused");
            bottomNavbarH = $("#MainBottom_Navbar").innerHeight() + 5;
            $(".ongaku-player-box").css("bottom", bottomNavbarH + 10 + "px");
            lgPartContainerCorrector(playerPosition);
        }
        else {
            $(".bottom-navbar").removeClass("dwindled");
            bottomNavbarH = $("#MainBottom_Navbar").innerHeight() + 5;
            lgPartContainerCorrector(playerPosition);
        }
    }
}

async function mediaPlayerCorrector(currentWidth, isForStart = false) {
    let smPlayerElement = null;
    let lgPlayerElement = null;
    
    if (parseInt(currentWidth) < 1024) {       
        smPlayerElement = $('<div class="ongaku-player-box liquid-glass"> <div class="ongaku-player-main-info-box hstack gap-1"> <div> <img class="ongaku-player-album-img" src="#" id="OngakuPlayer_Img" style="display: none;" /> <div class="ongaku-player-album-box" id="OngakuPlayer_NoImg_Box"> <i class="fa-solid fa-music"></i> </div> </div> <div class="ongaku-player-info-box"> <span class="ongaku-track-name-lbl">Track Title</span> <br /> <small class="ongaku-artist-name-lbl">Artist Names</small> </div> <div class="ms-auto"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-backward me-1"> <i class="fa-solid fa-backward"></i> </button> <button type="button" class="btn btn-ongaku-player btn-play-pause-track me-1" id="OngakuPlayer_PlayPause_Btn"> <i class="fa-solid fa-play"></i> </button> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-forward"> <i class="fa-solid fa-forward"></i></button> </div> </div> </div>');
        lgPlayerElement = $('<div class="ongaku-player-box-enlarged liquid-glass" id="EnlargedOngakuPlayer_Container"> <div class="ongaku-div-swiper mx-auto"></div> <div class="mt-2"> <img src="#" class="ongaku-player-album-img ongaku-player-album-img-enlarged enlarged mx-auto" id="EnlargedOngakuPlayer_Img" /> <div class="ongaku-player-album-box ongaku-player-album-box-enlarged enlarged mx-auto" id="EnlargedOngakuPlayer_No_Img"> <i class="fa-solid fa-music"></i> </div> </div> <div class="ongaku-track-not-enough-credits-box mt-3"> <div class="hstack gap-2"> <div> <span class="ongaku-track-name-lbl enlarged">Track Title</span><br /> <span class="ongaku-artist-name-lbl enlarged">Artist Names</span> </div> <div class="dropdown ms-auto"> <button type="button" class="btn btn-ongaku-player btn-track-favor-unfavor me-1"> <i class="fa-regular fa-star"></i> </button> <button type="button" class="btn btn-ongaku-player" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button> <ul class="dropdown-menu shadow-sm"> <li> <form method="get" action="/Track/GetTrackCredits" id="GetTrackCredits_Form"> <input type="hidden" name="Id" id="GetTrackCredits_Id_Val" value="0" /> <input type="hidden" name="Type" id="GetTrackCredits_Type_Val" value="0" /> <button type="submit" class="dropdown-item super-disabled" id="GetTrackCredits_SbmtBtn"> <i class="fa-solid fa-circle-info"></i> View Credits </button> </form> </li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-plus"></i> Add to Playlist </button> </li> <li><hr class="dropdown-divider" /></li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-compact-disc"></i> Go to Album </button> </li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-circle-user"></i> Go to Artist Page </button> </li> <li><hr class="dropdown-divider" /></li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-arrow-up-from-bracket"></i> Share </button> </li> </ul> </div> </div> </div> <div class="ongaku-duration-info-box hstack gap-1 mt-3"> <span class="ongaku-track-duration-lbl ongaku-track-duration-current me-1">00:00</span> <div class="ongaku-track-duration-line enlarged"> <div class="ongaku-track-current-duration-line"></div> </div> <span class="ongaku-track-duration-lbl ongaku-track-duration-left ms-1">00:00</span> </div> <div class="box-standard mt-3" id="OngakuPlayer_Controls_Box"> <div class="hstack gap-1"> <div class="row w-100"> <div class="col" id="Enlarged_OngakuAudio_Player_Btn1Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-backward enlarged columned"> <i class="fa-solid fa-backward"></i> </button> </div> <div class="col" id="Enlarged_OngakuAudio_Player_Btn2Col_Box"> <button type="button" class="btn btn-ongaku-player btn-play-pause-track enlarged columned" id="EnlargedOngakuPlayer_PlayPause_Btn"> <i class="fa-solid fa-play"></i> </button> </div> <div class="col" id="Enlarged_OngakuAudio_Player_Btn3Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-forward enlarged columned"> <i class="fa-solid fa-forward"></i> </button> </div> <div class="col" id="Enlarged_OngakuAudio_Player_Btn4Col_Box" style="display: none;"></div> </div> <button type="button" class="btn btn-ongaku-player btn-audio-loop text-unchosen enlarged"> <i class="fa-solid fa-repeat"></i> </button> </div> </div> <div class="ongaku-player-additionals-box"> <div class="slide-box" id="TrackQueue_Box"> <div class="text-center"> <h2 class="h2"><i class="fa-solid fa-list-ol"></i></h2> <h4 class="h4">Queue is Empty</h4> <small class="card-text text-muted"> No tracks in queue. Add them manually or start a playlist to show the queue </small> </div> </div> <div class="slide-box" id="LyricsKaraoke_Box" style="display: none;"> <div class="text-center"> <h2 class="h2"><i class="fa-solid fa-quote-right"></i></h2> <h4 class="h4">No Lyrics</h4> <small class="card-text text-muted"> This track has no lyrics... yet... </small> </div> </div> </div> <div class="ongaku-player-upsliding-box re-scaled"> <div class="hstack gap-2"> <button type="button" class="btn btn-standard btn-close-audio-player-additionals"> <i class="fa-solid fa-xmark"></i> </button> <div class="w-100 ms-2"> <div class="row"> <div class="col"> <button type="button" class="btn btn-standard btn-audio-infinity text-unchosen columned" data-status="0"> <i class="fa-solid fa-infinity"></i> </button> </div> <div class="col"> <button type="button" class="btn btn-standard btn-audio-shuffle text-unchosen columned"> <i class="fa-solid fa-shuffle"></i> </button> </div> <div class="col"> <form method="get" asp-controller="User" asp-action="GetHistoryOfListenings" id="GetHistoryOfListenings_Form"> <button type="submit" class="btn btn-standard super-disabled columned" id="GHL_SbmtBtn"> <i class="fa-solid fa-clock-rotate-left"></i> </button> </form> </div> </div> </div> </div> <div class="box-standard mt-2" id="OngakuPlayer_AdditionalSettings_Box"> <div class="box-standard hstack gap-2"> <div> <button type="button" class="btn btn-ongaku-player btn-volume-mute me-2"> <i class="fa-solid fa-volume-off"></i> </button> </div> <div class="volume-level-box enlarged ms-2 me-2"> <div class="volume-level-bar enlarged"></div> </div> <div> <button type="button" class="btn btn-ongaku-player btn-volume-max"> <i class="fa-solid fa-volume-high"></i> </button> </div> </div> </div> <div class="box-standard mt-2"> <div class="hstack gap-2"> <div class="row w-100"> <div class="col"> <button type="button" class="btn btn-standard btn-volume-down columned"> <i class="fa-solid fa-minus"></i> Volume Down</button> </div> <div class="col"> <button type="button" class="btn btn-standard btn-volume-up columned"> <i class="fa-solid fa-plus"></i> Volume Up</button> </div> </div> <button type="button" class="btn btn-standard btn-open-audio-settings ms-auto"> <i class="fa-solid fa-sliders"></i> </button> </div> </div> </div> <div class="ongaku-player-additional-buttons-box visible"> <div class="row w-100"> <div class="col"> <button type="button" class="btn btn-standard btn-toggleable btn-slide-boxes bg-chosen-bright columned" data-box="TrackQueue_Box" id="TrackQueueBox_Btn"> <i class="fa-solid fa-list-ol"></i> </button> </div> <div class="col"> <form method="get" action="/Track/GetLyrics" id="GetTrackLyrics_Form"> <input type="hidden" name="Id" id="GetTrackLyrics_Id_Val" value="0" /> <input type="hidden" name="Type" id="GetTrackLyrics_Type_Val" value="0" /> <button type="submit" class="btn btn-standard columned super-disabled" id="GetTrackLyrics_SbmtBtn"> <i class="fa-solid fa-quote-right"></i> </button> </form> </div> <div class="col"> <form method="get" action="/Comment/TrackComments" id="GetTrackComments_Form"> <input type="hidden" name="Id" id="GetTrackComments_Id_Val" value="0" /> <button type="submit" class="btn btn-standard super-disabled columned" id="GetTrackComments_SbmtBtn"> <i class="fa-regular fa-message"></i> </button> </form> </div> <div class="col"> <button type="button" class="btn btn-standard btn-toggleable btn-open-audio-player-additionals columned"> <i class="fa-solid fa-bars"></i> </button> </div> </div> </div> </div>');
        smPlayerElement.css("left", "1%");
        smPlayerElement.css("width", "98%");
        lgPlayerElement.css("left", "1%");
        lgPlayerElement.css("width", "98%");
    }
    else {
        smPlayerElement = $('<div class="ongaku-player-box liquid-glass"> <div class="ongaku-player-main-info-box hstack gap-1"> <div> <img class="ongaku-player-album-img" src="#" id="OngakuPlayer_Img" style="display: none;" /> <div class="ongaku-player-album-box" id="OngakuPlayer_NoImg_Box"> <i class="fa-solid fa-music"></i> </div> </div> <div class="ongaku-player-info-box"> <span class="ongaku-track-name-lbl" id="OngakuPlayer_TrackName_Lbl">Like That</span> <br/> <span class="ongaku-artist-name-lbl" id="OngakuPlayer_Artists_Span">Future</span> </div> <div class="ms-auto"> <button type="button" class="btn btn-ongaku-player btn-track-favor-unfavor btn-ongaku-player-track-favor-unfavor rounded"> <i class="fa-regular fa-star"></i> </button> </div> </div> <div class="ongaku-track-duration-line" data-audio-player="OngakuPlayer_Audio" id="OngakuPlayer_TrackDuration_Box"> <div class="ongaku-track-current-duration-line"></div> </div> <div class="ongaku-player-main-info-box"> <div class="row"> <div class="col" id="OngakuPlayer_Audio_Btn1Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-backward columned" id="OngakuPlayer_Backward_Btn"> <i class="fa-solid fa-backward"></i> </button> </div> <div class="col" id="OngakuPlayer_Audio_Btn2Col_Box"> <button type="button" class="btn btn-ongaku-player btn-play-pause-track columned" id="OngakuPlayer_PlayPause_Btn"> <i class="fa-solid fa-play"></i> </button> </div> <div class="col" id="OngakuPlayer_Audio_Btn3Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-forward columned" id="OngakuPlayer_Forward_Btn"> <i class="fa-solid fa-forward"></i> </button> </div> <div class="col" id="OngakuPlayer_Audio_Btn4Col_Box" style="display: none;"> <button type="button" class="btn btn-ongaku-player columned passive"> <i class="fa-solid fa-sliders"></i> </button> </div> <div class="col" id="OngakuPlayer_Audio_Btn5Col_Box"> <button type="button" class="btn btn-ongaku-player btn-audio-loop text-unchosen columned" data-status="0"> <i class="fa-solid fa-repeat"></i> </button> </div> <div class="col" id="OngakuPlayer_Audio_Btn6Col_Box"> <button type="button" class="btn btn-ongaku-player btn-audio-shuffle text-unchosen columned" data-status="0"> <i class="fa-solid fa-shuffle"></i> </button> </div> </div> </div> </div>');
        lgPlayerElement = $('<div class="ongaku-player-box-enlarged liquid-glass" id="EnlargedOngakuPlayer_Container"> <div class="ongaku-div-swiper mx-auto"></div> <div class="hstack gap-2 mt-2"> <div> <img src="#" class="ongaku-player-album-img ongaku-player-album-img-enlarged enlarged" id="EnlargedOngakuPlayer_Img" /> <div class="ongaku-player-album-box ongaku-player-album-box-enlarged enlarged" id="EnlargedOngakuPlayer_No_Img"> <i class="fa-solid fa-music"></i> </div> </div> <div class="ms-2 w-100"> <div> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-enlarged btn-track-favor-unfavor enlarged float-end ms-1"> <i class="fa-regular fa-star"></i> </button> <div class="ongaku-track-not-enough-credits-box"> <span class="ongaku-track-name-lbl ongaku-enlarged-track-name-lbl enlarged" id="OngakuPlayer_TrackName_Lbl">Like That</span> <br /> <span class="ongaku-artist-name-lbl ongaku-enlarged-artist-name-lbl enlarged" id="OngakuPlayer_Artists_Span">Future</span> </div> </div> <div class="ongaku-duration-info-box hstack gap-1 mt-2"> <span class="ongaku-track-duration-lbl ongaku-track-duration-current me-1">00:00</span> <div class="ongaku-track-duration-line enlarged" data-audio-player="OngakuPlayer_Audio" id="EnlargedOngakuPlayer_TrackDuration_Box"> <div class="ongaku-track-current-duration-line"></div> </div> <span class="ongaku-track-duration-lbl ongaku-track-duration-left ms-1">00:00</span> </div> <div class="box-standard mt-2" id="OngakuPlayer_Controls_Box"> <div class="ongaku-control-buttons-box"> <div class="row"> <div class="col" id="Enlarged_OngakuAudio_Player_Btn1Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-enlarged btn-ongaku-player-backward enlarged columned"> <i class="fa-solid fa-backward"></i> </button> </div> <div class="col" id="Enlarged_OngakuAudio_Player_Btn2Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-enlarged btn-play-pause-track enlarged columned" id="Enlarged_OngakuPlayer_PlayPause_Btn"> <i class="fa-solid fa-play"></i> </button> </div> <div class="col" id="Enlarged_OngakuAudio_Player_Btn3Col_Box"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-enlarged btn-ongaku-player-forward enlarged columned"> <i class="fa-solid fa-forward"></i> </button> </div> </div> </div> </div> </div> </div> <div class="ongaku-player-additionals-box"> <div class="slide-box" id="TrackQueue_Box"> <div class="text-center"> <h2 class="h2"><i class="fa-solid fa-list-ol"></i></h2> <h4 class="h4">Queue is Empty</h4> <small class="card-text text-muted"> No tracks in queue. Add them manually or start a playlist to show the queue </small> </div> </div> <div class="slide-box" id="LyricsKaraoke_Box" style="display: none;"> <div class="text-center"> <h2 class="h2"><i class="fa-solid fa-quote-right"></i></h2> <h4 class="h4">No Lyrics</h4> <small class="card-text text-muted"> This track has no lyrics... yet... </small> </div> </div> </div> <div class="ongaku-player-upsliding-box re-scaled"> <div class="hstack gap-1"> <button type="button" class="btn btn-standard btn-close-audio-player-additionals me-2"> <i class="fa-solid fa-xmark"></i> </button> <div class="row w-100"> <div class="col"> <button type="button" class="btn btn-standard btn-audio-infinity text-unchosen columned" data-status="0"> <i class="fa-solid fa-infinity"></i> </button> </div> <div class="col"> <button type="button" class="btn btn-standard btn-audio-loop text-unchosen columned" data-status="0"> <i class="fa-solid fa-repeat"></i> </button> </div> <div class="col"> <button type="button" class="btn btn-standard btn-audio-shuffle text-unchosen columned" data-status="0"> <i class="fa-solid fa-shuffle"></i> </button> </div> </div> </div> <div class="box-standard mt-2" id="OngakuPlayer_AdditionalSettings_Box"> <div class="box-standard hstack gap-2"> <div> <button type="button" class="btn btn-ongaku-player btn-volume-mute me-2"> <i class="fa-solid fa-volume-off"></i> </button> </div> <div class="volume-level-box enlarged ms-2 me-2"> <div class="volume-level-bar enlarged"></div> </div> <div> <button type="button" class="btn btn-ongaku-player btn-volume-max"> <i class="fa-solid fa-volume-high"></i> </button> </div> </div> </div> <div class="box-standard mt-2" id="OngakuPlayer_AdditionalSettingButtons_Box"> <div class="row"> <div class="col"> <button type="button" class="btn btn-standard btn-volume-down columned"> <i class="fa-solid fa-minus"></i> Volume Down</button> </div> <div class="col"> <form method="get" asp-controller="User" asp-action="GetHistoryOfListenings" id="GetHistoryOfListenings_Form"> <button type="submit" class="btn btn-standard super-disabled columned" id="GHL_SbmtBtn"> <i class="fa-solid fa-clock-rotate-left"></i> History</button> </form> </div> <div class="col"> <button type="button" class="btn btn-standard btn-volume-up columned"> <i class="fa-solid fa-plus"></i> Volume Up</button> </div> </div> </div> </div> <div class="ongaku-player-additional-buttons-box visible"> <div class="hstack gap-1"> <div> <div class="dropdown"> <button type="button" class="btn btn-standard" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button> <ul class="dropdown-menu shadow-sm"> <li> <form method="get" action="/Track/GetTrackCredits" id="GetTrackCredits_Form"> <input type="hidden" name="Id" id="GetTrackCredits_Id_Val" value="0" /> <input type="hidden" name="Type" id="GetTrackCredits_Type_Val" value="0" /> <button type="submit" class="dropdown-item super-disabled" id="GetTrackCredits_SbmtBtn"> <i class="fa-solid fa-circle-info"></i> View Credits </button> </form> </li> <li> <form method="get" action="/Track/GetTrackAdditions" id="GetTrackAdditions_Form"> <input type="hidden" name="Id" id="GetTrackAdditions_Id_Val" value="0" /> <button type="submit" class="dropdown-item super-disabled" id="GetTrackAdditions_SbmtBtn"> <i class="fa-solid fa-align-left"></i> Get Description </button> </form> </li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-plus"></i> Add to Playlist </button> </li> <li><hr class="dropdown-divider" /></li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-compact-disc"></i> Go to Album </button> </li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-circle-user"></i> Go to Artist Page </button> </li> <li><hr class="dropdown-divider" /></li> <li> <button type="button" class="dropdown-item"> <i class="fa-solid fa-arrow-up-from-bracket"></i> Share </button> </li> </ul> </div> </div> <div class="row w-100 ms-1"> <div class="col"> <button type="button" class="btn btn-standard btn-toggleable btn-slide-boxes bg-chosen-bright columned" data-box="TrackQueue_Box" id="TrackQueueBox_Btn"> <i class="fa-solid fa-list-ol"></i> </button> </div> <div class="col"> <form method="get" action="/Track/GetLyrics" id="GetTrackLyrics_Form"> <input type="hidden" name="Id" id="GetTrackLyrics_Id_Val" value="0" /> <input type="hidden" name="Type" id="GetTrackLyrics_Type_Val" value="0" /> <button type="submit" class="btn btn-standard columned super-disabled" id="GetTrackLyrics_SbmtBtn"> <i class="fa-solid fa-quote-right"></i> </button> </form> </div> <div class="col"> <form method="get" action="/Comment/TrackComments" id="GetTrackComments_Form"> <input type="hidden" name="Id" id="GetTrackComments_Id_Val" value="0" /> <button type="submit" class="btn btn-standard super-disabled columned" id="GetTrackComments_SbmtBtn"> <i class="fa-regular fa-message"></i> </button> </form> </div> <div class="col"> <button type="button" class="btn btn-standard btn-toggleable btn-open-audio-player-additionals columned"> <i class="fa-solid fa-bars"></i> </button> </div> </div> </div> </div> </div>');

        smPlayerElement.css("left", "0.5%");
        smPlayerElement.css("width", "36%");
        lgPlayerElement.css("left", "37%");
        lgPlayerElement.css("width", "63%");
    }

    if (smPlayerElement != null && lgPlayerElement != null) {
        if (!isForStart) {
            let trackIsFavorite = $("#EnlargedOngakuPlayer_TrackFavorUnfavor_Btn").attr("data-id");
            let trackName = $(".ongaku-track-name-lbl").html();
            let artistsSpan = $(".ongaku-artist-name-lbl").html();
            let trackImgUrl = $(".ongaku-player-album-img").attr("src");
            let trackStatus = document.getElementById("OngakuPlayer_Audio").paused;
            trackImgUrl = trackImgUrl == "#" ? undefined : trackImgUrl;

            if (currentWidth < 1024) uncallSmMediaPlayer();
            else uncallLgMediaPlayer();
            $(".ongaku-player-box-enlarged").css("bottom", "-1200px");
            setTimeout(function () {
                $(".ongaku-player-box").remove();
                $(".ongaku-player-box-enlarged").remove();
                $("body").append(smPlayerElement);
                $("body").append(lgPlayerElement);

                $(".ongaku-track-name-lbl").html(trackName);
                $(".ongaku-artist-name-lbl").html(artistsSpan);
                if (trackIsFavorite != undefined) {
                    $(".btn-ongaku-player-track-favor-unfavor").attr("data-id", trackIsFavorite);
                    $(".btn-ongaku-player-track-favor-unfavor").html(' <i class="fa-solid fa-star"></i> ');
                }
                else {
                    $(".btn-ongaku-player-track-favor-unfavor").attr("data-id", 0);
                    $(".btn-ongaku-player-track-favor-unfavor").html(' <i class="fa-regular fa-star"></i> ');
                }
                if (!trackStatus) audioContinue("OngakuPlayer_Audio", null);
                else audioPause("OngakuPlayer_Audio");
                if (trackImgUrl != undefined) {
                    $(".ongaku-player-album-img").fadeIn(0);
                    $(".ongaku-player-album-box").fadeOut(0);
                    $(".ongaku-player-album-img").attr("src", trackImgUrl);
                }
                else {
                    $(".ongaku-player-album-box").fadeIn(0);
                    $(".ongaku-player-album-img").fadeOut(0);
                    $(".ongaku-player-album-img").attr("src", "#");
                }
                callCurrentMediaPlayer(currentWidth);
                if (currentWidth >= 1024) {
                    playerPosition = 0;
                    alertBottomValue = bottomNavbarH + 15;
                }
                else {
                    playerPosition = smPlayerElement.innerHeight();
                    alertBottomValue = playerPosition + bottomNavbarH + 15;
                }
            }, 750);
        }
        else {
            $("body").append(smPlayerElement);
            $("body").append(lgPlayerElement);
            setTimeout(function () {
                callCurrentMediaPlayer(currentWidth);
            }, 350);
            if (currentWidth >= 1024) {
                playerPosition = 0;
                alertBottomValue = bottomNavbarH + 15;
            }
            else {
                playerPosition = smPlayerElement.innerHeight();
                alertBottomValue = playerPosition + bottomNavbarH + 15;
            }
        }
    } 
}

function mediaPlayerButtonSwapper(mediaPlayerId, type = 0, disableStarButton = false, casualButtonClassesArr = [], casualButtonHtmlsArr = [], casualButtonIdsArr = []) {
    if (mediaPlayerId != null || mediaPlayerId != undefined) {
        const mediaPlayer = document.getElementById(mediaPlayerId);
        if (mediaPlayer != null) {
            let buttonsArr = [];
            let lgButtonsArr = [];

            if (disableStarButton) $(".btn-ongaku-player-track-favor-unfavor").addClass("super-disabled");
            else $(".btn-ongaku-player-track-favor-unfavor").removeClass("super-disabled");

            if (casualButtonClassesArr != null && casualButtonHtmlsArr != null && casualButtonIdsArr != null) {
                if ((casualButtonClassesArr.length == casualButtonHtmlsArr.length) && (casualButtonClassesArr.length == casualButtonIdsArr.length)) {
                    for (let i = 0; i < casualButtonClassesArr.length; i++) {
                        let button = elementDesigner("button", "btn btn-ongaku-player columned " + casualButtonClassesArr[i], casualButtonHtmlsArr[i]);
                        let buttonLg = button.addClass("enlarged");
                        button.attr("id", casualButtonIdsArr[i]);
                        buttonLg.attr("id", "Enlarged_" + casualButtonIdsArr[i]);
                        buttonsArr.push(button);
                        lgButtonsArr.push(buttonLg);
                    }
                }
            }
            else {
                switch (parseInt(type)) {
                    case 0:
                        let button1 = elementDesigner("button", "btn btn-ongaku-player btn-ongaku-player-backward columned", ' <i class="fa-solid fa-backward"></i> ');
                        let button2 = elementDesigner("button", "btn btn-ongaku-player btn-ongaku-play-pause columned", ' <i class="fa-solid fa-house"></i> ');
                        let button3 = elementDesigner("button", "btn btn-ongaku-player btn-ongaku-player-forward columned", ' <i class="fa-solid fa-forward"></i> ');
                        let button4 = elementDesigner("button", "btn btn-ongaku-player btn-ongaku-player-backward columned", ' <i class="fa-solid fa-backward"></i> ');
                        buttonsArr.push(button1);
                        buttonsArr.push(button2);
                        buttonsArr.push(button3);
                        buttonsArr.push(button4);
                        break;
                    default:
                        break;
                }
            }

            if (buttonsArr.length > 0) {
                for (let i = 0; i < buttonsArr.length; i++) {
                    $("#" + mediaPlayerId + "_Btn" + i + "Col_Box").empty();
                    $("#" + mediaPlayerId + "_Btn" + i + "Col_Box").append(buttonsArr[i]);
                }
            }
        }
    }
}

async function displayCorrector(currentWidth) {
    if (parseInt(currentWidth) < 1024) {
        $(".box-lg-part").css("left", "0");
        $(".box-lg-part").css("width", "100%");
        $(".box-lg-part-header").css("left", 0);
        $(".box-lg-part-header").css("width", "100%");
        $(".box-lg-part-inner").css("left", "1%");
        $(".box-lg-part-inner").css("width", "98%");
        $(".box-lg-part-winded").css("left", 0);
        $(".box-lg-part-winded").css("width", "100%");
        $(".box-lg-part-winded-header").css("left", "1%");
        $(".box-lg-part-winded-header").css("width", "98%");

        $(".box-vertical-switcher").css("width", "98%");
        $(".box-vertical-switcher").css("left", "1%");

        $(".box-sm-part").css("left", "-1200px");
        $(".box-sm-part").css("width", "100%");
        $(".box-sm-part-inner").css("left", "1%");
        $(".box-sm-part-inner").css("width", "98%");

        $(".box-card-manager").css("left", "1%");
        $(".box-card-manager").css("width", "98%");

        $(".bottom-navbar").css("left", "2%");
        $(".bottom-navbar").css("width", "96%");

        $(".ongaku-alert").css("left", "1%");
        $(".ongaku-alert").css("width", "98%");

        $(".ongaku-player-box").css("left", "1%");
        $(".ongaku-player-box").css("width", "98%");
        $(".ongaku-player-box-enlarged").css("left", "1%");
        $(".ongaku-player-box-enlarged").css("width", "98%");
    }
    else {
        $(".box-lg-part").css("left", "37%");
        $(".box-lg-part").css("width", "63%");
        $(".box-lg-part-header").css("left", "37%");
        $(".box-lg-part-header").css("width", "63%");
        $(".box-lg-part-inner").css("left", "37.5%");
        $(".box-lg-part-inner").css("width", "62%");
        $(".box-lg-part-winded").css("left", "37%");
        $(".box-lg-part-winded").css("width", "63%");
        $(".box-lg-part-winded-header").css("left", "37.5%");
        $(".box-lg-part-winded-header").css("width", "62%");

        $(".box-vertical-switcher").css("width", "62%");
        $(".box-vertical-switcher").css("left", "37.5%");

        $(".box-sm-part").css("left", 0);
        $(".box-sm-part").css("width", "37%");
        $(".box-sm-part-inner").css("left", "0.5%");
        $(".box-sm-part-inner").css("width", "36%");

        $(".box-card-manager").css("left", "0.5%");
        $(".box-card-manager").css("width", "36%");

        $(".bottom-navbar").css("width", "62%");
        $(".bottom-navbar").css("left", "37.5%");

        $(".ongaku-alert").css("left", "37.5%");
        $(".ongaku-alert").css("width", "62%");

        $(".ongaku-player-box").css("left", "0.5%");
        $(".ongaku-player-box").css("width", "36%");
        $(".ongaku-player-box-enlarged").css("left", "37%");
        $(".ongaku-player-box-enlarged").css("width", "63%");

        $(".ongaku-alert").fadeIn(350);
        $(".bottom-navbar").fadeIn(350);
    }
}

function dateAndTimeParser(day, month, year, hr, min) {
    let newDate = new Date(year, month, day, hr, min);
    if (newDate != null || newDate != undefined) return newDate;
    else return null;
}

function dateAndTimeDeparser(dateAndTimeValue) {
    let newDate = new Date(dateAndTimeValue);
    if (newDate != undefined || newDate != null) {
        if (!isNaN(newDate)) return newDate;
        else return null;
    }
    else return null;
}

function callDateAndTimeContainer(targetValueElemenetId, dateResultDisplay, currentDate = new Date().getFullYear(), showDays, showTime, showMinutes, twentyforHoursFormat = true, openOnCall = true) {
    let divExists = document.getElementById("DateAndTime_Container");
    if (!divExists) createInsideLgCard("DateAndTime", "Set Date and Time", '<div class="box-standard"><div class="form-control-search-container"> <span class="card-text text-muted"> <i class="fa-solid fa-magnifying-glass"></i> </span> <input type="text" class="form-control form-control-search" placeholder="Search for days and months" id="SearchInDates_Val" data-search-in="btn-year-day-update" /> </div><div class="box-inshadowed mt-2"> <div class="row"> <div class="col date-box calendar-days-box" id="CalendarDays_Box"> </div> <div class="col date-box calendar-hrs-box" id="CalendarHours_Box"> </div> <div class="col date-box calendar-mins-box" id="CalendarMinutes_Box"> </div> <div class="col date-box calendar-hrformat-box" id="CalendarDateTimeFormat_Box"> <button type="button" class="btn btn-standard btn-dtformat-type bg-chosen-bright w-100" data-val="AM">AM</button> <button type="button" class="btn btn-standard btn-dtformat-type w-100" data-val="PM">PM</button> </div> </div> <div class="box-standard row mt-2"> <div class="col col-3"> <button type="button" class="btn btn-standard-bordered btn-decrease-the-value text-center w-100" id="CalendarYearValueLowerer_Btn" data-step="1" data-target="CalendarYear_Val" data-format-type="0"> <i class="fa-solid fa-chevron-down"></i> </button> </div> <div class="col col-6"> <input type="number" class="d-none" id="CalendarDay_Val" value="1" /> <input type="number" class="d-none" id="CalendarMonth_Val" value="1" />  <input type="number" class="d-none" id="CalendarHr_Val" value="0" /> <input type="number" class="d-none" id="CalendarMin_Val" value="0" /> <input type="number" class="form-control form-control-date-year" id="CalendarYear_Val" placeholder="Enter year value here" min="1000" max="2025" step="1" value="2025" /> </div> <div class="col col-3"> <button type="button" class="btn btn-standard-bordered btn-increase-the-value text-center w-100" id="CalendarYearValueIncreaser_Btn" data-step="1" data-target="CalendarYear_Val" data-format-type="0"> <i class="fa-solid fa-chevron-up"></i> </button> </div> </div></div> <div class="box-standard mt-2"> <button type="button" class="btn btn-standard-bolded btn-classic-styled btn-calendar-submit w-100" id="CalendarSubmit_Btn">Set for <span class="calendar-chosen-dt-span" id="ChosenDateTime_Span">today, at 23:00</span></button> </div> </div>', null, null);
    $(".calendar-days-box").empty();
    $(".calendar-hrs-box").empty();
    $(".calendar-mins-box").empty();

    let currentDt = new Date(currentDate);
    let calendarResult = calendarRefresh(currentDt.getFullYear(), currentDt.getMonth(), currentDt.getDate(), false);
    let timesResult = timeBarRefresh(showMinutes, twentyforHoursFormat);
    let monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (calendarResult != null) {
        let currentMonth = -1;
        for (let i = 0; i < calendarResult.length; i++) {
            let dayInfo = new Date(calendarResult[i]);
            let week = dayOfWeekShortArr[dayInfo.getDay()];
            let month = monthsShortArr[dayInfo.getMonth()];

            if (currentMonth != dayInfo.getMonth()) {
                currentMonth = dayInfo.getMonth();
                let monthChangeDiv = $("<div class='box-standard p-1'></div>");
                monthChangeSpan = $("<h6 class='card-text'></h6>");
                monthChangeSpan.html(monthsArr[currentMonth]);
                monthChangeDiv.append(monthChangeSpan);
                $(".calendar-days-box").append(monthChangeDiv);
            }

            let yearDayBtn = $("<button type='button' class='btn btn-standard btn-year-day-update w-100'></button>");
            yearDayBtn.attr("data-format-type", 0);
            yearDayBtn.attr("id", i + "-YearDay_Btn");
            yearDayBtn.attr("data-val", dayInfo.getMonth() + 1 + "/" + dayInfo.getDate() + "/" + dayInfo.getFullYear());
            yearDayBtn.html(week + ", " + dayInfo.getDate() + " " + month);
            $(".calendar-days-box").append(yearDayBtn);
        }
    }

    if (timesResult != null) {
        for (let i = 0; i < timesResult[0].length; i++) {
            let hoursBtn = $("<button type='button' class='btn btn-standard btn-hour-day-update w-100'></button>");
            if (i == 0) hoursBtn.addClass("bg-chosen-bright");
            hoursBtn.html(timesResult[0][i] < 10 ? "0" + timesResult[0][i] : timesResult[0][i]);
            hoursBtn.attr("data-val", timesResult[0][i]);
            $(".calendar-hrs-box").append(hoursBtn);
        }
        if (timesResult.length > 1) {
            for (let i = 0; i < timesResult[1].length; i++) {
                let minsBtn = $("<button type='button' class='btn btn-standard btn-hour-day-update w-100'></button>");
                if (i == 0) minsBtn.addClass("bg-chosen-bright");
                minsBtn.html(timesResult[1][i] < 10 ? "0" + timesResult[1][i] : timesResult[1][i]);
                minsBtn.attr("data-val", timesResult[1][i]);
                $(".calendar-mins-box").append(minsBtn);
            }
        } 
    }

    if (dateResultDisplay != undefined || dateResultDisplay != null) $(".btn-calendar-submit").attr("data-date-display", dateResultDisplay);
    else $(".btn-calendar-submit").removeAttr("data-date-display");

    $(".btn-calendar-submit").attr("data-target", targetValueElemenetId);
    if (showDays) $(".calendar-days-box").fadeIn(300);
    else $(".calendar-days-box").fadeOut(300);
    if (showTime) {
        if (showMinutes) showTimeBar(true, twentyforHoursFormat);
        else showTimeBar(false, twentyforHoursFormat);
    }
    else hideTimeBar();

    if (openOnCall) {
        displayCorrector(currentWindowSize);
        setTimeout(function () {
            callAContainer(false, "DateAndTime_Container", false);
        }, 150);
    }
}

function dateAndTimeFormation(formatType, dateAndTime) {
    let newDayValue = new Date(dateAndTime);
    if (newDayValue != undefined && newDayValue != null) {
        let rDayValue = newDayValue.getDate();
        let rMonthValue = newDayValue.getMonth();
        let rYearValue = newDayValue.getFullYear();
        let rHourValue = newDayValue.getHours();
        let rMinValue = newDayValue.getMinutes();
        $("#CalendarDay_Val").val(rDayValue);
        $("#CalendarMonth_Val").val(rMonthValue);
        $("#CalendarYear_Val").val(rYearValue);
        $("#CalendarHr_Val").val(rHourValue);
        $("#CalendarMin_Val").val(rMinValue);

        switch (parseInt(formatType)) {
            case 0:
                newDayValue = dateAndTimeCompiller(userLocale, rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, false, true);
                break;
            case 1:
                newDayValue = dateAndTimeCompiller(userLocale, rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, false, false);
                break;
            case 2:
                newDayValue = dateAndTimeCompiller(userLocale, rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, true, true);
                break;
            case 4:
                newDayValue = dateAndTimeCompiller(userLocale, rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, true, false);
                break;
            default:
                newDayValue = dateAndTimeCompiller(userLocale, rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, false, true);
                break;
        }
        return [newDayValue, [rDayValue, rMonthValue + 1, rYearValue, rHourValue, rMinValue]];
    }
    else return null;
}

function dateAndTimeCompiller(countryISO2, day, weekday, month, year, hour, min, showTime = true, longFormatted = false) {
    let dateResult = new Date(year, month, day, hour, min);
    if (dateResult != undefined) {
        let result;
        let yearAddition = "";
        let currentDt = new Date();
        const locales = ['en-US', 'en-CA', 'ja-JP', 'zh-CN', 'ru-RU', 'de-DE', 'it-IT', 'en-GB'];

        if (countryISO2 != null || countryISO2 != undefined) {
            for (let i = 0; i < locales.length; i++) {
                if (locales[i].toLowerCase().includes(countryISO2.toLowerCase())) {
                    countryISO2 = locales[i];
                    break;
                }
            }
        }
        else countryISO2 = "en-US";

        if (currentDt.getFullYear() != year) yearAddition = ", " + year;
        if (longFormatted) result = dayOfWeekShortArr[weekday] + ", " + dateResult.getDate() + " " + monthsShortArr[month] + " " + yearAddition;
        else result = dateResult.toLocaleDateString(countryISO2);

        if (showTime) result += ", at " + dateResult.toLocaleTimeString(countryISO2, { hour: "2-digit", minute: "2-digit" });
        else result = dayOfWeekShortArr[weekday] + ", " + dateResult.getDate() + " " + monthsShortArr[month] + yearAddition;
        return result;
    }
    else return null;
}

function calendarRefresh(currentYear = new Date().getFullYear(), currentMonth = 0, currentDay = 1, restrictPrevDaysForCurrentYear = false) {
    let yearDays = [];
    let currentDate = new Date(currentYear, currentMonth, currentDay);
    let endDate = new Date(currentYear, 11, 31);

    for (let i = new Date(currentDate); i < endDate; i.setDate(i.getDate() + 1)) {
        yearDays.push(new Date(i));
    }
    if (yearDays.length > 0) return yearDays;
    else return null;
}

function hideTimeBar() {
    $(".calendar-hrs-box").fadeOut(300);
    $(".calendar-mins-box").fadeOut(300);
    $(".calendar-hrformat-box").fadeOut(300);
}

function showTimeBar(showMinuteBar = true, twentyforHrFormat = true) {
    $(".calendar-hrs-box").fadeIn(300);
    if (twentyforHrFormat) $(".calendar-hrformat-box").fadeIn(300);
    else $(".calendar-hrformat-box").fadeOut(300);
    if (showMinuteBar) $(".calendar-mins-box").fadeIn(300);
    else $(".calendar-mins-box").fadeOut(300);
}

function timeBarRefresh(includeMinutes = true, twentyforHrsFormat = true) {
    let mins = [];
    let hours = [];
    if (twentyforHrsFormat) {
        for (let i = 0; i < 25; i++) {
            hours.push(i);
        }
    }
    else {
        for (let i = 0; i < 13; i++) {
            hours.push(i);
        }
    }

    if (hours.length > 0) {
        if (includeMinutes) {
            for (let i = 0; i < 60; i++) mins.push(i);
            return [hours, mins];
        }
        else return [hours];
    }
    else return null;
}

function listToText(artistsArray = [], hasInitialValue = true) {
    if (artistsArray.length != null && artistsArray.length > 0) {
        let finalizedText;
        if (!hasInitialValue) {
            for (let i = 0; i < artistsArray.length; i++) {
                if (i == 0) finalizedText = artistsArray[i];
                else finalizedText += ", " + artistsArray;
            }
        }
        else {
            finalizedText = "";
            for (let i = 0; i < artistsArray.length; i++) {
                finalizedText += ", " + artistsArray[i];
            }
        }
        return finalizedText;
    }
    else return null;
}

function textToList(artistsListedInText) {
    if (artistsListedInText != null && artistsListedInText.length > 0) {
        let values = getCommaSeparatedValues(artistsListedInText);
        if (values.length > 0) return values;
        else return null;
    }
    else return null;
}

function getFileExtension(fileUrl) {
    if (fileUrl != null) {
        fileUrl = fileUrl.substring(fileUrl.lastIndexOf("."), fileUrl.length);
        return fileUrl;
    }
    else return null;
}

function studioAlbumsSampler(id, title, imgUrl, releaseDate, status, insertInElementId = null, isForAuthor = false) {
    let releaseBox = $('<div class="release-stack-box"></div>');
    let releaseImg = $("<img src='#' class='release-img' />");
    let releaseImgBox = $("<div class='release-img-box'></div>");
    let releaseInfoBox = $('<div class="box-standard text-truncate mt-1"></div>');
    let releaseName = $('<span class="h6"></span>');
    let releaseStatsBadge = $('<small class="badge-icon badge-sm btn-tooltip" data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-placement="bottom" data-bs-title="The track will be released as soon as we get your submission"></small>');
    let releaseStatsSeparator = $("<br />");
    let releaseDateTime = $("<span class='card-text text-muted'></span>");

    releaseBox.attr("id", id + "-AlbumInfo_Box");
    releaseDateTime.html(new Date(releaseDate).getFullYear() + " ∙ ");
    if (title != null) releaseName.html(title);
    else releaseName.html("No Title");

    releaseImg.attr("id", id + "-StudioAlbum_Img");
    releaseImgBox.attr("id", id + "-StudioAlbum_Img_Box");
    releaseStatsBadge.attr("id", id + "-AlbumInfo_Badge");
    if (imgUrl != null) {
        releaseImg.attr("src", "/AlbumCovers/" + imgUrl);
        releaseImg.fadeIn(0);
        releaseImgBox.fadeOut(0);
    }
    else {
        releaseImgBox.html(' <i class="fa-solid fa-music"></i> ');
        releaseImg.fadeOut(0);
        releaseImgBox.fadeIn(0);
    }

    if (isForAuthor) {
        releaseBox.removeClass("btn-get-album-info");
        releaseBox.addClass("btn-get-album-info-as-author");
        switch (parseInt(status)) {
            case 0:
                releaseStatsBadge.html('<i class="fa-solid fa-pause"></i> Passive');
                releaseStatsBadge.attr("data-bs-title", "This track is currently unavailable");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Resume <span class='float-end'> <i class='fa-solid fa-volume-high'></i> </span></button>");
                break;
            case 1:
                releaseStatsBadge.html('<i class="fa-solid fa-spinner fa-spin-pulse"></i> Pending');
                releaseStatsBadge.attr("data-bs-title", "The track will be released as soon as we get your submission");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Submit <span class='float-end'> <i class='fa-solid fa-check-double'></i> </span></button>");
                break;
            case 2:
                releaseStatsBadge.html('<i class="fa-solid fa-check-double"></i> Active');
                releaseStatsBadge.attr("data-bs-title", "The track is currently active and accessible to all");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Mute <span class='float-end'> <i class='fa-solid fa-volume-off'></i> </span></button>");
                break;
            default:
                releaseStatsBadge.html('<i class="fa-solid fa-check-double"></i> Active');
                releaseStatsBadge.attr("data-bs-title", "The track is currently active and accessible to all");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Mute <span class='float-end'> <i class='fa-solid fa-volume-off'></i> </span></button>");
                break;
        }
    }
    releaseInfoBox.append(releaseName);
    releaseInfoBox.append(releaseStatsSeparator);
    releaseInfoBox.append(releaseDateTime);
    releaseInfoBox.append(releaseStatsBadge);

    releaseBox.append(releaseImg);
    releaseBox.append(releaseImgBox);
    releaseBox.append(releaseInfoBox);

    if (insertInElementId != null) {
        $("#" + insertInElementId).fadeIn(300);
        $("#" + insertInElementId).append(releaseBox);
    }
    else return releaseBox;
}

function studioSinglesSampler(id, title, imgUrl, releaseDate, status, insertInElementId = null, isForAuthor = false) {
    let releaseBox = $('<div class="release-stack-box"></div>');
    let releaseImg = $("<img src='#' class='release-img' />");
    let releaseImgBox = $("<div class='release-img-box'></div>");
    let releaseInfoBox = $('<div class="box-standard text-truncate mt-1"></div>');
    let releaseName = $('<span class="h6"></span>');
    let releaseStatsBadge = $('<small class="badge-icon badge-sm btn-tooltip" data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-placement="bottom" data-bs-title="The track will be released as soon as we get your submission"></small>');
    let releaseStatsSeparator = $("<br />");
    let releaseDateTime = $("<span class='card-text text-muted'></span>");

    releaseBox.attr("id", id + "-ReleaseInfo_Box");
    releaseDateTime.html(new Date(releaseDate).getFullYear() + " ∙ ");
    if (title != null) releaseName.html(title);
    else releaseName.html("No Title");

    //0 - inactive; 1 - pending for submission; 2 - muted; 3 - active ([0-2] - inactive)

    releaseImg.attr("id", id + "-StudioRelease_Img");
    releaseImgBox.attr("id", id + "-StudioRelease_Img_Box");
    releaseStatsBadge.attr("id", id + "-ReleaseInfo_Badge");
    if (imgUrl != null) {
        releaseImg.attr("src", "/TrackCovers/" + imgUrl);
        releaseImg.fadeIn(0);
        releaseImgBox.fadeOut(0);
    }
    else {
        releaseImgBox.html(' <i class="fa-solid fa-music"></i> ');
        releaseImg.fadeOut(0);
        releaseImgBox.fadeIn(0);
    }

    if (isForAuthor) {
        releaseBox.removeClass("btn-get-release-info");
        releaseBox.addClass("btn-get-release-info-as-author");
        switch (parseInt(status)) {
            case 0:
                releaseStatsBadge.html('<i class="fa-solid fa-volume-xmark"></i> Muted');
                releaseStatsBadge.attr("data-bs-title", "This track was disabled manually by you");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Resume <span class='float-end'> <i class='fa-solid fa-volume-high'></i> </span></button>");
                break;
            case 1:
                releaseStatsBadge.html('<i class="fa-solid fa-spinner fa-spin-pulse"></i> Pending');
                releaseStatsBadge.attr("data-bs-title", "The track will be released as soon as we get your submission");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Submit <span class='float-end'> <i class='fa-solid fa-check-double'></i> </span></button>");
                break;
            case 2:
                releaseStatsBadge.html('<i class="fa-solid fa-circle-pause"></i> Disabled');
                releaseStatsBadge.attr("data-bs-title", "This track has been muted. Refer to your notifications for more information");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Submit <span class='float-end'> <i class='fa-solid fa-check-double'></i> </span></button>");
                dropdownBtn2.fadeOut(0);
                break;
            case 3:
                releaseStatsBadge.html('<i class="fa-solid fa-check-double"></i> Active');
                releaseStatsBadge.attr("data-bs-title", "The track is currently active and accessible to all");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Mute <span class='float-end'> <i class='fa-solid fa-volume-off'></i> </span></button>");
                break;
            default:
                releaseStatsBadge.html('<i class="fa-solid fa-check-double"></i> Active');
                releaseStatsBadge.attr("data-bs-title", "The track is currently active and accessible to all");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Mute <span class='float-end'> <i class='fa-solid fa-volume-off'></i> </span></button>");
                break;
        }
    }
    releaseInfoBox.append(releaseName);
    releaseInfoBox.append(releaseStatsSeparator);
    releaseInfoBox.append(releaseDateTime);
    releaseInfoBox.append(releaseStatsBadge);

    releaseBox.append(releaseImg);
    releaseBox.append(releaseImgBox);
    releaseBox.append(releaseInfoBox);

    if (insertInElementId != null) {
        $("#" + insertInElementId).fadeIn(300);
        $("#" + insertInElementId).append(releaseBox);
    }
    else return releaseBox;
}

function favoritesInfoSampler(songsQty, songs = [], lastUpdatedDate = new Date()) {
    //fvr
    if (currentWindowSize > 1024) createAContainer("PlaylistInfo", "Favorite Songs", '<div class="release-box-lg"> <div class="hstack gap-1"> <div class="release-img-box-lg" id="Favorites_Img_Box"> <i class="fa-solid fa-star text-primary"></i> </div> <div class="box-standard ms-1"> <div class="box-playlist-header-content"> <div> <small class="card-text"> <span id="FavoritesInfo_Type_Span"> <i class="fa-solid fa-star text-primary"></i> Favorite Songs </span> </small> <div></div> <span class="h1" id="FavoritesInfo_Name_Lbl">Favorites</span> </div> <div class="box-standard mt-2"> <button type="button" class="btn btn-release-title btn-play-pause-track btn-play-pause-track-lg btn-lg me-1" id="FavoritesInfo_PlayPauseMain_Btn"> <i class="fa-solid fa-play"></i> Play </button> <button type="button" class="btn btn-release-title btn-lg me-1"> <i class="fa-solid fa-shuffle"></i> Shuffle </button> </div> <div class="box-standard mt-1"> <small class="card-text text-muted"> <input type="hidden" id="FavoritesSongsQty_Val" value="0" /> <span id="FavoritesInfo_SongsOnlyQty_Span">0</span> <span id="FavoritesInfo_SongsQtyText_Span"> songs</span> </small> <small class="card-text text-muted" id="FavoritesInfo_LastUpdated_Span"> ∙ last updated recently </small> </div> </div> </div> </div> </div> <div class="box-standard mt-1" id="FavoritesInfo_TrackBoxes_Box"></div>', null, null, true);
    else createAContainer("PlaylistInfo", "Favorite Songs", '<div class="release-box-lg"> <div class="release-img-box-lg mx-auto" id="Favorites_Img_Box"> <i class="fa-solid fa-star text-primary"></i> </div> <div class="box-standard text-center mt-2"> <span class="h1" id="FavoritesInfo_Name_Lbl">Favorites</span> <br/> <input type="hidden" id="FavoritesSongsQty_Val" value="0" /> <span class="card-text"> <span class="card-text" id="FavoritesInfo_SongsOnlyQty_Span">0</span> <span class="card-text" id="FavoritesInfo_SongsQtyText_Span"> songs</span> </span> <span class="card-text" id="FavoritesInfo_LastUpdated_Span"> ∙ last updated recently </span> </div> <div class="box-standard text-center mt-3"> <button type="button" class="btn btn-release-title btn-play-pause-track btn-play-pause-track-lg btn-lg br-max-corners me-1" id="FavoritesInfo_PlayPauseMain_Btn"> <i class="fa-solid fa-play"></i> Play </button> <button type="button" class="btn btn-release-title btn-lg br-max-corners me-1"> <i class="fa-solid fa-shuffle"></i> Shuffle </button> </div> </div> <div class="box-standard mt-1" id="FavoritesInfo_TrackBoxes_Box"></div>', null, null, true);

    $("#FavoritesSongsQty_Val").val(songsQty);
    if (songsQty <= 0) {
        $("#FavoritesInfo_SongsQty_Span").text("No Songs");
        $("#FavoritesInfo_SongsOnlyQty_Span").html("<span class='fw-500'>empty</span>");
        $("#FavoritesInfo_SongsQtyText_Span").html("<span class='fw-500'>playlist</span>");
    }
    else if (songsQty == 1) {
        $("#FavoritesInfo_SongsQtyText_Span").text("song");
        $("#FavoritesInfo_SongsQty_Span").text("One Song");
        $("#FavoritesInfo_SongsOnlyQty_Span").html("<span class='fw-500'>" + songsQty + "</span>");
    }
    else {
        $("#FavoritesInfo_SongsQtyText_Span").text("songs");
        $("#FavoritesInfo_SongsQty_Span").text(songsQty + " Songs");
        $("#FavoritesInfo_SongsOnlyQty_Span").html("<span class='fw-500'>" + songsQty + "</span>");
    }
    if (lastUpdatedDate != null || lastUpdatedDate != undefined) {
        lastUpdatedDate = new Date(lastUpdatedDate);
        lastUpdatedDate = dateAndTimeFormation(0, lastUpdatedDate);
        if (lastUpdatedDate != null) {
            $("#FavoritesInfo_LastUpdated_Span").fadeIn(0);
            $("#FavoritesInfo_LastUpdated_Span").html(" ∙ last updated <span class='fw-500'>" + lastUpdatedDate[0] + "</span>");
        }
        else $("#FavoritesInfo_LastUpdated_Span").fadeIn(0);
    }
    else $("#FavoritesInfo_LastUpdated_Span").fadeOut(0);

    favoriteSongsApllier(songs, "FavoritesInfo_TrackBoxes_Box", false, 0);
}

function playlistInfoSampler(id, title, imageUrl, releaseDateAndTime, songsQty = 0, currentUserId = 0, mainArtistId = 0, mainArtistName, mainArtistImgUrl, songs = [], isSaved = false) {
    if (currentWindowSize < 1024) createAContainer("PlaylistInfo", title, '<div class="release-box-lg"><div> <div class="release-img-box-lg mx-auto" id="Playlist_Img_Box"> <i class="fa-solid fa-music"></i> </div> <img src="#" class="release-img-lg mx-auto" id="Playlist_Img" style="display: none;" /> <div class="box-standard text-center mt-2"> <span class="h1">Release Name</span> <br/> <input type="hidden" id="PlaylistSongsQty_Val" value="0" /> <span class="h4" id="PlaylistInfo_OwnerInfo_Span">Ado</span> <br/> <span class="card-text"><span class="card-text" id="PlaylistInfo_Type_Span">Single</span> ∙ <span class="card-text" id="PlaylistInfo_ReleaseDate_Span">2025</span> <span class="card-text" id="PlaylistInfo_SongsQty_Span" style="display: none;">0 songs</span></span> <div class="box-standard mt-3"> <button type="button" class="btn btn-release-title btn-play-pause-track btn-play-pause-track-lg btn-lg br-max-corners me-1" id="PlaylistInfo_PlayPauseMain_Btn"> <i class="fa-solid fa-play"></i> Play </button> <button type="button" class="btn btn-release-title btn-lg br-max-corners me-1"> <i class="fa-solid fa-shuffle"></i> Shuffle </button> <button type="button" class="btn btn-standard-bolded btn-save-the-playlist btn-lg br-max-corners me-1 super-disabled" id="SaveThePlaylistIncluded_Btn"> <i class="fa-solid fa-plus"></i> </button> <button type="button" class="btn btn-standard-bolded btn-remove-the-playlist btn-lg br-max-corners me-1 super-disabled" id="UnsaveThePlaylistIncluded_Btn" style="display: none;"> <i class="fa-solid fa-check-double"></i> </button> </div> </div> <div class="box-standard" id="PlaylistInfo_TrackBoxes_Box"></div> <div class="d-none"> <form method="get" action="/Playlists/GetTracks" id="GetPlaylistTracks_Form"> <input type="hidden" name="Id" id="GPT_Id_Val" value="0" /> <input type="hidden" name="UserId" id="GPT_UserId_Val" value="0" /> <input type="hidden" name="Skip" id="GPT_Skip_Val" value="0" /> </form> <form method="post" action="/Playlists/RemoveFrom" id="RemoveFromPlaylist_Form"> <input type="hidden" name="Id" id="RFP_Id_Val" value="0" /> <input type="hidden" name="PlaylistId" id="RFP_PlaylistId_Val" value="0" /> </form> </div> </div></div>', null, null, true);
    else createAContainer("PlaylistInfo", title, '<div class="release-box-lg"><div class="hstack gap-1"> <div class="release-img-box-lg" id="Playlist_Img_Box"> <i class="fa-solid fa-music"></i> </div> <img src="#" class="release-img-lg" id="Playlist_Img" style="display: none;" /> <div class="box-standard ms-1"> <div class="box-playlist-header-content"> <div> <small class="card-text"> <span id="PlaylistInfo_Type_Span">Single</span> <br /> <span class="h1" id="PlaylistInfo_Name_Lbl">Release Name</span> </small> </div> <div class="box-standard mt-2"> <button type="button" class="btn btn-release-title btn-play-pause-track btn-play-pause-track-lg btn-lg br-soft-corners me-1" id="PlaylistInfo_PlayPauseMain_Btn"> <i class="fa-solid fa-play"></i> Play </button> <button type="button" class="btn btn-release-title btn-lg br-soft-corners me-1"> <i class="fa-solid fa-shuffle"></i> Shuffle </button> <button type="button" class="btn btn btn-standard-bolded btn-lg br-soft-corners me-1" id="PlaylistInfo_SingleStar_Btn" style="display: none;"> <i class="fa-regular fa-star"></i> </button> <div class="d-inline-block"> <input type="hidden" id="PlaylistSongsQty_Val" value="0" /> <button type="button" class="btn btn-standard-bolded btn-save-the-playlist btn-lg br-soft-corners me-1 super-disabled" id="SaveThePlaylistIncluded_Btn"> <i class="fa-solid fa-plus"></i> </button> <button type="button" class="btn btn-standard-bolded btn-remove-the-playlist btn-lg br-soft-corners me-1 super-disabled" id="UnsaveThePlaylistIncluded_Btn" style="display: none;"> <i class="fa-solid fa-check-double"></i> </button> </div> </div> <div class="box-standard mt-1"> <span class="card-text text-muted"> <span id="PlaylistInfo_SongsQty_Span">0 songs</span> ∙ <span id="PlaylistInfo_ReleaseDate_Span">2025</span> </span> </div> </div> </div> </div> </div> <div class="box-standard" id="PlaylistInfo_TrackBoxes_Box"></div> <div class="d-none"> <form method="get" action="/Playlists/GetTracks" id="GetPlaylistTracks_Form"> <input type="hidden" name="Id" id="GPT_Id_Val" value="0" /> <input type="hidden" name="UserId" id="GPT_UserId_Val" value="0" /> <input type="hidden" name="Skip" id="GPT_Skip_Val" value="0" /> </form> <form method="post" action="/Playlists/RemoveFrom" id="RemoveFromPlaylist_Form"> <input type="hidden" name="Id" id="RFP_Id_Val" value="0" /> <input type="hidden" name="PlaylistId" id="RFP_PlaylistId_Val" value="0" /> </form> </div></div>', null, null, true);
    let releaseDate = new Date(releaseDateAndTime);

    $("#GPT_Skip_Val").val(0);
    $("#GPT_Id_Val").val(id);
    $("#SORTP_Id_Val").val(id);
    $("#GPT_UserId_Val").val(currentUserId);
    if (isSaved) {
        $(".btn-save-the-playlist").fadeOut(0);
        $(".btn-remove-the-playlist").fadeIn(0);
        $(".btn-save-the-playlist").attr("data-id", 0);
        $(".btn-remove-the-playlist").attr("data-id", id);
        $(".btn-save-the-playlist").addClass("super-disabled");
        $(".btn-remove-the-playlist").removeClass("super-disabled");
    }
    else {
        $(".btn-save-the-playlist").fadeIn(0);
        $(".btn-remove-the-playlist").fadeOut(0);
        $(".btn-save-the-playlist").attr("data-id", id);
        $(".btn-remove-the-playlist").attr("data-id", 0);
        $(".btn-remove-the-playlist").addClass("super-disabled");
        $(".btn-save-the-playlist").removeClass("super-disabled");
    }

    $("#PlaylistInfo_TrackBoxes_Box").empty();
    $("#PlaylistInfo_Name_Lbl").html(title);
    $("#Playlist_Img_Box").html(' <i class="fa-solid fa-wave-square"></i> ');
    $("#PlaylistInfo_Type_Span").html(' <i class="fa-solid fa-wave-square"></i> Playlist');

    if (mainArtistId > 0 && mainArtistName != null || mainArtistName != undefined) {
        $("#PlaylistInfo_MainArtist_Span").html(mainArtistName);
        $("#PlaylistInfo_MainArtist_Span").attr("data-id", mainArtistId);
    }
    else {
        $("#PlaylistInfo_MainArtist_Span").attr("data-id", 0);
        $("#PlaylistInfo_MainArtist_Span").html("Unknown");
    }
    $("#PlaylistInfo_SongsQty_Span").html(songsQty > 1 ? "<span class='fw-500'>" + songsQty + "</span>" : "<span class='fw-500'>One</span> song");

    $("#PlaylistInfo_ReleaseDate_Span").text(releaseDate.getFullYear());
    $("#PlaylistInfo_ReleaseDate_Span").attr("data-bs-title", "Release <span class='fw-500'>" + dateAndTimeFormation(userLocale, releaseDate) + "</span>");
    $("#PlaylistInfo_TrackBoxes_Box").empty();
    if (mainArtistImgUrl != null) {
        $("#PlaylistInfo_Author_Img").attr("src", "/ProfileImages/" + mainArtistImgUrl);
        $("#PlaylistInfo_AuthorImg_Box").fadeOut(0);
        $("#PlaylistInfo_Author_Img").fadeIn(0);
    }
    else {
        $("#PlaylistInfo_Author_Img").fadeOut(0);
        $("#PlaylistInfo_Author_Img").attr("src", "#");
        $("#PlaylistInfo_AuthorImg_Box").fadeIn(0);
        $("#PlaylistInfo_AuthorImg_Box").html(' <i class="fa-solid fa-circle-user"></i> ');
    }

    if (imageUrl != null) {
        if (imageUrl.includes("/")) $("#Playlist_Img").attr("src", imageUrl);
        else $("#Playlist_Img").attr("src", "/PlaylistCovers/" + imageUrl);
        $("#Playlist_Img_Box").fadeOut(0);
        $("#Playlist_Img").fadeIn(0);
    }
    else {
        $("#Playlist_Img").fadeOut(0);
        $("#Playlist_Img_Box").fadeIn(0);
        $("#Playlist_Img").attr("src", "#");
    }
    if (songs != undefined) playlistSongsApplier(playlistId, songs, "PlaylistInfo_TrackBoxes_Box", "PlaylistInfo_SongsQty_Span", false);
    $("#PlaylistSongsQty_Val").val(songs != null ? songs.length : 0);
}

function albumInfoSampler(id, title, description, imageUrl, version = 0, releaseDateAndTime = new Date(), songsQty = 0, mainArtistId = 0, mainArtistName = null, genreId = 0, genreName = null, currentUserId = 0, status = 0, isPremiere = false, isForAuthor = false) {
    if ((id != null || id != undefined) && (title != null || title != undefined)) {
        if (currentWindowSize < 1024) createAContainer("AlbumInfo", title, '<div class="release-box-lg"> <div class="mx-auto text-center"> <input type="hidden" id="AlbumInfo_Identifier_Val" value="0" /> <img src="#" class="release-img-lg mx-auto" id="AlbumInfo_Img" style="display: none;" /> <div class="release-img-box-lg mx-auto" id="AlbumInfo_Img_Box"> <i class="fa-solid fa-compact-disc"></i> </div> </div> <div class="box-standard text-center mt-2"> <small class="card-text text-muted btn-album-editing-tool btn-select-primary btn-tooltip" id="AlbumInfo_Version_Val-BtnEdit" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Tap to edit album version" data-val="0" data-class="album-version-edit" data-unique-id="AlbumVersionEdit" data-texts="Regular,Remastered,Deluxe,Extended,Anniversary,Live,Instrumental,Re-release,Explicit,Clean,Special Edition">Remastered</small> <small class="card-text text-muted" id="AlbumInfo_StatusSeparator_Span"> ∙ </small> <small class="card-text text-muted btn-album-editing-tool" id="AlbumInfo_Status_Span">Pending</small> <br/> <span class="h1" id="AlbumInfo_Title_Lbl">Album Title</span> <br/> <small class="card-text btn-album-editing-tool text-muted" id="AlbumInfo_Genre_Span">J-Pop</small> <small class="card-text text-muted"> ∙ </small> <small class="card-text btn-album-editing-tool btn-select-date text-muted" data-display="AlbumInfo_PremiereDate_Val_Span" data-result="AlbumInfo_PremiereDate_Val" id="AlbumInfo_PremiereDate_Val_Span">2025</small> <small class="card-text text-muted"> ∙ </small> <small class="card-text text-muted"><span class="card-text" id="AlbumInfo_SongsQty_Span">12</span> <span class="card-text" id="AlbumInfo_SongsQtyText_Span">songs</span></small> <div id="PremieredBadge_Box" style="display: none;"> <small class="card-text text-muted"> ∙ </small> <small class="premiere-badge" id="AlbumInfo_PremiereBadge_Span">Premiere</small> </div> </div> <div class="box-standard mt-2" id="AlbumInfo_AuthorOptions_Box"> <div class="d-none"> <div id="EditAlbumVersion_Box"> <form method="post" action="/Album/EditVersion" id="EditAlbumVersion_Form"> <input type="hidden" name="Id" id="EditAlbumVersion_Id_Val" value="0" /> <input type="hidden" class="form-control-distance" data-by-alert="true" data-form="EditAlbumVersion_Form" data-alert="Save changes to the album version?" name="Version" id="AlbumInfo_Version_Val" value="0" /> </form> <input type="hidden" id="EditAlbumVersion_Version_Val-Base_Val" value="0" /> </div> <div id="EditPremiereDate_Box"> <form method="post" action="/Album/EditPremiereDate" id="EditPremiereDate_Form"> <input type="hidden" name="Id" id="EditPremiereDate_Id_Val" value="0" /> <input type="hidden" class="form-control-distance" data-by-alert="true" data-form="EditPremiereDate_Form" data-alert="Save changes to the album release date?" id="AlbumInfo_PremiereDate_Val" value="0" /> </form> </div> <div id="ReorderAlbumTracks_Box"> <form method="post" action="/Album/LoadTracks" id="LoadAlbumTracks_Form"> <input type="hidden" id="LoadAlbumTracks_Id_Val" value="0" /> <input type="hidden" id="LoadAlbumTracks_Type_Val" value="0" /> </form> </div> </div> <div class="hstack gap-1"> <button type="button" class="btn btn-standard-rounded btn-open-inside-lg-card btn-sm text-center mx-auto me-1" id="EditAlbumMetadata_Container-OpenBtn"> <i class="fa-solid fa-pencil"></i> Edit</button> <div class="box-standard mx-auto"> <input type="file" class="d-none" id="EditAlbumCoverImage_File_Val" accept=".png, .jpg, .jpeg" /> <form method="post" action="/Album/EditCoverImage" id="EditAlbumCoverImage_Form"> <input type="hidden" name="CoverImageUrl" id="EditCoverImageUrl_Val" /> <button type="submit" class="btn btn-standard-rounded btn-sm text-center mx-auto" id="EditAlbumCoverImage_SbmtBtn"> <i class="fa-solid fa-paperclip"></i> Image</button> </form> </div> <div class="box-standard mx-auto"> <button type="button" class="btn btn-standard-rounded btn-distance-submitter btn-sm text-center mx-auto me-1" data-form="LoadAlbumTracks_Form" id="LoadAlbumTracksToReorder_SbmtBtn"> <i class="fa-solid fa-bars"></i> Reorder</button> <button type="button" class="btn btn-standard-rounded btn-distance-submitter btn-sm text-center mx-auto me-1" data-form="GetTracksInfo_Form" id="AddAlbumTracks_Btn" style="display: none;"> <i class="fa-solid fa-plus"></i> Add Track</button> </div> <div class="box-standard mx-auto"> <div class="box-standard" id="SubmitTheAlbum_Box"> <form method="post" action="/Album/Submit" id="SubmitTheAlbum_Form"> <input type="hidden" name="Id" id="SubmitTheAlbum_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-rounded btn-tooltip btn-sm text-center mx-auto" id="SubmitTheAlbum_SbmtBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Deploy album now (ignores premiere date)"> <i class="fa-solid fa-check-double"></i> Submit</button> </form> </div> <div class="box-standard" id="EnableTheAlbum_Box" style="display: none;"> <form method="post" action="/Album/Enable" id="EnableTheAlbum_Form"> <input type="hidden" name="Id" id="EnableTheAlbum_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-rounded btn-sm text-center mx-auto" id="EnableTheAlbum_SbmtBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Enable album (editing will be disabled)"> <i class="fa-solid fa-toggle-on"></i> Enable</button> </form> </div> <div class="box-standard" id="DisableTheAlbum_Box" style="display: none;"> <form method="post" action="/Album/Disable" id="DisableTheAlbum_Form"> <input type="hidden" name="Id" id="DisableTheAlbum_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-rounded btn-tooltip btn-sm text-center mx-auto" id="DisableTheAlbum_SbmtBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Disable album (listening off, editing enabled)"> <i class="fa-solid fa-toggle-off"></i> Disable</button> </form> </div> </div> </div> </div> </div> <div class="box-standard mt-3" id="AlbumSongs_Box"></div>', null, null, true);
        else createAContainer("AlbumInfo", title, '<div class="release-box-lg"> <div class="hstack gap-2"> <div class="release-img-box-lg" id="AlbumInfo_Img_Box"> <i class="fa-solid fa-compact-disc"></i> </div> <img src="#" class="release-img-lg" id="AlbumInfo_Img" style="display: none;" /> <div class="ms-1"> <div class="box-playlist-header-content"> <small class="card-text text-muted" id="AlbumInfo_Type_Span">Album</small> <small class="card-text text-muted" id="AlbumInfo_VersionSeparator_Span"> ∙ </small> <small class="card-text text-muted btn-album-editing-tool btn-select-primary btn-tooltip" id="AlbumInfo_Version_Val-BtnEdit" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Tap to edit album version" data-val="0" data-class="album-version-edit" data-unique-id="AlbumVersionEdit" data-texts="Regular,Remastered,Deluxe,Extended,Anniversary,Live,Instrumental,Re-release,Explicit,Clean,Special Edition">Remastered</small> <small class="card-text text-muted" id="AlbumInfo_StatusSeparator_Span"> ∙ </small> <small class="card-text text-muted" id="AlbumInfo_Status_Span">Pending</small> <br /> <span class="h1" id="AlbumInfo_Title_Lbl">Album Title</span> <br /> <small class="card-text text-muted" id="AlbumInfo_Genre_Span">J-Pop</small> <small class="card-text text-muted"> ∙ </small> <small class="card-text btn-album-editing-tool btn-select-date text-muted" data-display="AlbumInfo_PremiereDate_Val_Span" data-result="AlbumInfo_PremiereDate_Val" id="AlbumInfo_PremiereDate_Val_Span">2025</small> <small class="card-text text-muted"> ∙ </small> <small class="card-text text-muted" id="AlbumInfo_SongsQty_Span">12</small> <small class="card-text text-muted" id="AlbumInfo_SongsQtyText_Span">songs</small> <div id="PremieredBadge_Box" style="display: none;"> <small class="card-text text-muted"> ∙ </small> <small class="premiere-badge" id="AlbumInfo_PremiereBadge_Span">Premiere</small> </div> <div class="x-row-sliding-only-box mt-2" id="AlbumInfo_AuthorOptions_Box"> <div class="d-none"> <div id="EditAlbumVersion_Box"> <form method="post" action="/Album/EditVersion" id="EditAlbumVersion_Form"> <input type="hidden" name="Id" id="EditAlbumVersion_Id_Val" value="0" /> <input type="hidden" class="form-control-distance" data-by-alert="true" data-form="EditAlbumVersion_Form" data-alert="Save changes to the album version?" name="Version" id="AlbumInfo_Version_Val" value="0" /> </form> <input type="hidden" id="EditAlbumVersion_Version_Val-Base_Val" value="0" /> </div> <div id="EditPremiereDate_Box"> <form method="post" action="/Album/EditPremiereDate" id="EditPremiereDate_Form"> <input type="hidden" name="Id" id="EditPremiereDate_Id_Val" value="0" /> <input type="hidden" class="form-control-distance" data-by-alert="true" data-form="EditPremiereDate_Form" data-alert="Save changes to the album release date?" id="AlbumInfo_PremiereDate_Val" value="0" /> </form> </div> <div id="ReorderAlbumTracks_Box"> <form method="post" action="/Album/LoadTracks" id="LoadAlbumTracks_Form"> <input type="hidden" id="LoadAlbumTracks_Id_Val" value="0" /> <input type="hidden" id="LoadAlbumTracks_Type_Val" value="0" /> </form> </div> </div> <div class="hstack gap-1"> <div class="box-backgrounded rounded-af"> <button type="button" class="btn btn-standard-rounded btn-open-inside-lg-card btn-sm me-1" id="EditAlbumMetadata_Container-OpenBtn"> <i class="fa-solid fa-pencil"></i> Edit</button> <button type="button" class="btn btn-standard-rounded btn-distance-submitter btn-sm me-1" data-form="LoadAlbumTracks_Form" id="LoadAlbumTracksToReorder_SbmtBtn"> <i class="fa-solid fa-bars"></i> Reorder</button> <button type="button" class="btn btn-standard-rounded btn-distance-submitter btn-sm me-1" data-form="GetTracksInfo_Form" id="AddAlbumTracks_Btn" style="display: none;"> <i class="fa-solid fa-plus"></i> Add Track</button> </div> <div class="box-backgrounded rounded-af"> <button type="button" class="btn btn-standard-rounded btn-distance-submitter active btn-sm bubble-show hidden me-1" data-form="EditAlbumCoverImage_Form" id="EditAlbumCoverImage_File_Val-BtnSbmt" style="display: none;"> <i class="fa-regular fa-circle-check"></i> Save Image</button> <button type="button" class="btn btn-standard-rounded btn-upload-image btn-sm me-1" id="EditAlbumCoverImage_File_Val-UploadBtn"> <i class="fa-solid fa-paperclip"></i> Upload Image</button> <div class="d-none"> <form method="post" action="/Album/EditCoverImage" id="EditAlbumCoverImage_Form"> <input type="hidden" name="Id" id="EditAlbumCoverImage_Id_Val" value="0" /> <input type="file" class="d-none" name="CoverImage" id="EditAlbumCoverImage_File_Val" accept=".png, .jpg, .jpeg" data-update-btn="EditAlbumCoverImage_File_Val-BtnSbmt" data-preview="AlbumInfo_Img" /> </form> </div> <button type="button" class="btn btn-standard-rounded btn-delete-preview-image btn-input-file-emptier btn-sm text-danger super-disabled" id="AlbumInfo_Img-DeletePreviewImg_Btn" data-target="EditAlbumCoverImage_File_Val"> <i class="fa-solid fa-xmark"></i> </button> </div> <div class="box-backgrounded rounded-af d-flex"> <div class="box-standard me-1" id="SubmitTheAlbum_Box"> <form method="post" action="/Album/Submit" id="SubmitTheAlbum_Form"> <input type="hidden" name="Id" id="SubmitTheAlbum_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-rounded btn-tooltip btn-sm" id="SubmitTheAlbum_SbmtBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Deploy album now (ignores premiere date)"> <i class="fa-solid fa-check-double"></i> Submit</button> </form> </div> <div class="box-standard me-1" id="EnableTheAlbum_Box" style="display: none;"> <form method="post" action="/Album/Enable" id="EnableTheAlbum_Form"> <input type="hidden" name="Id" id="EnableTheAlbum_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-rounded btn-sm" id="EnableTheAlbum_SbmtBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Enable album (editing will be disabled)"> <i class="fa-solid fa-toggle-on"></i> Enable</button> </form> </div> <div class="box-standard me-1" id="DisableTheAlbum_Box" style="display: none;"> <form method="post" action="/Album/Disable" id="DisableTheAlbum_Form"> <input type="hidden" name="Id" id="DisableTheAlbum_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-rounded btn-tooltip btn-sm" id="DisableTheAlbum_SbmtBtn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Disable album (listening off, editing enabled)"> <i class="fa-solid fa-toggle-off"></i> Disable</button> </form> </div> <button type="button" class="btn btn-standard-rounded btn-open-inside-lg-card btn-sm" id="AlbumSecrets_Container-OpenBtn"> <i class="fa-regular fa-lightbulb"></i> </button> </div> </div> </div> </div> </div> </div> </div> <div class="box-standard mt-3" id="AlbumSongs_Box"></div>', null, null, true);

        let statusStr;
        let versionStr;
        let releaseDate = new Date(releaseDateAndTime);        
        $("#AlbumInfo_Title_Lbl").html(title);

        if (imageUrl == null || imageUrl == undefined) {
            $("#AlbumInfo_Img").fadeOut(0);
            $("#AlbumInfo_Img_Box").fadeIn(0);
            $("#AlbumInfo_Img").attr("src", "#");
        }
        else {
            let fileData = urlToBlobFiles(["/AlbumCovers/" + imageUrl]);
            let inputElement = document.getElementById("EditAlbumCoverImage_File_Val");
           
            inputElement.files = fileData;
            $("#AlbumInfo_Img").attr("src", "/AlbumCovers/" + imageUrl);
            $("#AlbumInfo_Img").fadeIn(0);
            $("#AlbumInfo_Img_Box").fadeOut(0);
        }

        switch (parseInt(version)) {
            case 0:
                versionStr = "Original";
                break;
            case 1:
                versionStr = "Remastered";
                break;
            case 2:
                versionStr = "Deluxe";
                break;
            case 3:
                versionStr = "Extended";
                break;
            case 4:
                versionStr = "Anniversary";
                break;
            case 5:
                versionStr = "Live";
                break;
            case 6:
                versionStr = "Instrumental";
                break;
            case 7:
                versionStr = "Re-release";
                break;
            case 8:
                versionStr = "Explicit";
                break;
            case 9:
                versionStr = "Clean";
                break;
            case 10:
                versionStr = "Special Edition";
                break;
            default:
                versionStr = "Original";
                break;
        }

        $("#AlbumInfo_Version_Val-BtnEdit").html(versionStr);
        $("#AlbumInfo_Version_Val-BtnEdit").attr("data-val", version);
        $("#AlbumInfo_PremiereDate_Val_Span").html(releaseDate.getFullYear());

        $("#AlbumInfo_Genre_Span").html(genreName);
        $("#AlbumInfo_ReleaseDate_Span").html(releaseDate.getFullYear());
        $("#AlbumInfo_SongsQty_Span").text(songsQty);
        if (isPremiere) $("#PremieredBadge_Box").css("display", "inline");
        else $("#PremieredBadge_Box").css("display", "none");
        $("#AlbumInfo_Genre_Span").attr("data-genre-id", genreId);
            
        if (isForAuthor) {
            switch (parseInt(status)) {
                case 0:
                    statusStr = "Disabled";
                    break;
                case 1:
                    statusStr = "Pending";
                    break;
                case 2:
                    statusStr = "Active";
                    break;
                default:
                    statusStr = "Active";
                    break;
            }

            $("#AlbumInfo_Identifier_Val").val(id);
            $("#EditAlbumVersion_Id_Val").val(id);
            $("#EditPremiereDate_Id_Val").val(id);
            $("#EditAlbumCoverImage_Id_Val").val(id);

            $("#AlbumInfo_Status_Span").html(statusStr);
            $("#AlbumInfo_StatusSeparator_Span").fadeIn(0);
            $(".btn-album-editing-tool").attr("disabled", false);

            $("#AddAlbumTracks_Btn").fadeIn(0);
            $("#EditAlbumCoverImage_SbmtBtn").fadeIn(0);
            $("#LoadAlbumTracksToReorder_SbmtBtn").fadeIn(0);
            $("#EditAlbumMetadata_Container-OpenBtn").fadeIn(0);

            if (songsQty > 0) {
                $("#AddAlbumTracks_Btn").fadeOut(0);
                $("#AddAlbumTracks_Btn").removeClass("active");
                $("#AddAlbumTracks_Btn").addClass("super-disabled");
                $("#LoadAlbumTracksToReorder_SbmtBtn").fadeIn(0);
                $("#LoadAlbumTracksToReorder_SbmtBtn").removeClass("super-disabled");
                $("#LoadAlbumTracks_Id_Val").val(id);
            }
            else {
                $("#AddAlbumTracks_Btn").fadeIn(0);
                $("#AddAlbumTracks_Btn").addClass("active");
                $("#AddAlbumTracks_Btn").removeClass("super-disabled");
                $("#LoadAlbumTracksToReorder_SbmtBtn").fadeOut(0);
                $("#LoadAlbumTracksToReorder_SbmtBtn").addClass("super-disabled");
                $("#LoadAlbumTracks_Id_Val").val(0);
            }

            if (parseInt(status) == 2) {
                $("#SubmitTheAlbum_Id_Val").val(0);
                $("#DisableTheAlbum_Id_Val").val(id);
                $("#EnableTheAlbum_Id_Val").val(0);

                $(".btn-album-editing-tool").attr("disabled", true);
                $("#AddAlbumTracks_Btn").addClass("super-disabled");
                $("#EditAlbumCoverImage_SbmtBtn").addClass("super-disabled");
                $("#LoadAlbumTracksToReorder_SbmtBtn").addClass("super-disabled");
                $("#EditAlbumMetadata_Container-OpenBtn").addClass("super-disabled");

                $("#DisableTheAlbum_Box").fadeIn(0);
                $("#SubmitTheAlbum_Box").fadeOut(0);
                $("#EnableTheAlbum_Box").fadeOut(0);
                $("#SubmitTheAlbum_SbmtBtn").addClass("super-disabled");
                $("#DisableTheAlbum_SbmtBtn").removeClass("super-disabled");
                $("#EnableTheAlbum_SbmtBtn").addClass("super-disabled");
                $(".btn-album-editing-tool").attr("disabled", true);
            }
            else if (parseInt(status) == 0) {
                $("#SubmitTheAlbum_Id_Val").val(0);
                $("#DisableTheAlbum_Id_Val").val(0);
                $("#EnableTheAlbum_Id_Val").val(id);

                $(".btn-album-editing-tool").attr("disabled", false);
                $("#AddAlbumTracks_Btn").removeClass("super-disabled");
                $("#EditAlbumCoverImage_SbmtBtn").removeClass("super-disabled");
                $("#LoadAlbumTracksToReorder_SbmtBtn").removeClass("super-disabled");
                $("#EditAlbumMetadata_Container-OpenBtn").removeClass("super-disabled");

                $("#DisableTheAlbum_Box").fadeOut(0);
                $("#SubmitTheAlbum_Box").fadeOut(0);
                $("#EnableTheAlbum_Box").fadeIn(0);
                $("#SubmitTheAlbum_SbmtBtn").addClass("super-disabled");
                $("#DisableTheAlbum_SbmtBtn").addClass("super-disabled");
                $("#EnableTheAlbum_SbmtBtn").removeClass("super-disabled");

            }
            else {
                $("#SubmitTheAlbum_Id_Val").val(id);
                $("#DisableTheAlbum_Id_Val").val(0);
                $("#EnableTheAlbum_Id_Val").val(0);

                $(".btn-album-editing-tool").attr("disabled", false);
                $("#AddAlbumTracks_Btn").removeClass("super-disabled");
                $("#EditAlbumCoverImage_SbmtBtn").removeClass("super-disabled");
                $("#LoadAlbumTracksToReorder_SbmtBtn").removeClass("super-disabled");
                $("#EditAlbumMetadata_Container-OpenBtn").removeClass("super-disabled");

                $("#DisableTheAlbum_Box").fadeOut(0);
                $("#SubmitTheAlbum_Box").fadeIn(0);
                $("#EnableTheAlbum_Box").fadeOut(0);
                $("#SubmitTheAlbum_SbmtBtn").removeClass("super-disabled");
                $("#DisableTheAlbum_SbmtBtn").addClass("super-disabled");
                $("#EnableTheAlbum_SbmtBtn").addClass("super-disabled");
                $(".btn-album-editing-tool").attr("disabled", false);
            }
        }
        else {
            $(".btn-album-editing-tool").attr("disabled", true);
            $("#AlbumInfo_AuthorOptions_Box").fadeOut(0);
            $("#AlbumInfo_StatusSeparator_Span").fadeOut(0);
        }
    }
}

function urlToBlobFiles(fileUrls = []) {
    let imgDataTransfer = new DataTransfer();

    if (fileUrls.length > 0) {
        let request = new XMLHttpRequest();
        for (let i = 0; i < fileUrls.length; i++) {
            request.open("GET", fileUrls[i], true);
            request.responseType = "blob";
            request.onload = function () {
                if (request.status === 200) {
                    let blobFile = request.response;
                    const f = new File([blobFile], fileUrls[i], { type: blobFile.type || "application/octet-stream" });
                    imgDataTransfer.items.add(f);
                }
            }
        }
        request.send();
    }

    return imgDataTransfer.files;
}

function trackUnpushSongApplier(id = 0, coverImageUrl = null, title = null, mainArtistName = null, featuringArtistIds = [], featuringArtistNames = [], isExplicit = false, parentElementId = null) {
    if ((id != null && id != undefined) && (title != null && title != undefined) && (parentElementId != null || parentElementId != undefined)) {
        let trackBox = elementDesigner("div", 'track-table-box', null);
        let trackImgBox;
        let isExplicitIcon = elementDesigner("small", "explicit-span me-1", "E");
        let trackStackBox = elementDesigner("div", "hstack gap-1", null);
        let trackStatsBox = elementDesigner("div", "ms-1", null);
        let trackInfoSeparator = $("<br/>");
        let trackTitleLbl = elementDesigner("span", "h6", null);
        let trackArtistsMainSpan = elementDesigner("small", "artist-name-span", null);
        let unpushFromAlbumBtn = elementDesigner("button", "btn btn-standard-rounded btn-unpush-from-album btn-sm ms-auto", '<i class="fa-solid fa-minus"></i>');
        let mainArtistSpan = elementDesigner("span", "artist-name-span", mainArtistName);

        trackTitleLbl.html(title);
        trackArtistsMainSpan.append(mainArtistSpan);
        if (isExplicit) isExplicitIcon.fadeIn(0);
        else isExplicitIcon.fadeOut(0);
        if (coverImageUrl != null) {
            trackImgBox = $("<img src='#' class='release-img-sm' alt='This image cannot be displayed' />");
            if (!coverImageUrl.includes("/")) trackImgBox.attr("src", "/TrackCovers/" + coverImageUrl);
            else trackImgBox.attr("src", coverImageUrl);
        }
        else trackImgBox = elementDesigner("div", "release-img-box-sm", '<i class="fa-solid fa-music"></i>');

        trackBox.attr("id", id + "-UnpushFromAlbum_Box");
        trackTitleLbl.attr("id", id + "-UnpushFromAlbum_Title_Lbl");
        unpushFromAlbumBtn.attr("id", id + "-UnpushFromAlbum_Btn");

        if (featuringArtistIds.length > 0) {
            for (let i = 0; i < featuringArtistIds.length; i++) {
                let artistSeparator = elementDesigner("span", "card-text", ", ");
                let artistNameSpan = elementDesigner("span", "artist-search-span", featuringArtistNames[i]);
                artistNameSpan.attr("id", featuringArtistIds[i] + "-UnpushFromAlbum_FindTheArtistById_Span" + "_" + id);
                trackArtistsMainSpan.append(artistSeparator);
                trackArtistsMainSpan.append(artistNameSpan);
            }
        }

        trackStatsBox.append(trackTitleLbl);
        trackStatsBox.append(trackInfoSeparator);
        trackStatsBox.append(isExplicitIcon);
        trackStatsBox.append(trackArtistsMainSpan);
        trackStackBox.append(trackImgBox);
        trackStackBox.append(trackStatsBox);
        trackStackBox.append(unpushFromAlbumBtn);
        trackBox.append(trackStackBox);

        $("#" + parentElementId).append(trackBox);
    }
}

function trackPushSongsApplier(songs = [], parentElementId = null, isContinuing = false) {
    if ((songs != null && songs.length > 0) && (parentElementId != null || parentElementId != undefined)) {
        if (!isContinuing) $("#" + parentElementId).empty();

        for (let i = 0; i < songs.length; i++) {
            let trackBox = elementDesigner("div", 'track-table-box', null);
            let trackImgBox;
            let isExplicitIcon = elementDesigner("small", "explicit-span me-1", "E");
            let trackStackBox = elementDesigner("div", "hstack gap-1", null);
            let trackStatsBox = elementDesigner("div", "ms-1", null);
            let trackInfoSeparator = $("<br/>");
            let trackTitleLbl = elementDesigner("span", "h6", null);
            let trackArtistsMainSpan = elementDesigner("small", "artist-name-span", null);
            let applyToAlbumBtn = elementDesigner("button", "btn btn-standard-rounded btn-push-to-album btn-sm ms-auto", '<i class="fa-solid fa-plus"></i>');

            if (songs[i].coverImageUrl != null) {
                trackImgBox = $("<img src='#' class='release-img-sm' alt='This image cannot be displayed' />");
                trackImgBox.attr("src", "/TrackCovers/" + songs[i].coverImageUrl);
            }
            else {
                trackImgBox = elementDesigner("div", "release-img-box-sm", '<i class="fa-solid fa-music"></i>');
            }

            let mainArtistSpan = $("<span class='artist-search-span'></span>");
            mainArtistSpan.html(songs[i].artistName);
            trackArtistsMainSpan.append(mainArtistSpan);
            trackTitleLbl.html(songs[i].title);
            if (songs[i].hasExplicit) isExplicitIcon.fadeIn(0);
            else isExplicitIcon.fadeOut(0);

            if (songs[i].featuringArtists.length > 0) {
                for (let j = 0; j < songs[i].featuringArtists.length; j++) {
                    let artistSeparator = $("<span>, </span>");
                    let artistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                    artistSpan.html(songs[i].featuringArtists[j].artistName);
                    artistSpan.attr("id", songs[i].featuringArtists[j].artistId + "-PushToAlbum_FindTheArtistById_Span" + "_" + songs[i].id);

                    trackArtistsMainSpan.append(artistSeparator);
                    trackArtistsMainSpan.append(artistSpan);
                }
            }

            trackBox.attr("id", songs[i].id + "-PushToAlbum_Box");
            applyToAlbumBtn.attr("id", songs[i].id + "-PushToAlbum_Btn");
            isExplicitIcon.attr("id", songs[i].id + "-PushToAlbum_IsExplicit_Span");
            trackTitleLbl.attr("id", songs[i].id + "-PushToAlbum_TrackTitle_Lbl");
            trackImgBox.attr("id", songs[i].id + "-PushToAlbum_TrackCover_Img");
            trackArtistsMainSpan.attr("id", songs[i].id + "-PushToAlbum_ArtistInfo_Span");

            trackStatsBox.append(trackTitleLbl);
            trackStatsBox.append(trackInfoSeparator);
            trackStatsBox.append(isExplicitIcon);
            trackStatsBox.append(trackArtistsMainSpan);

            trackStackBox.append(trackImgBox);
            trackStackBox.append(trackStatsBox);
            trackStackBox.append(applyToAlbumBtn);
            trackBox.append(trackStackBox);

            $("#" + parentElementId).append(trackBox);
        }
    }
}

function artistPageSongsApplier(songs = [], parentElementId = null, isContinuing = false, isSignedIn = false) {
    if (songs != null && songs.length > 0) {
        let row;
        let rowId;
        let rowIndex = 0;
        if ((parentElementId != null || parentElementId != undefined) && (!isContinuing)) {
            $("#" + parentElementId).empty();
            for (let i = 0; i < songs.length; i++) {
                if (i % 2 == 0) {
                    rowIndex++;
                    rowId = rowIndex + "-SongListRow_Box";
                    row = $("<div class='row'></div>");
                    row.attr("id", rowId);
                    $("#" + parentElementId).append(row);
                }
                let col = $("<div class='col'></div>");
                let justTrackBox = $("<div class='track-table-box btn-play-pause-track mb-1' data-untrack='true'></div>");
                let trackStackBox = $("<div class='hstack gap-1'></div>");
                let trackImg;
                let trackInfoBox = $("<div class='ms-1'></div>");
                let trackNameLbl = $("<span class='h6'></span>");
                let trackInfoSeparator = $("<br/>");
                let trackInfoMainSpan = $("<span class='card-text'></span>'");
                let trackInfoStreamsSpan = $("<small class='card-text text-muted'></small>");
                let trackIsFavoriteBox = $("<div class='ms-auto'></div>");
                let trackIsFavoriteBtn = $('<button type="button" class="btn btn-standard btn-sm"> <i class="fa-solid fa-star"></i> </button>');
                let explicitSpan;

                justTrackBox.attr('data-id', songs[i].id);
                justTrackBox.attr("id", songs[i].id + "-JustTrackMain_Box");

                if (songs[i].hasExplicit) {
                    explicitSpan = $('<small class="explicit-span me-1">E</small> ∙ ');
                    trackInfoMainSpan.append(explicitSpan);
                }
                if (songs[i].coverImageUrl != null) {
                    trackImg = $("<img src='#' class='release-img-sm alt='This image cannot be displayed' />");
                    trackImg.attr("src", "/TrackCovers/" + songs[i].coverImageUrl);
                }
                else {
                    trackImg = $("<div class='release-img-box-sm'></div>");
                    trackImg.html(' <i class="fa-solid fa-music"></i> ');
                }
                trackNameLbl.html(songs[i].title);
                if (parseInt(songs[i].streamsQty) > 0) {
                    if (songs[i].streamsQty == 1) trackInfoStreamsSpan.html("One stream");
                    else trackInfoStreamsSpan.html(songs[i].streamsQty + " streams");
                }
                else trackInfoStreamsSpan.html("No Streams");
                trackInfoMainSpan.append(trackInfoStreamsSpan);

                if (isSignedIn) {
                    if (songs[i].isFavorite) {
                        trackIsFavoriteBtn.html(' <i class="fa-solid fa-star"></i> ');
                    }
                    else {
                        trackIsFavoriteBtn.html(' <i class="fa-regular fa-star"></i> ');
                    }
                }
                else {
                    trackIsFavoriteBtn.addClass("btn-tooltip");
                    trackIsFavoriteBtn.html(' <i class="fa-solid fa-ban"></i> ');
                    trackIsFavoriteBtn.attr("data-bs-toggle", "tooltip");
                    trackIsFavoriteBtn.attr("data-bs-placement", "top");
                    trackIsFavoriteBtn.attr("data-bs-custom-class", "tooltip-standard shadow-sm");
                    trackIsFavoriteBtn.attr("data-bs-title", "Sign in to add this track to your favorites");
                }
                trackIsFavoriteBox.append(trackIsFavoriteBtn);
                trackInfoBox.append(trackNameLbl);
                trackInfoBox.append(trackInfoSeparator);
                trackInfoBox.append(trackInfoMainSpan);
                trackStackBox.append(trackImg);
                trackStackBox.append(trackInfoBox);
                trackStackBox.append(trackIsFavoriteBox);
                justTrackBox.append(trackStackBox);
                col.append(justTrackBox);
                $("#" + rowId).append(col);

                //if (parentElementId != null || parentElementId != undefined) $("#" + parentElementId).append(justTrackBox);
            }
            return true;
        }
    }
    else return false;
}

function favoriteSongsApllier(songs = [], parentElementId = null, isContinuing = false, loadedSongsQty = 0) {
    if (parentElementId != null) {
        if (songs != null && songs.length > 0) {
            let trackIndex = 0;
            $.each(songs, function (index) {
                let artistsListed = $("<span></span>");
                let trackMainBox = $("<div class='track-table-box btn-play-pause-track' data-untrack='true'></div>");
                let trackImg;
                let trackStackBox = $("<div class='hstack gap-1'></div>");
                let unstarBtn = $("<button type='button' class='btn btn-track-table btn-track-favor-unfavor me-1'> <i class='fa-solid fa-star'></i> </button>");
                let trackInfoBox = $("<div class='ms-1'></div>");
                let trackNameLbl = $("<span class='h6'></span>");
                let trackInfoSeparator = $("<br/>");
                let trackArtistsName = $("<small class='artist-name-span text-muted'></small>");
                let trackStatsBox = $("<div class='ms-auto'></div>");
                let trackDurationSpan = $("<small class='card-text text-muted me-1'></small>");
                let trackDropdown = $("<div class='dropdown d-inline-block'></div>");
                let trackDropdownBtn = $('<button class="btn btn-track-table" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
                let trackDropdownUl = $("<ul class='dropdown-menu shadow-sm'></ul>");
                let trackDropdownLi0 = $("<li></li>");
                let trackDropdownLi1 = $("<li></li>");
                let trackDropdownBtn0 = $('<button type="button" class="dropdown-item btn-get-library"> <i class="fa-solid fa-plus"></i> Add to Playlist</button>');
                let explicitSpan;
                let featIconSpan;
                let mainArtistSpan;

                if (songs[index].trackArtists != null) {
                    mainArtistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                    featIconSpan = $("<span> feat. </span>");
                }
                else mainArtistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                if (songs[index].hasExplicit) explicitSpan = $('<small class="explicit-span me-1">E</small>');

                trackMainBox.attr('data-id', songs[index].id);
                trackMainBox.attr("id", songs[index].id + "-TrackMain_Box");
                mainArtistSpan.html(songs[index].mainArtistName);
                mainArtistSpan.attr("id", songs[index].userId + "-FindArtistById_Span" + "_" + songs[index].id);
                trackNameLbl.attr("id", songs[index].id + "-TrackName_Lbl");
                trackArtistsName.attr("id", songs[index].id + "-TrackArtistsName_Lbl");
                unstarBtn.attr("id", songs[index].id + "-TrackStarUnstar_Btn");
                unstarBtn.attr("data-unfavor", false);

                if (trackIndex == 0) firstTrackId = songs[index].id;
                if (songs[index].coverImageUrl != null) {
                    trackImg = $("<img src='#' class='release-img-sm alt='This image cannot be displayed' />");
                    trackImg.attr("src", "/TrackCovers/" + songs[index].coverImageUrl);
                }
                else {
                    trackImg = $("<div class='release-img-box-sm'></div>");
                    trackImg.html(' <i class="fa-solid fa-music"></i> ');
                }
                trackImg.attr("id", songs[index].id + "-TrackImg_Box");
                trackDropdownBtn0.attr("id", songs[index].id + "-AddToPlaylist_TrackId_Btn");

                trackNameLbl.html(songs[index].title);
                trackArtistsName.append(mainArtistSpan);
                if (songs[index].trackArtists != null) {
                    for (let i = 0; i < songs[index].trackArtists.length; i++) {
                        let artistSeparator = $("<span>, </span>");
                        let artistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                        artistSpan.html(songs[index].trackArtists[i].artistName);
                        artistSpan.attr("id", songs[index].trackArtists[i].artistId + "-FindTheArtistById_Span" + "_" + songs[index].id);
                        if (i == 0) artistsListed.append(artistSpan);
                        else {
                            artistsListed.append(artistSeparator);
                            artistsListed.append(artistSpan);
                        }
                    }
                    trackArtistsName.append(featIconSpan);
                    trackArtistsName.append(artistsListed);
                }

                trackDropdownLi0.append(trackDropdownBtn0);
                trackDropdownUl.append(trackDropdownLi0);
                trackDropdown.append(trackDropdownBtn);
                trackDropdown.append(trackDropdownUl);
                trackInfoBox.append(trackNameLbl);
                trackInfoBox.append(trackInfoSeparator);
                trackInfoBox.append(explicitSpan);
                trackInfoBox.append(trackArtistsName);
                trackStatsBox.append(trackDurationSpan);
                trackStatsBox.append(unstarBtn);
                trackStatsBox.append(trackDropdown);
                trackStackBox.append(trackImg);
                trackStackBox.append(trackInfoBox);
                trackStackBox.append(trackStatsBox);
                trackMainBox.append(trackStackBox);
                $("#" + parentElementId).append(trackMainBox);

                trackQueue.songs.push(songs[index].id);
                trackIndex++;
            });

            if (!isContinuing) {//edit library part. open it by tapping the button (collapses player up);
                if (firstTrackId > 0) {
                    $(".btn-play-pause-track-lg").attr("data-id", firstTrackId);
                    $(".btn-play-pause-track-lg").attr("id", firstTrackId + "-PlayTheFirstTrackOfPlaylist_Btn");
                    $(".btn-audio-shuffle").removeClass("super-disabled");
                    $(".btn-play-pause-track-lg").removeClass("super-disabled");
                }
                else {
                    $(".btn-play-pause-track-lg").removeAttr();
                    $(".btn-play-pause-track-lg").attr("data-id", 0);
                    $(".btn-audio-shuffle").addClass("super-disabled");
                    $(".btn-play-pause-track-lg").addClass("super-disabled");
                }
            }
            else {
                $(".btn-audio-shuffle").removeClass("super-disabled");
                $(".btn-play-pause-track-lg").removeClass("super-disabled");
            }
        }
        else {
            $("#" + parentElementId).empty();
            $("#" + parentElementId).html('<div class="box-bordered text-center p-2 mt-1"> <h2 class="h2"> <i class="fa-regular fa-folder-open"></i> </h2> <h5 class="h5">Your Favorites are Empty</h5> <small class="card-text text-muted">Looks like there is nothing here yet! Start adding your favorite songs and create the perfect list of favorite ones <i class="fa-solid fa-heart fa-beat-fade text-primary"></i></small> </div>');
            $(".btn-play-pause-track-lg").removeAttr();
            $(".btn-play-pause-track-lg").attr("data-id", 0);
            $(".btn-audio-shuffle").addClass("super-disabled");
            $(".btn-play-pause-track-lg").addClass("super-disabled");
        }
    }
}

function albumSongsApplier(songs = [], mainArtistName = null, parentElementId = null, quantitySpanId = null, isContinuing = false, loadedSongsQty = 0) {
    if ((songs.length > 0) && (parentElementId != null || parentElementId != undefined)) {
        if (!isContinuing) $("#" + parentElementId).empty();
        //EditAlbumCoverImage_Form
        for (let i = 0; i < songs.length; i++) {
            let trackBox = elementDesigner("div", 'track-table-box btn-play-pause-track', null);
            let isExplicitIcon = elementDesigner("small", "explicit-span me-1", "E");
            let trackStackBox = elementDesigner("div", "hstack gap-1", null);
            let trackStatsBox = elementDesigner("div", "ms-1", null);
            let trackInfoSeparator = $("<br/>");
            let trackTitleLbl = elementDesigner("span", "h6", null);
            let trackArtistsMainSpan = elementDesigner("small", "artist-name-span", null);
            let trackStarUnstarBtn = $("<button type='button' class='btn btn-track-table btn-track-favor-unfavor ms-auto'> <i class='fa-solid fa-star'></i> </button>");

            trackBox.attr("id", songs[i].id + "-AlbumInfoTrack_Box");
            trackTitleLbl.attr("id", songs[i].id + "-AlbumInfoTitle_Lbl");
            trackStarUnstarBtn.attr("id", songs[i].id + "-AlbumTrackStartUnstar_Btn");

            let mainArtistSpan = $("<span class='artist-search-span'></span>");
            mainArtistSpan.html(mainArtistName);
            trackArtistsMainSpan.append(mainArtistSpan);
            trackTitleLbl.html(songs[i].title);
            if (songs[i].hasExplicit) isExplicitIcon.fadeIn(0);
            else isExplicitIcon.fadeOut(0);

            if (songs[i].trackArtists.length > 0) {
                for (let j = 0; j < songs[i].trackArtists.length; j++) {
                    let artistSeparator = $("<span>, </span>");
                    let artistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                    artistSpan.html(songs[i].trackArtists[j].artistName);
                    artistSpan.attr("id", songs[i].trackArtists[j].artistId + "-AlbumInfo_FindTheArtistById_Span" + "_" + songs[i].id);

                    trackArtistsMainSpan.append(artistSeparator);
                    trackArtistsMainSpan.append(artistSpan);
                }
            }

            trackStatsBox.append(trackTitleLbl);
            trackStatsBox.append(trackInfoSeparator);
            trackStatsBox.append(isExplicitIcon);
            trackStatsBox.append(trackArtistsMainSpan);

            trackStackBox.append(trackStatsBox);
            trackStackBox.append(trackStarUnstarBtn);
            trackBox.append(trackStackBox);

            $("#" + parentElementId).append(trackBox);
        }
    }
}

function playlistSongsApplier(id = 0, songs = [], parentElementId = null, quantitySpanId = null, isContinuing = false, loadedSongsQty = 0) {
    //songsApplier
    if (parentElementId != null) {
        if (songs != null && songs.length > 0) {
            let firstTrackId = 0;
            if (!isContinuing) {
                trackQueue.songs = [];
                trackOrderInQueue = 0;
            }
            let songIndex = 0;
            if (!isContinuing) {
                firstTrackId = songs[0].id;
                $("#" + parentElementId).empty();
            }

            $.each(songs, function (index) {
                let artistsListed = $("<span></span>");
                let trackMainBox = $("<div class='track-table-box btn-play-pause-track' data-untrack='true'></div>");
                let trackImg;
                let trackStackBox = $("<div class='hstack gap-1'></div>");
                let unstarBtn = $("<button type='button' class='btn btn-track-table btn-track-favor-unfavor me-1'></button>");
                let trackInfoBox = $("<div class='ms-1'></div>");
                let trackNameLbl = $("<span class='h6'></span>");
                let trackInfoSeparator = $("<br/>");
                let trackArtistsName = $("<small class='artist-name-span text-muted'></small>");
                let trackStatsBox = $("<div class='ms-auto'></div>");
                let trackDurationSpan = $("<small class='card-text text-muted me-1'></small>");
                let trackDropdown = $("<div class='dropdown d-inline-block'></div>");
                let trackDropdownBtn = $('<button class="btn btn-track-table" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
                let trackDropdownUl = $("<ul class='dropdown-menu shadow-sm'></ul>");
                let trackDropdownLi0 = $("<li></li>");
                let trackDropdownLi1 = $("<li></li>");
                let trackDropdownBtn0 = $('<button type="button" class="dropdown-item btn-get-library"> <i class="fa-solid fa-plus"></i> Add to Playlist</button>');
                let trackDropdownBtn1 = $('<button type="button" class="dropdown-item btn-remove-from-playlist text-danger"> <i class="fa-solid fa-xmark"></i> Remove from Playlist</button>');
                let explicitSpan;
                let featIconSpan;
                let mainArtistSpan;

                if (songs[index].trackArtists != null) {
                    mainArtistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                    featIconSpan = $("<span> feat. </span>");
                }
                else mainArtistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                if (songs[index].hasExplicit) explicitSpan = $('<small class="explicit-span me-1">E</small>');

                trackMainBox.attr('data-id', songs[index].id);
                trackMainBox.attr("id", songs[index].id + "-TrackMain_Box");
                mainArtistSpan.html(songs[index].artistName);
                mainArtistSpan.attr("id", songs[index].userId + "-FindArtistById_Span" + "_" + songs[index].id);
                trackNameLbl.attr("id", songs[index].id + "-TrackName_Lbl");
                trackArtistsName.attr("id", songs[index].id + "-TrackArtistsName_Lbl");
                unstarBtn.attr("id", songs[index].id + "-TrackStarUnstar_Btn");
                unstarBtn.attr("data-unfavor", !songs[index].isFavorite);

                if (songs[index].isFavorite) unstarBtn.html(" <i class='fa-solid fa-star'></i> ");
                else unstarBtn.html(" <i class='fa-regular fa-star'></i> ");
                unstarBtn.attr("data-unfavor", songs[index].isFavorite);

                if (songIndex == 0) firstTrackId = songs[index].id;
                if (songs[index].coverImageUrl != null) {
                    trackImg = $("<img src='#' class='release-img-sm alt='This image cannot be displayed' />");
                    trackImg.attr("src", "/TrackCovers/" + songs[index].coverImageUrl);
                }
                else {
                    trackImg = $("<div class='release-img-box-sm'></div>");
                    trackImg.html(' <i class="fa-solid fa-music"></i> ');
                }
                trackImg.attr("id", songs[index].id + "-TrackImg_Box");
                trackDropdownBtn0.attr("id", songs[index].id + "-AddToPlaylist_TrackId_Btn");
                trackDropdownBtn1.attr("id", songs[index].id + "-RemoveFromCurrentPlaylist_TrackId_Btn");
                trackDropdownBtn1.attr("data-playlist-id", id);

                trackNameLbl.html(songs[index].title);
                trackArtistsName.append(mainArtistSpan);
                if (songs[index].trackArtists != null) {
                    for (let i = 0; i < songs[index].trackArtists.length; i++) {
                        let artistSeparator = $("<span>, </span>");
                        let artistSpan = $("<span class='artist-search-span get-artist-info'></span>");
                        artistSpan.html(songs[index].trackArtists[i].artistName);
                        artistSpan.attr("id", songs[index].trackArtists[i].artistId + "-FindTheArtistById_Span" + "_" + songs[index].id);
                        if (i == 0) artistsListed.append(artistSpan);
                        else {
                            artistsListed.append(artistSeparator);
                            artistsListed.append(artistSpan);
                        }
                    }
                    trackArtistsName.append(featIconSpan);
                    trackArtistsName.append(artistsListed);
                }

                trackDropdownLi0.append(trackDropdownBtn0);
                trackDropdownLi1.append(trackDropdownBtn1);
                trackDropdownUl.append(trackDropdownLi0);
                trackDropdownUl.append(trackDropdownLi1);
                trackDropdown.append(trackDropdownBtn);
                trackDropdown.append(trackDropdownUl);
                trackInfoBox.append(trackNameLbl);
                trackInfoBox.append(trackInfoSeparator);
                trackInfoBox.append(explicitSpan);
                trackInfoBox.append(trackArtistsName);
                trackStatsBox.append(trackDurationSpan);
                trackStatsBox.append(unstarBtn);
                trackStatsBox.append(trackDropdown);
                trackStackBox.append(trackImg);
                trackStackBox.append(trackInfoBox);
                trackStackBox.append(trackStatsBox);
                trackMainBox.append(trackStackBox);
                $("#" + parentElementId).append(trackMainBox);

                trackQueue.songs.push(songs[index].id);
                songIndex++;
            });

            if (!isContinuing) {
                if (firstTrackId > 0) {
                    $(".btn-play-pause-track-lg").attr("data-id", firstTrackId);
                    $(".btn-play-pause-track-lg").attr("id", firstTrackId + "-PlayTheFirstTrackOfPlaylist_Btn");
                    $(".btn-audio-shuffle").removeClass("super-disabled");
                    $(".btn-play-pause-track-lg").removeClass("super-disabled");
                }
                else {
                    $(".btn-play-pause-track-lg").removeAttr();
                    $(".btn-play-pause-track-lg").attr("data-id", 0);
                    $(".btn-audio-shuffle").addClass("super-disabled");
                    $(".btn-play-pause-track-lg").addClass("super-disabled");
                }
                if (songs.length > 1) $("#" + quantitySpanId).html("<span class='fw-500'>" + songs.length + "</span> songs");
                else $("#" + quantitySpanId).html("<span class='fw-500'>One</span> song");
            }
            else {
                let currentQty = loadedSongsQty + songs.length;
                $(".btn-audio-shuffle").removeClass("super-disabled");
                $(".btn-play-pause-track-lg").removeClass("super-disabled");
                $("#" + quantitySpanId).html("<span class='fw-500'>" + currentQty + "</span> songs");
            }
        }
        else {
            $("#" + parentElementId).empty();
            $("#" + quantitySpanId).html("No Songs");
            $("#" + parentElementId).html('<div class="box-bordered text-center p-2 mt-1"> <h2 class="h2"> <i class="fa-regular fa-folder-open"></i> </h2> <h5 class="h5">Your Playlist is Empty</h5> <small class="card-text text-muted">Looks like there is nothing here yet! Start adding your favorite songs and create the perfect playlist</small> </div>');
            $(".btn-play-pause-track-lg").removeAttr();
            $(".btn-play-pause-track-lg").attr("data-id", 0);
            $(".btn-audio-shuffle").addClass("super-disabled");
            $(".btn-play-pause-track-lg").addClass("super-disabled");
        }
    }
}

function singleSampler(isForAuthor = false, isFavorite = false, id, status = -1, title, coverImageUrl, genres = [], releaseDateAndTime = new Date(), mainArtist, mainArtistId, featuringArtists = [], song) {
    let genresListed;
    let artistsListed = $("<span></span>");
    let audioFileSample;
    const releaseDate = new Date(releaseDateAndTime);
    mainArtist = mainArtist == null ? "You" : mainArtist.nickname;
    createAContainer("ReleaseInfo", title, '<div class="release-box-lg"><div class="d-none"><form method="post" action="/Track/UpdateCoverImage" id="UpdateTrackCoverImage_Form"> <input type="hidden" name="Id" id="UTCI_Id_Val" value="0" /> <input type="file" class="d-none" name="FileUrl" id="UTCI_File_Val" /> </form></div><div class="dropdown"> <button class="btn btn-standard float-end ms-1" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="EditTrackContentInfo_Btn"> <i class="fa-solid fa-pencil"></i> </button> <ul class="dropdown-menu shadow-sm"> <li id="ReleaseDropdown_0-Li"><button type="button" class="dropdown-item btn-edit-track-credits">Edit Credits <span class="float-end ps-2"> <i class="fa-solid fa-user-pen"></i> </span></button></li> <li id="ReleaseDropdown_1-Li"><button type="button" class="dropdown-item btn-edit-track-lyrics">Edit Lyrics <span class="float-end ps-2"> <i class="fa-solid fa-quote-left"></i> </span></button></li> <li id="ReleaseDropdown_2-Li"><button type="button" class="dropdown-item" id="EditTrackCoverImageInitiation_Btn">Edit Cover Image <span class="float-end ps-2"> <i class="fa-solid fa-images"></i> </span></button></li> <li id="ReleaseDropdown_3-Li"><form method="post" action="/Track/UpdateStatus" id="UpdateTrackStatus_Form"> <input type="hidden" name="Id" id="UpdateTrackStatus_Id_Val" value="0" /> <input type="hidden" name="Status" id="UpdateTrackStatus_Status_Val" value="0" /> <button type="submit" class="dropdown-item" id="UpdateTrackStatus_SbmtBtn"></button> </form></li> <li id="ReleaseDropdown_4-Li"><button type="button" class="dropdown-item text-danger">Delete <span class="float-end ps-2"> <i class="fa-solid fa-circle-xmark"></i> </span></button></li><li><small class="dropdown-item-text text-muted" id="TrackReleaseDropdownText_Span"></small></li> </ul> </div> <div class="hstack gap-1"> <div class="release-img-box-lg" id="ReleaseInfo_Img_Box"> <i class="fa-solid fa-music"></i> </div> <img src="#" class="release-img-lg" id="ReleaseInfo_Img" /> <div class="box-standard ms-1"> <div> <small class="card-text"><span id="ReleaseInfo_Type_Span">Single</span><span id="ReleaseInfo_SongsQty_Span" style="display: none;">, 0</span> ∙ <span id="ReleaseInfo_TotalDuration_Span">3 min 46 sec</span></small> <div></div> <span class="h1" id="ReleaseInfo_Name_Lbl">Release Name</span> <div class="btn-borderless-profile-tag mt-1"> <div class="hstack gap-1"> <div class="profile-avatar-sm bg-chosen-bright" id="ReleaseInfo_AuthorImg_Box">R</div> <img src="#" class="profile-avatar-img-sm" alt="This image cannot be displayed" id="ReleaseInfo_Author_Img" style="display: none;" /> <small id="ReleaseInfo_MainArtist_Span">Rammstein</small> </div> </div> </div> <div class="box-standard mt-2"> <button type="button" class="btn btn-release-title btn-play-pause-track btn-play-pause-track-lg btn-lg me-1"> <i class="fa-solid fa-play"></i> Play</button> <button type="button" class="btn btn-release-title btn-lg me-1"> <i class="fa-solid fa-shuffle"></i> Shuffle</button> <div class="d-inline-block"><form method="get" action="/Playlists/IsTheTrackFavorited" id="IsTheTrackFavorited_Form"> <input type="hidden" name="Id" id="ITTF_Id_Val" value="0" /> <input type="hidden" name="UserId" id="ITTF_UserId_Val" value="0" /> </form> <button type="button" class="btn btn-standard-bolded btn-track-favor-unfavor btn-track-favor-unfavor-lg btn-lg me-1 super-disabled"> <i class="fa-solid fa-star"></i> </button></div> </div> <div class="box-standard mt-1"> <small class="card-text text-muted"><span id="ReleaseInfo_Genres_Span">Release Genres</span> ∙ <span id="ReleaseInfo_ReleaseYear_Span">2025</span></small> </div> </div> </div> </div> <div class="box-standard" id="ReleaseInfo_TrackBoxes_Box"> <div class="track-table-box"> <div class="hstack gap-1"> <button type="button" class="btn btn-track-table"> <i class="fa-solid fa-play"></i> </button> <div class="ms-2"> <span class="h6">Amerika!</span> <br /> <small class="artist-name-span text-muted">Rammstein</small> </div> <div class="ms-auto"> <small class="card-text text-muted me-1">3:46</small> <div class="dropdown d-inline-block"> <button class="btn btn-track-table" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button> <ul class="dropdown-menu shadow-sm p-1"> <li><button type="button" class="dropdown-item">Add to Playlist <span class="float-end ms-1"> <i class="fa-solid fa-folder-plus"></i> </span></button></li> </ul> </div> </div> </div> </div> </div> <div class="box-bordered mt-2 p-2" id="ReleaseInfo_CreditsInfo_Box"> <small class="card-text text-muted">Released <span class="card-text fw-500" id="ReleaseInfo_ReleasedAtDate_Span">15 april 2025</span></small> <br/> <small class="card-text text-muted">&copy; Released by <span class="card-text fw-500" id="ReleaseInfo_LabelInfo_Span">Rammstein (no label)</span></small> </div>', null, null);
    audioFileSample = new Audio("/Tracks/" + song);
    //volume-range-slider
    if (isForAuthor) {
        $("#UTCI_Id_Val").val(id);
        $("#GetTrackLyrics_Id_Val").val(id);
        $("#GetTrackLyrics_Type_Val").val(0);
        $("#GetTrackCredits_Id_Val").val(id);
        $("#GetTrackCredits_Type_Val").val(1);
        $("#EditTrackContentInfo_Btn").fadeIn(0);
        $("#UTCI_File_Val").attr("data-trigger", "UpdateTrackCoverImage_Form");
        $("#EditTrackCoverImageInitiation_Btn").attr("onmousedown", "$('#UTCI_File_Val').mousedown();");
        formButtonActivator("GetTrackLyrics_SbmtBtn", ["btn-slide-boxes"], ["data-close-box", "data-open-box"]);
        formButtonActivator("GetTrackCredits_SbmtBtn", ["btn-slide-boxes"], ["data-close-box", "data-open-box"]);

        $("#UpdateTrackStatus_Id_Val").val(id);
        $("#UpdateTrackStatus_Status_Val").val(status);
        switch (parseInt(status)) {
            case 0:
                $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                $("#UpdateTrackStatus_SbmtBtn").html('Unmute <span class="float-end ps-2"> <i class="fa-solid fa-volume-high"></i> </span>');
                $("#TrackReleaseDropdownText_Span").html("You manually muted this track.<br/>Tap to unmute and make it visible to everyone");
                break;
            case 1:
                $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                $("#UpdateTrackStatus_SbmtBtn").html('Waiting for Submission <span class="float-end ps-2"> <i class="fa-solid fa-circle-pause"></i> </span>');
                $("#TrackReleaseDropdownText_Span").html(" <i class='fa-solid fa-circle-pause'></i> This track is nearly ready. Add or edit details like author credits or cover image (if necessary), then submit to release it");
                break;
            case 2:
                $("#UpdateTrackStatus_Id_Val").val(0);
                $("#UpdateTrackStatus_SbmtBtn").addClass("super-disabled");
                $("#UpdateTrackStatus_SbmtBtn").html('Disabled <span class="float-end ps-2"> <i class="fa-solid fa-volume-off"></i> </span>');
                $("#TrackReleaseDropdownText_Span").html("This track was muted due to rule violations or multiple reports.<br/>Check your account notifications<br/> for more details");
                break;
            case 3:
                $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                $("#UpdateTrackStatus_SbmtBtn").html('Mute <span class="float-end ps-2"> <i class="fa-solid fa-volume-xmark"></i> </span>');
                $("#TrackReleaseDropdownText_Span").html("Released and public.<br/>Tap to mute and hide");
                break;
            default:
                $("#UpdateTrackStatus_SbmtBtn").removeClass("super-disabled");
                $("#UpdateTrackStatus_SbmtBtn").html('Active <span class="float-end ps-2"> <i class="fa-solid fa-volume-off"></i> </span>');
                $("#TrackReleaseDropdownText_Span").html("Released and public.<br/>Tap to mute and hide");
                break;
        }
        $("#TrackReleaseDropdownText_Span").fadeIn(0);
    }
    else {
        $("#UTCI_Id_Val").val(0);
        $("#GetTrackLyrics_Id_Val").val(id);
        $("#GetTrackLyrics_Type_Val").val(0);
        $("#GetTrackCredits_Id_Val").val(id);
        $("#GetTrackCredits_Type_Val").val(0);
        $("#EditTrackContentInfo_Btn").fadeOut(0);
        $("#UTCI_File_Val").removeAttr("data-trigger");
        $("#EditTrackCoverImageInitiation_Btn").removeAttr("onmousedown");
        $("#UpdateTrackStatus_Id_Val").val(0);
        $("#UpdateTrackStatus_Status_Val").val(0);
    }
    $("#ReleaseInfo_TrackBoxes_Box").empty();
    if (coverImageUrl != null) {
        $("#ReleaseInfo_Img_Box").fadeOut(0);
        $("#ReleaseInfo_Img").attr("src", "/TrackCovers/" + coverImageUrl);
        $("#ReleaseInfo_Img").fadeIn(0);
    }
    else {
        $("#ReleaseInfo_Img_Box").fadeIn(0);
        $("#ReleaseInfo_Img_Box").html(' <i class="fa-solid fa-music"></i> ');
        $("#ReleaseInfo_Img").attr("src", "#");
        $("#ReleaseInfo_Img").fadeOut(0);
    }
    //else {
    //    $("#ARTAF_Id_Val").val(0);
    //    $(".btn-track-favor-unfavor-lg").removeClass("super-disabled");
    //    $(".btn-track-favor-unfavor-lg").html(' <i class="fa-solid fa-circle-exclamation"></i> ');
    //    $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
    //}
    //0 - inactive; 1 - pending for submission; 2 - muted; 3 - active ([0-2] - inactive)
    $("#ReleaseInfo_Type_Span").html("Single");
    $("#ReleaseInfo_SongsQty_Span").fadeOut(0);

    $("#ReleaseInfo_Name_Lbl").html(title);
    $(".btn-play-pause-track-lg").attr("data-id", id);
    $(".btn-play-pause-track-lg").attr("id", id + "-PlayFirstTrack_Btn");
    $(".btn-track-favor-unfavor").attr("data-id", id); //AddOrRemoveTheAsFavorite_Form 
    $(".btn-track-favor-unfavor-lg").attr("data-id", id); //AddOrRemoveTheAsFavorite_Form 
    if (genres != null && genres.length > 0) {
        for (let i = 0; i < genres.length; i++) {
            if (i == 0) genresListed = genres[i].name;
            else genresListed += ", " + genres[i].name;
        }
        $("#ReleaseInfo_Genres_Span").html(genresListed);
    }
    else $("#ReleaseInfo_Genres_Span").html("No Genre");
    if (featuringArtists != null && featuringArtists.length > 0) {
        for (let i = 0; i < featuringArtists.length; i++) {
            let artistSeparator = $("<span>, </span>");
            let artistSpan = $("<span class='artist-search-span'></span>");
            artistSpan.html(featuringArtists[i].artistName);
            artistSpan.attr("id", featuringArtists[i].id + "-FindTheArtistById_Span");
            if (i == 0) artistsListed.append(artistSpan);
            else {
                artistsListed.append(artistSeparator);
                artistsListed.append(artistSpan);
            }
        }
    }

    $("#ReleaseInfo_ReleaseYear_Span").html(releaseDate.getFullYear());
    $("#ReleaseInfo_ReleasedAtDate_Span").html(dateAndTimeFormation(userLocale, releaseDate)[0]);
    $("#ReleaseInfo_LabelInfo_Span").text(mainArtist);
    $("#ReleaseInfo_MainArtist_Span").text(mainArtist);

    $("#ARTAF_Id_Val").val(id);
    if (isFavorite) {
        $(".btn-track-favor-unfavor").html(' <i class="fa-solid fa-star"></i> ');
        $(".btn-track-favor-unfavor-lg").html(' <i class="fa-solid fa-star"></i> ');
        $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/RemoveFromFavorites");
    }
    else {
        $(".btn-track-favor-unfavor").html(' <i class="fa-regular fa-star"></i> ');
        $(".btn-track-favor-unfavor-lg").html(' <i class="fa-regular fa-star"></i> ');
        $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
    }
    buttonUndisabler(true, "btn-track-favor-unfavor", null);
    buttonUndisabler(true, "btn-track-favor-unfavor-lg", null);

    let trackMainBox = $("<div class='track-table-box'></div>");
    let trackStackBox = $("<div class='hstack gap-1'></div>");
    let playBtn = $("<button type='button' class='btn btn-track-table btn-play-pause-track'> <i class='fa-solid fa-play'></i> </button>");
    let trackInfoBox = $("<div class='ms-2'></div>");
    let trackNameLbl = $("<span class='h6'></span>");
    let trackInfoSeparator = $("<br/>");
    let trackArtistsName = $("<small class='artist-name-span text-muted'></small>");
    let trackStatsBox = $("<div class='ms-auto'></div>");
    let trackDurationSpan = $("<small class='card-text text-muted me-1'></small>");
    let trackDropdown = $("<div class='dropdown d-inline-block'></div>");
    let trackDropdownBtn = $('<button class="btn btn-track-table" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
    let trackDropdownUl = $("<ul class='dropdown-menu shadow-sm'></ul>");
    let trackDropdownLi0 = $("<li></li>");
    let trackDropdownBtn0 = $('<button type="button" class="dropdown-item">Add to Playlist <span class="float-end ms-1"> <i class="fa-solid fa-folder-plus"></i> </span></button>');
    let mainArtistSpan;
    let featIconSpan;
    if (featuringArtists != null) {
        mainArtistSpan = $("<span class='artist-search-span'></span>");
        featIconSpan = $("<span> feat. </span>");
    }
    else mainArtistSpan = $("<span class='artist-search-span'></span>");

    mainArtistSpan.html(mainArtist);
    mainArtistSpan.attr("id", mainArtistId + "-FindArtistById_Span");
    playBtn.attr("data-id", id);
    playBtn.attr("id", id + "-PlayTheTrack_Btn");
    trackNameLbl.attr("id", id + "-TrackName_Lbl");
    trackArtistsName.attr("id", id + "-TrackArtistsName_Lbl");

    trackNameLbl.html(title);
    trackArtistsName.append(mainArtistSpan);
    if (featuringArtists != null) {
        trackArtistsName.append(featIconSpan);
        trackArtistsName.append(artistsListed);
    }
    trackDurationSpan.html(audioFileSample.duration);

    trackDropdownLi0.append(trackDropdownBtn0);
    trackDropdownUl.append(trackDropdownLi0);
    trackDropdown.append(trackDropdownBtn);
    trackDropdown.append(trackDropdownUl);
    trackInfoBox.append(trackNameLbl);
    trackInfoBox.append(trackInfoSeparator);
    trackInfoBox.append(trackArtistsName);
    trackStatsBox.append(trackDurationSpan);
    trackStatsBox.append(trackDropdown);
    trackStackBox.append(playBtn);
    trackStackBox.append(trackInfoBox);
    trackStackBox.append(trackStatsBox);
    trackMainBox.append(trackStackBox);
    $("#ReleaseInfo_TrackBoxes_Box").append(trackMainBox);

    $(audioFileSample).on("loadedmetadata", function () {
        const duration = secondsToRegularDuration(audioFileSample.duration);
        if (duration != null) {
            if (duration[0] > 0) $("#ReleaseInfo_TotalDuration_Span").text(duration[0] + " min " + duration[1] + " sec");
            else $("#ReleaseInfo_TotalDuration_Span").text(duration[1] + " seconds");
        }
        trackQueue.songs = [];
        trackQueue.songs.push(id);
        trackOrderInQueue = 0;
    });
}

function animahider(byClassname, elementId) {
    if (byClassname) {
        $("." + elementId).css("margin-left", "15%");
        setTimeout(function () {
            $("." + elementId).css("margin-left", "-1200px");
        }, 350);
        setTimeout(function () {
            $("." + elementId).fadeOut(0);
        }, 700);
    }
    else {
        $("#" + elementId).css("margin-left", "15%");
        setTimeout(function () {
            $("#" + elementId).css("margin-left", "-1200px");
        }, 350);
        setTimeout(function () {
            $("#" + elementId).fadeOut(0);
        }, 700);
    }
}

function uncallAProposal() {
    uncallASmContainer(false, "Proposal_Container");
    clearInterval(intervalValue);
    clearTimeout(timeoutValue);
}

function callAProposal(icon, header, description, positiveButtonHtml, positiveButtonClasses = [], positiveButtonAttributes = [], positiveButtonAttributeValues = [], isPositiveButtonForm = false, positiveButtonFormHtml = null, timeroutDurationInSec = 30) {
    createHeadlessSmContainer("Proposal", '<div class="box-standard p-2" id="Proposal_Box"> <div class="box-standard text-center p-1"> <h2 class="h2" id="Proposal_Icon_Lbl"> <i class="fa-solid fa-question"></i> </h2> <h4 class="h4" id="Proposal_Header_Lbl">Proposal Header</h4> <small class="card-text text-muted white-space-on" id="Proposal_Description_Span">Proposal description (short)</small> </div> <div class="row mt-3"> <div class="col" id="ProposalSubmit_Box"> <button type="button" class="btn btn-standard-bolded btn-classic-styled btn-proposal-submit w-100" id="ProposalSubmit_Btn">Submit</button> <div class="box-standard" id="ProposalForForms_Box" style="display: none;"></div> </div> <div class="col" id="ProposalCancel_Box"> <button type="button" class="btn btn-standard-bolded btn-close-sm-container bg-chosen-bright w-100" id="Proposal_Container-BtnClose"> <i class="fa-regular fa-circle-xmark"></i> Cancel</button> </div> </div> <div class="box-bordered text-center mt-2 p-2"> <span class="h6">Time Left</span> <br /> <small class="card-text text-muted" id="Proposal_Timer_Span">00:30</small> </div> </div>', false);
    if (icon != null || icon != undefined) $("#Proposal_Icon_Lbl").html(icon);
    else $("#Proposal_Icon_Lbl").html(' <i class="fa-solid fa-question"></i> ');
    if (header != null || header != undefined) $("#Proposal_Header_Lbl").html(header);
    else $("#Proposal_Header_Lbl").html("Proposal");
    if (description != null || description != undefined) {
        $("#Proposal_Description_Span").html(description);
        $("#Proposal_Description_Span").fadeIn(300);
    }
    else {
        $("#Proposal_Description_Span").html("This proposal has no description");
        $("#Proposal_Description_Span").fadeOut(300);
    }

    if (positiveButtonHtml != null || positiveButtonHtml != undefined) {
        $("#ProposalSubmit_Btn").html(positiveButtonHtml);
    }
    else {
        $("#ProposalSubmit_Btn").html(' <i class="fa-regular fa-circle-check"></i> Submit');
    }

    $("#ProposalForForms_Box").empty();
    if (!isPositiveButtonForm) {
        if (Array.isArray(positiveButtonClasses) && positiveButtonClasses != null) {
            for (let i = 0; i < positiveButtonClasses.length; i++) {
                if (positiveButtonClasses[i] != undefined) $("#ProposalSubmit_Btn").addClass(positiveButtonClasses[i]);
            }
        }
        const currentAttributes = $("#ProposalSubmit_Btn")[0];
        if (currentAttributes != undefined && currentAttributes.length > 0) {
            for (let i = 0; i < currentAttributes.attributes.length; i++) {
                if (currentAttributes[i] != undefined) {
                    $("#ProposalSubmit_Btn").removeAttr(currentAttributes[i].name);
                }
            }
        }
/*        $("#ProposalSubmit_Btn").addClass("btn btn-standard-bolded btn-classic-styled w-100");*/
        if ((Array.isArray(positiveButtonAttributes) && Array.isArray(positiveButtonAttributeValues)) && (positiveButtonAttributeValues != null && positiveButtonAttributes != null)) {
            for (let i = 0; i < positiveButtonAttributes.length; i++) {
                if (positiveButtonAttributes[i] != undefined && positiveButtonAttributeValues[i] != undefined) {
                    $("#ProposalSubmit_Btn").attr(positiveButtonAttributes[i], positiveButtonAttributeValues[i]);
                }
            }
        }
        $("#ProposalSubmit_Btn").fadeIn(0);
        $("#ProposalForForms_Box").fadeIn(0);
    }
    else {
        if (positiveButtonFormHtml != null && positiveButtonFormHtml.includes("<form")) {
            $("#ProposalSubmit_Btn").fadeOut(0);
            $("#ProposalForForms_Box").fadeIn(0);
            $("#ProposalForForms_Box").append(positiveButtonFormHtml);
        }
    }
    let timeTotalDuration = timeroutDurationInSec;
    let timerOutInMin = secondsToRegularDuration(timeroutDurationInSec);
    timeroutDurationInSec = timeroutDurationInSec > 5 ? timeroutDurationInSec : 30;
    if (timerOutInMin != null) $("#Proposal_Timer_Span").html(timerOutInMin[0] + ":" + timerOutInMin[1]);

    intervalValue = setInterval(function () {
        timeroutDurationInSec--;
        timerOutInMin = secondsToRegularDuration(timeroutDurationInSec);
        if (timerOutInMin != null) $("#Proposal_Timer_Span").html(timerOutInMin[0] + ":" + timerOutInMin[1]);
    }, 1000);
    timeoutValue = setTimeout(function () {
        $("#Proposal_Timer_Span").html("time's out");
        uncallAProposal();
    }, timeTotalDuration * 1000);

    displayCorrector(currentWindowSize);
    setTimeout(function () {
        callASmContainer(false, "Proposal_Container");
    }, 150);
}

function showBySlidingToRight(byClassname = false, closingElementId, targetElementId) {
    if (closingElementId != null && targetElementId != null) {
        if (byClassname) {
            $("." + closingElementId).fadeOut(300);
            setTimeout(function () {
                $("." + targetElementId).fadeIn(0);
                $("." + targetElementId).css("margin-left", "15%");
            }, 350);
            setTimeout(function () {
                $("." + targetElementId).css("margin-left", "-3%");
            }, 700);
            setTimeout(function () {
                $("." + targetElementId).css("margin-left", 0);
            }, 1050);
        }
        else {
            $("#" + closingElementId).fadeOut(300);
            setTimeout(function () {
                $("#" + targetElementId).fadeIn(0);
                $("#" + targetElementId).css("margin-left", "15%");
            }, 350);
            setTimeout(function () {
                $("#" + targetElementId).css("margin-left", "-3%");
            }, 700);
            setTimeout(function () {
                $("#" + targetElementId).css("margin-left", 0);
            }, 1050);
        }
    }
}

async function timer(durationInSec, display, updateEvery_N_Seconds, displayInSeconds = false) {
    if (display != null && durationInSec != null) {
        let newDuration = durationInSec;
        updateEvery_N_Seconds = updateEvery_N_Seconds < durationInSec ? updateEvery_N_Seconds : durationInSec;
        intervalValue = setInterval(function () {
            newDuration = parseFloat(newDuration) - updateEvery_N_Seconds;
            if (updateEvery_N_Seconds % 1 === 0) newDuration = newDuration % 1 === 0 ? newDuration : newDuration;
            else newDuration = newDuration.toFixed(1);
            if (displayInSeconds) $("#" + display).html(newDuration + " sec");
            else {
                let durationInMin = parseFloat(Math.floor(newDuration / 60));
                let leftSeconds = newDuration - (durationInMin * 60); /*parseFloat(newDuration) > 60 ? (60 - newDuration) * -1 : newDuration * 1;*/
                durationInMin = durationInMin < 10 ? "0" + durationInMin : durationInMin;
                if (updateEvery_N_Seconds % 1 === 0) leftSeconds = leftSeconds < 10 ? "0" + leftSeconds : leftSeconds;
                else leftSeconds = leftSeconds < 10 ? "0" + leftSeconds.toFixed(1) : leftSeconds.toFixed(1);
                $("#" + display).html(durationInMin + ":" + leftSeconds);
            }
        }, updateEvery_N_Seconds * 1000);
        await new Promise(resolve => setTimeout(resolve, durationInSec * 1000));

        clearInterval(intervalValue);
        clearTimeout(timeoutValue);
        $("#" + display).html("time out");
        return true;
    }
    else return false;
}

function fileRenewer(targetId, newFilesArr, acceptableFilesLength, updateTheWidget = null) {
    newFilesArr = newFilesArr != null ? newFilesArr : new DataTransfer();
    let dataTransfer = new DataTransfer();
    let maxFilesLength = newFilesArr.files.length > acceptableFilesLength ? acceptableFilesLength : newFilesArr.files.length;
    for (let i = 0; i < maxFilesLength; i++) {
        dataTransfer.items.add(newFilesArr.files[i]);
    }
    let newInput = document.createElement("input");
    let inputElement = document.getElementById(targetId);

    newInput.type = "file";
    newInput.multiple = inputElement.multiple;
    newInput.accept = inputElement.accept;
    newInput.name = inputElement.name;
    newInput.id = inputElement.id;
    newInput.className = inputElement.className;

    if (dataTransfer.files.length > 0) newInput.files = dataTransfer.files;
    else newInput.files = null;

    document.getElementById(targetId).parentNode.replaceChild(newInput, inputElement);
    if (updateTheWidget == null) $("#" + targetId).change();
}

function imagePreviewer(images, saveTargetFormId, orderTargetId, isMultiple = true, openPreviewBox = true, previewBox = null) {
    let isArray = Array.isArray(images) ? true : false;
    let imagesLength = 0;
    let imagesCodeLength = 0;
    let rowsQty = 1;
    let divExists = document.getElementById("ImagePreview_Container");
    if (divExists == null) createInsideLgCard("ImagePreview", "Preview Images ∙ <span id='LoadedImagesQty_Span'>0</span>", '<div class="box-standard" id="ImagesListed_Box"></div>', '<button type="button" class="btn btn-standard-bolded btn-save-images btn-sm super-disabled me-1" id="EditProfileImages_Form-SaveChanges_Btn">Save</button>', '<div class="dropdown d-inline-block"> <button class="btn btn-standard btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button> <ul class="dropdown-menu shadow-sm p-1"> <li><button type="button" class="dropdown-item btn-add-more-images btn-sm super-disabled" id="EditImage_Files_Val-AddMoreImages_Btn"> <i class="fa-solid fa-plus"></i> Add More</button></li> <li><button type="button" class="dropdown-item btn-delete-all-images btn-sm super-disabled text-danger" id="EditProfileImages_Form-DeleteAllImages_Btn"> <i class="fa-solid fa-trash-can"></i> Delete all Images</button></li> </ul> </div>');

    if (images != null) {
        if (!isArray) {
            let tempImages = images;
            images = [];
            images.push(tempImages);
        }
        imagesLength = images[0].length <= 6 ? images[0].length : 6;
        imagesCodeLength = imagesLength - 1;
        $("#ImagesListed_Box").empty();

        if (imagesLength > 0) {
            $('.btn-save-images').removeClass("super-disabled");
            $('.btn-add-more-images').removeClass("super-disabled");
            $('.btn-delete-all-images').removeClass("super-disabled");
            for (let i = 0; i < imagesLength; i++) {
                if (i == 0 || i % 3 == 0) {
                    rowsQty++;
                    let newRow = $("<div class='row mb-1'></div>");
                    newRow.attr("id", rowsQty + "-Row_Box");
                    $("#ImagesListed_Box").append(newRow);
                }
                let orderIndex = i;
                let deleteBtn = $("<button type='button' class='btn btn-reorder-style btn-delete-from-order btn-sm bg-danger float-end'> <i class='fa-solid fa-xmark'></i> </button>");
                let reorderBtn = $("<button type='button' class='btn btn-reorder btn-reorder-style btn-sm mb-1'></button>");
                let elementCol = $("<div class='col'></div>");
                let imagePreviewBox = $("<div class='image-preview-box'></div>");
                let imgElement = $("<img src='#' class='image-preview' alt='This image cannot be displayed'/>");
                imgElement.attr("id", i + "-Element_Img");
                imgElement.attr("data-img-order", i);
                elementCol.attr("id", i + "-ImgElement_Col");
                imgElement.attr("src", window.URL.createObjectURL(images[0][i]));
                imagePreviewBox.attr("id", i + "-ImgPreview_Box");
                if (orderTargetId != null || orderTargetId != undefined) {
                    reorderBtn.attr("id", i + "-ReorderTheImg_Btn");
                    reorderBtn.attr("data-max-order", imagesCodeLength);
                    reorderBtn.attr("data-reorder-target", orderTargetId);
                    reorderBtn.attr("data-trigger", saveTargetFormId);
                    deleteBtn.attr("id", i + "-DeleteImgFromTheOrder_Btn");
                    deleteBtn.attr("data-reorder-target", orderTargetId);
                    deleteBtn.attr("data-trigger", saveTargetFormId);
                    reorderBtn.html(++orderIndex);
                    imagePreviewBox.append(reorderBtn);
                    imagePreviewBox.append(deleteBtn);
                }
                imagePreviewBox.append(imgElement);
                elementCol.append(imagePreviewBox);
                $("#" + rowsQty + "-Row_Box").append(elementCol);
            }
            $("#LoadedImagesQty_Span").html(imagesLength);
            if (openPreviewBox) {
                displayCorrector(currentWindowSize);
                callAContainer(false, "ImagePreview_Container");
            }

            if (previewBox != null || previewBox != undefined) {
                $("#" + previewBox).attr("src", window.URL.createObjectURL(images[0][0]));
                $("#" + previewBox).fadeIn(0);
                $("#" + previewBox + "_Box").fadeOut(0);
                $("#" + previewBox + "-BtnRemove").removeClass("super-disabled");
            }
            else {
                $("#" + previewBox).attr("src", "#");
                $("#" + previewBox).fadeOut(0);
                $("#" + previewBox + "_Box").fadeIn(0);
                $("#" + previewBox + "-BtnRemove").addClass("super-disabled");
            }
        }
        else {
            $('.btn-save-images').addClass("super-disabled");
            $('.btn-add-more-images').addClass("super-disabled");
            $('.btn-delete-all-images').addClass("super-disabled");
            uncallAContainer(false, "ImagePreview_Container");
            $("#" + previewBox).attr("src", "#");
            $("#" + previewBox).fadeOut(0);
            $("#" + previewBox + "_Box").fadeIn(0);
            $("#" + previewBox + "-BtnRemove").addClass("super-disabled");
        }

        if (saveTargetFormId != null || saveTargetFormId != undefined) {
            $(".btn-save-images").attr("id", saveTargetFormId + "-SaveImages_Btn");
            $(".btn-save-images").removeClass("super-disabled");
            $(".btn-save-images").text('Save');
        }
        else {
            $(".btn-save-images").attr("id", null);
            $(".btn-save-images").addClass("super-disabled");
            $(".btn-save-images").html(' <i class="fa-solid fa-check"></i> Saved');
        }

        if (isMultiple) {
            $(".btn-add-more-images").removeClass("super-disabled");
            $(".btn-add-more-images").html(' <i class="fa-solid fa-plus"></i> Add More');
        }
        else {
            $(".btn-add-more-images").addClass("super-disabled");
            $(".btn-add-more-images").html(' <i class="fa-solid fa-1"></i> Single-imaged');
        }
    }
    else {
        $('.btn-save-images').addClass("super-disabled");
        $('.btn-add-more-images').addClass("super-disabled");
        $('.btn-delete-all-images').addClass("super-disabled");
        uncallAContainer(false, "ImagePreview_Container");
    }
}

function audioPreviewer(files, saveTargetFormId, orderTargetId, isMultiple = true, openPreviewBox = true) {
    let rowsQty = 0;
    let divExists = document.getElementById("AudioPreview_Container");
    if (!divExists) createInsideLgCard("AudioPreview", "Audio Preview ∙ <span id='AudioFilesQty_Span'>0</span>", '<div class="mt-1 p-1 pt-0"> <div class="box-bordered p-2"> <div> <span class="h4 ongaku-track-name-lbl">Not Playing</span> <div> <small class="card-text ongaku-artist-name-lbl text-muted">no file chosen</small> </div> </div> <div class="hstack gap-1 mt-1"> <span class="card-text text-muted ongaku-track-duration-current">0:00</span> <div class="ongaku-track-duration-line-enlarged" id="TrackPreviewDurationLine_Box"> <div class="ongaku-track-current-duration-line-enlarged"></div> </div> <span class="card-text text-muted ongaku-track-duration-left">0:00</span> </div> <div class="row w-100 mt-1"> <div class="col"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-enlarged btn-ongaku-player-backward w-100"> <i class="fa-solid fa-backward"></i> </button> </div> <div class="col"> <button type="button" class="btn btn-ongaku-player btn-play-pause-track btn-ongaku-player-enlarged w-100" id="TrackPreviewPlayPause_Btn"> <i class="fa-solid fa-play"></i> </button> </div> <div class="col"> <button type="button" class="btn btn-ongaku-player btn-ongaku-player-enlarged btn-ongaku-player-forward w-100"> <i class="fa-solid fa-forward"></i> </button> </div> </div> </div><div class="row w-100 mt-2" id="AddedTracks_Box"> </div> </div>', null, null);
    else {
        $("#AddedTracks_Box").empty();
    }

    if (files.length > 0) {
        let imagesCodeLength = files.length - 1;
        $("#AudioFilesQty_Span").text(files.length);
        if (isMultiple) {
            $(".btn-ongaku-player-forward").removeClass("super-disabled");
        }
        else {
            $(".btn-ongaku-player-forward").addClass("super-disabled");
        }

        for (let i = 0; i < files.length; i++) {
            if (i % 3 == 0) {
                rowsQty++;
                let newRow = $("<div class='row'></div>");
                newRow.attr("id", rowsQty + "-AudioPreviewRow_Box");
                $("#AddedTracks_Box").append(newRow);
            }

            let col = $("<div class='col'></div>");
            let trackBox = $("<div class='track-preview-box'></div>");
            let trackFileNameLbl = $("<h5 class='h5 text-truncate'></h5>");
            let trackExtensionBadge = $("<span class='badge badge-standard'></span>");
            let trackPreviewBtnsBox = $('<div class="mt-2"></div>');
            let trackPreviewPlayBtn = $("<button type='button' class='btn btn-standard-bordered btn-pre-play-pause-track btn-play-pause-track me-1' data-preview='true'> <i class='fa-solid fa-play'></i> Play</button>");
            if (isMultiple) {
                let orderIndex = i;
                let trackSettingsBox = $("<div class='box-standard hstack gap-1 mb-1'></div>")
                let trackReorderBtn = $("<button type='button' class='btn btn-reorder btn-reorder-style btn-sm'></button>");
                let trackDeleteBtn = $("<button type='button' class='btn btn-reorder-style btn-delete-from-order btn-sm ms-auto'> <i class='fa-solid fa-xmark'></i> </button>");
                trackReorderBtn.text(++orderIndex);
                trackReorderBtn.attr("id", i + "-ReorderTheTrack_Btn");
                trackReorderBtn.attr("data-max-order", imagesCodeLength);
                trackReorderBtn.attr("data-reorder-target", orderTargetId);
                trackReorderBtn.attr("data-trigger", saveTargetFormId);
                trackReorderBtn.attr("data-is-audio", true);
                trackDeleteBtn.attr("id", i + "-DeleteTheTrack_Btn");
                trackDeleteBtn.attr("data-reorder-target", orderTargetId);
                trackDeleteBtn.attr("data-trigger", saveTargetFormId);
                trackReorderBtn.attr("data-is-audio", true);
                trackSettingsBox.append(trackReorderBtn);
                trackSettingsBox.append(trackDeleteBtn);
                trackBox.append(trackSettingsBox);
            }
            else {
                $(".btn-pre-play-pause-track").attr("data-title", files[i].name);
                $(".btn-pre-play-pause-track").attr("data-src", window.URL.createObjectURL(files[i]));
            }

            trackFileNameLbl.html(files[i].name);
            trackExtensionBadge.html(getFileExtension(files[i].name));
            trackPreviewBtnsBox.append(trackPreviewPlayBtn);
            trackPreviewPlayBtn.attr("data-src", window.URL.createObjectURL(files[i]));
            trackPreviewPlayBtn.attr("data-title", files[i].name);
            trackPreviewPlayBtn.attr("data-order-index", i);
            trackPreviewPlayBtn.attr("id", i + "-TrackPrePlay_Btn");

            trackBox.append(trackFileNameLbl);
            trackBox.append(trackExtensionBadge);
            trackBox.append(trackPreviewBtnsBox);
            col.append(trackBox);
            $("#" + rowsQty + "-AudioPreviewRow_Box").append(col);
        }
    }

    if (openPreviewBox) {
        displayCorrector(currentWindowSize);
        setTimeout(function () {
            callAContainer(false, "AudioPreview_Container", false);
        }, 150);
    }
}

function hideBySlidingToLeft(byClassname = false, openingElement, targetElementId) {
    if (targetElementId != null) {
        if (byClassname) {
            $("." + targetElementId).css("transform", "translateX(15%)");
            setTimeout(function () {
                $("." + targetElementId).css("transform", "translateX(-1200px)");
            }, 350);
            setTimeout(function () {
                if (openingElement != null || openingElement != undefined) $("." + openingElement).fadeIn(300);
                $("." + targetElementId).fadeOut(0);
            }, 700);
        }
        else {
            $("#" + targetElementId).css("transform", "translateX(15%)");
            setTimeout(function () {
                $("#" + targetElementId).css("transform", "translateX(-1200px)");
            }, 350);
            setTimeout(function () {
                if (openingElement != null || openingElement != undefined) $("#" + openingElement).fadeIn(300);
                $("#" + targetElementId).fadeOut(0);
            }, 700);
        }
    }
}

function showSwitchableBox(isBig, currentElementId) {
    if (isBig) {
        $(".big-box-switchable").fadeOut(300);
        setTimeout(function () {
            $("#" + currentElementId).fadeIn(300);
        }, 300);
    }
    else {
        $(".box-switchable").fadeOut(300);
        setTimeout(function () {
            $("#" + currentElementId).fadeIn(300);
        }, 300);
    }
}
function loadAnotherFile(loadForward = true, skipValue = 1, maxLength, skippingInputId, formId) {
    if (formId != null && skippingInputId != null) {
        let skipTrueValue = parseInt($("#" + skippingInputId).val());
        if (loadForward) {
            skipTrueValue += skipValue;
            skipTrueValue = skipTrueValue >= parseInt(maxLength) ? 0 : skipTrueValue;
        }
        else {
            skipTrueValue -= skipValue;
            skipTrueValue = skipTrueValue < 0 ? 0 : skipTrueValue;
        }
        let isNextImgLoaded = $("#" + skipTrueValue + "-ImgHdn_Val").val();
        if (isNextImgLoaded == undefined) {
            $("#" + skippingInputId).val(skipTrueValue);
            $("#" + formId).submit();
        }
        else {
            $(".profile-counter-slider").removeClass("bg-chosen");
            $("#" + skipTrueValue + "-ImgSlider_Box").addClass("bg-chosen");
            $(".profile-avatar-img-enlarged").attr("src", "/ProfileImages/" + isNextImgLoaded);
            $("#" + skippingInputId).val(skipTrueValue);
        }
        $(".btn-edit-some-files").removeClass("super-disabled");
        return isNextImgLoaded;
    }
    else return null;
}

function isElementVisible(byElementClassname = false, element) {
    let elementInfo;
    let resultInfo = false;
    if (byElementClassname) {
        elementInfo = document.getElementsByClassName(element);
        for (let i = 0; i < elementInfo.length; i++) {
            if ($("#" + elementInfo[i].id).css("display") == "block") {
                resultInfo = true;
                break;
            }
        }
    }
    else {
        elementInfo = $("#" + element);
        if (elementInfo != null || elementInfo != undefined) {
            if ($("#" + element).css("display") == "block") resultInfo = true;
            else resultInfo = false;
        }
        else resultInfo = false;
    }
    return resultInfo;
}

function contentPreviewer(contentTitleIds = [], contentElementIds = [], previewTitle = null, needStats = true) {
    if (contentTitleIds.length > 0 && contentElementIds.length > 0) {
        createInsideLgCard("ContentPreviewer", previewTitle == null ? "Preview the Content" : previewTitle, '<div class="p-1"><div class="box-standard row" id="ContentPreview_Stats_Box"> <div class="col"> <button type="button" class="btn btn-standard-bordered btn-sm super-disabled opacity-100 w-100" id="ContentPreview_CharsLength_Btn"> <i class="fa-solid fa-text-width"></i> Chars: <span id="ContentPreview_CharsLength_Span">0</span></button> </div> <div class="col"> <button type="button" class="btn btn-standard-bordered btn-sm super-disabled opacity-100 w-100" id="ContentPreview_RowsQty_Btn"> <i class="fa-solid fa-align-left"></i> Rows: <span id="ContentPreview_RowsQty_Span">0</span></button> </div> <div class="col"> <button type="button" class="btn btn-standard-bordered btn-show-inside-box btn-sm w-100" id="CommonlyUsedWords_Box-BtnOpen"> <i class="fa-solid fa-ranking-star"></i> Commonly Used: <span id="ContentPreview_CommonlyUsed_Span">Undefined</span></button> </div> </div> <div class="box-bordered box-switchable mh-250 p-2 mt-1" id="CommonlyUsedWords_Box" style="display: none;"></div> <div class="box-standard mt-2" id="ContentPreviewResult_Box"></div></div>', null, null);
        let totalText = "";
        for (let i = 0; i < contentElementIds.length; i++) {
            let elementBox = $("<div class='box-bordered mt-1 mb-1 p-2'></div>");
            let elementTitle = $("<h6 class='h6 content-preview-title'></h6>");
            let elementText = $("<span class='card-text content-preview-text white-space-on'></span>");
            let elementTitleValue = $("#" + contentTitleIds[i]).html() == "" ? $("#" + contentTitleIds[i]).val() : $("#" + contentTitleIds[i]).html();
            let elementTextValue = $("#" + contentElementIds[i]).html() == "" ? $("#" + contentElementIds[i]).val() : $("#" + contentElementIds[i]).html();
            //elementText = elementText.replaceAll(",", ", ");
            //elementText = elementText.replaceAll(":", ": ");
            //elementText = elementText.replaceAll("  ", " ");

            elementTitle.html(elementTitleValue);
            elementText.html(elementTextValue);
            elementBox.append(elementTitle);
            elementBox.append(elementText);
            elementTextValue = elementTextValue.trim();
            totalText += elementTextValue;
            $("#ContentPreviewResult_Box").append(elementBox);
        }

        if (needStats) {
            let charactersQty = totalText.length;
            let rowsQty = totalText.split("\n").length;
            let commonUsedWordsArr = [];
            let commonUsedWordsQtyArr = [];
            let wordBreaks = totalText.split(" ");

            for (let i = 0; i < wordBreaks.length; i++) {
                if (commonUsedWordsArr.includes(wordBreaks[i].toLowerCase())) {
                    let neededIndex = commonUsedWordsArr.indexOf(wordBreaks[i].toLowerCase());
                    commonUsedWordsQtyArr[neededIndex]++;
                }
                else {
                    commonUsedWordsArr.push(wordBreaks[i].toLowerCase());
                    commonUsedWordsQtyArr.push(1);
                }
            }

            let currentMostCommon = 0;
            let mostCommonWordIndex = 0;
            let commonUsedWordsHeader = $("<h6 class='h6 mb-1'>Common Used Words</h6>");
            $("#CommonlyUsedWords_Box").empty();
            $("#CommonlyUsedWords_Box").append(commonUsedWordsHeader);
            for (let i = 0; i < commonUsedWordsQtyArr.length; i++) {
                if (commonUsedWordsQtyArr[i] > currentMostCommon) {
                    currentMostCommon = commonUsedWordsQtyArr[i];
                    mostCommonWordIndex = i;
                }
            }
            for (let i = 0; i < commonUsedWordsArr.length; i++) {
                let commonUsedWordSpan = $("<span class='card-text mt-1'></span>");
                let commonUsedWordSeparator = $("<br/>");
                commonUsedWordSpan.html(commonUsedWordsQtyArr[i] > 1 ? commonUsedWordsArr[i] + " (<span class='fw-500'>" + commonUsedWordsQtyArr[i] + "</span> times)" : commonUsedWordsArr[i] + " (<span class='fw-500'>" + commonUsedWordsQtyArr[i] + "</span> time)");
                $("#CommonlyUsedWords_Box").append(commonUsedWordSpan);
                $("#CommonlyUsedWords_Box").append(commonUsedWordSeparator);
            }

            $("#ContentPreview_RowsQty_Span").html(rowsQty.toLocaleString());
            $("#ContentPreview_CharsLength_Span").html(charactersQty.toLocaleString());
            $("#ContentPreview_CommonlyUsed_Span").html(commonUsedWordsArr[mostCommonWordIndex]);
            $("#ContentPreview_Stats_Box").fadeIn(300);
        }
        else $("#ContentPreview_Stats_Box").fadeOut(300);

        displayCorrector(currentWindowSize);
        setTimeout(function () {
            callAContainer(false, "ContentPreviewer_Container", false);
        });
    }
}

function addToPseudolist(value, targetElementId, separatorChar = ',') {
    if (value != null && targetElementId != null) {
        let currentTargetValue = $("#" + targetElementId).val();
        if (currentTargetValue.includes(value)) return null;
        else {
            if (currentTargetValue != "" && currentTargetValue.length > 0) {
                if (separatorChar == null || separatorChar == undefined) currentTargetValue += ", " + value;
                else {
                    separatorChar = separatorChar.length > 1 ? separatorChar[0] : separatorChar;
                    currentTargetValue += separatorChar + " " + value;
                }
            }
            else currentTargetValue = value;
            return currentTargetValue.trim();
        }
    }
    else return null;
}

function removeFromPseudolist(value, targetElementId, separatorChar = ',') {
    if (value != null && targetElementId != null) {
        let currentTargetValue = $("#" + targetElementId).val();
        if (currentTargetValue != "" && currentTargetValue.length > 0) {
            if (currentTargetValue.includes(value)) {
                separatorChar = separatorChar == null ? ',' : separatorChar;
                if (separatorChar != undefined || separatorChar != null) currentTargetValue = currentTargetValue.includes(separatorChar) ? currentTargetValue.replaceAll(separatorChar + value, '') : currentTargetValue.replaceAll(value, '');
                return currentTargetValue.trim();
            }
            else return null;
        }
        else return null;
    }
    else return null;
}

$(document).on("mousedown", ".btn-back", function () {
    let newOpenedContainersArr = [];
    if (openedContainers.length > 0) {
        let closingContainer = openedContainers[openedContainers.length - 1];
        let openingContainer = openedContainers[openedContainers.length - 2];
        openedContainers[openedContainers.length - 1] = null;
        for (let i = 0; i < openedContainers.length; i++) {
            if (openedContainers[i] != null) newOpenedContainersArr.push(openedContainers[i]);
        }

        openedContainers = newOpenedContainersArr;
        uncallAContainer(false, closingContainer);
        setTimeout(function () {
            callAContainer(false, openingContainer, true);
        }, 600);
    }
});

let xDown = null;
let yDown = null;

function getTouches(event) {
    return event.touches || event.originalEvent.touches; // jQuery
}

function handleTouchStart(event) {
    const firstTouch = getTouches(event)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if (!xDown || !yDown) return;

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    // 0 - down swipe, 1 - up swipe, 2 - left swipe, 3 - right swipe;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            return 3;
        } else {
            return 2;
        }
    } else {
        if (yDiff > 0) {
            return 1;
        } else {
            return 0;
        }
    }
};

$(document).on("dblclick", ".div-swiper", function (event) {
    let trueId = getTrueId(event.target.id, false);
    if (trueId != undefined) {
        if ($(this).hasClass("div-swiper-sm")) uncallASmContainer(false, trueId, false);
        else uncallAContainer(false, trueId);
    }
});

$(document).on("touchstart", ".div-swiper", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".div-swiper", function (event) {
    let moveDirection = handleTouchMove(event);
    if (moveDirection == 0) {
        let trueId = getTrueId(event.target.id, false);
        if ($(this).hasClass("div-swiper-sm")) uncallASmContainer(false, trueId, false);
        else uncallAContainer(false, trueId);
    }
    else if (moveDirection == 1) {
        let trueId = getTrueId(event.target.id);
        if (trueId != "") {
            if ($(this).hasClass("div-swiper-sm")) callASmContainer(false, trueId, false);
            else callAContainer(false, trueId, false);
        }
    }

    xDown = null;
    yDown = null;
});

function smPartEnlarger(currentWidth) {
    currentWidth = parseInt(currentWidth);
    if (currentWidth > 1024) {
        $(".box-lg-part").css("bottom", "-1200px");
        setTimeout(function () {
            $(".box-sm-part").css("width", "103.5%");
            $(".box-sm-part-inner").css("left", "8%");
            $(".box-sm-part-inner").css("width", "93.25%");
            $(".ongaku-player-box").css("left", "7.5%");
            $(".ongaku-player-box").css("width", "93.25%");
            $(".div-vertical-swiper").css("margin-left", "99.25%");
        }, 350);
        setTimeout(function () {
            $(".box-sm-part").css("width", "100%");
            $(".box-sm-part-inner").css("left", "6%");
            $(".ongaku-player-box").css("left", "6%");
        }, 700);
    }
}

function smPartDwindler(currentWidth) {
    currentWidth = parseInt(currentWidth);
    if (currentWidth > 1024) {
        let lastContainerId = openedContainers.length > 0 ? openedContainers[openedContainers.length - 1] : "Primary_Container";
        $(".box-sm-part").css("left", 0);
        $(".box-sm-part").css("width", "37%");
        $(".div-vertical-swiper").css("margin-left", "98%");
        displayCorrector(currentWidth);
        setTimeout(function () {
            callAContainer(false, lastContainerId, true);
        }, 900);
    }
}

function navbarSwitcher(currentWidth, sideBarOn = false) {
    currentWidth = parseInt(currentWidth);
    if (currentWidth != undefined) {
        if (currentWidth > 1024) {
            if (sideBarOn) {
                $("body").append('<div class="side-navbar shadow-sm"> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Home"> <i class="fa-solid fa-house"></i> </button> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Search"> <i class="fa-solid fa-magnifying-glass"></i> </button> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Chats & Reels"> <i class="fa-regular fa-comments"></i> </button> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Library" id="GetPlaylists_SbmtBtn"> <i class="fa-solid fa-bars-staggered"></i> </button> <div class="position-absolute text-center bottom-0 mt-2"> <div class="side-navbar-wrapper"> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm super-disabled" data-bs-title="Switch to Dark Mode"> <i class="fa-regular fa-sun"></i> </button> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Notifications"> <i class="fa-regular fa-bell"></i> </button> <button type="button" class="btn btn-side-navbar btn-tooltip w-100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-title="Help & Support"> <i class="fa-solid fa-question"></i> </button> </div> </div> </div>');
                $(".bottom-navbar").css("bottom", "-1200px");
                setTimeout(function () {
                    $(".side-navbar").fadeIn(300);
                    $(".side-navbar").css("left", "15px");
                    $(".bottom-navbar").fadeOut(300);
                }, 350);
                setTimeout(function () {
                    $(".side-navbar").css("left", "6px");
                }, 700);
            }
            else {
                $(".side-navbar").css("left", "15px");
                setTimeout(function () {
                    $(".bottom-navbar").fadeIn(0);
                    $(".side-navbar").fadeOut(300);
                    $(".bottom-navbar").css("bottom", 0);
                    $(".side-navbar").css("left", "-1200px");
                }, 350);
                setTimeout(function () {
                    $(".side-navbar").remove();
                }, 700);
            }
        }
        else {
            $(".side-navbar").css("left", "-1200px");
            setTimeout(function () {
                $(".bottom-navbar").fadeIn(0);
                $(".side-navbar").fadeOut(300);
                $(".bottom-navbar").css("bottom", 0);
            }, 300);
            setTimeout(function () {
                $(".side-navbar").remove();
            }, 600);
        }
    }
}

$(document).on("mouseover mousedown", ".bottom-navbar", function () {
    topScrollLogicCorrector(currentWindowSize);
});
$(document).on("mouseover mousedown", ".ongaku-player-box", function () {
    topScrollLogicCorrector(currentWindowSize);
});
$(document).on("mousedown", ".box-lg-part", function () {
    topScrollLogicCorrector(currentWindowSize);
});
$(".box-lg-part").on("scroll", function () {
    //let scrollHeight = $(this)[0].scrollHeight;
    let currentScrollTop = $(this).scrollTop();
    //let visibleScrollHeight = $(this).innerHeight();
    //let maxScrollHeight = scrollHeight - visibleScrollHeight;
    if (currentScrollTop >= lastScrollTop) botScrollLogicCorrector(currentWindowSize);
    else topScrollLogicCorrector(currentWindowSize);

    lastScrollTop = currentScrollTop;

    if ($(this).hasClass("box-lg-part-for-artist")) {
        let artistPageHeaderHeight = $(".artist-page-avatar-box").innerHeight();
        let leftPxQty = artistPageHeaderHeight - currentScrollTop;
        if (leftPxQty <= 60) {
            let partHeight = $(".box-lg-part-header-for-artist").innerHeight();
            $(".box-lg-part-header-for-artist").addClass("visible");
            $(".artist-page-head-buttons-box").css("top", partHeight + "px");
        }
        else {
            $(".box-lg-part-header-for-artist").removeClass("visible");
            $(".artist-page-head-buttons-box").css("top", 0 + "px");
        }
    }
});


$(document).on("dblclick", ".div-vertical-swiper", function (event) {
    let trueId = getTrueId(event.target.id, false);
    if (trueId != undefined) {
        $(".div-vertical-swiper").attr("disabled", true);
        if ($(this).hasClass("div-vertical-swiper-active")) {
            navbarSwitcher(currentWindowSize, false);
            $(this).removeClass("div-vertical-swiper-active");
            setTimeout(function () {
                smPartDwindler(currentWindowSize);
                $(".div-vertical-swiper").attr("disabled", false);
            }, 350);
        }
        else {
            smPartEnlarger(currentWindowSize);
            $(this).addClass("div-vertical-swiper-active");
            setTimeout(function () {
                navbarSwitcher(currentWindowSize, true);
                $(".div-vertical-swiper").attr("disabled", false);
            }, 350);
        }
    }
});

$(document).on("touchstart", ".div-vertical-swiper", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".div-vertical-swiper", function (event) {
    let moveDirection = handleTouchMove(event);
    $(".div-vertical-swiper").attr("disabled", true);
    if (moveDirection == 2) {
        smPartEnlarger(currentWindowSize);
        setTimeout(function () {
            navbarSwitcher(currentWindowSize, true);
            $(this).addClass("div-vertical-swiper-active");
            $(".div-vertical-swiper").attr("disabled", false);
        }, 350);
    }
    else if (moveDirection == 3) {
        navbarSwitcher(currentWindowSize, false);
        setTimeout(function () {
            smPartDwindler(currentWindowSize);
            $(this).removeClass("div-vertical-swiper-active");
            $(".div-vertical-swiper").attr("disabled", false);
        }, 350);
    }

    xDown = null;
    yDown = null;
});

$(document).on("mouseenter", ".btn-tooltip", function () {
    $(this).tooltip("show");
});
$(document).on("mouseleave", ".btn-tooltip", function () {
    $(this).tooltip("hide");
});

$(document).on("mousedown", "#GetPlaylists_SbmtBtn", function () {
    $("#GetPlaylists_Form").submit();
});