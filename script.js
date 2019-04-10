

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
  .addToUi();
}

function onEdit(){
  SpreadsheetApp.flush()
}


function ROOT_() {
 
   var rootObject = {
    
    cache : CacheService.getDocumentCache(),
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
      this.cache.put(encoded, JSON.stringify(values), this.cacheDefaultTime)
    },
    
    //Step 3 -- if the user repeats the exact same function call with the same arguments, we give them the cached result
    //this way, we don't consume API credits as easily. 
    checkCache : function checkCache(encoded) {
      
      var cached = this.cache.get(encoded);
      
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
   return rootObject
  }
  

function checkSemrushAccount () {
  
  if (typeof SemrushGlobal().data.API_KEY !== "string" ||  !SemrushGlobal().data.API_KEY || SemrushGlobal().data.API_KEY=="ENTER API KEY HERE") {
    return false  
  } 
  try {
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.countUnits + SemrushGlobal().data.API_KEY,{"muteHttpExceptions":true}).getContentText()
    Browser.msgBox("You have : " + result + " API credits left")
    if (result == 0) return false
    return true
  } catch (e) {
    return Browser.msgBox("Error: " + e)
  }
}


/* ---------------------------------------------------------------------------*
SemrushGlobal Object START 
* -------------------------------------------------------------------------*/

function SemrushGlobal () {
  var SemrushGlobalObject = {
    
    data : {
      API_KEY : "ENTER API KEY HERE",
      ERROR_MESSAGE : "No valid API key in the SemrushGlobal object in the script editor OR out of API credits",
      DEFAULT_DB : "us"
    },
    queries : {
      domainOrganic : "http://api.semrush.com/?type=domain_organic&key=",
      urlOrganic : "http://api.semrush.com/?type=url_organic&key=",
      keywordDifficulty: "http://api.semrush.com/?type=phrase_kdi&key=",
      phraseOrganic : "http://api.semrush.com/?type=phrase_organic&key=",
      keywordVolume : "http://api.semrush.com/?type=phrase_this&key=",
      relatedQueries : "http://api.semrush.com/?type=phrase_related&key=",
      domainOverview : "http://api.semrush.com/?type=domain_rank&key=",
      countUnits : "http://www.semrush.com/users/countapiunits.html?key="
    },
    methods : {
      giveApiRest : function () {
        Utilities.sleep(200)
      },
      checkAccount : function checkAccount () {       
        if (typeof SemrushGlobal().data.API_KEY !== "string" ||  !SemrushGlobal().data.API_KEY || SemrushGlobal().data.API_KEY=="ENTER API KEY HERE") {
          return false  
        } 
        try {
          var result = UrlFetchApp.fetch(SemrushGlobal().queries.countUnits + SemrushGlobal().data.API_KEY,{"muteHttpExceptions":true})
          if (result.getContentText() == 0) return false
          var parsedResult = JSON.parse(result.getContentText())
          if (parsedResult.data.hasOwnProperty("error")) return false
          return true
        } catch (e) {
          return e
        }
      }, 
      parseApiResponse  : function parseApiResponse(result,valueBoolean) { 
        var data = [], valueBoolean, filtered
        valueBoolean ? valueBoolean = 1 : valueBoolean = 0
        var lines = result.split("\n")
        lines = lines.filter(Boolean);
        
        try {
          for(i=valueBoolean;i<lines.length;i++) {
            data.push(lines[i].split(";"));
          }
         
          return data
        } catch(e) {
          return e
        }
      }  
      
    }
  }
  return SemrushGlobalObject
}


/* ---------------------------------------------------------------------------*
SemrushGlobal Object END 
* -------------------------------------------------------------------------*/




/* ---------------------------------------------------------------------------*
MAIN functions START 
* -------------------------------------------------------------------------*/


/**
* Returns Semrush domain history for a specified domain from January 2012 onwards
*
* @param {"example.com"} domain REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https)
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {201601} date OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month.
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Returns organic keywords count, organic traffic, organic cost, adwords data
* @customfunction
*/

