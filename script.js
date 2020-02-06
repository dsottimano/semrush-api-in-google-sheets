/* ---------------------------------------------------------------------------
* Semrush API functions (Google sheets) from Analytics API: https://www.semrush.com/api-analytics/ 
*
* @desc    Access Organic API calls from the Semrush.com API using Google sheets formulas
* @author  Dave Sottimano @dsottimano Twitter
* @license MIT (http://www.opensource.org/licenses/mit-license.php)
* @version 1.0
* -------------------------------------------------------------------------*/

//----------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi() 
  .createMenu('Helper Functions')
  .addItem('Check Semrush API balance', 'checkSemrushAccount')
  .addItem('Add your API key', 'addApiKey')
  .addItem('Flush the cache', 'flushAllCacheAndProperties')
  .addItem('Show formula reference', 'formulaReferenceSidebar')
  .addToUi();
  
  if (!SemrushGlobal.data.API_KEY) SpreadsheetApp.getActiveSpreadsheet().toast('In the Helper Functions menu (menu bar), click on Add your API key to get started!', 'The Library is ready to rock :', 5);
    
}

function formulaReferenceSidebar () {
var htmlOutput = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Semrush API Library (Unofficial)');
   
SpreadsheetApp.getUi().showSidebar(htmlOutput);
}


/* ---------------------------------------------------------------------------*
              SemrushGlobal Object START 
* -------------------------------------------------------------------------*/

var SemrushGlobal = {
    
    data : {
      API_KEY : PropertiesService.getUserProperties().getProperty("semrushkey"),
      DEFAULT_DB : "us",
      API_KEY_PROPERTY_NAME: "semrushkey"
    },
    queries : {
      domainOrganic : "http://api.semrush.com/?type=domain_organic&key=",
      urlOrganic : "http://api.semrush.com/?type=url_organic&key=",
      keywordDifficulty: "http://api.semrush.com/?type=phrase_kdi&key=",
      phraseOrganic : "http://api.semrush.com/?type=phrase_organic&key=",
      keywordVolume : "http://api.semrush.com/?type=phrase_this&key=",
      relatedQueries : "http://api.semrush.com/?type=phrase_related&key=",
      phraseQuestions: "https://api.semrush.com/?type=phrase_questions&key=",
      domainOverview : "http://api.semrush.com/?type=domain_rank&key=",
      countUnits : "http://www.semrush.com/users/countapiunits.html?key="
    },
    methods : {
      giveApiRest : function giveApiRest () {
        Utilities.sleep(200)
      },
      checkAccount : function checkAccount () {       
        
        try {
          if (!SemrushGlobal.data.API_KEY) return [false,"No valid API key found. Please run the Add Semrush Key function from the Spreadsheet menu under 'Helper functions'"]  
          var result = UrlFetchApp.fetch(SemrushGlobal.queries.countUnits + SemrushGlobal.data.API_KEY,{"muteHttpExceptions":true})
          
          if (typeof result.getContentText() === "string") {
            if(parseInt(result.getContentText()) > -1) { 
              return [true]
            }
            var parsedResult = JSON.parse(result.getContentText())
            if (parsedResult == 0) throw "The key:" + PropertiesService.getDocumentProperties().getProperty("semrushkey") + " has no credits left"
            if (parsedResult.data.error) throw parsedResult.data.error
              return [true]
              } 
          
            } catch (e) {
              return [false,e]
            } 
      }, 
      parseApiResponse  : function parseApiResponse(result,valueBoolean) { 
        var data = [], valueBoolean, filtered
        valueBoolean ? valueBoolean = 1 : valueBoolean = 0;
        var newLines = result.split("\n");

        try {
          for(i=valueBoolean;i<newLines.length;i++) {
            data.push(newLines[i].split(";"))
          }

          //this is inefficient to remove stubborn whitespace - nbed - need a better solution but it works for now
          for (var i = 0; i < data.length; i++) {
            for (var y = 0; y < data[i].length; y++) {
             data[i][y] = data[i][y].replace(/\n|\r\n/g,"")
            }
          }

          //also inefficient to get rid of null values in the result array
          var cleanArray = data.filter(function (line) {
            return line != "";
          });
          
          return cleanArray
        } catch(e) {
          return e
        }
      }  
      
    }
 
}


