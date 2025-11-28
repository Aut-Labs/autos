import { Box, styled } from "@mui/material";
import { pxToRem } from "@utils/text-size";

const TopWrapper = styled(Box)(({ theme }) => ({
  paddingBottom: pxToRem(80),
  [theme.breakpoints.down("lg")]: {
    paddingBottom: pxToRem(50)
  },
  [theme.breakpoints.down("sm")]: {
    paddingBottom: pxToRem(30)
  }
}));

const BottomWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(4),
  justifyContent: "space-between",
  maxWidth: "600px",
  display: "flex"
  // [theme.breakpoints.down("lg")]: {
  //   maxWidth: "unset"
  // }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(8),
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `100%`
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "30px",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: `100%`
  }
}));

const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  paddingTop: theme.spacing(8),
  paddingLeft: theme.spacing(8),
  paddingRight: theme.spacing(8),
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  [theme.breakpoints.down("md")]: {
    width: `100%`
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "30px",
    paddingLeft: "10px",
    paddingRight: "10px",
    width: `100%`
  }
}));

const FieldWrapper = styled("div")(({ theme }) => ({
  flexDirection: "row",
  marginBottom: "20px",
  // minHeight: "70px",
  display: "flex",
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "flex-start"
  // [theme.breakpoints.down("lg")]: {
  //   justifyContent: "center",
  //   alignItems: "center"
  // },
  // [theme.breakpoints.down("sm")]: {
  //   justifyContent: "flex-start",
  //   alignItems: "flex-start"
  //   // paddingLeft: "30px"
  // }
}));

const IconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "25px",
  height: "40px",

  [theme.breakpoints.down("md")]: {
    height: "35px",
    minHeight: "20px"
  }
}));

const FollowWrapper = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "150px",
  justifyContent: "center"
}));

export const EditContentElements = {
  FieldWrapper,
  FormWrapper,
  BottomWrapper,
  TopWrapper,
  ContentWrapper,
  FollowWrapper,
  IconContainer
};
