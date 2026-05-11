import _ from "lodash";

export const translateTempToTaskList = (template, isKVehicle) => {
  const temp = _.cloneDeep(template);
  const transformDict = {
    Pick: (obj: any) => {
      obj.task_low_height = obj.param[0];
      obj.task_high_height = obj.param[1];
      isKVehicle
        ? (obj.fork_direction = obj.param[2])
        : (obj.params1 = obj.param[2]);
      obj.params2 = obj.param[3];
      obj.pallet_id = obj.palletNo;
      return obj;
    },
    Place: (obj: any) => {
      obj.task_low_height = obj.param[0];
      obj.task_high_height = obj.param[1];
      isKVehicle
        ? (obj.fork_direction = obj.param[2])
        : (obj.params1 = obj.param[2]);
      obj.params2 = obj.param[3];
      obj.pallet_id = obj.palletNo;
      return obj;
    },
    Null: (obj: any) => {
      obj.pallet_id = obj.palletNo;
      return obj;
    },
    Charge: (obj: any) => {
      obj.task_charge_type = obj["param"][0];
      obj.threshold = obj["param"][1];
      obj.pallet_id = obj.palletNo;
      return obj;
    },
  };
  const ary: any[] = [];
  for (let index = 0; index < temp?.tasks?.length; index++) {
    let obj = temp?.tasks?.[index];
    const element = { ...obj, ..._.omit(temp, ["tasks"]) };
    console.log(obj, _.omit(temp, ["tasks"]));
    console.log("element", element);
    obj = transformDict[obj?.task_type](obj);
    obj.id = generateUniqueId();
    ary.push(obj);
  }

  return ary;
};

export const generateUniqueId = () => {
  return (
    "id-" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  );
};

export const transformTaskListToParams = (params: any, isKVehicle) => {
  const newParams = _.cloneDeep(params);
  const transformDict: any = {
    Pick: (obj: any) => {
      obj["param"][0] = Number(obj?.task_low_height) || 0;
      obj["param"][1] = Number(obj?.task_high_height) || 0;
      obj["param"][2] = isKVehicle
        ? Number(obj?.fork_direction)
        : Number(obj.params1);
      obj["param"][3] = Number(obj.params2);
      obj["pallet_id"] = Number(obj.palletNo) || 0;
      return obj;
    },
    Place: (obj: any) => {
      obj["param"][0] = Number(obj?.task_low_height) || 0;
      obj["param"][1] = Number(obj?.task_high_height) || 0;
      obj["param"][2] = isKVehicle
        ? Number(obj?.fork_direction)
        : Number(obj.params1);
      obj["param"][3] = Number(obj.params2);
      obj["pallet_id"] = Number(obj.palletNo) || 0;
      return obj;
    },
    Null: (obj: any) => {
      obj["param"][0] = Number(obj?.task_low_height) || 0;
      obj["param"][1] = Number(obj?.task_high_height) || 0;
      obj["pallet_id"] = Number(obj.palletNo) || 0;
      return obj;
    },
    Charge: (obj: any) => {
      obj["param"][0] = Number(obj?.task_charge_type) || 0;
      obj["param"][1] = Number(obj?.threshold) || 0;
      obj["pallet_id"] = Number(obj.palletNo) || 0;
      return obj;
    },
  };
  for (let index = 0; index < newParams.tasks.length; index++) {
    let obj = newParams.tasks[index];
    obj = transformDict[obj["task_type"]](obj);
    delete obj.id;
    delete obj.task_type_name;
    delete obj.threshold;
    delete obj.task_charge_type;
    delete obj.task_low_height;
    delete obj.task_high_height;
    delete obj.fork_direction;
    delete obj.expand;
    delete obj.params1;
    delete obj.params2;
    delete obj.palletNo;
  }

  return newParams;
};
