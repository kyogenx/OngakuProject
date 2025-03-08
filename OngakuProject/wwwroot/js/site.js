let currentWindowSize = window.innerWidth;
let bottomNavbarH = 0;
let intervalValue;
let timeoutValue;

window.onload = function () {
    displayCorrector(currentWindowSize);
    $(".ongaku-alert").fadeOut(0);
    setTimeout(function () {
        bottomNavbarH = $(".bottom-navbar").innerHeight();
    }, 350);
}

window.onresize = function () {
    currentWindowSize = window.innerWidth;
    displayCorrector(currentWindowSize);
    setTimeout(function () {
        bottomNavbarH = $(".bottom-navbar").innerHeight();
    }, 350);
}

function displayCorrector(currentWidth) {
    if (parseInt(currentWidth) < 1024) {
        $(".box-lg-part").css("left", "-1200px");
        $(".box-sm-part").css("width", "100%");
        $(".box-sm-part").css("left", 0);
        $(".bottom-navbar").css("width", "100%");
        $(".bottom-navbar").css("left", 0);
        $(".ongaku-alert").css("left", "1%");
        $(".ongaku-alert").css("width", "98.5%");
        setTimeout(function () {
            $(".box-lg-part").fadeOut(300);
        }, 300);
    }
    else {
        $(".box-lg-part").css("left", 0);
        $(".box-sm-part").css("width", "63%");
        $(".box-sm-part").css("left", "37%");
        $(".bottom-navbar").css("width", "63%");
        $(".bottom-navbar").css("left", "37%");
        $(".ongaku-alert").css("left", "37.5%");
        $(".ongaku-alert").css("width", "62%");
        $(".bottom-navbar").fadeIn(350);
        $(".box-lg-part").fadeIn(350);
        $(".ongaku-alert").fadeIn(350);
    }
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
            console.log($("#" + element).css("display"));
            if ($("#" + element).css("display") == "block") resultInfo = true;
            else resultInfo = false;
        }
        else resultInfo = false;
    }
    return resultInfo;
}