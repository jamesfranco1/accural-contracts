interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-black/70 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

