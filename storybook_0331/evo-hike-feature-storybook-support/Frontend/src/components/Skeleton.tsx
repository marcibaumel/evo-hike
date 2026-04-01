import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
    return <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} {...props} />;
};
