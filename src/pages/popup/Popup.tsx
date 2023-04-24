import React, { useEffect, useState } from "react";
import logo from "@assets/img/logo.svg";
import { useLocalStorage } from "usehooks-ts";

export default function Popup(): JSX.Element {
  const [envConfig, setEnvConfig] = useLocalStorage("envConfig", {
    notionToken: "",
    databaseId: "",
  });
  const [imgPreview, setImgPreview] = useState<string>("");

  const isMissingDetails = Object.values(envConfig).includes("");
  useEffect(() => {
    const imagePreviewEvent = (evt: ClipboardEvent) => {
      // Get the data of clipboard
      const clipboardItems = evt?.clipboardData?.items;
      console.log(clipboardItems);
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
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <form className="bg-grey-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4 flex-col text-align-start">
            <label
              className="flex justify-start text-white text-sm font-bold mb-2"
              htmlFor="snippet"
            >
              TIL Snippet
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-full"
              id="snippet"
              placeholder="Today I learned..."
            />
            <img id="preview" src={imgPreview} />
          </div>
        </form>
      </header>
    </div>
  );
}
