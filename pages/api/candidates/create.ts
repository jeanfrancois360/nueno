import { ApplicationFormsCreateResponseParams as ResponseParams } from "@api-contracts/application-forms/create";
import CandidateEntity from "@business-logic/Candidate";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import HttpError from "@helpers/errors/HttpError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const session = await getSession({ req });
  if (!session) return res.status(401).json("Not authenticated");

  const entity = new CandidateEntity();

  try {
    const response: ResponseParams = await entity.create(req.body, session.user.id);
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) return res.status(error.code).json(error.message);
    throw error;
  }
}