/* ---------------------------------------------------------------------------*
              SemrushGlobal Object END 
* -------------------------------------------------------------------------*/


/* ---------------------------------------------------------------------------*
              Helper functions START 
* -------------------------------------------------------------------------*/



var ROOT_ = {
  
    cacheDefaultTime: 1500,
    
    // Step 1 -- Construct a unique name for function call storage using the function name and arguments passed to the function
    // example: function getPaidApi(1,2,3) becomes "getPaidApi123"
    encode: function encode(functionName, argumentsPassed) {
      var data = [functionName].concat(argumentsPassed);
      var json = JSON.stringify(data);
      return Utilities.base64Encode(json);
    },
    
    //Step 2 -- when a user calls a function that uses a paid api, we want to cache the results for 25 minutes
    addToCache : function addToCache (encoded, returnedValues) { 
      
      var values = {
        returnValues : returnedValues
      }
      CacheService.getDocumentCache().put(encoded, JSON.stringify(values), this.cacheDefaultTime)
      //also set the properties service keys so we can loop through and delete the cache if necessary
      PropertiesService.getDocumentProperties().setProperty(encoded, JSON.stringify(values))
    },
    
    //Step 3 -- if the user repeats the exact same function call with the same arguments, we give them the cached result
    //this way, we don't consume API credits as easily. 
    checkCache : function checkCache(encoded) {
      
      var cached = CacheService.getDocumentCache().get(encoded);
      
      try {
        cached = JSON.parse(cached)
        return cached.returnValues
      } catch (e) {
        return false;
      }
    },
    onlyUnique : function(value, index, self) { 
      return self.indexOf(value) === index;
    },
    checkUrl : function (url) {
      if (!url || typeof url !== "string") return false
      if (typeof url === "string") {
        if (url.indexOf("http") === -1) return false
          }
      
      return true
    }

}

function CACHE_TEST (data,cache) {
  if (cache) {
    var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
    var cachedResult = ROOT_.checkCache(cacheStringName); 
    if (cachedResult) return cachedResult + " from Cache! :)";
  } 
  
  if (cache) ROOT_.addToCache(cacheStringName,data);
  return data
  
}

function addApiKey () {
  var ui = SpreadsheetApp.getUi();
  var key = SemrushGlobal.data.API_KEY;
  var response = "";
  
  if(key) {
    response = ui.prompt('SEMRUSH KEY FOR THIS DOCUMENT', 'Looks like you already have the following key: ' + key + '. You can set another key in the box below', ui.ButtonSet.OK_CANCEL);
    if (response.getSelectedButton() == ui.Button.OK) PropertiesService.getUserProperties().setProperty("semrushkey", response.getResponseText())
    return false
  } 
  
  response = ui.prompt('SEMRUSH KEY FOR THIS DOCUMENT', 'Set your key', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() == ui.Button.OK) PropertiesService.getUserProperties().setProperty("semrushkey", response.getResponseText()) 

}


function CacheServiceOutOfGlobalScope (key) {
  return CacheService.getDocumentCache().remove(key)
}

function PropertyServiceOutOfGlobalScope (key) {
  return PropertiesService.getDocumentProperties().deleteAllProperties();
}

function flushAllCacheAndProperties () {
  var properties = PropertiesService.getDocumentProperties().getKeys()
  
  for (var i = 0 ; i < properties.length ; i ++ ) {
  if (properties[i] === SemrushGlobal.data.API_KEY_PROPERTY_NAME) continue;
    CacheServiceOutOfGlobalScope(properties[i])
  }
  
  PropertyServiceOutOfGlobalScope()
}


function checkSemrushAccount () {
  try {
  if (typeof SemrushGlobal.data.API_KEY !== "string" ||  !SemrushGlobal.data.API_KEY) {
    return Browser.msgBox("Oops, an Error has occurred","No valid API key found. Please run the Add Semrush Key function from the Spreadsheet menu under 'Helper functions'",Browser.Buttons.OK)  
  } 
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.countUnits + SemrushGlobal.data.API_KEY,{"muteHttpExceptions":true}).getContentText()
    if (typeof result === "string" && result > -1) {
        return Browser.msgBox("You have : " + result + " API credits left")
      }
      var parsedResult = JSON.parse(result)
      if (parsedResult.data.error) throw parsedResult.data.error
    
  } catch (e) {
    return Browser.msgBox("Oops, an Error has occurred","Error: " + e, Browser.Buttons.OK)
  }
}

