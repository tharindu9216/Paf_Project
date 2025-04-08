import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Keyframe animations
const gradientBG = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Styled components
const HeroContainer = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2, #ff6b6b, #00b894);
  background-size: 300% 300%;
  animation: ${gradientBG} 12s ease infinite;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 0 20px;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  background: linear-gradient(to right, #fff, #f5f5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.8rem;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-bottom: 3rem;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Button = styled(motion.button)`
  padding: 18px 36px;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
    z-index: -1;
    transition: all 0.4s ease;
  }

  &:hover::before {
    background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent);
  }
`;

const PrimaryButton = styled(Button)`
  background: white;
  color: #667eea;
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid white;
`;

const FloatingFood = styled(motion.div)`
  position: absolute;
  font-size: 3rem;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));
  z-index: 5;
  animation: ${float} 6s ease-in-out infinite;
`;

const FeaturesContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
  flex-wrap: wrap;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255,255,255,0.15);
  padding: 30px;
  border-radius: 20px;
  max-width: 280px;
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-10px) scale(1.03);
    background: rgba(255,255,255,0.25);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.2);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
`;

function Home() {
  const navigate = useNavigate();

  // Food items with different animation delays
  const foodItems = [
    { icon: '🍕', delay: 0, left: '10%', top: '20%' },
    { icon: '🍔', delay: 0.5, left: '85%', top: '30%' },
    { icon: '🍣', delay: 1, left: '15%', top: '70%' },
    { icon: '🍩', delay: 1.5, left: '80%', top: '75%' },
    { icon: '🥗', delay: 0.8, left: '25%', top: '50%' },
    { icon: '🍰', delay: 1.2, left: '75%', top: '55%' }
  ];

  return (
    <HeroContainer>
      {foodItems.map((food, index) => (
        <FloatingFood
          key={index}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -40, 0], opacity: 1 }}
          transition={{
            duration: 6,
            delay: food.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut'
          }}
          style={{
            left: food.left,
            top: food.top,
            fontSize: `${Math.random() * 2 + 2}rem`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          {food.icon}
        </FloatingFood>
      ))}

      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Discover Culinary Magic
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Journey through a world of flavors with recipes crafted by global chefs, 
          food enthusiasts, and culinary experts.
        </HeroSubtitle>
        
        <ButtonContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PrimaryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/wel')}
          >
            Begin Your Journey
          </PrimaryButton>
          <SecondaryButton
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/addrecipe')}
          >
            Share Your Creation
          </SecondaryButton>
        </ButtonContainer>
        
        <FeaturesContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FeatureCard
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon>👨‍🍳</FeatureIcon>
            <FeatureTitle>Chef-Curated</FeatureTitle>
            <FeatureText>Recipes perfected by Michelin-star chefs and culinary masters</FeatureText>
          </FeatureCard>
          <FeatureCard
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
          >
            <FeatureIcon>🌎</FeatureIcon>
            <FeatureTitle>Global Cuisine</FeatureTitle>
            <FeatureText>Authentic dishes from every corner of the world</FeatureText>
          </FeatureCard>
          <FeatureCard
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          >
            <FeatureIcon>❤️</FeatureIcon>
            <FeatureTitle>Personalized</FeatureTitle>
            <FeatureText>Save and organize your favorite recipes effortlessly</FeatureText>
          </FeatureCard>
        </FeaturesContainer>
      </HeroContent>
    </HeroContainer>
  );
}

export default Home;