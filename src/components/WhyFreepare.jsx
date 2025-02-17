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

const colors = {
  primary: '#066C98',
  secondary: '#ff4081',
  background: '#f5f5f5',
  text: '#333',
  icon: '#066C98',
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
    { icon: <EmojiPeople sx={{ fontSize: 48, color: colors.icon }} />, title: 'User Experience', description: 'FREEPARE provides a seamless and intuitive user experience...' },
    { icon: <Verified sx={{ fontSize: 48, color: colors.icon }} />, title: 'Quality Assurance', description: 'At FREEPARE, we ensure the highest level of quality for all our test materials...' },
    { icon: <School sx={{ fontSize: 48, color: colors.icon }} />, title: 'Expert Approach', description: 'FREEPARE’s tests are not only about practicing questions but also about understanding the core concepts...' },
    { icon: <MonetizationOn sx={{ fontSize: 48, color: colors.icon }} />, title: 'Free of Cost', description: 'One of the major benefits of FREEPARE is that all of our tests and resources are available completely free of charge...' },
    { icon: <Timer sx={{ fontSize: 48, color: colors.icon }} />, title: 'Flexible Testing Format', description: 'FREEPARE offers an incredibly flexible testing format that allows students to take tests at their own pace...' },
    { icon: <OndemandVideo sx={{ fontSize: 48, color: colors.icon }} />, title: 'Video Solutions', description: 'Understanding complex concepts is made easier with FREEPARE’s video solutions...' },
    { icon: <Public sx={{ fontSize: 48, color: colors.icon }} />, title: 'Accessibility', description: 'The convenience of FREEPARE lies in its accessibility. Students can access the tests anytime and anywhere...' },
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
                height: '300px',
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
                      WebkitLineClamp: 5,
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
