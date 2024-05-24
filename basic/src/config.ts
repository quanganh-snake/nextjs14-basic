import z from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url('Invalid URL api endpoint!')
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
})

if (!configProject.success) {
  console.error('>>>Invalid config: ', configProject.error.issues)
  throw new Error('Enviroment Variables Invalid!!!')
}

const envConfig = configProject.data

export default envConfig