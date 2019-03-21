let demo = {
  width: 640,
  height: 480,
  bgColor: '#FCC7AF',
  canvasScale: 1,
  // 层
  layers: [
    // 1============================================
    // 图片
    {
      type: 'image',
      UUID: '',
      pic_url: 'http://n.sinaimg.cn/sinacn13/400/w720h1280/20180406/7d86-fysuuyc1778445.png',
      visible: true,
      editable: true,
      tween: [
        {
          action: 'to',
          props: {
            regX: 'ow / 2',
            regY: 'oh / 2',
            x: 'cw / 2',
            y: 'ch / 2',

          },
          time: 0
        },
        {
          action: 'to',
          props: {
            
            rotation: -45
          },
          pic_url: 'https://img.moegirl.org/common/thumb/4/4e/%E5%88%91%E9%83%A8%E5%A7%AC3.png/200px-%E5%88%91%E9%83%A8%E5%A7%AC3.png',
          time: 1000,
          ease: 'linear'
        },
        {
          action: 'to',
          props: {
            scaleX: 'cw / ow',
            scaleY: 'cw / ow',
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
    // 2============================================
    {
      type: 'image',
      UUID: '',
      pic_url: 'http://n.sinaimg.cn/sinacn13/400/w720h1280/20180406/2270-fysuuyc1778472.png',
      visible: true,
      editable: true,
      tween: [
        {
          action: 'to',
          props: {
            alpha: 0
          },
          time: 10
        },
        {
          action: 'wait',
          time: 6000
        },
        {
          action: 'to',
          props: {
            alpha: 1
          },
          time: 500,
          ease: 'linear',
        },
        {
          action: 'to',
          props: {
            x: 200,
            y: 200,
            scaleX: 0.5,
            scaleY: 0.5,
          },
          pic_url: 'https://img.moegirl.org/common/thumb/4/4e/%E5%88%91%E9%83%A8%E5%A7%AC3.png/200px-%E5%88%91%E9%83%A8%E5%A7%AC3.png',
          time: 1000,
          ease: 'linear'
        }
      ]
    },
    // 3============================================
    {
      type: 'image',
      UUID: '',
      pic_url: 'http://n.sinaimg.cn/sinacn13/400/w720h1280/20180406/607b-fysuuyc1778444.png',
      visible: true,
      editable: true,
      tween: [
        {
          action: 'to',
          props: {
            regX: 'ow / 2',
            regY: 'oh / 2',
            y: 'ch / 2',
            x: 'cw + ow / 2',
            alpha: 0
          },
          time: 10
        },
        {
          action: 'wait',
          time: 3000
        },
        {
          action: 'to',
          props: {
            alpha: 1,
            x: 'oh / 2 * cw / ch'
          },
          time: 5000,
          ease: 'linear',
        },
        {
          action: 'to',
          props: {
            scaleX: 'cw / ch',
            scaleY: 'cw / ch',
            rotation: 90
          },
          pic_url: 'https://img.moegirl.org/common/thumb/4/4e/%E5%88%91%E9%83%A8%E5%A7%AC3.png/200px-%E5%88%91%E9%83%A8%E5%A7%AC3.png',
          time: 5000,
          ease: 'linear'
        },
        {
          action: 'wait',
          props: {

          },
          time: 3000,
        },
      ]
    },
    // 遮罩
    {
      type: 'mask',
      UUID: 'fffff',
      visible: true,
      editable: true,
      graphics: {
        // 方形
        /* type: 'rect',
        x: 0,
        y: 0,
        w: 210,
        h: 100,
        radius: 10,*/
        strokeWidth: 2,
        stroke: 'orange',
        fill: 'rgba(100,0,0,0.5)',
        // 圆角方形 drawRoundRect
        /*
        x: 0,
        y: 0,
        w: 10,
        h: 10,
        radius: 5,
        */

        // 圆形 drawCircle
        type: 'circle',
        x: 0,
        y: 0,
        radius: 100,

        // 椭圆 drawEllipse
        
       /* type: 'ellipse',
        x: 0,
        y: 0,
        w: 100,
        h: 200*/
        
       // 多形状 drawPolyStar
       /* type: 'polyStar',
        x: 0,
        y: 0,
        radius: 100,
        sides: 5, // 边数 >= 3
        pointSize: 0.9, // 0 - 1 0为边不内陷， 1内陷到看不到内容
        angle: 0, // 角度*/

      },
      tween: [
        {
          action: 'to',
          props: {
            x: 'cw / 2',
            y: 'ch / 2',
          },
          time: 1000,
          ease: 'linear'
        },
      ]
    },
    // 容器
    {
      type: 'container',
      UUID: '',
      tlShowChildren: true,
      visible: true,
      editable: true,
      // 子对象
      children: [
        {
          UUID: '',
          type: 'image',
          pic_url: 'http://imgs.aixifan.com/content/2019_3_13/1.552485453249718E9.png',
          tween: [
            {
              action: 'to',
              props: {
                scaleX: 0.5,
                scaleY: 0.5,
              },
              time: 0
            }
          ]
        },
        {
          UUID: '',
          type: 'image',
          pic_url: 'http://imgs.aixifan.com/content/2019_3_13/1.5524854538021584E9.png',
          tween: [
            {
              action: 'to',
              props: {
                scaleX: 0.4,
                scaleY: 0.4
              },
              time: 0
            }
          ]
        }

      ],
      tween: [
        {
          action: 'to',
          props: {
            x: 0,
            y: 0
          },
          time: 1000
        },
        {
          action: 'wait',
          time: 3000,
        },
        {
          action: 'to',
          props: {
            x: 200,
            y: 200,
          },
          time: 2000
        }
      ]

    },
    // 文本
    {
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
    // 形状
    {
      type: 'shape',
      UUID: '',
      visible: true,
      editable: true,
      graphics: {
        // 方形
        /* type: 'rect',
        x: 0,
        y: 0,
        w: 210,
        h: 100,
        radius: 10,*/
        strokeWidth: 2,
        stroke: 'orange',
        fill: 'rgba(100,0,0,0.5)',
        // 圆角方形 drawRoundRect
        /*
        x: 0,
        y: 0,
        w: 10,
        h: 10,
        radius: 5,
        */

        // 圆形 drawCircle
        /* type: 'circle',
        x: 0,
        y: 0,
        radius: 100, */

        // 椭圆 drawEllipse
        
       /* type: 'ellipse',
        x: 0,
        y: 0,
        w: 100,
        h: 200*/
        
       // 多形状 drawPolyStar
        type: 'polyStar',
        x: 0,
        y: 0,
        radius: 100,
        sides: 5, // 边数 >= 3
        pointSize: 0.9, // 0 - 1 0为边不内陷， 1内陷到看不到内容
        angle: 0, // 角度

      },
      tween: [
        {
          action: 'set',
          props: {
            regX: 'ow / 2',
            regY: 'oh / 2',
            alpha: 1
          }
        },
        {
          action: 'to',
          props: {
            x: 'cw / 2',
            y: 'ch / 2',
            alpha: 1
          },
          time: 2000
        },
      ]
    }
  ]

};
export default demo;
