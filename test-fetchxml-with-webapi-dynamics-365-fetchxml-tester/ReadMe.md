# Test/Execute your fetchXml with Dyanmics 365 WebAPI

Dynamics 365/CRM WebAPI has unleashed many capibilities to it's REST endpoint, Executing fetchXml is one of them.
Just append entity's plural name in WebAPI endpoint and pass fetchXml in querystring.

> #### Syntax: WebAPI Endpoint + / + Entity Plural Name + ?fetchXml= + Your fetchXml here

> ##### Example: https://AshV.crm.dynamics.com//api/data/v8.2/accounts?fetchXml=%3Cfetch%20version=%221.0%22%20output-format=%22xml-platform%22%20mapping=%22logical%22%20distinct=%22false%22%3E%20%20%3Centity%20name=%22account%22%3E%20%20%3C/entity%3E%3C/fetch%3E

I written https://AshishVishwakarma.com/FetchXmlTester which makes it very handy so you can easily test fetchXml or generate query to use somewhere else.

> You must be logged-in into your Dynamics 365/CRM org in same browser instance. This dosen't require any credentials, and works for any type

To use the same,
1. Enter your fetchXml in main big text area.
1. It will populate enity plural name, just verify, it not correct change it manually
1.
