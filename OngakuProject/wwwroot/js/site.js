let currentWindowSize = window.innerWidth;
let currentPageUrl;
let bottomNavbarH = 0;
let intervalValue;
let timeoutValue;
let sentRequest = null;
let openedContainers = [];
let openedCards = [];

//showSwitchableBox
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
                createInsideLgCard("PasscodeSignIn", "Passcode Required", '<div class="box-bordered text-center p-2"> <h3 class="h3"> <i class="fa-solid fa-lock"></i> </h3> <h4 class="h4">Passcode Secured</h4> <small class="card-text text-muted">This account is protected by a passcode. Please enter it to complete the sign-in process</small> </div> <div class="mt-2"> <form method="post" href="/Account/PasscodeSignIn" id="PasscodeSignIn_Form"> <div class="d-none"> <input type="text" name="Password" id="PasscodeSignIn_Password_Val" /> <input type="text" name="Username" id="PasscodeSignIn_Username_Val" /> </div> <div> <input type="text" class="form-control form-textarea form-control-guard" name="Passcode" id="PasscodeSignIn_Passcode_Val" placeholder="Enter the passcode" data-min-length="1" data- data-target="PasscodeSignIn_SbmtBtn" /> </div> <div class="mt-2"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled super-disabled w-100" id="PasscodeSignIn_SbmtBtn">Sign In</button> </div> </form> </div>', '<form method="post" href="/Account/SendThePasscodeViaInbox" id="SendThePasscodeViaInbox_Form"> <button type="submit" class="btn btn-standard btn-sm" id="SendThePasscodeViaInbox_SbmtBtn">Forgot Passcode</button> </form>', null);
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
            createAContainer("PersonalInfo", "Personal Info", '<div class="box-vertical-switcher shadow-sm" id="PersonalInfo_VS_Box"> <div class="box-vertical-switcher-header hstack gap-1"> <button type="button" class="btn btn-standard-bolded btn-close-vertical-switcher btn-sm ms-auto">Done</button> </div> <div class="mt-2" id="PersonalInfo_VSItems_Box"> <span class="h5" id="PersonalInfo_VMMembersQty_Lbl"></span> <div></div> <small class="card-text text-muted">Tap on each member to remove them</small> <div class="mt-2" id="PersonalInfo_VMMembersListed_Box"> </div> </div> </div> <div class="box-bordered p-2"> <span class="h4" id="PersonaInfo_RealName_Lbl">Donald J. Trump</span> <div class="hstack gap-1"> <small class="card-text me-1" id="PersonaInfo_CountryInfo_Lbl"> <img src="https://flagcdn.com/16x12/jp.png" srcset="https://flagcdn.com/32x24/jp.png 2x, https://flagcdn.com/48x36/jp.png 3x" width="20" height="15" alt="Japan"> Japan </small> <button type="button" class="btn btn-link btn-sm" id="PersonalInfo_WebpageLink_Btn"><span class="card-text text-muted"> <i class="fa-solid fa-link"></i> </span> <span id="WebpageLink_Span">DonaldJTrump.com</span></button> </div> </div> <div class="mt-2"> <form method="post" asp-controller="Profile" asp-action="EditPersonalInfo" id="ProfileEditPersonal_Info"> <div> <span class="form-label fw-500 ms-1">Full Name</span> <div class="mt-1" id="EPI_Fullnames_Box"> <button type="button" class="btn btn-standard-bordered btn-add-element btn-sm" id="AddRealNameMember_Btn" data-prototype="EPI_RealName-0"> <i class="fa-solid fa-user-plus"></i> Add Member</button> <button type="button" class="btn btn-standard-bordered btn-elements-listed btn-open-vertical-switcher btn-sm" id="PersonalInfo_VS_Box-OpenBtn" data-prototype="EPI_RealName-0" style="display: none;"> <i class="fa-solid fa-user-minus"></i> Remove Member</button> <button type="button" class="btn btn-standard-bordered btn-sm ms-1" id="EPI_RealnamesCounter_Span">0/350</button> <input type="text" class="form-control form-control-juxtaposed mt-1" name="RealName" id="EPI_RealName-0" placeholder="Provide your full name" data-update="PersonaInfo_RealName_Lbl" data-base-value="Unknown" data-target="EditPersonalInfo_SbmtBtn" data-counter-display="EPI_RealnamesCounter_Span" data-counter-maxlength="350" data-index="0" /> <input type="text" class="d-none" name="CountryId" id="EPI_CountryId_Val" value="0" /> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted" id="EPI_RealName-Warn" data-list="false">If you are a band, add extra rows to list all band your names</small > </div > <div class="mt-3"> <label class="form-label fw-500 ms-1">Webpage Link</label> <input type="text" class="form-control form-control-guard" name="WebpageLink" id="EPI_WebPage_Val" data-update="WebpageLink_Span" data-base-value="Not provided" placeholder="https://webpagelink.com/" /> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Enter the link to your official webpage (if available). This field is optional</small> </div> <div class="mt-3"> <span class="form-label fw-500 ms-1">Country</span> <div class="mt-1" id="CountryBtn_Box"> <button type="button" class="btn btn-standard-bordered btn-load-countries btn-sm" id="LoadCountries_Btn" data-is-loaded="false"> <img src="https://flagcdn.com/20x15/de.png" srcset="https://flagcdn.com/40x30/jp.png 2x, https://flagcdn.com/60x45/jp.png 3x" width="20" height="15" alt="Japan" /> Japan </button> </div> </div> <div class="mt-1 ms-1"> <small class="card-text text-muted">Tap the button to choose your country</small> </div> <div class="mt-3"> <button type="submit" class="btn btn-standard-bolded btn-classic-styled w-100" id="EditPersonalInfo_SbmtBtn">Save Changes</button> </div> </form> </div>', null, null);
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
        juxtaposedCharsUpdater(elementTrueId, baseValue, updateDisplay);
        juxtaposedCharsCounter(elementTrueId, maxLength, resultDisplay);
    }
});

