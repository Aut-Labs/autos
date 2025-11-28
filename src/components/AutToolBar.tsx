import { DautPlaceholder } from "@components/DAutConnect";
import { Box, Toolbar } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AutOsLogo from "@assets/autos/os-logo.svg?react";
import { memo } from "react";
import AutSearch from "./AutSearch";

const AutToolBar = ({ hideSearch = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete("network");
    navigate({
      pathname: `/`,
      search: `?${params.toString()}`
    });
  }

  return (
    <Toolbar
      sx={{
        width: "100%",
        position: "fixed",
        zIndex: 5,
        boxShadow: {
          xs: 4,
          sm: 0
        },
        paddingLeft: {
          xs: 4,
          md: 8
        },
        paddingRight: {
          xs: 4,
          md: 8
        },
        height: {
          xs: "130px",
          sm: "84px"
        },
        minHeight: {
          xs: "130px",
          sm: "84px"
        },
        flexDirection: {
          xs: "column",
          sm: "row"
        },
        justifyContent: {
          xs: "flex-start",
          sm: "space-between"
        },
        alignItems: "center"
      }}
    >
      <AutOsLogo
        height="62"
        style={{ cursor: "pointer" }}
        onClick={() => goHome()}
      ></AutOsLogo>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "20px"
        }}
      >
        {!hideSearch && <AutSearch mode="simple" />}
        <DautPlaceholder></DautPlaceholder>
      </Box>
    </Toolbar>
  );
};

export default memo(AutToolBar);
