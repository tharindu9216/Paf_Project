import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import api from '../api/axiosConfig';
import './RecipeDisplay.css';


const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const RegisterHeader = styled.div`
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  padding: 30px;
  text-align: center;
`;

const RegisterTitle = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
`;

const RegisterSubtitle = styled.p`
  margin: 10px 0 0;
  opacity: 0.9;
`;

const RegisterForm = styled.form`
  padding: 30px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
  flex: 1;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #667eea;
`;

const RegisterInput = styled.input`
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

const RegisterButton = styled.button`
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

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;

const StyledLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #00b894;
  background: rgba(0, 184, 148, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setSuccess('');
    
    try {
      // Prepare the registration data to match the backend's expected format
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      
      console.log('Attempting registration with:', { ...registrationData, password: '[REDACTED]' });
      const res = await api.post("/api/auth/register", registrationData);
      
      console.log('Registration response:', res.data);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      
      if (err.response?.status === 403) {
        setError('Registration is currently disabled. Please try again later.');
      } else if (err.response?.status === 409) {
        setError('Username or email is already taken.');
      } else {
        const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
        setErrors(prev => ({ ...prev, form: errorMsg }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Create Your Account</RegisterTitle>
          <RegisterSubtitle>Join our community today</RegisterSubtitle>
        </RegisterHeader>

        <RegisterForm onSubmit={handleSubmit}>
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}

          <FormRow>
            <InputGroup>
              <InputIcon><FaUser /></InputIcon>
              <RegisterInput
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputIcon><FaUser /></InputIcon>
              <RegisterInput
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
            </InputGroup>
          </FormRow>

          <FormRow>
            <InputGroup>
              <InputIcon><FaEnvelope /></InputIcon>
              <RegisterInput
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputIcon><FaPhone /></InputIcon>
              <RegisterInput
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </InputGroup>
          </FormRow>

          <InputGroup>
            <InputIcon><MdDateRange /></InputIcon>
            <RegisterInput
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
            />
            {errors.dob && <ErrorMessage>{errors.dob}</ErrorMessage>}
          </InputGroup>

          <FormRow>
            <InputGroup>
              <InputIcon><FaMapMarkerAlt /></InputIcon>
              <RegisterInput
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <RegisterInput
                type="text"
                name="state"
                placeholder="State/Province"
                value={formData.state}
                onChange={handleChange}
              />
            </InputGroup>
          </FormRow>

          <InputGroup>
            <RegisterInput
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <RegisterInput
              type="text"
              name="zipCode"
              placeholder="ZIP/Postal Code"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaUser /></InputIcon>
            <RegisterInput
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputIcon><FaLock /></InputIcon>
            <RegisterInput
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputIcon><FaLock /></InputIcon>
            <RegisterInput
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <PasswordToggle onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </RegisterButton>

          <LoginLink>
            Already have an account? <StyledLink to="/login">Sign In</StyledLink>
          </LoginLink>
        </RegisterForm>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register;