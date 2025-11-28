import { DatePicker, CalendarPicker } from "@mui/lab";
import { TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { pxToRem } from "@utils/text-size";
import { Controller } from "react-hook-form";

interface FormHelperTextProps {
  errors: any;
  name: string;
  children?: string | React.ReactElement;
  errorTypes?: any;
  value: any;
}

const defaultErrorTypes = {
  required: "Field is required!"
};

export function FormHelperText({
  errors,
  name,
  errorTypes,
  children = null,
  value = null
}: FormHelperTextProps) {
  if (errors[name]) {
    const { type } = errors[name];
    const types = {
      ...defaultErrorTypes,
      ...(errorTypes || {})
    };

    const message = types[type];

    return (
      <Typography
        whiteSpace="nowrap"
        align="right"
        color="error"
        component="span"
        variant="caption"
        className="auto-helper-error"
        sx={{
          width: "100%",
          position: "absolute",
          left: "0"
        }}
      >
        {message}
      </Typography>
    );
  }
  return (
    children && (
      <Typography
        sx={{
          width: "100%",
          position: "absolute",
          left: "0"
        }}
        className="auto-helper-info"
        align="right"
        component="span"
        color="offWhite.dark"
        variant="caption"
      >
        {children}
      </Typography>
    )
  );
}

const CustomSwCalendarPicker = styled(CalendarPicker)(({ theme }) => ({
  ".MuiTypography-caption": {
    color: theme.palette.primary.main
  },
  ".MuiTypography-root, .MuiButtonBase-root": {
    fontSize: pxToRem(25),
    width: pxToRem(50),
    height: pxToRem(50)
  },
  'div[role="presentation"]': {
    ".PrivatePickersFadeTransitionGroup-root": {
      fontSize: pxToRem(29),
      color: "#000"
    }
  },
  ".MuiButtonBase-root .MuiSvgIcon-root": {
    width: pxToRem(40),
    height: pxToRem(40)
  },
  ".PrivatePickersSlideTransition-root": {
    minHeight: pxToRem(300),
    ".MuiButtonBase-root.Mui-disabled": {
      color: "#777777"
    },
    // '.MuiButtonBase-root': {
    //   margin: `0 ${pxToRem(6)}`,
    // },
    ".MuiButtonBase-root:not(.Mui-disabled)": {
      backgroundColor: "rgba(119, 119, 119, .25)",
      color: theme.palette.primary.main,
      borderRadius: 0,
      "&:hover, &.Mui-selected": {
        backgroundColor: theme.palette.primary.main,
        color: "#fff"
      }
    }
  }
}));

export const SwDatePicker = ({
  control,
  name,
  minDate,
  maxDate = null,
  otherProps = {}
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <DatePicker
            inputFormat="dd/MM/yyyy"
            minDate={minDate}
            maxDate={maxDate}
            PaperProps={{
              sx: {
                ".MuiCalendarPicker-root": {
                  'div[role="presentation"], .MuiButtonBase-root, .MuiTypography-root, .PrivatePickersYear-yearButton':
                  {
                    fontSize: pxToRem(18),
                    color: "primary.main",
                    "&.Mui-selected": {
                      color: "text.primary"
                    },
                    "&[disabled]": {
                      color: "text.disabled"
                    }
                  }
                }
              }
            }}
            value={field.value}
            onChange={field.onChange}
            renderInput={(params) => {
              const v = params.inputProps.value;
              delete params.inputProps.value;
              return (
                <TextField
                  {...params}
                  value={field.value ? v : ""}
                  color="primary"
                  name={field.name}
                  required
                />
              );
            }}
            {...otherProps}
          />
        );
      }}
    />
  );
};

export const SwCalendarPicker = ({
  control,
  name,
  minDate,
  maxDate = null,
  otherProps = {}
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <CustomSwCalendarPicker
            minDate={minDate}
            maxDate={maxDate}
            date={field.value ? new Date(field.value) : null}
            onChange={field.onChange}
            {...otherProps}
          />
        );
      }}
    />
  );
};
