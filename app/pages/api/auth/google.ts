import type { NextApiRequest, NextApiResponse } from "next";
import { getGoogleAccountFromCode } from "../../../lib/google-auth";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const google_auth = await getGoogleAccountFromCode(req.query.code as string);

  res.setHeader(
    "Set-Cookie",
    serialize("google", JSON.stringify(google_auth), {
      path: "/",
      expires: new Date(google_auth.tokens.expiry_date!),
    })
  );

  res.redirect("/");
}
