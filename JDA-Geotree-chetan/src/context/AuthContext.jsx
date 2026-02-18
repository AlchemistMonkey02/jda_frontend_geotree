import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Screens: 'ONBOARDING', 'LOGIN', 'SPLASH', 'APP'
    const [currentScreen, setCurrentScreen] = useState('ONBOARDING');

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setCurrentScreen('APP');
            } else if (hasSeenOnboarding) {
                setCurrentScreen('LOGIN');
            } else {
                setCurrentScreen('ONBOARDING');
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // Flow: Login -> Splash -> App
        setCurrentScreen('SPLASH');
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setCurrentScreen('LOGIN');
    };

    const completeOnboarding = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        setCurrentScreen('LOGIN');
    };

    const finishSplash = () => {
        setCurrentScreen('APP');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            currentScreen,
            login,
            logout,
            completeOnboarding,
            finishSplash,
            setCurrentScreen // Exposing if needed for specific overrides
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
