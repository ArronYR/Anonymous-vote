## Anonymous-vote

基于`Node.js`的匿名实时投票系统。

需要自行分配登录`token`。

### Install

需要安装`Node.js`和`npm`。

```cmd
$ git clone https://github.com/ArronYR/Anonymous-vote

$ cd myapp
$ npm install
```

在根目录下添加`config.json`，内容格式如下：
```json
{
    "db": {
        "host": "127.0.0.1",
        "user": "user",
        "password": "password",
        "port": 3306,
        "database": "node_vote"
    },
    "token": "ae0fdb6f2512df5fcf712da4ed7b5daf"
}
```

`token`是用来控制访问【开始投票】页面以及页面中部分请求的参数。

### 启动

`MacOS` 或 `Linux` 系统, 运行以下命令启动程序:
```cmd
$ DEBUG=vote:* npm start
```

`Windows` 上执行以下命令启动：
```cmd
set DEBUG=vote:* & npm start
```

更多的命令参数参考 [express-generator](http://expressjs.com/en/starter/generator.html)


### 部署

采用 [pm2](http://pm2.keymetrics.io/) 能够很方便的完成部署。
```cmd
$ npm install pm2 -g
```

第一次启动的时候，在项目根目录下执行：
```cmd
$ pm2 start bin\www --name vote 
```
之后如果要关闭执行：
```cmd
$ pm2 stop vote
```
此后启动都只需执行：
```cmd
$ pm2 start vote
```
如果要使用 `Nginx` 配置域名，只需在 `Nginx` 的配置文件目录中添加一个文件，内容如下：
```nginx
server{
    listen          80;
    server_name     vote.domain.com;
    location / {
        proxy_redirect          off;
        proxy_set_header        Host    $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass              http://127.0.0.1:1607;
    }

    location ~ /socket.io {
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_pass              http://127.0.0.1:1607;
        proxy_http_version      1.1;
        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection "upgrade";
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout      150;
        access_log              off;
    }
}
```