import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api/axiosConfig';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const AuthHeader = styled.div`
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  padding: 30px;
  text-align: center;
`;

const AuthTitle = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
`;

const AuthSubtitle = styled.p`
  margin: 10px 0 0;
  opacity: 0.9;
`;

const AuthForm = styled.form`
  padding: 30px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 25px;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #667eea;
`;

const AuthInput = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    outline: none;
  }
`;

const PasswordToggle = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  color: #667eea;
  cursor: pointer;
`;

const AuthButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  padding: 20px;
  border-top: 1px solid #eee;
`;

const AuthLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin: 0 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #00b894;
  background: rgba(0, 184, 148, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isForgotPassword) {
        await api.post("/api/auth/forgot-password", {
          email: formData.usernameOrEmail
        });
        setSuccess('Password reset link has been sent to your email!');
      } else {
        const loginData = {
          usernameOrEmail: formData.usernameOrEmail.trim(),
          password: formData.password
        };
        
        console.log('Attempting login with:', { ...loginData, password: '[REDACTED]' });
        
        const res = await api.post("/api/auth/login", loginData);
        
        console.log('Login response:', res.data);
        
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          setSuccess('Login successful! Redirecting...');
          
          setTimeout(() => {
            navigate('/wel', { replace: true });
          }, 1000);
        } else {
          console.error('No token in response:', res.data);
          setError('Invalid response from server - no token received');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        console.error('Error response:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
        
        if (err.response.status === 401) {
          setError('Invalid username/email or password');
        } else if (err.response.status === 403) {
          setError('Access denied. Please check your credentials and try again.');
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please try again later.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthTitle>
            {isForgotPassword ? 'Reset Your Password' : 'Welcome Back'}
          </AuthTitle>
          <AuthSubtitle>
            {isForgotPassword 
              ? 'Enter your email to receive a reset link' 
              : 'Sign in to continue to your account'}
          </AuthSubtitle>
        </AuthHeader>

        <AuthForm onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <InputGroup>
            <InputIcon>
              {isForgotPassword ? <FaEnvelope /> : <FaUser />}
            </InputIcon>
            <AuthInput
              type={isForgotPassword ? "email" : "text"}
              name="usernameOrEmail"
              placeholder={isForgotPassword ? "Email Address" : "Username or Email"}
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
              autoComplete={isForgotPassword ? "email" : "username"}
            />
          </InputGroup>

          {!isForgotPassword && (
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <AuthInput
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </InputGroup>
          )}

          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : isForgotPassword ? 'Send Reset Link' : 'Sign In'}
          </AuthButton>

          <AuthFooter>
            {isForgotPassword ? (
              <>
                Remember your password?{' '}
                <AuthLink 
                  as="button" 
                  onClick={() => {
                    setIsForgotPassword(false);
                    setFormData({ usernameOrEmail: '', password: '' });
                  }}
                >
                  Sign In
                </AuthLink>
              </>
            ) : (
              <>
                Forgot your password?{' '}
                <AuthLink as="button" onClick={() => setIsForgotPassword(true)}>
                  Reset it
                </AuthLink>
              </>
            )}
            <br />
            Don't have an account?{' '}
            <AuthLink to="/register">Sign Up</AuthLink>
          </AuthFooter>
        </AuthForm>
      </AuthCard>
    </AuthContainer>
  );
}

export default Login;