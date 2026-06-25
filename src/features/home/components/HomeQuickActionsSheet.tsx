import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import type { ComponentProps } from 'react';
import {
  BottomSheet,
  Host,
  RNHostView,
} from '@expo/ui';

import { useTheme } from '@/core/theme/useTheme';

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}

interface HomeQuickActionsSheetProps {
  visible: boolean;
  title: string;
  actions: QuickActionItem[];
  onClose: () => void;
}

export default function HomeQuickActionsSheet({
  visible,
  title,
  actions,
  onClose,
}: HomeQuickActionsSheetProps) {
  const theme = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <Host style={styles.host}>
      <BottomSheet
        isPresented={visible}
        onDismiss={onClose}
        showDragIndicator
        snapPoints={['half', 'full']}
      >
        <RNHostView style={styles.hostContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: theme.textPrimary },
                ]}
              >
                {title}
              </Text>
              <Pressable onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={styles.actions}
              showsVerticalScrollIndicator={false}
            >
              {actions.map((action) => (
                <Pressable
                  key={action.id}
                  style={[
                    styles.actionButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.surface,
                    },
                  ]}
                  onPress={action.onPress}
                >
                  <View style={styles.actionIconWrap}>
                    <Ionicons
                      name={action.iconName}
                      size={18}
                      color="#6D4DFF"
                    />
                  </View>
                  <Text
                    style={[
                      styles.actionLabel,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'box-none',
  },
  hostContent: {
    width: '100%',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  actions: {
    gap: 12,
    paddingBottom: 18,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EEFF',
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
