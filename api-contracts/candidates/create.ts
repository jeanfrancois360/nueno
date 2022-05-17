export type CandidatesCreateRequestParams = {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  fieldValues: FieldValueAttributes[];
};

export type CandidatesCreateResponseParams = {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  fieldValues: FieldValueAttributes[];
};

export type FieldValueAttributes = {
  fieldId: number;
  text: string;
};
