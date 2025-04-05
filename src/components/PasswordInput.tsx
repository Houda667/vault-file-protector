
import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PasswordInputProps {
  onChange: (password: string) => void;
  mode: 'encrypt' | 'decrypt';
}

const PasswordInput: React.FC<PasswordInputProps> = ({ onChange, mode }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const calculatePasswordStrength = useCallback((pass: string) => {
    if (!pass) return 0;
    
    let strength = 0;
    
    // Length check
    if (pass.length >= 8) strength += 1;
    if (pass.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    
    // Normalize to 0-100
    return Math.min(Math.floor((strength / 6) * 100), 100);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
    
    if (mode === 'encrypt') {
      setPasswordMismatch(confirmPassword !== '' && confirmPassword !== newPassword);
      if (confirmPassword === newPassword) {
        onChange(newPassword);
      }
    } else {
      onChange(newPassword);
    }
  }, [onChange, confirmPassword, calculatePasswordStrength, mode]);

  const handleConfirmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirm = e.target.value;
    setConfirmPassword(newConfirm);
    setPasswordMismatch(newConfirm !== password);
    
    if (newConfirm === password) {
      onChange(password);
    }
  }, [onChange, password]);

  const getStrengthColor = useCallback(() => {
    if (passwordStrength < 40) return 'password-strength-weak';
    if (passwordStrength < 70) return 'password-strength-medium';
    return 'password-strength-strong';
  }, [passwordStrength]);

  const getStrengthText = useCallback(() => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  }, [passwordStrength]);

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-vault-text">
          {mode === 'encrypt' ? 'Set encryption password' : 'Enter decryption password'}
        </label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'encrypt' ? 'Create a strong password' : 'Enter your password'}
            value={password}
            onChange={handlePasswordChange}
            className="pr-10 bg-vault-card/50 border-vault-card text-vault-text"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 text-vault-text-muted hover:text-vault-text"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </div>
        
        {mode === 'encrypt' && (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-vault-text-muted">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength < 40 ? 'text-vault-danger' :
                  passwordStrength < 70 ? 'text-vault-warning' :
                  'text-vault-success'
                }`}>
                  {getStrengthText()}
                </span>
              </div>
              <div className="h-1 w-full bg-vault-card/50 rounded">
                <div className={getStrengthColor()} style={{ width: `${passwordStrength}%` }}></div>
              </div>
            </div>
          
            <div className="pt-2">
              <label className="block text-sm font-medium text-vault-text">
                Confirm password
              </label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmChange}
                  className={`pr-10 bg-vault-card/50 border-vault-card text-vault-text ${
                    passwordMismatch ? 'border-vault-danger' : ''
                  }`}
                />
              </div>
            </div>
            
            {passwordMismatch && (
              <div className="flex items-center mt-1 text-xs text-vault-danger">
                <AlertTriangle size={12} className="mr-1" />
                Passwords do not match
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
