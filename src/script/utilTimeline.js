let Object = {
    // 通过UUID获取 对象
    getObjByUUID({parent,UUID}) {
        let obj = typeof parent.getChildByName == 'function' ? parent.getChildByName(UUID) : null;
        if(obj) {
            return obj;
        } else {
            if(parent.children) {
                let returnValue = null;
                parent.children.forEach((item, index)=>{
                    let cOjb = Object.getObjByUUID({parent: item, UUID});
                    if(cOjb) {
                        returnValue = cOjb
                    }
                })
                return returnValue;
            }
            return null;
        }
    },
    // 获取当前的图层
    getCurrentLayer({rootState}) {
        let topIndex = rootState.tl.topIndex;
        let subIndex = rootState.tl.subIndex;
        let tweenIndex = rootState.tl.tweenIndex;
        let currentLayer = null;
        if(topIndex > -1 && subIndex > -1) {
            currentLayer = rootState.project.layers[topIndex].children[subIndex];
           
        } else if(topIndex > -1){
            currentLayer = rootState.project.layers[topIndex];
           
        }
        return currentLayer;
    },
    // 获取当前的UUID
    getCurrentUUID({rootState}){
        let currentLayer = this.getCurrentLayer({rootState});
        return currentLayer ? currentLayer.UUID : null;
    },
    // 获取当前对象的值
    getCurrentProps({obj}) {
        let props = {};
        let propItems = ['x', 'y', 'alpha', 'scaleX', 'scaleY','rotation'];
        if(obj) {
            propItems.forEach((item, index)=>{
                props[item] = obj[item];
            })
        }
        return props;
    }
}
export default Object;
