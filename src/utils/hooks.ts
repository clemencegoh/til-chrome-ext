import { useState, useEffect, useRef } from "react";
import { Client } from "@notionhq/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TEnvConfig, defaultEnvConfig } from "./constants";
import _ from "lodash";
import { INotionQueryResult, TSnippet } from "./interface";
import { Configuration, OpenAIApi } from "openai";
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export function useLocalStorage(key: string, initialValue: any) {
  const [state, setState] = useState(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

export function useNotionClient(envConfig: TEnvConfig) {
  const [notionClient, setNotionClient] = useState<Client>();
  useEffect(() => {
    if (envConfig.notionToken) {
      const notion = new Client({
        auth: envConfig.notionToken,
      });
      setNotionClient(notion);
    }
  }, [envConfig]);

  return notionClient;
}

/**
 * Functions as a script to ensure db state is correct
 */
export function useDatabaseMigration(envConfig: TEnvConfig) {
  const client = useNotionClient(envConfig);

  const { mutate, isLoading, error } = useMutation(
    ["migrate DB keys"],
    () =>
      client?.databases?.update({
        database_id: envConfig.databaseId,
        properties: {
          Title: {
            title: {},
          },
          Snippet: {
            rich_text: {},
          },
          SnippetImg: {
            files: {},
          },
          Tags: {
            multi_select: {},
          },
        },
      }) as any,
    {}
  );

  const [checkDBError, setCheckDBError] = useState<string>();

  useQuery(
    ["currentDB"],
    () => client?.databases?.retrieve({ database_id: envConfig.databaseId }),
    {
      enabled: !!client,
      onSuccess: (data) => {
        if (
          ![
            Object.prototype.hasOwnProperty.call(data?.properties, "Snippet"),
            Object.prototype.hasOwnProperty.call(
              data?.properties,
              "SnippetImg"
            ),
            Object.prototype.hasOwnProperty.call(data?.properties, "Tags"),
            Object.prototype.hasOwnProperty.call(data?.properties, "Title"),
          ].every((e) => e)
        ) {
          // perform migration if not all Truthy
          console.warn("Found malformed database schema! Mutating...");
          mutate();
        }
      },
      onError: (err) => {
        // likely API credentials are wrong
        setCheckDBError(err?.toString());
      },
    }
  );

  return [checkDBError, isLoading, error] as const;
}

export function useAllData(): TSnippet[] {
  const [envConfig] = useLocalStorage("envConfig", defaultEnvConfig);
  const [dbData, setDBData] = useState<QueryDatabaseResponse>();

  const client = useNotionClient(envConfig);
  useQuery(
    ["queryDB"],
    () =>
      client?.databases?.query({
        database_id: envConfig.databaseId,
        sorts: [],
      }),
    {
      enabled: !!client,
      onSuccess: (data) => {
        setDBData(data);
      },
      cacheTime: 1_000_000,
      staleTime: 1_000_000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  return (
    dbData?.results?.map((result) => {
      const dataRes = result as unknown as INotionQueryResult;
      return {
        snippetText: dataRes.properties.Snippet.rich_text.reduceRight(
          (accum, curr) => `${curr.plain_text} \n${accum}`,
          ""
        ),
        tags: dataRes.properties.Tags.multi_select.map((item) => item.name),
        title:
          dataRes.properties.Title.title.reduceRight(
            (accum, curr) => `${curr.plain_text} \n${accum}`,
            ""
          ) ?? "",
        link: dataRes.url,
      };
    }) ?? []
  );
}

export function useRandomEntry(): TSnippet {
  const data = useAllData();
  const randomPos = _.random(0, data.length - 1, false);
  return data[randomPos];
}

export function useClock() {
  const [time, setTime] = useState<Date>(new Date());
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  });
  return time;
}

export function useOpenAI(apiKey: string) {
  const configuration = useRef<Configuration>();
  const openai = useRef<OpenAIApi>();
  useEffect(() => {
    if (!configuration.current) {
      configuration.current = new Configuration({ apiKey });
    }
    if (!openai.current && configuration.current) {
      openai.current = new OpenAIApi(configuration.current);
    }
  }, []);

  return openai?.current;
}

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;
/**
 *
 * @param func The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */
export function useDebounce<Func extends SomeFunction>(
  func: Func,
  delay = 1000
) {
  const [timer, setTimer] = useState<Timer>();

  const debouncedFunction = ((...args) => {
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);
    clearTimeout(timer);
    setTimer(newTimer);
  }) as Func;

  return debouncedFunction;
}
