/*
 * FormStyle - jQuery plugin 0.1.0
 *
 * Copyright (c) 2009 Wei Kin Huang, TimeDelimited.com
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
( function($) {
	$.fn.formstyle = function(options) {
		var defaults = {};
		var options = $.extend(defaults, options);

		return this.each( function() {
			$('input:checkbox', this).checkboxstyle();
			$('select', this).selectstyle()
		});
	};
})(jQuery);

( function($) {
	$.fn.checkboxstyle = function(options) {
		var defaults = {};
		var options = $.extend(defaults, options);

		return this.each( function() {
			var _this = this;
			var wrapper = $(_this).wrap('<a href="javascript:;"></a>').parent('a').addClass('form-style');

			$(wrapper).addClass('checkbox');

			$(wrapper).click( function() {
				if (!_this.disabled) {
					_this.checked = !_this.checked;
				}

				$(_this).change();
				return false;
			});

			$('label[for=' + $(_this).attr('id') + ']').click( function() {
				if (!_this.disabled) {
					_this.checked = !_this.checked;
				}

				$(_this).change();
				return false;
			});

			$(_this).change( function() {
				(this.checked) ? $(wrapper).addClass('checked') : $(wrapper).removeClass('checked');
			});

			if (_this.disabled) {
				$(wrapper).addClass('disabled');
			}
			if (_this.checked) {
				$(wrapper).addClass('checked');
			}
		});
	};
})(jQuery);

( function($) {
	$.fn.selectstyle = function(options) {
		var defaults = {};
		var options = $.extend(defaults, options);

		return this.each( function() {
			var _this = this;
			var wrapper = $(_this).wrap('<div></div>').parent('div').addClass('form-style');
			$(wrapper).addClass('select').append('<a href="javascript:;" class="selector"></a>').append('<a href="javascript:;" class="expander"></a>').append('<ul class="options"></ul>');
			var selector = $(wrapper).find('a.selector').get(0);
			var expander = $(wrapper).find('a.expander').get(0);
			var optgroup = $(wrapper).find('ul.options').get(0);

			function generateOptions() {
				$(optgroup).html('');
				$('option', _this).each( function(i) {
					$(optgroup).append('<li><a href="#" rel="' + i + '">' + this.text + '</a></li>');
				});
				$('a:even', optgroup).addClass('even');
			}

			function expandOptions() {
				if ($(optgroup).css('display') != 'none') {
					$(expander).removeClass('open');
					$(optgroup).slideToggle("fast");
				} else {
					$(expander).addClass('open');
					$(optgroup).slideToggle("fast");
					var selected_offset = parseInt($('a.selected', optgroup).position().top);
					$(optgroup).animate( {
						scrollTop :selected_offset
					});
				}
				return false;
			}

			generateOptions();

			$(expander).click(expandOptions);
			$(selector).click(expandOptions);
			$('label[for=' + $(_this).attr('id') + ']').click(expandOptions);

			$(_this).change( function() {
				$('a:eq(' + this.selectedIndex + ')', optgroup).click();
			});

			$('a', optgroup).click( function() {
				$('a.selected', optgroup).removeClass('selected');
				$(this).addClass('selected');
				_this.selectedIndex = parseInt($(this).attr('rel'));
				fyfx.onSelectChange($(_this), $(selector), $(this).html());
				$(selector).html($(this).html());
				$(expander).removeClass('open');
				$(optgroup).slideUp();
				
				return false;
			});

			$('a:eq(' + _this.selectedIndex + ')', optgroup).click();
		});
	};
})(jQuery);