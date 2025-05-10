let currentWindowSize = window.innerWidth;
let currentPageUrl;
let bottomNavbarH = 0;
let intervalValue;
let timeoutValue;
let sentRequest = null;
let openedContainers = [];
let openedCards = [];
const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
let dayOfWeekShortArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let monthsShortArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let trackOrderInQueue = 0;
let reserveOrderInQueue = 0;
let trackQueue = { songs: [], orderChanger: 1, autoPlay: false };
let reserveQueue = [];

//localItemFilter(); SearchForGenres_Form Update Favorites btn-show-field-box
//imagePreviewer() type='file' UpdateTrackCredits_Form Playlists .div-swiper
//SearchForUsers_Form btn-show-the-clock form-control-search ReleaseASingle_Form LoadTheTrack_Form GetPlaylists
//FUNCTION TERRITORY

window.onload = function () {
    displayCorrector(currentWindowSize, true);
    $(".ongaku-alert").fadeOut(0);
    $(".box-lg-part").fadeOut(0);
    $(".box-sm-part-inner").fadeOut(0);
    setTimeout(function () {
        bottomNavbarH = $(".bottom-navbar").innerHeight();
        callAContainer(false, "Primary_Container");
        callTheMusicIsland(currentWindowSize);
    }, 350);
    currentPageUrl = window.location.href;
}

window.onresize = function () {
    currentWindowSize = window.innerWidth;
    displayCorrector(currentWindowSize, false);
    setTimeout(function () {
        bottomNavbarH = $(".bottom-navbar").innerHeight();
        callTheMusicIsland(currentWindowSize);
    }, 350);
}

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

$(document).on("submit", "#ProfileEditPersonal_Info", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.post(url, data, function (response) {
        if (response.success) {
            let fullRealName;
            if (response.result.realName.length > 0) {
                for (let i = 0; i < response.result.realName.length; i++) {
                    if (i == 0) fullRealName = response.result.realName[i];
                    else fullRealName += ", " + response.result.realName[i];
                }
                $("#PersonaInfo_RealName_Lbl").html(fullRealName);
            }
            else $("#PersonaInfo_RealName_Lbl").html("Not Provided");

            if (response.reuslt.countryId > 0) $("#PersonaInfo_CountryInfo_Lbl").html($("#LoadCountries_Btn").html());
            else $("PersonaInfo_CountryInfo_Lbl").html(' <i class="fa-solid fa-flag-checkered"></i> ' + "Country not provided");
            if (response.result.webpageLink != null) $("#WebpageLink_Span").html(response.result.webpageLink);
            else $("#WebpageLink_Span").html("Not Provided");
            callAlert('<i class="fa-solid fa-check-double"></i>', null, null, "Personal information has been updated", 3.5, "Close", 0, null);
        }
        else {
            uncallAContainer(false, "PersonalInfo_Container");
            callAlert('<i class="fa-solid fa-circle-xmark fa-shake" --fa-animation-duration: 0.75s; --fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2;></i>', null, null, "Personal info updating is temporarily unavailable. Please try again later", 3.75, "Close", 0, null);
        }
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
                    studioItemSampler(response.result.id, response.result.title, response.result.coverImageUrl, response.result.genres, response.result.releasedAtDt, 1, "SelfMusic_Box", true);
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

$(document).on("submit", "#GetStudioItems_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                createSmContainer("StudioMusic", "Your Studio ∙ <span id='StudioItemsQty_Span'>0</span>", '<div class="x-row-sliding-only-box mt-2" id="SelfMusic_Box"></div>', null, null, false);
                if (response.result.length > 0) {
                    $("#StudioItemsQty_Span").text(response.result.length);
                    $.each(response.result, function (index) {
                        studioItemSampler(response.result[index].id, response.result[index].title, response.result[index].coverImageUrl, response.result[index].genres, response.result[index].releasedAt, response.result[index].status, "SelfMusic_Box", true);
                    });
                }
                else {
                    $("#SelfMusic_Box").html('<div class="box-bordered text-center p-2"> <h2 class="h2"> <i class="fa-solid fa-headphones"></i> </h2> <h5 class="h5">Your Studio is Empty</h5> <small class="card-text text-muted">Looks like your studio is waiting for some creativity! Upload a new single, EP, album or something else to get started</small> </div>');
                }
                setTimeout(function () {
                    callASmContainer(false, "StudioMusic_Container");
                }, 150);
            }
        }
        else {
            callAlert('<i class="fa-solid fa-microphone-lines-slash"></i>', null, null, "Studio items are temporarily unavailable", 3.75, "Close", -1, null);
        }
    });
});

$("#LoadTheTrack_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            $("#GetTrackLyrics_Id_Val").val(response.result.id);
            $("#GetTrackCredits_Id_Val").val(response.result.id);
            $("#StreamTheTrack_Id_Val").val(response.result.id);
            $("#StreamTheTrack_Url_Val").val(response.result.trackFileUrl);
            if (response.result.isFavorite) {
                $(".btn-track-favor-unfavor").html(' <i class="fa-solid fa-star"></i> ');
                $(".btn-track-favor-unfavor-lg").html(' <i class="fa-solid fa-star"></i> ');
                $("#AddOrRemoveTheTrackAsFavorite_Form").attr("action", "/Playlists/RemoveFromFavorites");
            }
            else {
                $(".btn-track-favor-unfavor").html(' <i class="fa-regular fa-star"></i> ');
                $(".btn-track-favor-unfavor-lg").html(' <i class="fa-regular fa-star"></i> ');
                $("#AddOrRemoveTheAsFavorite_Form").attr("action", "/Playlists/AddToFavorites");
            }
            $(".btn-track-favor-unfavor").attr("data-id", response.result.id);
            $(".btn-track-favor-unfavor-lg").attr("data-id", response.result.id);

            $("#StreamTheTrack_Form").submit();
            buttonUndisabler(false, "GetTrackLyrics_SbmtBtn", null);
            buttonUndisabler(false, "GetTrackCredits_SbmtBtn", null);
            buttonUndisabler(true, "btn-play-pause-track-lg", ' <i class="fa-solid fa-pause"></i> Pause');
            buttonUndisabler(true, "btn-track-favor-unfavor", null);
            buttonUndisabler(true, "btn-track-favor-unfavor-lg", null);
        }
        else {
            $("#GetTrackCredits_Id_Val").val(0);
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
            let trackId = $("#StreamTheTrack_Id_Val").val();
            let playlistId = $("#StreamTheTrack_PlaylistId_Val").val();
            let trackTitleImg = $("#ReleaseInfo_Img").attr("src");
            let title = $("#" + trackId + "-TrackName_Lbl").html();
            let artistsName = $("#" + trackId + "-TrackArtistsName_Lbl").html();
            trackTitleImg = trackTitleImg == undefined ? $("#" + trackId + "-TrackImg_Box").attr("src") : trackTitleImg;
            audioPlay("OngakuPlayer_Audio", trackTitleImg == undefined ? null : trackTitleImg, streamUrl, playlistId, trackId, 0, title, artistsName, null);
        }
        else {

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
                adjustTextareaRows("UTL_Content_Val");
                getElementLength("UTL_Content_Val", "UTL_Content_Val-Indicator_Span", false);
                getElementRows("UTL_Content_Val", "UTL_Content_Val-RowsIndicator_Span", false);
                buttonUndisabler(false, "UpdateTrackLyrics_SbmtBtn", "Save Lyrics");
                $("#UTL_Content_Val").css("height", "auto");
            }
            else {
                $("#DTL_Id_Val").val(0);
                $("#DeleteTrackLyrics_Box").fadeOut(0);
                buttonDisabler(false, "DeleteTrackLyrics_SbmtBtn", null);
            }
            setTimeout(function () {
                slideContainers(null, "EditTrackLyrics_Container");
            }, 150);
        }
        if (response.success) {
            if (response.type == 0) {
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
        }
        else {
            if (response.type == 0) {
                callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-iteration-count: 2; --fa-animation-duration: 0.75s;"></i>', null, null, "This track has no lyrics... yet", 3.25, "Close", -1, null);
                buttonUnchooser(true, "btn-ongaku-player-additional");
                buttonDisabler(false, "GetTrackLyrics_SbmtBtn", baseHtml);           
            }
        }
    });
});

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
            callAlert('<i class="fa-solid fa-font"></i>', null, null, "The track lyrics have been successfully edited", 3.5, "Close", -1, null);
        }
        else {
            callAlert('<i class="fa-solid fa-xmark fa-shake" style="--fa-animation-delay: 0.3s; --fa-animation-duration: 0.75s; --fa-animation-iteration-count: 2;"></i>', null, null, "There appears to be an issue with the entered lyrics and its details. Please review them and try again", 3.75, "Okay", -1, null);
        }
    });
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
                    let resultBox = playlistSampler(response.result.id, 0, response.result.title, response.result.imgUrl != null ? response.result.imgUrl : null, 0, true, 0, response.result.trueId);
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

$(document).on("mousedown", ".btn-close-sm-part-container", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        uncallAProposal();
        uncallASmContainer(false, trueId);
    }
});

