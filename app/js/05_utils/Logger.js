/**
 * @param type Type can be "console" or "popup"
 */
var Logger = function(type)
{
	var loggerPopupOptions = {
		// autoHide : 15000,
		alertsLimit : 1,
		dismissable : true
	};
	
	/**
	 * @param message The Message you want to post
	 * @param {String} level if not set, defaults to "info", use standard log4j
	 *            kind of levels
	 */
	this.log = function(message, level, options)
	{
		if (!level)
		{
			level = "info";
		}
		
		switch (type)
		{
			case "popup":
				if (options)
				{
					_.extend(loggerPopupOptions, options);
				}
				switch (level)
				{
					case "error":
						Alerts.add(message, 'danger', loggerPopupOptions);
						break;
					case "warn":
						Alerts.add(message, 'warning', loggerPopupOptions);
						break;
					case "success":
						Alerts.add(message, 'success', loggerPopupOptions);
						break;
					case "debug":
					case "info":
					default:
						Alerts.add(message, 'info', loggerPopupOptions);
				}
				break;
			case "console":
				switch (level)
				{
					case "debug":
						console.debug(message);
						break;
					case "error":
						console.error(message);
						break;
					case "warn":
						console.warn(message);
						break;
					case "info":
					default:
						console.log(message);
				}
				break;
		}
	};
	
	this.info = function(message, options)
	{
		this.log(message, "info", options);
	};
	
	this.debug = function(message, options)
	{
		this.log(message, "debug", options);
	};
	
	this.warn = function(message, options)
	{
		this.log(message, "warn", options);
	};
	
	this.error = function(message, options)
	{
		this.log(message, "error", options);
	};
	
	this.success = function(message, options)
	{
		this.log(message, "success", options);
	};
	
	this.dump = function(orig)
	{
		var logger = this;
		var inspectedObjects = [];
		this.log('== DUMP ==');
		(function _dump(o, t)
		{
			logger.log(t + ' Type ' + (typeof o), "info");
			inspectedObjects.push(o);
			for ( var i in o)
			{
				
				var p = o[i];
				logger.log(t + ' property ' + i + ' = ' + p);
				if (p instanceof Object || p instanceof Array)
				{
					var ind = 1 + inspectedObjects.indexOf(p);
					if (ind > 0)
						logger.log(t + 'already inspected ' + i);
					else
					{
						_dump(p, t + '>>');
					}
				}
			}
		}(orig, '>'));
	};
};

// default one
Log = new Object();
Log.console = new Logger("console");
Log.popup = new Logger("popup");
