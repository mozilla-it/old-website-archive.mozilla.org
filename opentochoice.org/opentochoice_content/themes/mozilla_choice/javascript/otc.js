/**
 * @author Andres Garcia R. - Zemoga Inc.
 * @class specific code for the Page Open To Choice Project
 * @version 1.0
 * @return Object
 * 
 */

/**
 * Project wrapper
 */
var otc = {
	emailPattern : /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
	languagePattern : /(http:\/\/[a-zA-Z.-]{1,}\/)([a-zA-Z-]{1,}(?=\/))/,
	languageCodePattern : /(http:\/\/[a-zA-Z.-]{1,})(\/\w{2}-\w{2}\/|\/\w{2}\/)/,
	initialize : false,
	addEvents : function(){
	},
	
	/**
	 * Andres Garcia: Set the correct dropdown language
	 */
	setDropdownValue : function(){
		
		//var str_URL = "http://www.google.com/co-cos/es/article.php";
		var str_URL = location.href;
		
		//if(str_URL.match(otc.languageCodePattern)){
		//$("#choose-voice select").val(str_URL.match(otc.languageCodePattern)[2].split("/").join(""));
		
		if(location.href.charAt(location.href.length - 1) == "/" && $("#choose-voice select").val().charAt(location.href.length - 1) != "/")
			str_URL = str_URL.substr(0, str_URL.length - 1);
		
		//console.log("setting to " + str_URL);
		
		$("#choose-voice select").val(str_URL);
		//alert(str_URL.match(otc.languageCodePattern)[2].split("/").join(""));	
		//}
		
		
	},
	
	/**
	 * Sets the default text for textarea and input texts based on the html title parameter
	 */
	setInputTexts : function(){
		$("input[type=text], textarea").each(
			function(){
				$(this).val($(this).attr("title"));
			}
		)
	},
	
	/**
	 * Andres Garcia : Makes a correct redirect of the language chooser
	 */
	redirectLanguage : function(event){
		location.href = $("#choose-voice select").val();
	},
	
	/**
	 * This function fix the background scrolling problem on IE7 for inputs and textarea elements
	 */
	fixIE7InputBackgrounds : function(){
		if ($.browser.msie && parseFloat($.browser.version) < 8) {
			$("input[type=text], textarea").each(function(event){
			
				var divWrapper = document.createElement("div");
				
				$(divWrapper).css({
					"margin-right": $(this).css("margin-right"),
					"background-position-y": $(this).css("background-position-y"),
					"background-position-x": $(this).css("background-position-x"),
					"background-repeat": $(this).css("no-repeat"),
					"background-image": $(this).css("background-image"),
					"width": $(this).width() + Number($(this).css("padding-left").split("px").join("")) + "px",
					"height": ($(this).height() + Number($(this).css("padding-top").split("px").join("")) + 6) + "px",
					"float": "left",
					"display":"inline-block"
				});
				
				
				$(this).css("background", "transparent");
				$(this).wrap(divWrapper);
				
				
			});
		}
	},
	
	/**
	 * 
	 * @param {Object} select
	 * @param {Object} htmlObject
	 * @param {Object} value
	 */
	onSelectChange : function(select, htmlObject, value){
		//console.log("changing to " + $("#choose-voice select").val());
		if (otc.initialize) {
			//window.location.href = "../" + $("select").val() + "/" ;
			otc.redirectLanguage();
			return false;
		}else
			otc.initialize = true;
	},
	
	/**
	 * Sends out the form
	 * @param {Object} form
	 */
	sendForm : function(form){
		var data = new Object();
		$(form).find("input:enabled,textarea:enabled,select:enabled,input#hddlanguage").each(function(){
			data[$(this).attr("name")] = $(this).val();
        });
		data["ajax"] = "true";	
		$.getJSON($(form).attr("action"), data, function(data, status){
			if(data.message.type === "error"){
				$(form).find("input[type='text']:first").displayOnFieldError(data.message.message);
			} else {				
				$(form).find("input:enabled,textarea:enabled,select:enabled").each(function(){
					if ($(this).get(0).tagName === "input" && $(this).attr("type") === "text") {
						$(this).val($(this).attr("title"));
					} else {
						$(this).attr("checked", "");
						$(this).val("");
					}
					
				});
				
				if(!$(form).parents("box").hasClass("confirm"))
					$(form).parents("box").addClass("confirm");
			}
		});
	},
	
	/**
	 * Show/Hide text from inputs
	 */
	inputText : function(){
		$("input, textarea").focus(function(event){
			if($(this).val() === $(this).attr("title"))
				$(this).val("");
		}).blur(function(event){
			if($(this).val() === "")
				$(this).val($(this).attr("title"));
		});
	},
	
	/*
	 * Submit events manipulation
	 */
	actionForms : function(){
		otc.inputText();
		$("#btn_learnMoreSignUp").parents("form").submit(function(){return validateSignUpForm();});
		$("#btn_commentSubmit").parents("form").submit(function(){return validateComment();});
		
		$("#btn_learnMoreSignUp").click (
		
			function(event){
				var form = $(this).parents("form");
				
				event.preventDefault();
				
				if (validateSignUpForm()) {
					//otc.sendForm(form);
					
					$("#signup-form").submit();
				}
			}
		);
		
		/*$("#btn_commentSubmit").click(
			function(mouseEvent){
				
				var form = $(this).parents("form");
				
				mouseEvent.preventDefault();
				
				if (validateComment()) {
					//otc.sendForm(form);
					form.submit();
				}
			}
		);*/
	}
}

