---
layout: post
title: "Get Access Token for Google Service Account using C#"
date: 2017-10-11 00:18:01 +0530
categories: Dynamics-365 PowerApps
permalink: get-access-token-for-google-api-service-account-c-sharp/
---

Service Accounts are used for server to server communication so user don’t need to interact for Authentication.

## Section 1: Generate Keys for Google Service Account

If you haven’t generated keys yet follow steps to generate one or skip to next section

Go to [https://console.developers.google.com/permissions/serviceaccounts](https://console.developers.google.com/permissions/serviceaccounts)

![image alt text](assets/2017-10-11/image_0.png)

Select project for which you want service account.

![image alt text](assets/2017-10-11/image_1.png)

Create new service account here, roles and permission you can ad as per your use cases.

![image alt text](assets/2017-10-11/image_2.png)

Now beside your account name click options and then Create Key

![image alt text](assets/2017-10-11/image_3.png)

Select your desired format and hit Create

![image alt text](assets/2017-10-11/image_4.png)

I have generated both keys for demo

![image alt text](assets/2017-10-11/image_5.png)

## Section 2: Generate Access Tokens

I have taken Console Application here, Install Google.Apis.Auth NuGet package. It will add all required dependencies.

![image alt text](assets/2017-10-11/image_6.png)

Add key files to your project and set Copy to Output Directory as Copy Always or Copy if newer

![image alt text](assets/2017-10-11/image_7.png)

### Generate token form JSON key

Write below code where jsonKeyFilePath is path to your JSON key file, and scopes takes all the scopes you required in your access token.

```csharp
/// <summary>
/// Get Access Token From JSON Key Async
/// </summary>
/// <param name="jsonKeyFilePath">Path to your JSON Key file</param>
/// <param name="scopes">Scopes required in access token</param>
/// <returns>Access token as string Task</returns>
public static async Task<string> GetAccessTokenFromJSONKeyAsync(string jsonKeyFilePath, params string[] scopes)
{
    using (var stream = new FileStream(jsonKeyFilePath, FileMode.Open, FileAccess.Read))
    {
        return await GoogleCredential
            .FromStream(stream) // Loads key file
            .CreateScoped(scopes) // Gathers scopes requested
            .UnderlyingCredential // Gets the credentials
            .GetAccessTokenForRequestAsync(); // Gets the Access Token
    }
}
```

Above is an Asynchronous implementation, which can be optionally wrapped as Synchronous like given below.

```csharp
/// <summary>
/// Get Access Token From JSON Key
/// </summary>
/// <param name="jsonKeyFilePath">Path to your JSON Key file</param>
/// <param name="scopes">Scopes required in access token</param>
/// <returns>Access token as string</returns>
public static string GetAccessTokenFromJSONKey(string jsonKeyFilePath, params string[] scopes)
{
    return GetAccessTokenFromJSONKeyAsync(jsonKeyFilePath, scopes).Result;
}
```

Let’s test it, for my Google project I have enabled Google Plus API, so I am requesting given user’s profile here.

```csharp
public static void GetTokenAndCall()
{
    var token = GoogleServiceAccount.GetAccessTokenFromJSONKey(
     "Keys/C-SharpCorner-0338f58d564f.json",
     "https://www.googleapis.com/auth/userinfo.profile");
    WriteLine(new HttpClient().GetStringAsync($"https://www.googleapis.com/plus/v1/people/110259743757395873050?access_token={token}").Result);
}
```

And call it.

```csharp
static void Main(string[] args)
{
    // Testing with JSON key
    TestJSONKey.GetTokenAndCall();
}
```

You will get response like this

![image alt text](assets/2017-10-11/image_8.png)

### Generate token form P12 key

Write below code where p12KeyFilePath is path to your JSON key file, serviceAccountEmail you can get from Google Developer Console, keyPassword will be asked while generating key by default it is "notasecret" and scopes takes all the scopes you required in your access token.

```csharp
/// <summary>
/// Get Access Token From P12 Key Async
/// </summary>
/// <param name="p12KeyFilePath">Path to your P12 Key file</param>
/// <param name="serviceAccountEmail">Service Account Email</param>
/// <param name="keyPassword">Key Password</param>
/// <param name="scopes">Scopes required in access token</param>
/// <returns>Access token as string Task</returns>
public static async Task<string> GetAccessTokenFromP12KeyAsync(string p12KeyFilePath, string serviceAccountEmail, string keyPassword = "notasecret", params string[] scopes)
{
    return await new ServiceAccountCredential(
        new ServiceAccountCredential.Initializer(serviceAccountEmail)
        {
            Scopes = scopes
        }.FromCertificate(
            new X509Certificate2(
                p12KeyFilePath,
                keyPassword,
                X509KeyStorageFlags.Exportable))).GetAccessTokenForRequestAsync();
}
``` 

Above is an Asynchronous implementation, which can be optionally wrapped as Synchronous like given below.

```csharp
/// <summary>
/// Get Access Token From P12 Key
/// </summary>
/// <param name="p12KeyFilePath">Path to your P12 Key file</param>
/// <param name="serviceAccountEmail">Service Account Email</param>
/// <param name="keyPassword">Key Password</param>
/// <param name="scopes">Scopes required in access token</param>
/// <returns>Access token as string</returns>
public static string GetAccessTokenFromP12Key(string p12KeyFilePath, string serviceAccountEmail, string keyPassword, params string[] scopes)
{
    return GetAccessTokenFromP12KeyAsync(p12KeyFilePath, serviceAccountEmail, keyPassword, scopes).Result;
}
```

Let’s test it.

```csharp
public static void GetTokenAndCall()
{
    var token = GoogleServiceAccount.GetAccessTokenFromP12Key(
        "Keys/C-SharpCorner-e0883ada1a3f.p12",
        "an-account@c-sharpcorner-2d7ae.iam.gserviceaccount.com",
        "notasecret",
        "https://www.googleapis.com/auth/userinfo.profile"
        );
    WriteLine(new HttpClient().GetStringAsync($"https://www.googleapis.com/plus/v1/people/110259743757395873050?access_token={token}").Result);
}
```

And call it.

```csharp
static void Main(string[] args)
{
    // Testing with P12 key
   TestP12Key.GetTokenAndCall();
}
```

You will get response like this

![image alt text](assets/2017-10-11/image_9.png)

You can change the scopes and use access token according to your need, before making API call make sure to enable the same in Google Developer Console for given project.

[Check GitHub repo for Complete Code](https://github.com/AshV/GoogleServiceAccountAccessToken-CSharp)