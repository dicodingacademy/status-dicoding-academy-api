import { getDicodingAPIsStatus } from '../data';

export const handler = async () => {
  const payload = await getDicodingAPIsStatus();

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
};
