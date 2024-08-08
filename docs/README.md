# Microsoft Graph API

There are some notes on using the [Microsoft Graph API](https://developer.microsoft.com/en-us/graph).

The responses are taken from the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer).

## Get my email

`GET https://graph.microsoft.com/v1.0/me/messages`

* Code

```javascript
const options = {
	authProvider,
};

const client = Client.init(options);

let messages = await client.api('/me/messages')
	.get();
```

* [Response Sample](./samples/get-my-mail.json)
 
* Format

```json
{
  "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users('48d31887-5fad-4d73-a9f5-3c356e68a038')/messages",
  "value": [
    {
      "@odata.etag": "W/\"CQAAABYAAAAiIsqMbYjsT5e/T7KzowPTAAYlZAgh\"",
      "id": "AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e-T7KzowPTAAAAAAEMAAAiIsqMbYjsT5e-T7KzowPTAAYm5j05AAA=",
      "createdDateTime": "2024-02-19T15:23:47Z",
      "lastModifiedDateTime": "2024-02-19T15:28:48Z",
      "changeKey": "CQAAABYAAAAiIsqMbYjsT5e/T7KzowPTAAYlZAgh",
      "categories": [],
      "receivedDateTime": "2024-02-19T15:23:47Z",
      "sentDateTime": "2024-02-19T15:23:47Z",
      "hasAttachments": false,
      "internetMessageId": "<MW4PR15MB45564EE1D8F5385CBEB4F1B6CD512@MW4PR15MB4556.namprd15.prod.outlook.com>",
      "subject": "Your digest email",
      "bodyPreview": "Private to you\r\n\r\n\r\n\r\nHi, Megan Bowen,\r\nDiscover trends in your work habits\r\nAn in-depth look at your work patterns in the last four weeks\r\n\r\n\r\nExplore your insights\r\n\r\n\r\n28 days without quiet hours interruptions\r\nDays with no significant collaboration ou",
      "importance": "normal",
      "parentFolderId": "AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OAAuAAAAAAAiQ8W967B7TKBjgx9rVEURAQAiIsqMbYjsT5e-T7KzowPTAAAAAAEMAAA=",
      "conversationId": "AAQkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OAAQAJJARr80PdlOudJDHUFrS7A=",
      "conversationIndex": "AQHaY0eikkBGvzQ92U650kMdQWtLsA==",
      "isDeliveryReceiptRequested": false,
      "isReadReceiptRequested": false,
      "isRead": false,
      "isDraft": false,
      "webLink": "https://outlook.office365.com/owa/?ItemID=AAMkAGVmMDEzMTM4LTZmYWUtNDdkNC1hMDZiLTU1OGY5OTZhYmY4OABGAAAAAAAiQ8W967B7TKBjgx9rVEURBwAiIsqMbYjsT5e%2FT7KzowPTAAAAAAEMAAAiIsqMbYjsT5e%2FT7KzowPTAAYm5j05AAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
      "inferenceClassification": "focused",
      "body": {
        "contentType": "html",
        "content": "<html lang=\"en\"><head>...</head><body>...</body></html>"
      },
      "sender": {
        "emailAddress": {
          "name": "Microsoft Viva",
          "address": "viva-noreply@microsoft.com"
        }
      },
      "from": {
        "emailAddress": {
          "name": "Microsoft Viva",
          "address": "viva-noreply@microsoft.com"
        }
      },
      "toRecipients": [
        {
          "emailAddress": {
            "name": "Megan Bowen",
            "address": "MeganB@M365x214355.onmicrosoft.com"
          }
        }
      ],
      "ccRecipients": [],
      "bccRecipients": [],
      "replyTo": [],
      "flag": {
        "flagStatus": "notFlagged"
      }
    }
  ]
}
```

## Reources

* [Build TypeScript apps with Microsoft Graph](https://learn.microsoft.com/en-us/graph/tutorials/typescript?tabs=aad)
* [MSAL.js + Vue 3 + TypeScript Sample](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-browser-samples/vue3-sample-app)
* [A Guide to MSAL 3.0 Authentication in Vue 3](https://medium.com/@kuntumallashivani/a-guide-to-msal-3-0-authentication-in-vue-3-8c364cc26f53)
