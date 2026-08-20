import { redirect } from "next/navigation";

export default function WorkerRegisterRedirect() {
  redirect("/auth/worker/register");
}
