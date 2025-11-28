import MyAutIDLogo from "@assets/MyAutIdLogoToolbarPath.svg?react";
import {
  Box,
  styled,
  SvgIcon,
  Typography,
  InputAdornment,
  Button,
  Toolbar
} from "@mui/material";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";
import {
  UpdateErrorMessage,
  updateAutState,
  AutUpdateStatus,
  SelectedAutID
} from "@store/aut/aut.reducer";
import { useAppDispatch } from "@store/store.model";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import LoadingDialog from "@components/Dialog/LoadingPopup";
import { ResultState } from "@store/result-status";
import { EditContentElements } from "@components/EditContentElements";
import { AutTextField } from "@theme/field-text-styles";
import { useNavigate } from "react-router-dom";
import { DautPlaceholder } from "@components/DAutConnect";
import { AutButtonVariant } from "@components/AutButton";
import { socialIcons } from "@utils/social-icons";
import { SocialUrls } from "@aut-labs/sdk";

const MiddleWrapper = styled(Box)(() => ({
  display: "flex",
  flex: "1",
  justifyContent: "flex-start",
  flexDirection: "column",
  width: "100%",
  alignItems: "flex-start"
}));

const LeftWrapper = styled("div")(() => ({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  paddingTop: "30px",
  justifyContent: "center",
  alignItems: "center"
}));

const { FieldWrapper, FormWrapper } = EditContentElements;

