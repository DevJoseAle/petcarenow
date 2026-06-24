import { Screen } from '@/components/Screen';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { useTheme } from '@/core/theme/useTheme';
import { useOnboardingScreen } from '../hooks/useOnboardingScreen';

export function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const {
    listRef,
    slides,
    currentIndex,
    isLastSlide,
    isSubmitting,
    handleScrollEnd,
    goToNextSlide,
  } = useOnboardingScreen(width);

  return (
    <Screen horizontalPadding={0}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <View
            style={[
              styles.slide,
              {
                width,
              },
            ]}
          >
            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[
              styles.dot,
              currentIndex === index &&
                styles.activeDot,
            ]}
          />
        ))}
        </View>
        <View style={styles.actions}>
          <PrimaryButton
            title={
              isLastSlide
                ? isSubmitting
                  ? 'Redirigiendo...'
                  : 'Ir al Login'
                : 'Siguiente'
            }
            action={goToNextSlide}
            disabled={isSubmitting}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },

  description: {
    fontSize: 17,
    lineHeight: 24,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },

  actions: {
    marginTop: 16,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },

  activeDot: {
    width: 24,
    backgroundColor: '#4DB082',
  },
});
