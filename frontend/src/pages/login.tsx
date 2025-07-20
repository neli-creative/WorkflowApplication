import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col sm:flex-row h-screen w-full">
      <img
        alt="register background "
        className=" hidden sm:block sm:w-1/2 object-cover rotate-180"
        src="/register-background.png"
      />
      <LoginForm />
    </div>
  );
}
