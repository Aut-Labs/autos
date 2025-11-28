import AutLoading from "@components/AutLoading";
import ErrorDialog from "@components/Dialog/ErrorPopup";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Stack,
  styled,
  Typography
} from "@mui/material";
import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TaskDetails from "../Shared/TaskDetails";
import { AutOsButton } from "@components/AutButton";
import { TaskStatus } from "@store/model";
import SubmitDialog from "@components/Dialog/SubmitDialog";
import {
  QuizQuestionsAndAnswers,
  QuizTaskContribution
} from "@api/models/contribution-types/quiz.model.model";
import { ContributionCommit } from "@utils/hooks/useQueryContributionCommits";
import { useCommitAnyContributionMutation } from "@api/contributions.api";
import { useWalletConnector } from "@lib/connector";

export const taskStatuses: any = {
  [TaskStatus.Created]: {
    label: "To Do",
    color: "info"
  },
  [TaskStatus.Finished]: {
    label: "Completed",
    color: "success"
  },
  [TaskStatus.Submitted]: {
    label: "Submitted",
    color: "warning"
  },
  [TaskStatus.Taken]: {
    label: "Taken",
    color: "info"
  }
};

const GridBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gridGap: "20px",
  marginTop: "20px",
  [theme.breakpoints.up("sm")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr"
  }
}));

const GridRow = styled(Box)({
  boxSizing: "border-box",
  display: "grid",
  gridTemplateColumns: "1fr 40px",
  gridGap: "8px"
});

const alphabetize = {
  0: "A",
  1: "B",
  2: "C",
  3: "D"
};

const Answers = memo(({ control, questionIndex, answers, disabled }: any) => {
  const values = useWatch({
    name: `questions[${questionIndex}].answers`,
    control
  });

  return (
    <GridBox>
      {answers.map((answer, index) => {
        return (
          <Fragment key={`questions[${questionIndex}].answers[${index}]`}>
            {answer?.value && (
              <GridRow key={`questions[${questionIndex}].answers[${index}]`}>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Typography mr={1} color="white" variant="subtitle2">
                    {alphabetize[index]}
                  </Typography>
                  <Typography color="white" variant="body" lineHeight="40px">
                    {answer?.value}
                  </Typography>
                </Stack>
                {disabled ? (
                  <Checkbox
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "primary"
                      },
                      "&.Mui-disabled": {
                        color: "nightBlack.light"
                      }
                    }}
                    checked={answer.correct}
                    disabled
                  />
                ) : (
                  <Controller
                    name={`questions[${questionIndex}].answers[${index}].correct`}
                    control={control}
                    rules={{
                      required: !values?.some((v) => v.correct)
                    }}
                    render={({ field: { name, value, onChange } }) => {
                      return (
                        <Checkbox
                          name={name}
                          sx={{
                            color: "white",
                            "&.Mui-checked": {
                              color: "primary"
                            },
                            "&.Mui-disabled": {
                              color: "nightBlack.light"
                            }
                          }}
                          value={value}
                          tabIndex={-1}
                          onChange={onChange}
                          disabled={disabled}
                        />
                      );
                    }}
                  />
                )}
              </GridRow>
            )}
          </Fragment>
        );
      })}
    </GridBox>
  );
});

const QuizTask = ({
  contribution,
  commit
}: {
  contribution: QuizTaskContribution;
  commit: ContributionCommit;
}) => {
  const navigate = useNavigate();
  const { state } = useWalletConnector();
  const [searchParams] = useSearchParams();
  const [initialized, setInitialized] = useState(false);
  const { autAddress, hubAddress } = useParams();

  const { control, handleSubmit, getValues, setValue, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      questions: []
    }
  });

  const questionsWithUserAnswers = useMemo(() => {
    let answers: QuizQuestionsAndAnswers[] = [];
    try {
      answers = JSON.parse(commit.data);
    } catch (e) {
      // pass
    }
    if (answers.length === 0 || !commit)
      return contribution.properties.questions;
    return contribution.properties.questions.map((question) => {
      const userAnswer = answers.find(
        (answer) => answer.question === question.question
      );
      return {
        ...question,
        answers: question.answers.map((answer) => {
          const userAnswerValue = userAnswer.answers.find(
            (a) => a.value === answer.value
          );
          return {
            ...answer,
            correct: userAnswerValue?.correct
          };
        })
      };
    });
  }, [contribution, commit]);

  useEffect(() => {
    if (!initialized && questionsWithUserAnswers?.length) {
      setValue("questions", questionsWithUserAnswers);
      setInitialized(true);
    }
  }, [initialized, questionsWithUserAnswers]);

  const [commitContribution, { error, isError, isSuccess, isLoading, reset }] =
    useCommitAnyContributionMutation();

  const onSubmit = () => {
    const answers = getValues("questions");
    commitContribution({
      autSig: state.authSig,
      contribution,
      message: JSON.stringify(answers),
      hubAddress
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        height: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      <ErrorDialog
        handleClose={() => reset()}
        open={isError}
        message={error || "An error occurred"}
      />
      <SubmitDialog
        open={isSuccess || isLoading}
        mode={isSuccess ? "success" : "loading"}
        backdropFilter={true}
        message={isLoading ? "" : "Congratulations!"}
        titleVariant="h2"
        subtitle={
          isLoading
            ? "Submitting contribution..."
            : "Your submission has been successful!"
        }
        subtitleVariant="subtitle1"
        handleClose={() => {
          if (!isLoading) {
            reset();
            navigate({
              pathname: `/${autAddress}/hub/${hubAddress}`,
              search: searchParams.toString()
            });
          }
        }}
      ></SubmitDialog>
      {contribution ? (
        <>
          <TaskDetails contribution={contribution} />

          <Stack
            direction="column"
            gap={4}
            sx={{
              flex: 1,
              justifyContent: "space-between",
              margin: "0 auto",
              width: {
                xs: "100%",
                sm: "650px",
                xxl: "800px"
              }
            }}
          >
            {questionsWithUserAnswers.map((question, questionIndex) => (
              <Card
                key={`questions.${questionIndex}.question`}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }}
              >
                <CardHeader
                  titleTypographyProps={{
                    fontFamily: "FractulAltBold",
                    fontWeight: 900,
                    color: "white",
                    variant: "subtitle1"
                  }}
                  title={question?.question}
                />
                <CardContent>
                  <Answers
                    control={control}
                    answers={question?.answers}
                    questionIndex={questionIndex}
                    // taskStatus={contribution?.status}
                    disabled={!!commit}
                  ></Answers>
                </CardContent>
              </Card>
            ))}

            {!commit && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  mb: 4,
                  justifyContent: {
                    xs: "center",
                    sm: "flex-end"
                  }
                }}
              >
                <AutOsButton
                  type="button"
                  color="primary"
                  variant="outlined"
                  sx={{
                    width: "100px"
                  }}
                  disabled={!formState.isValid}
                  onClick={handleSubmit(onSubmit)}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize="16px"
                    lineHeight="26px"
                  >
                    Confirm
                  </Typography>
                </AutOsButton>
              </Box>
            )}
          </Stack>
        </>
      ) : (
        <AutLoading></AutLoading>
      )}
    </Container>
  );
};

export default memo(QuizTask);
