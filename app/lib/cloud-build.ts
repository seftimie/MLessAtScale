import { CloudBuildClient } from "@google-cloud/cloudbuild";

const cb = new CloudBuildClient();

export const createBuild = (
  projectId: string,
  steps: Array<Record<string, any>>
) => {
  return cb.createBuild({
    projectId,
    build: {
      projectId,
      name: "MLess at Scale",
      steps,
    },
  });
};
