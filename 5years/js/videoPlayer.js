/**
 * @author Juan Sebastian Romero | Zemoga
 * @class This static class allows you to validate the browser and if support HTML 5
 * @version 1.0
 * @return Object
 * 
 */

jQuery.validate = {
	
	/**
	 * This method validates if the browser supports HTML5
	 * @return {Boolean}
	 */
	isHTML5Compatible : function(){
		var canvas = document.createElement("canvas"), boo_valid = false;
		if(canvas.getContext)boo_valid = true;
		canvas = null;
		return boo_valid;
	},
	
	/**
	 * This mehtod validates if the browser supports OGG Files. Firefox 3.5+ and Chrome
	 * @return {Boolean}
	 * @updated 27 October 2009
	 */
	supportsOGG : function(){
		return ((parseFloat(jQuery.browser.version.substr(0,3))>= 1.9 && jQuery.browser.mozilla && parseFloat(jQuery.browser.version.split(".")[2]) >= 1)) || (navigator.userAgent.indexOf("Chrome") != -1);
	},
	
	/**
	 * This method validate if a tag is or not a video tag.
	 * @param {JqueryObject/HtmlObject} element
	 * @return {Boolean}
	 */
	isVideo : function(element){
		return $(element).get(0).tagName.toLowerCase() === "video";
	},
	
	/**
	 * Enumerators
	 */
	HANDLER_ERROR : "The handler was not defined.",
	VIDEO_ERROR : "The element you are trying to reach is not Video Component."
	
};

/**
 * @author Juan Sebastian Romero | Zemoga
 * @class This static class contains all the utilities for captioning and others
 * @version 1.0
 * @return Object
 * 
 */

jQuery.videoUtils = {
	
	/**
	 * @example $.videoUtils.getSeconds("00:00:09,00")
	 * @param {String} strSeconds
	 * @return Number
	 */
	getSeconds : function(strSeconds){
		var seconds = 0, arrTime = new Array();
		arrTime = strSeconds.split(",")[0].split(":");
		seconds = (parseFloat(arrTime[0]) * 3600) + (parseFloat(arrTime[1]) * 60) + (parseFloat(arrTime[2]));
		return seconds;
	},
	
	/**
	 * @author Juan Sebastian Romero | Zemoga
	 * @date: November 3 2009
	 * @param {Array} arr
	 * @param {Number} time
	 */
	getIndexByTime : function(arr, time){
		var index = null;
		timer : for(var i = 0; i<arr.length; i++){
			if(arr[i].init == time){
				index = i;
				break timer;
			}
		}
		return index;
	}
};


/**
 * @author Juan Sebastian Romero | Zemoga
 * @class This plugin allows you to manipulate video in HTML 5 for Firefox
 * @version 0.3
 * @param {Object} videos Optional
 * @param {Function} trackingCall Optional
 * @example 
 * 			$("a.video").videoPlayer(function(){
				alert("tracked")
			});
 * @return videoPlayerInstance
 * 
 */

