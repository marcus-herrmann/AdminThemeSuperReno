/**
 * ProcessWire Admin Theme jQuery/Javascript
 *
 * Copyright 2012 by Ryan Cramer
 * 
 */

var ProcessWireAdminTheme = {

	/**
	 * Initialize the default ProcessWire admin theme
	 *
	 */
	
	init: function() {
		this.setupCloneButton();
		this.setupButtonStates();
		this.setupFieldFocus();
		this.setupTooltips();
		this.setupSearch();
		this.setupDropdowns();
		this.setupSidebarNav();
		this.setupSpinner();
		// this.sizeTitle();
		if($("body").hasClass('hasWireTabs') && $("ul.WireTabs").size() == 0) $("body").removeClass('hasWireTabs'); 
		$('#content').removeClass('fouc_fix'); // FOUC fix
		this.browserCheck();
	},


	/**
	 * pagelist loader
	 *
	 */
	
	setupSpinner: function() {
		$('.PageListLoading').append("<i class='fa fa-spinner fa-spin'></i>");
	},

	/**
	 * Sidebar Navigation State
	 *
	 */
	setupSidebarNav: function() {
		
		var url = window.location.toString()

		$(document).mouseup(function (e){
		    var quicklinks = $("ul.quicklinks");
		    if (!quicklinks.is(e.target) && quicklinks.has(e.target).length === 0){
		        quicklinks.hide();
		        $('.quicklink-open').removeClass('active');
		        $('#main-nav .current').removeClass('no-arrow');
		    }
		});

		$("#main-nav a.parent").click(function(){
			$(this).toggleClass('open').next('ul').eq(0).slideToggle('fast');
			return false;
		});

		$(".quicklink-open").click(function(event){
			$(this).toggleClass('active').parent().next('ul.quicklinks').toggle();
			$(this).parent().parent().siblings().find('ul.quicklinks').hide();
			$(this).parent().parent().siblings().find('.quicklink-open').removeClass('active');
			event.stopPropagation();
			//psuedo elements are not part of the DOM, need to remove current arrows by adding a class to the current item.
			$('#main-nav .current:not(.open)').addClass('no-arrow'); 
			return false;
		});

		$(".quicklink-close").click(function(){
			$(this).closest('ul.quicklinks').hide();
			$('.quicklink-open').removeClass('active');
			$('#main-nav .current').removeClass('no-arrow'); 
			return false;
		});

		$('#main-nav .parent').each(function(){
      		var myHref= $(this).attr('href');
      		if(url.match(myHref)) {
	           $(this).next('ul').show();
			   $(this).addClass('open');
	      	}
		}); 
	},

	/**
	 * Enable jQuery UI tooltips
	 *
	 */
	setupTooltips: function() {
		$("a.tooltip").tooltip({ 
			position: {
				my: "center bottom-20",
				at: "center top",
				using: function(position, feedback) {
					$(this).css(position);
					$("<div>")
						.addClass("arrow")
						.addClass(feedback.vertical)
						.addClass(feedback.horizontal)
						.appendTo(this);
				}
			}
		}).hover(function() {
			$(this).addClass('ui-state-hover');
		}, function() {
			$(this).removeClass('ui-state-hover');
		}); 
	},

	/**
	 * Clone a button at the bottom to the top 
	 *
	 */
	setupCloneButton: function() {
		// no head_button in modal view
		if($("body").is(".modal")) return;

		// if there are buttons in the format "a button" without ID attributes, copy them into the masthead
		// or buttons in the format button.head_button_clone with an ID attribute.
		// var $buttons = $("#content a[id=] button[id=], #content button.head_button_clone[id!=]"); 
		var $buttons = $("#content a:not([id]) button:not([id]), #content button.head_button_clone[id!=]"); 

		// don't continue if no buttons here or if we're in IE
		if($buttons.size() == 0 || $.browser.msie) return;

		var $head = $("<div id='head_button'></div>").prependTo("#headline").show();
		$buttons.each(function() {
			var $t = $(this);
			var $a = $t.parent('a'); 
			if($a.size()) { 
				$button = $t.parent('a').clone();
				$head.append($button);
			} else if($t.is('.head_button_clone')) {
				$button = $t.clone();
				$button.attr('data-from_id', $t.attr('id')).attr('id', $t.attr('id') + '_copy');
				$a = $("<a></a>").attr('href', '#');
				$button.click(function() {
					$("#" + $(this).attr('data-from_id')).click(); // .parents('form').submit();
					return false;
				});
				$head.append($a.append($button));	
			}
		}); 
	},

	/**
	 * Make buttons utilize the jQuery button state classes
	 *	
 	 */
	setupButtonStates: function() {
		// jQuery UI button states
		$(".ui-button").hover(function() {
			$(this).removeClass("ui-state-default").addClass("ui-state-hover");
		}, function() {
			$(this).removeClass("ui-state-hover").addClass("ui-state-default");
		}).click(function() {
			$(this).removeClass("ui-state-default").addClass("ui-state-active"); 
		});

		// make buttons with <a> tags click to the href of the <a>
		$("a > button").click(function() {
			window.location = $(this).parent("a").attr('href'); 
		}); 
	},

	/**
	 * Make the first field in any forum have focus, if it is a text field
	 *
	 */
	setupFieldFocus: function() {
		// add focus to the first text input, where applicable
		jQuery('#content input[type=text]:visible:enabled:first:not(.hasDatepicker)').each(function() {
			var $t = $(this); 
			if(!$t.val() && !$t.is(".no_focus")) window.setTimeout(function() { $t.focus(); }, 1);
		});

	},


	/**
	 * Make the site search use autocomplete
	 * 
	 */
	setupSearch: function() {

		$.widget( "custom.adminsearchautocomplete", $.ui.autocomplete, {
			_renderMenu: function(ul, items) {
				var that = this;
				var currentType = "";
				$.each(items, function(index, item) {
					if (item.type != currentType) {
						ul.append("<li class='ui-widget-header'><a>" + item.type + "</a></li>" );
						currentType = item.type;
					}
					ul.attr('id', 'ProcessPageSearchAutocomplete'); 
					that._renderItemData(ul, item);
				});
			},
			_renderItemData: function(ul, item) {
				if(item.label == item.template) item.template = '';
				ul.append("<li><a href='" + item.edit_url + "'>" + item.label + " <small>" + item.template + "</small></a></li>"); 
			}
		});
		
		var $input = $("#ProcessPageSearchQuery"); 
		var $status = $("#ProcessPageSearchStatus"); 
		
		$input.adminsearchautocomplete({
			minLength: 2,
			position: { my : "right top", at: "right bottom" },
			search: function(event, ui) {
				$status.html("<img src='" + config.urls.modules + "Process/ProcessPageList/images/loading.gif'>");
			},
			source: function(request, response) {
				var url = $input.parents('form').attr('action') + 'for?get=template_label,title&include=all&admin_search=' + request.term;
				$.getJSON(url, function(data) {
					var len = data.matches.length; 
					if(len < data.total) $status.text(data.matches.length + '/' + data.total); 
						else $status.text(len); 
					response($.map(data.matches, function(item) {
						return {
							label: item.title,
							value: item.title,
							page_id: item.id,
							template: item.template_label ? item.template_label : '',
							edit_url: item.editUrl,
							type: item.type
						}
					}));
				});
			},
			select: function(event, ui) { }
		}).blur(function() {
			$status.text('');	
		});

	},

	setupDropdowns: function() {

		$("ul.dropdown-menu").each(function() {
			var $ul = $(this).hide();
			var $a = $ul.siblings(".dropdown-toggle"); 

			if($a.is("button")) {
				$a.button();
			} else {
				$ul.css({ 'border-top-right-radius': 0 }); 
			}

			// hide nav when an item is selected to avoid the whole nav getting selected
			$ul.find('a').click(function() {
				$ul.hide();
				return true; 
			});

			var lastOffset = null; 

			$a.mouseenter(function() {
				var offset = $a.offset();	
				if(lastOffset != null) {
					if(offset.top != lastOffset.top || offset.left != lastOffset.left) {
						// dropdown-toggle has moved, destroy and re-create
						$ul.menu('destroy').removeClass('dropdown-ready');
					}
				}	
				if(!$ul.hasClass('dropdown-ready')) {
					$ul.css('position', 'absolute'); 
					$ul.prependTo($('body')).addClass('dropdown-ready').menu();
					var position = { my: 'right top', at: 'right bottom', of: $a };
					var my = $ul.attr('data-my'); 
					var at = $ul.attr('data-at'); 
					if(my) position.my = my; 
					if(at) position.at = at; 
					$ul.position(position).css('z-index', 9999);
				}
				$a.addClass('hover'); 
				$ul.show();
				lastOffset = offset; 

			}).mouseleave(function() {
				setTimeout(function() {
					if($ul.is(":hover")) return;
					$ul.hide();
					$a.removeClass('hover');
				}, 0); 
			}); 

			$ul.mouseleave(function() {
				if($a.is(":hover")) return;
				$ul.hide();
				$a.removeClass('hover'); 
			}); 
		});

	}, 	

	/**
	 * Give a notice to IE versions we don't support
	 *
	 */
	browserCheck: function() {
		if($.browser.msie && $.browser.version < 8) 
			$("#content .container").html("<h2>ProcessWire does not support IE7 and below at this time. Please try again with a newer browser.</h2>").show();
	}
};

$(document).ready(function() {
	ProcessWireAdminTheme.init();

	$("#notices a.notice-remove").click(function() {
		$("#notices").slideUp('fast', function() { $(this).remove(); }); 
	});

	$(".main-nav-toggle").click(function() {
		$(this).add("#sidebar, #main").toggleClass("toggle");
		return false;
	});

	
}); 
