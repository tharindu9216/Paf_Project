import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// Particle background component
const ParticlesBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            zIndex: 1
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, particle.opacity, 0],
            x: [`${particle.x}%`, `${particle.x + (Math.random() * 20 - 10)}%`],
            y: [`${particle.y}%`, `${particle.y + (Math.random() * 20 - 10)}%`]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}
    </>
  );
};

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

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Glass morphism effect
const glassEffect = css`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
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
  padding: 40px 0;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  background: linear-gradient(90deg, #fff, #f5f5f5, #fff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  animation: ${shimmer} 3s linear infinite;

  @media (max-width: 1024px) {
    font-size: 4rem;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
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
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

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
  min-width: 220px;

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
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    transition: all 0.3s ease;
  }

  &:hover::after {
    left: 100%;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FloatingFood = styled(motion.div)`
  position: absolute;
  font-size: 3rem;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));
  z-index: 5;
  animation: ${float} 6s ease-in-out infinite;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2) !important;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
    animation-play-state: paused;
  }
`;

const FeaturesContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 50px;
  width: 100%;
`;

const FeatureCard = styled(motion.div)`
  ${glassEffect}
  padding: 30px;
  border-radius: 20px;
  transition: all 0.4s ease;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    transition: all 0.6s ease;
  }

  &:hover::before {
    left: 100%;
    top: 100%;
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  ${glassEffect}
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.4s ease;

  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(10deg);
    background: rgba(255, 255, 255, 0.3);
  }
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
  font-weight: 300;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  cursor: pointer;
`;

const ScrollText = styled.span`
  font-size: 0.9rem;
  margin-bottom: 10px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ScrollLine = styled(motion.div)`
  width: 2px;
  height: 40px;
  background: white;
  border-radius: 2px;
`;

const FloatingTooltip = styled(motion.div)`
  position: absolute;
  ${glassEffect}
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 0.9rem;
  pointer-events: none;
  z-index: 100;
  white-space: nowrap;
`;

const SeasonalBanner = styled(motion.div)`
  ${glassEffect}
  padding: 15px 30px;
  border-radius: 50px;
  margin-bottom: 30px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Sparkle = styled.span`
  display: inline-block;
  animation: ${float} 2s ease-in-out infinite;
`;

function Home() {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const featuresRef = useRef(null);

  const foodItems = [
    { icon: '🍕', name: 'Pizza', delay: 0, left: '10%', top: '20%' },
    { icon: '🍔', name: 'Burger', delay: 0.5, left: '85%', top: '30%' },
    { icon: '🍣', name: 'Sushi', delay: 1, left: '15%', top: '70%' },
    { icon: '🍩', name: 'Donut', delay: 1.5, left: '80%', top: '75%' },
    { icon: '🥗', name: 'Salad', delay: 0.8, left: '25%', top: '50%' },
    { icon: '🍰', name: 'Cake', delay: 1.2, left: '75%', top: '55%' }
  ];

  const features = [
    {
      icon: '👨‍🍳',
      title: 'Chef-Curated',
      text: 'Recipes perfected by Michelin-star chefs and culinary masters with step-by-step video guides'
    },
    {
      icon: '🌎',
      title: 'Global Cuisine',
      text: 'Authentic dishes from every corner of the world with cultural insights and history'
    },
    {
      icon: '❤️',
      title: 'Personalized',
      text: 'AI-powered recommendations based on your taste preferences and dietary needs'
    },
    {
      icon: '⏱️',
      title: 'Smart Cooking',
      text: 'Interactive timers, measurement converters, and smart kitchen integration'
    }
  ];

  const handleFoodHover = (event, name) => {
    setTooltip({
      visible: true,
      text: name,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleFoodLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handleScrollClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (featuresRef.current) {
        const top = featuresRef.current.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.75) {
          controls.start('visible');
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <HeroContainer>
      <ParticlesBackground />
      
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
          onMouseEnter={(e) => handleFoodHover(e, food.name)}
          onMouseMove={(e) => setTooltip({
            ...tooltip,
            x: e.clientX,
            y: e.clientY
          })}
          onMouseLeave={handleFoodLeave}
        >
          {food.icon}
        </FloatingFood>
      ))}

      <AnimatePresence>
        {tooltip.visible && (
          <FloatingTooltip
            initial={{ opacity: 0, y: tooltip.y - 10 }}
            animate={{ opacity: 1, y: tooltip.y, x: tooltip.x }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              left: tooltip.x + 15,
              top: tooltip.y + 15
            }}
          >
            {tooltip.text}
          </FloatingTooltip>
        )}
      </AnimatePresence>

      <HeroContent>
        <SeasonalBanner
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkle>✨</Sparkle> Seasonal Special: Summer Recipes Collection
          <Sparkle>✨</Sparkle>
        </SeasonalBanner>
        
        <HeroTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Discover Culinary Magic
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Journey through a world of flavors with recipes crafted by global chefs, 
          food enthusiasts, and culinary experts. Our AI-powered platform adapts to your taste.
        </HeroSubtitle>
        
        <ButtonContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PrimaryButton
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
          >
            Begin Your Journey
          </PrimaryButton>
          <SecondaryButton
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: 'rgba(255,255,255,0.1)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/addrecipe')}
          >
            Share Your Creation
          </SecondaryButton>
        </ButtonContainer>
        
        <FeaturesContainer
          ref={featuresRef}
          initial="hidden"
          animate={controls}
          variants={{
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.6
              }
            },
            hidden: { opacity: 0 }
          }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={{
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { type: 'spring', stiffness: 300 }
                },
                hidden: { opacity: 0, y: 50 }
              }}
              whileHover={{ y: -10 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureText>{feature.text}</FeatureText>
            </FeatureCard>
          ))}
        </FeaturesContainer>

        <ScrollIndicator
          onClick={handleScrollClick}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ScrollText>Explore More</ScrollText>
          <ScrollLine />
        </ScrollIndicator>
      </HeroContent>
    </HeroContainer>
  );
}

export default Home;