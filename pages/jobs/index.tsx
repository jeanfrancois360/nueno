import { JobsListResponseParams } from "@api-contracts/jobs/list";
import { BriefcaseIcon } from "@heroicons/react/outline";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "react-query";

import Shell from "@components/Shell";

export default function Jobs() {
  const { isLoading, data: jobs } = useQuery("jobs", getJobs);

  async function getJobs() {
    const response = await axios.get("/api/jobs/list");
    const responseData: JobsListResponseParams = response.data;
    return responseData;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Shell>
      <header>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 md:px-0 lg:flex lg:items-center lg:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <span className="sm:ml-3">
            <Link href="/jobs/new">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create a new job
              </button>
            </Link>
          </span>
        </div>
      </header>
      <main>
        {jobs?.map((job) => {
          return (
            <>
              <div
                key={job.uid}
                className="block p-8 mt-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <BriefcaseIcon className="text-indigo-600 w-9 h-9" aria-hidden="true" />

                <h3 className="mt-3 text-xl font-bold text-gray-800">{job.title}</h3>
                <p className="mt-4 text-sm text-gray-500">{job.description}</p>
                <Link href="/jobs/new">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Apply Now
                  </button>
                </Link>
              </div>
            </>
          );
        })}
      </main>
    </Shell>
  );
}
