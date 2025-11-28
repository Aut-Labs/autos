import { Box, styled, Typography } from "@mui/material";

const NumberContainer = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    letterSpacing: "0.33px"
  }
}));
const LetterContainer = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    letterSpacing: "0.33px",
    marginRight: "2px",
    marginLeft: "1px"
  }
}));

function formatNumber(number) {
  if (number < 10) {
    return "0" + number.toString();
  } else {
    return number.toString();
  }
}

export const AutCountdown = ({ days, hours, minutes, seconds, completed }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "2px"
      }}
    >
      <div>
        <NumberContainer color="offWhite.main" variant="body">
          {days}
        </NumberContainer>
        <LetterContainer color="offWhite.dark" variant="body">
          D
        </LetterContainer>
      </div>
      <div>
        <NumberContainer color="offWhite.main" variant="body">
          {formatNumber(hours)}
        </NumberContainer>
        <LetterContainer color="offWhite.dark" variant="body">
          h
        </LetterContainer>
      </div>

      <div>
        <NumberContainer color="offWhite.main" variant="body">
          {formatNumber(minutes)}
        </NumberContainer>
        <LetterContainer color="offWhite.dark" variant="body">
          m
        </LetterContainer>
      </div>
      <div>
        <NumberContainer color="offWhite.main" variant="body">
          {formatNumber(seconds)}
        </NumberContainer>
        <LetterContainer color="offWhite.dark" variant="body">
          s
        </LetterContainer>
      </div>
    </Box>
  );
};
