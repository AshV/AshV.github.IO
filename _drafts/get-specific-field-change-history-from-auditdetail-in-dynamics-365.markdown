---
layout: post
title: Get Specific Field Change History from AuditDetail in Dynamics 365
date: 2021-01-30 18:19:02
categories:
  - Dynamics-365
  - PowerApps
  - Audit
permalink: Get-Specific-Field-Change-History-AuditDetail-Dynamics-365
---

In a requirement we were asked to show one specific field change history in a custom portal written in PHP, our imeediate action was to call&nbsp;**RetrieveAttributeChangeHistory**&nbsp;via WebApi but if was just returning the list of value history without any other fields but geting CahngedOn and ChangedBy field was our requirement. (see details in github issue&nbsp;[here](https://github.com/MicrosoftDocs/dynamics-365-customer-engagement/issues/1183)).

We finally headed to our good old CRM SDK libraries and written code in C\# then access this via Dyanmics 365 WebApi using Dynamics 365 Custom Action.

I’m sahring here core logic, it can be used according to your own requirement, either in Action or any other place where CRM SDK C\# libraries can be consumed.

### Model class to get history as a list

1. **public**&nbsp;**class**&nbsp;FieldHistory&nbsp;&nbsp;
2. \{&nbsp;&nbsp;
3. &nbsp; &nbsp;&nbsp;**public**&nbsp;**string**&nbsp;ChangedBy \{&nbsp;**get**;&nbsp;**set**; \}&nbsp;&nbsp;
4. &nbsp; &nbsp;&nbsp;**public**&nbsp;DateTime ChangedOn \{&nbsp;**get**;&nbsp;**set**; \}&nbsp;&nbsp;
5. &nbsp; &nbsp;&nbsp;**public**&nbsp;**string**&nbsp;Oldvalue \{&nbsp;**get**;&nbsp;**set**; \}&nbsp;&nbsp;
6. &nbsp; &nbsp;&nbsp;**public**&nbsp;**string**&nbsp;NewValue \{&nbsp;**get**;&nbsp;**set**; \}&nbsp;&nbsp;
7. \}&nbsp;&nbsp;

### Function to get and parse field history

Below code is using&nbsp;**FormattedValues**&nbsp;which retrieve user redable component out of OptionSet and EntityReference fields, this can be modifield according to your requirements.

1. **public**&nbsp;**static**&nbsp;List&lt;FieldHistory&gt; GetFieldHistory(**string**&nbsp;entityLogicalName, Guid recordId,&nbsp;**string**&nbsp;fieldName, IOrganizationService service)&nbsp;&nbsp;
2. \{&nbsp;&nbsp;
3. &nbsp; &nbsp; var attributeChangeHistoryRequest =&nbsp;**new**&nbsp;RetrieveAttributeChangeHistoryRequest&nbsp;&nbsp;
4. &nbsp; &nbsp; \{&nbsp;&nbsp;
5. &nbsp; &nbsp; &nbsp; &nbsp; Target =&nbsp;**new**&nbsp;EntityReference(entityLogicalName, recordId),&nbsp;&nbsp;
6. &nbsp; &nbsp; &nbsp; &nbsp; AttributeLogicalName =&nbsp;fieldName&nbsp;&nbsp;
7. &nbsp; &nbsp; \};&nbsp;&nbsp;
8. &nbsp;&nbsp;
9. &nbsp; &nbsp; var attributeChangeHistoryResponse =&nbsp;(RetrieveAttributeChangeHistoryResponse)service.Execute(attributeChangeHistoryRequest);&nbsp;&nbsp;
10. &nbsp; &nbsp; var details =&nbsp;attributeChangeHistoryResponse.AuditDetailCollection;&nbsp;&nbsp;
11. &nbsp;&nbsp;
12. &nbsp; &nbsp; var fieldHistory =&nbsp;**new**&nbsp;List&lt;FieldHistory&gt;();&nbsp;&nbsp;
13. &nbsp;&nbsp;
14. &nbsp; &nbsp;&nbsp;**foreach**&nbsp;(var detail&nbsp;**in**&nbsp;details.AuditDetails)&nbsp;&nbsp;
15. &nbsp; &nbsp; \{&nbsp;&nbsp;
16. &nbsp; &nbsp; &nbsp; &nbsp; var detailType =&nbsp;detail.GetType();&nbsp;&nbsp;
17. &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;**if**&nbsp;(detailType ==&nbsp;**typeof**(AttributeAuditDetail))&nbsp;&nbsp;
18. &nbsp; &nbsp; &nbsp; &nbsp; \{&nbsp;&nbsp;
19. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; // retrieve old & new value of each action of each audit change from AttributeAuditDetail&nbsp;&nbsp;
20. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; var attributeDetail =&nbsp;(AttributeAuditDetail)detail;&nbsp;&nbsp;
21. &nbsp;&nbsp;
22. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; var userName =&nbsp;attributeDetail.AuditRecord.GetAttributeValue&lt;EntityReference&gt;("userid").Name;&nbsp;&nbsp;
23. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; var changedOn =&nbsp;attributeDetail.AuditRecord.GetAttributeValue&lt;DateTime&gt;("createdon");&nbsp;&nbsp;
24. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; var newValue =&nbsp;attributeDetail.NewValue.FormattedValues\[fieldName\];&nbsp;&nbsp;
25. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; var oldValue =&nbsp;attributeDetail.OldValue?.FormattedValues\[fieldName\];&nbsp;&nbsp;
26. &nbsp;&nbsp;
27. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; fieldHistory.Add(**new**&nbsp;FieldHistory&nbsp;&nbsp;
28. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \{&nbsp;&nbsp;
29. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ChangedBy =&nbsp;userName,&nbsp;&nbsp;
30. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ChangedOn =&nbsp;changedOn,&nbsp;&nbsp;
31. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Oldvalue =&nbsp;oldValue,&nbsp;&nbsp;
32. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; NewValue =&nbsp;newValue&nbsp;&nbsp;
33. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; \});&nbsp;&nbsp;
34. &nbsp;&nbsp;
35. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;**return**&nbsp;fieldHistory;&nbsp;&nbsp;
36. &nbsp; &nbsp; &nbsp; &nbsp; \}&nbsp;&nbsp;
37. &nbsp; &nbsp; \}&nbsp;&nbsp;
38. \}

If you observe I have use safe navigation operator for var oldValue = attributeDetail.OldValue?.FormattedValues\[fieldName\]; this is because for the first occurrence OldValue will always remain null.

This code is&nbsp;**good**&nbsp;if we are using in C\# specific requiremnt, while it’s a&nbsp;**workaround**&nbsp;if we need field history via WebAPI. Let’s keep an eye in&nbsp;[official documentation](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/retrieveattributechangehistory)&nbsp;and in this&nbsp;[issue](https://github.com/MicrosoftDocs/dynamics-365-customer-engagement/issues/1183)&nbsp;if Microsoft returns more meaningful response in future.

Hope this helps.

&nbsp;
