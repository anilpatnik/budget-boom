import { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";

export function PasswordStrength({ password }: { password: string }) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(String.empty);

  useEffect(() => {
    const result = zxcvbn(password);
    setScore(result.score);
    setFeedback(result.feedback.suggestions.join(" "));
  }, [password]);

  if (!password) return null;
  return (
    <p id="id-password-strength">
      {score >= 3
        ? "Your password meets all the necessary requirements"
        : feedback || "Your password is too weak"}
    </p>
  );
}