function DOMAIN_OVERVIEW_SEMRUSH(domain,db,excludeHeaders,date) {
  try {
    if (!domain || domain.indexOf("http") > -1) return "Error: Enter a valid domain, do not include protocol";
    var displayDate = "&display_date=", db = db || SemrushGlobal().data.DEFAULT_DB;
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE;
    
    date ? displayDate+= date + "15" : displayDate = "";
    SemrushGlobal().methods.giveApiRest();
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
        } 
    
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.domainOverview+SemrushGlobal().data.API_KEY+"&export_columns=Or,Ot,Oc,Ad,At,Ac&domain="+domain+"&database="+db+displayDate).getContentText()
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]"
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
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
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {201601} date OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month.
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Access organic keywords for a domain from semrush.com database
* @customfunction
*/

function DOMAIN_ORGANIC_KEYWORDS_SEMRUSH(domain,filterBy,matchType,query,limit,db,excludeHeaders,date,nocache) {
  try {
    Logger.log(nocache)
    if (!domain || domain.indexOf("http") > -1) throw "Error: Enter a valid domain, do not include protocol"
    var displayDate = "&display_date=", filterOperator,filterBy,excludeHeaders,query = query || "", limit = limit || 1, db = db || SemrushGlobal().data.DEFAULT_DB, filterBy = filterBy && true, matchType = matchType && true
    if (!SemrushGlobal().methods.checkAccount()) throw SemrushGlobal().data.ERROR_MESSAGE
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName) ;
      if (cachedResult) return cachedResult;
        }  
    
    date ? displayDate+= date + "15" : displayDate = "";
    filterBy ? filterBy = "%2B" : filterBy = "-";
    matchType ? matchType = "Co" : matchType = "Eq"
    if(query) query = "%7C" + query
    SemrushGlobal().methods.giveApiRest();
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.domainOrganic+SemrushGlobal().data.API_KEY+"&display_limit="+limit+"&export_columns=Ph,Po,Pp,Pd,Nq,Cp,Ur,Tr,Tc,Co,Nr&domain="+domain+"&display_sort=tr_desc&database="+db+"&display_filter="+filterBy+"%7CPh%7C"+matchType+query+displayDate).getContentText()
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]"
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
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
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {201601} date OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month.
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Access organic keywords for a domain from semrush.com database
* @customfunction
*/

function HISTORICAL_RANKING_KEYWORD_SEMRUSH(domain,query,limit,db,excludeHeaders,date,nocache) {
  
  try {
    if (!domain || domain.indexOf("http") > -1) return "Error: Enter a valid domain, do not include protocol"
    var displayDate = "&display_date=",filterBy = "%2B", matchType = "Eq", excludeHeaders,query = query || "", limit = limit || 1, db = db || SemrushGlobal().data.DEFAULT_DB
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments)
      var cachedResult = ROOT_().checkCache(cacheStringName) 
      if (cachedResult) return cachedResult
        } 
    date ? displayDate+= date + "15" : displayDate = "";
    SemrushGlobal().methods.giveApiRest();
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.domainOrganic+SemrushGlobal().data.API_KEY+"&display_limit="+limit+"&export_columns=Po&domain="+domain+"&display_sort=tr_desc&database="+db+"&display_filter="+filterBy+"%7CPh%7C"+matchType+"%7C"+query+displayDate).getContentText()
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]"
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
  } catch (e) {
    return e
  }
  
  
}




/**
* Returns Ranking Semrush Organic keywords per URL
* @param {"http://example.com"} url REQUIRED The exact URL you want data for, MUST include protocol (http/https)
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {"10"} limit OPTIONAL Number from 1 to 10,000, for number of results
* @param {"US"} db OPTIONAL The database, example "US" for American database. Default is US
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Access organic keywords for a url from semrush.com database
* @customfunction
*/


function URL_ORGANIC_KEYWORDS_SEMRUSH(url,excludeHeaders,limit,db,nocache) {
  try {
    var db = db || SemrushGlobal().data.DEFAULT_DB, limit = limit || 10;
    if (!url || url.indexOf("http") == -1) return "Error: Enter a valid URL, ensure you include the protocol";
    
    //semrush won't report on a homepage unless it has a trailing slash;
    if (url.match(/\//g).length < 3) url += "/";
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE;
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName);
      if (cachedResult) return cachedResult;
        }
    SemrushGlobal().methods.giveApiRest();
    
    
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.urlOrganic + SemrushGlobal().data.API_KEY+ "&display_limit="+limit+"&export_columns=Ph,Po,Nq,Cp,Co,Tr,Tc,Nr,Td&url="+url+"&database="+db).getContentText();
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]"
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
  } catch(e) {
    return e;
  }
}


