---
layout: post
title: "Parsing Customer Journey Workflow Definition JSON with Linq.js in Dynamics 365 for Marketing"
date: 2018-11-01 00:18:01 +0530
categories: Dynamics-365 PowerApps
permalink: Parsing-Customer-Journey-Workflow-Definition-JSON-linqjs-Dynamics-365-Marketing/
---

In new Dynamics 365 Apps many configurations and data are being saved as JSON, rather than creating relationships between entities or saving as XML. Customer Journey is one of those entity, this provides visual designer like shown below to design workflow and this is saved as JSON behind the scenes in **msdyncrm_workflowdefinition** column. This workflow has data related to all the components of customer journey and interacton between them.

![CustomerJourney](assets/2018-11-01/CustomerJourney.png)

Sometimes we need to programatically query that which all records are participating in customer journey workflow. Then we need to parse JSON store in msdyncrm_workflowdefinition field, while doing this in client side [linq.js will make our job easy af](https://www.ashishvishwakarma.com/LINQ-JS-for-Dynamics-365-Developers/).

Below is the code to parse a few components which can be used as it is, or you might need to modify code a bit as per requirement or if you are adding you custom channels to your customer journey. This code snippet is stored as Github Gist at [https://gist.github.com/AshV/b0eb8aef725a8c6670d3c20f80b54029](https://gist.github.com/AshV/b0eb8aef725a8c6670d3c20f80b54029).

<script src="https://gist.github.com/AshV/b0eb8aef725a8c6670d3c20f80b54029.js"></script>

In above code I have written a function to filter all the node reference related to provided component, which can be queried further as per requirements. Below given is json for a typical customer journey workflow you can observe outer **ActivityTypeId** is representing type of tile in customer jorney designer while inner **ActivityTypeId** is refering to reocrds in most of the places.

```json
[
    {
        "ActivityTypeId": "bpf_root",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "bpf_root",
                    "Title": "Undefined",
                    "Name": "New ActivityTypeName_bpf_root_TitleText",
                    "ActivityItemId": 0
                },
                {
                    "ItemId": null,
                    "ActivityTypeId": "bpf_root",
                    "Title": "Undefined",
                    "Name": "New ActivityTypeName_bpf_root_TitleText",
                    "ActivityItemId": 1
                }
            ]
        }
    },
    {
        "ActivityTypeId": "Segment",
        "ParentActivityId": "01",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "Segment",
                    "Title": "Undefined",
                    "Name": "my customers",
                    "ActivityItemId": 8,
                    "SegmentMergeMethod": "Union",
                    "ContainmentMethod": "Inclusion",
                    "Description": ""
                },
                {
                    "ItemId": null,
                    "ActivityTypeId": "SegmentItem",
                    "Title": "Undefined",
                    "Name": "New Segment",
                    "ActivityItemId": 9,
                    "ContainmentMethod": "Inclusion",
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "Email",
        "ParentActivityId": "01_2",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2_4",
        "Properties": {
            "Items": [
                {
                    "ItemId": "08634d0e-25dc-e811-a965-000d3af2924b",
                    "ActivityTypeId": "Email",
                    "Title": "Undefined",
                    "Name": "invite email",
                    "ActivityItemId": 17,
                    "Description": ""
                },
                {
                    "ItemId": null,
                    "ActivityTypeId": "LandingPage",
                    "Title": "Undefined",
                    "Name": "event page",
                    "ActivityItemId": 28,
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "Trigger",
        "ParentActivityId": "01_2_4_14_19",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2_4_7",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "Trigger",
                    "Title": "Undefined",
                    "Name": "registered?",
                    "ActivityItemId": 38,
                    "TimeoutValue": 5,
                    "ConditionExpressions": [
                        {
                            "SourceActivityItemId": "28",
                            "Condition": "UserRegistered"
                        }
                    ],
                    "RuleLogic": "AND",
                    "TimeoutUnit": "Day",
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "empty",
        "ParentActivityId": "01_2_4_7",
        "ParentBranchId": 1,
        "ParentRelationshipType": "NoBranch",
        "ActivityId": "01_2_4_7_9",
        "Properties": {
            "Items": []
        }
    },
    {
        "ActivityTypeId": "CreateCrmActivity",
        "ParentActivityId": "01_2_4_7",
        "ParentBranchId": 0,
        "ParentRelationshipType": "YesBranch",
        "ActivityId": "01_2_4_7_11",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "CreateCrmActivity",
                    "Title": "Undefined",
                    "Name": "follow up call",
                    "ActivityItemId": 50,
                    "TemplateEntityLogicalName": "msdyncrm_phonecallactivitymarketingtemplate",
                    "ActivityTypeName": "phonecall",
                    "Owner": "msdyncrm_customerjourney.ownerid",
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "Email",
        "ParentActivityId": "01_2_4_7_11_32",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2_4_7_11_26_30",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "Email",
                    "Title": "Undefined",
                    "Name": "thank you",
                    "ActivityItemId": 80,
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "Scheduler",
        "ParentActivityId": "01_2_4_7_11",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2_4_7_11_32",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "Scheduler",
                    "Title": "Undefined",
                    "Name": "New Scheduler",
                    "ActivityItemId": 98,
                    "WaitUntilMonday": true,
                    "WaitUntilTuesday": true,
                    "WaitUntilWednesday": true,
                    "WaitUntilThursday": true,
                    "WaitUntilFriday": true,
                    "WaitUntilSaturday": true,
                    "WaitUntilSunday": true,
                    "WaitUntilFromHour": 0,
                    "WaitUntilFromMinute": 0,
                    "WaitUntilToHour": 23,
                    "WaitUntilToMinute": 59,
                    "OffsetType": "Duration",
                    "ScheduledDurationUnit": "Minute",
                    "ScheduledHour": 0,
                    "ScheduledMinute": 0,
                    "ScheduledDurationValue": 0,
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "Event",
        "ParentActivityId": "01_2_4",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2_4_14",
        "Properties": {
            "Items": [
                {
                    "ItemId": "306c65eb-18dc-e811-a96a-000d3af29d99",
                    "ActivityTypeId": "Event",
                    "Title": "Undefined",
                    "IsNameSystemDefined": true,
                    "Name": "New Event",
                    "ActivityItemId": 65,
                    "Description": ""
                }
            ]
        },
        "EntityTarget": "contact"
    },
    {
        "ActivityTypeId": "Event",
        "ParentActivityId": "01_2_4_14",
        "ParentBranchId": 0,
        "ParentRelationshipType": "Default",
        "ActivityId": "01_2_4_14_19",
        "Properties": {
            "Items": [
                {
                    "ItemId": null,
                    "ActivityTypeId": "Event",
                    "Title": "Undefined",
                    "IsNameSystemDefined": true,
                    "Name": "New Event",
                    "ActivityItemId": 91
                }
            ]
        },
        "EntityTarget": "contact"
    }
]
```

Hope it helps.