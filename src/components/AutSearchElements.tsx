import { AutTextField } from "@theme/field-text-styles";
import { ChangeEvent, useState, FC } from "react";
import omit from "lodash-es/omit";
import {
  AutocompleteRenderInputParams,
  Avatar,
  Box,
  Paper,
  styled,
  TextFieldProps,
  Typography
} from "@mui/material";
import { ipfsCIDToHttpUrl } from "@utils/ipfs";
import { AutOSAutID } from "@api/models/aut.model";

export const UserRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  height: "50px",
  margin: 0,
  width: "100%",
  cursor: "pointer",
  backgroundColor: "rgba(235, 235, 242, 0.05)",
  "&:not(:last-of-type)": {
    borderBottom: "1px solid rgba(235, 235, 242, 0.3)",
    borderTop: "none"
  },
  "&:last-of-type": {
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px"
  },

  "&:hover": {
    backgroundColor: "rgba(235, 235, 242, 0.15)"
  },

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "row",
    height: "40px",
    width: "100%",
    cursor: "pointer"
  }
}));

export const AutTextFieldSearch = styled(AutTextField)(({ theme }) => ({
  ".MuiInputBase-input": {
    "&::placeholder": {
      color: theme.palette.offWhite.main,
      opacity: 0.5
    }
  },
  ".MuiInputBase-root": {
    caretColor: theme.palette.primary.main,
    fieldset: {
      border: "1.5px solid #82FBFB !important",
      borderRadius: "6px"
    },
    borderRadius: "6px",
    background: "rgba(0, 0, 0, 0.64)",
    boxShadow: `0px 16px 80px 0px ${theme.palette.primary.main}, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)`,
    WebkitBackdropFilter: "blur(8px)",
    backdropFilter: "blur(8px)"
  },
  ".MuiInputLabel-root": {
    color: "white"
  },
  ".MuiAutocomplete-popupIndicator": {
    display: "none"
  },
  ".MuiAutocomplete-clearIndicator": {
    background: "#818CA2",
    borderRadius: "50%",
    color: "black",
    marginRight: "10px",
    ":hover": {
      background: "#A7B1C4",
      color: "black"
    }
  }
}));

interface StyledCompactProps {
  compact?: boolean;
}

export const ContentWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "compact"
})<StyledCompactProps>(({ compact, theme }) => ({
  ...(!compact && {
    "&.MuiBox-root": {
      width: "100%"
      // overflow: "hidden"
    },
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
  })
}));

export const FieldWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "compact"
})<StyledCompactProps>(({ compact, theme }) => ({
  ...(!compact && {
    flexDirection: "row",
    marginBottom: "20px",
    display: "flex",
    width: "500px",
    justifyContent: "center",
    alignItems: "center",

    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      alignItems: "center",
      width: "90%"
    }
  })
}));

export const FormWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "compact"
})<StyledCompactProps & { autoComplete: string }>(({ compact, theme }) => ({
  ...(!compact
    ? {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      marginTop: "30px",

      [theme.breakpoints.down("md")]: {
        marginTop: "20px",
        width: "100%",
        paddingLeft: "0",
        paddingRight: "0",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
      }
    }
    : {
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        display: "none"
      }
    })
}));

export function CustomPaper({ children }) {
  return (
    <Paper
      sx={{
        background: "transparent",
        padding: 0,
        border: "none",
        boxShadow: "none",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        WebkitBackdropFilter: "blur(8px)",
        backdropFilter: "blur(8px)",
        ".MuiAutocomplete-noOptions": {
          color: (theme) => theme.palette.offWhite.main
        }
      }}
    >
      {children}
    </Paper>
  );
}

interface RenderAutIDOptionProps {
  compact: boolean;
  option: AutOSAutID;
  onSelect: (option: AutOSAutID) => void;
}

export const RenderAutIDOption = ({
  compact,
  option,
  onSelect
}: RenderAutIDOptionProps) => {
  return (
    <UserRow
      onClick={() => onSelect(option)}
      sx={{
        px: 2,
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <Avatar
          alt={option.name}
          sx={{ width: 28, height: 28 }}
          src={ipfsCIDToHttpUrl(option.properties.thumbnailAvatar)}
        />
        <Typography
          sx={{
            color: (theme) => theme.palette.offWhite.main
          }}
          variant="subtitle1"
          fontFamily="FractulRegular"
        >
          {option?.name}
        </Typography>
      </Box>

      {!compact && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Typography
            sx={{
              color: (theme) => theme.palette.offWhite.main
            }}
            variant="overline"
            fontFamily="FractulRegular"
          >
            Minted on:
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: (theme) => theme.palette.offWhite.main,
              fontSize: "10px !important",
              fontWeight: "normal",
              letterSpacing: "0.66px",
              fontFamily: "FractulRegular"
            }}
          >
            {option?.properties.timestamp}
          </Typography>
        </Box>
      )}
    </UserRow>
  );
};

export const SearchTextField: FC<
  TextFieldProps & {
    params: AutocompleteRenderInputParams;
  }
> = ({ params, ...other }) => {
  const [value, setValue] = useState(
    (params.inputProps as { value: string }).value
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    (
      params.inputProps as {
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
      }
    ).onChange(event);

    setValue(event.target.value);
  };

  const handleInputFocus = (event) => {
    (
      params.inputProps as {
        onFocus: (event) => void;
      }
    ).onFocus(event);
  };

  const handleInputBlur = (event) => {
    (
      params.inputProps as {
        onBlur: (event) => void;
      }
    ).onBlur(event);
  };

  return (
    <AutTextFieldSearch
      {...omit(params, "inputProps")}
      {...other}
      inputProps={{
        ...omit(params.inputProps, ["value", "onChange"]),
        value,
        onChange: handleInputChange,
        onBlur: handleInputBlur,
        onFocus: handleInputFocus
      }}
    />
  );
};
