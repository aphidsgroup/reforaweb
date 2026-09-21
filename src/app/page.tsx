import { redirect } from "next/navigation";

// Root route — redirect to the store homepage
export default function RootPage() {
  redirect("/");
}
