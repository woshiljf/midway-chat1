# my-midway-project

## QuickStart

<!-- add docs here for user -->

see [midway docs][midway] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 解决跨域问题

在 config.default.ts 修改 sockitIO 的 origin 地址

```bash
export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1645933234648_4837',
    egg: {
      port: 7777,
    },
    socketIO: {
      cors: {
        origin: "http://localhost:1024",
        methods: ["GET", "POST"]
      }
    },
    // security: {
    //   csrf: false,
    // },
  } as MidwayConfig & DefaultConfig;
};


```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[midway]: https://midwayjs.org
