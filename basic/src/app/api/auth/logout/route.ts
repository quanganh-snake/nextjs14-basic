import authApiRequest from "@/apiRequest/auth.api";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {

  const res = await request.json();

  // dùng force: 1 flag hanle -> nếu force = true -> xóa cookie
  const force = res.force as boolean | undefined

  if (force) {
    return Response.json('Đăng xuất thành công', {
      status: 200,
      headers: {
        // Xóa cookies sessionToken
        'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure`,
      }
    })
  }

  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')

  if (!sessionToken) {
    return Response.json(
      {
        message: 'Không nhận được session token!'
      },
      {
        status: 401
      }
    )
  }

  try {
    const result = await authApiRequest.logoutFromNextServerToServer(sessionToken.value)
    return Response.json(result.payload, {
      status: 200,
      headers: {
        // Xóa cookies sessionToken
        'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure`,
      }
    })
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json({
        message: 'Lỗi không xác định!'
      }, {
        status: 500
      })
    }
  }

  return
}