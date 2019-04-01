let obj = {
    // 图片
    image: {
        type: 'image',
        UUID: 'test',
        obj: null,
        pic_url: 'http://n.sinaimg.cn/sinacn13/400/w720h1280/20180406/7d86-fysuuyc1778445.png',
        visible: true,
        editable: true,
        layerName: '图片',
        tween: [
          {
            action: 'to',
            props: {
              regX: 'ow / 2',
              regY: 'oh / 2',
              x: 0,
              y: 0,
              rotation: 0,
              scaleX: 0.5,
              scaleY: 0.5,
              alpha: 1,
  
            },
            time: 0,
            ease: 'linear'
          },
          {
            action: 'to',
            props: {
              x: 300,
              y: 300,
              rotation: 0,
              scaleX: 0.5,
              scaleY: 0.5,
              alpha: 1,
            },
            time: 9000,
            ease: 'linear'
          },
        ]
    },
    // 文本
    text: {
      type: 'text',
      UUID: '',
      obj: null,
      text: 'text',
      fontSize: 100,
      fontFamily: '站酷酷黑',
      textBaseline: 'top',
      color: '#FF9729',
      visible: true,
      editable: true,
      layerName: '文本',
      tween: [
        {
          action: 'to',
          props: {
            // color: 'yellow',
            alpha: 1,
            regX: 'ow / 2',
            regY: 'oh / 2',
            x: 100,
            y: 100,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
          },
          time: 0,
          ease: 'linear'
        },
        {
          action: 'to',
          props: {
            alpha: 1,
            x: 200,
            y: 200,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
          },
          time: 1000,
          ease: 'linear'
        },
        
      ]
    },
};
export default obj;