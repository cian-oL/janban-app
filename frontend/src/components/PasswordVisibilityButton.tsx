import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isPasswordVisible: boolean;
  setIsPasswordVisible: (value: boolean) => void;
};

const PasswordVisibilityButton = ({
  isPasswordVisible,
  setIsPasswordVisible,
}: Props) => {
  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="inline">
      <Button
        onClick={togglePasswordVisibility}
        variant="ghost"
        type="button"
        className="bg-none p-0"
      >
        {isPasswordVisible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordVisibilityButton;
