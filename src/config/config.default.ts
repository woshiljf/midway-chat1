import { EggAppConfig, PowerPartial } from 'egg';
import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export type DefaultConfig = PowerPartial<EggAppConfig>;

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
