import util from './util';
let c = window.createjs;
let obj = {
  render ({canvas = null, project = {}, state}) {
    let {width, height, bgColor, layers} = project;
    // alert([width, height]);
    if (canvas) {
      // 舞台
      let stage = window.stage || new c.Stage(canvas);
      state.stage = stage;
      stage.clear();
      stage.children = [];
      if (!window.stage) {
        window.stage = stage;
      }
      canvas.width = width;
      canvas.height = height;

      // 背景
      let bgShape = new c.Shape();
      bgShape.graphics.f('#ffffff').drawRect(0, 0, width, height).f(bgColor).drawRect(0, 0, width, height);
      stage.addChild(bgShape);
      // 时间轴
      let timeline = new c.Timeline([], 'g', {loop: true});
      state.timeline = timeline;
      window.timeline = timeline;

      this.renderLayers({parentType: 'stage', layers, parent: stage, timeline, project});

      c.Ticker.setFPS(48);
      c.Ticker.addEventListener('tick', stage);
    }
  },
  // 对图层进行行渲染
  renderLayers ({parentType, layers, parent, timeline, project}) {
    let {width, height} = project;
    // console.log('layers', layers);
    if (parentType === 'container') {
     //  console.log('layers------------------------------', layers);
    }
    // 图层
    layers.forEach((item, index) => {
      this.addLayer({layers, parentType, parent,item,project, timeline,index});
      
    });
  },
  addLayer({layers, parentType, parent,item, project, timeline, index}) {
    let container = new c.Container();
      parent.addChild(container);
      let type = item.type;
      let UUID = new util.getUUID().id;
      item.UUID = UUID;
      // alert(UUID);
        // 图片类型==============================================
      if (type === 'image') {
        let imgObj = this.getBitmap({
          container,
          item,
          timeline,
          project,
          parentType,
          UUID,
          addChild: true,
          callback: ({obj, scale}) => {
            // alert(scale);
            // obj.name = UUID;
            /* item.UUID = UUID; */
            // container.addChild(obj);
            let tween = this.getTween({obj, item, timeline, scale});
            // console.log('UUID', UUID);
            // console.log(obj);
            timeline.addTween(tween);
          }
        });
        // 文本类型
      } else if (type === 'text') {
        this.getText({
          container,
          item,
          timeline,
          project,
          UUID,
          addChild: true,
          callback: ({obj, scale}) => {
            // container.addChild(obj);
            /* obj.name = UUID;
            item.UUID = UUID; */
            let tween = this.getTween({obj, item, timeline, scale});
            timeline.addTween(tween);
          }
        });
        // 形状类型
      } else if (type === 'shape') {
        this.getShape({
          container,
          item,
          timeline,
          project,
          UUID,
          addChild: true,
          callback: ({obj, scale}) => {
            // container.addChild(obj);
            /* obj.name = UUID;
            item.UUID = UUID; */
            let tween = this.getTween({obj, item, timeline, scale});
            timeline.addTween(tween);

            // 是否作为遮罩
            if(item.asMask) {
              if (index > 0) {
                obj.set({
                  visible: false,
                })
                let bounds = obj.getBounds();
                // obj.cache(-bounds.width, -bounds.height, bounds.width, bounds.height);
                let prevLayer = layers[index - 1];
                let prevUUID = prevLayer.UUID;
                let prevObj = parent.children[index].getChildByName(prevUUID);
                prevObj.mask = obj;
              }
            }
          }
        });
        // this.addShape({container, item, timeline, project});
      } else if (type === 'mask') {
        this.getShape({
          container,
          item,
          timeline,
          project,
          UUID,
          addChild: false,
          callback: ({obj, scale}) => {
            // container.addChild(obj);
            obj.cache(0, 0, width, height);
            /* obj.name = UUID;
            item.UUID = UUID; */
            let tween = this.getTween({obj, item, timeline, scale});
            timeline.addTween(tween);
            if (index > 0) {
              let prevLayer = layers[index - 1];
              console.log(layers);
              let prevUUID = prevLayer.UUID;
              let prevObj = parent.children[index].getChildByName(prevUUID);
              prevObj.mask = obj;
            }
          }
        });
        // 容器
      } else if (type === 'container') {
        this.getContainer({
          container,
          item,
          timeline,
          project,
          UUID,
          addChild: true,
          callback: ({obj, scale}) => {
            let tween = this.getTween({obj, item, timeline, scale});
            timeline.addTween(tween);
          }
        });
      }
  },
  // 添加图片类型=================================================================
  getBitmap ({container, item, timeline, project, UUID = '', parentType, addChild = false, callback}) {
    let img = util.NImage(item.pic_url);
    let imgObj = new c.Bitmap(img);
    imgObj.name = UUID;
    item.obj = imgObj;
    if(parentType=='container') {
      // alert('container');
      // console.log('container', imgObj);
      setTimeout(()=>{
        console.log('container-------------------------------------------------------', imgObj);

      }, 3000)
    }
    if (addChild) {
      container.addChild(imgObj);
    }
    img.onload = () => {
      let imageW = img.width;
      let imageH = img.height;
      // 当图片覆盖画布时，要scale 多少
      let scale = util.getImageScale({
        img,
        cw: project.width,
        ch: project.height,
        type: 'cover'
      });
      imgObj.set({
        scaleX: scale,
        scaleY: scale,
        visible: item.visible,
      });
      imgObj.shadow = new c.Shadow(item.shadowColor || '#000000', item.shadowOffsetX || 0, item.shadowOffsetY || 0, item.shadowBlur || 0);
      callback({
        obj: imgObj,
        scale
      });
    };
  },
  // 添加文本类型=================================================================
  getText ({container, item, timeline, project, UUID = '', addChild = false, callback}) {
    let text = item.text;
    let fontSize = item.fontSize;
    let fontFamily = item.fontFamily;
    let textObj = new c.Text(text, `normal ${fontSize}px ${fontFamily}`);
    item.obj = textObj;
    textObj.set({
      color: item.color,
      visible: item.visible,
    })
    textObj.name = UUID;
    if (addChild) {
      container.addChild(textObj);
    }
    callback({
      obj: textObj
    });
  },
  // 添加图形
  getShape ({container, item, timeline, project, UUID = '', addChild = false, callback}) {
    let graphics = item.graphics;
    let {type, strokeWidth, stroke, fill} = graphics;
    let shape = new c.Shape();
    item.obj = shape;
    shape.name = UUID;
    if (addChild) {
      container.addChild(shape);
    }

    // 方形
    if (type === 'rect') {
      let {w, h, radius = 0, rRadius = 0} = graphics;
      shape.graphics.f(fill).drawRoundRect(-w / 2, -h / 2, w, h, rRadius);
      shape.setBounds(
        0,
        0,
        w,
        h
      );
    // 圆形
    } else if (type === 'circle') {
      let {w, h, radius = 0} = graphics;
      shape.graphics.f(fill).drawCircle(0, 0, radius);
      shape.setBounds(
        0,
        0,
        radius * 2,
        radius * 2,
      );
    } else if (type === 'ellipse') {
      let {w, h} = graphics;
      shape.graphics.f(fill).drawEllipse(0, 0, w, h);
      shape.setBounds(
        0,
        0,
        w,
        h,
      );
    } else if (type === 'polyStar') {
      let { radius, sides, pointSize, angle } = graphics;
      shape.graphics.f(fill).drawPolyStar(0, 0, radius, sides, pointSize, angle);
      shape.setBounds(
        0,
        0,
        radius * 2,
        radius * 2
      );
    }
    callback({
      obj: shape
    });
  },
  /// 添加容器
  getContainer ({container, item, timeline, project, UUID = '', addChild = false, callback}) {
    // console.log('item----------------------------------', item);
    let thisContainer = new c.Container();
    thisContainer.set({
      visible: item.visible,
    })
    item.obj = thisContainer;
    thisContainer.name = UUID;
    let shape = new c.Shape();
    shape.graphics.f('red').drawRect(0, 0, 100, 100);
    // thisContainer.addChild(shape);
    if (addChild) {
      container.addChild(thisContainer);
    }
    callback({
      obj: thisContainer
    });
    this.renderLayers({
      parentType: 'container',
      layers: item.children,
      parent: thisContainer,
      timeline,
      project
    });
  },
  // 设置动画补间 =====================================================================
  getTween ({obj, item, timeline, scale = 1,f}) {
    // 动画
    let tween = c.Tween.get(obj);
    if(f =='propsChange') {
      console.log('item.tween-------------------', item.tween);
    }
    let projectTween = item.tween || [];
    // ver2
    projectTween.sort((p, n)=>{
      let pT = p.time || 0;
      let nT = n.time || 0;
      return pT - nT;
    })

    // console.log(projectTween);
    projectTween.forEach((t, tIndex) => {
      if(f =='propsChange'){
        // console.log(t.action);
      }
      let currentAction = t.action;
      let props = t.props ? {...t.props} : {};
      
      for (let i in props) {
        // console.log(i);
        if (['regX', 'regY', 'x', 'y', 'width', 'height', 'scaleX', 'scaleY'].indexOf(i) > -1) {
          if (typeof props[i] === 'string') {
            let bounds = obj.getBounds();
            // console.log(bounds);
            let ow = bounds.width;
            let oh = bounds.height;
            // 旋转的原点与原始大小有关，其他的如位移要加上一个缩放系数
            if (['regX', 'regY'].indexOf(i) > -1) {
              ow = bounds.width;
              oh = bounds.height;
            } else {
              ow = ow * scale;
              oh = oh * scale;
            }
            // console.log([ow, oh]);

            props[i] = props[i]
            .replace(/cw/mig, window.stage.canvas.width)
            .replace(/ch/mig, window.stage.canvas.height)
            .replace(/ow/mig, ow)
            .replace(/oh/mig, oh);

            props[i] = eval(props[i]);
            // console.log('--------------------', props[i]);
            // console.log(obj.getBounds());
            // console.log(props[i]);
          } else {

          }
        } else {
        }
      }

      if (typeof props.scaleX === 'number') {
        props.scaleX *= scale;
      }
      if (typeof props.scaleY === 'number') {
        props.scaleY *= scale;
      }

      let tDuration = t.time || 0;
      // 现在采用绝对点，所以要减去上一个的
      if(projectTween[tIndex-1]) {
        tDuration -= (projectTween[tIndex-1].time || 0);
      }
      switch (currentAction) {
        // 设置
        case 'set':
          tween[currentAction](props);
          break;
        // 缓动
        case 'to':
          tween[currentAction](props, tDuration, c.Ease[t.ease] || c.Ease.linear);
          break;
        // 等待
        case 'wait':
          tween[currentAction](tDuration);
          break;
        default: break;
      }
    });
    item.tweenObj = tween;
    return tween;
    // timeline.addTween(tween);
  }
};
export default obj;
