type TargetContext = "_self" | "_blank";

export function openWindow(
  url: string,
  opt?: {
    target?: TargetContext | string;
    noopener?: boolean;
    noreferrer?: boolean;
  }
) {
  const { target = "__blank", noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  noopener && feature.push("noopener=yes");
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  noreferrer && feature.push("noreferrer=yes");

  window.open(url, target, feature.join(","));
}

export const jsonParse = (str: any) => {
  try {
    if (!str) {
      return null;
    }

    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const getDeviceType = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobileOrTablet =
    /mobile|android|iphone|ipad|ipod|windows phone|blackberry|bb|playbook/i.test(
      userAgent
    );

  if (isMobileOrTablet) {
    return true;
  }
  return false;
};

export const isMobileDevice = getDeviceType();