/**
* Returns Semrush Keyword Difficulty for a keyword 
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Access keyword difficulty for keyword from semrush
* @customfunction
*/

function KEYWORD_DIFFICULTY_SEMRUSH(query, excludeHeaders,db,nocache) {
  try {
    if (!query) return "Error: Missing query";
    var db = db || SemrushGlobal().data.DEFAULT_DB;
    
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE;
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
        }
    SemrushGlobal().methods.giveApiRest();
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.keywordDifficulty + SemrushGlobal().data.API_KEY+ "&export_columns=Ph,Kd&phrase="+query+"&database=" + db).getContentText();
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]"
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
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
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Access organic search results for a keyword from semrush.com database
* @customfunction
*/

function SERPS_SEMRUSH(query,limit,db,nocache) {
  try {
    if (!query) return "Error: Missing query";
    var db = db || SemrushGlobal().data.DEFAULT_DB, limit = limit || 10;
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE;  
    SemrushGlobal().methods.giveApiRest();
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName);
      if (cachedResult) return cachedResult;
        }
    
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.phraseOrganic + SemrushGlobal().data.API_KEY+"&display_limit="+limit+"&export_columns=Ur&phrase="+query+"&database="+db).getContentText();
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]";
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result);
  } catch (e) {
    return e
  }
}

/**
* Returns Related search queries for a keyword from Semrush
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {10} limit OPTIONAL The number of results. Default is 1
* @param {"us"} db OPTIONAL The country database you want to search from. Default is US
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Returns related queries for a specific keyword from semrush.com
* @customfunction
*/


function RELATED_QUERIES_SEMRUSH(query,excludeHeaders,limit,db,nocache) {
  try {
    if (!query) return "Error: Missing query";
    var limit = limit || 1, db = db || SemrushGlobal().data.DEFAULT_DB;
    SemrushGlobal().methods.giveApiRest();
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE; 
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
        }
    
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.relatedQueries + SemrushGlobal().data.API_KEY+"&display_limit="+limit+"&export_columns=Ph,Nq,Cp,Co,Nr,Td&phrase="+query+"&database="+db+"&display_sort=nq_desc").getContentText();
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]";
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
  } catch(e) {
    return e;
  }
  
}

/**
* Returns Keyword Volume from semrush
*
* @param {"apartments"} query REQUIRED The keyword you want information for. Example: "brown shoes".
* @param {true} excludeHeaders OPTIONAL true to EXCLUDE column headers or false to include. Default is false.
* @param {"us"} db OPTIONAL The country database you want to search from, default is "us"
* @param {"FALSE"} nocache OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
* @return Returns search volume, cpc, etc..
* @customfunction
*/

function KEYWORD_VOLUME_SEMRUSH(query,excludeHeaders,db,nocache) {
  try {
    if (!query) return "Error: Missing query";
    var db = db || SemrushGlobal().data.DEFAULT_DB;
    SemrushGlobal().methods.giveApiRest();
    
    if (!SemrushGlobal().methods.checkAccount()) return SemrushGlobal().data.ERROR_MESSAGE;
    if (!nocache) {
      var cacheStringName = ROOT_().encode(arguments.callee.name,arguments);
      var cachedResult = ROOT_().checkCache(cacheStringName); 
      if (cachedResult) return cachedResult;
        }
    
    var result = UrlFetchApp.fetch(SemrushGlobal().queries.keywordVolume + SemrushGlobal().data.API_KEY+"&export_columns=Ph,Nq,Cp,Co,Nr&phrase="+query+"&database="+db).getContentText();
    if (result.indexOf("NOTHING FOUND") > -1) throw "[Not Found in SemRush]";
    if (!nocache) ROOT_().addToCache(cacheStringName, SemrushGlobal().methods.parseApiResponse(result,excludeHeaders));
    return SemrushGlobal().methods.parseApiResponse(result,excludeHeaders);
  } catch (e) {
    return e;
  }
}


/* ---------------------------------------------------------------------------*
MAIN functions END 
* -------------------------------------------------------------------------*/
