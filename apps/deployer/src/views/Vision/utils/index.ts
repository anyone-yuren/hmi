export const translateFnHashMap: any = {
  pallet: (obj: any) => {
    // 计算进叉宽度要先给支腿排序
    obj.legs.sort((a: any, b: any) => a.leftPosition - b.leftPosition);
    const legForkInWidth: any[] = [];
    const legsHeightAry: any[] = [0];
    for (let legIndex = 0; legIndex < obj.legs.length; legIndex++) {
      const leg = obj.legs[legIndex];
      legsHeightAry.push(leg.height);
      if (legIndex > 0) {
        const preLeg = obj.legs[legIndex - 1];
        legForkInWidth.push({
          id: legIndex,
          width: leg.leftPosition - preLeg?.leftPosition - preLeg?.width,
          leftPosition: preLeg?.leftPosition + preLeg?.width,
        });
      }
    }
    obj.legsMaxHeight = Math.max(...legsHeightAry) || 1;
    obj.legForkInWidth = legForkInWidth;
    obj.handles.sort((a: any, b: any) => a.leftPosition - b.leftPosition);
    const handlesForkInWidth: any[] = [];
    const handlesHeightAry: any[] = [0];
    for (let handleIndex = 0; handleIndex < obj.handles.length; handleIndex++) {
      const handle = obj.handles[handleIndex];
      handlesHeightAry.push(handle.height);
      if (handleIndex > 0) {
        const preHandle = obj.handles[handleIndex - 1];
        handlesForkInWidth.push({
          id: handleIndex,
          width: handle.leftPosition - preHandle?.leftPosition - preHandle?.width,
          leftPosition: preHandle?.leftPosition + preHandle?.width,
        });
      }
    }
    obj.handlesMaxHeight = Math.max(...handlesHeightAry) ?? 1;
    obj.handlesForkInWidth = handlesForkInWidth;
    return obj;
  },
  cage: (obj: any) => {
    return translateFnHashMap.pallet(obj);
  },
  'nine-corner-pallet': (obj: any) => {
    obj.legs.sort((a: any, b: any) => a.leftPosition - b.leftPosition);
    const legForkInWidth: any[] = [];
    const legsHeightAry: any[] = [0];
    for (let legIndex = 0; legIndex < obj.legs.length; legIndex++) {
      const leg = obj.legs[legIndex];
      legsHeightAry.push(leg.height);
      if (legIndex > 0) {
        const preLeg = obj.legs[legIndex - 1];
        legForkInWidth.push({
          id: legIndex,
          width: leg.leftPosition - preLeg?.leftPosition - preLeg?.topWidth,
          leftPosition: preLeg?.leftPosition + preLeg?.topWidth,
        });
      }
    }
    obj.legsMaxHeight = Math.max(...legsHeightAry) || 1;
    obj.legForkInWidth = legForkInWidth;
    const handlesForkInWidth: any[] = [];
    const handlesHeightAry: any[] = [0];
    for (let handleIndex = 0; handleIndex < obj.handles.length; handleIndex++) {
      const handle = obj.handles[handleIndex];
      handlesHeightAry.push(handle.height);
      if (handleIndex > 0) {
        const preLeg = obj.handles[handleIndex - 1];
        handlesForkInWidth.push({
          id: handleIndex,
          width: handle.leftPosition - preLeg?.leftPosition - preLeg?.width,
        });
      }
    }
    obj.handlesMaxHeight = Math.max(...handlesHeightAry) ?? 1;
    return obj;
  },
};

export const translateSendParams: any = {
  pallet: (params: any) => {
    const newParams = {
      ...params,
    };
    delete newParams.handlesMaxHeight;
    delete newParams.legForkInWidth;
    delete newParams.legsMaxHeight;
    delete newParams.showMarks;
    delete newParams.totalHeight;
    return newParams;
  },
  cage: (params: any) => {
    return translateSendParams.pallet(params);
  },
  rect: (params: any) => {
    params.width = Number(params.width);
    params.height = Number(params.height);
    delete params.showMarks;
    return params;
  },
  concentric: (params: any) => {
    delete params.showMarks;
    return params;
  },
  cylinder: (params: any) => {
    delete params.showMarks;
    return params;
  },
  'nine-corner-pallet': (params: any) => {
    const newParams = {
      ...params,
    };
    delete newParams.handlesMaxHeight;
    delete newParams.legForkInWidth;
    delete newParams.legsMaxHeight;
    delete newParams.showMarks;
    delete newParams.totalHeight;
    return newParams;
  },
  warehouse_shelves: (params: any) => {
    const newParams = {
      ...params,
    };
    delete newParams.showMarks;
    delete newParams.storage_gap;
    return newParams;
  },
  tail_truck: (params: any) => {
    const newParams = {
      ...params,
    };
    delete newParams.showMarks;
    return newParams;
  },
  multi_cage: (params) => {
    const newParams = {
      ...params,
    };
    delete newParams.showMarks;
    console.log('newParams in multi_cage translateSendParams', newParams);
    return newParams;
  },
};

// 视觉参数,当前state的数据转化为可以提交的数据
export const translateStateToParams = (originParams: any, state: any) => {
  const newParams = { ...originParams };
  Object.keys(state)
    .filter((key) => !(key.indexOf('__') > -1))
    .forEach((key: string) => {
      newParams[key] && (newParams[key].value = state?.[key]);
    });
  return newParams;
};
