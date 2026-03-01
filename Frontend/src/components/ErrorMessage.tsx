import React from 'react';

interface ErrorMessageProps {
    children: React.ReactNode;
}
function ErrorMessage({ children }: ErrorMessageProps) {
    return <div className="">{children}</div>;
}
export default ErrorMessage;
