---
layout: post
title: "Executing Workflows using JavaScript / C# in Dynamics 365"
date: 2018-03-14 00:12:01 +0530
categories: Dynamics-365 PowerApps
permalink: executing-workflows-using-javascript-c-sharp-example-dynamics-365
---

Workflows are always robust choice in Dynamics 365 to execute fail safe processes. In OOB functionality you can schedule them on some event or can run on-demand. Good news is that you can trigger them using C# or JavaScript as well, be it some plugins, custom workflow activities, client side scripting or Azure/Windows job.

## Calling Workflow using C\#

[ExecuteWorkflowRequest](https://docs.microsoft.com/en-us/dotnet/api/microsoft.crm.sdk.messages.executeworkflowrequest) is here to rescue to trigger workflows using C# or any other .Net language.

```csharp
var executeWorkflowRequest = new ExecuteWorkflowRequest()
{
  WorkflowId = Guid.Parse("24dc5603-a117-4221-a7bb-5b6ed17a1810"), // Guid of workflow
  EntityId = Guid.Parse("B0A19CDD-88DF-E311-B8E5-6C3BE5A8B200") // Guid of record
};            
var executeWorkflowResponse = (ExecuteWorkflowResponse)orgService.Execute(executeWorkflowRequest);
```
To test the above snippet, you can feel free to use [Dynamics 365 Console Caller](https://www.ashishvishwakarma.com/Dynamics365ConsoleCaller/)

## Calling Workflow using JavaScript Ajax

[ExecuteWorkflow Action](https://msdn.microsoft.com/en-us/library/mt491159.aspx) let us trigger a Workflow using WebApi, which is a Bound Acton so we have to pass guid as first parameter in URI. Our request should be in blow format

### HTTP Request Format
```
POST[Organization URI]/api/data/v9.0/workflows(<Workflow Guid>)/Microsoft.Dynamics.CRM.ExecuteWorkflow HTTP/ 1.1
Accept: application/json
Content-Type: application/json;charset=utf-8
OData-MaxVersion: 4.0
OData-Version: 4.0

{
  "EntityId": "<Entity Record Guid>"
}
```

### Making Request using XmlHttpRequest
```javascript
var clientUrl = Xrm.Page.context.getClientUrl();
var workflowId = "24dc5603-a117-4221-a7bb-5b6ed17a1810";
var entityId = "B0A19CDD-88DF-E311-B8E5-6C3BE5A8B200";

var requestUri = clientUrl + "/api/data/v9.0/workflows(" + workflowId + ")/Microsoft.Dynamics.CRM.ExecuteWorkflow";

var xhr = new XMLHttpRequest();
xhr.open("POST", requestUri, true);
xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
xhr.setRequestHeader("OData-MaxVersion", "4.0");
xhr.setRequestHeader("OData-Version", "4.0");
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        xhr.onreadystatechange = null;
        if (this.status == 200) {
            var result = JSON.parse(this.response);
        } else {
            var error = JSON.parse(this.response).error;
        }
    }
};
xhr.send("{\"EntityId\":\"" + entityId + "\"}");
```

### Making Request in modern way using Fetch
```javascript
var clientUrl = Xrm.Page.context.getClientUrl();
var workflowId = "24dc5603-a117-4221-a7bb-5b6ed17a1810";
var entityId = "B0A19CDD-88DF-E311-B8E5-6C3BE5A8B200";

fetch(
    clientUrl + "/api/data/v9.0/workflows(" + workflowId + ")/Microsoft.Dynamics.CRM.ExecuteWorkflow",
    {
        body: "{\"EntityId\":\"" + entityId + "\"}",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0"
        },
        method: "POST"
    })
    .then(response => console.log("Success:", response))
    .catch(error => console.error("Error:", error));
```

## Alright, but where can I get my Workflow GUID?
Execute below fetchXml using [FetchXml Tester Online](https://www.ashishvishwakarma.com/FetchXmlTester/) after replacing your Workflow name and grab GUID from response JSON

```html
<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
  <entity name="workflow">
    <filter type="and">
      <condition attribute="name" operator="eq" value="Enter Workflow Name Here!" />
    </filter>
  </entity>
</fetch>
```

> Hope it helps 😊

Let the queries/discussions go in comments.