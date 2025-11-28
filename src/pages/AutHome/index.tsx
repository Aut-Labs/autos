import { memo, useMemo } from "react";
import AutToolBar from "@components/AutToolBar";
import { Box, styled, useMediaQuery, useTheme } from "@mui/material";
import useGetAutIDs from "@utils/hooks/useQueryAutIDs";
import { randomAutIDs } from "@utils/random-autids";
import useWindowDimensions from "@utils/hooks/useWindowDimensions";
import AutSearch from "@components/AutSearch";
import { AutOSAutID } from "@api/models/aut.model";
import MainBackground from "@components/MainBackground";

const AutBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%",
  [theme.breakpoints.down("xl")]: {
    justifyContent: "center"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));

const AutHome = () => {
  const dimensions = useWindowDimensions();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data } = useGetAutIDs({
    skip: mobile,
    variables: {
      first: 50,
      skip: 0
    }
  });
  const faces: AutOSAutID[] = useMemo(() => randomAutIDs(data), [data]);

  return (
    <>
      <AutToolBar hideSearch={true}></AutToolBar>
      <MainBackground dimensions={dimensions} faces={faces}></MainBackground>
      <AutBox
        sx={{
          position: "fixed",
          width: "520px",
          height: "200px"
        }}
      >
        <AutSearch mode="full" />
      </AutBox>
    </>
  );
};

export default memo(AutHome);
