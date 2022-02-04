import { CloudBuildClient } from "@google-cloud/cloudbuild";

const cb = new CloudBuildClient();

export const createBuild = async (
  projectId: string,
  steps: Array<Record<string, any>>
) => {
  const [operation] = await cb.createBuild({
    projectId,
    build: {
      projectId,
      name: "MLess at Scale",
      steps,
    },
  });

  const [response] = await operation.promise();
  return response;
};
