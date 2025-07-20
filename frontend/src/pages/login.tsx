import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  // TODO: image
  return (
    <div className="flex h-screen w-full flex-row">
      <img
        alt="register background "
        className=" w-1/2 object-cover lg:block rotate-180"
        src="/register-background.png"
      />
      <LoginForm />
    </div>
  );
}
