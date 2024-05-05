import { httpGet } from './mock-http-interface';

// Define the type for the results array
type TResult = { [key: string]: string };

export const getArnieQuotes = async (urls: string[]): Promise<TResult[]> => {
  // Array to store the promises for each HTTP request
  const promises: Promise<{ status: number; body: string }>[] = [];

  // Array to store the results
  const results: TResult[] = [];

  // Loop through each URL and create a promise for each HTTP request
  for (const url of urls) {
    promises.push(httpGet(url));
  }

  // Execute HTTP requests concurrently with Promise.all()
  const responses = await Promise.allSettled(promises);

  // Process each response
  responses.forEach((response, index) => {
    // If the request was successful (status 200)
    if (response.status === 'fulfilled' && response.value.status === 200) {
      const responseBody = JSON.parse(response.value.body);
      results.push({ 'Arnie Quote': responseBody.message });
    } else {
      // If the request failed or status code is not 200
      const errorMessage = response.status === 'rejected' ? 'An unknown error occurred' : 'Your request has been terminated';
      results.push({ 'FAILURE': errorMessage });
    }
  });

  return results;
};
