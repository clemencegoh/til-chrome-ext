
export type TEnvConfig = {
  notionToken: string;
  databaseId: string;
}

export const defaultEnvConfig: TEnvConfig = {
  notionToken: "",
  databaseId: "",
}