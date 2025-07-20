import { SignUpForm } from "@/components/SignUpForm";

// TODO: generer l'image
export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full flex-row">
      <SignUpForm />

      <img
        alt="register background "
        className=" w-1/2 object-cover lg:block"
        src="/register-background.png"
      />
    </div>
  );
}
