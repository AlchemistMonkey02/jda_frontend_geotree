import React, { useState } from 'react';
import client from '../../api/client';
import { ENDPOINTS } from '../../api/config';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { showSuccess, showError } = useToast();
    const { login } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'

    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!mobileNumber || mobileNumber.length < 10) {
            return;
        }

        setLoading(true);
        try {
            await client.post(ENDPOINTS.AUTH.SEND_OTP, { mobileNumber, isLogin: !isSignup });
            setIsOtpSent(true);
            showSuccess('OTP Sent: 123456'); // Mock OTP
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                showError(error.response.data.message || 'User not found');
            } else {
                showError('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (isSignup) {
                // Determine if we are finishing signup or just logging in via OTP
                // Currently signup flow: OTP Verify -> Fill Details (Name, Email, Password) -> Submit to SIGNUP
                response = await client.post(ENDPOINTS.AUTH.SIGNUP, {
                    name,
                    email,
                    mobileNumber,
                    otp,
                    password // Send password if provided
                });
            } else {
                if (loginMethod === 'otp') {
                    response = await client.post(ENDPOINTS.AUTH.LOGIN, { mobileNumber, otp });
                } else {
                    response = await client.post(ENDPOINTS.AUTH.LOGIN_PASSWORD, { mobileNumber, password });
                }
            }

            const { token, ...userData } = response.data;
            const user = { ...userData, token };

            showSuccess(`Welcome back, ${user.name}!`);
            login(user); // Use context to login and switch screen

        } catch (error) {
            console.error(error);
            if (error.response) {
                showError(error.response.data.message || 'Login failed');
            } else {
                showError('Login failed. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        // Reset states
        setLoginMethod('otp'); // Default to OTP for new Signup flow
        setMobileNumber('');
        setName('');
        setEmail('');
        setPassword('');
        setOtp('');
        setIsOtpSent(false);
    };

    return (
        <div
            className="h-[100dvh] w-full flex flex-col font-outfit relative overflow-hidden bg-[#E8EDDE] select-none bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/login bg.png')" }}
        >

            {/* Top Section: Logo & Tagline */}
            <div className="w-full flex flex-col items-center pt-12 sm:pt-16 z-0 text-center px-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-transform duration-300">
                    <img src="/images/jda.png" alt="JDA Logo" className="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <h2 className="text-[#98AA88] font-bold text-lg sm:text-l tracking-wide mt-2 px-4 leading-relaxed max-w-sm">
                    Plant a tree and help us to <br /> cure our planet
                </h2>
            </div>

            {/* Bottom Section: Dark Green Wave & Form */}
            <div className="absolute bottom-0 left-0 right-0 w-full z-10">

                {/* Wave SVG */}
                <div className="w-full relative -mb-1">
                    <svg viewBox="0 0 1440 320" className="w-full h-auto block" preserveAspectRatio="none">
                        <path fill="#2d4a22" fillOpacity="1" d="M0,192L60,197.3C120,203,240,213,360,192C480,171,600,117,720,112C840,107,960,149,1080,165.3C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Form Container */}
                <div className="bg-[#2d4a22] w-full px-8 pb-6 pt-2 flex flex-col rounded-b-none min-h-[400px]">

                    {/* Login Heading */}
                    <div className="mb-5 relative flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-wide">
                                {isOtpSent ? 'Verify OTP' : (isSignup ? 'Register' : 'Login')}
                            </h2>
                            <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#E8EDDE] rounded-full"></div>
                        </div>

                        {!isSignup && !isOtpSent && (
                            <div className="flex gap-4 text-sm font-medium text-[#98AA88]">
                                <button
                                    onClick={() => setLoginMethod('otp')}
                                    className={`${loginMethod === 'otp' ? 'text-white border-b-2 border-white' : 'hover:text-white transition-colors'}`}
                                >
                                    OTP
                                </button>
                                <button
                                    onClick={() => setLoginMethod('password')}
                                    className={`${loginMethod === 'password' ? 'text-white border-b-2 border-white' : 'hover:text-white transition-colors'}`}
                                >
                                    Password
                                </button>
                            </div>
                        )}
                    </div>

                    <form onSubmit={
                        isSignup
                            ? (isOtpSent ? handleLogin : handleSendOtp)
                            : (loginMethod === 'otp' && !isOtpSent ? handleSendOtp : handleLogin)
                    } className="w-full flex flex-col gap-4">

                        {/* Signup Fields (Shown after OTP verification in Signup flow, or handled differently?) 
                            Wait, current logic: Send OTP -> isOtpSent=true -> User enters OTP + Name + Email -> Submit (Signup)
                            So if isSignup:
                                Step 1: !isOtpSent -> Input Mobile -> Send OTP
                                Step 2: isOtpSent -> Input OTP, Name, Email -> Signup
                        */}

                        {isSignup && isOtpSent && (
                            <div className="flex flex-col gap-4 animate-fade-in-down">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#98AA88] font-bold text-sm tracking-wide">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="bg-transparent border-b-2 border-[#E8EDDE]/50 focus:border-[#E8EDDE] text-white placeholder-white/50 focus:outline-none w-full font-medium pb-2 transition-colors"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#98AA88] font-bold text-sm tracking-wide">Email (Optional)</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="bg-transparent border-b-2 border-[#E8EDDE]/50 focus:border-[#E8EDDE] text-white placeholder-white/50 focus:outline-none w-full font-medium pb-2 transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#98AA88] font-bold text-sm tracking-wide">Create Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a password"
                                            className="bg-transparent border-b-2 border-[#E8EDDE]/50 focus:border-[#E8EDDE] text-white placeholder-white/50 focus:outline-none w-full font-medium pb-2 transition-colors pr-8"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-0 mt-1 text-[#E8EDDE] hover:text-white"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mobile Number (Always visible unless verify step? No, always visible) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#98AA88] font-bold text-sm tracking-wide">Mobile number</label>
                            <div className="flex items-center border-b-2 border-[#E8EDDE]/50 focus-within:border-[#E8EDDE] transition-colors pb-2">
                                <span className="text-[#E8EDDE] mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </span>
                                <span className="text-white font-medium mr-1">|</span>
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) setMobileNumber(value);
                                    }}
                                    placeholder="Enter your 10-digit mobile number"
                                    className="bg-transparent text-white placeholder-white/50 focus:outline-none w-full font-medium"
                                    disabled={isOtpSent}
                                    required
                                />
                            </div>
                        </div>

                        {/* OTP Input (Shown if OTP sent) */}
                        {isOtpSent && (
                            <div className="flex flex-col gap-2 animate-fade-in-up">
                                <label className="text-[#98AA88] font-bold text-sm tracking-wide">OTP</label>
                                <div className="flex items-center border-b-2 border-[#E8EDDE]/50 focus-within:border-[#E8EDDE] transition-colors pb-2">
                                    <span className="text-[#E8EDDE] mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <span className="text-white font-medium mr-1">|</span>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="012345"
                                        className="bg-transparent text-white placeholder-white/50 focus:outline-none w-full font-medium"
                                        required={isOtpSent}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password Input (Login mode only, if method is password) */}
                        {!isSignup && loginMethod === 'password' && (
                            <div className="flex flex-col gap-2 animate-fade-in-up">
                                <label className="text-[#98AA88] font-bold text-sm tracking-wide">Password</label>
                                <div className="flex items-center border-b-2 border-[#E8EDDE]/50 focus-within:border-[#E8EDDE] transition-colors pb-2">
                                    <span className="text-[#E8EDDE] mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <span className="text-white font-medium mr-1">|</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                        className="bg-transparent text-white placeholder-white/50 focus:outline-none w-full font-medium"
                                        required={loginMethod === 'password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[#E8EDDE] hover:text-white ml-2 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Remember & Resend */}
                        <div className="flex items-center justify-between text-xs sm:text-sm mt-1">
                            {!isSignup && (
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-[#E8EDDE] bg-transparent text-[#2d4a22] focus:ring-0 checked:bg-[#E8EDDE] transition-all"
                                    />
                                    <span className="text-[#98AA88] group-hover:text-white transition-colors">Remember Me</span>
                                </label>
                            )}
                            {isOtpSent && (
                                <button type="button" onClick={handleSendOtp} className="text-[#E1E4CA] underline underline-offset-2 hover:text-white transition-colors ml-auto">
                                    Resend otp?
                                </button>
                            )}
                        </div>

                        {/* Action Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-[#E8EDDE] text-[#2d4a22] font-bold text-lg rounded-xl shadow-lg hover:bg-white active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (
                                isSignup
                                    ? (isOtpSent ? 'Verify & Register' : 'Send OTP')
                                    : (loginMethod === 'otp' ? (isOtpSent ? 'Verify & Login' : 'Send OTP') : 'Login')
                            )}
                        </button>

                        {/* Switch Mode */}
                        {!isOtpSent && (
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-[#98AA88] text-sm">{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="text-white font-bold text-sm underline hover:text-[#E8EDDE] transition-colors"
                                >
                                    {isSignup ? 'Login' : 'Sign Up'}
                                </button>
                            </div>
                        )}

                        {isOtpSent && (
                            <button
                                type="button"
                                onClick={() => { setIsOtpSent(false); setOtp(''); }}
                                className="text-white text-xs mt-2 text-center underline hover:text-[#E8EDDE]"
                            >
                                Change Number
                            </button>
                        )}
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Login;
