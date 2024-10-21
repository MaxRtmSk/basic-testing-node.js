import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.useFakeTimers();

describe('throttledGetDataFromApi', () => {
  const url = '/todos';
  const response = { data: [{todo: 1}] };

  beforeEach(async () => {
    jest.spyOn(axios, 'create').mockReturnThis();
    jest.spyOn(axios, 'get').mockResolvedValue(response);
  });
  afterEach(() => jest.clearAllMocks());

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(url);
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(url);
    jest.runAllTimers();
    expect(axios.get).toHaveBeenCalledWith(url);
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi(url);
    expect(data).toEqual(response.data);
  });
});