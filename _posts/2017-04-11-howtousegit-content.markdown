---
layout: post
title: GIT 간단 사용법
date:   2017-04-11 16:10:01 -0500
comments: true
categories: jekyll
---

Reference : my brain & internet


---
**git 사용 시 history 조회 및 변경 내용을 보고 싶을 때**

#. git add filename

#. git commit -m "comment"

#. git push origin branch name

#. git log -p -1 <- 가장 최근의 변경 내용 확인

#. git show commitid <- commit 로 파일의 변경 내용 확인
 
---

**git 복구하기**

![devops]({{http://realx1017.github.io}}/git_recovery.png)

---

git revert, reset을 통한 소스 복구 방법입니다.

복구하려는 2~3개 커밋 전이라면 revert를, 그보다 훨씬 전이라면 reset을 통해 복구하면됩니다.


**revert를 통한 복구**

복구 시점 이후에 커밋이 많지않거나 merge 커밋이 없는 경우에 사용.

실제로 사고 발생시 merge 커밋이 없는 경우가 거의 없기 때문에 잘 사용하진 않음.

1 git revert -n [커밋id]

2 git commit -m "커밋 메시지"

3 git push [target]

예) git revert -n a123

     git revert -n b456

     git revert -n c789

     git commit -m "Revert roll back"

     git push origin [branch]
---

**reset을 통한 복구**

복구 시점 이후에 커밋이 많을 경우에 사용.

소스가 잘못올라간것을 뒤늦게 발견한 경우에는 revert 보다 이게 훨씬 편하다.

단, 커밋 이력이 날아갈수 있기때문에 반드시 주의해서 사용해야함.

reset 후 다시 reset으로 최신으로 돌아오는 이유는 커밋 이력을 유지하기 위함이다.

1) git reset --hard [복구시점 커밋id]

2) .git 폴더를 제외한 모든 소스 백업

3) git reset --hard [마지막 커밋id]

4) 백업한 소스 덮어쓰기

5) git add .

6) git commit -m "Reset roll back"

7) git push origin [branch]


출처: http://donggov.tistory.com/29 [동고랩]

---
Git을 사용하다보면 수정한 내용을 되돌리고 싶을 경우가 간혹있다. GUI가 있는 Git 클라이언트의 경우엔 discard를 하면 되지만 command line interface에서는 어떻게 해야 할지 잘 모를때가 많다. 각 상황별로 수정 내역을 되돌리는 법을 알아보자.

**git add 명령을 하기 이전(stage에 올리지 않은 경우**

1.1 repository 내 모든 수정 되돌리기

     $ cd {repository_root_dir}

     $ git checkout .


1.2 특정 폴더 아래의 모든 수정 되돌리기

     $ git checkout {dir}

1.3 특정 파일의 수정 되돌리기

     $ git checkout {file_name}

2. git add 명령으로 stage에 올린 경우

     $ git reset

3. git commit을 한 경우

3.1 commit 내용을 없애고 이전 상태로 원복

master 브랜치의 마지막 커밋을 가리키던 HEAD를 그 이전으로 이동시켜서 commit 내용을 없앰

     $ git reset --hard HEAD^

3.2 commit은 취소하고 commit 했던 내용은 남기고 unstaged 상태로 만들기

     $ git reset HEAD^

3.3 commit은 취소하고 commit 했던 내용은 남기고 staged 상태로 만들기

     $ git reset --soft HEAD^

4 모든 untracked 파일들을 지우기

     $ git clean -fdx

5 git push를 한 경우 remote repository도 이전으로 되돌리기

     $ git reset HEAD^  #local repository에서 commit을 하나 되돌림. ^^는 2개 되돌림.

     $ git commit -m "..."  #되돌린 것으로 commit

     $ git push origin +master #remote repository를 강제로 revert

---

**실수를 복구하고 싶을 때**

     $ git reset --soft HEAD^ 

HEAD : 현재바라보는 directory

^ : 바로 전 ^^^ 하면 3번전

--soft : commit 내용이 staging으로 옮겨진다

즉 커밋은 취소되고 파일은 삭제되지 않고 stage로 넘어간다

B. commit에 추가내역을 넣고 싶을때

작업중 실수로 빠진 내역이나, 소소한 내역을 기존 commit에 추가할 때

     $ git commit --amend -m "something u say"

     --amend : 가장 최신의 commit에 내용 추가하기

C. git reset --hard HEAD^

     --hard : commit한 내용이 stage로 가는게 아니라 아예 삭제된다 


**(생각없이) 깔끔하게 복구하는 법**

1. 복구를 원하는 브랜치로 checkout

     $ git checkout <브랜치명>

2. git log로 원하는 commit의 좌표확인

     $ git log

3. 내가 원하는 commit값은 3번 뒤로 가야한다면?

     $ git reset --hard HEAD^^^ ( {^} 한개당 한번뒤로다)

4. 다시 git log로 commit 상태확인

5. git push origin --force 로 밀어넣기

6. 복구완료!

**특정 원하는 commit 하나만 삭제하고 싶을 때**

-- revert

git revert { Commit ID}

이 명령을 실행하면 Commit 명령을 실행했을 때와 마찬가지로 로그를 입력하는 에디터가 나타납니다.

Revert작업은 결과적으로 보면 대상 Commit의 작업내용과 정 반대되는 작업의 새로운 Commit을 작성하는 것과 같으며, 개발자가 삭제할 Commit의 수정 사항을 일일이 반대로 편집하여 다시 Commit하는 수고를 덜어주기 위한 일종의 Commit매크로와 같습니다.

각각의 Commit은 소스코드의 상태를 저장하고 있는 것이 아니라, 이전 Commit과 비교한 변경 사항에 대한 정보를 담고 있습니다. Commit에 대한 Patch를 떠서 그 파일 내부를 열어 보면 이게 무슨 말인지 잘 이해할 수 있습니다.

이와 같은 Commit의 특성이 Revert명령을 가능하게 하는 것입니다.

[출처] Git merge 되돌리기 , Push 되돌리기|작성자 까망이
