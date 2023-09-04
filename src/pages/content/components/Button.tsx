interface ButtonProps {
  label: string;
  icon?: JSX.Element;
  onClick: (any) => void;
}

// Button Component
const Button: React.FC<ButtonProps> = ({ label, icon, onClick }) => (
  <button
    className="w-36 h-9.5 self-end bg-gh-button-color hover:bg-gh-button-hover hover:border-gh-button-hover-border active:bg-gh-button-active border-gh-button-border border-1 text-white rounded-md px-4 py-2 flex items-center"
    onClick={onClick}
  >
    <div className="w-36 flex items-center flex-grow justify-center">
      {icon && <span className="h-5 w-5 mr-2">{icon}</span>}
      {label}
    </div>
  </button>
);

export default Button;
