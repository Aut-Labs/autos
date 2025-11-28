
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  debounce,
  Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/store.model";
import { HTMLAttributes, memo, ReactNode, useEffect, useMemo, useState } from "react";
import { Fragment } from "react";
import {
  ContentWrapper,
  FormWrapper,
  FieldWrapper,
  CustomPaper,
  RenderAutIDOption,
  SearchTextField
} from "@components/AutSearchElements";
import useGetAutIDs from "@utils/hooks/useQueryAutIDs";
import { updateAutState } from "@store/aut/aut.reducer";
import { AutOSAutID } from "@api/models/aut.model";

interface AutSearchProps {
  onSelect?: (user: AutOSAutID) => void;
  mode?: string;
}

const AutSearch = (props: AutSearchProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [value, setValue] = useState<AutOSAutID | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isCompact = useMemo(() => {
    return props?.mode === "simple";
  }, [props?.mode]);

  const selectProfile = async (autID: AutOSAutID) => {
    await dispatch(updateAutState({ autID }));
    if (props.onSelect) {
      props.onSelect(autID);
    }
    navigate({
      pathname: `/${autID.name}`
    });
  };

  const { data, loading } = useGetAutIDs({
    skip: !debouncedInputValue,
    variables: {
      skip: 0,
      first: 5,
      where: {
        username_contains_nocase: debouncedInputValue?.toLowerCase()
      }
    }
  });

  const options = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    return data;
  }, [data, debouncedInputValue]);

  const debouncedSetInputValue = useMemo(() => {
    return debounce((value) => {
      setDebouncedInputValue(value);
    }, 300);
  }, []);

  useEffect(() => {
    debouncedSetInputValue(searchQuery);
  }, [searchQuery, debouncedSetInputValue]);

  const onChange = (event: unknown, value: AutOSAutID | null) => {
    // setValue(value);
  };
  const onInputChange = (event: unknown, value: string) => {
    setSearchQuery(value);
  };
  const filterOptions = (options: AutOSAutID[]): AutOSAutID[] => options;
  const getOptionLabel = (option: AutOSAutID): string => option.name;
  const renderOption = (
    _props: HTMLAttributes<HTMLLIElement>,
    option: AutOSAutID
  ) => {
    return (
      <Fragment key={option.name}>
        <RenderAutIDOption
          compact={isCompact}
          option={option}
          onSelect={selectProfile}
        />
      </Fragment>
    );
  };
  const renderInput = (
    params: AutocompleteRenderInputParams
  ): ReactNode => {
    return (
      <SearchTextField
        params={params}
        color="offWhite"
        placeholder="search_"
        autoFocus
        sx={{
          ".MuiInputBase-root": {
            ...(isCompact && {
              boxShadow: "none"
            })
          }
        }}
      />
    );
  };

  return (
    <>
      <ContentWrapper compact={isCompact}>
        <FormWrapper compact={isCompact} autoComplete="off">
          <FieldWrapper compact={isCompact}>
            <Autocomplete
              id="search-aut"
              sx={{
                width: {
                  xs: 260,
                  sm: 480
                },
                ...(isCompact && {
                  width: 210
                })
              }}
              options={options}
              value={value}
              inputValue={searchQuery}
              loading={loading}
              onChange={onChange}
              onInputChange={onInputChange}
              getOptionLabel={getOptionLabel}
              renderInput={renderInput}
              renderOption={renderOption}
              filterOptions={filterOptions}
              PaperComponent={CustomPaper}
              disableCloseOnSelect
              clearOnBlur={false}
              loadingText="Loading..."
              ListboxProps={{
                style: {
                  border: "none",
                  display: "flex",
                  margin: 0,
                  padding: 0,
                  flexDirection: "column",
                  background: "transparent",
                  width: "474px"
                }
              }}
            />
          </FieldWrapper>
          {!isCompact && (
            <Typography
              variant="subtitle2"
              fontWeight="normal"
              textAlign="center"
              zIndex="10"
              color="offWhite.main"
              sx={{
                width: {
                  xs: "260px",
                  sm: "480px"
                }
              }}
            >
              find anyone and connect with them - just type _
            </Typography>
          )}
        </FormWrapper>
      </ContentWrapper>
    </>
  );
};

export default memo(AutSearch);
