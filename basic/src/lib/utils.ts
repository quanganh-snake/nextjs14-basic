import { toast } from "@/components/ui/use-toast"
import { EntityError } from "@/lib/http"
import { type ClassValue, clsx } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import JWT from 'jsonwebtoken'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({ error, setError, duration }: {
  error: any,
  setError?: UseFormSetError<any>,
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach(({ field, message }) => {
      setError(field, {
        type: "server",
        message,
      })
    })
  } else {
    toast({
      title: "Error",
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 2000
    })
  }
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}


export const decodeJWT = <Payload = any>(token: string) => {
  return JWT.decode(token) as Payload
}