const AutProfileEdit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useSelector(AutUpdateStatus);
  const errorMessage = useSelector(UpdateErrorMessage);
  const autID = useSelector(SelectedAutID);
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      bio: autID?.properties?.bio,
      avatar: autID?.properties?.avatar,
      socials: (autID?.properties?.socials || []).map((social) => {
        return {
          ...social,
          link: (social.link as string).replace(
            SocialUrls[social.type].prefix,
            ""
          )
        };
      })
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "socials"
  });

  const beforeEdit = () => {
    // if (!isActive || !isConnected) {
    //   dispatch(setProviderIsOpen(true));
    // }
  };

  const handleDialogClose = () => {
    dispatch(
      updateAutState({
        status: ResultState.Idle
      })
    );
  };
  function goHome() {
    const params = new URLSearchParams(location.search);
    params.delete("network");
    navigate({
      pathname: `/`,
      search: `?${params.toString()}`
    });
  }

  // useEffect(() => {
  //   if (!editInitiated || !isActive || !isConnected) {
  //     return;
  //   }
  //   onEditProfile(values);
  // }, [isActive, isConnected, editInitiated]);

  return (
    <>
      <Toolbar
        sx={{
          width: "100%",
          boxShadow: 2,
          "&.MuiToolbar-root": {
            width: "100%",
            paddingLeft: 6,
            paddingRight: 6,
            minHeight: "84px",
            justifyContent: "space-between",
            alignItems: "center"
          }
        }}
      >
        <MyAutIDLogo
          height="62"
          style={{ cursor: "pointer" }}
          onClick={() => goHome()}
        />
        <DautPlaceholder />
      </Toolbar>
      <FormWrapper autoComplete="off" onSubmit={handleSubmit(beforeEdit)}>
        <ErrorDialog
          handleClose={handleDialogClose}
          open={status === ResultState.Failed}
          message={errorMessage}
        />
        <LoadingDialog
          handleClose={handleDialogClose}
          open={status === ResultState.Loading}
          message="Editing profile..."
        />
        <Button
          startIcon={<ArrowBackIcon />}
          color="offWhite"
          sx={{
            position: "absolute",
            top: "100px",
            mb: 2
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <MiddleWrapper>
          {/* <Box
          sx={{
            paddingBottom: {
              xs: "30px",
              md: "50px"
            },
            display: "flex"
          }}
        >
          <AutCard
            sx={{ bgcolor: "transparent", border: "none", boxShadow: "none" }}
          >
            <CardHeader
              avatar={
                <ImageUpload>
                  <Controller
                    name="avatar"
                    rules={{
                      validate: {
                        fileSize: (v) => {
                          if (isDirty && v) {
                            const file = base64toFile(v, "pic");
                            if (!file) {
                              return true;
                            }
                            return file.size < 8388608;
                          }
                        }
                      }
                    }}
                    control={control}
                    render={({ field: { onChange } }) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column"
                          }}
                        >
                          <AFileUpload
                            color="offWhite"
                            initialPreviewUrl={ipfsCIDToHttpUrl(
                              data?.autID?.properties?.avatar as string
                            )}
                            fileChange={async (file) => {
                              if (file) {
                                onChange(await toBase64(file));
                              } else {
                                onChange(null);
                              }
                            }}
                            // errors={errors}
                          />
                        </div>
                      );
                    }}
                  />
                </ImageUpload>
              }
              sx={{ alignSelf: "flex-start" }}
            ></CardHeader>
            <CardContent
              sx={{
                ml: {
                  xs: "0",
                  sm: "30px"
                },
                mr: {
                  xs: "0",
                  sm: "30px"
                },
                alignSelf: "center",
                height: {
                  xs: "100px",
                  md: "150px"
                },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "5px"
                  }}
                >
                  <Typography
                    color="white"
                    textAlign="left"
                    lineHeight={1}
                    variant="h3"
                  >
                    {data?.autID?.name}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </AutCard>
        </Box> */}

          <Box
            sx={{
              width: "50%",
              alignSelf: "center"
            }}
          >
            <Typography variant="h3" color="white" textAlign="center">
              Add Social Records
            </Typography>
            <Typography variant="subtitle2" color="white" textAlign="center">
              words to go here words to go here words to go here words to go
              here words to go here words to go here words to go here words to
              go here
            </Typography>
          </Box>
          <LeftWrapper>
            {/* <FieldWrapper>
            <SvgIcon
              sx={{
                height: pxToRem(34),
                width: pxToRem(31),
                mr: "20px"
              }}
              component={PersonIcon}
            />
            <div
              style={{
                padding: "0",
                height: pxToRem(50),
                display: "flex",
                minWidth: "0",
                margin: "0",
                border: "0",
                verticalAlign: "top",
                width: "80%"
              }}
            >
              <Typography
                fontSize={"20px"}
                sx={{
                  padding: "0 14px",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
                color="background.paper"
                textAlign="left"
              >
                {data?.autID?.name}
              </Typography>
            </div>
          </FieldWrapper> */}
            <Box
              sx={{
                display: "grid",
                gridGap: "20px",
                gridTemplateColumns: "50% 50%",
                mt: 4
              }}
            >
              {fields.map((_, index) => {
                const AutIcon = socialIcons[Object.keys(socialIcons)[index]];
                const { prefix, hidePrefix, placeholder } =
                  SocialUrls[Object.keys(SocialUrls)[index]];

                return (
                  <FieldWrapper key={`socials.${index}`}>
                    <SvgIcon
                      sx={{
                        color: "offWhite.main",
                        mt: "10px",
                        mr: "20px"
                      }}
                      key={`socials.${index}.icon`}
                      component={AutIcon}
                    />
                    <Controller
                      key={`socials.${index}.link`}
                      name={`socials.${index}.link`}
                      control={control}
                      render={({ field: { name, value, onChange } }) => {
                        return (
                          <>
                            <AutTextField
                              variant="standard"
                              color="offWhite"
                              placeholder={placeholder}
                              id={name}
                              name={name}
                              value={value}
                              autoFocus={index === 0}
                              onChange={onChange}
                              sx={{
                                width: "250px",
                                mb: "15px",
                                mr: "15px"
                              }}
                              InputProps={{
                                startAdornment: !hidePrefix && (
                                  <InputAdornment position="start">
                                    <p
                                      style={{
                                        color: "white"
                                      }}
                                    >
                                      {prefix}
                                    </p>
                                  </InputAdornment>
                                )
                              }}
                            />
                          </>
                        );
                      }}
                    />
                    <AutButtonVariant sx={{ minWidth: "180px" }}>
                      Verify Account
                    </AutButtonVariant>
                  </FieldWrapper>
                );
              })}
            </Box>
          </LeftWrapper>
        </MiddleWrapper>
        {/* <BottomWrapper>
        <Button
          variant="outlined"
          size="normal"
          color="offWhite"
          onClick={() => navigate(-1)}
          sx={{
            width: {
              xs: "140px",
              md: "200px",
              xxl: "270px"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!isValid || !isDirty}
          type="submit"
          variant="outlined"
          size="normal"
          color="primary"
          sx={{
            width: {
              xs: "140px",
              md: "200px",
              xxl: "270px"
            }
          }}
        >
          Save
        </Button>
      </BottomWrapper> */}
      </FormWrapper>
    </>
  );
};

export default AutProfileEdit;
