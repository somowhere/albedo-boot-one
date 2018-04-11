# AlbedoBoot 企业信息化快速开发平台

## 平台简介

AlbedoBoot是基于多个优秀的开源项目(jhipster)，高度整合封装而成的高效，高性能，强安全性的**开源**Java EE快速开发平台。

AlbedoBoot是您快速完成项目的最佳基础平台解决方案，AlbedoBoot是您想学习Java平台的最佳学习案例，AlbedoBoot还是接私活的最佳助手。

AlbedoBoot是在Spring Boot基础上搭建的一个Java基础开发平台，以Spring MVC为模型视图控制器，MyBatis为数据访问层，
SpringSecurity为权限授权层，Redis对常用数据进行缓存，是JavaEE界的最佳整合。

AlbedoBoot主要定位于企业信息化领域，已内置企业信息化系统的基础功能和高效的**代码生成**工具，
包括：系统权限组件、数据权限组件、数据字典组件、核心工具组件、视图操作组件、代码生成等。
前端界面风格采用了结构简单、性能优良、页面美观大气的METRONIC框架。
采用分层设计、双重验证、提交数据安全编码、密码加密、访问验证、数据权限验证。
使用Maven做项目管理，提高项目的易开发性、扩展性。

AlbedoBoot目前包括以下两大模块，系统管理（SYS）模块、**系统管理模块** ，包括企业组织架构（用户管理、机构管理、区域管理）、
菜单管理、角色权限管理、字典管理，系统监控，回话管理，接口管理等功能； **代码生成模块** ，完成重复的工作。

AlbedoBoot 提供了常用工具进行封装，包括日志工具、缓存工具、服务器端验证、数据字典、当前组织机构数据
（用户、机构、区域）以及其它常用小工具等。另外还提供一个强大的在线 **代码生成** 工具，
此工具提供简单的单表、树结构功能的生成，如果对外观要求不是很高，生成的功能就可以用了。

当前版本为hibernate   mybatis版本请切换到主分支 master

## 目录结构

    AlbedoBoot:
          ├─albedo-boot-api `(服务基础依赖模块)`
          │  ├─albedo-boot-service (数据服务基础)
          │  ├─albedo-boot-service-hibernate (hibernate版数据服务)
          │  └─albedo-boot-service-mybatis (mybatis版数据服务)
          ├─albedo-boot-common   `(公共基础)`
          ├─albedo-boot-modules  `(启动模块)`
          │  ├─albedo-boot-cloud-gateway (cloud网关)
          │  ├─albedo-boot-cloud-micro (cloud服务)
          │  └─albedo-boot-web-start (单体应用)
          ├─albedo-boot-plugins  `(插件模块)`
          │  ├─albedo-boot-data-hibernate (hibernate基础模块)
          │  ├─albedo-boot-data-mybatis (mybatis基础模块)
          │  ├─albedo-boot-quartz (定时任务模块)
          │  └─albedo-boot-swagger (swagger文档模块)
          ├─albedo-boot-web    `(web)`
          │  ├─albedo-boot-web-base (服务数据配置)
          │  ├─albedo-boot-web-config (hibernate模块)
          │  │  ├─albedo-boot-web-config-cloud (cloud基础配置)
          │  │  ├─albedo-boot-web-config-common (基础配置)
          │  │  ├─albedo-boot-web-config-geteway (geteway配置)
          │  │  ├─albedo-boot-web-config-micro (micro配置)
          │  │  └─albedo-boot-web-config-single (单体配置)
          │  ├─albedo-boot-web-resource (web resource)
          │  └─albedo-boot-web-resource-base (web resource 基础 cloud 版依赖) 
          └─albedo-boot-ui-angular `(基于angular js 5 的前端实现, 使用metronic脚手架:4201)`
              ├─build (项目构建配置)
              ├─src
              │  ├─main
              │  │  ├─webapp
              │  │  │  ├─app  (ts文件)
              │  │  │  │  ├─auth  (权限)
              │  │  │  │  ├─directives  (metronic组件)
              │  │  │  │  ├─intercepter  (拦截器)
              │  │  │  │  ├─shared  (基础公用)
              │  │  │  │  ├─theme  (页面)
              │  │  │  ├─assets (静态资源)
              └─────environments (环境)



