import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Pressable, 
  Switch,
  SafeAreaView 
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { styles, colors } from '../styles/styles';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Settings</Text>
          <Pressable
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <Text style={styles.modalCloseButtonText}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play dice rolling sounds
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={settings.soundEnabled ? colors.surface : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Animations</Text>
              <Text style={styles.settingDescription}>
                Enable rolling animations
              </Text>
            </View>
            <Switch
              value={settings.animationEnabled}
              onValueChange={(value) => updateSettings({ animationEnabled: value })}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={settings.animationEnabled ? colors.surface : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Modifiers</Text>
              <Text style={styles.settingDescription}>
                Show dice modifiers (+/-)
              </Text>
            </View>
            <Switch
              value={settings.modifiersEnabled}
              onValueChange={(value) => updateSettings({ modifiersEnabled: value })}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={settings.modifiersEnabled ? colors.surface : '#f4f3f4'}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};