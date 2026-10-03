# 新就业形态灵活就业人员权益助手（互助墙数据库版）

本版本在原网站模板基础上增加了“互助墙”功能，并提供 Spring Boot + MySQL 后端。

## 已实现
- 用户注册、登录、退出
- 互助墙帖子发布
- 匿名发布
- 分类、搜索
- 帖子详情
- 回复
- 点赞（同一用户同一帖子只能有一个赞，可再次点击取消）
- 删除自己的帖子
- 举报
- MySQL 持久化
- Spring Session 默认的 HttpSession 登录状态

## 运行环境
- JDK 17+
- Maven 3.9+
- MySQL 8+

## 第一次运行
1. 安装 MySQL，并确保服务已启动。
2. 执行 `sql/create_database.sql`，创建 `rights_helper` 数据库。
3. 打开 `src/main/resources/application.properties`，修改数据库用户名和密码。
4. 在项目根目录执行：`mvn spring-boot:run`
5. 浏览器访问：`http://localhost:8080/`
6. 点击“互助墙”，注册账号后即可发布和互动。

## 默认数据库配置
用户名：root
密码：123456
如不一致，请修改 application.properties，或使用环境变量 DB_URL / DB_USER / DB_PASSWORD。

## 数据库表
程序第一次启动后会自动创建/更新：
- users
- posts
- comments
- post_likes

## 重要说明
互助墙中的用户内容是经验交流，不应直接视为官方法律结论。涉及具体权益和办理渠道的内容，应结合当地最新官方信息核验。

正式部署到公网前，还应增加验证码、敏感信息过滤、频率限制、管理员审核后台、HTTPS、密码策略和更严格的权限控制。
