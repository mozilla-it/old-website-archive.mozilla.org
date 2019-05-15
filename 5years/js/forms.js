/**
 * @author Sebastian Romero April-29-2009
 * @param {String} message
 * @example $("input").displayOnFieldError("Oops!");
 */
jQuery.fn.displayOnFieldError = function(message){
	
	var str_message = message;
	var str_errorclassField = "error";
	var scope = this;

	/**
	 * 
	 * @param {JqueryObject} field
	 */
	var displayOnFieldError = function(field){
		var div_error = scope.errorbubble(str_message);
		$(field).parent().append(div_error);
		$(field).addClass(str_errorclassField);
		scope.posError(div_error, $(field));
		div_error.slideToggle("fast");
		setTimeout(function(){
			div_error.slideToggle("fast");
		}, 3000)
	};
	
	/**
	 * @param {JqueryObject} errorMessage
	 * @param {JqueryObject} field
	 * Position the Error After the Field
	 */
	this.posError = function(errorMessage, field){
		var position = field.position(), leftAdjust = (field.attr("type") === "password")?60:0;
		errorMessage.css({top:(errorMessage.height()+15) * -1});
		return;
	};
	
	/**
	 * 
	 * @param {String} message
	 * This function creates the error bubble
	 */
	this.errorbubble = function(message){
		var div_bubble = $(document.createElement("div"));
		div_bubble.addClass("error_bubble")
		div_bubble.html("<p>" + message + "</p><div class=\"flag \"></div>");
		return div_bubble;
	};
	
    this.each(function(){
        displayOnFieldError(this);
    });
};
/**
 * @author Sebastian Romero April-29-2009 Based on Roy's Validation Logic
 * @param {Function} onvalid
 * @param {Function} onerror
 * @example 
 	$(document.forms[0]).validate(function(){
 		$(this).submit();
	},function(elements){
		elements.each(function(){
			....
		});
	});
 * @return {Boolean} Returns if the is valid or not
 * @version 1.0
 */
jQuery.fn.validate = function(onvalid, onerror){
	
	/**
	 * Public properties
	 */
	this.str_errorPattern = "errorfield";
	this.boo_isValid = true;
	this.fnc_onvalid = onvalid;
	this.fnc_onerror = onerror;
	/**
	 * Private variables
	 */
	var scope = this;
	var form;
	
	/**
	 * Constructor
	 */
	var validate = function(){
		$(form).find(".error_bubble").remove();
		$(form).find("input:enabled,textarea:enabled,select:enabled").each(function(){
			$(this).removeClass("errorfield")
			for (var rule in scope.validationRules) {
                if (scope.validationRules.hasOwnProperty(rule)) {
                    scope.validationRules[rule]($(this));
                }
            }
        });  
	};
	
	/**
	 * Public methods
	 * addErrorOnForm
	 * @param {JqueryObject} field
	 * @param {String} message
	 */
	
	this.addErrorOnForm = function(field, message){
		field.addClass(scope.str_errorPattern);
		scope.boo_isValid = false;
	};
	
	/**
	 * 
	 * @param {Object} oField
	 */
	this.getLabel = function(oField) {
		if(oField.attr('title')){
			return oField.attr('title');
		} else if($('[for=' + oField.attr('id') + ']').length) {
			return $('[for=' + oField.attr('id') + ']').text().replace('*','')
		} else if($('[for=' + oField.attr('name') + ']').length) {
			return $('[for=' + oField.attr('name') + ']').text().replace('*','')
		} else { 
			return oField.attr('name')
		}
	}
	
	/**
	 * Validation Rules Object
	 */
	this.validationRules = {
		/**
		 * @param {JqueryObject} field
		 */
        required: function(field){
            if (field.hasClass("required")) {
                switch (field.attr("type")) {
                    case "radio":
                        if (!$("input[name='" + field.attr('name') + "']").attr("checked")) {
							scope.addErrorOnForm(field, "option selection is required.");
                        }
                        break;
                    case "checkbox":
                        if (!field.attr("checked")) {
							scope.addErrorOnForm(field, scope.getLabel(field) + " is required.");
                        }
                        break;
                    case "text":
                    default:
                        if (!field.val() || field.val() == field.attr('title') || field.val().replace(/[' ']{1,}/, '') == '') {
                            scope.addErrorOnForm(field, scope.getLabel(field) + " is required.");
                        }
                }
            }
            return true;
        },
		
		/**
		 * 
		 * @param {JqueryObject} field
		 * @example <input type="text" class="email" />
		 */
        email: function(field){
            var emailRegEx = /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,4}\b/;
            if (field.hasClass('email') && !field.val().match(emailRegEx) && field.val() !== '') {
				scope.addErrorOnForm(field, scope.getLabel(field) + ' is invalid.');
            }
            return true;
        }
    }
	/**
	 * Constructor Call
	 */
    this.each(function(){
		form = this;
        validate(this);
    });
	if(this.fnc_onvalid)
		if(this.boo_isValid)
			this.fnc_onvalid(this);
	if(this.fnc_onerror)
		if(!this.boo_isValid)
			this.fnc_onerror($("." + this.str_errorPattern, this));
	return this.boo_isValid;
};
