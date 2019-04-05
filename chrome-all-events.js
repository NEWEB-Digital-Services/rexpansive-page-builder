/**
 * Script to launch from Chrome DevTools console
 * to trace any event on a web page
 */

/**
 * Generic callback that logs the node and the type of the event
 * triggered
 * @param {Event} e event object
 */
var generic_callback = function(e)
{
  console.log({el: this, type: e.type });
}

// get all page nodes
var alls = document.getElementsByTagName('*');
var alls_evs = [];

// add window and document events
alls_evs.push(getEventListeners(window));
alls_evs.push(getEventListeners(document));

for( evs in alls_evs[0] )
{
  window.addEventListener(evs, generic_callback);
}

for( evs in alls_evs[1] )
{
  document.addEventListener(evs, generic_callback);
}

for(var i=0, tot=alls.length; i<tot; i++) {
  var t_evs = getEventListeners(alls[i]);
  alls_evs.push(t_evs);
  for( var evs in t_evs ) {
    if( Object.keys(t_evs).length !== 0 && t_evs.constructor === Object ) {
      alls[i].addEventListener(evs, generic_callback);
    }
  }
}

// trace event types
var types = [];
for(var j=alls_evs.length-1; j>=0; j--) {
  if( Object.keys(alls_evs[j]).length !== 0 && alls_evs[j].constructor === Object ) {
    // alls_evs.splice(j,1)
    for( evs in alls_evs[j] )
    {
      if ( -1 === types.indexOf(evs) )
      {
        types.push(evs);
      }
    }
  }
}

console.log(types);