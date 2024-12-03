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
    <div className="flex items-center">
      <Button
        onClick={togglePasswordVisibility}
        variant="ghost"
        className="translate-x-[-40px] p-0 bg-none"
      >
        {isPasswordVisible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordVisibilityButton;
