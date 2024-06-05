export interface FileDetails {
  id: string;
  slot: number;
  timestamp: string;
  file_id: string;
  name: string;
  weight: number;
  file_parent_id?: string;
  cid: string;
  typ: string;
}

export interface FetchFilesResponse {
  success: boolean;
  data?: FileDetails[];
  error?: string;
}
