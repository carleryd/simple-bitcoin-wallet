export type RemoteData<T, Err = Error> =
  | {
      type: "NOT_ASKED";
    }
  | {
      type: "PENDING";
    }
  | { type: "SUCCESS"; data: T }
  | { type: "ERROR"; error: Err };

export const remoteData = {
  notAsked: { type: "NOT_ASKED" } as const,
  pending: { type: "PENDING" } as const,
  success: <T>(data: T) => ({ type: "SUCCESS" as const, data }),
  error: <Err>(error: Err) => ({ type: "ERROR" as const, error }),
};
