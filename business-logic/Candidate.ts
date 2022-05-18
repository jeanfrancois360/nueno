import { CandidatesCreateRequestParams } from "@api-contracts/jobs/create";
import JobEntity from "@business-logic/Job";

import NotFoundError from "@helpers/errors/NotFoundError";
import prisma from "@helpers/prisma";

export default class CandidateEntity {
  async create(params: CandidatesCreateRequestParams) {
    const job = await new JobEntity().find(params.jobUid);

    if (!job) throw new NotFoundError("Job Not found");

    const candidate = await prisma?.candidate?.create({
      data: {
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        jobId: job.id,
      },
    });
    params.fieldValues.forEach(async (field) => {
      await prisma?.fieldValue?.create({
        data: {
          candidateId: candidate.id,
          fieldId: field.fieldId,
          text: field.text,
        },
      });
    });
    return candidate;
  }

  async list(jobUid: number) {
    const job = await new JobEntity().find(jobUid);

    if (!job) throw new NotFoundError("Job Not found");

    return prisma?.candidate?.findMany({
      where: {
        jobId: job.id,
      },
      include: {
        FieldValue: true,
      },
    });
  }
}
