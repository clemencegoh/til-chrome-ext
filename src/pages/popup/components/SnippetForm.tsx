import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Client } from "@notionhq/client";
import { EnvironmentContext } from "../contexts";
import { useLocalStorage } from "@src/utils/hooks";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "./Icons";

type SnippetFormValues = {
  title: string;
  snippet: string;
  tags: string;
  imgURL?: string;
};

export function SnippetForm() {
  const [imgPreview, setImgPreview] = useState<string>("");
  const { envConfig, setEnvConfig } = useContext(EnvironmentContext);
  const [notionClient, setNotionClient] = useState<Client>();
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Since we can't upload directly through API, screenshots need to be uploaded
  // manually by following the link
  const [shouldOpenLink, setShouldOpenLink] = useLocalStorage(
    "shouldOpenLink",
    false
  );

  useEffect(() => {
    const allCredsPresent = !!envConfig.notionToken && !!envConfig.databaseId;
    if (allCredsPresent) {
      const notion = new Client({
        auth: envConfig.notionToken,
      });
      setNotionClient(notion);
    }
  }, [envConfig]);

  const { register, getValues, setValue } = useForm<SnippetFormValues>();
  const cleanupForm = () => {
    setValue("tags", "");
    setValue("imgURL", "");
    setValue("snippet", "");
    setValue("title", "");
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    if (notionClient) {
      try {
        const res = await notionClient.pages.create({
          parent: {
            database_id: envConfig.databaseId,
          },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: getValues().title,
                  },
                },
              ],
            },
            Snippet: {
              rich_text: [
                {
                  text: {
                    content: getValues().snippet,
                  },
                },
              ],
            },
            ...(getValues().tags && {
              Tags: {
                multi_select: getValues()
                  .tags?.split(",")
                  ?.map((tag) => ({
                    name: tag.trim(),
                  })),
              },
            }),
          },
        });

        if (shouldOpenLink) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: url exists but not captured in type
          window.open(res.url, "_blank");
        }
      } catch (err) {
        console.error(err);
        setFormError((err as any).toString());
      } finally {
        cleanupForm();
        setSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const imagePreviewEvent = (evt: ClipboardEvent) => {
      // Get the data of clipboard
      const clipboardItems = evt?.clipboardData?.items;
      if (!clipboardItems) return;

      const items = [].slice
        .call(clipboardItems)
        .filter((item: DataTransferItem) => {
          // Filter the image items only
          return item.type.indexOf("image") !== -1;
        });
      if (items.length === 0) {
        return;
      }

      const item = items[0];
      // Get the blob of image
      const blob = (item as DataTransferItem).getAsFile();
      if (blob) {
        setImgPreview(URL.createObjectURL(blob));
      } else {
        setImgPreview("");
      }
    };
    document.addEventListener("paste", imagePreviewEvent);
    return () => document.removeEventListener("paste", imagePreviewEvent);
  }, []);

  return (
    <>
      <div className="flex justify-between px-5 pt-2">
        <h1 className="block text-lg text-center font-bold text-gray-900 dark:text-white">
          TIL Snippet
        </h1>
        <div className="flex justify-end">
          <button
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={() => {
              setEnvConfig({ notionToken: "", databaseId: "" });
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex justify-end px-5 pt-1">
        <button
          type="button"
          className={`${
            shouldOpenLink
              ? "text-blue-500  border-blue-500 hover:bg-blue-300 dark:hover:bg-blue-500 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
              : "text-red-500  border-red-500 hover:bg-red-300 dark:hover:bg-red-500 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800"
          } hover:text-white
          focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1.5 text-center 
          inline-flex items-center 
          `}
          onClick={() => {
            setShouldOpenLink(!shouldOpenLink);
          }}
        >
          {shouldOpenLink ? <ArrowTopRightOnSquareIcon /> : <XMarkIcon />}
          <span className="sr-only">Follow link on save</span>
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="px-5 pt-1 pb-3 bg-white dark:bg-gray-900 antialiased "
      >
        <div className="mb-2">
          <label
            htmlFor="snippet-title"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            {...register("title")}
            type="text"
            id="snippet-title"
            placeholder="Title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={submitting}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="tags"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tags
          </label>
          <input
            {...register("tags")}
            type="text"
            id="tags"
            placeholder="Tag1, Tag2..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={submitting}
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="message"
            className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <textarea
            {...register("snippet")}
            id="message"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Today I learned..."
            disabled={submitting}
          ></textarea>
        </div>

        <img
          id="preview"
          src={imgPreview}
          className={`${imgPreview ? "mb-2" : ""} max-h-[9rem]`}
        />

        <p className="text-red-500 mb-1">{formError}</p>
        <button
          className={`
            flex items-center justify-center w-full text-blue-700  border border-blue-500 
            focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
            mb-2 dark:border-blue-500 dark:text-blue-500 dark:focus:ring-blue-800
            ${
              submitting
                ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed"
                : "dark:hover:text-white dark:hover:bg-blue-500 hover:text-white hover:bg-blue-600 "
            }
          `}
          disabled={submitting}
          type="submit"
        >
          {submitting && (
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          <p className="text-center">
            {submitting ? "Submitting..." : "Create Snippet"}
          </p>
        </button>
      </form>
    </>
  );
}
