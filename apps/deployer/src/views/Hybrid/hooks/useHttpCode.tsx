import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function useHttpCode() {
  const { t } = useTranslation();
  const codeData = {
    navigation: [
      {
        error_code: 10000,
        error_msg: t('common.actionSuccess'),
        description: '',
      },
      {
        error_code: -10000,
        error_msg: t('deployer.hybrid.actionFail'),
        description: t('deployer.hybrid.actionFailTip'),
      },
      {
        error_code: 1,
        error_msg: t('deployer.hybrid.hybridHttpError1'),
        description: t('deployer.hybrid.hybridHttpErrorTips1'),
      },
      {
        error_code: 2,
        error_msg: t('deployer.hybrid.hybridHttpError2'),
        description: t('deployer.hybrid.hybridHttpErrorTips2'),
      },
      {
        error_code: 3,
        error_msg: t('deployer.hybrid.hybridHttpError3'),
        description: t('deployer.hybrid.hybridHttpErrorTips3'),
      },
      {
        error_code: 4,
        error_msg: t('deployer.hybrid.hybridHttpError4'),
        description: t('deployer.hybrid.hybridHttpErrorTips4'),
      },
      {
        error_code: 5,
        error_msg: t('deployer.hybrid.hybridHttpError5'),
        description: t('deployer.hybrid.hybridHttpErrorTips5'),
      },
      {
        error_code: 6,
        error_msg: t('deployer.hybrid.hybridHttpError6'),
        description: t('deployer.hybrid.hybridHttpErrorTips6'),
      },
      {
        error_code: 7,
        error_msg: t('deployer.hybrid.hybridHttpError7'),
        description: t('deployer.hybrid.hybridHttpErrorTips7'),
      },
      {
        error_code: 8,
        error_msg: t('deployer.hybrid.hybridHttpError8'),
        description: t('deployer.hybrid.hybridHttpErrorTips8'),
      },
      {
        error_code: 9,
        error_msg: t('deployer.hybrid.hybridHttpError9'),
        description: t('deployer.hybrid.hybridHttpErrorTips9'),
      },
      {
        error_code: 1000,
        error_msg: t('deployer.hybrid.hybridHttpError1000'),
        description: t('deployer.hybrid.hybridHttpErrorTips1000'),
      },
      {
        error_code: 1001,
        error_msg: t('deployer.hybrid.hybridHttpError1001'),
        description: t('deployer.hybrid.hybridHttpErrorTips1001'),
      },
      {
        error_code: 1002,
        error_msg: t('deployer.hybrid.hybridHttpError1002'),
        description: t('deployer.hybrid.hybridHttpErrorTips1002'),
      },
      {
        error_code: 1003,
        error_msg: t('deployer.hybrid.hybridHttpError1003'),
        description: t('deployer.hybrid.hybridHttpErrorTips1003'),
      },
      {
        error_code: 1004,
        error_msg: t('deployer.hybrid.hybridHttpError1004'),
        description: t('deployer.hybrid.hybridHttpErrorTips1004'),
      },
      {
        error_code: 1005,
        error_msg: t('deployer.hybrid.hybridHttpError1005'),
        description: t('deployer.hybrid.hybridHttpErrorTips1005'),
      },
      {
        error_code: 1006,
        error_msg: t('deployer.hybrid.hybridHttpError1006'),
        description: t('deployer.hybrid.hybridHttpErrorTips1006'),
      },
      {
        error_code: 1007,
        error_msg: t('deployer.hybrid.hybridHttpError1007'),
        description: t('deployer.hybrid.hybridHttpErrorTips1007'),
      },
      {
        error_code: 1008,
        error_msg: t('deployer.hybrid.hybridHttpError1008'),
        description: t('deployer.hybrid.hybridHttpErrorTips1008'),
      },
      {
        error_code: 2001,
        error_msg: t('deployer.hybrid.hybridHttpError2001'),
        description: t('deployer.hybrid.hybridHttpErrorTips2001'),
      },
      {
        error_code: 2002,
        error_msg: t('deployer.hybrid.hybridHttpError2002'),
        description: t('deployer.hybrid.hybridHttpErrorTips2002'),
      },
      {
        error_code: 2003,
        error_msg: t('deployer.hybrid.hybridHttpError2003'),
        description: t('deployer.hybrid.hybridHttpErrorTips2003'),
      },
      {
        error_code: 2004,
        error_msg: t('deployer.hybrid.hybridHttpError2004'),
        description: t('deployer.hybrid.hybridHttpErrorTips2004'),
      },
      {
        error_code: 2005,
        error_msg: t('deployer.hybrid.hybridHttpError2005'),
        description: t('deployer.hybrid.hybridHttpErrorTips2005'),
      },
      {
        error_code: 2006,
        error_msg: t('deployer.hybrid.hybridHttpError2006'),
        description: t('deployer.hybrid.hybridHttpErrorTips2006'),
      },
      {
        error_code: 2007,
        error_msg: t('deployer.hybrid.hybridHttpError2007'),
        description: t('deployer.hybrid.hybridHttpErrorTips2007'),
      },
      {
        error_code: 2008,
        error_msg: t('deployer.hybrid.hybridHttpError2008'),
        description: t('deployer.hybrid.hybridHttpErrorTips2008'),
      },
      {
        error_code: 2009,
        error_msg: t('deployer.hybrid.hybridHttpError2009'),
        description: t('deployer.hybrid.hybridHttpErrorTips2009'),
      },
      {
        error_code: 3001,
        error_msg: t('deployer.hybrid.hybridHttpError3001'),
        description: t('deployer.hybrid.hybridHttpErrorTips3001'),
      },
      {
        error_code: 3002,
        error_msg: '当前建图楼层 SLAM 地图已存在',
        description: '请删除当前楼层 SLAM 地图之后再进行新建地图',
      },
      {
        error_code: 4001,
        error_msg: t('deployer.hybrid.hybridHttpError4001'),
        description: t('deployer.hybrid.hybridHttpErrorTips4001'),
      },
      {
        error_code: 4002,
        error_msg: t('deployer.hybrid.hybridHttpError4002'),
        description: t('deployer.hybrid.hybridHttpErrorTips4002'),
      },
      {
        error_code: 4003,
        error_msg: t('deployer.hybrid.hybridHttpError4003'),
        description: t('deployer.hybrid.hybridHttpErrorTips4003'),
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
        {mes ? (
          <p>
            {t('deployer.hybrid.solution')}:{mes}
          </p>
        ) : null}
      </>,
    );
  };

  return {
    getCodeMsg: getCodeMsg,
    useErrorMessage: useErrorMessage,
  };
}
