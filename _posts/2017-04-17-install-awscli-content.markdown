---
layout: post
title: How to install aws cli tool
date:   2017-04-13 18:10:01 -0500
comments: true
categories: jekyll
---

Reference : my brain & internet


---
	[root@cjyland ~]# yum -y install pip
	Loaded plugins: fastestmirror, langpacks
	Repodata is over 2 weeks old. Install yum-cron? Or run: yum makecache fast
	base                                                     | 3.6 kB     00:00
	cloudstack                                               | 3.2 kB     00:00
	dockerrepo                                               | 2.9 kB     00:00
	epel/x86_64/metalink                                     | 5.8 kB     00:00
	epel                                                     | 4.3 kB     00:00
	extras                                                   | 3.4 kB     00:00
	google-chrome                                            |  951 B     00:00
	openstack-newton                                         | 2.9 kB     00:00
	rdo-qemu-ev                                              | 2.9 kB     00:00
	updates                                                  | 3.4 kB     00:00
	(1/8): epel/x86_64/updateinfo                              | 782 kB   00:00
	(2/8): extras/7/x86_64/primary_db                          | 139 kB   00:00
	(3/8): epel/x86_64/primary_db                              | 4.7 MB   00:00
	(4/8): dockerrepo/primary_db                               |  33 kB   00:00
	(5/8): updates/7/x86_64/primary_db                         | 4.7 MB   00:00
	(6/8): cloudstack/7/primary_db                             |  17 kB   00:01
	(7/8): rdo-qemu-ev/x86_64/primary_db                       |  55 kB   00:01
	(8/8): openstack-newton/x86_64/primary_db                  | 853 kB   00:05
	google-chrome/primary                                      | 2.0 kB   00:00
	Determining fastest mirrors
	 * base: data.nicehosting.co.kr
	  * epel: mirror.premi.st
	   * extras: data.nicehosting.co.kr
	    * updates: data.nicehosting.co.kr
	    google-chrome                                                               3/3
	    No package pip available.
	    Error: Nothing to do
	    [root@cjyland ~]# yum -y install python-pip
	    Loaded plugins: fastestmirror, langpacks
	    Loading mirror speeds from cached hostfile
	     * base: data.nicehosting.co.kr
	      * epel: mirror.premi.st
	       * extras: data.nicehosting.co.kr
	        * updates: data.nicehosting.co.kr
		Package python-pip is obsoleted by python2-pip, trying to install python2-pip-8.1.2-5.el7.noarch instead
		Resolving Dependencies
		--> Running transaction check
		---> Package python2-pip.noarch 0:8.1.2-5.el7 will be installed
		--> Finished Dependency Resolution
	
		Dependencies Resolved
	
		================================================================================
		 Package              Arch            Version               Repository     Size
		 ================================================================================
		 Installing:
		  python2-pip          noarch          8.1.2-5.el7           epel          1.7 M
	
		  Transaction Summary
		  ================================================================================
		  Install  1 Package
	
		  Total download size: 1.7 M
		  Installed size: 7.2 M
		  Downloading packages:
		  python2-pip-8.1.2-5.el7.noarch.rpm                         | 1.7 MB   00:00
		  Running transaction check
		  Running transaction test
		  Transaction test succeeded
		  Running transaction
		    Installing : python2-pip-8.1.2-5.el7.noarch                               1/1
		      Verifying  : python2-pip-8.1.2-5.el7.noarch                               1/1
	
		      Installed:
		        python2-pip.noarch 0:8.1.2-5.el7
	
			Complete!
			[root@cjyland ~]# pip install awscli
			Collecting awscli
			  Downloading awscli-1.11.76-py2.py3-none-any.whl (1.2MB)
			      100% |████████████████████████████████| 1.2MB 1.0MB/s
			      Collecting botocore==1.5.39 (from awscli)
			        Downloading botocore-1.5.39-py2.py3-none-any.whl (3.4MB)
				    100% |████████████████████████████████| 3.4MB 374kB/s
				    Requirement already satisfied (use --upgrade to upgrade): rsa<=3.5.0,>=3.1.2 in /usr/lib/python2.7/site-packages (from awscli)
				    Collecting s3transfer<0.2.0,>=0.1.9 (from awscli)
				      Downloading s3transfer-0.1.10-py2.py3-none-any.whl (54kB)
				          100% |████████████████████████████████| 61kB 11.3MB/s
					  Requirement already satisfied (use --upgrade to upgrade): docutils>=0.10 in /usr/lib/python2.7/site-packages (from awscli)
					  Collecting colorama<=0.3.7,>=0.2.5 (from awscli)
					    Downloading colorama-0.3.7-py2.py3-none-any.whl
					    Requirement already satisfied (use --upgrade to upgrade): PyYAML<=3.12,>=3.10 in /usr/lib64/python2.7/site-packages (from awscli)
					    Requirement already satisfied (use --upgrade to upgrade): python-dateutil<3.0.0,>=2.1 in /usr/lib/python2.7/site-packages (from botocore==1.5.39->awscli)
					    Collecting jmespath<1.0.0,>=0.7.1 (from botocore==1.5.39->awscli)
					      Downloading jmespath-0.9.2-py2.py3-none-any.whl
					      Requirement already satisfied (use --upgrade to upgrade): pyasn1>=0.1.3 in /usr/lib/python2.7/site-packages (from rsa<=3.5.0,>=3.1.2->awscli)
					      Requirement already satisfied (use --upgrade to upgrade): futures<4.0.0,>=2.2.0; python_version == "2.6" or python_version == "2.7" in /usr/lib/python2.7/site-packages (from s3transfer<0.2.0,>=0.1.9->awscli)
					      Requirement already satisfied (use --upgrade to upgrade): six>=1.5 in /usr/lib/python2.7/site-packages (from python-dateutil<3.0.0,>=2.1->botocore==1.5.39->awscli)
					      Installing collected packages: jmespath, botocore, s3transfer, colorama, awscli
					      Successfully installed awscli-1.11.76 botocore-1.5.39 colorama-0.3.7 jmespath-0.9.2 s3transfer-0.1.10
					      You are using pip version 8.1.2, however version 9.0.1 is available.
					      You should consider upgrading via the 'pip install --upgrade pip' command.
					      [root@cjyland ~]# aw
					      awk                   aws_bash_completer    aws_completer
					      aws                   aws.cmd               aws_zsh_completer.sh
					      [root@cjyland ~]# aw
					      awk                   aws_bash_completer    aws_completer
					      aws                   aws.cmd               aws_zsh_completer.sh
					      [root@cjyland ~]# aws
					      aws                   aws.cmd               aws_zsh_completer.sh
					      aws_bash_completer    aws_completer
	
---

