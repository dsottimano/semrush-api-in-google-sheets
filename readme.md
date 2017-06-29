##Blog post: 
<a href="http://opensourceseo.org/semrush-api-library-google-sheets-google-scripts">Semrush API Google sheets</a>

## Functions

<dl>
<dt><a href="#domainOrganicKeywords">domainOrganicKeywords(domain, filterBy, matchType, query, limit, db, includeHeader, date)</a> ⇒</dt>
<dd><p>Returns Semrush Organic keywords for a specified domain</p>
</dd>
<dt><a href="#urlOrganicKeywords">urlOrganicKeywords(url, includeHeader, limit, db)</a> ⇒</dt>
<dd><p>Returns Ranking Semrush Organic keywords per URL</p>
</dd>
<dt><a href="#keywordDifficulty">keywordDifficulty(query, includeHeader, db)</a> ⇒</dt>
<dd><p>Returns Semrush Keyword Difficulty for a keyword</p>
</dd>
<dt><a href="#serps">serps(query, limit, db)</a> ⇒</dt>
<dd><p>Returns Semrush organic search results for a specific keyword</p>
</dd>
<dt><a href="#relatedQueries">relatedQueries(query, includeHeader, limit, db)</a> ⇒</dt>
<dd><p>Returns Related search queries for a keyword from Semrush</p>
</dd>
<dt><a href="#keywordVolume">keywordVolume(query, includeHeader, db)</a> ⇒</dt>
<dd><p>Returns Keyword Volume from semrush</p>
</dd>
</dl>

<a name="domainOrganicKeywords"></a>

## domainOrganicKeywords(domain, filterBy, matchType, query, limit, db, includeHeader, date) ⇒
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
| includeHeader | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| date | <code>201601</code> | OPTIONAL Leave this blank for current data. YYYYMM format for historical reports, note: always reports on the 15th of the month. |

<a name="urlOrganicKeywords"></a>

## urlOrganicKeywords(url, includeHeader, limit, db) ⇒
Returns Ranking Semrush Organic keywords per URL

**Kind**: global function
**Returns**: Access organic keywords for a url from semrush.com database
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| url | <code>&quot;http://example.com&quot;</code> | REQUIRED The exact URL you want data for, MUST include protocol (http/https) |
| includeHeader | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| limit | <code>&quot;10&quot;</code> | OPTIONAL Number from 1 to 10,000, for number of results |
| db | <code>&quot;US&quot;</code> | OPTIONAL The database, example "US" for American database. Default is US |

<a name="keywordDifficulty"></a>

## keywordDifficulty(query, includeHeader, db) ⇒
Returns Semrush Keyword Difficulty for a keyword

**Kind**: global function
**Returns**: Access keyword difficulty for keyword from semrush
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| includeHeader | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |

<a name="serps"></a>

## serps(query, limit, db) ⇒
Returns Semrush organic search results for a specific keyword

**Kind**: global function
**Returns**: Access organic search results for a keyword from semrush.com database
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| limit | <code>10</code> | OPTIONAL Number from 10 to 20, for number of results. Default is 10 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |

<a name="relatedQueries"></a>

## relatedQueries(query, includeHeader, limit, db) ⇒
Returns Related search queries for a keyword from Semrush

**Kind**: global function
**Returns**: Returns related queries for a specific keyword from semrush.com
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| includeHeader | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| limit | <code>10</code> | OPTIONAL The number of results. Default is 1 |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from. Default is US |

<a name="keywordVolume"></a>

## keywordVolume(query, includeHeader, db) ⇒
Returns Keyword Volume from semrush

**Kind**: global function
**Returns**: Returns search volume, cpc, etc..
**Customfunction**:

| Param | Type | Description |
| --- | --- | --- |
| query | <code>&quot;apartments&quot;</code> | REQUIRED The keyword you want information for. Example: "brown shoes". |
| includeHeader | <code>true</code> | OPTIONAL true to EXCLUDE column headers or false to include. Default is false. |
| db | <code>&quot;us&quot;</code> | OPTIONAL The country database you want to search from, default is "us" |