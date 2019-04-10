## Read the Blog post first : 
<a href="http://opensourceseo.org/semrush-api-library-google-sheets-google-scripts">Semrush API Google sheets</a>

## Functions

<dl>
<dt><a href="#domainOrganicKeywords">DOMAIN_ORGANIC_KEYWORDS_SEMRUSH(domain, filterBy, matchType, query, limit, db, excludeHeaders, date, nocache)</a> ⇒</dt>
<dd><p>Returns Semrush Organic keywords for a specified domain</p>
</dd>
<dt><a href="#urlOrganicKeywords">URL_ORGANIC_KEYWORDS_SEMRUSH(url, excludeHeaders, limit, db,nocache)</a> ⇒</dt>
<dd><p>Returns Ranking Semrush Organic keywords per URL</p>
</dd>
<dt><a href="#keywordDifficulty">KEYWORD_DIFFICULTY_SEMRUSH(query, excludeHeaders, db,nocache)</a> ⇒</dt>
<dd><p>Returns Semrush Keyword Difficulty for a keyword</p>
</dd>
<dt><a href="#serps">SERPS_SEMRUSH(query, limit, db,nocache)</a> ⇒</dt>
<dd><p>Returns Semrush organic search results for a specific keyword</p>
</dd>
<dt><a href="#relatedQueries">RELATED_QUERIES_SEMRUSH(query, excludeHeaders, limit, db,nocache)</a> ⇒</dt>
<dd><p>Returns Related search queries for a keyword from Semrush</p>
</dd>
<dt><a href="#keywordVolume">KEYWORD_VOLUME_SEMRUSH(query, excludeHeaders, db,nocache)</a> ⇒</dt>
<dd><p>Returns Keyword Volume from semrush</p>
</dd>
</dl>

<a name="domainOrganicKeywords"></a>

## DOMAIN_ORGANIC_KEYWORDS_SEMRUSH(domain, filterBy, matchType, query, limit, db, excludeHeaders, date) ⇒
Returns Semrush Organic keywords for a specified domain

**Kind**: global function
**Returns**: Access organic keywords for a domain from semrush.com database
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| domain | <code>&quot;example.com&quot;</code> | REQUIRED The root domain, example: "nytimes.com", DO NOT include protocol (http/https) |
| filterBy | <code>true</code> | OPTIONAL Use true to include the query in the filter or false to remove the query in the filter. Default is true |
| matchType | <code>true</code> | OPTIONAL Use true for partial match, use false for exact match. Default is true, partial match |
| query | <code>&quot;apartments&quot;</code> | OPTIONAL The keyword you want to filter by. Relies on previous 2 parameters. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL Number from 1 to 10000 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| date | <code>201601</code> | OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month. |
 nocache | <code>true</code> | OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)

<a name="urlOrganicKeywords"></a>

## URL_ORGANIC_KEYWORDS_SEMRUSH(url, excludeHeaders, limit, db) ⇒
Returns Ranking Semrush Organic keywords per URL

**Kind**: global function
**Returns**: Access organic keywords for a url from semrush.com database
**Customfunction**:

| Param | Example | Description |
| --- | --- | --- |
| url | <code>&quot;http://example.com&quot;</code> | REQUIRED The exact URL you want data for, MUST include protocol (http/https) |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| limit | <code>&quot;10&quot;</code> | OPTIONAL Number from 1 to 10,000, for number of results |
| db | <code>&quot;US&quot;</code> | OPTIONAL The database, example "US" for American database. Default is US |
 nocache | <code>true</code> | OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)

<a name="keywordDifficulty"></a>

## KEYWORD_DIFFICULTY_SEMRUSH(query, excludeHeaders, db) ⇒
Returns Semrush Keyword Difficulty for a keyword

**Kind**: global function
**Returns**: Access keyword difficulty for keyword from semrush
**Customfunction**:

| Param | Example | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
 nocache | <code>true</code> | OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)

<a name="serps"></a>

## SERPS_SEMRUSH(query, limit, db) ⇒
Returns Semrush organic search results for a specific keyword

**Kind**: global function
**Returns**: Access organic search results for a keyword from semrush.com database
**Customfunction**:

| Param | Example | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL Number from 10 to 20, for number of results. Default is 10 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
 nocache | <code>true</code> | OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)

<a name="relatedQueries"></a>

## RELATED_QUERIES_SEMRUSH(query, excludeHeaders, limit, db) ⇒
Returns Related search queries for a keyword from Semrush

**Kind**: global function
**Returns**: Returns related queries for a specific keyword from semrush.com
**Customfunction**:

| Param | Example | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| limit | <code>10</code> | OPTIONAL The number of results. Default is 1 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |
 nocache | <code>true</code> | OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)

<a name="keywordVolume"></a>

## KEYWORD_VOLUME_SEMRUSH(query, excludeHeaders, db) ⇒
Returns Keyword Volume from semrush

**Kind**: global function
**Returns**: Returns search volume, cpc, etc..
**Customfunction**:

| Param | Example | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| excludeHeaders | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from, default is "us" |
 nocache | <code>true</code> | OPTIONAL use TRUE if you don't want to cache these results, default is FALSE (cache enabled)
