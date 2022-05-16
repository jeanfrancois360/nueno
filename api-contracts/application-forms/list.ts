import { Field, Company, FieldChoice, FieldValue } from "@prisma/client";

export type FieldsListResponseParams =
  | (Field & {
      Company: Company | null;
      FieldValue: FieldValue[];
      FieldChoice: FieldChoice[];
    })[]
  | undefined;
