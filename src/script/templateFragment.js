let obj = {

  // 图片==================================================================================
  image: {
      type: 'image',
      UUID: 'test',
      obj: null,
      pic_url: 'http://imgs.aixifan.com/content/2019_4_11/1.5549672019131007E9.png',
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
  // 文本=====================================================================================================
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
  // 形状===============================================================================================
  shape: {
    type: 'shape',
    UUID: '',
    obj: '',
    visible: true,
    editable: true,
    layerName: '形状',
    asMask: false,
    graphics: {
      // 方形
      /* type: 'rect',
      x: 0,
      y: 0,
      w: 210,
      h: 100,
      radius: 10,*/
      w: 210,
      h: 100,
      rRadius: 0,
      strokeWidth: 2,
      stroke: 'orange',
      fill: 'rgba(0,0,0,0.5)',

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
      /* x: 0,
      y: 0,
      radius: 100, */

      // 椭圆 drawEllipse
      
      /* type: 'ellipse',
      x: 0,
      y: 0,
      w: 100,
      h: 200*/
      
      // 多形状 drawPolyStar
      // type: 'polyStar',
      x: 0,
      y: 0,
      radius: 100,
      sides: 5, // 边数 >= 3
      pointSize: 0.9, // 0 - 1 0为边不内陷， 1内陷到看不到内容
      angle: 0, // 角度

    },
    tween: [
      {
        action: 'to',
        props: {
          regX: 0,
          regY: 0,
          alpha: 1,
          x: 100,
          y: 100,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
        },
        time: 0,
        ease: 'linear'
      },
      {
        action: 'to',
        props: {
          x: 200,
          y: 200,
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          rotation: 0
        },
        time: 2000,
        ease: 'linear'
      },
    ]
  },
  // 容器 =================================================================================
  container: {
    type: 'container',
      UUID: '',
      obj: null,
      tlShowChildren: true,
      visible: true,
      editable: true,
      layerName: '文件夹',
      width: 300,
      height: 300,
      // 子对象
      children: [
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

  }

};
export default obj;