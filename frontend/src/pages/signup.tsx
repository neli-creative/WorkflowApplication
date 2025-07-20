import { SignUpForm } from "@/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col sm:flex-row h-screen w-full">
      <SignUpForm />

      <img
        alt="register background "
        className=" hidden sm:block sm:w-1/2 object-cover"
        src="/register-background.png"
      />
    </div>
  );
}
