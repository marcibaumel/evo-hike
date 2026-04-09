import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    width?: 'sm' | 'md' | 'lg' | 'full';
    height?: 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'rounded' | 'circle' | 'square';
}

export const Skeleton = ({ className = '', width, height, shape, ...props }: SkeletonProps) => {
    return <div className={`animate-pulse bg-white/5 ${className}`} {...props} />;
};