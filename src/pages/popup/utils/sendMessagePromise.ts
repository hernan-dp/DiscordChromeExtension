type MessageResponse<T> = {
  complete: boolean;
  data?: T;
  error?: Error;
};

export const sendMessagePromise = <ResponseData, PayloadType = undefined>(
  action: string,
  payload?: PayloadType
): Promise<ResponseData> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action,
        payload,
      },
      (response: MessageResponse<ResponseData>) => {
        if (!response.complete || response.error) {
          reject(response.error);
        }
        if (response.complete) resolve(response.data);
      }
    );
  });
};