/* ---------------------------------------------------------------------------*
              Helper functions END 
* -------------------------------------------------------------------------*/



/* ---------------------------------------------------------------------------*
                MAIN functions START 
* -------------------------------------------------------------------------*/


/**
* Returns Semrush domain history for a specified domain from January 2012 onwards
*
* @param {"example.com"} domain REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https)
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {201601} date OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month.
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Returns organic keywords count, organic traffic, organic cost, adwords data
* @customfunction
*/

function DOMAIN_OVERVIEW_SEMRUSH(domain,db,date,excludeHeaders,cache) {
  try {
    if (!domain || domain.indexOf("http") > -1) return "Error: Enter a valid domain, do not include protocol";
    if (domain.map) throw "Sorry, the domain parameter cannot be an array of values. It needs to be a single string"
    var displayDate = "&display_date=", db = db || SemrushGlobal.data.DEFAULT_DB;
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1] 
    
    date ? displayDate+= date + "15" : displayDate = "";
    SemrushGlobal.methods.giveApiRest();
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
    } 
    
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.domainOverview+SemrushGlobal.data.API_KEY+"&export_columns=Or,Ot,Oc,Ad,At,Ac&domain="+domain+"&database="+db+displayDate).getContentText()
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch (e) {
    return e;
  }
  
  
}

/**
* Returns Semrush Organic keywords for a specified domain
*
* @param {"example.com"} domain REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https)
* @param {true} filterBy OPTIONAL Use true to include the query in the filter or false to remove the query in the filter. Default is true
* @param {true} matchType OPTIONAL Use true for partial match, use false for exact match. Default is true, partial match 
* @param {"apartments"} query OPTIONAL The keyword you want to filter by. Relies on previous 2 parameters. Example: "brown shoes".
* @param {10} limit OPTIONAL Number from 1 to 10000
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {201601} date OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month.
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Access organic keywords for a domain from semrush.com database. 
* @customfunction
*/


function DOMAIN_ORGANIC_KEYWORDS_SEMRUSH(domain,filterBy,matchType,query,limit,db,date,excludeHeaders,cache) {
  try {
    if (!domain || domain.indexOf("http") > -1) return "Error: Enter a valid domain, do not include protocol"
    if (domain.map) throw "Sorry, the domain parameter cannot be an array of values. It needs to be a single string"
    var displayDate = "&display_date=", filterOperator,filterBy,excludeHeaders,query = query || "", limit = limit || 1, db = db || SemrushGlobal.data.DEFAULT_DB, filterBy = filterBy && true, matchType = matchType && true
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1]
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName) ;
      if (cachedResult) return cachedResult;      
    }  
    
    date ? displayDate+= date + "15" : displayDate = "";
    filterBy ? filterBy = "%2B" : filterBy = "-";
    matchType ? matchType = "Co" : matchType = "Eq"
    if(query) query = "%7C" + query
    
    SemrushGlobal.methods.giveApiRest();
    
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.domainOrganic+SemrushGlobal.data.API_KEY+"&display_limit="+limit+"&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr,Td&domain="+domain+"&display_sort=tr_desc&database="+db+"&display_filter="+filterBy+"%7CPh%7C"+matchType+query+displayDate).getContentText()
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch (e) {
    return e;
  }
  
  
}


/**
* Returns Historical rankings for domain/keyword combination
*
* @param {"example.com"} domain REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https)
* @param {"apartments"} query OPTIONAL The keyword you want to filter by. Relies on previous 2 parameters. Example: "brown shoes".
* @param {10} limit OPTIONAL Number from 1 to 10000
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {201601} date OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month.
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Access organic keywords for a domain from semrush.com database
* @customfunction
*/

