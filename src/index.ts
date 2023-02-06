import { Context, Schema ,h} from 'koishi'

import * as cheerio from 'cheerio'

export const name = 'bangumi'

export interface Config {
  imageMode?:boolean
}

export const Config: Schema<Config> = Schema.object(
  {imageMode:Schema.boolean()
    .default(true)
    .description('返回内容是否包含图片')
  }).description('基础设置')

export function apply(ctx: Context,config:Config) {

  const {imageMode} = config

  const category_dict = {
    '动画':'anime',
    '书籍':'book',
    '音乐':'music',
    '游戏':'game',
    '三次元':'real'
  }

  ctx.command('bangumi <category:string>','番组计划').alias('番组计划')
  .option('page','-p <page:posint> 设置检索页数,默认值:第1页',{fallback:1})
  .option('time','-t <time:posint> 设置检索时间',{fallback:''})
  .usage(`使用教程 https://github.com/KIRA2ZERO/koishi-plugin-bangumi`)
  .example(`bangumi 动画 -t 2011 -p 1`)
  .action( async ({session,options},category) => {

    if(!(category in category_dict)){session.send(h('quote',{id:session.messageId})+`【${category}】不在参数列表内(动画、书籍、音乐、游戏、三次元)`);return}

    session.send(h('quote',{id:session.messageId}) + '请稍等...');

    const {page,time} = options
    const url = `https://bangumi.tv/${category_dict[category]}/browser/all/airtime/${time}?sort=rank&page=${page}`
    ctx.http.get(url)
    .then(result =>{
      let $ = cheerio.load(result),
          messageList = [];
      for(let i = 1;i <= 24;i ++){
        let picUrl = 'https:'+ $(`#browserItemList > li:nth-child(${i}) > a > span.image > img`).attr('src'),
            znTitle = $(`#browserItemList > li:nth-child(${i}) > div > h3 > a`).text(),
            rate = $(`#browserItemList > li:nth-child(${i}) > div > p.rateInfo`).text().split('\n').join('').trim(),
            info = $(`#browserItemList > li:nth-child(${i}) > div > p.info.tip`).text().split('\n').join('').trim(),
            rank = $(`#browserItemList > li:nth-child(${i}) > div > span`).text(),
            allInfo = `(All ${rank})\n${i+(page-1)*24}_${znTitle}\n简介:${info}\n评分:${rate}`,
            message = (imageMode) ? h('message',h('image',{url:picUrl}),allInfo):h('message',allInfo);
        if(znTitle === '') break;
        messageList.push(message)
      }
      session.send(h('message',{forward:true},messageList));
    }) 
  })
}
 