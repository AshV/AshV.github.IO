---
layout: post
title:  "Get Specific Field Change History from AuditDetail in Dynamics 365"
date:   2019-11-26 00:00:01 +0530
categories: CRM-SDK AuditDetail Dynamics-365
permalink: Retrieve-Field-Change-History-AuditDetail-Dynamics-365-RetrieveAttributeChangeHistory
---

In a requirement we were asked to show one specific field change history in a custom portal written in PHP, our imeediate action was to call **RetrieveAttributeChangeHistory** via WebApi but if was just returning the list of value history without any other fields but geting CahngedOn and ChangedBy field was our requirement. (see details in github issue [here](https://github.com/MicrosoftDocs/dynamics-365-customer-engagement/issues/1183)).

We finally headed to our good old CRM SDK libraries and written code in C# then access this via Dyanmics 365 WebApi using Dynamics 365 Custom Action.

I'm sahring here core logic, it can be used according to your own requirement, either in Action or any other place where CRM SDK C# libraries can be consumed.

### Model class to get history as a list

```csharp
public class FieldHistory
{
    public string ChangedBy { get; set; }
    public DateTime ChangedOn { get; set; }
    public string Oldvalue { get; set; }
    public string NewValue { get; set; }
}
```

### Function to get and parse field history

Below code is using **FormattedValues** which retrieve user redable component out of OptionSet and EntityReference fields, this can be modifield according to your requirements.

```csharp
public static List<FieldHistory> GetFieldHistory(string entityLogicalName, Guid recordId, string fieldName, IOrganizationService service)
{
    var attributeChangeHistoryRequest = new RetrieveAttributeChangeHistoryRequest
    {
        Target = new EntityReference(entityLogicalName, recordId),
        AttributeLogicalName = fieldName
    };

    var attributeChangeHistoryResponse = (RetrieveAttributeChangeHistoryResponse)service.Execute(attributeChangeHistoryRequest);
    var details = attributeChangeHistoryResponse.AuditDetailCollection;

    var fieldHistory = new List<FieldHistory>();

    foreach (var detail in details.AuditDetails)
    {
        var detailType = detail.GetType();
        if (detailType == typeof(AttributeAuditDetail))
        {
            // retrieve old & new value of each action of each audit change from AttributeAuditDetail
            var attributeDetail = (AttributeAuditDetail)detail;

            var userName = attributeDetail.AuditRecord.GetAttributeValue<EntityReference>("userid").Name;
            var changedOn = attributeDetail.AuditRecord.GetAttributeValue<DateTime>("createdon");
            var newValue = attributeDetail.NewValue.FormattedValues[fieldName];
            var oldValue = attributeDetail.OldValue?.FormattedValues[fieldName];

            fieldHistory.Add(new FieldHistory
            {
                ChangedBy = userName,
                ChangedOn = changedOn,
                Oldvalue = oldValue,
                NewValue = newValue
            });

            return fieldHistory;
        }
    }
}
```

If you observe I have use safe navigation operator for ```var oldValue = attributeDetail.OldValue?.FormattedValues[fieldName];``` this is because for the first occurrence OldValue will always remain null.

This code is **good** if we are using in C# specific requiremnt, while it's a **workaround** if we need field history via WebAPI. Let's keep an eye in [official documentation](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/retrieveattributechangehistory) and in this [issue](https://github.com/MicrosoftDocs/dynamics-365-customer-engagement/issues/1183) if Microsoft returns more meaningful response in future.

Hope this helps.
