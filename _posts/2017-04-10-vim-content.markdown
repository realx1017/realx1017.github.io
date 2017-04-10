---
layout: post
title: VIM 분활
date:   2017-04-10 16:10:01 -0500
comments: true
categories: jekyll
---

Reference : my brain


---
vi 사용 시 다른 파일에 있는 내용을 복사& 붙여넣기 할 때가 있는데 vim 창을 2개 띄울 필요 없이 하는 방법이다

EX)

vim [filename] <- 해서 우선 파일 한개를 열고 
:sp 
로 화면 분할을 한다. 그 후에
:e ./
로 vi에서 탐색기를 연 후 새로운 파일을 찾아서 이동하면 된다.

---


