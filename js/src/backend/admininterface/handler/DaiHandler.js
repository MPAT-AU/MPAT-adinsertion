
function sendAndHandleRequest(jsonBody,name,thumbnail){

  var dashUrl = ""
  var hlsUrl  = ""

  httpGetAsync("http://daiservices.fokus.fraunhofer.de:3001/json/fame/vod", jsonBody, response => {
      console.log(response);

      dashUrl = response['dashUrl'];
      hlsUrl = response['hlsUrl'];

      saveInDatabase(dashUrl, hlsUrl, name , thumbnail);

  });

}


function httpGetAsync(theUrl, JSONBODY , callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); 
  xmlHttp.send(JSONBODY);
}
 

function saveInDatabase(dashUrl, hlsUrl, name , thumbnail){
  
}