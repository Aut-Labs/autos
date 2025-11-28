import {
  Typography,
  Slider,
  SliderProps,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { pxToRem } from "@utils/text-size";
import { FieldErrors } from "react-hook-form";
import { FormHelperText } from "./Fields/AutFields";
import { CommitmentMessages } from "@utils/misc";

// const CommitmentMessages = (value: number) => {
//   switch (+value) {
//     case 1:
//       return `I got 99 problems, and a community ain't one`;
//     case 2:
//       return 'Billie Jean is not my lover.';
//     case 3:
//       return `They think I'm hiding in the shadows. But I am the shadows.`;
//     case 4:
//       return 'Eight or higher, bro.';
//     case 5:
//       return `Yes, no, maybe, I don't know. Can you repeat the question?`;
//     case 6:
//       return 'Pivot!';
//     case 7:
//       return 'You Jump, I Jump, Jack.';
//     case 8:
//       return 'You have my sword. And you have my bow. And my ax';
//     case 9:
//       return 'I’m a Mandalorian.';
//     case 10:
//       return '“After all this time?" "Always...”';
//     default:
//       return ``;
//   }
// };

const StyledSlider = styled(Slider)<CustomSliderProps>(
  ({ mincommitment, theme }) => ({
    width: pxToRem(600),
    height: pxToRem(65),
    borderRadius: "0",
    borderWidth: "2px",
    borderStyle: "solid",
    padding: "0",
    backgroundImage: `-webkit-linear-gradient(left, #6A6A6A, #6A6A6A ${
      mincommitment * 10
    }%, transparent ${mincommitment * 10}%, transparent 100%)`,

    "&.MuiSlider-root": {
      padding: 0
    },

    [theme.breakpoints.down("md")]: {
      alignContent: "center",
      justifyContent: "center",
      width: "100%"
    },

    'span[data-index="10"].MuiSlider-mark': {
      display: "none"
    },
    'span[data-index="0"].MuiSlider-mark': {
      display: "none"
    },

    ".MuiSlider-mark": {
      background: "transparent",
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "#009FE3",

      "&.MuiSlider-markActive": {
        border: "none"
      }
    },
    ".MuiSlider-track": {
      borderRight: "0",
      background:
         
        "transparent linear-gradient(45.57deg, #009fe3 0%, #0399de 8%, #0e8bd3 19%, #2072bf 30%, #3a50a4 41%, #5a2583 53%, #453f94 71%, #38519f 88%, #3458a4 100%) 0% 0%"
    },

    ".MuiSlider-rail": {
      opacity: "0"
    }
  })
);

 
export function CommitmentMessage({ value, children = null }) {
  const message = CommitmentMessages(value);
  return (
    <Typography
      color="white"
      whiteSpace="nowrap"
      align="left"
      component="span"
      variant="body1"
      sx={{ display: "flex", mb: "4px", height: "15px" }}
    >
      {message}
    </Typography>
  );
}

interface AutSliderProps {
  sliderProps: SliderProps;
  value: any;
  name: string;
  errors: FieldErrors<any>;
  minCommitment?: number;
  hubName: string;
}

interface CustomSliderProps {
  mincommitment: number;
}

const errorTypes = (minCommitment, hubName) => {
  return {
    min: `Whoops - The min level to join ${hubName} is ${minCommitment}`
  };
};

export const AutSlider = (props: AutSliderProps) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div
      style={{
        position: "relative",
        width: desktop ? "600px" : "100%"
      }}
    >
      <CommitmentMessage value={props.value} />
      <div style={{ position: "relative" }}>
        <StyledSlider
          className="swiper-no-swiping"
          {...props.sliderProps}
          mincommitment={props.minCommitment}
        />
      </div>
      <div
        style={{
          marginTop: "-3px",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <FormHelperText
          errorTypes={errorTypes(props.minCommitment, props.hubName)}
          value={props.value}
          name={props.name}
          errors={props.errors}
        />
      </div>
    </div>
  );
};
