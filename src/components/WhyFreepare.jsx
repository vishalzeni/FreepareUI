import React from 'react';
import { Typography, Card, Container, Box, useMediaQuery } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { keyframes } from '@emotion/react';
import {
  EmojiPeople,
  Verified,
  School,
  MonetizationOn,
  Timer,
  OndemandVideo,
  Public,
} from '@mui/icons-material';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const iconAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const colors = {
  primary: '#066C98',
  secondary: '#ff4081',
  background: '#f5f5f5',
  text: '#333',
  icons: ['#066C98', '#FF5733', '#28A745', '#FFC107', '#17A2B8', '#6F42C1', '#E83E8C'],
};

const CustomPrevArrow = (props) => {
  const { onClick, isHidden } = props;
  if (isHidden) return null;
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        color: colors.primary,
      }}
    >
      <ArrowBackIos />
    </Box>
  );
};

const CustomNextArrow = (props) => {
  const { onClick, isHidden } = props;
  if (isHidden) return null;
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        color: colors.primary,
      }}
    >
      <ArrowForwardIos fontSize="small" />
    </Box>
  );
};

const WhyFreepare = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <CustomPrevArrow isHidden={isMobile} />,
    nextArrow: <CustomNextArrow isHidden={isMobile} />,
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
      icon: <EmojiPeople sx={{ fontSize: 50, color: colors.icons[0], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'User Experience', 
      description: 'FREEPARE is designed with a user-first approach, ensuring a seamless, intuitive, and hassle-free experience. With a clean, modern interface and smooth navigation, students can focus entirely on learning without distractions, making test preparation effortless and enjoyable.' 
    },
    { 
      icon: <Verified sx={{ fontSize: 50, color: colors.icons[1], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'Quality Assurance', 
      description: 'Every test and study material on FREEPARE is meticulously curated by subject-matter experts to maintain the highest level of accuracy and reliability. Our commitment to quality ensures that students get well-structured, up-to-date, and conceptually sound practice resources, helping them build a solid foundation for success.' 
    },
    { 
      icon: <School sx={{ fontSize: 50, color: colors.icons[2], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'Expert Approach', 
      description: 'FREEPARE goes beyond basic test practice by fostering deep conceptual clarity and analytical reasoning. Our expertly crafted questions challenge students to think critically, helping them develop problem-solving skills essential for competitive exams and real-world applications.' 
    },
    { 
      icon: <MonetizationOn sx={{ fontSize: 50, color: colors.icons[3], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'Free of Cost', 
      description: 'Education should be a right, not a privilege. That’s why FREEPARE offers unlimited access to all its tests, study materials, and learning resources—completely free of charge. No hidden fees, no subscriptions—just quality learning for everyone, anytime, anywhere.' 
    },
    { 
      icon: <Timer sx={{ fontSize: 50, color: colors.icons[4], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'Flexible Testing Format', 
      description: 'Not everyone learns at the same pace, and we understand that. FREEPARE provides customizable test formats, allowing students to choose difficulty levels, set timers, and practice according to their comfort. Whether you prefer quick quizzes or full-length tests, you have the freedom to learn your way.' 
    },
    { 
      icon: <OndemandVideo sx={{ fontSize: 50, color: colors.icons[5], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'Video Solutions', 
      description: 'Struggling with complex concepts? FREEPARE offers detailed video explanations for every test, breaking down difficult topics into simple, easy-to-understand lessons. With step-by-step guidance from experts, students can master challenging subjects more effectively and retain knowledge for the long term.' 
    },
    { 
      icon: <Public sx={{ fontSize: 50, color: colors.icons[6], animation: `${iconAnimation} 2s infinite` }} />, 
      title: 'Global Accessibility', 
      description: 'Education should have no boundaries. FREEPARE is accessible worldwide, empowering students from different backgrounds and regions with high-quality learning resources. No matter where you are, you can access expert-level test preparation and take a step toward academic excellence.' 
    },
  ];
  

  return (
    <Container sx={{ my: 2, py: 4 }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{
          fontWeight: '500',
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
          background: 'linear-gradient(90deg, #066C98, #2CACE3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
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
                height: 'auto', // Changed height to auto
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
                      overflow: 'hidden', // Added ellipsis for text overflow
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 7,
                      WebkitBoxOrient: 'vertical',
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
