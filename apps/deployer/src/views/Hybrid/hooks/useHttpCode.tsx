import { toast } from "sonner";

export function useHttpCode() {
  const codeData = {
    navigation: [
      {
        error_code: 10000,
        error_msg: "操作成功",
        description: "",
      },
      {
        error_code: -10000,
        error_msg: "操作失败",
        description: "出现预料之外的问题，请联系相关开发人员",
      },
      {
        error_code: 1,
        error_msg: "楼层号非法",
        description: "新楼层号不能为 0 ，且不能使用已有的楼层号",
      },
      {
        error_code: 2,
        error_msg: "智能重定位失败",
        description: "在指定的位置附近搜索定位结果失败，请重新指定",
      },
      {
        error_code: 3,
        error_msg: "只能在当前层合并地图",
        description: "请切换到目标楼层，再进行合并地图操作",
      },
      {
        error_code: 4,
        error_msg: "合并地图时SLAM定位失败",
        description: "合并地图时需要指定 SLAM 匹配正常的位置，请重新指定",
      },
      {
        error_code: 5,
        error_msg: "合并地图时反光板定位失败",
        description: "合并地图时需要指定反光板匹配正常的位置，请重新指定",
      },
      {
        error_code: 6,
        error_msg: "合并地图时需同时具备两种导航类型",
        description: "请检查车辆的导航方式配置，是否同时使能反光板和SLAM",
      },
      {
        error_code: 7,
        error_msg: "合并地图时需同时具备两种导航类型地图",
        description: "请检查当前楼层是否已同时具备两种导航类型地图",
      },
      {
        error_code: 8,
        error_msg: "当前混导系统状态与操作不匹配",
        description: "如果要放弃当前数据可以使用重置系统功能",
      },
      {
        error_code: 9,
        error_msg: "合并地图时拉取两次定位结果中间不能移动车辆",
        description:
          "请将车辆停在能同时进行反光板匹配和 SLAM 点云匹配的位置后再次操作",
      },
      {
        error_code: 1000,
        error_msg: "车辆自动状态下不能响应当前操作",
        description: "请将车辆切换到手动状态进行操作",
      },
      {
        error_code: 1001,
        error_msg: "混导系统需要在无任务状态下进行建图操作",
        description: "请检查并退出车辆当前混导功能状态",
      },
      {
        error_code: 1002,
        error_msg: "混导系统状态不能响应当前请求",
        description: "当前混导系统状态不能响应定位服务下的操作",
      },
      {
        error_code: 1003,
        error_msg: "当前车辆导航方式配置与执行操作类型不匹配",
        description: "请检查配置导航类型是否已使能当前操作的导航类型",
      },
      {
        error_code: 1004,
        error_msg: "不能删除当前楼层地图",
        description: "不能删除正在使用的楼层地图，请切换为其他楼层后再操作",
      },
      {
        error_code: 1005,
        error_msg: "上线点号非法",
        description: "设置的上线点号不能重复，且为大于等于 0 的整数",
      },
      {
        error_code: 1006,
        error_msg: "上线点号重复",
        description: "设置的上线点号不能重复与已有的上线点号重复",
      },
      {
        error_code: 1007,
        error_msg: "上线点号不存在",
        description:
          "进行上线点上线时，点号需要先在定位状态正常的情况下录制进系统",
      },
      {
        error_code: 1008,
        error_msg: "目标楼层号非法",
        description: "扩展地图操作的楼层号必须为当前正在使用的楼层",
      },
      {
        error_code: 2001,
        error_msg: "读写文件失败",
        description: "读写系统文件失败，请联系相关人员处理",
      },
      {
        error_code: 2002,
        error_msg: "建图服务响应失败",
        description: "建图服务响应失败, 请检查是建图服务是否正常",
      },
      {
        error_code: 2003,
        error_msg: "系统状态不匹配",
        description: "当前为定位丢失状态，不能响应扩展地图功能操作",
      },
      {
        error_code: 2004,
        error_msg: "操作失败",
        description: "旋转地图操作失败，请联系相关人员处理",
      },
      {
        error_code: 2005,
        error_msg: "地图楼层号重复",
        description: "要设置的地图楼层号已存在，请更换新的楼层号",
      },
      {
        error_code: 2006,
        error_msg: "目标楼层地图不存在",
        description: "目标楼层地图不存在，请检查",
      },
      {
        error_code: 2007,
        error_msg: "保存地图失败",
        description: "保存地图文件操作失败，磁盘写入失败",
      },
      {
        error_code: 2008,
        error_msg: "导航类型不匹配",
        description: "当前操作导航类型不匹配，请检查导航类型配置是否正确",
      },
      {
        error_code: 2009,
        error_msg: "当前建图楼层 SLAM 地图已存在",
        description: "请删除当前楼层 SLAM 地图之后再进行新建地图",
      },
      {
        error_code: 3001,
        error_msg: "目标楼层反光板地图不存在",
        description: "指定操作的目标楼层不存在反光板地图，无法进行操作",
      },
      {
        error_code: 3002,
        error_msg: "当前建图楼层 SLAM 地图已存在",
        description: "请删除当前楼层 SLAM 地图之后再进行新建地图",
      },
      {
        error_code: 4001,
        error_msg: "丢定位状态下不能添加当前二维码",
        description:
          "当前二维码坐标依赖当前定位结果推算，不能在丢定位状态下操作",
      },
      {
        error_code: 4002,
        error_msg: "当前未扫描到二维码，不能添加",
        description: "将车辆停到要添加的二维码上，并确保读码头能扫描到二维码",
      },
      {
        error_code: 4003,
        error_msg: "不是二维码扫图状态，不能进行二维码地图操作",
        description:
          "进入二维码编辑功能再进行操作，或使用地图编辑器编辑二维码地图",
      },
    ],
  };
  // 根据错误码，返回对应的错误信息
  const getCodeMsg = (code: number) => {
    const codeErrors = codeData.navigation;
    for (let i = 0; i < codeErrors.length; i++) {
      if (codeErrors[i].error_code === code) {
        return codeErrors[i].error_msg;
      }
    }
  };
  const useErrorMessage = (code: number, mes) => {
    toast.error(
      <>
        <p>{code}</p>
        {mes ? <p>解决方案:{mes}</p> : null}
      </>
    );
  };

  return {
    getCodeMsg: getCodeMsg,
    useErrorMessage: useErrorMessage,
  };
}
