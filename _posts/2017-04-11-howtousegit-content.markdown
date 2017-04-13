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
