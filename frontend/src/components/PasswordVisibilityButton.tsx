import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isPasswordVisible: boolean;
  onToggleClick: () => void;
};

const PasswordVisibilityButton = ({
  isPasswordVisible,
  onToggleClick,
}: Props) => {
  return (
    <div className="flex items-center">
      <Button
        onClick={onToggleClick}
        variant="ghost"
        className="translate-x-[-40px] p-0 bg-none"
      >
        {isPasswordVisible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordVisibilityButton;
