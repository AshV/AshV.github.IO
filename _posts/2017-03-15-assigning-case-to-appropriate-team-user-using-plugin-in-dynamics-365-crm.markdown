---
layout: post
title: "Assigning Case To Appropriate Team User Using Plugin In Dynamics 365/ CRM"
date: 2017-03-15 00:18:01 +0530
categories: Dynamics-365 PowerApps
permalink: assigning-case-to-appropriate-team-user-using-plugin-in-dynamics-365-crm/
---

![Dynamics 365 Header](/assets/2018-06-25/ms-dynamics-365-header.webp)

In a recent project, I have worked on one interesting functionality, where I have written a plugin for a Case record to be triggered while assigning it to a Team, and it should fulfill these three requirements.

1. If the Team has no users in it, Case should be assigned to the default queue of Team.

2. If the Team has users, the Case should be assigned to the user with the least number of cases.

3. If more than one user in the Team have the same number of cases, then the case should be randomly assigned to one of them.

Here, I will show you how to implement the above functionality. To simplify, I am not using any custom attribute or an entity; you can just create an online trial instance of Dynamics CRM/365 and try it out. 

**Section 1 : Code**

**Step 1**

Create a new project in Visual Studio of type Class Library and give the name. I have given the name as AssignPlugin and don't forget to set the framework version to 4.5.2.

![image alt text](/assets/2017-03-15/image_0.png)

**Step 2**

Add the required references to project from CRM SDK.

![image alt text](/assets/2017-03-15/image_1.png) 

**Step 3**

Remove the existing class from the project and add a new class to the project with some name like AssignTeamToUser.cs.

Open this class, make it public, add namespace "Microsoft.Xrm.Sdk" and inherit “IPlugin” interface, which is required for the plugin.

IPlugin requires Execute method to be implemented, so add it to our class.

Now, the code should look, as shown below. 

```csharp  
using Microsoft.Xrm.Sdk;  
using System;  
  
namespace AssignPlugin  
{  
    public class AssignTeamToUser : IPlugin  
    {  
        public void Execute(IServiceProvider serviceProvider)  
        {  
             
        }  
    }  
}  
```

**Step 4**

Now, we need to add some boilerplate code for some null checks and obtain plugin context and organization Service reference. It's a good idea to maintain business logic separately, so BusinessLogic method in it will contain our Business Logic.

```csharp
using Microsoft.Xrm.Sdk;  
using System;  
  
namespace AssignPlugin  
{  
    public class AssignTeamToUser : IPlugin  
    {  
        public void Execute(IServiceProvider serviceProvider)  
        {  
            if (serviceProvider == null) return;  
  
            // Obtain the Plugin Execution Context  
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));  
  
            // Obtain the organization service reference.  
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));  
            var service = serviceFactory.CreateOrganizationService(context.UserId);  
  
            // To check depth   
            if (context.Depth > 2) return;  
  
            // The InputParameters collection contains all the data passed in the message request.  
            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is EntityReference)  
            {  
                // Business logic goes here  
                new AssignTeamToUser().BusinessLogic(service, context);  
            }  
        }  
  
        private void BusinessLogic(IOrganizationService service, IExecutionContext context)  
        {  
            // Business Logic  
        }  
    }  
}
```

**Step 5**

While registering plugin in Assign step, it will have two Input parameters in context with the name Target & Assignee, we will pick them in the variable for further use. See the code given below.

```csharp
private void BusinessLogic(IOrganizationService service, IExecutionContext context)    
{    
    // We are hitting Assign button on a Case record so Target will be a Case record    
    var caseEntityReference = (EntityReference)context.InputParameters["Target"];    
    
    // Assignee could be a User or Team    
    var teamEntityReference = (EntityReference)context.InputParameters["Assignee"];    
    
    // In our requirement it should be a Team, otherwise return    
    if (teamEntityReference.LogicalName != "team") return;    
  
}   
```

**Step 6**

