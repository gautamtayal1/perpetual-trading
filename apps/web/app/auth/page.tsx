"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';

const Auth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOTP = async() => {
    await fetch('/api/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: phoneNumber }),
      headers: { 'Content-Type': 'application/json' },
    })
      setShowOTP(true);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyAndLogin = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: phoneNumber, code: otp.join('') }),
      headers: { 'Content-Type': 'application/json' },
    })

    const json = await res.json()
    if (json.success) {
      await signIn('credentials', { phoneNumber: phoneNumber, callbackUrl: '/' })
    } else {
      alert('OTP verification failed')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-70" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTAgMGgxMHYxMEgwek0xMiAwaDEwdjEwSDEyek0yNCAwaDEwdjEwSDI0ek0zNiAwaDEwdjEwSDM2ek00OCAwaDEwdjEwSDQ4ek0wIDEyaDEwdjEwSDB6TTEyIDEyaDEwdjEwSDEyek0yNCAxMmgxMHYxMEgyNHpNMzYgMTJoMTB2MTBIMzZ6TTQ4IDEyaDEwdjEwSDQ4ek0wIDI0aDEwdjEwSDB6TTEyIDI0aDEwdjEwSDEyek0yNCAyNGgxMHYxMEgyNHpNMzYgMjRoMTB2MTBIMzZ6TTQ4IDI0aDEwdjEwSDQ4ek0wIDM2aDEwdjEwSDB6TTEyIDM2aDEwdjEwSDEyek0yNCAzNmgxMHYxMEgyNHpNMzYgMzZoMTB2MTBIMzZ6TTQ4IDM2aDEwdjEwSDQ4ek0wIDQ4aDEwdjEwSDB6TTEyIDQ4aDEwdjEwSDEyek0yNCA0OGgxMHYxMEgyNHpNMzYgNDhoMTB2MTBIMzZ6TTQ4IDQ4aDEwdjEwSDQ4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect w-full max-w-md rounded-2xl p-8 relative z-10 border border-gray-800/50"
      >
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold mb-2">
            <span className="text-yellow-500">PERPETUAL</span>
            <span className="text-white ml-2">FUTURES</span>
          </h2>
          <p className="text-gray-400">Access your trading account</p>
        </div>

        <AnimatePresence mode="wait">
          {!showOTP ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="relative mb-6">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOTP}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-medium py-4 rounded-xl flex items-center justify-center space-x-2 shadow-glow hover:shadow-xl transition-all duration-300"
              >
                <span>Send OTP</span>
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn('credentials', { phoneNumber: '1234', callbackUrl: '/' })}
                className="w-full mt-4 bg-gray-800 border border-gray-700 text-gray-300 font-medium py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-700 transition-all duration-300"
              >
                <span>Demo Mode</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <Lock className="text-yellow-500" size={24} />
              </div>
              <p className="text-gray-300 mb-6">Enter the verification code sent to {phoneNumber}</p>
              
              <div className="flex justify-between mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center bg-gray-900/50 border border-gray-800 rounded-lg text-white text-xl font-display focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                ))}
              </div>
             
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-medium py-4 rounded-xl shadow-glow hover:shadow-xl transition-all duration-300"
                onClick={handleVerifyAndLogin}
              >
                Verify OTP
              </motion.button>

              <button 
                onClick={() => setShowOTP(false)}
                className="mt-4 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                Change Phone Number
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;