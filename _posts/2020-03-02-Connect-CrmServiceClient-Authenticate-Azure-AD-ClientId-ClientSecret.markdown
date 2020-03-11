---
layout: post
title:  "Connect CrmServiceClient using Azure AD App Client ID & Client Secret for C# SDK"
date:   2020-03-02 00:18:01 +0530
categories: CRM-SDK AzureAD CrmServiceClient
permalink: Connect-CrmServiceClient-Authenticate-Azure-AD-ClientId-ClientSecret/
---

After depecation announcemnt of Dynamics 2011 Organization Service Endpoint in late 2018 and recommendation on using OAuth authentication & Dynamics 365 WebAPI, there was uncertainity for developers who were using/planning to use 3rd party integartion using C# SDK. 

Ref: [https://crmtipoftheday.com/1155/the-clock-is-ticking-on-your-endpoint/](https://crmtipoftheday.com/1155/the-clock-is-ticking-on-your-endpoint/)

Ref: [https://community.dynamics.com/crm/f/microsoft-dynamics-crm-forum/311096/is-organization-service-is-going-to-be-deprecated](https://community.dynamics.com/crm/f/microsoft-dynamics-crm-forum/311096/is-organization-service-is-going-to-be-deprecated)

Finally, `CrmServiceClient` provides option to connect to organization service using Client Id & Client Secret. Let's try it out.

### Why to use Client ID & Client Secret to Authenticate

* Only minor code chanegs required in existing code.
* OAuth is safer than using password based authenticaton.
* Save user licencing cost by using Application User

### Sample Code

As part of initial setup Application User & Azure AD App is required if you don't have it already please refer to Step 1 & Step 2 in [this artice.](https://www.ashishvishwakarma.com/Dynamics-365-Single-Tenant-Server-2-Server-Authentication-Azure-Active-Directory-Access-Token/)
Once you have all the details, prepare connection string as shown below and use **AuthType=ClientSecret** here.

```csharp
public static IOrganizationService GetOrganizationServiceClientSecret(string clientId, string clientSecret, string organizationUri)
{
    try
    {
        var conn = new CrmServiceClient($@"AuthType=ClientSecret;url={organizationUri};ClientId={clientId};ClientSecret={clientSecret}");

        return conn.OrganizationWebProxyClient != null ? conn.OrganizationWebProxyClient : (IOrganizationService)conn.OrganizationServiceProxy;
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error while connecting to CRM " + ex.Message);
        Console.ReadKey();
        return null;
    }
}

IOrganizationService orgService = GetOrganizationServiceClientSecret(
                 "<Client Id obtained from Azure AD App>",
                 "<Client Secret obtained from Azure AD App>",
                 "<Organization Uri>");

var response = orgService.Execute(new WhoAmIRequest());
```

All the necessary packages should be installed, package **Microsoft.CrmSdk.XrmTooling.CoreAssembly** version should be 9.1.0.13 or higher in order to connect using ClientSecret. [see release notes.](https://www.nuget.org/packages/Microsoft.CrmSdk.XrmTooling.CoreAssembly/9.1.0.38/)

![nuget-packages](assets/2020-03-02/packages.png)

You can find this code on my [GitHub.](https://github.com/AshV/Dynamics365ConsoleCaller)

Feel free to get back in case of any suggestions/queries.