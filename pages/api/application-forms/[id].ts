import { FieldsListResponseParams as ResponseParams } from "@api-contracts/application-forms/list";
import ApplicationFormEntity from "@business-logic/ApplicationForm";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import HttpError from "@helpers/errors/HttpError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return;

  const session = await getSession({ req });
  if (!session) return res.status(401).json("Not authenticated");

  const entity = new ApplicationFormEntity();

  try {
    const { jobUid } = req.query;
    const response: ResponseParams = await entity.list(session.user.id, jobUid.toString());
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
