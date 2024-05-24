import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const profileApiRequest = {
  me: (sesstionToken: string) => http.get<AccountResType>('/account/me', {
    headers: {
      'Authorization': `Bearer ${sesstionToken}`,
    }
  }),
}
export default profileApiRequest