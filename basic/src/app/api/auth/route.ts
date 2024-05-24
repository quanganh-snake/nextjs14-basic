export async function POST(request: Request) {
  const res = await request.json();

  console.log("🚀 ~ file: route.ts:4 ~ POST ~ res:", res)


  const sessionToken = res.metadata?.data?.token

  if (!sessionToken) {
    return Response.json({
      message: 'Không nhận được session token!'
    }, {
      status: 400
    })
  }

  return Response.json(res.metadata.data, {
    status: 200,
    headers: {
      'Set-Cookie': `sessionToken=${sessionToken}; Path=/; HttpOnly;`,
    }
  });
}