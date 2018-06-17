# Git with Command Line For Absolute Beginners

![Git-Banner](assets/Git-Banner.png)

Git is a distributed version control system, developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) in 2005 and currently maintained by [Junio C Hamano](https://github.com/gitster). There are many popular GUI tools and extensions are available to use git, but originally git was developed as command line tool, it is still fun to use git using command line, you will also understand under the hood magic done by GUI tools.

## Why Version Control ?

> Version Control Systems are used for Time Travel by ~~Astronaults~~ Developers.

![VCS Problem](assets/VCS-Problem.jpg)

If you ever had your project copies likes above image, definitely you need a Version Control System. Version Control Systems maintains version of files without creating multiple copies, you need to commit the changes to store versions, you can go travel back and forth in commit history and get your files at any desired point of time. Now you can relate why I used the word "Time Travel".

Git is not the only version control system, there are many, you can see a comparison in [Wikipedia](https://en.wikipedia.org/wiki/Comparison_of_version_control_software), There are many online services which provide git services, popular ones are [GitHub](https://github.com), [GitLab](https://about.gitlab.com), [BitBucket](https://bitbucket.org) & [Visual Studio Team Services](https://www.visualstudio.com/team-services/)(Yes, they do provide git, along with VSTS)

![Git-Services](assets/Git-Services.png)

But you don't actually need any one of them, to try out **Git**, because it is not just a Version Control System, it is a **Distributed Version Control System**, which plays major role for popularity of Git.

## Distributed Version Control System

As I mentioned above we don't need any git service to try out **Git**, but only until we don't want to collaborate with other developers. Unlike distributed version control system in centralized version control systems there will be one server, which will contain repository and if we need to commit any change we have to connect to server and make the commit. SVN was very popular version control system, in which repository used to be central and developers used to have only working copy.

In distribute version control systems each user will have own copy of complete repository, here I'm using 2 terms  "working copy" & "repository". Working copy refers to the current version of source code in a repository, which mostly will be the latest version of source code, but not necessarily. Repository contains all the history of source code, you can traverse to any commit without contacting sever.

![Distribute Version Control System](assets/DVCS.png)

As you can see in above image, 3 workstations are working on same project, and each one of them has their own repository, which talks to one remote repository located in some server. Here each developer can work independently and can commit the source code in their local repository, he needs to push the code in remote repository only when he wants to share the code with other collaborators of the project. Once code is pushed in remote repository other can pull this into their local repository.

> One point you need to notice here, that your Local Repository can have remote repository to push code in some server, but you can work locally as well without having any remote repository.

## Installing Git

Download appropriate version of git according to your platform from [https://git-scm.com/](https://git-scm.com/downloads) and install

If you are using Visual Studio 2017 or higher, you can open Visual Studio Installer and click Modify.

![VS-Installer](assets/VS-Installer.png)

Select "Git for Windows" in Individual components & modify to install git.

![Git-Component](assets/Git-Component.png)

### Verify indat

![git-installed](assets/git-installed.png)

![Git-Bash](assets/Git-Bash.png)


## Configuring Git

After installing git you have to set your name and email, which will appear in your commit logs.

### $ git config

We can set them using `git config` command.

#### Set Username

```
$ git config --global user.name "Ashish Vishwakarma"
```