Now, let’s jump into the main game. We will retrieve all the users in the given team, using fetchXml. Add namespace Microsoft.Xrm.Sdk.Query in our class, so FetchExpression will be available for the user.

```csharp
private void BusinessLogic(IOrganizationService service, IExecutionContext context)  
      {  
          // We are hitting Assign button on a Case record so Target will be a Case record  
          var caseEntityReference = (EntityReference)context.InputParameters["Target"];  
  
          // Assignee could be a User or Team  
          var teamEntityReference = (EntityReference)context.InputParameters["Assignee"];  
  
          // In our requirement it should be a Team, if user it should return  
          if (teamEntityReference.LogicalName != "team") return;  
  
          // fetchXml to retrieve all the users in a given Team  
          var fetchXmlLoggedUserInTeam = @"  
          <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>  
            <entity name='systemuser'>  
              <attribute name='systemuserid' />  
              <link-entity name='teammembership' from='systemuserid' to='systemuserid' visible='false' intersect='true'>  
                <link-entity name='team' from='teamid' to='teamid' alias='ac'>  
                  <filter type='and'>  
                    <condition attribute='teamid' operator='eq' uitype='team' value='{0}' />  
                  </filter>  
                </link-entity>  
              </link-entity>  
            </entity>  
          </fetch>";  
  
          // Passing current Team is fetchXml and retrieving Team's user  
          var users = service.RetrieveMultiple(new FetchExpression(string.Format(  
              fetchXmlLoggedUserInTeam,  
              teamEntityReference.Id))).Entities;  
         
      } 
```

**Step 7**

**(Implement Condition 1)**

If FetchExpression` in the last step returns no users, then we will assign case record for the default queue of the Team, using AddToQueueRequest, add namespace Microsoft.Crm.Sdk.Messages in order to use the same.

Here, we are retrieving Id of default Queue of Team, which is used in DestinationQueueId parameter of AddToQueueRequest and in Target parameter, our case record is given.

Now, complete the code for the given condition and it should look, as shown below.

```csharp
using Microsoft.Crm.Sdk.Messages;  
using Microsoft.Xrm.Sdk;  
using Microsoft.Xrm.Sdk.Query;  
using System;  
  
namespace AssignPlugin  
{  
    public class AssignTeamToUser : IPlugin  
    {  
        public void Execute(IServiceProvider serviceProvider)  
        {  
            if (serviceProvider == null) return;  
  
            // Obtain the Plugin Execution Context  
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));  
  
