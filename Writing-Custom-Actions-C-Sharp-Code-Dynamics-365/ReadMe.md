# Creating Custom Actions for Dynamics 365 with C\#

### Step 1: Create New Project

In Visual Studio create new project of type Class Library & select framework version 4.5.2, this might change for future versions. Name I have given as **MyCasesAction**, which tells the purpose of the workflow.

![new-project](assets/new-project.png)

### Step 2: Add Required Packags

Goto manage nugget packages and install **Microssoft.CrmSdk.CoreAssemblies**(for Microsoft.Xrm.Sdk namespace) & **Microssoft.CrmSdk.Workflow**(for Microsoft.Xrm.Sdk.Workflow namespace).

![nugget-packages](assets/nugget-packages.png)

### Step 3: Create MyCasesAction Class

Create class **MyCasesAction** and inherited from **CodeActivity**, it would require to add **System.Activities** namespace.

```csharp
using System.Activities;

namespace MyCasesAction
{
    public class MyCasesAction : CodeActivity
    {
        protected override void Execute(CodeActivityContext context)
        {

        }
    }
}
```

### Step 4: Adding Parameters

We will have 2 output parameters one containing count of cases, other having name of cases separated by comma. User's GUID we will take from context.

```csharp
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;

namespace MyCasesAction
{
    public class MyCasesAction : CodeActivity
    {
        [Output("Count of Cases")]
        public OutArgument<int> CaseCount { get; set; }

        [Output("Name of Cases")]
        public OutArgument<string> CaseNames { get; set; }

        protected override void Execute(CodeActivityContext context)
        {

        }
    }
}
```

### Step 5: Adding Logic to Retrieve User Cases

```csharp
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Workflow;
using System.Activities;
using System.Collections.Generic;

namespace MyCasesAction
{
    public class MyCasesAction : CodeActivity
    {
        [Output("Count of Cases")]
        public OutArgument<int> CaseCount { get; set; }

        [Output("Name of Cases")]
        public OutArgument<string> CaseNames { get; set; }

        protected override void Execute(CodeActivityContext context)
        {
            // Getting OrganizationService from Context
            var workflowContext = context.GetExtension<IWorkflowContext>();
            var serviceFactory = context.GetExtension<IOrganizationServiceFactory>();
            var orgService = serviceFactory.CreateOrganizationService(workflowContext.UserId);

            // fetchXml to retrieve cases for current user
            var fetchXmlCurrentUserCases = @"
            <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
              <entity name='incident'>
                <attribute name='title' />
                <filter type='and'>
                  <condition attribute='ownerid' operator='eq-userid' />
                </filter>
              </entity>
            </fetch>";

            // Retrieving cases using fetchXml
            var cases = orgService.RetrieveMultiple(
                new FetchExpression(
                    fetchXmlCurrentUserCases));

            // Null check
            if (cases == null || cases?.Entities == null) return;

            // Adding Case names/titles to list
            var allCases = new List<string>();
            foreach (var cs in cases.Entities)
                allCases.Add(cs["title"].ToString());

            // Set Count of cases to CaseCount
            CaseCount.Set(context, cases.Entities.Count);

            // Set comma separated Case Titles to CaseNames
            CaseNames.Set(context, string.Join(",", allCases.ToArray()));
        }
    }
}
```

### Step 6: Signing the Assembly

In Dynamics 365 it is necessary to sign the assembly before registering. To do this
1. Right click on project, click on properties to open.
2. On left pane, click on Signing.
3. Check Sign the assembly checkbox.
4. In Choose a strong name key file dropdown click New...
5. Crete Strong Name Key popup will appear.
6. Give some name.
7. Optionally you can protect this key file with password.
8. Click Ok to generate key and sign the assembly.
9. Build the solution

![sign-assembly](assets/sign-assembly.png)

### Step 7: Register the Assembly in Dynamics 365

Open the Plugin Registration Tool and connect with your organization. If you don't already have, grab it by adding **Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool** nuget package.

**1.** Click on Register then Register New Assembly.

![Register-New-Assembly](assets/Register-New-Assembly.png)

**2.** Register New Assembly popup will appear, select your project DLL from bin/debug folder of project.

![Load-Assembly](assets/Load-Assembly.png)

**3.** After selecting DLL, make sure Select All is selected in Step 2.

![Select-All](assets/Select-All.png)

**4.** Leave rest of he options as it is and click **Register Selected Plugins**, it should register your assembly successfully.

![Registered](assets/Registered.png)

**5.** You can verify the assembly after registering in Plugin Registration Tool.

![Verify-DLL](assets/Verify-DLL.png)