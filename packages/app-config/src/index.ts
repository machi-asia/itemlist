export interface AppConfig {
  id: string;
  name: string;
  underDevelopment: boolean;
  appUrl: string;
}

export type AppId = "home" | "create" | "rimworld";

export const APPS_CONFIG: Record<AppId, AppConfig> = {
  home: {
    id: "home",
    name: "Home",
    underDevelopment: false,
    appUrl: "https://itemlist.online",
  },
  create: {
    id: "create",
    name: "Create",
    underDevelopment: false,
    appUrl: "https://create.itemlist.online",
  },
  rimworld: {
    id: "rimworld",
    name: "RimWorld",
    underDevelopment: true,
    appUrl: "https://rimworld.itemlist.online",
  },
};

export function isAppUnderDevelopment(appId: AppId | string): boolean {
  return Boolean(APPS_CONFIG[appId as AppId]?.underDevelopment);
}

export function getAppConfig(appId: AppId | string): AppConfig | undefined {
  return APPS_CONFIG[appId as AppId];
}