jQuery.fn.videoPlayer = function(videos, trackingCall){
	
	var scope = this;
	var videoElement;
	var tracking = trackingCall;
	var videoObject = videos;
	var hasCaption = (videoObject.srt)?true:false;
	
	/**
	 * @constructor
	 * @private
	 * @param {JqueryObject} videoElement
	 */
	var initVideo = function(video_){
		videoElement = video_;
		void addEvents();
	};
	
	
	/**
	 * Gets the source of the video from the class
	 * @return String 
	 */
	this.getVideoPath = function(){
		var videoPath;
		if (!videoObject) {
			var classes = videoElement.attr("class");
			videoPath = classes.split("[")[1].replace("]", "");
		} else 
			videoPath = ($.validate.supportsOGG())?videoObject.ogg:videoObject.youtube;
		return videoPath;
	};
	
	/**
	 * @private
	 * Adds the events to the thumb 
	 */
	var addEvents = function(){
		var action = function(){
			if (typeof(tracking) == "function") 
					tracking();
			if ($.validate.supportsOGG()) 
				createVideoComponent();
			else 
				callYouTubeVideo();
		};
		if (videoElement.get(0).tagName.toLowerCase() != "a") {
			videoElement.css({
				"cursor": "pointer"
			});
			videoElement.click(function(event){
				action();
			});
		} else  {
			void action();
		}
	};
	
	/**
	 * @private
	 * Adds the Flash   
	 */
	callYouTubeVideo = function(){
		videoElement.hide();
		videoElement.parent().flash({
			swf : scope.getVideoPath(),
			width : videoElement.parent().width(),
			height : videoElement.parent().height()
		});
	};
	
	/**
	 * @private
	 * This method creates the video components and displays it on the document
	 */
	var createVideoComponent = function(){
		var video = $(document.createElement("video"));
		var timeout = 0;
		video.attr("src", scope.getVideoPath()).attr("width", videoElement.parent().width()).attr("height", videoElement.parent().height()).attr("controls", "true");
		videoElement.parent().append(video);
		videoElement.hide();
		video.hover(function(event){
			//if(parseInt($(this).parent().find(".closed-caption").css("bottom")) == 0){
				$(this).parent().find(".closed-caption").animate({"bottom":28});
				clearTimeout(timeout);
			//}
		}, function(event){
			var object = $(this)
			timeout = setTimeout(function(){
					object.parent().find(".closed-caption").animate({"bottom":0});
				}, 1000);
		});
		
		videoElement.parent().find(".closed-caption").hover(function(event){
			$(this).animate({"bottom":28});
			clearTimeout(timeout);
		});

		video.addEventListener("onprogress", function(element){
			
		}).addEventListener("onended", function(element){
			$(element).parent().find(".closed-caption").hide();
			$(element).parent().find(".play-video").show();
			$(element).remove();
		}).addEventListener("onloadedmetadata", function(element){
			var caption = $(element).caption(fyfx.videoPaths.srt);
		});
		if (hasCaption === true) {
			video.buffering();
		} else 
			video.playVideo();
	};
	
	this.each(function(){
		initVideo($(this));
	}); 
	return this;
};

/**
 * @author Juan Sebastian Romero | Zemoga
 * @class Do the caption of the video Reeds the SRT File and retrieve the caption
 * @param {String} srtFile  Required
 * 
 */
