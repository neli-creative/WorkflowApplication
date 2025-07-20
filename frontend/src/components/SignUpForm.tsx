import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/services/authServices/authServices";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await authService.signup({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: password,
      });

      setSuccess("Inscription réussie ! Redirection vers la connexion...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Email already in use")) {
          setError("Cette adresse email est déjà utilisée");
        } else {
          setError(error.message);
        }
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {success}
            </div>
          )}

          <Input
            isRequired
            className="flex-1"
            isDisabled={isLoading}
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
            isDisabled={isLoading}
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
            isDisabled={isLoading}
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
                disabled={isLoading}
                tabIndex={-1}
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            isDisabled={isLoading}
            label="Mot de passe"
            name="password"
            placeholder="Entrer votre mot de passe (min. 6 caractères)"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            isRequired
            className="flex-1"
            color={
              password && confirmPassword && password !== confirmPassword
                ? "danger"
                : "default"
            }
            endContent={
              <button
                className="absolute top-5 right-3 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
                tabIndex={-1}
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            isDisabled={isLoading}
            label="Confirmer votre mot de passe"
            name="confirmPassword"
            placeholder="Confirmer votre mot de passe"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {password && confirmPassword && (
            <div
              className={`text-sm ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}
            >
              {password === confirmPassword
                ? "✓ Les mots de passe correspondent"
                : "✗ Les mots de passe ne correspondent pas"}
            </div>
          )}

          <Button
            className="p-2 mt-5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed min-w-10 h-13 text-white"
            isDisabled={isLoading || success !== ""}
            isLoading={isLoading}
            type="submit"
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
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
