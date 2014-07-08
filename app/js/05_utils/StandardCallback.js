StandardCallback = function(error, success)
{
	if (error)
		Log.popup.error(error);
	else
		Log.popup.success(success);
};
