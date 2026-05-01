import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-sm border border-gray-100 p-6',
      hover && 'hover:shadow-md transition-shadow duration-200',
      className,
    )}>
      {children}
    </div>
  );
}
