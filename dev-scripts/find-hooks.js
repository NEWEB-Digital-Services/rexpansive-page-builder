const glob = require("glob");
const fs = require('fs');

// options is optional
glob("**/*.php", function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  files.forEach(file => {
  	fs.readFile(file, 'utf8', (err, data) => {
  		if (err) throw err;
  		let actions = data.match(/do_action\(.*\);/gm);
  		if ( actions ) {
  			actions.forEach(action => {
  				if ( -1 === action.indexOf( 'acf' ) && -1 === action.indexOf( 'tgmpa' ) && -1 === action.indexOf( 'wpml' ) ) {
	  				let temp = action.replace(';','');
	  				temp = temp.trim();
	  				console.log(temp);
  				}
  			});
  		}

  		let filters = data.match(/apply_filters\(.*\);/gm);
  		if ( filters ) {
  			filters.forEach(filter => {
  				if ( -1 === filter.indexOf( 'acf' ) && -1 === filter.indexOf( 'tgmpa' ) && -1 === filter.indexOf( 'wpml' ) ) {  				
	  				let temp = filter.replace(';','');
	  				temp = temp.trim();
	  				console.log( temp);
	  			}
  			});
  		}
  	});
  });
});