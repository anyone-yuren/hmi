const useCommonData = () => {
  return {
    method: ['RabbitMQ', 'WebApi', 'WebSocket'],
    source: ['WMS', 'WCS', 'RCS'],
    type: ['普通', '警告', '异常'],
  };
};

export default useCommonData;
