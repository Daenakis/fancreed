import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  ChoiceGroup,
  LoadingMore,
  SectionTitle,
  Text,
} from '@/ui/components';

import { useQuizQuery, useSubmitQuizMutation } from '@/hooks';

import type { QuizAnswers } from '@/types/api';

import type { QuizBlockProps } from './types';

/**
 * "Quiz": one question at a time ("3/12"), pick an answer, Next; after the
 * last one the fan's score and rating place show with Share.
 */
export function QuizBlock({ style }: QuizBlockProps) {
  const { t } = useTranslation();
  const { data: quiz, isPending } = useQuizQuery();
  const submit = useSubmitQuizMutation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  if (isPending) return <LoadingMore loading />;
  if (!quiz?.questions.length) return null;

  const total = quiz.questions.length;
  const question = quiz.questions[step]!;
  const answer = answers[question.id];
  const last = step === total - 1;
  const result = submit.data;

  return (
    <View style={[styles.block, style]}>
      <SectionTitle title={t('quiz.title')} style={styles.flush} />
      {result ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text variant="bodyLMedium" style={styles.flex}>
              {t('quiz.result')}
            </Text>
            <View style={styles.badge}>
              <Text variant="bodyXSMedium" color="brand">
                {t('quiz.place', { place: result.place })}
              </Text>
            </View>
          </View>
          <View
            accessible
            accessibilityLabel={t('quiz.points', { count: result.score })}
            style={styles.ring}
          >
            <Text variant="h1Semibold">{result.score}</Text>
            <Text variant="bodyXSMedium" color="mutedForeground">
              {t('quiz.pointsLabel', { count: result.score })}
            </Text>
          </View>
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t('votes.share')}
            onPress={() =>
              void Share.share({
                message: t('quiz.shareMessage', { score: result.score }),
              })
            }
          />
        </View>
      ) : (
        <View style={styles.card}>
          <View
            accessible
            accessibilityLabel={`${step + 1}/${total}`}
            style={styles.progress}
          >
            <Text variant="bodySSemibold" color="brand">
              {step + 1}
            </Text>
            <Text variant="bodySRegular" color="mutedForeground">
              /{total}
            </Text>
          </View>
          <Text variant="bodyLMedium">{question.text}</Text>
          <ChoiceGroup
            variant="list"
            value={answer}
            onChange={(value) =>
              setAnswers((a) => ({ ...a, [question.id]: value }))
            }
            options={question.options.map((label, value) => ({ label, value }))}
          />
          <Button
            size="xs"
            fullWidth
            backgroundColor="brand"
            textColor="onBrand"
            text={t(last ? 'quiz.showResult' : 'quiz.next')}
            disabled={answer === undefined}
            loading={submit.isPending}
            onPress={() =>
              last ? submit.mutate(answers) : setStep((s) => s + 1)
            }
          />
        </View>
      )}
    </View>
  );
}

QuizBlock.displayName = 'QuizBlock';

const styles = StyleSheet.create((theme) => ({
  block: {
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(5),
  },
  flush: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  card: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.mintSurface,
  },
  progress: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  flex: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.mintSurfaceStrong,
  },
  ring: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderRadius: theme.radius.full,
    borderColor: theme.colors.brand,
  },
}));
