import {
  WSController,
  OnWSConnection,
  OnWSMessage,
  Inject,
} from '@midwayjs/decorator';
import { PrismaClient } from '@prisma/client';
import { Context } from '@midwayjs/socketio';
@WSController('/')
export class HelloSocketController {
  @Inject()
  ctx: Context;
  // @App()
  // app: Application;
  @OnWSConnection()
  async onConnectionMethod(socket) {
    console.log('有用户连接了', this.ctx.id);
  }

  // 接受用户发过来的登录消息
  @OnWSMessage('userConnect')
  async connectUserInfo(data, callback) {
    const prisma = new PrismaClient();

    // /**
    //  * 0. 从数据库查找是否有当前用户，没有就存储先。
    //  *
    //  * 1. 根据data，或者当前的登录用户信息，和私聊的朋友的信息。
    //  * 2. 从数据库查出私聊朋友的信息。包括他的最新的房间id。
    //  * 3. 从数据库查出两人的历史聊天记录。
    //  * 4. 并返回历史聊天记录和朋友的房间id。
    //  *
    //  */
    const { myInfo } = data;
    const res = await this.queryUserInfo(myInfo.user_id);
    if (!res) {
      const count = await prisma.testUser.createMany({
        data: [{ ...myInfo, room_id: this.ctx.id }],
        skipDuplicates: true,
      });
      console.log('插入了一条数据', count);
    } else {
      const count = await prisma.testUser.updateMany({
        where: {
          user_id: myInfo.user_id,
        },
        data: {
          room_id: this.ctx.id,
        },
      });
      console.log('更新了', count);
    }
  }

  @OnWSMessage('sendMessage')
  async sendMessage(data, callback) {
    /**
     * 1. 根据data 获取私聊信息。data包括当前的用户信息，私聊的用户信息，以及发送的内容。
     * 2. 保存到信息到数据库
     * 3. 转发到对应的朋友: this.ctx.to(friendRoomId).emit('output', data)
     *
     */
    const prisma = new PrismaClient();
    const { userInfo, myInfo } = data;
    const res1 = await this.queryUserInfo(userInfo.user_id);
    if (!res1) {
      const count = await prisma.testUser.createMany({
        data: [{ ...userInfo }],
        skipDuplicates: true,
      });
      console.log('插入朋友消息', count);
    }
    const res2 = await this.friendMessage(myInfo.user_id, userInfo.user_id);
    const res = res2.reverse();
    this.ctx.emit('output', res);
  }

  @OnWSMessage('privateMessage')
  async privateMessage(data, callback) {
    const prisma = new PrismaClient();
    const { message } = data;
    await prisma.friendMessages.create({
      data: {
        user_id: message.user_id,
        friend_id: message.friend_id,
        content: message.content,
        user_name: '2225243',
        friend_name: '235235',
      },
    });
    const res1 = await this.friendMessage(message.user_id, message.friend_id);
    const res2 = await this.queryUser(message.friend_id);
    const { room_id } = res2[0];
    const res = res1.reverse();
    this.ctx.emit('output', res);
    this.ctx.to(room_id).emit('output', res);
  }

  // 接受用户发过来的登录消息
  @OnWSMessage('userLogin')
  async userLogin(data, callback) {
    // const prisma = new PrismaClient();
  }
  // 接受用户发过来的登录消息
  @OnWSMessage('privateChat')
  async recvierMessage(data, callback) {
    callback({ msg: '342342' });
  }
  // 查询数据库
  async queryUserInfo(userId: string) {
    const prisma = new PrismaClient();
    const res = await prisma.testUser.findMany({
      where: { user_id: userId },
    });
    console.log('res', res);
    if (res.length) {
      return res[0];
    }
    return false;
  }
  // 查询数据库
  async queryUser(userId: string) {
    const prisma = new PrismaClient();
    const res = await prisma.testUser.findMany({
      where: { user_id: userId },
    });
    if (res.length) {
      return res;
    }
    return [];
  }
  // 查询历史聊天记录
  async friendMessage(user_id: string, friend_id: string) {
    const prisma = new PrismaClient();
    const res = await prisma.friendMessages.findMany({
      where: {
        OR: [
        { user_id: user_id },
        { friend_id: friend_id },
        { user_id: friend_id },
        { friend_id: user_id },
      ]
      },

      orderBy: {
        time: 'desc',
      },
    });
    return res;
  }
}
