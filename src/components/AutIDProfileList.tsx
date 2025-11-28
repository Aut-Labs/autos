import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import { Avatar, Typography, SvgIcon, styled, Dialog } from "@mui/material";
import { pxToRem } from "@utils/text-size";
import RedirectIcon from "@assets/RedirectIcon2.svg?react";
import DialogWrapper from "./Dialog/DialogWrapper";
import { AutOSAutID } from "@api/models/aut.model";

export const UserRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  height: "80px",
  width: "100%",
  cursor: "pointer",
  borderBottom: "1px solid white",
  borderTop: "1px solid white",

  "&:not(:first-of-type)": {
    borderBottom: "1px solid white",
    borderTop: "none"
  },

  "&:hover": {
    backgroundColor: "rgba(235, 235, 242, 0.2)"
  },

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "row",
    height: "80px",
    width: "100%",
    cursor: "pointer",
    borderBottom: "1px solid white",
    borderTop: "1px solid white"
  }
}));

export const AutIDProfileList = ({
  profiles,
  onSelect
}: {
  profiles: AutOSAutID[];
  onSelect: (profile: AutOSAutID) => void;
}) => {
  return (
    <>
      {profiles.map((user: AutOSAutID, index) => {
        return (
          <UserRow key={`result-${index}`} onClick={() => onSelect(user)}>
            <Avatar
              sx={{
                bgcolor: "background.default",
                height: "78px",
                width: "78px",
                borderRadius: 0
              }}
              aria-label="avatar"
              src={ipfsCIDToHttpUrl(
                user?.properties?.thumbnailAvatar as string
              )}
            />
            <div style={{ display: "flex", flex: "1" }}>
              <div
                style={{
                  width: "33%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  display: "flex"
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "3px",
                    height: "100%",
                    color: "white",
                    ml: "20px"
                  }}
                  variant="h6"
                >
                  {user?.name}
                </Typography>
              </div>
              <div
                style={{
                  width: "33%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  display: "flex"
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    color: "white",
                    ml: "20px",
                    padding: "5px",
                    borderRadius: "3px",
                    backgroundColor: "rgba(67, 158, 221, 0.3)"
                  }}
                  variant="h6"
                >
                  {user?.properties?.network?.name}
                </Typography>
              </div>
              <div
                style={{
                  width: "33%",
                  display: "flex",
                  alignContent: "center",
                  alignSelf: "center"
                }}
              >
                <SvgIcon
                  sx={{
                    height: "34px",
                    width: "100%",
                    mt: "10px",
                    ml: "20px",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                  key="redirect-icon"
                  component={RedirectIcon}
                />
              </div>
            </div>
          </UserRow>
        );
      })}
    </>
  );
};

const StyledDialogWrapper = styled(DialogWrapper)(({ theme }) => ({
  "&.MuiDialogContent-root": {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  }
}));
const TextWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center"
}));

const ListWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  marginBottom: "20px"
}));

const Title = styled(Typography)({
  marginTop: pxToRem(25),
  letterSpacing: "3px",
  fontSize: "20px",
  textAlign: "center",

  fontWeight: "500",
  color: "white",
  textTransform: "uppercase"
});

const Subtitle = styled(Typography)({
  marginTop: pxToRem(25),
  marginBottom: pxToRem(25),
  letterSpacing: "1.25px",
  fontSize: pxToRem(16),
  textAlign: "center",
  color: "white",
  textTransform: "uppercase"
});

const SelectAutIDProfileDialog = ({
  open,
  profiles,
  onSelect,
  fullScreen = false
}: any) => {
  return (
    <StyledDialogWrapper open={open} fullScreen={fullScreen}>
      <div
        className="aut-join-dialog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          flex: "1"
        }}
      >
        <TextWrapper>
          <Title>
            It looks like this ĀutID has been found on multiple networks.
          </Title>
          <Subtitle>
            Please select the profile you're looking for from the list below.
          </Subtitle>
        </TextWrapper>
        <ListWrapper>
          <AutIDProfileList profiles={profiles} onSelect={onSelect} />
        </ListWrapper>
      </div>
    </StyledDialogWrapper>
  );
};

export default SelectAutIDProfileDialog;
