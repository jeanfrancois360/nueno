/* eslint-disable @typescript-eslint/no-unused-vars */
import ApplicationFormEntity from "@business-logic/ApplicationForm";
import CandidateEntity from "@business-logic/Candidate";
import JobEntity from "@business-logic/Job";
import { Job } from "@prisma/client";

import prisma from "@helpers/prisma";
import { createJob } from "@helpers/tests/createJob";
import { minimalSetup } from "@helpers/tests/setup";
import { teardown } from "@helpers/tests/teardown";

describe("Candidate", () => {
  beforeEach(async () => {
    await teardown();
  });

  describe("#create", () => {
    it("creates a new candidate", async () => {
      const { user } = await minimalSetup();
      await Promise.all([createJob(user.companyId)]);
      const job = (await prisma.job.findFirst({
        where: {
          companyId: user.companyId,
        },
      })) as Job;

      const fieldRequestParams = {
        fields: [
          {
            type: "SHORT_TEXT",
            label: "Github user URL",
            order: 0,
          },
        ],
        jobUid: job.uid,
      };

      const entity = new ApplicationFormEntity();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const field = await entity.create(fieldRequestParams, user.id);
      const fieldsList = await entity.list(user.id, job.uid);
      const requestParams = {
        firstName: "Charles",
        lastName: "KAROLI",
        email: "chaz@gmail.com.",
        jobId: job.id,
        fieldValues: [
          {
            fieldId: fieldsList[0].id,
            text: "Hello",
          },
        ],
      };

      const CandEntity = new CandidateEntity();
      const candidate = await CandEntity.create(requestParams);
      expect(candidate.firstName).toBe(requestParams.firstName);
      expect(candidate.email).toBe(requestParams.email);
    });

    it("throws error if Job was not found", async () => {
      const nonExistingJobUid = "ds43dsf999";
      const entity = new CandidateEntity();
      const requestParams = {
        firstName: "Charles",
        lastName: "KAROLI",
        email: "chaz@gmail.com.",
        jobId: nonExistingJobUid,
        fieldValues: [
          {
            fieldId: 1,
            text: "Hello",
          },
        ],
      };

      await expect(async () => {
        await entity.create(requestParams);
      }).rejects.toThrowError("Job Not found");
    });
  });

  describe("#list", () => {
    it("lists all candidates on a job", async () => {
      const { user } = await minimalSetup();
      await Promise.all([createJob(user.companyId)]);
      const job = (await prisma.job.findFirst({
        where: {
          companyId: user.companyId,
        },
      })) as Job;

      const fieldRequestParams = {
        fields: [
          {
            type: "SHORT_TEXT",
            label: "Github user URL",
            order: 0,
          },
        ],
        jobUid: job.uid,
      };

      const entity = new ApplicationFormEntity();
      const field = await entity.create(fieldRequestParams, user.id);
      const fieldsList = await entity.list(user.id, job.uid);
      const requestParams = {
        firstName: "Charles",
        lastName: "KAROLI",
        email: "chaz@gmail.com",
        jobId: job.id,
        fieldValues: [
          {
            fieldId: fieldsList[0].id,
            text: "Hello",
          },
        ],
      };
      const requestParams2 = {
        firstName: "Franco",
        lastName: "Richard",
        email: "franco@gmail.com",
        jobId: job.id,
        fieldValues: [
          {
            fieldId: fieldsList[0].id,
            text: "Hello",
          },
        ],
      };

      const candidateEntity = new CandidateEntity();
      const candidate = await candidateEntity.create(requestParams);
      const candidate2 = await candidateEntity.create(requestParams2);
      const result = await candidateEntity.list(job.uid);

      expect(result.length).toBe(2);
    });

    it("throws error if Job was not found", async () => {
      const nonExistingJobUid = "9999999";
      const entity = new CandidateEntity();

      await expect(async () => {
        await entity.list(nonExistingJobUid);
      }).rejects.toThrowError("Job Not found");
    });
  });
});
