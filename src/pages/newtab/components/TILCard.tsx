import * as React from "react";

export interface ITILCardProps {
  title: string;
  tags?: string[];
  content: string;
  imageURL?: string;
  externalLink?: string;
}

export function stringToColor(string: string) {
  let hash = 0;

  /* eslint-disable no-bitwise */
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function TILCard({
  title,
  tags,
  content,
  imageURL,
  externalLink,
}: ITILCardProps) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg" src={imageURL} alt="" />
      <div className="flex flex-col p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {content}
        </p>
        <p className="mb-3">
          {tags?.map((tag) => {
            const tagColor = stringToColor(tag) + "80";
            return (
              <span
                key={tag}
                className="text-black-800 
                  text-xs font-medium mr-2 
                  px-3 py-1 rounded 
                  border
                "
                style={{
                  backgroundColor: tagColor,
                }}
              >
                {tag}
              </span>
            );
          })}
        </p>
        {externalLink && (
          <a
            href={externalLink}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Link to page
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
