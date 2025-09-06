import React from 'react';

export interface LoginScreenProps{
    onLogin?: (userName: string) => void;
}

declare const LoginScreen: React.FC<LoginScreenProps>
export default LoginScreen;