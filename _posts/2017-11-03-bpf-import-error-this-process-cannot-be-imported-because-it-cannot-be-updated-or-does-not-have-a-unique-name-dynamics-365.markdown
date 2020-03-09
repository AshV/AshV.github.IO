---
layout: post
title: "Business Process Flow Import Error"
date: 2017-11-03 00:12:01 +0530
categories: Dynamics-365 PowerApps
permalink: bpf-import-error-this-process-cannot-be-imported-because-it-cannot-be-updated-or-does-not-have-a-unique-name-dynamics-365
---

## This process cannot be imported because it cannot be updated or does not have a unique name

>[All Posts](https://www.ashishvishwakarma.com/posts/)

Have you ever faced this error while importing Dynamics 365 solution containing Business Process Flow

![Import Solution Error](assets/2017-11-03/Import_Solution_Error.png)

This occurs because BPF implementation is different in Dynamics 365(version 8.2) than previous, you can read more here [https://support.microsoft.com/en-in/help/4020021/after-updating-to-dynamics-365-mismatched-business-process-flow-entity](https://support.microsoft.com/en-in/help/4020021/after-updating-to-dynamics-365-mismatched-business-process-flow-entity)

### Solution:

For each BPF, entity will also be generated with same Display Name. Name of entity will be like < Publisher >__ BPF __ < ProcessId >. **You need to include that entity into your solution** and It will be imported successfully.

This resolution is already mentioned in log file of Import solution, you can Download Log File and can see there.

Hope it is helpful.

>[All Posts](https://www.ashishvishwakarma.com/posts/)
