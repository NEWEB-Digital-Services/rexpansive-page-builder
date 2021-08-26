const path = require('path')

const logfile = path.resolve('./log.txt')

var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream(logfile)
});
  
lineReader.on('line', function (line) {
	if ('' !== line) {
		console.log(line)
	}
});
  