/**
 * @author Juan Sebastian Romero - Andres Garcia R. - Zemoga Inc.
 * @class specific code for the Page Firefox 5 years
 * @version 1.0
 * @return Object
 * 
 */

var fyfx = new Object(); 
fyfx = {
	
	videoPaths :	{
						ogg:"http://videos.mozilla.org/fyfx/Firefox_Final_VO.ogv", 
						youtube:"http://www.youtube.com/v/-ULDH90H530&hl=en&fs=1&rel=0&color1=0x3a3a3a&color2=0x999999",
						srt : "./caption.srt"
					},
	termsMessage : $("#termsMessage").val(),
	generalErrorMessage : $("#generalErrorMessage").val(),
	galleryPath : "../flickr_feed.php",
	viewsServicePath : "../views.php",
	initialize : false,
	subtitlesPath : "./",
	defaultSubtitlesPath : "./ens.srt",
	imagesData : new Object(), //Images Retrived from the server
	currentImage : 0, //Current Image from the Array
	imagesInterval : 8000, //Interval for images.
	currentContainerIndex : 0,
	str_currentLocation : document.location.href.split("/")[document.location.href.split("/").length - 2],
	
	/**
	 * @author Juan Sebastian Romero
	 * Adds the Event to the Page
	 */
	addEvents : function (){
		$("a.play-video").click(function(mouseEvent){
			mouseEvent.preventDefault();
            // urchinTracker('/videoname/Firefox_Final_VO.ogv');
            // urchinTracker('/videoplay/5years_video_play');
			if ($("select").val() !== "ens")
				fyfx.videoPaths.srt = fyfx.subtitlesPath + fyfx.str_currentLocation + ".srt";
			else 
				fyfx.videoPaths.srt = fyfx.subtitlesPath + $("select").val() + "/" + $("select").val() + ".srt";
			$(this).videoPlayer(fyfx.videoPaths, function(){
				fyfx.doCount();
			});
		});	
		$("a.download-video").click(function(mouseEvent){
            urchinTracker('/videoplay/5years_video_download');
		});	
	},
	
	/**
	 * @author Juan Sebastian Romero
	 * @param {Jquery/HTMLObject} form
	 */
	sendForm : function(form){
		var data = new Object() 
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
				$(".going-on").find("h3:first").html(data.message.title);
				$(".going-on").find("p:first").html(data.message.message);
			}
		});
	},
	
	/**
	 * @author Juan Sebastian Romero
	 * Adds events to all input type text
	 */
	inputText : function(){
		$("input").focus(function(event){
			if($(this).val() === $(this).attr("title"))
				$(this).val("");
		}).blur(function(event){
			if($(this).val() === "")
				$(this).val($(this).attr("title"));
		});
	},
	
	/**
	 * @author Juan Sebastian Romero
	 * Adds events to all the forms 
	 */
	actionForms : function(){
		fyfx.termsMessage = $("#termsMessage").val(),
		fyfx.generalErrorMessage = $("#generalErrorMessage").val(),
		fyfx.inputText();
		$(".submit").parent("form").attr("onsubmit", "return false;");
		$(".submit").click (function(mouseEvent){
			mouseEvent.preventDefault();
			var form = $(this).parents("form");
			form.validate(function(){
				fyfx.sendForm(form);
			}, function(elements){
				items : for(var i = 0; i<elements.size(); i++){
					if(elements.get(i).id === "conditions"){
						form.find("input[type='text']:first").displayOnFieldError(fyfx.termsMessage);
						break items;
					} else {
						form.find("input[type='text']:first").displayOnFieldError(fyfx.generalErrorMessage);
						break items;
					}
				}
			});
		});
	},
	
	/**
	 * @author Andres Garcia - Zemoga Inc. 10-25-09
	 * Adds the logic for Light The World Box
	 */
	lightTheWorldLogic: function(){
		
		var STR_PIC_SELECTOR = ".lighttheworld .spotlight-pics a";
		var NUM_ANIMATION_DURATION = 1000;
		var num_initialArrowXposition;
		
		
		$(STR_PIC_SELECTOR).click(function(event){
			
			event.preventDefault();
			
			var num_itemIndex = Number($(STR_PIC_SELECTOR).index(this));
			var div_wrapper = $(this).parents(".linebox-content").find(".spotlight-descriptions-wrapper");
			var div_descriptionItem = $(div_wrapper).children(".spotlight-descriptions-item");
			var div_arrow = $(this).parents(".linebox-content").find(".spotlight-arrow");
			
			if (!num_initialArrowXposition) 
				num_initialArrowXposition = div_arrow.position().left;
			
			$(div_wrapper).animate({
				left: -(div_descriptionItem.outerWidth(true) * num_itemIndex),
				duration: NUM_ANIMATION_DURATION
			});
			$(div_arrow).animate({
				left: num_initialArrowXposition + (div_arrow.parent().innerWidth() / div_descriptionItem.length) * num_itemIndex, 
				duration: NUM_ANIMATION_DURATION
			});
		});
	},
	
	/**
	 * @author Juan Sebastian Romero
	 * loads pictures from flickr
	 */
	loadFlickrPictures : function(){
		// var data = new Object(), img = new Image();
		// $.getJSON(fyfx.galleryPath, data, function(response, status){
		// 	fyfx.imagesData = response;
		// 	fyfx.setImagesOnPage();
		// });
	},
	
	/**
	 * @author Juan Sebastian Romero
	 * sets the images on the page
	 */
	setImagesOnPage : function(){
		try {
			img = new Image();
			if($(".photo .photo-content").size() == fyfx.currentContainerIndex){
				setTimeout(function(){
					fyfx.setImagesOnPage();
				}, fyfx.imagesInterval);
				fyfx.currentContainerIndex = 0;
				return;
			}
			if (!fyfx.imagesData.gallery.images.image[fyfx.currentImage]) {
				fyfx.currentImage = 0;
			}
			$($(".photo .photo-content").get(fyfx.currentContainerIndex)).find("canvas").remove();
			$($(".photo .photo-content").get(fyfx.currentContainerIndex)).find("img").remove();
			img.src = fyfx.imagesData.gallery.images.image[fyfx.currentImage].src;
			$(img).attr("width", "152").attr("height", "137");
			$($(".photo .photo-content").get(fyfx.currentContainerIndex)).append(img);
			img.onload = function(){
				/*if (fyfx.validHTML5) {
					try {
						var canvas = Pixastic.process(this, "sepia");
					} catch (e) {
						// try catch For local testing...
						$(this).css("margin-left", "0px");
					}
					$(canvas).css("display", "none");
					$(canvas).fadeIn("slow");
				} else {*/
					$(this).css("display", "none").css("margin-left", "0px");
					$(this).fadeIn("slow");
				//}
			};
			fyfx.currentContainerIndex++;
			fyfx.currentImage++;
			setTimeout(function(){
				fyfx.setImagesOnPage();
			}, 1000);
		}catch(e){
			alert("error:Loading images " + e);
		}
	},
	
	/**
	 * 
	 * @param {JqueryObject} select
	 * @param {JqueryObject} htmlObject
	 * @param {String} value
	 */
	onSelectChange : function(select, htmlObject, value){
		if (fyfx.initialize == true){
			if($("select").val() !== "ens"){
				window.location.href = "../" + $("select").val() + "/";
				return false;
			} else {
				if($("video").size() > 0){
					$("video").caption.instance.srtFilePath = fyfx.defaultSubtitlesPath;
					$("video").caption.instance.loadSrtFile();
				}
			}
		} else 
			fyfx.initialize = true;
	},
	
	/**
	 * @author Juan Sebastian Romero
	 */
	doCount : function(){
		// $.ajax({
		//	url: fyfx.viewsServicePath,
		//	success: function(msg){
		//	}
		// });
	}
};

