import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import _ from "lodash";
import { useLocalStorage } from "@src/utils/hooks";

type FormValues = {
  notionToken: string;
  databaseId: string;
};

export function ConfigForm() {
  const [envConfig, setEnvConfig] = useLocalStorage("envConfig", {});

  const { register, getValues } = useForm<FormValues>({
    defaultValues: envConfig,
  });

  const onSubmit = (e: any) => {
    e.preventDefault();

    // remove falsy values
    const changedResult = _.pickBy(getValues(), _.identity);
    setEnvConfig({
      ...envConfig,
      ...changedResult,
    });
  };

  return (
    <form
      className="p-5 bg-white dark:bg-gray-900 antialiased"
      onSubmit={onSubmit}
    >
      <div className="mb-2">
        <label
          htmlFor="notion-token"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Notion Token
        </label>
        <input
          {...register("notionToken")}
          type="text"
          id="notion-token"
          placeholder="Token"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="db-id"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Database ID
        </label>
        <input
          {...register("databaseId")}
          type="text"
          id="db-id"
          placeholder="Database ID"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          className="w-full text-blue-700 hover:text-white border border-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  );
}
