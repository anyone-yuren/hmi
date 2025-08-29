module.exports = {
  // 可选类型
  types: [
    { value: "feat", name: "feat:     新功能" },
    { value: "fix", name: "fix:      修复" },
    { value: "docs", name: "docs:     文档变更" },
    { value: "style", name: "style:    代码格式(不影响代码运行的变动)" },
    {
      value: "refactor",
      name: "refactor: 重构(既不是增加feature，也不是修复bug)",
    },
    { value: "perf", name: "perf:     性能优化" },
    { value: "test", name: "test:     增加测试" },
    { value: "chore", name: "chore:    构建过程或辅助工具的变动" },
    { value: "revert", name: "revert:   回退" },
    { value: "build", name: "build:    打包" },
  ],
  // 确认提交
  allowCustomScopes: true,
  // 消息步骤
  messages: {
    type: "请选择提交类型:",
    customScope: "请输入修改范围(可选):",
    subject: "请简要描述提交(必填):",
    body: "请输入详细描述(可选):",
    footer: "请输入要关闭的issue(可选):",
    confirmCommit: "确认使用以上信息提交？(y/n/e/h)",
  },
  // 跳过问题
  skipQuestions: ["body", "footer"],
  // subject文字长度默认是72
  subjectLimit: 72,
  // 自定义 prompts 实现多级选择
  prompts: {
    // 项目选择
    project: {
      type: "list",
      message: "请选择项目:",
      choices: ["customer", "deployer", "common"],
    },

    // 功能模块选择
    module: {
      type: "list",
      message: "请选择功能模块:",
      choices: (answers) => {
        if (answers.project === "customer") {
          return ["首页", "维保", "设置"];
        }
        if (answers.project === "deployer") {
          return [
            "首页",
            "单任务",
            "安全",
            "混导",
            "视觉",
            "诊断",
            "车辆信息",
            "IO信号",
            "设置",
            "维保",
          ];
        }
        return ["common"];
      },
    },
  },
  // 自定义提交信息格式
  format: "{type}({project}/{module}): {subject}",
};
