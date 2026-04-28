import React from 'react';
import { cn } from '@/src/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  title,
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizes = {
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-4 py-2 text-[12px]',
    lg: 'px-6 py-3 text-[14px]',
  };

  return (
    <button 
      title={title}
      className={cn(
        'btn disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export const Card = ({ children, className, level = 2, ...props }: CardProps) => {
  const levels = {
    1: 'card-l1',
    2: 'card-l2',
    3: 'card-l3',
  };

  return (
    <div className={cn(levels[level], className)} {...props}>
      {children}
    </div>
  );
};

export const StatusBadge = ({ status, label }: { status: 'success' | 'warning' | 'error' | 'info'; label: string }) => {
  const styles = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-danger',
    info: 'bg-accent/10 text-text-primary border border-accent/20',
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', styles[status])}>
      {label}
    </span>
  );
};

export const Divider = () => <hr className="border-border my-10" />;

export const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      "w-full px-6 py-4 rounded-lg bg-neutral border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm",
      className
    )}
    {...props}
  />
);

export const SectionBlock = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <div className="space-y-6 mt-10">
    <div className="space-y-1">
      <h3 className="text-xl font-bold text-primary tracking-tight m-0">{title}</h3>
      {description && <p className="text-sm text-text-secondary leading-relaxed max-w-2xl font-medium m-0">{description}</p>}
    </div>
    {children}
  </div>
);

export const Stepper = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => (
  <div className="flex items-center justify-between w-full mb-16">
    {steps.map((step, idx) => (
      <React.Fragment key={idx}>
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all",
            idx <= currentStep 
              ? "bg-secondary text-white shadow-md" 
              : "bg-neutral border border-border text-text-muted"
          )}>
            {idx + 1}
          </div>
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest transition-colors",
            idx <= currentStep ? "text-primary" : "text-text-muted"
          )}>
            {step}
          </span>
        </div>
        {idx < steps.length - 1 && (
          <div className={cn(
            "h-[2px] flex-1 mx-2 transition-all",
            idx < currentStep ? "bg-secondary" : "bg-border"
          )} />
        )}
      </React.Fragment>
    ))}
  </div>
);
