## Anonymous-vote

基于`Node.js`的匿名实时投票系统。

需要自行分配登录`token`。

### Install

在根目录下添加`config.json`，内容格式如下：
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

`token`是用来控制访问【开始投票】页面以及页面中部分请求的参数。