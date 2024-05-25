import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const profileApiRequest = {
  me: (sesstionToken: string) => http.get<AccountResType>('/account/me', {
    headers: {
      'Authorization': `Bearer ${sesstionToken}`,
    }
  }),
  meClient: () => http.get<AccountResType>('/account/me'),
  update: (body: any) => http.put<AccountResType>('/account/me', body)
}
export default profileApiRequest