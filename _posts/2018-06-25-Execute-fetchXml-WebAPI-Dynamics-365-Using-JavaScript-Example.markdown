---
layout: post
title: "Execute fetchXML with WebAPI in Dynamics 365 using JavaScript"
date: 2018-06-25 00:18:01 +0530
categories: Dynamics-365 PowerApps
permalink: Execute-fetchXml-WebAPI-Dynamics-365-Using-JavaScript-Example/
---

![Dynamics 365 Header](/assets/2018-06-25/ms-dynamics-365-header.webp)

In Dynamics 365 WebAPI we can retrieve data using OData queries, but if there is some complex requirement it's better to query using fetchXML, and good news is Dynamics 365 WebAPI supports querying using fetchXML. With fetchXML we have 2 main advantage, it can be easily generated using Advanced Find & It's more readable. You can even use Joins & Aggregate function in fetchXML queries which are not possible using Advanced Find(refer http://msxrmtools.com/fetchxml/reference). Let's see how can we query fetchXML with WebAPI.

## Generate fetchXML using Advanced Find

Click on funnel icon to open Advanced Find window.

![Filter-Button](/assets/2018-06-25/Filter-Button.png)

I have created a simple fetchXML query to retrieve all the active cases with few columns.

![Advanced-Find](/assets/2018-06-25/Advanced-Find.png)

Click on "Download Fetch XML" button to get the below fetchXML query.

```xml
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="incident">
    <attribute name="title" />
    <attribute name="ticketnumber" />
    <attribute name="createdon" />
    <attribute name="incidentid" />
    <attribute name="caseorigincode" />
    <order attribute="title" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
  </entity>
</fetch>
```

## Executing fetchXML with GET method

To execute fetchXML you need to simply append entity's plural name in WebAPI endpoint and pass fetchXml in query string, and make http/ajax request

> #### Syntax: WebAPI Endpoint + / + Entity Plural Name + ?fetchXml= + Your fetchXml here

**Example:**
 
 ```xml
 https://AshV.crm.dynamics.com/api/data/v9.0/incidents?fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false"><entity name="incident"><attribute name="title" /><attribute name="ticketnumber" />    <attribute name="createdon" /><attribute name="incidentid" /><attribute name="caseorigincode" /><order attribute="title" descending="false" /><filter type="and"><condition attribute="statecode" operator="eq" value="0" /></filter></entity></fetch>
```

Response of this request would be similar to one give below. As this is simple GET call, you can even execute this in browser and test, you can check out one of my tool [FetchXmlTester](https://www.ashishvishwakarma.com/FetchXmlTester/), which let's you test your fetchXML without sharing your credentials. While running in browser we can't set header **Prefer: odata.include-annotations="*"** to see formatted value.

```json
{  
   "@odata.context":"https://abnai.crm.dynamics.com/api/data/v9.0/$metadata#incidents(title,ticketnumber,createdon,incidentid,caseorigincode)",
   "value":[  
      {  
         "@odata.etag":"W/\"1095635\"",
         "title":"Average order shipment time",
         "ticketnumber":"CAS-01213-P8B3X0",
         "createdon":"2017-01-20T22:50:45Z",
         "incidentid":"b69e62a8-90df-e311-9565-a45d36fc5fe8",
         "caseorigincode":3
      },
      {  
         "@odata.etag":"W/\"1092817\"",
         "title":"Shipping time information resend",
         "ticketnumber":"CAS-01261-N0C8H9",
         "createdon":"2017-01-20T22:51:13Z",
         "incidentid":"169f62a8-90df-e311-9565-a45d36fc5fe8",
         "caseorigincode":2
      }
   ]
}
```

### Making GET request with XMLHttpRequest

```js
var fetchXmlQuery = `
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="incident">
    <attribute name="title" />
    <attribute name="ticketnumber" />
    <attribute name="createdon" />
    <attribute name="incidentid" />
    <attribute name="caseorigincode" />
    <order attribute="title" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
  </entity>
</fetch>`;

var req = new XMLHttpRequest();
req.open(
  "GET",
  Xrm.Page.context.getClientUrl() +
    "/api/data/v9.0/incidents?fetchXml=" +
    encodeURIComponent(fetchXmlQuery),
  true
);
req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
req.onreadystatechange = function() {
  if (this.readyState === 4) {
    req.onreadystatechange = null;
    if (this.status === 200) {
      var results = JSON.parse(this.response);
      console.dir(results);
    } else {
      alert(this.statusText);
    }
  }
};
req.send();
```

### Making GET request with JavaScript Fetch API

```js
var fetchXmlQuery = `
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="incident">
    <attribute name="title" />
    <attribute name="ticketnumber" />
    <attribute name="createdon" />
    <attribute name="incidentid" />
    <attribute name="caseorigincode" />
    <order attribute="title" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
  </entity>
</fetch>`;

fetch(
  Xrm.Page.context.getClientUrl() +
    "/api/data/v9.0/incidents?fetchXml=" +
    encodeURIComponent(fetchXmlQuery),
  {
    credentials: "same-origin",
    headers: {
      Prefer: 'odata.include-annotations="*"'
    }
  }
)
  .then(response => response.json())
  .then(result => console.dir(result))
  .catch(error => console.error("Error:", error));
```

## Executing Large fetchXML using POST method with $batch

As I mentioned in starting we can choose to use fetchXML over OData query for complex queries which will be obviously bigger in size. But we have URL length limit, which is around 2000 characters roughly(varies in different browsers) so if our URL extends this, **Bad Gateway** exception is thrown.

**$batch** is solution for this. In Dynamics 365 webapi we can execute bigger GET request using $batch, we need to set header **Content-Type: multipart/mixed;boundary=batch_fetchquery** and content of GET request should go in body enclosed within value given in **boundary**, which is **batch_fetchquery** in our case. To learn more about $batch, you can refer [https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/execute-batch-operations-using-web-api](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/execute-batch-operations-using-web-api).

### Making POST request with XMLHttpRequest
 
```js
var fetchXmlQuery = `
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="incident">
    <attribute name="title" />
    <attribute name="ticketnumber" />
    <attribute name="createdon" />
    <attribute name="incidentid" />
    <attribute name="caseorigincode" />
    <order attribute="title" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
  </entity>
</fetch>`;

var req = new XMLHttpRequest();
req.open(
  "POST",
  Xrm.Page.context.getClientUrl() + "/api/data/v9.0/$batch",
  true
);
req.setRequestHeader(
  "Content-Type",
  "multipart/mixed;boundary=batch_fetchquery"
);
req.onreadystatechange = function() {
  if (this.readyState === 4) {
    req.onreadystatechange = null;
    if (this.status === 200) {
      var result = JSON.parse(
        this.response.substring(
          this.response.indexOf("{"),
          this.response.lastIndexOf("}") + 1
        )
      );
      console.dir(result);
    } else {
      console.error(this.statusText);
    }
  }
};

var body =
  "--batch_fetchquery\n" +
  "Content-Type: application/http\n" +
  "Content-Transfer-Encoding: binary\n" +
  "\n" +
  "GET " +
  Xrm.Page.context.getClientUrl() +
  "/api/data/v9.0/incidents?fetchXml=" +
  encodeURIComponent(fetchXmlQuery) +
  " HTTP/1.1\n" +
  'Prefer: odata.include-annotations="*"\n' +
  "\n" +
  "--batch_fetchquery--";

req.send(body);
```

### Making POST request with JavaScript Fetch API

```js
var fetchXmlQuery = `
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="incident">
    <attribute name="title" />
    <attribute name="ticketnumber" />
    <attribute name="createdon" />
    <attribute name="incidentid" />
    <attribute name="caseorigincode" />
    <order attribute="title" descending="false" />
    <filter type="and">
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
  </entity>
</fetch>`;

fetch(Xrm.Page.context.getClientUrl() + "/api/data/v9.0/$batch", {
  body:
    "--batch_fetchquery\n" +
    "Content-Type: application/http\n" +
    "Content-Transfer-Encoding: binary\n" +
    "\n" +
    "GET " +
    Xrm.Page.context.getClientUrl() +
    "/api/data/v9.0/incidents?fetchXml=" +
    encodeURIComponent(fetchXmlQuery) +
    " HTTP/1.1\n" +
    'Prefer: odata.include-annotations="*"\n' +
    "\n" +
    "--batch_fetchquery--",
  headers: {
    "Content-Type": "multipart/mixed;boundary=batch_fetchquery"
  },
  credentials: "same-origin",
  method: "POST"
})
  .then(response => response.text())
  .then(data => {
    var result = JSON.parse(
      data.substring(data.indexOf("{"), data.lastIndexOf("}") + 1)
    );
    console.log(result);
  })
  .catch(error => console.error("Error:", error));
```

## Testing the code in Dyanmics 365

To test the above code I made small tweaks to run it from HTML web resource as you can see below.

<script src="https://gist.github.com/AshV/2639c65018b703457b2fe26272093774.js"></script>

Create new HTML web resource with above code & publish it.

![Test-Web-Resource](/assets/2018-06-25/Test-Web-Resource.png)

Click on the URL to open it, you will see below window.

![Test-Window](/assets/2018-06-25/Test-Window.png)

Press F12 to open console, click on buttons to verify the retrieved data in console & alert.

![Testing](/assets/2018-06-25/Testing.png)

> Thanks for reading, Hope it helps!