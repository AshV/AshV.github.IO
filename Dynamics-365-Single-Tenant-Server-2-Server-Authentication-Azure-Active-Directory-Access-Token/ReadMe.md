# Generate Access Token for Dynamics 365 Single Tenant Server to Server Authentication

![Generate Access Token for Dynamics 365 Single Tenant Server to Server Authentication](assets/microsoft-dynamics-365-banner.jpg)

In Dynamics 365 integration scenarios most of the times we need to authenticate only single tenant. Since now Dynamics 365 authentication only through Azure AD (for online instances) is recommended, for this we need to create App in Azure Active Directory and goog news is that you don't need Azure subcription to try this out, your Dynamics 365 free trial is enough.

To achieve this below 4 steps are involved

1. Create & configureApp in Azure Active Directory
2. Create User in Azure AD and Configure it as Applicatipon User in Dynamics 365
3. Write C# code with ADAL(Active Directory Authentication Library) to generate Access Token
4. Making requests to Dynamics 365 with above generated Access Token

## Section 1: Create Azure AD App

## Section 2: Create Application User

## Section 3: Get Access Token with ADAL

## Section 4: Consuming Access Token