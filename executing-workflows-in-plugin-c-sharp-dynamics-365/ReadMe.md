# WIP
# Executing Worflows using C# or JavaScript in Dynamics 365

#### Workflows are always robust choice in Dynamics 365 to execute fail safe processes. In OOB functionality you can schedule them on some event or can run on-demand. Good news is that you can trigger them using C# or JavaScript as well, be it some plugns, custom workflow activities, client side scripting or Azure/Windows job.

[ExecuteWorkflowRequest](https://docs.microsoft.com/en-us/dotnet/api/microsoft.crm.sdk.messages.executeworkflowrequest) is here to rescue. we will see some examples here, let's get going

### Calling Workflow using C#
```csharp
var executeWorkflowRequest = new ExecuteWorkflowRequest()
{
  WorkflowId = Guid.Parse("f30d24f3-ad34-448b-9ac3-af79a19a4866"), // Guid of workflow
  EntityId = Guid.Parse("a615812f-f9c2-4c78-821e-c628ab7de89d") // Guid of record, aganst which we are executing workflow             
};            
var executeWorkflowResponse =(ExecuteWorkflowResponse)orgService.Execute(executeWorkflowRequest);
```
To test the above snippet, you can feel free to use [Dynamics 365 Console Caller](https://github.com/AshV/Dynamics365ConsoleCaller)

### Calling Workflow using JavaScript
