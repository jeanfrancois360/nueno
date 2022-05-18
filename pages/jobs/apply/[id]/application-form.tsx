import { FieldsListResponseParams } from "@api-contracts/application-forms/list";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, BaseSyntheticEvent, SetStateAction } from "react";
import { useQuery } from "react-query";

import { asStringOrUndefined } from "@helpers/type-safety";

import Shell from "@components/Shell";

type Attributes = { fieldId: number; text: string }[] | undefined;

export default function ApplicationForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldValues, setFieldValues] = useState<Attributes>([]);
  const router = useRouter();
  const jobUid = asStringOrUndefined(router.query.id);
  const { isLoading, data: fields } = useQuery(["jobUid", jobUid], () => getFields(jobUid));
  async function getFields(jobUid) {
    const response = await axios.get(`/api/application-forms/${jobUid}`);
    const responseData: FieldsListResponseParams = response.data;
    addFieldValues(responseData);
    return responseData;
  }
  function addFieldValues(fields: FieldsListResponseParams) {
    const values: SetStateAction<Attributes> = fields?.map((field) => ({
      fieldId: field.id,
      text: "",
    }));
    setFieldValues(values);
  }
  function updateFieldValue(value: string | number, index: number, key: string) {
    const newFieldValues = [...fieldValues];
    newFieldValues[index] = { ...newFieldValues[index], [key]: value };
    setFieldValues(newFieldValues);
  }
  async function submit(e: BaseSyntheticEvent) {
    e.preventDefault();
    if (!jobUid) return;

    try {
      const requestParams = { jobUid, firstName, lastName, email, fieldValues };
      await axios.post("/api/candidates/create", requestParams);

      router.push({ pathname: "/jobs/" });
    } catch (e) {
      console.log(e);
    }
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <Shell>
      <header>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 md:px-0 lg:flex lg:items-center lg:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">New job</h1>
          <span className="sm:ml-3">
            <button
              type="button"
              onClick={submit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save & continue
            </button>
          </span>
        </div>
      </header>
      <main>
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={submit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div>
                      <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-700">
                        <span className="pr-1 text-red-600">*</span> First Name
                      </label>
                      <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="First Name"
                        value={firstName}
                        onInput={(e) => setFirstName(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div>
                      <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-700">
                        <span className="pr-1 text-red-600">*</span> Last Name
                      </label>
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Last Name"
                        value={lastName}
                        onInput={(e) => setLastName(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                        <span className="pr-1 text-red-600">*</span> Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="text"
                        required
                        className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Email"
                        value={email}
                        onInput={(e) => setEmail(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  {fields.map((field, index) => {
                    let inputElement: HTMLElement = null;
                    switch (field.type) {
                      case "SHORT_TEXT":
                        inputElement = (
                          <div className="px-4 py-5 bg-white sm:p-6" key={index}>
                            <div>
                              <label
                                htmlFor={field.label}
                                className="block mb-2 text-sm font-medium text-gray-700">
                                <span className="pr-1 text-red-600">*</span> {field.label}
                              </label>
                              <input
                                id={field.label}
                                name={field.label}
                                type="text"
                                required={field.required}
                                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={field.label}
                                value={fieldValues[index].text}
                                onInput={(e) => updateFieldValue(e.currentTarget.value, index, "text")}
                              />
                            </div>
                          </div>
                        );
                        break;
                      case "LONG_TEXT":
                        inputElement = (
                          <div className="px-4 py-5 bg-white sm:p-6" key={index}>
                            <div>
                              <label
                                htmlFor={field.label}
                                className="block mb-2 text-sm font-medium text-gray-700">
                                {field.required ? <span className="pr-1 text-red-600">*</span> : null}
                                {field.label}
                              </label>
                              <textarea
                                id={field.label}
                                name={field.label}
                                required
                                className="block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                rows={8}
                                placeholder={field.label}
                                value={fieldValues[index].text}
                                onInput={(e) => updateFieldValue(e.currentTarget.value, index, "text")}
                              />
                            </div>
                          </div>
                        );
                        break;
                    }
                    return inputElement;
                  })}

                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Save & continue
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Tips</h3>
                <div className="mt-1 text-sm text-gray-600">
                  <ul className="list-disc">
                    <li>Use common job titles for searchability.</li>
                    <li>Advertise for just one job eg: Software Engineer, not Software Engineers.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Shell>
  );
}
