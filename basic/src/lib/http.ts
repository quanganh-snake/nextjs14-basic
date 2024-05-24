// import { RequestInit } from "next/dist/server/web/spec-extension/request";
type CustomOptions = RequestInit & {
  baseUrl?: string | undefined
}

class HttpError extends Error {

  // variables
  status: number = 0;
  payload: any = null;

  constructor({ status, payload }: { status: number, payload: any }) {
    super('Http Error')
    this.status = status,
      this.payload = payload
  }
}


const request = async<Response>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', endpoint: string, options?: CustomOptions | undefined) => {
  const body = options?.body ? JSON.stringify(options?.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json',
  }
  /**
   * 1. Nếu không truyền baseUrl hoặc baseUrl = undefined => lấy từ envConfig.NEXT_PUBLIC_API_URL
   * 2. Nếu truyền baseUrl => lấy giá trị truyền vào
   * 3. Nếu truyền baseUrl = '' => gọi đến API của NextJS Server
   */
  const baseUrl = options?.baseUrl === undefined ? process.env.NEXT_PUBLIC_API_URL : options.baseUrl
  const fullUrl = endpoint.startsWith('/') ? `${baseUrl}${endpoint}` : `${baseUrl}/${endpoint}`
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers
    },
    body,
    method
  })

  const payload: Response = await response.json()
  const data = {
    status: response.status,
    payload
  }

  if (!response.ok) {
    throw new HttpError(data)
  }

  return data
}

const http = {
  get: <Response>(endpoint: string, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request<Response>('GET', endpoint, options)
  },
  post: <Response>(endpoint: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request<Response>('POST', endpoint, { ...options, body })
  },
  put: <Response>(endpoint: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request<Response>('PUT', endpoint, { ...options, body })
  },
  patch: <Response>(endpoint: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request<Response>('PATCH', endpoint, { ...options, body })
  },
  delete: <Response>(endpoint: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) => {
    return request<Response>('DELETE', endpoint, { ...options, body })
  }
}

export default http