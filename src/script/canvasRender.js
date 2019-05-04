import util from './util';

import VideoCaptureClass from './videoCapture';
let uuidMap = {};

let c = window.createjs;
/* c.MyText = class extends c.Text{
  constructor(text, props){
    super(text, props);
  }
}*/

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

      // 渲染字幕
      this.renderSubtitle({project, parent: stage, timeline});

      c.Ticker.setFPS(48);
      c.Ticker.addEventListener('tick', stage);
    }
  },
  // 生成字幕
  renderSubtitle({project, parent, timeline}){
    // return;
    // alert('renderSubtitle');
    // return;
    let prevContainer = parent.getChildByName('subtitle');
    if(prevContainer) {
      // alert('yes');
      parent.removeChild(prevContainer);
    }
    // 字幕 subtitle
    let subtitleContainer = new c.Container();
    subtitleContainer.name = 'subtitle';
    stage.addChild(subtitleContainer);

    project.voices.forEach((item)=>{
      if(item.tweenObjUUID) {
        // alert('tweenObj');
        timeline.removeTween(uuidMap[item.tweenObjUUID]);
        uuidMap[item.tweenObjUUID] = null;
      }

      let text = item.tex;
      let fontSize = item.fontSize;
      // console.log('fontSize', fontSize);
      let fontFamily = item.fontFamily || '黑体';
      let textContainer = new c.Container();
      let textObj = new c.Text(text, `normal ${fontSize}px ${fontFamily}`);
      let textObjOutline = textObj.clone();

      let textWidth = textObj.getMeasuredWidth();
      let textHeight = textObj.getMeasuredHeight();
      textObj.set({
        color: item.color || 'orange',
      })
      textObjOutline.set({
        outline: item.outline,
        color: item.outlineColor || 'orange',
      })
      textContainer.set({
        alpha: 0,
        x: (project.width - textWidth) / 2,
        y: (project.height - textHeight * 2),
        visible: item.showSubtitle,
      })
      textContainer.addChild(textObjOutline);
      textContainer.addChild(textObj);
      subtitleContainer.addChild(textContainer);
      // alert([item.time, item.duration]);

      let tween = c.Tween.get(textContainer);

      if(item.duration > 1) {
        tween.wait(item.time)
        .to({alpha: 1}, 200)
        .wait(item.duration * 1000 - 400)
        .to({alpha: 0}, 200);
      } else {
        tween.wait(item.time)
        .to({alpha: 1}, 0)
        .wait(item.duration*1000)
        .to({alpha: 0}, 0);
      }

      let UUID = new util.getUUID().id;
      
      // item.tweenObj = tween;
      item.tweenObjUUID = UUID;
      uuidMap[UUID] = tween;

      timeline.addTween(tween);

      // console.log(item);
    })

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
      let subtitleChild = parent.getChildByName('subtitle');
      if(subtitleChild) {
        // alert('subtitleChild');
        let subtitleChildIndex = parent.getChildIndex(subtitleChild);
        parent.addChildAt(container, subtitleChildIndex);
        // alert(subtitleChildIndex);
      } else {
        parent.addChild(container);

      }
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
            tween.forEach((i)=>{
              timeline.addTween(i);
            })
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
            tween.forEach((i)=>{
              timeline.addTween(i);
            })
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
            tween.forEach((i)=>{
              timeline.addTween(i);
            })

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
            tween.forEach((i)=>{
              timeline.addTween(i);
            })
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
            tween.forEach((i)=>{
              timeline.addTween(i);
            })
          }
        });
      } else if (type === 'video') {
        this.getVideo({
          container,
          item,
          timeline,
          project,
          UUID,
          addChild: true,
          callback: ({obj, scale}) => {
            let tween = this.getTween({obj, item, timeline, scale});
            tween.forEach((i)=>{
              timeline.addTween(i);
            })
          }
        }) 
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
        // console.log('container-------------------------------------------------------', imgObj);
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
    let outline = item.outline;
    let outlineColor = item.outlineColor;

    let textContainer = new c.Container();
    let textOutlineObj = new c.Text(text, `normal ${fontSize}px ${fontFamily}`);
    let textObj = new c.Text(text, `normal ${fontSize}px ${fontFamily}`);

    // textObj.shadow = new createjs.Shadow("#000000", 5, 5, 10);  // 创建文字阴影
    textOutlineObj.set({
      color: outlineColor,
      visible: outline > 0,
      outline:  outline,
    })
    textObj.set({
      color: item.color,
      // visible: item.visible,
      // outline:  1,
    })

    // textObj.name = UUID;
    
    textContainer.name = UUID;
    
    textContainer.addChild(textOutlineObj);
    textContainer.addChild(textObj);
    textContainer.set({
      visible: item.visible
    })
    // item.obj = textObj;
    item.obj = textContainer;
    if (addChild) {
      // container.addChild(textObj);
      container.addChild(textContainer);
    }
    callback({
      // obj: textObj
      obj: textContainer
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
    thisContainer.setBounds(
      0,
      0,
      item.width,
      item.height);
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
  getVideo({container, item, timeline, project, UUID = '', addChild = false, callback}) {
    
    let videoContainer = new c.Container();
    videoContainer.setBounds(0, 0, 300, 150);
    videoContainer.name = UUID;
    item.obj = videoContainer;
    if (addChild) {
      container.addChild(videoContainer);
    }
    let shape = new c.Shape();
    videoContainer.addChild(shape);
    

    if(item.videoObj/*item.lastAction == 'success' || item.lastAction == 'initing'*/) {
      // alert('videoObj');
      let firstImage = item.videoObj.canvasList[0];
      if(firstImage) {
        // alert([firstImage.width, firstImage.height]);
        videoContainer.setBounds(0, 0, firstImage.width, firstImage.height);
        videoContainer.set({
          regX: firstImage.width / 2,
          regY: firstImage.height / 2,
        })
      }
    } else {
      item.lastAction = 'initing';
      let videoCapture = new VideoCaptureClass({
        src: item.src,
        start_time: item.start_time / 1000,
        end_time: item.end_time / 1000,
        interval: item.interval / 1000,
      })
      item.videoObj = videoCapture;
      let promise = videoCapture.start();
      promise.then((res)=>{
        if(res.success) {
          videoContainer.setBounds(0, 0, res.width, res.height);
          videoContainer.set({
            regX: res.width / 2,
            regY: res.height / 2,
          })
          item.list = res.list;

          let tweenObj = item.tweenObj;
          let videoTweenObj = item.videoTweenObj;
          timeline.removeTween(tweenObj);
          timeline.removeTween(videoTweenObj);
          let tween = this.getTween({obj: item.obj, item, timeline, scale:1});
          tween.forEach((i)=>{
            timeline.addTween(i);
          })
        
          /*let data = {
            images: res.list,
            frames: {width:res.width, height:res.height},
            animations: {
                stand:0,
                run:[1,res.list.length, 'run', item.interval / 100],
                // jump:[6,8,"run"]
            }
          };
          var spriteSheet = new createjs.SpriteSheet(data);
          var animation = new createjs.Sprite(spriteSheet, "run");
          item.sprite = animation;
          // animation.gotoAndStop(0);
  
  
  
  
          videoContainer.addChild(animation);
          console.log(res);
          */
          item.lastAction = 'success';
        } else {
          item.lastAction = 'error';
        }
      }, () => {
        item.lastAction = 'error';
      });
    }

    callback({
      obj: videoContainer
    });

  },
  // 设置动画补间 =====================================================================
  getTween ({obj, item, timeline, scale = 1,f}) {
    // 动画
    let tween = c.Tween.get(obj);
    if(f =='propsChange') {
      // console.log('item.tween-------------------', item.tween);
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
            let bounds = obj.getBounds() || {width: 0, height: 0};
            // alert(bounds);
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
          // 如果是第一个缓动节点
          if(tIndex == 0) {
            /*if(item.sprite) {
              item.sprite.gotoAndStop(0);
            }*/
            tween[currentAction](props, 0, c.Ease[t.ease] || c.Ease.linear);
            tween.wait(tDuration).call(()=>{
              item.sprite && item.sprite.gotoAndPlay(0);
            });
          } else {
            tween[currentAction](props, tDuration, c.Ease[t.ease] || c.Ease.linear);
          }
          break;
        // 等待
        case 'wait':
          tween[currentAction](tDuration);
          break;
        default: break;
      }
    });
    let videoTween = null;
    if(item.type == 'video') {
      console.log('obj',obj);
      let shapeObj = obj.children[0];
      console.log('shapeObj', shapeObj);
      videoTween = c.Tween.get(shapeObj);
      // alert(item.list.length);
      let firstTime = projectTween[0] ? projectTween[0].time : 0;
      let videoWidth = 0;
      let videoHeight = 0;
      
      item.list.forEach((clipListItem, index)=>{
        if(index == 0) {
          // alert(shapeObj);
          /*videoWidth = clipListItem.width
          videoHeight = clipListItem.height

          item.videoObj.video.currentTime = 0;
          console.log('video', item.videoObj.video);
          console.log('canvas', item.videoObj.canvas);
          
          shapeObj.graphics.clear();
          // shapeObj.graphics.bf(clipListItem).r(0,0, videoWidth, videoHeight);

          item.videoObj.ctx.fillRect(0,0, 10, 10);
          item.videoObj.ctx.fillRect(0,videoHeight -10, 10, 10);
          item.videoObj.ctx.fillRect(videoWidth - 10, 0, 10, 10);
          item.videoObj.ctx.fillRect(videoWidth -10, videoHeight - 10 , 10, 10);
          item.videoObj.ctx.fillRect(0,100, 100, 100);
          item.videoObj.ctx.fillText('apple', 0, 200);
          let img = new Image();
          img.src="https://imgs.aixifan.com/Fm5trVWxz3lkOg-ZccSw9vw-5dBi?imageView2/1/w/200/h/110";
          item.videoObj.ctx.drawImage(clipListItem, 0, 0);
          
          document.body.appendChild(item.videoObj.canvas);
          shapeObj.graphics.bf(item.videoObj.canvas).r(0,0, videoWidth, videoHeight);
          videoTween.wait(firstTime);
          */

          // document.body.appendChild(clipListItem);
          /* shapeObj.graphics.clear();
          shapeObj.graphics.bf(clipListItem).r(0,0, videoWidth, videoHeight);*/
          if(!item.fillBefore) {
            obj.removeAllChildren();
            videoTween.wait(0).call(()=>{
              obj.removeAllChildren();
            });
          } else {
            obj.removeAllChildren();
            let bitmap = new c.Bitmap(clipListItem);
            obj.addChild(bitmap)
  
            videoTween.wait(0).call(()=>{
              document.body.appendChild(clipListItem);
              obj.removeAllChildren();
              let bitmap = new c.Bitmap(clipListItem);
              obj.addChild(bitmap)
            })
          }
          videoTween.wait(firstTime);

        } 
        // console.log(firstTime + index*item.interval);
        videoTween.wait(item.interval).call(()=>{
          /*let distTime = (firstTime + item.interval*index) /1000;;
          // if() {}
          let c = document.createElement('canvas');
          c.width = videoWidth;
          c.height = videoHeight;
          let ctx = c.getContext('2d');
          ctx.drawImage(item.videoObj.video, 0, 0, videoWidth, videoHeight);

          item.videoObj.video.currentTime = distTime;

          shapeObj.graphics.clear();
          // shapeObj.graphics.bf(clipListItem).r(0, 0, videoWidth, videoHeight);
          item.videoObj.ctx.drawImage(c, 0, 0, videoWidth, videoHeight);
          shapeObj.graphics.bf(item.videoObj.canvas).r(0,0, videoWidth, videoHeight);
          */
         // document.body.appendChild(clipListItem);
          /*shapeObj.graphics.clear();
          shapeObj.graphics.bf(clipListItem).r(0,0, videoWidth, videoHeight);*/
          if(item.list.length == (index + 1)) {
            // console.log('ddddddd');
            /*if(timeline.position > firstTime) {
              console.log('>>>>>');
            } else {
              obj.removeAllChildren();
              let bitmap = new c.Bitmap(item.list[0]);
              obj.addChild(bitmap)
              console.log('<<<<<<');
            }*/
            if(!item.fillAfter) {
              obj.removeAllChildren();
            }
          } else {
            obj.removeAllChildren();
            let bitmap = new c.Bitmap(clipListItem);
            obj.addChild(bitmap)
          }
        });
      })
      let currentTime = timeline.position;
      if(currentTime < firstTime) {
      } else if(currentTime > (firstTime + item.list.length * item.interval)){
          if(item.fillAfter) {
            obj.removeAllChildren();
            let bitmap = new c.Bitmap(item.list[item.list.length - 1]);
            obj.addChild(bitmap)
          } else {
            obj.removeAllChildren();
          }
      } else {
        let witch = parseInt((currentTime - firstTime) / item.interval);
        obj.removeAllChildren();
        let bitmap = new c.Bitmap(item.list[(witch - 1) < 0 ? 0 : (witch - 1)]);
        obj.addChild(bitmap)
      }
    }
    item.videoTweenObj = videoTween;
    item.tweenObj = tween;
    if(videoTween) {
      return [tween, videoTween];
    } else {
      return [tween];
    }
    // timeline.addTween(tween);
  }
};
export default obj;
