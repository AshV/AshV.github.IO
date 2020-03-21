---
layout: post
title: "Querying N:N Relationship Intersect Enity with FetchXML and Dynamics 365 WebAPI"
date: 2018-10-21 00:18:01 +0530
categories: Dynamics-365 PowerApps
permalink: Query-N-N-Relationship-Intersect-Entity-FetchXML-Dynamics-365-WebAPI/
---

In a recent requirement I had to query some data from N:N relationship in client side javascript. I achieved it with fetch XML & WebAPI here for example I'll be using **User** & **Security Role** entity.

For creating N:N relationships between tables itersect tables are used which usually has 3 columns It's own **primary key**, first table's **primary key** & second table's **primary key**. In dynamics 365 GUIDs are used as primary key so each row conatins 3 GUIDs with given data.

To execute fetchXML, dynamics 365 webAPI requires entity's plural name, but intersect tables don't have that so we need to link with one of participating entity in fetchXML to query intersect entity.
 
> Syntax: WebAPI Endpoint + / + Entity Plural Name + ?fetchXml= + Your fetchXml here

[Find more here about executing fetchXml with WebAPI](https://www.ashishvishwakarma.com/Execute-fetchXml-WebAPI-Dynamics-365-Using-JavaScript-Example/)

You need to form fetchXML like this, here entity could be either of **User** or **Security Role**, their logical names are **systemuser** & **role** resplectivey. Relationship entity name can be found in N:N relationship in solutions. (refer image)

> Syntax:

```xml
<fetch>
   <entity name="Entity Name">
      <attribute name="Entity Logical ID" />
      <link-entity name="Relationship Entity Name" from="Entity ID" to="Entity ID" intersect="true">
         <all-attributes />
      </link-entity>
   </entity>
</fetch>
```

> Images:Find Relationship Entity Name

![N:N Relationships](/assets/2018-10-21/N-N.png)

![Relationship Name](/assets/2018-10-21/Relationship.png)

> Create FetchXML

FetchXml can be written against any of the participating entity, in this case **User** & **Security Role**. It should be executed accordingly in webAPI with same entity's plural name which is used in fetchXML. See below.

For **Security Role** => OrgURL/api/data/v9.0/**roles**?\<fetchXML>...

For **User** => OrgURL/api/data/v9.0/**systemusers**?\<fetchXML>...

```xml
<fetch>
  <entity name="role">
    <attribute name="roleid" />
    <link-entity name="systemuserroles" from="roleid" to="roleid" intersect="true">
     <all-attributes/>
    </link-entity>
  </entity>
</fetch>
```

```xml
<fetch>
  <entity name="systemuser">
    <attribute name="systemuserid" />
    <link-entity name="systemuserroles" from="systemuserid" to="systemuserid" intersect="true">
     <all-attributes/>
    </link-entity>
  </entity>
</fetch>
```

[Click here to use Fetch XML Tester to verify created query](https://www.ashishvishwakarma.com/FetchXmlTester/)

> Output: it would look similar

```json
{
   "@odata.context":"https://ashv.crm.dynamics.com/api/data/v8.2/$metadata#roles(roleid)",
   "value":[
      {
         "@odata.etag":"W/\"1003197\"",
         "roleid":"e9133cb3-92e5-41c1-a242-9d17098e5f7b",
         "systemuserroles1_x002e_systemuserroleid":"1b22830d-93c0-e811-a960-000d3af0375c",
         "systemuserroles1_x002e_roleid":"e9133cb3-92e5-41c1-a242-9d17098e5f7b",
         "systemuserroles1_x002e_systemuserid":"e4613b07-93c0-e811-a960-000d3af06590"
      },
      {
         "@odata.etag":"W/\"1003198\"",
         "roleid":"1a71447c-8751-4bf6-9800-a53faa4258f3",
         "systemuserroles1_x002e_systemuserroleid":"bc1c140d-93c0-e811-a962-000d3af04fc2",
         "systemuserroles1_x002e_roleid":"1a71447c-8751-4bf6-9800-a53faa4258f3",
         "systemuserroles1_x002e_systemuserid":"e4613b07-93c0-e811-a960-000d3af06590"
      }
   ]
}
```

Hope it helps.