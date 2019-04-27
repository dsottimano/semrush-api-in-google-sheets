## Read the Blog post first : 
<a href="http://opensourceseo.org/semrush-api-library-google-sheets-google-scripts">Semrush API Google sheets</a>

## Quick start - no installation needed : 
Make a copy of the <a href="https://docs.google.com/spreadsheets/d/1hmcQ1atJXeXHmwJaq9NjIuqBHZD1xgXiG-LVetmV4NY/edit#gid=0">master spreadsheet</a> with the script and you're ready to go!

## Functions

<dl>
<dt><a href="#DOMAIN_OVERVIEW_SEMRUSH">DOMAIN_OVERVIEW_SEMRUSH(domain, db, date, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Semrush domain history for a specified domain from January 2012 onwards</p>
</dd>
<dt><a href="#DOMAIN_ORGANIC_KEYWORDS_SEMRUSH">DOMAIN_ORGANIC_KEYWORDS_SEMRUSH(domain, filterBy, matchType, query, limit, db, date, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Semrush Organic keywords for a specified domain</p>
</dd>
<dt><a href="#HISTORICAL_RANKING_KEYWORD_SEMRUSH">HISTORICAL_RANKING_KEYWORD_SEMRUSH(domain, query, limit, db, date, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Historical rankings for domain/keyword combination</p>
</dd>
<dt><a href="#URL_ORGANIC_KEYWORDS_SEMRUSH">URL_ORGANIC_KEYWORDS_SEMRUSH(url, limit, db, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Ranking Semrush Organic keywords per URL</p>
</dd>
<dt><a href="#KEYWORD_DIFFICULTY_SEMRUSH">KEYWORD_DIFFICULTY_SEMRUSH(query, db, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Semrush Keyword Difficulty for a keyword</p>
</dd>
<dt><a href="#SERPS_SEMRUSH">SERPS_SEMRUSH(query, limit, db, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Semrush organic search results for a specific keyword</p>
</dd>
<dt><a href="#RELATED_QUERIES_SEMRUSH">RELATED_QUERIES_SEMRUSH(query, limit, db, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Related search queries for a keyword from Semrush</p>
</dd>
<dt><a href="#KEYWORD_VOLUME_SEMRUSH">KEYWORD_VOLUME_SEMRUSH(query, db, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Keyword Volume from semrush</p>
</dd>
<dt><a href="#PHRASE_QUESTIONS_SEMRUSH">PHRASE_QUESTIONS_SEMRUSH(query, limit, db, filterBySearchVolume, searchVolumeFilter, searchVolume, excludeHeaders, cache)</a> ⇒</dt>
<dd><p>Returns Questions asked for a keyword from Semrush</p>
</dd>
</dl>

<a name="DOMAIN_OVERVIEW_SEMRUSH"></a>

## DOMAIN\_OVERVIEW\_SEMRUSH(domain, db, date, excludeHeaders, cache) ⇒
Returns Semrush domain history for a specified domain from January 2012 onwards

**Kind**: global function
**Returns**: Returns organic keywords count, organic traffic, organic cost, adwords data
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>&quot;example.com&quot;</code> | REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https) |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| date | <code>201601</code> | OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month. |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="DOMAIN_ORGANIC_KEYWORDS_SEMRUSH"></a>

## DOMAIN\_ORGANIC\_KEYWORDS\_SEMRUSH(domain, filterBy, matchType, query, limit, db, date, excludeHeaders, cache) ⇒
Returns Semrush Organic keywords for a specified domain

**Kind**: global function
**Returns**: Access organic keywords for a domain from semrush.com database.
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>&quot;example.com&quot;</code> | REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https) |
| filterBy | <code>true</code> | OPTIONAL Use true to include the query in the filter or false to remove the query in the filter. Default is true |
| matchType | <code>true</code> | OPTIONAL Use true for partial match, use false for exact match. Default is true, partial match |
| query | <code>&quot;apartments&quot;</code> | OPTIONAL The keyword you want to filter by. Relies on previous 2 parameters. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL Number from 1 to 10000 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| date | <code>201601</code> | OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month. |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="HISTORICAL_RANKING_KEYWORD_SEMRUSH"></a>

## HISTORICAL\_RANKING\_KEYWORD\_SEMRUSH(domain, query, limit, db, date, excludeHeaders, cache) ⇒
Returns Historical rankings for domain/keyword combination

**Kind**: global function
**Returns**: Access organic keywords for a domain from semrush.com database
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>&quot;example.com&quot;</code> | REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https) |
| query | <code>&quot;apartments&quot;</code> | OPTIONAL The keyword you want to filter by. Relies on previous 2 parameters. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL Number from 1 to 10000 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| date | <code>201601</code> | OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month. |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="URL_ORGANIC_KEYWORDS_SEMRUSH"></a>

## URL\_ORGANIC\_KEYWORDS\_SEMRUSH(url, limit, db, excludeHeaders, cache) ⇒
Returns Ranking Semrush Organic keywords per URL

**Kind**: global function
**Returns**: Access organic keywords for a url from semrush.com database
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| url | <code>&quot;http://example.com&quot;</code> | REQUIRED The exact URL you want data for, MUST include protocol (http/https) |
| limit | <code>&quot;10&quot;</code> | OPTIONAL Number from 1 to 10,000, for number of results |
| db | <code>&quot;US&quot;</code> | OPTIONAL The database, example "US" for American database. Default is US |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="KEYWORD_DIFFICULTY_SEMRUSH"></a>

## KEYWORD\_DIFFICULTY\_SEMRUSH(query, db, excludeHeaders, cache) ⇒
Returns Semrush Keyword Difficulty for a keyword

**Kind**: global function
**Returns**: Access keyword difficulty for keyword from semrush
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="SERPS_SEMRUSH"></a>

## SERPS\_SEMRUSH(query, limit, db, excludeHeaders, cache) ⇒
Returns Semrush organic search results for a specific keyword

**Kind**: global function
**Returns**: Access organic search results for a keyword from semrush.com database
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL Number from 10 to 20, for number of results. Default is 10 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="RELATED_QUERIES_SEMRUSH"></a>

## RELATED\_QUERIES\_SEMRUSH(query, limit, db, excludeHeaders, cache) ⇒
Returns Related search queries for a keyword from Semrush

**Kind**: global function
**Returns**: Returns related queries for a specific keyword from semrush.com
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL The number of results. Default is 1 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="KEYWORD_VOLUME_SEMRUSH"></a>

## KEYWORD\_VOLUME\_SEMRUSH(query, db, excludeHeaders, cache) ⇒
Returns Keyword Volume from semrush

**Kind**: global function
**Returns**: Returns search volume, cpc, etc..
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from, default is "us" |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |

<a name="PHRASE_QUESTIONS_SEMRUSH"></a>

## PHRASE\_QUESTIONS\_SEMRUSH(query, limit, db, filterBySearchVolume, searchVolumeFilter, searchVolume, excludeHeaders, cache) ⇒
Returns Questions asked for a keyword from Semrush

**Kind**: global function
**Returns**: Returns Questions asked for a specific keyword from semrush.com
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL The number of results. Default is 1 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| filterBySearchVolume | <code>true</code> | OPTIONAL If you want to filter by search volume, use TRUE, default is FALSE |
| searchVolumeFilter | <code>&quot;&gt;&quot;</code> | OPTIONAL Filters the search volume parameter (next). Use ">" for Greater than, or "<" for Less than. Default is ">" greater than |
| searchVolume | <code>1000</code> | OPTIONAL A search volume number (per month) you want to filter results by. Both previous parameters need to be set for this to work. |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| cache | <code>&quot;TRUE&quot;</code> | OPTIONAL use FALSE if you DO NOT want to cache these results or DO NOT want to return cached results, default is TRUE (cache enabled) |