function HISTORICAL_RANKING_KEYWORD_SEMRUSH(domain,query,limit,db,date,excludeHeaders,cache) {
  
  try {
    if (!domain || domain.indexOf("http") > -1) return "Error: Enter a valid domain, do not include protocol"
    var displayDate = "&display_date=",filterBy = "%2B", matchType = "Eq", excludeHeaders,query = query || "", limit = limit || 1, db = db || SemrushGlobal.data.DEFAULT_DB
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1] 
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments)
      var cachedResult = ROOT_.checkCache(cacheStringName) 
      if (cachedResult) return cachedResult
        } 
    date ? displayDate+= date + "15" : displayDate = "";
    
    SemrushGlobal.methods.giveApiRest();
    
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.domainOrganic+SemrushGlobal.data.API_KEY+"&display_limit="+limit+"&export_columns=Po&domain="+domain+"&display_sort=tr_desc&database="+db+"&display_filter="+filterBy+"%7CPh%7C"+matchType+"%7C"+query+displayDate).getContentText()
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch (e) {
    return e
  }
  
  
}




/**
* Returns Ranking Semrush Organic keywords per URL
* @param {"http://example.com"} url REQUIRED The exact URL you want data for, MUST include protocol (http/https)
* @param {"10"} limit OPTIONAL Number from 1 to 10,000, for number of results
* @param {"US"} db OPTIONAL The database, example "US" for American database. Default is US
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Access organic keywords for a url from semrush.com database
* @customfunction
*/


function URL_ORGANIC_KEYWORDS_SEMRUSH(url,limit,db,excludeHeaders,cache) {
  try {
    var db = db || SemrushGlobal.data.DEFAULT_DB, limit = limit || 10;
    if (!url || url.indexOf("http") == -1) return "Error: Enter a valid URL, ensure you include the protocol";
    if (url.map) throw "Sorry, the URL parameter cannot be an array of values. It needs to be a single string"
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    //semrush won't report on a homepage unless it has a trailing slash;
    if (url.match(/\//g).length < 3) url += "/";
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1] 
   
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName);
      if (cachedResult) return cachedResult;
    }
    SemrushGlobal.methods.giveApiRest();
    
    
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.urlOrganic + SemrushGlobal.data.API_KEY+ "&display_limit="+limit+"&export_columns=Ph,Po,Nq,Cp,Co,Tr,Tc,Nr,Td&url="+url+"&database="+db).getContentText();
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch(e) {
    return e;
  }
}


/**
* Returns Semrush Keyword Difficulty for a keyword 
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Access keyword difficulty for keyword from semrush
* @customfunction
*/

function KEYWORD_DIFFICULTY_SEMRUSH(query,db,excludeHeaders,cache) {
  try {
    if (!query) return "Error: Missing query";
    if (query.map) throw "Sorry, the query parameter cannot be an array of values. It needs to be a single string"
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    var db = db || SemrushGlobal.data.DEFAULT_DB;
    
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1] 
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
    }
    SemrushGlobal.methods.giveApiRest();
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.keywordDifficulty + SemrushGlobal.data.API_KEY+ "&export_columns=Ph,Kd&phrase="+query+"&database=" + db).getContentText();
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch(e) {
    return e
  }
}

/**
* Returns Semrush organic search results for a specific keyword
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {10} limit OPTIONAL Number from 10 to 20, for number of results. Default is 10
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Access organic search results for a keyword from semrush.com database
* @customfunction
*/

function SERPS_SEMRUSH(query,limit,db,excludeHeaders,cache) {
 
  try {
    if (!query) return "Error: Missing query";
    if (query.map) throw "Sorry, the query parameter cannot be an array of values. It needs to be a single string"
    var db = db || SemrushGlobal.data.DEFAULT_DB, limit = limit || 10;
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1]  
    
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName);
      if (cachedResult) return cachedResult;
    }
    
    SemrushGlobal.methods.giveApiRest();
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.phraseOrganic + SemrushGlobal.data.API_KEY+"&phrase="+query+"&export_columns=Dn,Ur,Fl&database="+db+"&display_limit="+limit).getContentText();
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result);
  } catch (e) {
    return e
  }
}

