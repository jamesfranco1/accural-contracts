interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export default function Card({ children, className = "", bordered = true }: CardProps) {
  return (
    <div
      className={`
        bg-white 
        ${bordered ? "border border-black" : ""} 
        p-6 
        ${className}
      `}
    >
      {children}
    </div>
  );
}

