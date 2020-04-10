---
layout: post
title: "Quick Local WebServer with IIS Express"
date: 2020-04-11 00:18:01 +0530
categories: Web Development IIS Express
permalink: Quick-Local-WebServer-IIS-Express/
---

**TL;DR** Download [server.bat](../assets/2020-04-11/server.bat), place it in your folder, Run it and get going.

Web Development has changed drastically in recent years. These days even most of the front-end requires to be run from a web-server, and if like me you are not a full-time web developer, you may find a hard time setting up a local webserver.

Here's good news! Many frameworks and languages provide out of the box web-server which can be utilized for the task. I mainly code on Microsoft related technologies so IISExpress is already installed in my machine, which can be used as a local web-server using this command.

```
C:\> <path to iisexpress.exe> /path:<absolute path to folder> /port:<port to be used>
```

Suppose your IISExpress is installed at the default location, your front-end code is kept at C:\MyWeb and port to be used is 8000, then the command will look like this.

```
C:\> "C:\Program Files (x86)\IIS Express\iisexpress.exe" /path:C:\MyWeb /port:8000
```

To avoid typing this command every time I moved this to a batch file with a small tweak like below, where `%cd%` picks your current directory.

```
"C:\Program Files (x86)\IIS Express\iisexpress.exe" /path:%cd% /port:8000
```

You simply paste this batch file in your folder and get going. Executing this batch file will start a local webserver at the current folder with port 8000. Access your webpage at http://localhost:8000

![local-web-server](../assets/2020-04-11/local-web-server.png)

[Download server.bat batch file here.](../assets/2020-04-11/server.bat)

To find local webserver options for other languages & frameworks follow this awesome Github Gist. [Big list of HTTP static server one-liners](https://gist.github.com/willurd/5720255)