/**
* Returns Related search queries for a keyword from Semrush
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {10} limit OPTIONAL The number of results. Default is 1
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Returns related queries for a specific keyword from semrush.com
* @customfunction
*/


function RELATED_QUERIES_SEMRUSH(query,limit,db,excludeHeaders,cache) {
  try {
    if (!query) return "Error: Missing query";
    if (query.map) throw "Sorry, the query parameter cannot be an array of values. It needs to be a single string"
    var limit = limit || 1, db = db || SemrushGlobal.data.DEFAULT_DB;
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1]  
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
    }
    SemrushGlobal.methods.giveApiRest();
    
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.relatedQueries + SemrushGlobal.data.API_KEY+"&display_limit="+limit+"&export_columns=Ph,Nq,Cp,Co,Nr,Td&phrase="+query+"&database="+db+"&display_sort=nq_desc").getContentText();
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch(e) {
    return e;
  }
  
}

/**
* Returns Keyword Volume from semrush
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {"us"} db OPTIONAL The country database you want to search from, default is "us"
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Returns search volume, cpc, etc..
* @customfunction
*/

function KEYWORD_VOLUME_SEMRUSH(query,db,excludeHeaders,cache) {
  try {
    if (!query) return "Error: Missing query";
    var db = db || SemrushGlobal.data.DEFAULT_DB;
    SemrushGlobal.methods.giveApiRest();
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1] 
    
    if (query.map) throw "Sorry, the query parameter cannot be an array of values. It needs to be a single string"
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
    }
    
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.keywordVolume + SemrushGlobal.data.API_KEY+"&export_columns=Ph,Nq,Cp,Co&phrase="+query+"&database="+db).getContentText();
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
    
  } catch (e) {
    return e;
  }
}


/**
* Returns Questions asked for a keyword from Semrush
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {10} limit OPTIONAL The number of results. Default is 1
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {true} filterBySearchVolume OPTIONAL If you want to filter by search volume, use TRUE, default is FALSE
* @param {">"} searchVolumeFilter OPTIONAL Filters the search volume parameter (next). Use ">" for Greater than, or "<" for Less than. Default is ">" greater than
* @param {1000} searchVolume OPTIONAL A search volume number (per month) you want to filter results by. Both previous parameters need to be set for this to work.
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {true} cache OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled)
* @return Returns Questions asked for a specific keyword from semrush.com
* @customfunction
*/


function PHRASE_QUESTIONS_SEMRUSH(query,limit,db,filterBySearchVolume,searchVolumeFilter,searchVolume, excludeHeaders,cache) {
  try {
    if (!query) return "Error: Missing query";
    var limit = limit || 1, db = db || SemrushGlobal.data.DEFAULT_DB, searchVolumeFilter = searchVolumeFilter || ">";
    typeof cache === 'boolean' && cache === false ? cache = false: cache = true
    SemrushGlobal.methods.giveApiRest();
    var accountCheck = SemrushGlobal.methods.checkAccount() 
    if (!accountCheck[0]) return accountCheck[1]  
    
    if (cache) {
      var cacheStringName = ROOT_.encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_.checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
    }
    searchVolumeFilter === ">" ? searchVolumeFilter = "Gt" : searchVolumeFilter = "Lt" 
    filterBySearchVolume? filterBySearchVolume = "&display_filter=%2B%7CNq%7C"+searchVolumeFilter+"%7C"+searchVolume: filterBySearchVolume = ""
    var result = UrlFetchApp.fetch(SemrushGlobal.queries.phraseQuestions + SemrushGlobal.data.API_KEY+"&phrase="+query+"&export_columns=Ph,Nq,Cp,Co,Nr,Td&database="+db+"&display_limit="+limit+"&display_sort=nq_desc"+filterBySearchVolume).getContentText();
    if (result.indexOf("ERROR") > -1) throw result.trim()
    if (cache) ROOT_.addToCache(cacheStringName, SemrushGlobal.methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal.methods.parseApiResponse(result,excludeHeaders);
  } catch(e) {
    return e;
  }
  
}


/* ---------------------------------------------------------------------------*
                       MAIN functions END 
* -------------------------------------------------------------------------*/