/**
 * Main Load Function
 * @param {Jquery Event} event
 */
 $(function(event){
 	$("select").selectstyle();
 	fyfx.validHTML5 = $.validate.isHTML5Compatible();
	fyfx.addEvents();
	fyfx.actionForms();
	fyfx.lightTheWorldLogic();
	fyfx.loadFlickrPictures();
	$("fieldset label a").attr("target", "_blank");
	
	/**
	 * Andres Garcia 10-28-09
	 * Non Open-Font support.
	 * These browsers currently don't support open-font feature:
	 * Safari 2.0-,Safari Iphone, Google Chrome,Firefox 3.0-
	 *  
	 */
	var str_navigator = navigator.userAgent; 
	
	if(
		str_navigator.indexOf("Chrome") != -1 || 
		(str_navigator.indexOf("Firefox") != -1 && parseFloat(str_navigator.split("/")[str_navigator.split("/").length - 1]) <= 3.0) ||
		(str_navigator.indexOf("Opera") != -1 && parseInt(str_navigator.split("/")[str_navigator.split("/").length - 1]) < 10) ||
		str_navigator.indexOf("iPhone") != -1
		){
			$("h1").css("font-size", "4em");
			$("#title-container h1 span.firefox-text").css("font-size", "2em");	
		}
	
	/**
	 * Andres Garcia
	 * Localizers tweaks
	 * 
	 */
	 
	/* Make sure the language drop-down is ltr */
	$("#main-content div.select").attr('dir', 'ltr');
	
	/*$(".stwrapper").hide();
	$(".stbutton").hover(
			function(){
				$(".stwrapper").show();
			},
			function(){
				$(".stwrapper").hide();
			}
	);*/
	 
	//var str_currentLocation = document.location.href.split("/")[document.location.href.split("/").length - 2];
	
	switch(fyfx.str_currentLocation){
		case "it":
		case "zh-TW":
			$(".wishes li span.wishes-wish").css("width", "136px");
			break;
		case "de":
			$(".wishes li span.wishes-wish").css("width", "175px");
			break;
		case "el":
			$(".wishes").css("padding-top", "0");
			$(".wishes li span.wishes-wish").css("width", "220px");
			break;
		case "ru":
			$($("#header ul#header-menu li.spreadfirefox-button a span").get(0)).css("margin-left", "-14px");
			break;
		case "ca":
			$(".wishes li span.wishes-wish").css("width", "153px");
			break;
		case "es-ES":
			$(".wishes li span.wishes-wish").css("width", "133px");
			break;
		case "th":
			$($("h1 span").get(0)).css("font-size", "1.5em")
                                              .css("font-weight", "bold");
			break;
	}
	
	switch(fyfx.str_currentLocation){
		case "zh-TW":
		case "ja":
		case "zh-CN":
		case "ko":
			$($("h1 span").get(1)).css("font-size", "1.5em");
			break;
	}
	
	switch(fyfx.str_currentLocation){
		case "it":
		case "de":
		case "el":
		case "sk":
		case "ko":
		case "ru":
		case "vi":
		case "ca":
		case "fr":
		case "pl":
		case "sq":
		case "hu":
		case "es-ES":
			$(".wishes ul").css("margin", "4px 0 0");
			$("div.community").css("margin", "204px 0 0");
			break;
	}
	
	switch(fyfx.str_currentLocation){
		case "fa":
			$("#title-container p").css("margin-top", "15px");
			// no break on purpose
		case "he":
			$("body.safe-font h1").css("font-size", "4.5em");
			$("body.safe-font h1 span.firefox-text").css("font-size", "2.2em");
			break;
	}	

 });