$(document).on("submit", "#RemoveThisPlaylist_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(true, "btn-remove-the-playlist", null);
    buttonDisabler(true, "btn-pre-remove-the-playlist", null);

    $.post(url, data, function (response) {
        if (response.success) {
            let statsFullInfoSpan = $("<small class='card-text text-muted' id='PlaylistsStats_Span'></small>");
            let playlistId = $("#" + response.id + "-RemoveThePlaylist_Btn").attr("data-user-playlist-id");
            let playlistsQty = parseInt($("#PlaylistsQty_Span").html());
            let songsQty = $("#PlaylistsSongs_Qty_Span").text();
            playlistsQty = (isNaN(playlistsQty) ? 1 : playlistsQty);
            playlistsQty--;

            $("#PlaylistsStats_Box").empty();
            if (playlistsQty > 1) statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>" + playlistsQty + "</span> playlists containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
            else statsFullInfoSpan.html("<span class='fw-500' id='PlaylistsQty_Span'>One</span> playlist containing <span class='fw-500' id='PlaylistsSongs_Qty_Span'>" + songsQty + "</span> song(s)");
            $("#PlaylistsHeaderQty_Span").text(playlistsQty);
            $("#PlaylistsStats_Box").append(statsFullInfoSpan);

            uncallAProposal();
            buttonUndisabler(true, "btn-remove-the-playlist", null);
            buttonUndisabler(true, "btn-pre-remove-the-playlist", null);
            setTimeout(function () {
                animahider(false, playlistId + "-PlaylistInfo_Box");
                setTimeout(function () {
                    $("#" + playlistId + "-PlaylistInfo_Box").remove();
                }, 750);
                callAlert('<i class="fa-regular fa-circle-check fa-spin" style="--fa-animation-delay: 0.35s; --fa-animation-duration: 0.25s; --fa-animation-iteration-count: 2;"></i>', null, null, "Playlist removed successfully", 3.5, "Got It", -1, null);
            }, 350);
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
            let playlistId = $("#" + response.id + "-RemoveThePlaylist_Btn").attr("data-user-playlist-id");
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
                animahider(false, playlistId + "-PlaylistInfo_Box");
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
                createSmContainer("Playlists", "Playlists ∙ <span id='PlaylistsHeaderQty_Span'>0</span>", "<div class='d-none' id='PlaylistSettingForms_Box'><div class='d-none'><form method='get' action='/Playlists/GetEditInfo' id='GetEditInfo_Form'><input type='hidden' name='Id' id='GEI_Id_Val' value='0' /></form><form method='post' action='/Playlists/EditCoverImage' id='EditPlaylistsCoverImage_Form'> <input type='hidden' name='Id' id='EPCI_Id_Val' value='0' /> <input type='file' name='ImageUrl' id='EPCI_ImageUrl_Val' data-trigger='EditPlaylistsCoverImage_Form' accept='image/png, image/gif, image/jpeg' /> </form> </div> <form method='get' action='/Playlists/GetShortname' id='GetPlaylistShortname_Form'><input type='hidden' name='Id' id='GPS_Id_Val' value='0' /></form><form method='post' action='/Playlists/Pin' id='PinThePlaylist_Form'> <input type='hidden' name='Id' id='PTP_Id_Val' value='0' /> </form> <form method='post' action='/Playlists/Unpin' id='UnpinThePlaylist_Form'> <input type='hidden' name='Id' id='UnTP_Id_Val' value='0' /> </form>    <form method='post' action='/Playlists/Remove' id='RemoveThisPlaylist_Form'> <input type='hidden' name='Id' id='RTP_Id_Val' value='0' /> </form></div><div class='box-standard' id='PlaylistsListed_Box'></div><div class='box-standard mt-2' id='PlaylistsStatsInfoMain_Box'></div>", null, null, false);
                $("#PlaylistsListed_Box").empty();
                $("#PlaylistsHeaderQty_Span").text(response.count + 1);
                let songsTotalQty = response.favoriteSongsQty;
                let statsFullInfoBox = $("<div class='box-standard text-center mt-1 p-1' id='PlaylistsStats_Box'></div>");
                let statsFullInfoSpan = $("<small class='card-text text-muted' id='PlaylistsStats_Span'></small>");
                let favoriteElement = playlistSampler("fvr", 2, "Favorites", null, response.favoriteSongsQty, true, 2, "fvr");
                if (favoriteElement != null) $("#PlaylistsListed_Box").append(favoriteElement);

                if (response.count > 0) {
                    $.each(response.result, function (index) {
                        let element = playlistSampler(response.result[index].id, response.result[index].albumId == null ? 0 : 1, response.result[index].playlist.name, response.result[index].playlist.imageUrl, response.result[index].playlist.songsQty, true, response.result[index].pinOrder, response.result[index].playlistId);
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
                    createHeadlessContainer("TrackManagement", '<div class="hstack gap-1 mt-1"> <h6 class="h6" id="ATP_ChosenPlaylistsQty_Lbl">No Chosen Playlist</h6> <div class="ms-auto"> <form method="post" action="/Playlists/AddToPlaylist" id="AddToPlaylist_Form"> <input type="hidden" name="Id" id="ATP_Id_Val" /> <div class="d-none" id="ATP_ChosenPlaylists_Box"> </div> <button type="submit" class="btn btn-standard-bolded btn-sm super-disabled" id="AddToPlaylist_SbmtBtn">Save</button> </form> </div> </div>', '<div class="box-standard p-1"> <div class="form-control-search-container"> <span class="card-text text-muted"> <i class="fa-solid fa-magnifying-glass"></i> </span> <input type="text" class="form-control form-control-search" id="ATP_PlaylistsSearch_Val" maxlength="100" placeholder="Find in Playlists" /> </div> <div class="box-standard mt-2"> <h6 class="h6">Available Playlists</h6> <div class="box-standard mt-1" id="AvailablePlaylists_Box"> </div> </div> </div>', false);
                    $("#AvailablePlaylists_Box").empty();
                    $(".track-adding-to-favorites-val").remove();
                    $("#ATP_ChosenPlaylistsQty_Lbl").text("No Chosen Playlist");
                    $.each(response.result, function (index) {
                        let playlistBox = trackManagemenetPlaylistsSampler(response.result[index].playlistId, response.result[index].id, response.result[index].playlist.name, response.result[index].playlist.imageUrl, false);
                        if (playlistBox != null) {
                            $("#AvailablePlaylists_Box").append(playlistBox);
                        }
                    });
                    displayCorrector(currentWindowSize, false);
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
            displayCorrector(currentWindowSize, false);
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

            displayCorrector(currentWindowSize, false);
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

$(document).on("mousedown", ".btn-remove-the-playlist", function () {
    let thisId = $(this).attr("data-id");
    if (thisId != undefined) {
        $("#RTP_Id_Val").val(thisId);
        $("#RemoveThisPlaylist_Form").submit();
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

$(document).on("submit", "#GetSingleInfo_Form", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.result != null) {
                singleSampler(response.isForAuthor, response.result.isFavorite, response.result.id, response.result.status, response.result.title, response.result.coverImageUrl, response.result.genres, response.result.releasedAt, response.result.user, response.result.userId, response.result.trackArtists, response.result.trackFileUrl);
            }
            displayCorrector(currentWindowSize, false);
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
                for (let i = 0; i < response.result.length; i++) {
                    songsArr.push(response.result[i].track);
                }
                playlistInfoSampler(response.userId, -256, "Favorite Songs", 3, null, new Date(), response.count, 0, "You", null, songsArr, false);
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
            $("#ATP_Id_Val").val(0);
            buttonUndisabler(false, "AddToPlaylist_SbmtBtn", baseHtml);
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
            let checkInputAvailability = document.getElementById(playlistId + "-ATP_InputId_Val");
            if (checkInputAvailability != null) {
                $("#" + playlistId + "-ATP_InputId_Val").remove();
                $("#" + playlistId + "-MarkThePlaylist_Box").removeClass("bg-chosen-bright");
                $("#" + playlistId + "-MarkThePlaylist_Box").removeClass("btn-unmark-the-playlist");
                $("#" + playlistId + "-MarkThePlaylist_Box").addClass("btn-mark-the-playlist");
                $("#" + playlistId + "-MarkThePlaylist_Status_Span").html(' <i class="fa-regular fa-circle"></i> Not Chosen');
                allChosenPlaylists = document.getElementsByClassName("btn-unmark-the-playlist");
            }
        }
        else {
            let checkInputAvailability = document.getElementById(playlistId + "-ATP_InputId_Val");
            if (checkInputAvailability == null) {
                let inputVal = $("<input type='hidden' class='track-adding-to-favorites-val' />");
                inputVal.val(playlistId);
                inputVal.attr("name", "PlaylistIds");
                inputVal.attr("id", playlistId + "-ATP_InputId_Val");
                $("#ATP_ChosenPlaylists_Box").append(inputVal);
                $("#" + playlistId + "-MarkThePlaylist_Box").removeClass("btn-mark-the-playlist");
                $("#" + playlistId + "-MarkThePlaylist_Box").addClass("btn-unmark-the-playlist bg-chosen-bright");
                $("#" + playlistId + "-MarkThePlaylist_Status_Span").html(' <i class="fa-regular fa-circle-check"></i> Chosen');
                allChosenPlaylists = document.getElementsByClassName("btn-unmark-the-playlist");
            }
        }

        if (allChosenPlaylists != undefined && allChosenPlaylists.length > 0) {
            buttonUndisabler(false, "AddToPlaylist_SbmtBtn", "Save");
            if (allChosenPlaylists.length == 1) $("#ATP_ChosenPlaylistsQty_Lbl").text("One Chosen Playlist");
            else $("#ATP_ChosenPlaylistsQty_Lbl").text(allChosenPlaylists.length + " Chosen Playlist");
        }
        else {
            $("#AddToPlaylist_SbmtBtn").addClass("super-disabled");
            $("#ATP_ChosenPlaylistsQty_Lbl").text("No Chosen Playlist");
        }
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

            playlistInfoSampler(response.userId, response.result.id, response.result.name, 0, imageUrl, new Date(response.result.createdAt), response.result.songsQty, response.result.userId, response.result.user.nickname, response.result.user.imgUrl, null, false);
            displayCorrector(currentWindowSize, false);
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
            if (response.skip > 0) {
                songsApplier(0, response.result, "PlaylistInfo_TrackBoxes_Box", "PlaylistInfo_SongsQty_Span", true);
            }
            else {
                songsApplier(0, response.result, "PlaylistInfo_TrackBoxes_Box", "PlaylistInfo_SongsQty_Span", false);
            }
            $("#GPT_Skip_Val").val(fullSkipQty);
        }
        else {

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
    let isUntrackable = $(this).attr("data-untrack");
    if ((trueId != undefined) && (isUntrackable == undefined || isUntrackable == false)) {
        console.log(trueId);
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

$("#GetCountries_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();
    buttonDisabler(true, "btn-load-countries", "Loading...");
   
    $.get(url, data, function (response) {
        if (response.success) {
            createInsideLgCard("CountriesList", "Countries (Listed)", '<div class="box-standard p-2 pt-0"> <div class="form-control-search-container"> <span class="form-control-search-icon" id="CountriesListed_Search_Val-Icon_Span"><i class="fa-solid fa-magnifying-glass"></i></span> <input type="text" class="form-control form-control-search" autocomplete="off" placeholder="Search" id="CountriesListed_Search_Val" data-search-in="country-search-member" /> </div> <div class="mt-2" id="CountriesListed_Box"> </div> </div>', null, null);
            setTimeout(function () {
                $.each(response.result, function (index) {
                    let countryFlagImg = createCountryFlagIcon(response.result[index].shortname, 20, 15);
                    let countryBtn = $("<button type='button' class='btn btn-standard btn-sm text-start country-search-member w-100'></button>");
                    let countryNameSpan = $("<span class='ms-1'></span>");
                    countryNameSpan.html(response.result[index].name);
                    countryBtn.append(countryFlagImg);
                    countryBtn.append(countryNameSpan);
                    countryBtn.attr("id", response.result[index].id + "-Country_Btn");

                    $("#CountriesListed_Box").append(countryBtn);
                });
                callAContainer(false, "CountriesList_Container", true);
                $(".btn-load-countries").attr("data-is-loaded", true);
            }, 150);
        }
        else {
            callAlert('<i class="fa-solid fa-globe"></i>', null, null, "Countries are temporarily unavailable. Please try again later", 3.5, "Close", 0, null);
        }
        buttonUndisabler(true, "btn-load-countries", "Tap to Show");
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
        createInsideLgCard()
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

$(document).on("mousedown", ".btn-slide-boxes", function () {
    let closingBoxId = $(this).attr("data-close-box");
    let openingBoxId = $(this).attr("data-open-box");
    let thisId = $(this).attr("id");
    if (thisId != undefined && closingBoxId != undefined && openingBoxId != undefined) {
        slideBoxes(false, closingBoxId, openingBoxId);
        $("#" + thisId).attr("data-open-box", closingBoxId);
        $("#" + thisId).attr("data-close-box", openingBoxId);
        if ($("#" + thisId).hasClass("bg-chosen") || $("#" + thisId).hasClass("bg-chosen-bright")) {
            buttonUnchooser(false, thisId);
        }
        else {
            let needBold = $(this).attr("data-bold");
            if (needBold != undefined) buttonChooser(false, thisId, true);
            else buttonChooser(false, thisId, false);
        }
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
        console.log(isActive);
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

$(document).on("mousedown", ".btn-close-sm-container", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != undefined) {
        uncallAContainer(false, trueId);
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

$("#SearchForGenres_Form").on("submit", function (event) {
    event.preventDefault();
    let url = $(this).attr("action");
    let data = $(this).serialize();

    $.get(url, data, function (response) {
        if (response.success) {
            if (response.type == 1) {
                createInsideLgCard("ChooseGenres", "Choose Genres ∙ " + response.count, "<div class='box-standard'><span class='card-text fs-6 ms-1' id='GenreSearchKeyword_Lbl'></span></div><div class='box-standard mt-1' id='FoundGenresListed_Box'></div></div>", null, null);
                $("#FoundGenresListed_Box").empty();
                $("#FoundGenresListed_Box").append("<div class='box-standard' id='FoundGenres_Box'><div class='form-control-search-container mb-1'><span class='form-control-search-icon' id='GenreNativeSearch_Val-Icon_Span'><i class='fa-solid fa-magnifying-glass'></i></span><input type='text' class='form-control form-control-search' placeholder='Search for genres' id='GenreNativeSearch_Val' data-search-in='btn-add-as-genre' /></div></div>");
                if (response.keyword == null) $("#GenreSearchKeyword_Lbl").html("All available genres are listed");
                else $("#GenreSearchKeyword_Lbl").html("Matching genres for <span class='fw-500'>'" + response.keyword + "'</span>");

                $.each(response.result, function (index) {
                    let genreBtn = $("<button type='button' class='btn btn-standard-bordered btn-add-as-genre w-100 mt-1'></button>");
                    genreBtn.html(response.result[index].name);
                    genreBtn.attr("id", response.result[index].id + "-AddAsGenre_Btn");
                    $("#FoundGenresListed_Box").append(genreBtn);
                });
                displayCorrector(currentWindowSize, false);
                setTimeout(function () {
                    callAContainer(false, "ChooseGenres_Container", false);
                });
            }
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
$(document).on("change", "#SearchForGenres_Keyword_Val", function () {
    $("#SearchForGenres_Form").submit();
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
    }
});

$(document).on("mousedown", ".btn-decrease-the-value", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let step = $(this).attr("data-step");
        let minValue = $("#" + target).attr("min");
        minValue = minValue != undefined ? minValue : 0;
        if (parseFloat(step) != undefined) step = parseFloat(step);
        else step = 1;

        if ($("#" + target).val() - step > minValue) $("#" + target).val(parseFloat($("#" + target).val()) - step);
        else $("#" + target).val(minValue);
        $("#" + target).change();
    }
});
$(document).on("mousedown", ".btn-increase-the-value", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        let step = $(this).attr("data-step");
        let maxValue = $("#" + target).attr("max");
        maxValue = maxValue != undefined ? maxValue : 999999;
        if (parseFloat(step) != undefined) step = parseFloat(step);
        else step = 1;

        if ($("#" + target).val() + step < maxValue) $("#" + target).val(parseFloat($("#" + target).val()) + step);
        else $("#" + target).val(maxValue);
        $("#" + target).change();
    }
});

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

$(document).on("mousedown", "input[type='file']", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) $("#" + thisId).click();
});
$(document).on("input", "input[type='file']", function () {
    let thisId = $(this).attr("id");
    let files = $("#" + thisId).get(0).files;
    let trigger = $(this).attr("data-trigger");
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
        let dataPreview = $(this).attr("data-preview");
        let orderTarget = $(this).attr("data-order-target");
        if (isMultiple != undefined) {
            if (!areAudio) imagePreviewer(files, trigger != undefined ? trigger : null, orderTarget, true, true, dataPreview);
            else audioPreviewer(files, trigger != undefined ? trigger : null, orderTarget, true, true);
        }
        else {
            if (!areAudio) imagePreviewer(files, trigger != undefined ? trigger : null, orderTarget, false, true, dataPreview);
            else audioPreviewer(files, trigger != undefined ? trigger : null, orderTarget, false, true);
        }
    }
});

$(document).on("mousedown", ".btn-input-file-emptier", function () {
    let target = $(this).attr("data-target");
    let thisId = $(this).attr("id");
    if (target != undefined && thisId != undefined) {
        thisId = getTrueId(thisId, false);
        $("#" + target).val(null);
        if (thisId != undefined) {
            $("#" + thisId).fadeOut(0);
            $("#" + thisId + "_Box").fadeIn(0);
            $("#" + thisId).attr("src", "#");
            $(this).addClass("super-disabled");
        }
    }
});

$(document).on("mousedown", ".btn-trigger", function () {
    let triggerElement = $(this).attr("data-trigger");
    if (triggerElement != undefined) {
        $("#" + triggerElement).mousedown();
    }
});

$(document).on("change", ".form-control-trigger", function () {
    let triggeringElement = $(this).attr("data-trigger");
    if (triggeringElement != undefined) {
        let triggerActivationInterval = $(this).attr("data-trigger-interval");
        let idleLabel = $(this).attr("data-idle-label");
        if (idleLabel != undefined) {
            let idleText = $(this).attr("data-idle-text");
            if (idleText != undefined) $("#" + idleLabel).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + idleText);
            else $("#" + idleLabel).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Pending...');
        }

        clearTimeout(timeoutValue);
        triggerActivationInterval = triggerActivationInterval != undefined ? parseFloat(triggerActivationInterval) : 1.75;
        $("#" + triggeringElement).val($(this).val());
        timeoutValue = setTimeout(function () {
            $("#" + triggeringElement).change();
        }, triggerActivationInterval * 1000);
    }
});

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
        const element = document.getElementById("OngakuPlayer_Audio");
        if (element != null) {
            let playlistId = null;
            let isForPreview = $(this).attr("data-preview");
            if (isForPreview) {
                let objectSrc = $(this).attr("data-src");
                let objectTitle = $(this).attr("data-title");
                let trackId = $(this).attr("data-order-index");
                let currentSrc = document.getElementById("OngakuPlayer_Audio").src;

                if ((objectSrc != undefined) && (currentSrc == objectSrc)) {
                    let currentTime = document.getElementById("OngakuPlayer_Audio").currentTime;
                    audioPlay("OngakuPlayer_Audio", objectSrc, playlistId, trackId, currentTime, objectTitle, "Track Preview", null);
                }
                else audioPlay("OngakuPlayer_Audio", objectSrc, playlistId, trackId, 0, objectTitle, "Track Preview", null);
            }
            else {
                let thisId = $(this).attr("data-id");
                let currentTrackId = $("#OngakuPlayer_TrackId_Val").val();
                let currentPlaylistId = $("#OngakuPlayer_PlaylistId_Val").val();
                if (element.paused) {
                    if (thisId == undefined) audioContinue("OngakuPlayer_Audio", currentTrackId);
                    else {
                        if ((currentTrackId == thisId) && (playlistId == null || currentPlaylistId == playlistId)) audioContinue("OngakuPlayer_Audio", thisId);
                        else {
                            trackOrderInQueue = trackQueue.songs.indexOf(parseInt(thisId), 0);
                            trackOrderInQueue = trackOrderInQueue != -1 ? trackOrderInQueue : 0;
                            audioChange("OngakuPlayer_Audio", playlistId, thisId);
                        }
                    }
                }
                else audioPause("OngakuPlayer_Audio");
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

$("audio").on("ended", function () {
    let thisId = $(this).attr("id");
    if (thisId != undefined) {
        trackQueue.orderChanger = trackQueue.orderChanger < 0 ? 1 : trackQueue.orderChanger;
        let playlistId = $("#OngakuPlayer_PlaylistId_Val").val();
        let trackId = getTrackFromQueue(trackQueue.songs, trackOrderInQueue, trackQueue.orderChanger, trackQueue.autoPlay);
        if (trackId != null) audioChange("OngakuPlayer_Audio", playlistId, trackId);
        else audioPause("OngakuPlayer_Audio");
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

$(document).on("mousedown", ".btn-text-format-script", function () {
    let target = $("#TextFormat_Target_Val").val();
    let type = $(this).attr("data-type");
    if (target != undefined && type != undefined) {
        let selectionStart = $("#UMI_Description_Val").prop("selectionStart");
        let selectionEnd = $("#UMI_Description_Val").prop("selectionEnd");
        let result = textFormatting("UMI_Description_Val", type, selectionStart, selectionEnd);
        if (result != null) $("#" + target).val(result);
    }
});

$(document).on("mousedown", ".btn-text-deformatting", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != null) {
        let value = $("#" + trueId).val();
        value = textDeformatting(value);
        if (value != null) {
            $("#" + trueId).fadeOut(300);
            $("#" + trueId + "-PreviewText_Lbl").html(value);
            $(this).addClass("btn-text-deformatting-off");
            $(this).removeClass("btn-text-deformatting");
            $(this).html(' <i class="fa-solid fa-circle-stop"></i> Stop Previewing');
            setTimeout(function () {
                $("#" + trueId + "-Preview_Box").fadeIn(300);
            }, 300);
            uncallAContainer(false, "TextFormatting_Container");
        }
    }
});

$(document).on("mousedown", ".btn-text-deformatting-off", function () {
    let trueId = getTrueId($(this).attr("id"));
    if (trueId != null) {
        $("#" + trueId + '-Preview_Box').fadeOut(300);
        $(this).html(' <i class="fa-solid fa-spell-check"></i> Preview');
        $(this).addClass("btn-text-deformatting");
        $(this).removeClass("btn-text-deformatting-off");
        setTimeout(function () {
            $("#" + trueId).fadeIn(300);
        }, 300);
    }
});

$(document).on("mousedown", ".btn-open-text-formatting", function () {
    let trueId = getTrueId($(this).attr("id"), true);
    if (trueId != undefined) {
        $("#TextFormat_Target_Val").val(trueId);
        createInsideLgCard("TextFormatting", "Text Format", '<div class="hstack gap-2"> <div class="d-none"> <input type="hidden" id="TextFormat_Target_Val" value="UMI_Description_Val" /> </div> <div class="x-row-sliding-only-box"> <button type="button" class="btn btn-text-format btn-text-format-script fs-5 fw-500 me-1" data-type="0">Heading</button> <button type="button" class="btn btn-text-format btn-text-format-script fs-6 fw-500 me-1" data-type="1">Subheading</button> <button type="button" class="btn btn-text-format btn-text-format-script fw-500 me-1" data-type="2">Label</button> <button type="button" class="btn btn-text-format btn-text-format-script me-1" data-type="3">Text</button> <button type="button" class="btn btn-text-format btn-text-format-script code-similar-font me-1" data-type="4">Monospaced</button> </div> <div class="ms-auto"> </div> </div>');
        setTimeout(function () {
            callAContainer(false, "TextFormatting_Container");
        }, 150);
    }
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

$(document).on("mousedown", ".btn-volume-mute", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        audioEdit(target, 0, null, null, null);
    }
});

$(document).on("mousedown", ".btn-volume-max", function () {
    let target = $(this).attr("data-target");
    if (target != undefined) {
        audioEdit(target, 100, null, null, null);
    }
});

$(document).on("input", ".volume-range-slider", function () {
    let currentValue = parseFloat($(this).val());
    let target = $(this).attr("data-target");

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

$(document).on("mousedown", ".btn-ongaku-player-extend", function () {
    if ($("#OngakuPlayerMainPart_Box").css("display") != "none") showBySlidingToRight(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    else hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
});

$(document).on("dblclick", ".ongaku-player-box", function () {
    if (!$(this).hasClass("ongaku-player-box-enlarged")) enlargeMusicIsland(currentWindowSize);
});
$(document).on("mousedown", ".ongaku-div-swiper", function () {
    dwindleMusicIsland(currentWindowSize);
});

$(document).on("touchstart", ".ongaku-player-box", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".ongaku-player-box", function (event) {
    let moveDirection = handleTouchMove(event);
    if (moveDirection == 1) enlargeMusicIsland(currentWindowSize);
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
        $("." + closingBox).fadeOut(300);
        setTimeout(function () {
            if (divExists == null) $("." + openingBox).fadeIn(300);
            else $("#" + openingBox).fadeIn(300);
        }, 300);
    }
    else {
        $("#" + closingBox).fadeOut(300);
        setTimeout(function () {
            $("#" + openingBox).fadeIn(300);
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
    let fullDuration = durationInMins * 60 + seconds;
    return fullDuration;
}

function playlistSampler(id, type, title, coverImageUrl, songsQty, isForAuthor = false, pinOrder = 0, trueId = 0) {
    if (id != null && title != null) {
        let playlistBox = $("<div class='playlist-box mb-1'></div>");
        let playlistBoxStack = $('<div class="btn-get-playlist-info hstack gap-1"></div>');
        let playlistImg;
        let playlistInfoBox = $("<div class='ms-1'></div>");
        let playlistNameTitle = $("<span class='h6'></h6>");
        let playlistInfoSeparator = $("<br/>");
        let playlistBadge = $("<span class='badge badge-standard'></span>");
        let playlistSongsQtySpan = $("<small class='card-text text-muted'></small>");
        let playlistStatsSpan = $("<span class='card-text'></span>");
        let playlistDropdownBox = $("<div class='dropdown ms-auto' data-untrack='true'></div>");
        let playlistDropdownBtn = $('<button class="btn btn-standard ms-auto" type="button" data-bs-toggle="dropdown" data-untrack="true" aria-expanded="false"> <i class="fa-solid fa-ellipsis"></i> </button>');
        let playlistDropdownUl = $("<ul class='dropdown-menu shadow-sm' data-untrack='true'></ul>");
        let playlistDropdownLi0 = $("<li></li>");
        let playlistDropdownLi1 = $("<li></li>");
        let playlistDropdownLi2 = $("<li></li>");
        let playlistDropdownLi3 = $("<li></li>");
        let playlistDropdownLi4 = $("<li></li>");
        let playlistDropdownLi5 = $("<li></li>");
        let playlistDropdownBtn0 = $("<button type='button' class='dropdown-item btn-edit-playlist btn-sm'>Edit <span class='float-end ms-1'> <i class='fa-solid fa-pencil'></i> </span</button>");
        let playlistDropdownBtn1 = $("<button type='button' class='dropdown-item btn-edit-playlist-shortname btn-sm'>Shortname <span class='float-end ms-1'> <i class='fa-solid fa-at'></i> </span</button>");
        let playlistDropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Cover Image <span class='float-end ms-1'> <i class='fa-solid fa-panorama'></i> </span></button>");
        let playlistDropdownBtn3 = $("<button type='button' class='dropdown-item'>Pin <span class='float-end ms-1'> <i class='fa-solid fa-thumbtack'></i> </span></button>");
        let playlistDropdownBtn4 = $("<button type='button' class='dropdown-item'>Reorder <span class='float-end ms-1'> <i class='fa-solid fa-sort'></i> </span></button>");
        let playlistDropdownBtn5 = $("<button type='button' class='dropdown-item btn-pre-remove-the-playlist'>Remove <span class='float-end ms-1'> <i class='fa-solid fa-folder-minus'></i> </span></button>");

        playlistNameTitle.html(title);
        playlistNameTitle.attr("id", trueId + "-PlaylistTitle_Lbl");
        if (songsQty > 0) playlistSongsQtySpan.text(parseInt(songsQty) > 1 ? " ∙ " + songsQty + " songs" : " ∙ One song");
        else playlistSongsQtySpan.text(" ∙ No Songs");
        //playlistInfoSampler
        if (isForAuthor && trueId > 0) {
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
        playlistDropdownBtn5.attr("id", trueId + "-RemoveThePlaylist_Btn");
        playlistDropdownBtn5.attr("data-user-playlist-id", id);

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

        playlistBox.attr("id", trueId + "-PlaylistInfo_Box");
        playlistBoxStack.attr("id", trueId + "-GetPlaylistInfo_Box");

        if (coverImageUrl != null) {
            playlistImg = $("<img class='release-img-sm' alt='This image cannot be displayed yet' />");
            playlistImg.attr("src", "/PlaylistCovers/" + coverImageUrl);
        }
        else {
            playlistImg = $("<div class='release-img-box-sm'></div>");
            playlistImg.html(' <i class="fa-solid fa-wave-square"></i> ');
        }
        playlistImg.attr("id", trueId + "-PlaylistInfo_Img");

        switch (parseInt(type)) {
            case 0:
                playlistBadge.html(' <i class="fa-solid fa-wave-square"></i> Playlist');
                if (coverImageUrl == null) playlistImg = $('<div class="release-img-box-sm"> <i class="fa-solid fa-wave-square"></i> </div>');
                break;
            case 1:
                playlistBadge.html(' <i class="fa-solid fa-record-vinyl"></i> Album');
                if (coverImageUrl == null) playlistImg = $('<div class="release-img-box-sm"> <i class="fa-solid fa-record-vinyl"></i> </div>');
                break;
            case 2:
                playlistBadge.html(' <i class="fa-solid fa-star"></i> Favorites');
                if (coverImageUrl == null) playlistImg = $('<div class="release-img-box-sm text-primary"> <i class="fa-solid fa-star"></i> </div>');
                break;
            default:
                playlistBadge.html(' <i class="fa-solid fa-wave-square"></i> Playlist');
                if (coverImageUrl == null) playlistImg = $('<div class="release-img-box-sm"> <i class="fa-solid fa-wave-square"></i> </div>');
                break;
        }
        playlistStatsSpan.attr("id", id + "-PlaylistStats_Span");

        playlistStatsSpan.append(playlistBadge);
        playlistStatsSpan.append(playlistSongsQtySpan);
        playlistInfoBox.append(playlistNameTitle);
        playlistInfoBox.append(playlistInfoSeparator);
        playlistInfoBox.append(playlistStatsSpan);
        playlistBoxStack.append(playlistImg);
        playlistBoxStack.append(playlistInfoBox);
        if (isForAuthor) {
            playlistDropdownLi0.append(playlistDropdownBtn0);
            playlistDropdownLi1.append(playlistDropdownBtn1);
            playlistDropdownLi2.append(playlistDropdownBtn2);
            playlistDropdownLi3.append(playlistDropdownBtn3);
            playlistDropdownLi4.append(playlistDropdownBtn4);
            playlistDropdownLi5.append(playlistDropdownBtn5);
            playlistDropdownUl.append(playlistDropdownLi0);
            playlistDropdownUl.append(playlistDropdownLi1);
            playlistDropdownUl.append(playlistDropdownLi2);
            playlistDropdownUl.append(playlistDropdownLi3);
            playlistDropdownUl.append(playlistDropdownLi4);
            playlistDropdownUl.append(playlistDropdownLi5);
            playlistDropdownBox.append(playlistDropdownBtn);
            playlistDropdownBox.append(playlistDropdownUl);
            playlistBoxStack.append(playlistDropdownBox);
        }
        playlistBox.append(playlistBoxStack);

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
        let playlistIsChosenSpan = $("<small class='card-text text-muted'></small>");

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
    let divExists = document.getElementById(id);
    if (divExists == null) {
        $("body").append('<div class="box-lg-part-inner shadow-sm" id="' + id + '_Container"> <div class="box-lg-inner-part-header p-2"> <div class="div-swiper mx-auto" id="' + id + '_Container-Swiper"></div> <div class="hstack gap-1" id="' + id + '-HeaderBtns_Box"> <button type="button" class="btn btn-standard btn-back btn-sm"> <i class="fa-solid fa-chevron-left"></i> Back</button> <div class="ms-2"> <span class="h5" id="' + id + '_Container-Header_Lbl"></span> </div> </div> </div> <div class="mt-1 p-1" id="' + id + '_Box"></div></div>');
        $("#" + id + "_Container-Header_Lbl").html(title);
        $("#" + id + "_Box").append(body);
        if (headerBtn1 != null) {
            let headerStackRightPartBox = $("<div class='ms-auto'></div>");
            headerStackRightPartBox.append(headerBtn1);
            $("#" + id + "-HeaderBtns_Box").append(headerStackRightPartBox);
            if (headerBtn2 != null) headerStackRightPartBox.append(headerBtn2);
        }

        if (currentWindowSize < 1024) {
            $(".box-sm-part-inner").css("left", "0.75%");
            $(".box-sm-part-inner").css("width", "98.25%");
        }
        else {
            $(".box-lg-part-inner").css("left", "37.5%");
            $(".box-lg-part-inner").css("width", "62%");
        }
    }
}

function createAContainer(id, title, body, headerBtn1 = null, headerBtn2 = null) {
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
}

function createHeadlessContainer(id, headerHtml, body, openOnCreate = false) {
    let divExists = document.getElementById(id + "_Container");
    if (divExists == null) {
        $("body").append('<div class="box-lg-part shadow-sm" id="' + id + '_Container"> <div class="box-lg-part-header p-2" id="' + id + '-Header"> <div class="div-swiper mx-auto" id="' + id + '_Container-Swiper"></div> <div class="mt-1" id="' + id + '-Header_Box"></div> </div> <div class="box-lg-part-body mt-5" id="' + id + '_Box"></div></div>');
        $("#" + id + "_Box").append(body);
        if (headerHtml != null || headerHtml != undefined) {
            $("#" + id + "-Header_Box").append(headerHtml);
        }
        displayCorrector(currentWindowSize, false);
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

function textDeformatting(value) {
    if (value != null) {
        value = value.replaceAll("[[", "<span>");
        value = value.replaceAll("[!", "<h5 class='h5'>");
        value = value.replaceAll("[@", "<h6 class='h6'>");
        value = value.replaceAll("[#", "<span class='card-text fw-500'>");
        value = value.replaceAll("[$", "<span class='card-text code-similar-font'>");
        value = value.replaceAll("@]", "</h6>");
        value = value.replaceAll("!]", "</h5>");
        value = value.replaceAll("]]", "</span>");

        return value;
    }
    else return null;
}

function textFormatting(target, type, startIndex, endIndex) {
    let text;
    if (target != null && type != null) {
        text = $("#" + target).val();
        let textBefore;
        let textAfter;
        if (startIndex != endIndex && startIndex > 0) {
            textBefore = text.substring(0, startIndex);
            textAfter = text.substring(endIndex, text.length);
            text = text.substring(startIndex, endIndex);
        }
        else {
            textBefore = text.substring(0, startIndex);
            textAfter = text.substring(endIndex, text.length);
            text = "";
        }

        switch (parseInt(type)) {
            case 0:
                text = "[!" + text + "!]";
                break;
            case 1:
                text = "[@" + text + "@]";
                break;
            case 2:
                text = "[#" + text + "]]";
                break;
            case 3:
                text = "[[" + text + "]]";
                break;
            case 4:
                text = "[$" + text + "]]";
                break;
            default:
                text = "[!" + text + "]]";
                break;
        }
        if (startIndex != endIndex && startIndex > 0) text = textBefore + text + textAfter;
        else text = textBefore + textAfter + text;
        return text;
    }
    else return null;
}

function getElementLength(id, indicatorId, isText = false) {
    if (id != null) {
        let maxLength = 0;
        let currentLength = 0;
        if (!isText) {
            currentLength = $("#" + id).val().length;
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

function callASmContainer(callByClassname, id) {
    let isNowOpen = false;
    let isPlayerActive = $(".ongaku-player-box").css("bottom");
    $(".btn-sticky-at-bottom").css("opacity", 0);
    $(".box-sticky-at-bottom").css("opacity", 0);
    let anySideBar = document.getElementsByClassName("side-navbar");

    if (anySideBar != null && anySideBar.length > 0) {
        $(".box-sm-part-inner").css("left", "6%");
        $(".box-sm-part-inner").css("width", "93.25%");
    }
    if (isPlayerActive != undefined) isPlayerActive = parseInt(parseInt($(".ongaku-player-box").css("bottom")) + $(".ongaku-player-box").innerHeight());
    if (callByClassname) {
        let elements = document.getElementsByClassName(id);
        if (elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                if ($("#" + elements[i].id).css("display") == "block") {
                    isNowOpen = true;
                    break;
                }
            }
        }
        else isNowOpen = false;
    }
    else {
        if ($("#" + id).css("display") == "block") isNowOpen = true;
        else isNowOpen = false;
    }

    if (parseInt(currentWindowSize) < 1024) {
        let alertBottom = bottomNavbarH;
        if (isPlayerActive != undefined && parseInt(isPlayerActive) > 0) alertBottom += isPlayerActive;
        if (callByClassname) {
            if (isNowOpen) {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", alertBottom + "px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom + "px");
                }, 600);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom - 50 + "px");
                }, 900);
            }
            else {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", alertBottom + "px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom - 50 + "px");
                }, 300);
            }
        }
        else {
            if (isNowOpen) {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", alertBottom + "px");
                setTimeout(function () {
                    $("#" + id).css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + "px");
                }, 600);
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom - 50 + "px");
                }, 900);
            }
            else {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", alertBottom + "px");
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom - 50 + "px");
                }, 300);
            }
        }
    }
    else {
        let alertBottom = 10;
        if (isPlayerActive != undefined && parseInt(isPlayerActive) > 0) alertBottom += isPlayerActive;
        if (callByClassname) {
            if (isNowOpen) {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", alertBottom + 45 + "px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom + 55 + "px");
                }, 600);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom  + "px");
                }, 900);
            }
            else {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", alertBottom + 55 + "px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom + "px");
                }, 300);
            }
        }
        else {
            let alertBottom = 10;
            if (isPlayerActive != undefined && parseInt(isPlayerActive) > 0) alertBottom += isPlayerActive;
            if (isNowOpen) {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", alertBottom + 45 + "px");
                setTimeout(function () {
                    $("#" + id).css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + 55 + "px");
                }, 600);
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + "px");
                }, 900);
            }
            else {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", alertBottom + 55 + "px");
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + "px");
                }, 300);
            }
        }
    }
}

