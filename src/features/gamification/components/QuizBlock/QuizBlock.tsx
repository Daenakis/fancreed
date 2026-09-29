import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  ChoiceGroup,
  SectionTitle,
  Skeleton,
  Text,
} from '@/ui/components';

import { useQuizQuery, useSubmitQuizMutation } from '@/hooks';

import { localized } from '@/utils';

import type { QuizBlockProps } from './types';

/**
 * "Quiz" from the backend: one question at a time ("3/12"), pick an answer,
 * Next; after the last one the fan's right answers and how many fans they
 * beat show with Share. The result stays once answered.
 */
export function QuizBlock({ style }: QuizBlockProps) {
  const { t, i18n } = useTranslation();
  const { data, isPending } = useQuizQuery();
  const submit = useSubmitQuizMutation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const quiz = data?.quiz;

  if (isPending) {
    return (
      <View style={[styles.block, style]}>
        <SectionTitle title={t('quiz.title')} style={styles.flush} />
        <Skeleton height={CARD_HEIGHT} radius="lg" />
      </View>
    );
  }
  if (!quiz?.questions.length) return null;

  const total = quiz.questions.length;
  const question = quiz.questions[step]!;
  const answer = answers[question._id];
  const last = step === total - 1;
  const result = data?.yourResult;

  const share = result
    ? () =>
        void Share.share({
          message: t('quiz.shareMessage', {
            correct: result.correct,
            total: result.total,
          }),
        })
    : undefined;

  return (
    <View style={[styles.block, style]}>
      <SectionTitle
        title={t('quiz.title')}
        action={
          share
            ? { icon: 'telegram', label: t('common.share'), onPress: share }
            : undefined
        }
        style={styles.flush}
      />
      {result ? (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text variant="bodyLMedium" style={styles.flex}>
              {t('quiz.result')}
            </Text>
            <View style={styles.badge}>
              <Text variant="bodyXSMedium" color="brand">
                {t('quiz.betterThan', { percent: result.betterThan })}
              </Text>
            </View>
          </View>
          <View
            accessible
            accessibilityLabel={t('quiz.correct', {
              correct: result.correct,
              total: result.total,
            })}
            style={styles.ring}
          >
            <Text variant="h1Semibold">
              {result.correct}/{result.total}
            </Text>
            <Text
              variant="bodyXSMedium"
              color="mutedForeground"
              style={styles.center}
            >
              {t('quiz.correctLabel')}
            </Text>
          </View>
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
          <Text variant="bodyLMedium">
            {localized(question.text, i18n.language)}
          </Text>
          <ChoiceGroup
            variant="list"
            value={answer}
            onChange={(value) =>
              setAnswers((a) => ({ ...a, [question._id]: value }))
            }
            options={question.options.map((option, value) => ({
              label: localized(option, i18n.language),
              value,
            }))}
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
              last
                ? submit.mutate({
                    quiz: quiz._id,
                    answers: quiz.questions.map((q) => answers[q._id]!),
                  })
                : setStep((s) => s + 1)
            }
          />
        </View>
      )}
    </View>
  );
}

QuizBlock.displayName = 'QuizBlock';

/** Height of a loaded question card with four answers. */
const CARD_HEIGHT = 356;

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
  center: {
    textAlign: 'center',
  },
  ring: {
    alignSelf: 'center',
    width: 112,
    height: 112,
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderRadius: theme.radius.full,
    borderColor: theme.colors.brand,
  },
}));
