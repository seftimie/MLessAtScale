import { CloudBuildClient } from "@google-cloud/cloudbuild";

const cb = new CloudBuildClient();

cb.createBuild({
  projectId: "my-project",
  build: {
    source: {},
  },
});
