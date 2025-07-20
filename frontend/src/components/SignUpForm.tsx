import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// TODO: logique + optiliser le compsoiant
export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Gestionnaire de soumission avec gestion des erreurs
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      email,
      firstName,
      lastName,
      password,
    });
  };

  return (
    <div className="w-1/2 flex flex-col items-center justify-center p-30">
      <div className="text-left mb-12 w-full">
        <h2 className="text-gray-900 text-4xl font-semibold mb-4">
          Créer un compte
        </h2>
        <p className="text-gray-500 text-md">
          Remplissez le formulaire ci-dessous pour vous inscrire.
        </p>
      </div>

      <Form className="relative w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 backdrop-blur-sm transition-all duration-200 w-full">
          <Input
            isRequired
            className="flex-1"
            label="Prénom"
            name="firstname"
            placeholder="Entrer votre prénom"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            isRequired
            className="flex-1"
            label="Nom"
            name="lastname"
            placeholder="Entrer votre nom"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            isRequired
            className="flex-1"
            label="Email"
            name="email"
            placeholder="Entrer votre email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            isRequired
            className="flex-1"
            endContent={
              <button
                className="absolute top-5 right-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            label="Mot de passe"
            name="password"
            placeholder="Entrer votre mot de passe"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            isRequired
            className="flex-1"
            endContent={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-5 right-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            label="Confirmer votre mot de passe"
            name="confirmPassword"
            placeholder="Confirmer votre mot de passe"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            className="p-2 mt-5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed min-w-10 h-13 text-white"
            type="submit"
          >
            S’inscrire
          </Button>
        </div>
      </Form>

      <div className="mt-6 text-gray-500 text-sm">
        Déjà un compte ?{" "}
        <a className="text-gray-900 hover:underline" href="/login">
          Se connecter
        </a>
      </div>
    </div>
  );
}