/**
 * 
 * @param {Object} event
 */
$(function(event){
	otc.setDropdownValue();
	
	
	var isMobile = (DetectIphoneOrIpod() || DetectS60OssBrowser() || DetectAndroid() || DetectAndroidWebKit() || DetectWindowsMobile() || DetectBlackBerry() || DetectPalmOS() || DetectFennec());
	
	if(!isMobile){
		$("select").selectstyle();
	}else{
		$("#choose-voice select").change(otc.redirectLanguage);
		$("#choose-voice select").css({"margin-left": "10px"});
	}
 	
	$("input[type=checkbox]").checkboxstyle();
	otc.setInputTexts();
	otc.fixIE7InputBackgrounds();
	otc.actionForms();
	
	$(".msg_agree a").click(
		function(event){
			window.open($(this).attr("href"), "_blank");
		}
	);
});

/**
 * Validates the sign up form
 */
function validateSignUpForm(){
	
	var response = true;
	
	if(!otc.emailPattern.test($("#txt_signUpForm").val())) {
		$("#signUpValidator").slideDown("fast");
		response = false;
	}else{
		$("#signUpValidator").slideUp("fast");
	}
	
	if (!$("#agree-terms").attr("checked")) {
		$("#agreementsValidator").slideDown("fast");
		response = false;
	}else{
		$("#agreementsValidator").slideUp("fast");
	}
	
	return response;
}

/**
 * Validates comment form
 */
function validateComment(){
	var response = true;
	
	if ($("#comment-name").length > 0) {
		if ($("#comment-name").val() == "" || $("#comment-name").val() == $("#comment-name").attr("title")) {
			$("#commentNameValidator").slideDown("fast");
			response = false;
		}
		else {
			$("#commentNameValidator").slideUp("fast");
		}
	}
	
	if ($("#comment-email").length > 0) {
		if (!otc.emailPattern.test($("#comment-email").val())) {
			$("#commentEmailValidator").slideDown("fast");
			response = false;
		}
		else {
			$("#commentEmailValidator").slideUp("fast");
		}
	}
	
	if($("#comment-content").val() == "" || $("#comment-content").val() == $("#comment-content").attr("title")){
		$("#commentValidator").slideDown("fast");
		response = false;
	}else{
		$("#commentValidator").slideUp("fast");
	}
	
	return response;
}

/*************** Mobile Detect Region ****************************/

var deviceIphone = "iphone";
var deviceIpod = "ipod";

//Initialize our user agent string to lower case.
var uagent = navigator.userAgent.toLowerCase();

//**************************
// Detects if the current device is an iPhone.
function DetectIphone(){
   return uagent.search(deviceIphone) > -1;
}


// Detects if the current device is an iPod Touch.
function DetectIpod(){
   return uagent.search(deviceIpod) > -1;
}


// Detects if the current device is an iPhone or iPod Touch.
function DetectIphoneOrIpod(){
    return DetectIphone() || DetectIpod();
}

var deviceS60 = "series60";
var deviceSymbian = "symbian";
var engineWebKit = "webkit";

//**************************
// Detects if the current browser is the S60 Open Source Browser.
// Screen out older devices and the old WML browser.
function DetectS60OssBrowser(){
   if (uagent.search(engineWebKit) > -1){
     if ((uagent.search(deviceS60) > -1 || uagent.search(deviceSymbian) > -1))
        return true;
     else
        return false;
   }
   else
      return false;
}

var deviceAndroid = "android";

//**************************
// Detects if the current device is an Android OS-based device.
function DetectAndroid(){
   return (uagent.search(deviceAndroid) > -1);
}


//**************************
// Detects if the current device is an Android OS-based device and
//   the browser is based on WebKit.
function DetectAndroidWebKit()
{
   if (DetectAndroid())
   {
     if (DetectWebkit())
        return true;
     else
        return false;
   }
   else
      return false;
}

var deviceWinMob = "windows ce";

//**************************
// Detects if the current browser is a Windows Mobile device.
function DetectWindowsMobile(){
   return (uagent.search(deviceWinMob) > -1);
}

var deviceBB = "blackberry";


//**************************
// Detects if the current browser is a BlackBerry of some sort.
function DetectBlackBerry(){
   return (uagent.search(deviceBB) > -1);
}

var devicePalm = "palm";

//**************************
// Detects if the current browser is on a PalmOS device.
function DetectPalmOS(){
   return (uagent.search(devicePalm) > -1);
}

var deviceFennec = "fennec";

//**************************
// Detects if the current browser is on a PalmOS device.
function DetectFennec(){
   return (uagent.search(deviceFennec) > -1);
}

/*************** End Mobile Detect Region ****************************/



