import { environment } from "../../../config/environment";
import { createClient } from "@supabase/supabase-js/dist/index.cjs";

export const supabase = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_KEY
);
