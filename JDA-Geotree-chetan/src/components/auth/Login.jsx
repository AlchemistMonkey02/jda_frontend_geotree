import React, { useState } from 'react';
import client from '../../api/client';
import { ENDPOINTS } from '../../api/config';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { showSuccess } = useToast();
    const { login } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!mobileNumber || mobileNumber.length < 10) {
            return;
        }

        setLoading(true);
        try {
            await client.post(ENDPOINTS.AUTH.SEND_OTP, { mobileNumber });
            setIsOtpSent(true);
            showSuccess('OTP Sent: 123456'); // Mock OTP
        } catch (error) {
            console.error(error);
            // Error handled by global interceptor
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
                response = await client.post(ENDPOINTS.AUTH.SIGNUP, {
                    name,
                    email,
                    mobileNumber,
                    otp
                });
            } else {
                response = await client.post(ENDPOINTS.AUTH.LOGIN, { mobileNumber, otp });
            }

            const { token, ...userData } = response.data;
            const user = { ...userData, token };

            showSuccess(`Welcome back, ${user.name}!`);
            login(user); // Use context to login and switch screen

        } catch (error) {
            console.error(error);
            // Error handled by global interceptor
        } finally {
            setLoading(false);
        }
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
                <div className="bg-[#2d4a22] w-full px-8 pb-6 pt-2 flex flex-col rounded-b-none">

                    {/* Login Heading */}
                    <div className="mb-5 relative">
                        <h2 className="text-3xl font-bold text-white tracking-wide">
                            {isOtpSent ? 'Verify OTP' : (isSignup ? 'Register' : 'Login')}
                        </h2>
                        <div className="absolute -bottom-2 left-0 w-12 h-1 bg-[#E8EDDE] rounded-full"></div>
                    </div>

                    <form onSubmit={isOtpSent ? handleLogin : handleSendOtp} className="w-full flex flex-col gap-4">

                        {/* Signup Fields */}
                        {isSignup && !isOtpSent && (
                            <div className="flex flex-col gap-4 animate-fade-in-down">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[#98AA88] font-bold text-sm tracking-wide">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="bg-transparent border-b-2 border-[#E8EDDE]/50 focus:border-[#E8EDDE] text-white placeholder-white/50 focus:outline-none w-full font-medium pb-2 transition-colors"
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
                            </div>
                        )}

                        {/* Mobile Number */}
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
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    placeholder="+91 01234 56789"
                                    className="bg-transparent text-white placeholder-white/50 focus:outline-none w-full font-medium"
                                    disabled={isOtpSent}
                                />
                            </div>
                        </div>

                        {/* OTP Input */}
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
                                    />
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
                            {loading ? 'Processing...' : (isOtpSent ? (isSignup ? 'Verify & Register' : 'Verify & Login') : 'Send OTP')}
                        </button>

                        {/* Switch Mode */}
                        {!isOtpSent && (
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-[#98AA88] text-sm">{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
                                <button
                                    type="button"
                                    onClick={() => { setIsSignup(!isSignup); setMobileNumber(''); setName(''); setEmail(''); }}
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
