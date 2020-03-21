---
layout: post
title: "Generate Access Token for Dynamics 365 Single Tenant Server to Server Authentication"
date: 2018-12-29 00:18:01 +0530
categories: Dynamics-365 PowerApps
permalink: Dynamics-365-Single-Tenant-Server-2-Server-Authentication-Azure-Active-Directory-Access-Token/
---

![Generate Access Token for Dynamics 365 Single Tenant Server to Server Authentication](/assets/2018-12-29/microsoft-dynamics-365-banner.jpg)

In Dynamics 365 integration scenarios most of the times we need to authenticate only single tenant. Since now Dynamics 365 authentication only through Azure AD (for online instances) is recommended let's see how to do it. To achieve this first of all we need to create App in Azure Active Directory and good news is that you don't need Azure subscription to try this out, your Dynamics 365 free trial is enough.

These 4 steps are involved to implement this, you can always jump to next step if know current step. This topic may not be very new to everyone, but when I got to implement the same recently it took me few hours to make it work, because of recent of frequent Azure updates or outdated content maybe. which leads me to write this.

1. Create & configureApp in Azure Active Directory
2. Create User in Azure AD and Configure it as Application User in Dynamics 365
3. Write C# code with ADAL(Active Directory Authentication Library) to generate Access Token
4. Making requests to Dynamics 365 with above generated Access Token

## Step 1: Create Azure AD App