$(document).on("mousedown", ".btn-add-element", function () {
    let prototype = $(this).attr("data-prototype");
    let newElementId = copyAnElement(prototype, true);
    $("#PersonalInfo_VS_Box-OpenBtn").fadeIn(300);
    $(this).attr("data-prototype", newElementId);
});

$(document).on("mousedown", ".btn-remove-element", function () {
    let trueId = getTrueId($(this).attr("id"), true);
    if (trueId != undefined) {
        $("#" + trueId).remove();
        $(".btn-close-vertical-switcher").mousedown();
    }
});

$(document).on("mousedown", ".btn-elements-listed", function () {
    let prototype = $(this).attr("data-prototype");
    if (prototype != undefined) {
        let qty = 0;
        let prototypeTrueId = getTrueId(prototype, false);
        let allItems = $("[id*='" + prototypeTrueId + "']");
        $("#PersonalInfo_VMMembersListed_Box").empty();
        if (allItems.length > 0) {
            for (let i = 0; i < allItems.length; i++) {
                if ($("#" + allItems[i].id).attr("data-list") != "false") {
                    qty++;
                    let itemsToEdit = $("<button type='button' class='btn btn-standard btn-standard-bordered btn-remove-element btn-sm w-100 mb-1'></button>");
                    itemsToEdit.attr("id", "ToRemove-" + allItems[i].id);
                    if ($("#" + allItems[i].id).val() != "") itemsToEdit.html($("#" + allItems[i].id).val());
                    else itemsToEdit.text("Not provided");

                    $("#PersonalInfo_VMMembersListed_Box").append(itemsToEdit);
                }
            }
            $("#PersonalInfo_VMMembersQty_Lbl").html("Members: " + qty);
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
        let currentLength = $(this).val().length;
        let filterMembersClassname = $(this).attr("data-search-in");
        let itemsArr = [];
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

$(document).on("mousedown", ".btn-show-inside-box", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        let isBigBox = $(this).attr("data-big-switcher");
        console.log(isBigBox);
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
    }
});

$(document).on("mousedown", '.btn-open-vertical-switcher', function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined) {
        $("#" + trueId).fadeIn(0);
        $("#" + trueId).css("bottom", bottomNavbarH + 20 + "px");
        setTimeout(function () {
            $("#" + trueId).css("bottom", bottomNavbarH + 4 + "px");
        }, 350);
    }
});
$(document).on("mousedown", ".btn-close-vertical-switcher", function () {
    $(".box-vertical-switcher").css("bottom", bottomNavbarH + 18 + "px");
    setTimeout(function () {
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

function slideBoxes(byClassname, closingBox, openingBox) {
    if (byClassname) {
        $("." + closingBox).fadeOut(300);
        setTimeout(function () {
            $("." + openingBox).fadeIn(300);
        }, 300);
    }
    else {
        $("#" + closingBox).fadeOut(300);
        setTimeout(function () {
            $("#" + openingBox).fadeIn(300);
        }, 300);
    }
}

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

$(document).on("mousedown", ".btn-reorder", function () {
    let postIdValue = getTrueId($(this).attr("id"), true);
    let reorderTarget = $(this).attr("data-reorder-target");
    let currentOrder = parseInt(getTrueId($(this).attr("id")));
    let maxOrder = parseInt($(this).attr("data-max-order"));

    if (postIdValue != undefined && reorderTarget != undefined) {
        let files = $("#" + reorderTarget).get(0).files;
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
            imagePreviewer(dataTransfer.files, false);
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
        }
        imagePreviewer(dataTransfer.files, false);
        fileRenewer(reorderTarget, dataTransfer, 6, "ImagePreview_Container");
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
    if (currentFileIndex != undefined && reorderTarget != undefined) {
        let currentFiles = $("#" + reorderTarget).get(0).files;
        let dataTransfer = new DataTransfer();
        if (parseInt(currentFiles.length) > 1) {
            for (let i = 0; i < currentFiles.length; i++) {
                if (i != currentFileIndex) dataTransfer.items.add(currentFiles[i]);
            }
            imagePreviewer(dataTransfer.files, false);
            fileRenewer(reorderTarget, dataTransfer, 6, "ImagePreview_Container");
        }
        else imagePreviewer(null, false);
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
$(document).on("change", "input[type='file']", function () {
    let thisId = $(this).attr("id");
    let imgs = $("#" + thisId).get(0).files;
    if (imgs != undefined) {
        imagePreviewer(imgs, true);
    }
});

$(document).on("mousedown", ".btn-open-container", function () {
    let trueId = getTrueId($(this).attr("id"), false);
    if (trueId != undefined || trueId != null) {
        slideContainers(null, trueId);
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
    if (newFilesArr != null && newFilesArr.files.length > 0) {
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
        newInput.files = dataTransfer.files;

        document.getElementById(targetId).parentNode.replaceChild(newInput, inputElement);
        if (updateTheWidget == null) $("#" + targetId).change();
    }
}

function imagePreviewer(images, openPreviewBox = true) {
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
                reorderBtn.attr("id", i + "-ReorderTheImg_Btn");
                reorderBtn.attr("data-max-order", imagesCodeLength);
                reorderBtn.attr("data-reorder-target", "EditImage_Files_Val");
                deleteBtn.attr("id", i + "-DeleteImgFromTheOrder_Btn");
                deleteBtn.attr("data-reorder-target", "EditImage_Files_Val");
                reorderBtn.html(++orderIndex);

                imagePreviewBox.append(deleteBtn);
                imagePreviewBox.append(reorderBtn);
                imagePreviewBox.append(imgElement);
                elementCol.append(imagePreviewBox);
                $("#" + rowsQty + "-Row_Box").append(elementCol);
            }
            $("#LoadedImagesQty_Span").html(imagesLength);
            if (openPreviewBox) callAContainer(false, "ImagePreview_Container");
        }
        else {
            $('.btn-save-images').addClass("super-disabled");
            $('.btn-add-more-images').addClass("super-disabled");
            $('.btn-delete-all-images').addClass("super-disabled");
            uncallAContainer(false, "ImagePreview_Container");
        }
    }
    else {
        $('.btn-save-images').addClass("super-disabled");
        $('.btn-add-more-images').addClass("super-disabled");
        $('.btn-delete-all-images').addClass("super-disabled");
        uncallAContainer(false, "ImagePreview_Container");
    }
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
    if (!byClassname) {
        $("#" + id).addClass("super-disabled");
        if (specialText != null) $("#" + id).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + specialText);
        else $("#" + id).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + $("#" + id).html());
    }
    else {
        $("." + id).addClass("super-disabled");
        if (specialText != null) $("#" + id).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + specialText);
        else $("." + id).html(' <i class="fa-solid fa-spinner fa-spin-pulse"></i> ' + $("#" + id).html());
    }
}
function buttonUndisabler(byClassname, id, defaultText) {
    if (!byClassname) {
        $("#" + id).removeClass("super-disabled");
        $("#" + id).html(defaultText);
    }
    else {
        $("." + id).removeClass("super-disabled");
        $("." + id).html(defaultText);
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

$(document).on("keyup", ".form-textarea", function () {
    getElementLength($(this).attr("id"), null, false);
    adjustTextareaRows($(this).attr("id"));
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

        if (isNaN(maxLength) || maxLength == undefined || maxLength == 0) currentLength = currentLength;
        else currentLength = currentLength + "/" + maxLength;
        if (indicatorId == null) $("#" + id + "-Indicator_Span").text(currentLength);
        else $("#" + indicatorId).text(currentLength);

        return currentLength;
    }
    else return null;
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

function checkTheInput(value, minLength, neccessaryChars, target) {
    if (target != null && value != null) {
        if (!Array.isArray(neccessaryChars)) neccessaryChars = getCommaSeparatedValues(neccessaryChars);
        let truthsQty = 0;
        let neccessaryTruths = neccessaryChars != null ? neccessaryChars.length + 1 : 1;

        if (target.length > minLength) truthsQty++;
        if (neccessaryChars != null) {
            for (let i = 0; i < neccessaryChars.length; i++) {
                for (let j = 0; j < value.length; j++) {
                    if (value[j] == neccessaryChars[i]) {
                        truthsQty++;
                        break;
                    }
                }
            }
        }
        if (truthsQty >= neccessaryTruths) return true;
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
        if (callByClassname) {
            if (isNowOpen) {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", alertBottom + 32 + "px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom + 32 + "px");
                }, 600);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom + 12 + "px");
                }, 900);
            }
            else {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", alertBottom + 32 + "px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", alertBottom + 12 + "px");
                }, 300);
            }
        }
        else {
            if (isNowOpen) {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", alertBottom + 32 + "px");
                setTimeout(function () {
                    $("#" + id).css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + 32 + "px");
                }, 600);
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + 12 + "px");
                }, 900);
            }
            else {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", alertBottom + 32 + "px");
                setTimeout(function () {
                    $("#" + id).css("bottom", alertBottom + 12 + "px");
                }, 300);
            }
        }
    }
    else {
        if (callByClassname) {
            if (isNowOpen) {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", "32px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "32px");
                }, 600);
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "10px");
                }, 900);
            }
            else {
                $(".box-sm-part-inner").fadeIn(0);
                $(".box-sm-part-inner").css("bottom", "32px");
                setTimeout(function () {
                    $(".box-sm-part-inner").css("bottom", "10px");
                }, 300);
            }
        }
        else {
            if (isNowOpen) {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", "32px");
                setTimeout(function () {
                    $("#" + id).css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $("#" + id).css("bottom", "32px");
                }, 600);
                setTimeout(function () {
                    $("#" + id).css("bottom", "10px");
                }, 900);
            }
            else {
                $("#" + id).fadeIn(0);
                $("#" + id).css("bottom", "32px");
                setTimeout(function () {
                    $("#" + id).css("bottom", "10px");
                }, 300);
            }
        }
    }
}

