// 简化时间轴，time 改为绝对时间点
let demo = {
  width: 800,
  height: 800,
  bgColor: '#ffffff',
  zoom: 0.6, // 画布的缩放
  ver: 2,
  // tts
  voices: [
    /* {
      time: 0,
      tex: '你妈逼的',
      per: 0, // 人声
      spd: 5, // 语速
      pit: 5,// 音调
      data: '',
      duration: 0,
      fontSize: 30,
      color: '#ffffff',
      fontFamily:'黑体',
      outline: 5,
      outlineColor: '#aaaaaa',
      showSubtitle: true,
    },*/
    {
      time: 3000,
      tex: '你打篮球像蔡徐坤',
      per: 0,
      data: '',
      spd: 5, // 音速
      pit: 5,// 音调
      duration: 0,
      fontSize: 30,
      color: '#ffffff',
      fontFamily:'黑体',
      outline: 5,
      outlineColor: '#aaaaaa',
      showSubtitle: true,
    },
  ],
  // 层
  layers: [
    // 图片图层
    {
      type: 'image',
      obj: null,
      UUID: '',
      visible: true,
      editable: true,
      layerName: '层1',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 100,
      shadowColor: '#000000',
      pic_url: 'http://imgs.aixifan.com/content/2019_4_11/1.5549672019131007E9.png',
      fillBefore: false,
      fillAfter: false,
      
      brightness: 0, // 亮度 [-255 - 255]
      contrast: 0, // 对比 [-100, 100]
      saturation: 0, // 饱和 [-100, 100]
      hue: 0, // 色调 [-180, 180]
      blur: 0,
      tween: [
        {
          action: 'to',
          props: {
            x: 100,
            y: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 1,
            rotation: 0,
            regX: 'ow / 2',
            regY: 'oh / 2'
          },
          time: 0,
          ease: 'linear',
        },
        {
          action: 'to',
          props: {
            x: 100,
            y: 300,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 1,
            rotation: 0
          },
          time: 6000,
          ease: 'linear',
        },

      ]
    },
    // // 形状图层
    // {
    //   type: 'shape',
    //   UUID: '',
    //   obj: '',
    //   visible: true,
    //   editable: true,
    //   layerName: '形状',
    //   asMask: true,
    //   fillBefore: true,
    //   fillAfter: true,
    //   graphics: {
    //     // 方形
    //     /* type: 'rect',
    //     x: 0,
    //     y: 0,
    //     w: 210,
    //     h: 100,
    //     radius: 10,*/
    //     w: 100,
    //     h: 100,
    //     rRadius: 0,
    //     strokeWidth: 2,
    //     stroke: 'orange',
    //     fill: 'rgba(0,0,0,0.5)',

    //     // 圆角方形 drawRoundRect
    //     /*
    //     x: 0,
    //     y: 0,
    //     w: 10,
    //     h: 10,
    //     radius: 5,
    //     */

    //     // 圆形 drawCircle
    //    type: 'circle',
    //      /* x: 0,
    //     y: 0,
    //     radius: 100, */

    //     // 椭圆 drawEllipse
        
    //     /* type: 'ellipse',
    //     x: 0,
    //     y: 0,
    //     w: 100,
    //     h: 200*/
        
    //     // 多形状 drawPolyStar
    //    // type: 'polyStar',
    //     x: 0,
    //     y: 0,
    //     radius: 100,
    //     sides: 5, // 边数 >= 3
    //     pointSize: 0.9, // 0 - 1 0为边不内陷， 1内陷到看不到内容
    //     angle: 0, // 角度

    //   },
    //   tween: [
    //     {
    //       action: 'to',
    //       props: {
    //         regX: 0,
    //         regY: 0,
    //         alpha: 1,
    //         x: 100,
    //         y: 100,
    //         scaleX: 1,
    //         scaleY: 1,
    //         rotation: 0,
    //       },
    //       time: 0,
    //       ease: 'linear'
    //     },
    //     {
    //       action: 'to',
    //       props: {
    //         x: 200,
    //         y: 200,
    //         scaleX: 1,
    //         scaleY: 1,
    //         alpha: 1,
    //         rotation: 0
    //       },
    //       time: 2000,
    //       ease: 'linear'
    //     },
    //   ]
    // },
    // // 1============================================
    // // 图片





    // // 容器
    /*{
      type: 'container',
      UUID: '',
      obj: null,
      tlShowChildren: true,
      visible: true,
      editable: true,
      layerName: '层2',
      width: 300,
      height: 300,
      fillBefore: true,
      fillAfter: true,
      // 子对象
      children: [
        {
          UUID: '',
          obj: null,
          type: 'image',
          visible: true,
          editable: true,
          layerName: '层2.1',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 100,
          shadowColor: '#000000',
          pic_url: 'http://imgs.aixifan.com/content/2019_3_13/1.552485453249718E9.png',
          tween: [
            {
              action: 'to',
              props: {
                regX: 'ow / 2',
                regY: 'oh / 2',
                x: 0,
                y: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                rotation: 0,
                alpha: 1,
              },
              time: 0,
              ease: 'linear',
            },
            {
              action: 'to',
              props: {
                x: 200,
                y: 300,
                scaleX: 0.5,
                scaleY: 0.5,
                rotation: 0,
                alpha: 1
              },
              time: 3000,
              ease: 'linear',
            },
          ]
        },
        {
          type: 'text',
          UUID: '',
          obj: null,
          text: 'text',
          fontSize: 50,
          fontFamily: '站酷酷黑',
          textBaseline: 'top',
          color: '#FF9729',
          outline: 5,
          outlineColor: 'rgba(179,105,105,1)',
          visible: true,
          editable: true,
          layerName: '层2.2',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 100,
          shadowColor: '#000000',
          fillBefore: true,
          fillAfter: true,
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
        }
      ],
      tween: [
        {
          action: 'to',
          props: {
            scaleX: 1,
            scaleY: 1,
            x: 400,
            y: 400,
            regX: 'ow / 2',
            regY: 'oh / 2',
            rotation: 0,
            alpha: 1
          },
          time: 0,
          ease: 'linear',
        },
        {
          action: 'to',
          props: {
            x: 200,
            y: 200,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            alpha: 1
          },
          time: 6000,
          ease: 'linear',
        }
      ]
    },
    */







    // // 影片
    // {
    //   type: 'video',
    //   obj: null,
    //   UUID: '',
    //   visible: true,
    //   editable: true,
    //   layerName: '视频',
    //   shadowOffsetX: 0,
    //   shadowOffsetY: 0,
    //   shadowBlur: 100,
    //   shadowColor: '#000000',
    //   src: `${window.assets}video.mp4`,
    //   // src: 'https://tbm-auth.alicdn.com/IIII1iCvvtm2UjjI3Kw/JxYS29AhMzDempx9vuU@@hd_hq.mp4?auth_key=1555732426-0-0-0a40a70867ff932519d177f16cb32dee',
    //   interval: 50,
    //   start_time: 8000,
    //   end_time: 10000,
    //   sprite: null,
    //   videoObj: null,
    //   list: [],
    //   lastAction: 'init',
    //   tween: [
    //     {
    //       action: 'to',
    //       props: {
    //         x: 400,
    //         y: 400,
    //         scaleX: 0.5,
    //         scaleY: 0.5,
    //         alpha: 1,
    //         rotation: 0,
    //         regX: 'ow / 2',
    //         regY: 'oh / 2'
    //       },
    //       time: 0,
    //       ease: 'linear',
    //     },
    //     {
    //       action: 'to',
    //       props: {
    //         x: 100,
    //         y: 300,
    //         scaleX: 0.5,
    //         scaleY: 0.5,
    //         alpha: 1,
    //         rotation: 0
    //       },
    //       time: 6000,
    //       ease: 'linear',
    //     },

    //   ]
    // },
    // 影片2
    {
      type: 'video',
      obj: null,
      UUID: '',
      visible: true,
      editable: true,
      layerName: '视频',
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 100,
      shadowColor: '#000000',
      // src: `${window.assets}mad.mp4`,
      src: 'https://oss.wonbao.net/wonbao-graphicvideo/audio/mad.mp4',
      // src: 'https://tbm-auth.alicdn.com/IIII1iCvvtm2UjjI3Kw/JxYS29AhMzDempx9vuU@@hd_hq.mp4?auth_key=1555732426-0-0-0a40a70867ff932519d177f16cb32dee',
      interval: 50,
      start_time: 0,
      end_time: 1000,
      timestamp: 0,
      sprite: null,
      list: [],
      clipIndex: -1,
      lastAction: 'init',
      
      videoFillBefore: true, // 视频播放前显示
      videoFillAfter: true, // 视频播放后显示
      fillBefore: true, // 缓动前显示
      fillAfter: true, // 缓动后显示
      videoStartTime: 2000,
      isNet: true,
      tween: [
        {
          action: 'to',
          props: {
            x: 400,
            y: 400,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 1,
            rotation: 0,
            regX: 'ow / 2',
            regY: 'oh / 2'
          },
          time: 2000,
          ease: 'linear',
        },
        /*{
          action: 'to',
          props: {
            x: 100,
            y: 300,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 1,
            rotation: 0
          },
          time: 6000,
          ease: 'linear',
        },*/

      ]
    }
    
  ]
};
export default demo;
