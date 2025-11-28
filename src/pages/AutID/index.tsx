import { useAppDispatch } from "@store/store.model";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { AutShareDialog } from "@components/AutShare";
import { setOpenShare } from "@store/ui-reducer";
import { Route, Routes, useNavigate } from "react-router-dom";
import backgroundImage from "@assets/autos/background.png";
import { autUrls } from "@utils/aut-urls";
import { lazy, memo, Suspense, useMemo } from "react";
import useQueryGetFullAutID from "@utils/hooks/useQueryGetFullAutID";
import PerfectScrollbar from "react-perfect-scrollbar";
import AutToolBar from "@components/AutToolBar";
import AutLoading from "@components/AutLoading";
import { useAccount } from "wagmi";
import OpenTask from "../Tasks/OpenTask/OpenTask";
import Contributions from "../Tasks/Contributions/Contributions";

const AutIDProfile = lazy(() => import("./AutIDProfile"));
const AutHubEdit = lazy(() => import("./AutHub/AutHubEdit"));

const AutContainer = styled("div")(() => ({
  display: "flex",
  height: "100%",
  backgroundImage: `url(${backgroundImage})`,
  backgroundBlendMode: "hard-light",
  backgroundSize: "cover",
  backgroundRepeat: "repeat-y"
}));

const AutID = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const { openShare } = useSelector((state: any) => state.ui);
  const { address } = useAccount();
  const { data, loading } = useQueryGetFullAutID();

  const isAddressTheConnectedUser = useMemo(() => {
    return data?.autID.isAutIDOwner(address);
  }, [data?.autID, address]);

  const handleClose = () => dispatch(setOpenShare(false));

  const scrollHeight = useMemo(() => {
    if (mobile) {
      return `${window?.innerHeight}px`;
    }
    return "100%";
  }, [mobile, window?.innerHeight]);

  return (
    <>
      <AutShareDialog
        open={openShare}
        url={`${autUrls.myAut}/${data?.autID?.name}`}
        hideCloseBtn={false}
        title="Show off your ĀutID  🙌"
        description={
          <>
            Hello, friend 🖖
            <br />
            <br />
            This is my ĀutID - and it’s the first identity I can truly own.
            <br />
            I will shape it, and it will grow with me & the Communities I commit
            to.
            <br />
            <br />
            Follow my journey - and see you on the āuter space 🪐
            <br />
            {`${autUrls.myAut}/${data?.autID?.name}`}
          </>
        }
        twitterProps={{

          title: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`,
          hashtags: ["Aut", "DAO", "Blockchain"]
        }}
        linkedinProps={{

          summary: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`,
          title: "My ĀutID"
        }}
        telegramProps={{

          title: `Hello, friend 🖖 This is my ĀutID - and it’s the first identity I can truly own. I will shape it, and it will grow with me & the Communities I commit to. Follow my journey - and see you on the āuter space 🪐`
        }}
        onClose={handleClose}
      />

      <AutContainer>
        {loading ? (
          <AutLoading />
        ) : (
          <>
            {!data?.autID ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column"
                }}
              >
                <Typography color="white" variant="h2">
                  ĀutID not found
                </Typography>
                <Button
                  variant="outlined"
                  size="normal"
                  color="offWhite"
                  onClick={() => navigate("/")}
                  sx={{
                    mt: 4
                  }}
                >
                  Home
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  flexDirection: "column"
                }}
              >
                <AutToolBar></AutToolBar>
                <PerfectScrollbar
                  options={{
                    suppressScrollX: true,
                    wheelPropagation: true,
                    swipeEasing: true
                  }}
                  style={{
                    marginTop: mobile ? "130px" : "84px",
                    display: "flex",
                    height: `calc(${scrollHeight} - ${mobile ? "130px" : "84px"})`,
                    flexDirection: "column"
                  }}
                >
                  <Suspense fallback={<AutLoading />}>
                    <Routes>
                      <Route index element={<AutIDProfile />} />
                      {isAddressTheConnectedUser && (
                        <>
                          <Route
                            path="hub/:hubAddress"
                            element={<AutHubEdit />}
                          />
                            <Route
                            path="hub/:hubAddress/contribution/:id"
                            element={<Contributions />}
                          />
                        </>
                      )}
                    </Routes>
                  </Suspense>
                </PerfectScrollbar>
              </Box>
            )}
          </>
        )}
      </AutContainer>
    </>
  );
};

export default memo(AutID);