jQuery.fn.caption = function(srtFile){
	
	var scope = this;
	var intervalCaption = 0;
	var currentVideo;
	var quePoints;
	this.srtFilePath = srtFile;
	this.captionObject;
	
	
	/**
	 *
	 * Loads the srt files via Ajax
	 */
	this.loadSrtFile = function(){
		var trace = scope;
		$.ajax({
			url: scope.srtFilePath,
			success: function(data){
				srtToObject (data, trace);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				currentVideo.caption.instance.srtFilePath = "./" + "en.srt";
				currentVideo.caption.instance.loadSrtFile();
			}
		});
	};
	
	/**
	 * @private
	 * I am using the same file format that Youtube uses, in fact is an standart for subtitles
	 * @param {String} data The data retrieve from de srt file
	 * @param {Object} scope Scope of the Object follow the Thread
	 */
	var srtToObject  = function(data, scope){
		var data_string = data, dataArray = new Array(), subtitles = new Array(), title = new Object();
		dataArray = escape(data_string).split("%0A");
		for (var i = 0; i<dataArray.length; i++){
			if(parseInt(unescape(dataArray[i])) && parseInt(unescape(dataArray[i])) !== 0 && parseInt(unescape(dataArray[i])) != 2004){
				if(i !== 0){
					subtitles.push(title)
					title = new Object();
				}
			} else if (unescape(dataArray[i]) != "") {
				title[(unescape(dataArray[i]).indexOf("-->") !== -1)?"time":"caption"] = unescape(dataArray[i]);
			}
		}
		subtitles.push(title);
		scope.captionObject = subtitles;
		scope.doCaption();
	};
	
	
	/**
	 * @public
	 * Destroy the caption of video
	 */
	this.killCaption = function(){
		clearInterval(intervalCaption);
	};
	
	/**
	 * @public
	 * This function starts the subtitles from the begining 
	 * Starts the caption of the video 
	 */
	this.doCaption = function(){
		currentVideo.stopBuffering();
		currentVideo.playVideo();
		quePoints = new Array();
		var count = 0, index = 0, scope = currentVideo.get(0);
		if(this.captionObject){
			for (var i = 0; i<this.captionObject.length; i++) {
				quePoints.push({
					init:$.videoUtils.getSeconds(this.captionObject[i].time.split(" --> ")[0]), 
					duration:$.videoUtils.getSeconds(this.captionObject[i].time.split(" --> ")[1]) - $.videoUtils.getSeconds(this.captionObject[i].time.split(" --> ")[0]),
					text:this.captionObject[i].caption
				});
			}
		}
		currentVideo.get(0).addEventListener("timeupdate", function(){
			if (scope.paused || scope.ended) 
				return;
			
			index = ($.videoUtils.getIndexByTime(quePoints, Math.floor(scope.currentTime)))?$.videoUtils.getIndexByTime(quePoints, Math.floor(scope.currentTime)):index;
			if (index >= 0) {
				if (quePoints[index].init == Math.floor(scope.currentTime)) {
					if(quePoints[index].text){
						$(scope).parent().find(".closed-caption").slideDown("fast");
						$(scope).parent().find(".closed-caption").html(quePoints[index].text);
					} else {
						$(scope).parent().find(".closed-caption").slideUp("fast");
					}
				}
			}
		}, false);
	};
	this.each(function(){
		currentVideo = $(this);
	});
	this.loadSrtFile();
	currentVideo.caption.instance = this;
	return this;
};


/**
 * @author Juan Sebastian Romero | Zemoga
 * @class Plays the video
 * @throws Video Error
 */

jQuery.fn.playVideo = function(){
	this.each(function(){
		if($.validate.isVideo(this))
			this.play();
		else 
			throw new Error($.validate.VIDEO_ERROR);
	});
};

/**
 * @author Juan Sebastian Romero | Zemoga
 * @class Adds events to the video Player TODO:Better the Scope
 * @requires {String} method  Required
 * @requires {Function} handler Required
 * @example video.addEventListener("onprogress" onProgress);
 * @throws Video Error
 * 
 */

jQuery.fn.addEventListener = function(method, handler){
	var fnc_handler = handler, str_method = method, object;
	if (this.fnc_handler !== null) {
		this.each(function(){
			object = $(this);
			if($.validate.isVideo(object));
				object.attr(str_method, 'var ' + str_method + '=' + fnc_handler.toString() + '(this); return;');
		});
		return object;
	} else 
		throw new Error($.validate.HANDLER_ERROR);
};

/**
 * @author Juan Sebastian Romero | Zemoga
 * @class This method creates the loading, this only needs to be displayed when the movie is loading
 * this can be replace easily.
 */

jQuery.fn.buffering = function(){
	var object, loading;
	
	this.each(function(){
		object = $(this);
		if (object.parent().find(".buffering").size() == 0) {
			loading = $(document.createElement("div"));
			loading.attr("class", "buffering");
			loading.css({
				position: "absolute",
				left: 0,
				top: 0
			});
			loading.html("Buffering...");
			object.parent().append(loading);
		}
	});
	return object;
};

/**
 * @author Juan Sebastian Romero | Zemoga
 * @class This method removes the buffering bar or progress
 * this can be replace easily.
 */

jQuery.fn.stopBuffering = function(){
	var object;
	this.each(function(){
		object = $(this);
		if (object.parent().find(".buffering").size() > 0) 
			object.parent().find(".buffering").remove();
	});
	return object;
};

