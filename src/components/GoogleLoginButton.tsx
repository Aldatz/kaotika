import { signIn, useSession } from "next-auth/react";
import MedievalButton from "./MedievalButton";

export default function GoogleLoginButton() {
  const { data: session, status } = useSession();

  if (!session) {
    return (
      <MedievalButton onClick={() => signIn("google")}>
        Google Signin
      </MedievalButton>
    );
  } else {
    return null;
  }
}