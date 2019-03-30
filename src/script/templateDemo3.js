// 简化时间轴，time 改为绝对时间点
let demo = {
  width: 640,
  height: 480,
  bgColor: '#FCC7AF',
  canvasScale: 1,
  ver: 2,
  // 层
  layers: [
    {
      type: 'image',
      obj: null,
      UUID: '',
      visible: true,
      pic_url: 'http://imgs.aixifan.com/content/2019_3_24/1.5533916272933776E9.png',
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
          time: 3000,
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
    // 1============================================
    // 图片
    // 容器
    {
      type: 'container',
      UUID: '',
      obj: null,
      tlShowChildren: true,
      visible: true,
      editable: true,
      // 子对象
      children: [
        {
          UUID: '',
          obj: null,
          type: 'image',
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
          visible: true,
          editable: true,
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
            x: 0,
            y: 0,
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
  ]
};
export default demo;
