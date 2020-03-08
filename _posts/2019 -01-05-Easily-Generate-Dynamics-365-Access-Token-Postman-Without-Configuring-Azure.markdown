---
layout: post
title:  "Quickly Generate Access Token For Dynamics 365 To Be Used  With Postman Without Configuring Azure AD App"
date:   2019-01-05 00:00:00 +0530
categories: CRM-SDK AuditDetail Dynamics-365
permalink: Easily-Generate-Dynamics-365-Access-Token-Postman-Without-Configuring-Azure
---

Since [Microsoft recommended to prefer WebApi](https://docs.microsoft.com/en-us/previous-versions/dynamicscrm-2016/developers-guide/dn281891(v=crm.8)#microsoft-dynamics-crm-2011-endpoint) over Organization Service, [Postman](https://www.getpostman.com/) became a saviour to Dynamics 365 developers and [Microsoft's documentation](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/use-postman-web-api) was always helpful to setup and use postman with Dynamics 365 WebApi.

[![Dynamics 365 Access Token Generator](assets/2019 -01-05/Dynamics-365-Access-Token-Generator.png)](https://www.ashishvishwakarma.com/Dynamics-365-Access-Token-Generator/)

With organization service it used to be very easy by making [console app and debugging our logic](https://github.com/AshV/Dynamics365ConsoleCaller) by just using our login credentials. But with WebApi some steps involved to create Azure AD app then generating Access Token and using this token to make HTTP calls to WebApi using Postman.

I created a small utility using multi tenant authentication which generates Access Token for you, without need to configure Azure AD App yourself. You can directly use this Access Token with Postman or any other application to quickly test Dynamics 365 WebApi calls. Give it a try by clicking on link below.

> ## [https://AshishVishwakarma.com/Dynamics-365-Access-Token-Generator/](https://www.ashishvishwakarma.com/Dynamics-365-Access-Token-Generator/)

Hope this helps and saves your time.
Please give any feedback you have or observe any bug or any question.

Cheers! 🙂 