function uncallASmContainer(callByClassname, id) {
    if (callByClassname) {
        if (currentWindowSize < 1024) {
            let alertBottom = bottomNavbarH;
            $(".box-sm-part-inner").css("bottom", alertBottom + 32 + "px");
            setTimeout(function () {
                $(".box-sm-part-inner").css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $(".box-sm-part-inner").fadeOut(0);
            }, 600);
        }
        else {
            $(".box-sm-part-inner").css("bottom", "32px");
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
            $("#" + id).css("bottom", alertBottom + 32 + "px");
            setTimeout(function () {
                $("#" + id).css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $("#" + id).fadeOut(0);
            }, 600);
        }
        else {
            $("#" + id).css("bottom", "32px");
            setTimeout(function () {
                $("#" + id).css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $("#" + id).fadeOut(0);
            }, 600);
        }
    }
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
    openedContainers = newOpenedContainersArr;
}

function callAContainer(callByClassname, id, doNotList) {
    let isNowOpen = false;
    let alertBottom = bottomNavbarH;
    if (callByClassname) {
        let elements = document.getElementsByClassName(id);
        if (elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                if ($("#" + elements[i].id).css("display") == "block") {
                    isNowOpen = true;
                    if ($("#" + elements[i].id).hasClass("box-lg-part-inner")) alertBottom += 12;
                    break;
                }
            }

            if (isNowOpen) {
                $("." + id).css("bottom", alertBottom + 24 + "px");
                setTimeout(function () {
                    $("." + id).css("bottom", "-1200px");
                }, 300);
                setTimeout(function () {
                    $("." + id).css("bottom", alertBottom + 24 + "px");
                }, 600);
                setTimeout(function () {
                    $("." + id).css("bottom", alertBottom + "px");
                }, 900);
            }
            else {
                $("." + id).fadeIn(0);
                setTimeout(function () {
                    $("." + id).css("bottom", alertBottom + 24 + "px");
                }, 600);
                setTimeout(function () {
                    $("." + id).css("bottom", alertBottom + "px");
                }, 900);
            }
        }
    }
    else {
        if ($("#" + id).hasClass("box-lg-part-inner")) alertBottom += 12;
        if ($("#" + id).css("display") == "block") isNowOpen = true;
        else isNowOpen = false;

        if (isNowOpen) {
            $("#" + id).fadeIn(0);
            $("#" + id).css("bottom", alertBottom + 24 + "px");
            setTimeout(function () {
                $("#" + id).css("bottom", "-1200px");
            }, 300);
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + 24 + "px");
            }, 600);
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + "px");
            }, 900);
        }
        else {
            $("#" + id).fadeIn(0);
            $("#" + id).css("bottom", alertBottom + 24 + "px");
            setTimeout(function () {
                $("#" + id).css("bottom", alertBottom + "px");
            }, 300);
        }
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