## 内置功能

1.	用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.	机构管理：配置系统组织机构（公司、部门、小组），树结构展现，可随意调整上下级。
3.	区域管理：系统城市区域模型，如：国家、省市、地市、区县的维护。
4.	模块管理：配置系统菜单，操作权限，按钮权限标识等。
5.	角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.	字典管理：对系统中经常使用的一些较为固定的数据进行维护，如：是否、男女、类别、级别等。
7.	操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
8.	系统监控：监视当期系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。
9.	回话管理：管理登录用户。
9.	接口管理：基于swagger实现的在线接口文档。


## 为何选择AlbedoBoot

1. 使用 [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0) 协议，源代码完全开源，无商业限制。
2. 使用目前主流的Java EE开发框架，简单易学，学习成本低。
3. 数据库无限制，目前支持MySql、Oracle，可扩充SQL Server、PostgreSQL、H2等。
4. 模块化设计，层次结构清晰。内置一系列企业信息管理的基础功能。
5. 操作权限控制精密细致，对所有管理链接都进行权限验证，可控制到按钮。
6. 数据权限控制精密细致，对指定数据集权限进行过滤，七种数据权限可供选择。
7. 提供在线功能代码生成工具，提高开发效率及质量。
8. 提供常用工具类封装，日志、缓存、验证、字典、组织机构等，常用标签（taglib），获取当前组织机构、字典等数据。
9. 兼容目前最流行浏览器（IE9+、Chrome、Firefox）。

## 技术选型

* 核心框架：Spring Boot 1.5.7.RELEASE 
* 安全框架：spring-security-data spring-boot-starter-security jwt
* web框架：spring-boot-starter-web
* 服务端验证：Hibernate Validator 5.2
* 任务调度：quartz 2.2.3
* 持久层框架：MyBatis 3.4.4
* 数据库连接池：HikariCP 2.5.1
* 缓存框架：Ehcache 2.6、Redis
* 日志管理：Logback
* 工具类：Apache Commons、Jackson 2.2、Xstream 1.4、Dozer 5.3、POI 3.9
* 前端模版框架： AngularJS5.0 metronic_v5 <http://keenthemes.com/metronic/>

## 开发平台

* 开发环境：Java、Intellij IDEA/Eclipse 、Maven 3.1、Git
* 数据库支持：目前仅提供MySql和Oracle数据库的支持，但不限于数据库，平台留有其它数据库支持接口，
你可以很方便的更改为其它数据库，如：SqlServer 2008、MySql 5.5、H2等

## 安全考虑

1. 开发语言：系统采用Java 语言开发，具有卓越的通用性、高效性、平台移植性和安全性。
2. 分层设计：（数据库层，数据访问层，业务逻辑层，展示层）层次清楚，低耦合，各层必须通过接口才能接入并进行参数校验（如：在展示层不可直接操作数据库），保证数据操作的安全。
3. 双重验证：用户表单提交双验证：包括服务器端验证及客户端验证，防止用户通过浏览器恶意修改（如不可写文本域、隐藏变量篡改、上传非法文件等），跳过客户端验证操作数据库。
4. 安全编码：用户表单提交所有数据，在服务器端都进行安全编码，防止用户提交非法脚本及SQL注入获取敏感数据等，确保数据安全。
5. 密码加密：登录用户密码进行BCryptPasswordEncoder加密，此加密方法是不可逆的。保证密文泄露后的安全问题。
6. 强制访问：系统对所有管理端链接都进行用户身份权限验证，防止用户直接填写url进行访问。

## 系统预览