* Navigate to Azure(https://portal.azure.com).
* On left menu click on **Azure Active Directory** -> App registrations(Preview) => **+ New registration**, We will use Preview version only because it has more straight forward options and going forward this only is going to be default option.
![create-azure-ad-app](assets/2018-12-29/create-azure-ad-app.png)

* Give some Name to your App, and for account type select *Accounts in this organizational directory only* because we need it for single tenant only.
![single-tenant-app](assets/2018-12-29/single-tenant-app.png)

* Once App is created, click on API permissions to add new permission for your app.
![adding-new-permissions](assets/2018-12-29/adding-new-permissions.png)

* Select Dynamics CRM here.
![dynamics-crm-permission](assets/2018-12-29/dynamics-crm-permission.png)

* Check user_impersonation box in upcoming screen and click *Add permissions*
![user-impersonation](assets/2018-12-29/user-impersonation.png)

* These permission require admin consent, click on **Grant admin consent for your-org** button and confirm it. You need administrator role to do it.
* ![grant-admin-consent](assets/2018-12-29/grant-admin-consent.png)

**Now your App is created, we need three things to use further from here.**

1. Application Id aka Client Id
2. Tenant Id
3. Client Secret

* Application Id & Tenant Id you can grab from App Overview.
![app-overview](assets/2018-12-29/app-overview.png)

* To generate Client Secret go to **Certificates & secrets** and then **+ New client secret**, Give some description and select validity of your secret, click **Add**.
![client-secret](assets/2018-12-29/client-secret.png)

* Client Secret is something which you should keep secret, that why you can see this only once after generation, copy it and keep it safe to use later.
* ![generated-secret](assets/2018-12-29/generated-secret.png)

## Step 2: Create Application User

* You need to create a new user, all CRM Api calls will be made on behalf of this user.
* This user does not require Dynamics 365 license.
* This user should be created from Azure(https://portal.azure.com), not from Office Portal(https://admin.microsoft.com)
* Navigate to Azure -> Azure Active Directory -> Users, Click on **+ New user**.

![new-app-user](assets/2018-12-29/new-app-user.png)
* Here Username field must be has same domain name as your org.
* Once this user is create, Go to your Dynamics 365 instance.
* Navigate to Dynamics 365 -> Settings -> Security, Click on Users here.
* Change view to Application Users & click on **+ NEW** to create new Application User.
![set-view-as-application-user](assets/2018-12-29/set-view-as-application-user.png)

* You may need to set form also as Application User if it's not coming by default.
![set-form-as-application-user](assets/2018-12-29/set-form-as-application-user.png)

* Here Application ID must be the same as Azure AD App created in previous step. Username & email you can keep same as the one created in Azure AD. Though it's not necessary to be the same, I have tried with different name also. Once you save it Application ID URI & Azure AD Object ID will auto populate.
![new-app-user-d365](assets/2018-12-29/new-app-user-d365.png)

* Now you need to assign **security role** to this user to perform operation on desired records, I've seen in many blogs that this user must have a custom security role, so you can copy some existing role and assign it. But when I tried with **OOB security role** it was still working.

## Step 3: Get Access Token with ADAL

* Create new project in Visual Studio and add ADAL package via NuGet.
![ADAL-NuGet.png](assets/2018-12-29/ADAL-NuGet.png)

* Create below shown method and replace Application Id, Client Secret, Tenant Id & your organization Url in appropriate place.

<script src="https://gist.github.com/AshV/45a8ed0c86a99d4e485f8d8bc7d843e1.js"></script>


## Step 4: Consuming Access Token

* You have access token now, you can make request to your Dynamics 365 by including this to your HTTP requests, see below method.

```csharp
public static async Task<HttpResponseMessage> CrmRequest(HttpMethod httpMethod, string requestUri, string body = null)
{
    var accessToken = await AccessTokenGenerator();
    var client = new HttpClient();
    var msg = new HttpRequestMessage(httpMethod, requestUri);
    msg.Headers.Add("OData-MaxVersion", "4.0");
    msg.Headers.Add("OData-Version", "4.0");
    msg.Headers.Add("Prefer", "odata.include-annotations=\"*\"");

    // Passing AccessToken in Authentication header
    msg.Headers.Add("Authentication", $"Bearer {accessToken}");

    if (body != null)
        msg.Content = new StringContent(body, UnicodeEncoding.UTF8, "application/json");

    return await client.SendAsync(msg);
}
```

* You can make different requests using above method, here is an example for retrieving all contacts with GET.

```csharp
var contacts = CrmRequest(
    HttpMethod.Get, 
    "https://efrig.api.crm8.dynamics.com/api/data/v9.1/contacts")
    .Result.Content.ReadAsStringAsync();
```

## Full Code (Replace your Azure Credentials before executing)

```csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace D365S2S
{
    class Program
    {
        static void Main(string[] args)
        {
            var contacts = CrmRequest(
                HttpMethod.Get,
                "https://efrig.api.crm8.dynamics.com/api/data/v9.1/contacts")
                .Result.Content.ReadAsStringAsync();
            // Similarly you can make POST, PATCH & DELETE requests
        }

        public static async Task<string> AccessTokenGenerator()
        {
            string clientId = "13950f0e-0000-4e2f-0000-b923302c4338"; // Your Azure AD Application ID
            string clientSecret = "0^C#%0000DR7/#Z[-.m5aYO00000000$"; // Client secret generated in your App
            string authority = "https://login.microsoftonline.com/ceb48f70-0000-1111-0000-9170f6a706a6"; // Azure AD App Tenant ID
            string resourceUrl = "https://efrig.crm8.dynamics.com"; // Your Dynamics 365 Organization URL

            var credentials = new ClientCredential(clientId, clientSecret);
            var authContext = new Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext(authority);
            var result = await authContext.AcquireTokenAsync(resourceUrl, credentials);
            return result.AccessToken;
        }

        public static async Task<HttpResponseMessage> CrmRequest(HttpMethod httpMethod, string requestUri, string body = null)
        {
            // Acquiring Access Token
            var accessToken = await AccessTokenGenerator();

            var client = new HttpClient();
            var message = new HttpRequestMessage(httpMethod, requestUri);

            // OData related headers
            message.Headers.Add("OData-MaxVersion", "4.0");
            message.Headers.Add("OData-Version", "4.0");
            message.Headers.Add("Prefer", "odata.include-annotations=\"*\"");

            // Passing AccessToken in Authentication header
            message.Headers.Add("Authorization", $"Bearer {accessToken}");
            
            // Adding body content in HTTP request 
            if (body != null)
                message.Content = new StringContent(body, UnicodeEncoding.UTF8, "application/json");

            return await client.SendAsync(message);
        }
    }
}
```

> Hope it helps, feel free to get in touch for any query/suggestions. 