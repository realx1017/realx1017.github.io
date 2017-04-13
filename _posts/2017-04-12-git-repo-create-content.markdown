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

만약 기존에 있던 원격 저장소를 복제한 것이 아니라면,

원격 서버의 주소를 git에게 알려줘야 해요.

git remote add origin <원격 서버 주소>

이제 변경 내용을 원격 서버로 발행할 수 있어요.
---

** git merge**
갱신과 병합(merge)

여러분의 로컬 저장소를 원격 저장소에 맞춰 갱신하려면

아래 명령을 실행하세요.

     $ git pull

이렇게 하면 원격 저장소의 변경 내용이 로컬 작업 디렉토리에

받아지고(fetch), 병합(merge)된답니다.

다른 가지에 있는 변경 내용을 현재 가지(예를 들면, master 가지)에

병합하려면 아래 명령을 실행하세요.

     $ git merge <가지 이름>

첫번째 명령이든 두번째 명령이든, git은

자동으로 변경 내용을 병합하려고 시도해요.

문제는, 항상 성공하는 게 아니라 가끔

충돌(conflicts)이 일어나기도 한다는 거예요.

이렇게 충돌이 발생하면, git이 알려주는 파일의 충돌 부분을

여러분이 직접 수정해서 병합이 가능하도록 해야 하죠.

충돌을 해결했다면, 아래 명령으로 git에게

아까의 파일을 병합하라고 알려주세요.

     $ git add <파일 이름>

변경 내용을 병합하기 전에, 어떻게 바뀌었는지 비교해볼 수도 있어요.

     $git diff <원래 가지> <비교 대상 가지>

