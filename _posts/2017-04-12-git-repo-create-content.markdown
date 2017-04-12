---
layout: post
title: GIT Repo 생성법
date:   2017-04-12 18:10:01 -0500
comments: true
categories: jekyll
---

Reference : my brain & internet


---

**Git Repo Create <- remote repo 에서 작업 해야 할 것들**
#. mkdir /root/repo.git
#. git --bare init
#. cd /tmp
#. git clone root/repo.git
#. touch file
#. git add file
#. git commit -m 'comment'
#. git push origin master


---
**clone 받을 컴퓨터에서 작업해야 할 것들**
#. git clone ssh://ip:[port]/[path]

---
**git remote add 추가 작업**

---

