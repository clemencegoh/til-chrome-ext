import { useLocalStorage } from "@src/utils/hooks";
import React, { useState, useEffect } from "react";

export function SnippetForm() {
  const [imgPreview, setImgPreview] = useState<string>("");
  const [_, setEnvConfig] = useLocalStorage("envConfig", {});

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
      <h1 className="block text-lg text-center font-bold text-gray-900 dark:text-white">
        TIL Snippet
      </h1>

      <form className="p-5 bg-white dark:bg-gray-900 antialiased ">
        <div className="flex justify-end">
          <button
            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
            onClick={() => {
              setEnvConfig({ notionToken: "", databaseId: "" });
            }}
          >
            Reset API credentials
          </button>
        </div>
        <div className="mb-2">
          <label
            htmlFor="snippet-title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="snippet-title"
            placeholder="Title"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <textarea
            id="message"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Today I learned..."
          ></textarea>
        </div>

        <img id="preview" src={imgPreview} className="mt-2" />
      </form>
    </>
  );
}
