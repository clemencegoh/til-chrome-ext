import { useState, useEffect } from 'react';
import { Client } from '@notionhq/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TEnvConfig } from './constants';
import { INotionQueryResult, TSnippet } from './interface';

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
    const allCredsPresent = !!envConfig.notionToken && !!envConfig.databaseId;
    if (allCredsPresent) {
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

  const {mutate, isLoading, error} = useMutation(
    ['migrate DB keys'],
    () => client?.databases?.update(
      {
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
          }
        }
      }
    ) as any,
    {}
  );

  useQuery(
    ['currentDB'],
    () => client?.databases?.retrieve({database_id: envConfig.databaseId}),
    {
      enabled: !!client,
      onSuccess: (data) => {
        if (![
          Object.prototype.hasOwnProperty.call(data?.properties, 'Snippet'),
          Object.prototype.hasOwnProperty.call(data?.properties, 'SnippetImg'),
          Object.prototype.hasOwnProperty.call(data?.properties, 'Tags'),
          Object.prototype.hasOwnProperty.call(data?.properties, 'Title'),
        ].every(e => e)) {
          // perform migration if not all Truthy
          console.warn('Found malformed database schema! Mutating...');
          mutate();
        }
      }
    }
  );
}


export function useAllData(): TSnippet[] {
  const [envConfig] = useLocalStorage("envConfig", {});
  const client = useNotionClient(envConfig);
  const dbQuery = useQuery(
    ['queryDB'], 
    () => client?.databases?.query({database_id: envConfig.databaseId}), 
    {enabled: !!client}
  );
  return dbQuery.data?.results?.map((result) => {
    const dataRes = result as unknown as INotionQueryResult;
    return {
      snippetText: dataRes.properties.Snippet.rich_text.reduce(
        (accum, curr) => curr.plain_text + accum,
        ''
      ),
      tags: dataRes.properties.Tags.multi_select.map(item => item.name),
      title: dataRes.properties.Title.title.reduce(
        (accum, curr) => curr.plain_text + accum,
        ''
      ), 
    }
  }) ?? [];
}