function uncallASmContainer(callByClassname, id) {
    if (callByClassname) {
        if (currentWindowSize < 1024) {
            let alertBottom = bottomNavbarH;
            $(".box-sm-part-inner").css("bottom", alertBottom + 65 + "px");
            setTimeout(function () {
                $(".box-sm-part-inner").css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $(".box-sm-part-inner").fadeOut(0);
            }, 600);
        }
        else {
            $(".box-sm-part-inner").css("bottom", "50px");
            setTimeout(function () {
                $(".box-sm-part-inner").css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $(".box-sm-part-inner").fadeOut(0);
            }, 600);
        }
    }
    else {
        if (currentWindowSize < 1024) {
            let alertBottom = bottomNavbarH;
            $("#" + id).css("bottom", alertBottom + 65 + "px");
            setTimeout(function () {
                $("#" + id).css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $("#" + id).fadeOut(0);
            }, 600);
        }
        else {
            $("#" + id).css("bottom", "50px");
            setTimeout(function () {
                $("#" + id).css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $("#" + id).fadeOut(0);
            }, 600);
        }
    }
    $(".btn-sticky-at-bottom").css("opacity", 1);
    $(".box-sticky-at-bottom").css("opacity", 1);
}

function uncallAContainer(callByClassname, id) {
    let newOpenedContainersArr = [];
    let alertBottom = bottomNavbarH;
    if (callByClassname) {
        $(".box-lg-part").css("bottom", alertBottom + 32 + "px");
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
        $("#" + id).css("bottom", alertBottom + 32 + "px");
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

function callAContainer(callByClassname, id, doNotList) {
    let alertBottom = bottomNavbarH;
    if (callByClassname) {
        $("." + id).fadeIn(0);
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
}

function callAlert(icon, backgroundColor, foregroundColor, text, duration, buttonText, buttonActionType, buttonAction) {
    let alertBottom = bottomNavbarH;
    if (icon != null) $("#OngakuAlert_Icon_Lbl").html(" " + icon + " ");
    else $("#OngakuAlert_Icon_Lbl").html(' <i class="fa-solid fa-circle-info"></i> ');

    clearInterval(intervalValue);
    clearTimeout(timeoutValue);
    $(".ongaku-alert-timer").css("width", 0);

    if (backgroundColor == null) {
        $(".ongaku-alert").css("background-color", "#" + backgroundColor);
        $("#OngakuAlert_Btn").css("background-color", "#" + foregroundColor);
        $("#OngakuAlert_Btn").css("color", "#" + backgroundColor);
        $(".ongaku-alert-icon").css("color", "#" + foregroundColor);
        $(".ongaku-alert-text").css("color", "#" + foregroundColor);
        $(".ongaku-alert-timer").css("background-color", "#fdfdfd");
    }
    else {
        $(".ongaku-alert").css("background-color", "#2B2B2B");
        $("#OngakuAlert_Btn").css("background-color", "#fdfdfd");
        $("#OngakuAlert_Btn").css("color", "#2B2B2B");
        $(".ongaku-alert-icon").css("color", "#fdfdfd");
        $(".ongaku-alert-text").css("color", "#fdfdfd");
        $(".ongaku-alert-timer").css("background-color", "#fdfdfd");
    }

    let isVisible = isElementVisible(false, "Ongaku_Alert");
    if (isVisible) {
        $(".ongaku-alert").fadeIn(0);
        $(".ongaku-alert").css("bottom", alertBottom + 48 + "px");
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", "-1200px");
        }, 350);
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", alertBottom + 48 + "px");
        }, 700);
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", alertBottom + 16 + "px");
        }, 1050);
    }
    else {
        $(".ongaku-alert").fadeIn(0);
        $(".ongaku-alert").css("bottom", alertBottom + 48 + "px");
        setTimeout(function () {
            $(".ongaku-alert").css("bottom", alertBottom + 16 + "px");
        }, 350);
    }

    if (buttonText == null) {
        $("#OngakuAlert_Btn").fadeOut(300);
    }
    else {
        $("#OngakuAlert_Btn").fadeIn(300);
    }

    switch (parseInt(buttonActionType)) {
        case 0:
            $("#OngakuAlert_Btn").attr("onmousedown", "uncallAlert();");
            break;
        default:
            $("#OngakuAlert_Btn").attr("onmousedown", "uncallAlert();");
            break;
    }

    $("#OngakuAlert_Text_Lbl").html(text);

    if (duration != Infinity) {
        let widthPercentage = 0;
        let stepIncreaseValue = (100 / duration) / 100;
        $(".ongaku-alert-timer").css("width", 0);
        intervalValue = setInterval(function () {
            widthPercentage += stepIncreaseValue;
            $(".ongaku-alert-timer").css("width", widthPercentage + "%");
        }, 10);
        duration += 0.1;
        timeoutValue = setTimeout(function () {
            clearInterval(intervalValue);
            $(".ongaku-alert-timer").css("width", "100%");
            uncallAlert();
        }, duration * 1000);
    }
    else {
        $(".ongaku-alert-timer").css("width", 0);
        $("#OngakuAlert_Btn").fadeIn(300);
        $("#OngakuAlert_Btn").html("Close");
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
        $("body").append('<div class="box-sm-part-inner shadow-sm" id="' + id + '_Container"> <div class="box-sm-part-header p-2"><div class="box-standard"><div class="hstack gap-1" id="' + id + '-Header_Box">            <button type="button" class="btn btn-standard btn-back btn-sm"> <i class="fa-solid fa-chevron-left"></i> Back</button><span class="h5 ms-1 pt-1">' + title + '</span> <button type="button" class="btn btn-standard btn-close-sm-container btn-sm ms-auto" id="' + id + '_Container-Close_Btn">Done</button></div></div></div> <div class="box-standard p-1" id="' + id + '_Box"> </div> </div>');
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
        displayCorrector(currentWindowSize, false);
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
    let alertBottom = bottomNavbarH + 48;
    $(".ongaku-alert").css("bottom", alertBottom + "px");
    setTimeout(function () {
        $(".ongaku-alert").css("bottom", "-1200px");
    }, 350);
    setTimeout(function () {
        $(".ongaku-alert").fadeOut(0);
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

function audioChange(element, playlistId, trackId, addToQueue = false) {
    if (element != null || element != undefined) {
        let audioPlayer = document.getElementById(element);
        if (audioPlayer != null) {
            buttonDisabler(true, "btn-play-pause-track-lg", "Loading...");
            $("#OngakuPlayer_TrackId_Val").val(trackId);
            $("#OngakuPlayer_PlaylistId_Val").val(playlistId);
            $("#LoadTheTrack_Form").submit();

            if (trackQueue.orderChanger == 0) trackId = 2;
            else {
                if (trackQueue.autoPlay) trackId = 1;
                else trackId = 0;
            }
            audioEdit("OngakuPlayer_Audio", null, null, trackId, null);
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

function audioEdit(element, volume = 100, playbackSpeed = 1.0, loop = 0, currentTime = 0) {
    if (element != null) {
        let audioElement = document.getElementById(element);
        if (volume != null || volume != undefined) {
            volume = parseInt(volume);
            volume = volume > 0 ? volume / 100 : 0;
            audioElement.volume = volume;
            $(".volume-range-slider").val(volume * 100);
        }
        if (playbackSpeed != null || playbackSpeed != undefined) {
            playbackSpeed = parseFloat(playbackSpeed);
            audioElement.playbackRate = playbackSpeed;
            $(".btn-playback-rate").html(playbackSpeed.toFixed(1) + "x");
            $(".btn-playback-rate").attr("data-speed", playbackSpeed);
        }

        if (loop != null || loop != undefined) {
            loop = parseInt(loop);
            loop = loop == undefined ? 0 : loop;

            switch (parseInt(loop)) {
                case 0:
                    $(".btn-audio-loop").addClass("text-unchosen");
                    $(".btn-audio-loop").removeClass("text-chosen");
                    $(".btn-audio-loop").html(' <i class="fa-solid fa-repeat"></i> ');
                    trackQueue.autoPlay = false;
                    trackQueue.orderChanger = 1;
                    break;
                case 1:
                    trackQueue.autoPlay = true;
                    trackQueue.orderChanger = 1;
                    $(".btn-audio-loop").addClass("text-chosen");
                    $(".btn-audio-loop").removeClass("text-unchosen");
                    $(".btn-audio-loop").html(' <i class="fa-solid fa-repeat"></i> ');
                    break;
                case 2:
                    $(".btn-audio-loop").addClass("text-chosen");
                    $(".btn-audio-loop").removeClass("text-unchosen");
                    $(".btn-audio-loop").html(' <span class="fa-layers fa-fw"><i class= "fa-solid fa-repeat"></i> <span class="fa-layers-counter">1</span></span>');
                    if (trackQueue.songs.length > 0) {
                        trackQueue.autoPlay = true;
                        trackQueue.orderChanger = 0;
                    }
                    break;
                default:
                    $(".btn-audio-loop").addClass("text-unchosen");
                    $(".btn-audio-loop").removeClass("text-chosen");
                    $(".btn-audio-loop").html(' <i class="fa-solid fa-repeat"></i> ');
                    trackQueue.autoPlay = false;
                    trackQueue.orderChanger = 1;
                    break;
            }
            $(".btn-audio-loop").attr("data-status", loop);
        }
        if (currentTime != null || currentTime != undefined) audioElement.currentTime = currentTime;
    }
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

function callTheMusicIsland(currentWidth) {
    let newBotNavbarH = 0;
    $(".ongaku-player-box").fadeIn(0);
    if (parseInt(currentWidth) < 1024) {
        newBotNavbarH = bottomNavbarH + 35;
        $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        setTimeout(function () {
            newBotNavbarH -= 35;
            $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        }, 350);
        setTimeout(function () {
            newBotNavbarH += 10;
            $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        }, 700);
    }
    else {
        newBotNavbarH = 56;
        $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        setTimeout(function () {
            newBotNavbarH -= 48;
            $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        }, 350);
        setTimeout(function () {
            newBotNavbarH += 4;
            $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        }, 700);
    }
}

function uncallTheMusicIsland(currentWidth) {
    let newBotNavbarH = 0;
    if (parseInt(currentWidth) < 1024) {
        newBotNavbarH = bottomNavbarH + 32;
        $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", "-1200px");
        }, 300);
    }
    else {
        newBotNavbarH = 24;
        $(".ongaku-player-box").css("bottom", newBotNavbarH + "px");
        setTimeout(function () {
            $(".ongaku-player-box").css("bottom", "-1200px");
        }, 300);
    }
}

function displayCorrector(currentWidth, onPageStart) {
    if (parseInt(currentWidth) < 1024) {
        $(".box-lg-part").css("left", "0");
        $(".box-lg-part").css("width", "100%");
        $(".box-lg-part-header").css("left", 0);
        $(".box-lg-part-header").css("width", "100%");
        $(".box-vertical-switcher").css("width", "98.25%");
        $(".box-vertical-switcher").css("left", "0.75%");
        $(".box-lg-part-inner").css("left", "0.75%");
        $(".box-lg-part-inner").css("width", "98.25%");
        $(".box-sm-part").css("left", "-1200px");
        $(".box-sm-part").css("width", "100%");
        $(".box-sm-part-inner").css("left", "0.75%");
        $(".box-sm-part-inner").css("width", "98.25%");
        $(".bottom-navbar").css("width", "100%");
        $(".bottom-navbar").css("left", 0);
        $(".ongaku-alert").css("left", "1%");
        $(".ongaku-alert").css("width", "98.5%");
        $(".ongaku-player-box").css("width", "98.25%");
        $(".ongaku-player-box").css("left", "0.75%");
        if (onPageStart) {
            setTimeout(function () {
                $(".box-sm-part").css("left", 0);
                $(".box-lg-part").css("bottom", "-1200px");
                $(".box-lg-part").fadeOut(0);
                $(".box-sm-part-inner").fadeOut(0);
            }, 300);
        }
        else {
            $(".box-sm-part").css("left", "-1200px");
        }
    }
    else {
        $(".box-lg-part").css("left", "37%");
        $(".box-lg-part").css("width", "63%");
        $(".box-lg-part-header").css("left", "37%");
        $(".box-lg-part-header").css("width", "63%");
        $(".box-lg-part-inner").css("left", "37.5%");
        $(".box-lg-part-inner").css("width", "62%");
        $(".box-vertical-switcher").css("width", "62%");
        $(".box-vertical-switcher").css("left", "37.5%");
        $(".box-sm-part").css("left", 0);
        $(".box-sm-part").css("width", "37%");
        $(".box-sm-part-inner").css("left", "0.4%");
        $(".box-sm-part-inner").css("width", "36%");
        $(".bottom-navbar").css("width", "63%");
        $(".bottom-navbar").css("left", "37%");
        $(".ongaku-alert").css("left", "37.5%");
        $(".ongaku-alert").css("width", "62%");
        $(".ongaku-player-box").css("width", "36%");
        $(".ongaku-player-box").css("left", "0.4%");
        $(".ongaku-player-box").css("bottom", "12px");
        $(".bottom-navbar").fadeIn(350);
        $(".box-lg-part").fadeIn(350);
        $(".ongaku-alert").fadeIn(350);
        if (onPageStart) {
            setTimeout(function () {
                $(".box-lg-part").fadeOut(0);
                $(".box-sm-part-inner").fadeOut(0);
            }, 300);
        }
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
        displayCorrector(currentWindowSize, false);
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
                newDayValue = dateAndTimeCompiller(rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, true, true);
                break;
            case 4:
                newDayValue = dateAndTimeCompiller(rDayValue, newDayValue.getDay(), rMonthValue, rYearValue, rHourValue, rMinValue, true, false);
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

        if (showTime) result += ", at " + dateResult.toLocaleTimeString(countryISO2);
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

function studioItemSampler(id, title, imgUrl, genres = [], releaseDate, status, insertInElementId = null, isForAuthor = false) {
    let releaseBox = $('<div class="release-box btn-get-release-info d-inline-block me-2"></div>');
    let releaseImg = $("<img src='#' class='release-img' />");
    let releaseImgBox = $("<div class='release-img-box'></div>");
    let releaseInfoBox = $('<div class="box-standard text-truncate mt-1"></div>');
    let releaseName = $('<span class="h6 text-truncate"></span>');
    let releaseStatsBox = $('<div></div>');
    let releaseStatsBadge = $('<span class="badge-sm btn-tooltip" data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="tooltip-standard shadow-sm" data-bs-placement="bottom" data-bs-title="The track will be released as soon as we get your submission"></span>');
    let releaseStatsSeparator = $("<div class='mt-1'></div>");
    let releaseGenre = $("<small class='card-text text-muted'></small>");
    let releaseDateTime = $("<span class='card-text text-muted'></span>");
    let genresListed;

    releaseBox.attr("id", id + "-ReleaseInfo_Box");
    releaseDateTime.html(" ∙ " + new Date(releaseDate).getFullYear());
    if (title != null) releaseName.html(title);
    else releaseName.html("No Title");

    if (genres != null) {
        for (let i = 0; i < genres.length; i++) {
            if (i == 0) genresListed = genres[i].name;
            else genresListed += ", " + genres[i].name;
        }
        releaseGenre.html(genresListed);
    }
    else releaseGenre.html("No Genre");
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
                releaseStatsBadge.html(' <i class="fa-solid fa-volume-xmark"></i> Muted');
                releaseStatsBadge.attr("data-bs-title", "This track was disabled manually by you");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Resume <span class='float-end'> <i class='fa-solid fa-volume-high'></i> </span></button>");
                break;
            case 1:
                releaseStatsBadge.html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> Pending');
                releaseStatsBadge.attr("data-bs-title", "The track will be released as soon as we get your submission");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Submit <span class='float-end'> <i class='fa-solid fa-check-double'></i> </span></button>");
                break;
            case 2:
                releaseStatsBadge.html(' <i class="fa-solid fa-circle-pause"></i> Disabled');
                releaseStatsBadge.attr("data-bs-title", "This track has been muted. Refer to your notifications for more information");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Submit <span class='float-end'> <i class='fa-solid fa-check-double'></i> </span></button>");
                dropdownBtn2.fadeOut(0);
                break;
            case 3:
                releaseStatsBadge.html(' <i class="fa-solid fa-check-double"></i> Active');
                releaseStatsBadge.attr("data-bs-title", "The track is currently active and accessible to all");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Mute <span class='float-end'> <i class='fa-solid fa-volume-off'></i> </span></button>");
                break;
            default:
                releaseStatsBadge.html(' <i class="fa-solid fa-check-double"></i> Active');
                releaseStatsBadge.attr("data-bs-title", "The track is currently active and accessible to all");
                dropdownBtn2 = $("<button type='button' class='dropdown-item btn-sm'>Mute <span class='float-end'> <i class='fa-solid fa-volume-off'></i> </span></button>");
                break;
        }
        releaseInfoBox.append(releaseStatsBadge);
    }
    releaseInfoBox.append(releaseStatsSeparator);
    releaseInfoBox.append(releaseGenre);
    releaseInfoBox.append(releaseDateTime);

    releaseStatsBox.append(releaseName);
    releaseStatsBox.append(releaseInfoBox);
    releaseBox.append(releaseImg);
    releaseBox.append(releaseImgBox);
    releaseBox.append(releaseStatsBox);

    if (insertInElementId != null) {
        $("#" + insertInElementId).fadeIn(300);
        $("#" + insertInElementId).append(releaseBox);
    }
    else return releaseBox;
}

function playlistInfoSampler(currentUserId = 0, playlistId, playlistTitle, playlistType, coverImageUrl, releaseDateAndTime, songsQty, mainArtistId, mainArtistName, mainArtistImgUrl, songs = [], openOnFinish = false, isSaved = 0) {
    createAContainer("PlaylistInfo", playlistTitle, '<div class="release-box-lg"> <div class="hstack gap-1"> <div class="release-img-box-lg" id="Playlist_Img_Box"> <i class="fa-solid fa-music"></i> </div> <img src="#" class="release-img-lg" id="Playlist_Img" /> <div class="box-standard ms-1"> <div> <small class="card-text"> <span id="PlaylistInfo_Type_Span">Single</span> ∙ <span id="PlaylistInfo_TotalDuration_Span">3 min 46 sec</span> </small> <div></div> <span class="h1" id="PlaylistInfo_Name_Lbl">Release Name</span> <div class="btn-borderless-profile-tag mt-1"> <div class="hstack gap-1"> <div class="profile-avatar-sm bg-chosen-bright" id="PlaylistInfo_AuthorImg_Box">R</div> <img src="#" class="profile-avatar-img-sm" alt="This image cannot be displayed" id="PlaylistInfo_Author_Img" style="display: none;" /> <small id="PlaylistInfo_MainArtist_Span">Rammstein</small> </div> </div> </div> <div class="box-standard mt-2"> <button type="button" class="btn btn-release-title btn-play-pause-track btn-play-pause-track-lg btn-lg me-1" id="PlaylistInfo_PlayPauseMain_Btn"> <i class="fa-solid fa-play"></i> Play </button> <button type="button" class="btn btn-release-title btn-lg me-1"> <i class="fa-solid fa-shuffle"></i> Shuffle </button> <div class="d-inline-block"><input type="hidden" id="PlaylistSongsQty_Val" value="0" /> <form method="post" action="/Playlists/AddOrRemove" id="AddOrRemoveThePlaylist_Form"> <input type="hidden" name="TrackId" id="ARTP_Id_Val" value="0" /> <button type="submit" class="btn btn-standard-bolded btn-lg me-1 super-disabled" id="ARTP_SbmtBtn"> <i class="fa-solid fa-check"></i> </button> </form> </div> </div> <div class="box-standard mt-1"> <small class="card-text text-muted"> <span id="PlaylistInfo_SongsQty_Span">0 songs</span> ∙ <span id="PlaylistInfo_ReleaseDate_Span">2025</span> </small> </div> </div> </div> </div> <div class="box-standard" id="PlaylistInfo_TrackBoxes_Box"> </div><div class="d-none"> <form method="get" action="/Playlists/GetTracks" id="GetPlaylistTracks_Form"> <input type="hidden" name="Id" id="GPT_Id_Val" value="0" /> <input type="hidden" name="UserId" id="GPT_UserId_Val" value="0" /> <input type="hidden" name="Skip" id="GPT_Skip_Val" value="0" /> </form> </div>', null, null);
    let releaseDate = new Date(releaseDateAndTime);
    isSaved = parseInt(isSaved) > 2 ? 0 : isSaved;

    $("#GPT_Skip_Val").val(0);
    $("#GPT_Id_Val").val(playlistId);
    $("#GPT_UserId_Val").val(currentUserId);

    $("#PlaylistInfo_TrackBoxes_Box").empty();
    $("#PlaylistInfo_Name_Lbl").html(playlistTitle);
    $("#PlaylistInfo_MainArtist_Span").html(mainArtistName);
    $("#PlaylistInfo_MainArtist_Span").attr("data-id", mainArtistId);
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

    if (coverImageUrl != null) {
        if (coverImageUrl.includes("/")) $("#Playlist_Img").attr("src", coverImageUrl);
        else $("#Playlist_Img").attr("src", "/PlaylistCovers/" + coverImageUrl);
        $("#Playlist_Img_Box").fadeOut(0);
        $("#Playlist_Img").fadeIn(0);
    }
    else {
        $("#Playlist_Img").fadeOut(0);
        $("#Playlist_Img_Box").fadeIn(0);
        $("#Playlist_Img").attr("src", "#");
    }

    switch (parseInt(playlistType)) {
        case 0:
            $("#PlaylistInfo_Type_Span").html(' <i class="fa-solid fa-wave-square"></i> Playlist');
            $("#Playlist_Img_Box").html(' <i class="fa-solid fa-wave-square"></i> ');
            break;
        case 1:
            $("#PlaylistInfo_Type_Span").html(' <i class="fa-solid fa-record-vinyl"></i> Album');
            $("#Playlist_Img_Box").html(' <i class="fa-solid fa-record-vinyl"></i> ');
            break;
        case 2:
            $("#PlaylistInfo_Type_Span").html(' <i class="fa-solid fa-compact-disc"></i> EP/Single');
            $("#Playlist_Img_Box").html(' <i class="fa-solid fa-compact-disc"></i> ');
            break;
        case 3:
            $("#PlaylistInfo_Type_Span").html(' <i class="fa-solid fa-star text-primary"></i> Favorite Songs');
            $("#Playlist_Img_Box").html(' <i class="fa-solid fa-star text-primary"></i> ');
            break;
        default:
            $("#PlaylistInfo_Type_Span").html(' <i class="fa-solid fa-wave-square"></i> Playlist');
            $("#Playlist_Img_Box").html(' <i class="fa-solid fa-wave-square"></i> ');
            break;
    }

    if (songs != undefined) songsApplier(playlistType, songs, "PlaylistInfo_TrackBoxes_Box", "PlaylistInfo_SongsQty_Span");
    $("#PlaylistSongsQty_Val").val(songs != null ? songs.length : 0);

    if (openOnFinish) {
        displayCorrector(currentWindowSize, false);
        slideContainers(null, "PlaylistInfo_Container");
    }
}

function songsApplier(type = 0, songs = [], parentElementId, quantitySpanId, isContinuing = false) {
    if (parentElementId != null) {
        if (songs != null) {
            let firstTrackId = 0;
            if (!isContinuing) {
                trackQueue.songs = [];
                trackOrderInQueue = 0;
            }

            if (songs.length > 0) {
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
                    let trackDropdownBtn0 = $('<button type="button" class="dropdown-item btn-get-library">Add to Playlist <span class="float-end ms-1"> <i class="fa-solid fa-folder-plus"></i> </span></button>');
                    let trackDropdownBtn1 = $('<button type="button" class="dropdown-item">Add to Playlist <span class="float-end ms-1"> <i class="fa-solid fa-folder-plus"></i> </span></button>');
                    let explicitSpan;
                    let mainArtistSpan;
                    let featIconSpan;
                    
                    if (songs[index].hasExplicit) explicitSpan = $('<small class="explicit-span me-1">E</small>');
                    if (songs[index].trackArtists != null) {
                        mainArtistSpan = $("<span class='artist-search-span'></span>");
                        featIconSpan = $("<span> feat. </span>");
                    }
                    else mainArtistSpan = $("<span class='artist-search-span'></span>");

                    trackMainBox.attr('data-id', songs[index].id);
                    trackMainBox.attr("id", songs[index].id + "-TrackMain_Box");
                    mainArtistSpan.html(songs[index].mainArtistName);
                    mainArtistSpan.attr("id", songs[index].userId + "-FindArtistById_Span" + "_" + songs[index].id);
                    trackNameLbl.attr("id", songs[index].id + "-TrackName_Lbl");
                    trackArtistsName.attr("id", songs[index].id + "-TrackArtistsName_Lbl");
                    unstarBtn.attr("id", songs[index].id + "-TrackStarUnstar_Btn");
                    unstarBtn.attr("data-unfavor", !songs[index].isFavorite);

                    switch (parseInt(type)) {
                        case 0:
                            if (songs[index].isFavorite) unstarBtn.html(" <i class='fa-solid fa-star'></i> ");
                            else unstarBtn.html(" <i class='fa-regular fa-star'></i> ");
                            unstarBtn.attr("data-unfavor", songs[index].isFavorite);
                            break;
                        case 3:
                            unstarBtn.html(" <i class='fa-solid fa-star'></i> ");
                            unstarBtn.attr("data-unfavor", true);
                            break;
                        default:
                            if (songs[index].isFavorite) unstarBtn.html(" <i class='fa-solid fa-star'></i> ");
                            else unstarBtn.html(" <i class='fa-regular fa-star'></i> ");
                            unstarBtn.attr("data-unfavor", songs[index].isFavorite);
                            break;
                    }

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

                    trackNameLbl.html(songs[index].title);
                    trackArtistsName.append(mainArtistSpan);
                    if (songs[index].trackArtists != null) {
                        for (let i = 0; i < songs[index].trackArtists.length; i++) {
                            let artistSeparator = $("<span>, </span>");
                            let artistSpan = $("<span class='artist-search-span'></span>");
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

                    songIndex++;
                    trackQueue.songs.push(songs[index].id);
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
                    let currentQty = parseInt($("#" + quantitySpanId).html()) + songs.length;
                    $(".btn-audio-shuffle").removeClass("super-disabled");
                    $(".btn-play-pause-track-lg").removeClass("super-disabled");
                    $("#" + quantitySpanId).html("<span class='fw-500'>" + currentQty + "</span> songs");
                }

            }
            else {
                $("#" + parentElementId).empty();
                $("#" + quantitySpanId).html(" <i class='fa-solid fa-spinner fa-spin-pulse'></i> Fetching songs...");
/*                $("#" + parentElementId).html('<div class="box-bordered text-center p-2 mt-1"> <h2 class="h2"> <i class="fa-regular fa-folder-open"></i> </h2> <h5 class="h5">Loading your playlist...</h5> <small class="card-text text-muted">Please wait while we load your music library and prepare your playlist</small> </div>');*/
                $("#" + parentElementId).html('<div class="track-table-box"> <div class="hstack gap-1"> <div class="release-img-box-sm placeholder placeholder-wave"></div> <div class="ms-1 w-100"> <div class="placeholder-glow"> <span class="placeholder rounded col-9"></span> </div> <div class="placeholder-glow"> <small class="placeholder rounded col-6"></small> </div> </div> </div> </div>');
                $(".btn-play-pause-track-lg").removeAttr();
                $(".btn-play-pause-track-lg").attr("data-id", 0);
                $(".btn-audio-shuffle").addClass("super-disabled");
                $(".btn-play-pause-track-lg").addClass("super-disabled");
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

function dwindleMusicIsland(currentWidth) {
    if (currentWidth < 1025) {
        let botNavbarH = bottomNavbarH - 8;
        $(".ongaku-player-box").css("bottom", botNavbarH);
        $(".ongaku-player-box").css("left", "0.75%");
        $(".ongaku-player-box").css("width", "98.25%");
        $(".ongaku-player-box").removeClass("ongaku-player-box-enlarged");
        $(".ongaku-player-bg-box-enlarged").fadeOut(0);
        setTimeout(function () {
            $(".ongaku-player-bg-box").fadeIn(300);
        }, 300);

        setTimeout(function () {
            botNavbarH += 32;
            $(".ongaku-player-box").css("bottom", botNavbarH);
        }, 400);
        setTimeout(function () {
            botNavbarH -= 14;
            $(".ongaku-player-box").css("bottom", botNavbarH);
        }, 800);
    }
    else {
        let anySideBar = document.getElementsByClassName("side-navbar");
        if (anySideBar != null && anySideBar.length > 0) {
            let playerBottomV = parseInt($(".ongaku-player-box").css("bottom"));
            botNavbarH = playerBottomV + 6;
            $(".ongaku-player-bg-box-enlarged").fadeOut(300);
            setTimeout(function () {
                botNavbarH -= 18;
                $(".ongaku-player-bg-box").fadeIn(300);
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
            }, 300);
            setTimeout(function () {
                botNavbarH += 12;
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
            }, 650);
        }
        else {
            let botNavbarH = 0;
            let playerBottomV = parseInt($(".ongaku-player-box").css("bottom"));
            $(".ongaku-player-box").css("bottom", botNavbarH + "px");
            $(".ongaku-player-box").css("left", 0);
            $(".ongaku-player-box").css("width", "36%");
            $(".ongaku-player-box").removeClass("ongaku-player-box-enlarged");
            $(".ongaku-player-bg-box-enlarged").fadeOut(0);
            setTimeout(function () {
                $(".ongaku-player-bg-box").fadeIn(300);
            }, 300);

            setTimeout(function () {
                botNavbarH += 24;
                $(".ongaku-player-box").css("left", "0.4%");
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
                $(".box-sm-part-inner").css("bottom", botNavbarH + playerBottomV + "px");
            }, 400);
            setTimeout(function () {
                botNavbarH -= 12;
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
                $(".box-sm-part-inner").css("bottom", botNavbarH + playerBottomV + 6 + "px");
            }, 800);
        }
    }
}

function enlargeMusicIsland(currentWidth) {
    if (currentWidth < 1025) {
        let botNavbarH = bottomNavbarH + 36;
        $(".ongaku-player-box").css("bottom", botNavbarH);
        $(".ongaku-player-box").css("left", "0.75%");
        $(".ongaku-player-box").css("width", "98.25%");
        $(".ongaku-player-box").addClass("ongaku-player-box-enlarged");

        $(".ongaku-player-bg-box").fadeOut(300);
        setTimeout(function () {
            $(".ongaku-player-bg-box-enlarged").fadeIn(300);
        }, 300);
        setTimeout(function () {
            botNavbarH -= 28;
            $(".ongaku-player-box").css("bottom", botNavbarH + "px");
        }, 400);
        setTimeout(function () {
            botNavbarH += 4;
            $(".ongaku-player-box").css("bottom", botNavbarH + "px");
        }, 800);
    }
    else {
        let anySideBar = document.getElementsByClassName("side-navbar");
        if (anySideBar != null && anySideBar.length > 0) {
            botNavbarH = 6;
            $(".ongaku-player-bg-box").fadeOut(300);
            setTimeout(function () {
                botNavbarH += 36;
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
                $(".ongaku-player-bg-box-enlarged").fadeIn(300);
            }, 300);
            setTimeout(function () {
                botNavbarH -= 30;
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
            }, 650);
        }
        else {
            let botNavbarH = bottomNavbarH + 36;
            let playerBottomV = parseInt($(".ongaku-player-box").css("bottom"));
            $(".ongaku-player-box").css("bottom", botNavbarH);
            $(".ongaku-player-box").css("left", "40%");
            $(".ongaku-player-box").css("width", "62%");
            $(".ongaku-player-box").addClass("ongaku-player-box-enlarged");

            $(".ongaku-player-bg-box").fadeOut(300);
            $(".box-sm-part-inner").css("bottom", playerBottomV + botNavbarH + 12 + "px");
            setTimeout(function () {
                $(".ongaku-player-bg-box-enlarged").fadeIn(300);
            }, 300);
            setTimeout(function () {
                botNavbarH -= 28;
                $(".ongaku-player-box").css("left", "34.5%");
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
                $(".box-sm-part-inner").css("bottom", "-2px");
            }, 400);
            setTimeout(function () {
                botNavbarH += 4;
                $(".ongaku-player-box").css("left", "37.5%");
                $(".ongaku-player-box").css("bottom", botNavbarH + "px");
                $(".box-sm-part-inner").css("bottom", "10px");
            }, 800);
        }
    }
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
    createHeadlessSmContainer("Proposal", '<div class="box-standard p-2" id="Proposal_Box"> <div class="box-standard text-center p-1"> <h2 class="h2" id="Proposal_Icon_Lbl"> <i class="fa-solid fa-question"></i> </h2> <h4 class="h4" id="Proposal_Header_Lbl">Proposal Header</h4> <small class="card-text text-muted white-space-on" id="Proposal_Description_Span">Proposal description (short)</small> </div> <div class="row mt-3"> <div class="col" id="ProposalSubmit_Box"> <button type="button" class="btn btn-standard-bolded btn-classic-styled btn-proposal-submit w-100" id="ProposalSubmit_Btn">Submit</button> <div class="box-standard" id="ProposalForForms_Box" style="display: none;"></div> </div> <div class="col" id="ProposalCancel_Box"> <button type="button" class="btn btn-standard-bolded btn-close-sm-part-container bg-chosen-bright w-100" id="Proposal_Container-BtnClose"> <i class="fa-regular fa-circle-xmark"></i> Cancel</button> </div> </div> <div class="box-bordered text-center mt-2 p-2"> <span class="h6">Time Left</span> <br /> <small class="card-text text-muted" id="Proposal_Timer_Span">00:30</small> </div> </div>', false);
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
    }
    else {
        if (positiveButtonFormHtml != null && positiveButtonFormHtml.includes("<form")) {
            $("#ProposalSubmit_Btn").fadeOut(0);
            $("#ProposalForForms_Box").fadeOut(0);
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

    displayCorrector(currentWindowSize, false);
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
                displayCorrector(currentWindowSize, false);
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
        displayCorrector(currentWindowSize, false);
        setTimeout(function () {
            callAContainer(false, "AudioPreview_Container", false);
        }, 150);
    }
}

function hideBySlidingToLeft(byClassname = false, openingElement, targetElementId) {
    if (openingElement != null && targetElementId != null) {
        if (byClassname) {
            $("." + targetElementId).css("margin-left", "15%");
            setTimeout(function () {
                $("." + targetElementId).css("margin-left", "-1200px");               
            }, 350);
            setTimeout(function () {
                $("." + openingElement).fadeIn(300);
                $("." + targetElementId).fadeOut(0);
            }, 700);
        }
        else {
            $("#" + targetElementId).css("margin-left", "15%");
            setTimeout(function () {
                $("#" + targetElementId).css("margin-left", "-1200px");
            }, 350);
            setTimeout(function () {
                $("#" + openingElement).fadeIn(300);
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

        displayCorrector(currentWindowSize, false);
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
        uncallAContainer(false, trueId);
    }
});

$(document).on("touchstart", ".div-swiper", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".div-swiper", function (event) {
    let moveDirection = handleTouchMove(event);
    if (moveDirection == 0) {
        let trueId = getTrueId(event.target.id, false);
        uncallAContainer(false, trueId);
    }
    else if (moveDirection == 1) {
        let trueId = getTrueId(event.target.id);
        if (trueId != "") {
            callAContainer(false, trueId, false);
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
            $(".box-lg-part").fadeOut(0);
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
        displayCorrector(currentWidth, false);
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