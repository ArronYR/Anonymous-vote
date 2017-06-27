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
