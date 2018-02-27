# Test/Execute your fetchXml with Dyanmics 365 WebAPI

Dynamics 365/CRM WebAPI has unleashed many capibilities to it's REST endpoint, Executing fetchXml is one of them.
Just append entity's plural name in WebAPI endpoint and pass fetchXml in querystring.

> #### Syntax: WebAPI Endpoint + / + Entity Plural Name + ?fetchXml= + Your fetchXml here

**Example:**
 
 ```xml
 https://AshV.crm.dynamics.com/api/data/v8.2/accounts?fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false"><entity name="account"></entity></fetch>
```

I have written [AshishVishwakarma.com/FetchXmlTester](https://AshishVishwakarma.com/FetchXmlTester) which makes it very handy so you can easily test fetchXml or generate query to use somewhere else.

> You must be logged-in into your Dynamics 365/CRM org in same browser instance. This dosen't require any credentials, and works for any type of deployment (Online / On-premises / IFD)

![fetchXml Tester Online](https://github.com/AshV/FetchXmlTester/raw/master/logo.png)

To use the same,
1. Enter your fetchXml in main big text area.
1. It will populate entity plural name, just verify, if not correct change it manually.
1. Provide your org url, not necessary to provide WebAPI endpoint.
1. It would genertate URL in box beside but. You can click the button to test, which will show json reponse in new tab.
1. Alternatively you can copy link generated in box beside button, aur open that in new tab.

> If you find any bugs or have any suggestion, please update [here](https://github.com/AshV/FetchXmlTester/issues/new)  

Cheers!
