import path from "path";
import getConfig from "next/config";

export const serverPath = (staticFilePath: string) => {
  return path.join(
    getConfig().serverRuntimeConfig.PROJECT_ROOT,
    staticFilePath
  );
};

export const substituteBindingInString = (
  str: string,
  binding: { [key: string]: string }
) => {
  const keys = Object.keys(binding);
  keys.forEach((key) => {
    str = str.replaceAll(`\${${key}}`, binding[key]);
  });
  return str;
};
