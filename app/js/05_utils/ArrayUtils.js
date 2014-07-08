ArrayContainsObject = function(array, indicator, value)
{
	if (array == undefined || !(array instanceof Array) || indicator == undefined || value == undefined)
		return false;
	
	for (var i = 0; i < array.length; i++)
	{
		if (array[i][indicator] == value)
		{
			return true;
		}
	};
	
	return false;
};