            // Obtain the organization service reference.  
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));  
            var service = serviceFactory.CreateOrganizationService(context.UserId);  
  
            // To check depth   
            if (context.Depth > 2) return;  
  
            // The InputParameters collection contains all the data passed in the message request.  
            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is EntityReference)  
            {  
                // Business logic goes here  
                new AssignTeamToUser().BusinessLogic(service, context);  
            }  
        }  
  
        private void BusinessLogic(IOrganizationService service, IExecutionContext context)  
        {  
            // We are hitting Assign button on a Case record so Target will be a Case record  
            var caseEntityReference = (EntityReference)context.InputParameters["Target"];  
  
            // Assignee could be a User or Team  
            var teamEntityReference = (EntityReference)context.InputParameters["Assignee"];  
  
            // In our requirement it should be a Team, if user it should return  
            if (teamEntityReference.LogicalName != "team") return;  
  
            // fetchXml to retrieve all the users in a given Team  
            var fetchXmlLoggedUserInTeam = @"  
            <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>  
              <entity name='systemuser'>  
                <attribute name='systemuserid' />  
                <link-entity name='teammembership' from='systemuserid' to='systemuserid' visible='false' intersect='true'>  
                  <link-entity name='team' from='teamid' to='teamid' alias='ac'>  
                    <filter type='and'>  
                      <condition attribute='teamid' operator='eq' uitype='team' value='{0}' />  
                    </filter>  
                  </link-entity>  
                </link-entity>  
              </entity>  
            </fetch>";  
  
            // Passing current Team is fetchXml and retrieving Team's user  
            var users = service.RetrieveMultiple(new FetchExpression(string.Format(  
                fetchXmlLoggedUserInTeam,  
                teamEntityReference.Id))).Entities;  
  
            // Condition 1  
            // If user count is zero case should be assigned to Team's default Queue  
            if (users.Count == 0)  
            {  
                var team = service.Retrieve("team", teamEntityReference.Id, new ColumnSet("queueid"));  
  
                var addToQueueRequest = new AddToQueueRequest  
                {  
                    Target = caseEntityReference,  
                    DestinationQueueId = team.GetAttributeValue<EntityReference>("queueid").Id  
                };  
                service.Execute(addToQueueRequest);  
            }  
  
        }      }  
}  
```

Our first condition is done. You can directly jump to further sections to quickly test it. Follow the steps further to implement the rest of the conditions.

**Step 8**

**(Implement Condition 2)**

If the Team has users available in it, then cases should be assigned to the user. With the least number of cases, follow the else part in the code given below. 

Namespaces System.Collections.Generic & System.Linq needs to be added. 

```csharp
// Condition 1  
// If user count is zero case should be assigned to Team's default Queue  
if (users.Count == 0)  
{  
    var team = service.Retrieve("team", teamEntityReference.Id, new ColumnSet("queueid"));  
  
    var addToQueueRequest = new AddToQueueRequest  
    {  
        Target = caseEntityReference,  
        DestinationQueueId = team.GetAttributeValue<EntityReference>("queueid").Id  
    };  
    service.Execute(addToQueueRequest);  
}  
else  
{  
    var caseCountAssignedToUser = new Dictionary<Guid, int>();  
  
    users.ToList().ForEach(user =>  
    {  
        var fetchXmlCaseAssignedToUser = @"  
        <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>  
          <entity name='incident'>  
            <attribute name='incidentid' />  
            <link-entity name='systemuser' from='systemuserid' to='owninguser' alias='ab'>  
              <filter type='and'>  
                <condition attribute='systemuserid' operator='eq' uitype='systemuser' value='{0}' />  
              </filter>  
            </link-entity>  
          </entity>  
        </fetch>";  
        var cases = service.RetrieveMultiple(new FetchExpression(string.Format(  
            fetchXmlCaseAssignedToUser,  
            user.Id))).Entities.ToList();  
        caseCountAssignedToUser.Add(user.Id, cases.Count);  
    });  
  
    var sortedCaseCount = from entry in caseCountAssignedToUser  
                          orderby entry.Value ascending  
                          select entry;  
    var allUserWithSameLeastNumberOfCases = sortedCaseCount  
        .Where(w => w.Value == sortedCaseCount.First().Value).ToList();  
  
    var targetUser = new Guid();  
  
    // Condition 1  
    // Assign the case to user with least number of case assigned  
    if (allUserWithSameLeastNumberOfCases.Count() == 1)  
    {  
        targetUser = sortedCaseCount.First().Key;  
    }  
  
    var assign = new AssignRequest  
    {  
        Assignee = new EntityReference("systemuser", targetUser),  
        Target = caseEntityReference  
    };  
  
    service.Execute(assign);  
} 
```

**Step 9**

**(Implement Condition 3)**

If more than one user has the same number of cases, then it should be assigned randomly, else follow the part in the code given below.

```csharp
// Condition 1  
// Assign case to user with least number of case assigned  
if (allUserWithSameLeastNumberOfCases.Count() == 1)  
{  
    targetUser = sortedCaseCount.First().Key;  
}  
// Condition 2  
// If more than one users are having same least number of users, then it be assigned randomly  
else  
{  
    var randomUser = new Random().Next(0, allUserWithSameLeastNumberOfCases.Count() - 1);  
    targetUser = allUserWithSameLeastNumberOfCases[randomUser].Key;  
}  
  
