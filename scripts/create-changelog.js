const path = require('path')
const fs = require('fs')
const xml2js = require('xml2js');

const changelogFile = path.resolve('../notifier-builder-premium.xml')
const xmlChangelog = fs.readFileSync(changelogFile)

xml2js.parseString(xmlChangelog, (err, result) => {
    if(err) {
        throw err;
    }

	console.log(result.notifier.changelog)
    
});
