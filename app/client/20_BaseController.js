app.controller("BaseController", [ "$scope", "autorun", "$element", "$location",function($scope, autorun, $element, $location)
{
	GAnalytics.pageview();
	
	GlobalSubsManager.subscribe("myPlayer");
	
	$scope.contentOnlyMode = ($location.$$search != undefined && $location.$$search.contentOnlyMode == undefined) ? false : $location.$$search.contentOnlyMode;
	
	$scope.i18n = i18n;
	$scope.openligadbI18n = openligadbI18n;
	
	$scope.notverified = false;
	$scope.helptextStatus = false;
	
	$scope.toggleHelp = function()
	{
		// reinitialize dynamic content
		$('.helptext').tooltipster({
			animation : 'fall',
			delay : 200,
			theme : 'tooltipster-shadow',
			touchDevices : false,
			trigger : 'none',
			positionTracker : true
		});
		$('.helptext-bottom').tooltipster({
			position : "bottom",
			animation : 'fall',
			delay : 200,
			theme : 'tooltipster-shadow',
			touchDevices : false,
			trigger : 'none',
			positionTracker : true
		});
		$('.helptext-top').tooltipster({
			position : "top",
			animation : 'fall',
			delay : 200,
			theme : 'tooltipster-shadow',
			touchDevices : false,
			trigger : 'none',
			positionTracker : true
		});
		$('.helptext-left').tooltipster({
			position : "left",
			animation : 'fall',
			delay : 200,
			theme : 'tooltipster-shadow',
			touchDevices : false,
			trigger : 'none',
			positionTracker : true
		});
		$('.helptext-right').tooltipster({
			position : "right",
			animation : 'fall',
			delay : 200,
			theme : 'tooltipster-shadow',
			touchDevices : false,
			trigger : 'none',
			positionTracker : true
		});
		
		if ($scope.helptextStatus)
		{
			$('.helptext').tooltipster('hide');
			$('.helptext-top').tooltipster('hide');
			$('.helptext-bottom').tooltipster('hide');
			$('.helptext-left').tooltipster('hide');
			$('.helptext-right').tooltipster('hide');
			
			$scope.helptextStatus = false;
		}
		else
		{
			$('.helptext').tooltipster('show');
			$('.helptext-top').tooltipster('show');
			$('.helptext-bottom').tooltipster('show');
			$('.helptext-left').tooltipster('show');
			$('.helptext-right').tooltipster('show');
			$scope.helptextStatus = true;
		}
	};
	
	$scope.setLanguage = function(languageCode)
	{
		i18n.setLanguage(languageCode);
		
		if (Meteor.userId())
		{
			Meteor.call("setLanguage", languageCode, function(error, success)
			{
				if (error)
					console.error(error);
				else
				{
					console.log("changed language to : " + languageCode);
				}
			});
		}
		else
		{
			if (localStorage)
			{
				console.log("No User logged in, using local storage to store language!");
				localStorage.setItem("language", languageCode);
			}
		}
	};
	
	$scope.openModalLogin = function()
	{
		var $modal = $(this.find('#login-buttons-reset-password-modal'));
		$modal.modal();
	};
	
	// GLOBAL FUNCTIONS
	$scope.openPath = function(path)
	{
		$location.path(path);
	};
	
	$scope.asArray = function(number)
	{
		if (number)
		{
			return new Array(number);
		}
		else
		{
			return undefined;
		}
	};
	
	$scope.isAdministrator = isAdministrator();
	
	$scope.progressComponent = function(id, show)
	{
		$("#" + id).show();
		
		if (show)
			$("#" + id).fadeIn();
		else
			$("#" + id).fadeOut();
	};
	
	autorun($scope, function()
	{
		if (Meteor.user() != null)
		{
			i18n.setLanguage(Meteor.user().language);
			
			$scope.isAdministrator = isAdministrator();
			
			// check verified status
			if (Meteor.user().emails instanceof Array && Meteor.user().emails.length > 0)
			{
				$scope.notverified = !Meteor.user().emails[0].verified;
			}
		}
		else
		{
			$scope.notverified = false;
			
			if (localStorage && localStorage.getItem("language") != null)
				i18n.setLanguage(localStorage.getItem("language"));
			else
				i18n.setLanguage("en");
		}
		
		// change language for moment.js
		switch (i18n.getLanguage())
		{
			case "de":
			case "pl":
			case "es":
			case "it":
			case "fr":
				moment.lang(i18n.getLanguage());
				break;
			case "franconian":
			case "berlin":
				moment.lang("de");
				break;
			
			default:
				moment.lang("en");
		}
		
	});
} ]);
