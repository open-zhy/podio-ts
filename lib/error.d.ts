// Here a typical podio error formatted as json
//
// {
//   error_parameters: {},
//   error_detail: "missing_client_id",
//   error_propagate: false,
//   request: { url: "http://api.podio.com/oauth/token", query_string: "", method: "POST" },
//   error_description: "Missing parameter client_id",
//   error: "invalid_client"
// }
export type PodioErrorIO = {
  error_parameters?: Object;
  error_detail?: string;
  error_propagate?: boolean;
  request?: Object;
  error_description: string;
  error: string;
};
