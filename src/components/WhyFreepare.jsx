import React from 'react';
import { Typography, Card, Container, Box } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { keyframes } from '@emotion/react';
import {
  EmojiPeople, // User Experience
  Verified, // Quality Assurance
  School, // Expert Approach
  MonetizationOn, // Free of Cost
  Timer, // Flexible Testing Format
  OndemandVideo, // Video Solutions
  Public, // Convenience and Accessibility
} from '@mui/icons-material';

// Keyframes for subtle animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Modern color palette
const colors = {
  primary: '#066C98', // Main theme color
  secondary: '#ff4081', // Accent color
  background: '#f5f5f5', // Light background
  text: '#333', // Dark text
  icon: '#066C98', // Icon color
};

// Custom Previous Arrow Component
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        background: '#066C98', // Darker color
        borderRadius: '50%',
        width: '20px', // Bigger size
        height: '20px', // Bigger size
        zIndex: 1,
        right: '-30px', // Adjust position
      }}
      onClick={onClick}
    />
  );
};

// Custom Next Arrow Component
const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        background: '#066C98', // Darker color
        borderRadius: '50%',
        width: '20px', // Bigger size
        height: '20px', // Bigger size
        zIndex: 1,
        right: '-30px', // Adjust position
      }}
      onClick={onClick}
    />
  );
};

const WhyFreepare = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow />, // Use custom previous arrow
    nextArrow: <CustomNextArrow />, // Use custom next arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const cardData = [
    {
      icon: <EmojiPeople sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'User Experience',
      description:
        'FREEPARE provides a seamless and intuitive user experience, enabling students to quickly access the tests they need. Our platform is designed to be straightforward and user-friendly, ensuring that even those with minimal technical knowledge can navigate with ease.',
    },
    {
      icon: <Verified sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'Quality Assurance',
      description:
        'At FREEPARE, we ensure the highest level of quality for all our test materials. Each test is meticulously curated and reviewed by subject-matter experts to guarantee accuracy and relevance.',
    },
    {
      icon: <School sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'Expert Approach',
      description:
        'FREEPARE’s tests are not only about practicing questions but also about understanding the core concepts. Each question comes with a detailed solution that explains the reasoning and methodology behind the correct answer.',
    },
    {
      icon: <MonetizationOn sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'Free of Cost',
      description:
        'One of the major benefits of FREEPARE is that all of our tests and resources are available completely free of charge. We believe in making education accessible to all, regardless of financial background.',
    },
    {
      icon: <Timer sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'Flexible Testing Format',
      description:
        'FREEPARE offers an incredibly flexible testing format that allows students to take tests at their own pace. Each test consists of five questions with no time constraints, giving you the freedom to thoroughly analyze and understand each question.',
    },
    {
      icon: <OndemandVideo sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'Video Solutions',
      description:
        'Understanding complex concepts is made easier with FREEPARE’s video solutions. Every test is accompanied by a video explanation, where experts break down the questions and provide in-depth explanations of the solutions.',
    },
    {
      icon: <Public sx={{ fontSize: 48, color: colors.icon }} />,
      title: 'Accessibility',
      description:
        'The convenience of FREEPARE lies in its accessibility. Students can access the tests anytime and anywhere, as long as they have an internet connection. This ensures that learning can happen on the go.',
    },
  ];

  return (
    <Container sx={{ my: 2, py: 4 }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{
          background: 'linear-gradient(90deg, #066C98, #2CACE3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 500,
          fontSize: '2rem',
          mb: 2,
          animation: `${fadeIn} 1s ease-in-out`,
        }}
      >
        Why FREEPARE?
      </Typography>

      <Slider {...settings}>
        {cardData.map((card, index) => (
          <Box key={index} sx={{ px: 2, py: 2, animation: `${fadeIn} 1s ease-in-out` }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                bgcolor: '#fff',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: 6,
                },
                height: '300px', // Fixed card height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 3,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{ flexShrink: 0 }}>{card.icon}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 600, color: colors.primary, mb: 2, textAlign: 'center', fontSize: '1.3rem' }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 5, // Limit to 5 lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        ))}
      </Slider>
    </Container>
  );
};

export default WhyFreepare;