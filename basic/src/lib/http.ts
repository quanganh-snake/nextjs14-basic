import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {

  // variables
  status: number = 0;
  payload: {
    message: string
    [key: string]: any
  };

  constructor({ status, payload }: { status: number, payload: any }) {
    super('Http Error')
    this.status = status,
      this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: number = ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: number, payload: EntityErrorPayload }) {
    super({ status, payload })

    if (status !== ENTITY_ERROR_STATUS) {
      throw new Error('Entity Status is not 422!')
    }

    this.status = ENTITY_ERROR_STATUS
    this.payload = payload
  }
}

class SessionToken {
  private _token: string = ''

  get value() {
    return this._token
  }

  set value(tokenValue: string) {

    // Nếu gọi method này ở server -> Lỗi
    if (typeof window === 'undefined') {
      throw new Error('Cannot set token on server side')
    }
    this._token = tokenValue
  }
}

export const clientSessionToken = new SessionToken()


let clientLogoutRequest: null | Promise<any> = null
const request = async<Response>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', endpoint: string, options?: CustomOptions | undefined) => {


  const body = options?.body ? JSON.stringify(options?.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json',
    Authorization: clientSessionToken.value ? `Bearer ${clientSessionToken.value}` : ''
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
    // throw new HttpError(data)
    if (response.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data as {
        status: 422,
        payload: EntityErrorPayload
      })
    } else if (response.status === AUTHENTICATION_ERROR_STATUS) {
      // Xử lý authentication hết hạn phía client (browser)
      if (typeof window !== 'undefined') {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ force: true }),
            headers: {
              ...baseHeaders,
            }
          })
        }
        await clientLogoutRequest
        clientSessionToken.value = ''
        location.href = '/login'
      } else {
        // Xử lý hết hạn phía server
        const sessoinToken = (options?.headers as any)?.Authorization?.split('Bearer ')[1]
        redirect(`/logout?sessionToken=${sessoinToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  // Đảm bảo logic chỉ chạy ở phía client (browser)
  if (typeof window !== 'undefined') {
    if (['/auth/login', '/auth/register'].some(path => path === normalizePath(endpoint))) {
      clientSessionToken.value = (payload as LoginResType).data.token
    } else if (['/auth/logout'].includes(endpoint)) {
      clientSessionToken.value = ''
    }
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