var assign = new AssignRequest  
{  
    Assignee = new EntityReference("systemuser", targetUser),  
    Target = caseEntityReference  
};  
service.Execute(assign); 
```

**Step 10**

**(Sign the Assembly)**

In order to use the plugin in Dynamics 365/CRM assembly has to be signed.

* To sign, right click on the project and click Properties.

* Click on signing on the left pane

* Check Sign the assembly checkbox.

* In Choose a strong name key file dropdown, select new.

* In dialog box, give some name for the key.

* Uncheck Protect my key file with a password (Optional).

* Hit OK to save.

* ![image alt text](/assets/2017-03-15/image_2.png) 

 

Now, our final code looks, as shown below.

```csharp
using Microsoft.Crm.Sdk.Messages;  
using Microsoft.Xrm.Sdk;  
using Microsoft.Xrm.Sdk.Query;  
using System;  
using System.Collections.Generic;  
using System.Linq;  
  
namespace AssignPlugin  
{  
    public class AssignTeamToUser : IPlugin  
    {  
        public void Execute(IServiceProvider serviceProvider)  
        {  
            if (serviceProvider == null) return;  
  
            // Obtain the Plugin Execution Context  
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));  
  
            // Obtain the organization service reference.  
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));  
            var service = servicefonFactory.CreateOrganizationService(context.UserId);  
  
            // To check depth   
            if (context.Depth > 2) return;  
  
            // The InputParameters collection contains all the data passed in the message request.  
            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is EntityReference)  
            {  
                // Business logic goes here  
                new AssignTeamToUser().BusinessLogic(service, context);  
            }  
        }  
  
        private void BusinessLogic(IOrganizationService service, IExecutionContext context)  
        {  
            // We are hitting Assign button on a Case record so Target will be a Case record  
            var caseEntityReference = (EntityReference)context.InputParameters["Target"];  
  
            // Assignee could be a User or Team  
            var teamEntityReference = (EntityReference)context.InputParameters["Assignee"];  
  
            // In our requirement it should be a Team, if user it should return  
            if (teamEntityReference.LogicalName != "team") return;  
  
            // fetchXml to retrieve all the users in a given Team  
            var fetchXmlLoggedUserInTeam = @"  
            <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>  
              <entity name='systemuser'>  
                <attribute name='systemuserid' />  
                <link-entity name='teammembership' from='systemuserid' to='systemuserid' visible='false' intersect='true'>  
                  <link-entity name='team' from='teamid' to='teamid' alias='ac'>  
                    <filter type='and'>  
                      <condition attribute='teamid' operator='eq' uitype='team' value='{0}' />  
                    </filter>  
                  </link-entity>  
                </link-entity>  
              </entity>  
            </fetch>";  
  
            // Passing current Team is fetchXml and retrieving Team's user  
            var users = service.RetrieveMultiple(new FetchExpression(string.Format(  
                fetchXmlLoggedUserInTeam,  
                teamEntityReference.Id))).Entities;  
  
            // Condition 1  
            // If user count is zero case should be assigned to Team's default Queue  
            if (users.Count == 0)  
            {  
                // Retrieving Team's default Queue  
                var team = service.Retrieve("team", teamEntityReference.Id, new ColumnSet("queueid"));  
  
                var addToQueueRequest = new AddToQueueRequest  
                {  
                    // Case record  
                    Target = caseEntityReference,  
                    // Team's default Queue Id  
                    DestinationQueueId = team.GetAttributeValue<EntityReference>("queueid").Id  
                };  
                service.Execute(addToQueueRequest);  
            }  
            else  
            {  
                // Dictionary to save UserId and number of case assigned pair  
                var caseCountAssignedToUser = new Dictionary<Guid, int>();  
  
                users.ToList().ForEach(user =>  
                {  
                    // FetchXml query to retrieve number cases assigned to each user  
                    var fetchXmlCaseAssignedToUser = @"  
                    <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>  
                      <entity name='incident'>  
                        <attribute name='incidentid' />  
                        <link-entity name='systemuser' from='systemuserid' to='owninguser' alias='ab'>  
                          <filter type='and'>  
                            <condition attribute='systemuserid' operator='eq' uitype='systemuser' value='{0}' />  
                          </filter>  
                        </link-entity>  
                      </entity>  
                    </fetch>";  
  
                    var cases = service.RetrieveMultiple(new FetchExpression(string.Format(  
                        fetchXmlCaseAssignedToUser,  
                        user.Id))).Entities.ToList();  
  
                    // Adding user id with number of cases assigned to Dictionay defined above  
                    caseCountAssignedToUser.Add(user.Id, cases.Count);  
                });  
  
                // Sorting in ascending order by number of cases  
                var sortedCaseCount = from entry in caseCountAssignedToUser  
                                      orderby entry.Value ascending  
                                      select entry;  
  
                // Getting all the users with least sae number of cases  
                var allUserWithSameLeastNumberOfCases = sortedCaseCount  
                    .Where(w => w.Value == sortedCaseCount.First().Value).ToList();  
  
                var targetUser = new Guid();  
  
                // Condition 1  
                // Assign case to user with least number of case assigned  
                if (allUserWithSameLeastNumberOfCases.Count() == 1)  
                {  
                    targetUser = sortedCaseCount.First().Key;  
                }  
                // Condition 2  
                // If more than one users are having same least number of users, then it be assigned randomly  
                else  
                {  
                    var randomUser = new Random().Next(0, allUserWithSameLeastNumberOfCases.Count() - 1);  
                    targetUser = allUserWithSameLeastNumberOfCases[randomUser].Key;  
                }  
  
                var assign = new AssignRequest  
                {  
                    Assignee = new EntityReference("systemuser", targetUser),  
                    Target = caseEntityReference  
                };  
  
                service.Execute(assign);  
            }  
  
        }  
    }  
}  
```

**Section 2  **

**Deploying in Dynamics 365/CRM**

 To deploy the plugin to CRM

* Build the project.

* Open Plugin Registration tool and connect it to your Dynamics CRM instance.

* ![image alt text](/assets/2017-03-15/image_3.png)

* Click Register, followed by clicking Register new assembly.

* In popup Step 1, select your DLL from the debug folder, which we have just created and the location will be similar to this

           "C:\Users\AshV\Documents\Visual Studio 2017\Projects\AssignPlugin\AssignPlugin\bin\Debug\AssignPlugin.dll"

* In Step 2, check select all and hit Register Selected Plugin button.

* ![image alt text](/assets/2017-03-15/image_4.png) 

* After success, you will see the message given below.

* ![image alt text](/assets/2017-03-15/image_5.png)

* Now, a new step has to be registered on Assign step of Case record, else this plugin will not be triggered. To register, right click on assembly and click Register new step.

* ![image alt text](/assets/2017-03-15/image_6.png)

* In dialog box, select Message as Assign and Primary Entity as an incident (i.e. case). 

* ![image alt text](/assets/2017-03-15/image_7.png) 

*  Hit Register

**Section 3**

**Configuration in CRM & Verifying Functionality**

* Create Team with Administrator privileges by following Settings -> Security -> Teams and create new Team. I have given Team name as Quick Service Team.

* ![image alt text](/assets/2017-03-15/image_8.png)

*  Assign System Administrator Role to the newly created Team.

* ![image alt text](/assets/2017-03-15/image_9.png)

* Now, this Team has no users. If any case is assigned to this Team it will go to the default queue, let's try it out.

* Hit Assign, select Assign To as a User or Team, select Quick Service Team and hit Asssign.

* ![image alt text](/assets/2017-03-15/image_10.png) 

*  After assigning hit Queue Item Details to verify whether it is assigned to the Queue or not.

* ![image alt text](/assets/2017-03-15/image_11.png)

*  To verify the rest of two conditions, create a few more users in Team and try assigning the record to Team and see how records are getting assigned.

You can find this code in my GitHub repo as well https://github.com/AshV/AssignPluginDynamics365 For any query regarding this, feel free to get in touch with me. 