![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304093241.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304093301.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304095527.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304095602.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304095617.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304095632.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304095646.png)
![img](https://raw.githubusercontent.com/somewhereMrli/resources/master/QQ%E5%9B%BE%E7%89%8720180304095705.png)


## 快速搭建

#### 为了能够快速搭建请首先加入maven的阿里云镜像
```
<mirror>
        <id>nexus-aliyun</id>
        <mirrorOf>central</mirrorOf>
        <name>Nexus aliyun</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public</url>
</mirror>
```

1. 具备运行环境：JDK1.8、Maven3.0+、MySql5+或Oracle10g+。
2. 导入ide前，安装lombok插件
3. 运行albedo-new.sql脚本初始化数据库,修改albedo-boot-web-starter src\main\resources\config\application-dev.yml文件中的数据库设置参数。
4. 在albedo-boot目录下执行mvn clean install (albedo-boot-ui-angular 首次执行，较慢，建议设置npm的[淘宝镜像](https://somewheremrli.github.io/2018/02/27/npm%E6%B7%98%E5%AE%9D%E9%95%9C%E5%83%8F%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95/),如果执行失败，请在albedo-boot-ui-angular 下手动执行 npm install)
5. 启动redis 127.0.0.1 6379 
5. 最高管理员账号，用户名：admin 密码：111111 


## 启动篇

### 1.1.0 SNAPSHOT 发布了! :tada::tada::tada:

引入 angularjs5 ，基于 METRONIC [模版](https://github.com/somewhereMrli/metronic.git) 快速启动(依赖nodejs环境，更新至最新版)

### 调试模式
1.  进入 albedo-boot-ui-angular 目录 运行 npm install , 可根据需要修改 proxy.conf.json 配置转发
2.  启动albedo-boot-web/albedo-boot-web-starter AlbedoBootWebApp
3.  启动 npm start 访问 http://localhost:4201

### 单体应用 启动
 1.	启动redis 默认本地 127.0.0.1:6379
 2.	mvn clean install 启动albedo-boot-web/albedo-boot-web-starter AlbedoBootWebApp

### spring cloud  

cloud版本发布，基于[jhipster-registry](https://github.com/somewhereMrli/jhipster-registry)为注册中心。 同时也可以docker环境搭建，基于docker-compose启动，配置文件位于albedo-boot-cloud/docker/jhipster-registy.yml
1.	启动cloud前请升级数据库，重新执行albedo-new.sql
2.	本地启动 [jhipster-registry](https://github.com/somewhereMrli/jhipster-registry) 或者 使用docker-compose命令启动albedo-boot-cloud/docker/jhipster-registry.yml
3.	启动albedo-boot-cloud/albedo-boot-cloud-micro AlbedoBootCloudMicro
4.	修改 app.constants.ts  GATEWAY_MODEL 为true 开启网关模式 修改后 重新编译 npm run build
5.	启动albedo-boot-cloud/albedo-boot-cloud-gateway AlbedoBootCloudGateway


## 常见问题
1. 用一段时间提示内存溢出，请修改JVM参数：-Xmx512m -XX:MaxPermSize=256m
2. 如果坚持使用非angularjs版本，请移步 [albedo-boot-freemaker](https://github.com/somewhereMrli/albedo-boot-freemaker)

## 如何交流、反馈、参与贡献？

* GitHub：<https://github.com/somewhereMrli/albedo-boot>
* AlbedoBoot-QQ交流群：685728393

一个人的个人能力再强，也无法战胜一个团队，希望兄弟姐妹的支持，能够贡献出自己的部分代码，参与进来共同完善它(^_^)。

怎么共享我的代码：[手把手教你如何加入到github的开源世界！](http://www.cnblogs.com/wenber/p/3630921.html)


## 版权声明

本软件使用 [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0) 协议，请严格遵照协议内容：

1. 需要给代码的用户一份Apache Licence。
2. 如果你修改了代码，需要在被修改的文件中说明。
3. **在延伸的代码中（修改和有源代码衍生的代码中）需要带有原来代码中的协议，商标，专利声明和其他原来作者规定需要包含的说明。**
4. 如果再发布的产品中包含一个Notice文件，则在Notice文件中需要带有Apache Licence。你可以在Notice中增加自己的许可，但不可以表现为对Apache Licence构成更改。
5. Apache Licence也是对商业应用友好的许可。使用者也可以在需要的时候修改代码来满足需要并作为开源或商业产品发布/销售
6. 你可以二次包装出售，**但还请保留文件中的版权和作者信息**，并在你的产品说明中注明AlbedoBoot。
7. 你可以以任何方式获得，你可以修改包名或类名，**但还请保留文件中的版权和作者信息**。
