let demo = {
  width: 640,
  height: 480,
  bgColor: '#FCC7AF',
  canvasScale: 1,
  // 层
  layers: [
    {
      type: 'image',
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
          },
          time: 3000
        },
        {
          action: 'to',
          props: {
            x: 100,
            y: 300,
          },
          time: 3000,
        },

      ]
    },
    // 1============================================
    // 图片
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
            },
            {
              action: 'to',
              props: {
                x: 'cw / 2',
                Y: 'ch / 2',
              },
              time: 3000
            },
          ]
        },
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
  ]
};
export default demo;
