import type { NextPageContext } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { readFileSync } from "fs";
import { Dialog, Transition } from "@headlessui/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ClipboardIcon } from "@heroicons/react/solid";

import data from "../lib/data.json";
import FormBox from "../components/FormBox";

import bq from "../public/icons/bq.svg";
import gcp from "../public/icons/gcp.svg";
import gcr from "../public/icons/cloud_run.svg";

import { serverPath, substituteBindingInString } from "../lib/utils";
import { Fragment, useState } from "react";

interface Props {
  // google_url: string;
  // google: Record<string, any>;
  yaml: string;
}

const Home = ({ yaml }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [yamlData, setYamlData] = useState(yaml);
  const [projectId, setProjectId] = useState("");
  const { register, handleSubmit } = useForm();

  const callApi = (projectId: string) => {
    return fetch("/api/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, data: yamlData }),
    });
  };

  const submitPipeline = () => {
    if (projectId) {
      callApi(projectId)
        .then((response) => {
          if (response.status === 200) {
            setIsOpen(false);
          }
        })
        .catch(console.error);
    }
  };

  const submit = (data: any) => {
    setYamlData(substituteBindingInString(yaml, data));
    setIsOpen(true);
    setProjectId(data._GCP_PROJECT_ID);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg max-h-screen p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  YAML Viewer
                </Dialog.Title>
                <div className="relative mt-2">
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      className="rounded-md shadow-md bg-slate-100/90 shadow-slate-200/50 hover:bg-slate-300"
                      onClick={() => navigator.clipboard.writeText(yamlData)}
                    >
                      <ClipboardIcon className="w-5 h-5 m-2" />
                    </button>
                  </div>
                  <SyntaxHighlighter
                    className="overflow-scroll max-h-96"
                    language="yaml"
                  >
                    {yamlData}
                  </SyntaxHighlighter>
                </div>

                <div className="flex justify-center mt-4 space-x-10">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-indigo-900 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md text-rose-900 bg-rose-100 hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-500"
                      onClick={submitPipeline}
                    >
                      Deploy!
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>"
        />
        <title>MLess @ Scale</title>
      </Head>
      <main className="max-w-screen-lg py-8 m-auto">
        <form className="space-y-12" onSubmit={handleSubmit(submit)}>
          <FormBox icon={gcp}>
            <div className="flex justify-center w-full">
              <div className="flex justify-around space-x-8">
                <div>
                  <label
                    htmlFor="_GCP_PROJECT_ID"
                    className="block text-sm font-medium text-slate-500"
                  >
                    Project ID
                  </label>
                  <div className="mt-1">
                    <input
                      id="_GCP_PROJECT_ID"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_GCP_PROJECT_ID", { required: true })}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="_GCP_BUCKET"
                    className="block text-sm font-medium text-slate-500"
                  >
                    Bucket
                  </label>
                  <div className="mt-1">
                    <input
                      id="_GCP_BUCKET"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_GCP_BUCKET", { required: true })}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="_DOCKERFILE_ML"
                    className="block text-sm font-medium text-slate-500"
                  >
                    Dockerfile
                  </label>
                  <div className="mt-1">
                    <input
                      id="_DOCKERFILE_ML"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_DOCKERFILE_ML", {
                        required: true,
                        value:
                          "https://storage.googleapis.com/easyserverless-assets/Dockerfile_ML",
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormBox>
          <FormBox icon={bq}>
            <div className="flex justify-center w-full">
              <div className="grid justify-around grid-cols-3 gap-8">
                <div>
                  <label
                    htmlFor="_BQ_LOCATION"
                    className="block text-sm font-medium text-slate-500"
                  >
                    BQ Location
                  </label>
                  <div className="mt-1">
                    <select
                      id="_BQ_LOCATION"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_BQ_LOCATION", { required: true })}
                    >
                      {data.big_query_locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="_BQ_DATASET_ID"
                    className="block text-sm font-medium text-slate-500"
                  >
                    BQ Dataset
                  </label>
                  <div className="mt-1">
                    <input
                      id="_BQ_DATASET_ID"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_BQ_DATASET_ID", {
                        required: true,
                        value: "easyserverless",
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="_BQ_MODEL"
                    className="block text-sm font-medium text-slate-500"
                  >
                    BQ Model
                  </label>
                  <div className="mt-1">
                    <input
                      id="_BQ_MODEL"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_BQ_MODEL", {
                        required: true,
                        value: "model1",
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="_BQ_FORMAT"
                    className="block text-sm font-medium text-slate-500"
                  >
                    BQ Format
                  </label>
                  <div className="mt-1">
                    <input
                      id="_BQ_FORMAT"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      defaultValue="ML_TF_SAVED_MODEL"
                      {...register("_BQ_FORMAT", { required: true })}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="_BQ_QUERY"
                    className="block text-sm font-medium text-slate-500"
                  >
                    BQ Query
                  </label>
                  <div className="mt-1">
                    <input
                      id="_BQ_QUERY"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      placeholder="https://storage.googleapis.com/easyserverless-assets/model.sql"
                      {...register("_BQ_QUERY", {
                        required: true,
                        value:
                          "https://storage.googleapis.com/easyserverless-assets/model.sql",
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormBox>
          <FormBox icon={gcr}>
            <div className="flex justify-center w-full">
              <div className="flex justify-around space-x-8">
                <div>
                  <label
                    htmlFor="_RUN_LOCATION"
                    className="block text-sm font-medium text-slate-500"
                  >
                    Run Location
                  </label>
                  <div className="mt-1">
                    <select
                      id="_RUN_LOCATION"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      {...register("_RUN_LOCATION", {
                        required: true,
                        value: "europe-west1",
                      })}
                    >
                      {data.cloud_run_locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="_RUN_NAME"
                    className="block text-sm font-medium text-slate-500"
                  >
                    Run Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="_RUN_NAME"
                      className="block w-full px-3 py-2 rounded-md shadow-inner outline-none shadow-slate-100 bg-slate-50 focus:ring-0 focus:ring-slate-200/70 focus:border-slate-200/70 sm:text-sm border-slate-100/75 placeholder-slate-400 text-slate-600"
                      defaultValue="MLessAtScale"
                      {...register("_RUN_NAME", {
                        required: true,
                        value: "model1-run",
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FormBox>

          <div className="flex justify-center space-x-8">
            <div>
              <button
                className="px-4 py-2 font-bold text-white bg-indigo-500 rounded-md shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                type="submit"
              >
                View YAML
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  // const google_url = urlGoogle();
  // const parsed_cookies = cookies.parse(context?.req?.headers?.cookie ?? "");
  const yaml_stub = readFileSync(serverPath("/public/build.stub.yaml"), "utf8");

  return {
    props: {
      // google_url,
      // google: parsed_cookies.google ? JSON.parse(parsed_cookies.google) : {},
      yaml: yaml_stub,
    },
  };
}

export default Home;
