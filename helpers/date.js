module.exports = {
	checkSameDate: function(date, pDate) {
		return (
		    date.getFullYear() === pDate.getFullYear() &&
			date.getMonth() === pDate.getMonth() &&
		    date.getDate() === pDate.getDate()
		);
	}
}