$(document).on("input", ".volume-range-slider", function () {
    let currentValue = parseFloat($(this).val());
    let maxValue = parseFloat($(this).attr("max"));
    let volumeChangeLbl = $(this).attr("data-value-label");

    if (currentValue != undefined && maxValue != undefined) {
        let valuePercentage = currentValue / maxValue * 100;
        if (volumeChangeLbl != undefined) {
            if (valuePercentage > 0) $("#" + volumeChangeLbl).html(parseInt(valuePercentage));
            else if (valuePercentage == 100) $("#" + volumeChangeLbl).text("Max");
            else $("#" + volumeChangeLbl).text("Min");
        }
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

$(document).on("dblclick", ".ongaku-player-box", function () {
    if ($("#OngakuPlayerMainPart_Box").css("display") != "none") showBySlidingToRight(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    else hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
});

$(document).on("touchstart", ".ongaku-player-box", function (event) {
    handleTouchStart(event);
});
$(document).on("touchmove", ".ongaku-player-box", function (event) {
    let moveDirection = handleTouchMove(event);
    if (moveDirection == 2) {
        if ($("#OngakuPlayerMainPart_Box").css("display") != "none") showBySlidingToRight(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
        else hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    }
    else if (moveDirection == 3) {
        hideBySlidingToLeft(false, "OngakuPlayerMainPart_Box", "OngakuPlayerNotMainPart_Box");
    }

    xDown = null;
    yDown = null;
});

$(document).on("mousedown", ".ongaku-player-box", function () {
    if ($(this).hasClass("ongaku-player-box-enlarged")) {
        dwindleMusicIsland(currentWindowSize);
    }
    else enlargeMusicIsland(currentWindowSize);
});

function dwindleMusicIsland(currentWidth) {
    if (currentWidth < 1024) {

    }
    else {
        let botNavbarH = 0;
        $(".ongaku-player-box").css("bottom", botNavbarH);
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
            $(".ongaku-player-box").css("bottom", botNavbarH);
        }, 400);
        setTimeout(function () {
            botNavbarH -= 12;
            $(".ongaku-player-box").css("bottom", botNavbarH);
        }, 800);
    }
}

function enlargeMusicIsland(currentWidth) {
    if (currentWidth < 1024) {

    }
    else {
        let botNavbarH = bottomNavbarH + 36;
        $(".ongaku-player-box").css("bottom", botNavbarH);
        $(".ongaku-player-box").css("left", "40%");
        $(".ongaku-player-box").css("width", "62%");
        $(".ongaku-player-box").addClass("ongaku-player-box-enlarged");

        $(".ongaku-player-bg-box").fadeOut(300);
        setTimeout(function () {
            $(".ongaku-player-bg-box-enlarged").fadeIn(300);
        }, 300);
        setTimeout(function () {
            botNavbarH -= 28;
            $(".ongaku-player-box").css("left", "34.5%");
            $(".ongaku-player-box").css("bottom", botNavbarH);
        }, 400);
        setTimeout(function () {
            botNavbarH += 4;
            $(".ongaku-player-box").css("left", "37.5%");
            $(".ongaku-player-box").css("bottom", botNavbarH);
        }, 800);
    }
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

$(document).on("mouseenter", ".btn-tooltip", function () {
    $(this).tooltip("show");
});
$(document).on("mouseleave", ".btn-tooltip", function () {
    $(this).tooltip("hide");
});