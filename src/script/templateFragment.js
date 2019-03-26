let obj = {
    // 图片
    image: {
        type: 'image',
        UUID: 'test',
        pic_url: 'http://n.sinaimg.cn/sinacn13/400/w720h1280/20180406/7d86-fysuuyc1778445.png',
        visible: true,
        editable: true,
        tween: [
          {
            action: 'to',
            props: {
              regX: 'ow / 2',
              regY: 'oh / 2',
              x: 0,
              y: 0,
  
            },
            time: 0
          },
          {
            action: 'to',
            props: {
              x: 100,
              y: 100,
              rotation: -45
            },
            pic_url: 'https://img.moegirl.org/common/thumb/4/4e/%E5%88%91%E9%83%A8%E5%A7%AC3.png/200px-%E5%88%91%E9%83%A8%E5%A7%AC3.png',
            time: 1000,
            ease: 'linear'
          },
          {
            action: 'to',
            props: {
              x: 200,
              y: 200,
              scaleX: 0.5,
              scaleY: 0.5,
            },
            time: 1000,
            ease: 'linear',
          },
          {
            action: 'to',
            props: {
              rotation: 360,
            },
            time: 2000,
            ease: 'linear',
          }
        ]
    },
    // 文本
    text: {
      type: 'text',
      UUID: '',
      text: 'fgo',
      fontSize: 100,
      fontFamily: '黑体',
      textBaseline: 'top',
      visible: true,
      editable: true,
      tween: [
        {
          action: 'to',
          props: {
            color: 'yellow',
            alpha: 1,
            regX: 'ow / 2',
            regY: 'oh / 2',
            x: 'cw / 2',
            y: 'ch / 2'
          },
          time: 0
        },
        {
          action: 'to',
          props: {
            alpha: 0
          },
          time: 1000
        },
        {
          action: 'wait',
          time: 3000
        },
        {
          action: 'to',
          props: {
            scaleX: 1,
            scaleY: 1,
            rotation: 360,
            y: 'ch - oh',
            alpha: 1
          },
          time: 2000
        },
      ]
    },
};
export default obj;