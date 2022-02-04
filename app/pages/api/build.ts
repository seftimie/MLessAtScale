import { NextApiRequest, NextApiResponse } from "next";
import jsYaml from "js-yaml";
import { createBuild } from "../../lib/cloud-build";

export default async function build(req: NextApiRequest, res: NextApiResponse) {
  const { projectId, data } = req.body;
  const parsedBody = jsYaml.load(data) as any;

  try {
    const build = await createBuild(projectId, parsedBody.steps);
    res.json({ build });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
