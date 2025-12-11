export interface appInfo {
  title: string;
  icon: string;
}

type appInfos = Record<string, appInfo>;

export const AppInfos: appInfos = {};
