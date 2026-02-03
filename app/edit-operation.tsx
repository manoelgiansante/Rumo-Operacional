import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Palette, ChevronDown } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const COLORS = [
  '#2E7D32',
  '#1565C0',
  '#7B1FA2',
  '#C62828',
  '#F57F17',
  '#00838F',
  '#4527A0',
  '#AD1457',
];

export default function EditOperationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { operations, sectors, updateOperation } = useApp();

  const operationId = params.id as string;
  const operation = operations.find((o) => o.id === operationId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSectorId, setSelectedSectorId] = useState<string>('');
  const [showSectorPicker, setShowSectorPicker] = useState(false);

  useEffect(() => {
    if (operation) {
      setName(operation.name);
      setDescription(operation.description || '');
      setSelectedColor(operation.color);
      setSelectedSectorId(operation.sectorId || '');
    }
  }, [operation]);

  const selectedSector = sectors.find((s) => s.id === selectedSectorId);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome da operação');
      return;
    }

    if (!operationId) {
      Alert.alert('Erro', 'Operação não encontrada');
      return;
    }

    updateOperation(operationId, {
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
      sectorId: selectedSectorId || undefined,
    });

    router.back();
  };

  if (!operation) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color={colors.text} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.title}>Operação não encontrada</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={colors.text} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Operação</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Operação</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Preparo de Solo"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex: Atividades de preparo e correção do solo"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Setor (opcional)</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSectorPicker(!showSectorPicker)}
            >
              {selectedSector ? (
                <View style={styles.selectedSector}>
                  <View style={[styles.sectorDot, { backgroundColor: selectedSector.color }]} />
                  <Text style={styles.selectedSectorText}>{selectedSector.name}</Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Selecionar setor</Text>
              )}
              <ChevronDown size={18} color={colors.textMuted} strokeWidth={1.5} />
            </TouchableOpacity>

            {showSectorPicker && (
              <View style={styles.sectorList}>
                {sectors.length === 0 ? (
                  <View style={styles.emptyPicker}>
                    <Text style={styles.emptyPickerText}>Nenhum setor cadastrado</Text>
                    <TouchableOpacity
                      style={styles.emptyPickerButton}
                      onPress={() => {
                        setShowSectorPicker(false);
                        router.push('/add-sector');
                      }}
                    >
                      <Text style={styles.emptyPickerButtonText}>Criar setor</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.sectorOption}
                      onPress={() => {
                        setSelectedSectorId('');
                        setShowSectorPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.sectorOptionText,
                          !selectedSectorId && styles.sectorOptionSelected,
                        ]}
                      >
                        Nenhum setor
                      </Text>
                    </TouchableOpacity>
                    {sectors.map((sector) => (
                      <TouchableOpacity
                        key={sector.id}
                        style={styles.sectorOption}
                        onPress={() => {
                          setSelectedSectorId(sector.id);
                          setShowSectorPicker(false);
                        }}
                      >
                        <View style={[styles.sectorDot, { backgroundColor: sector.color }]} />
                        <Text
                          style={[
                            styles.sectorOptionText,
                            selectedSectorId === sector.id && styles.sectorOptionSelected,
                          ]}
                        >
                          {sector.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Palette size={16} color={colors.textMuted} strokeWidth={1.5} />
              <Text style={styles.label}>Cor de Identificação</Text>
            </View>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview</Text>
            <View style={styles.preview}>
              <View style={[styles.previewDot, { backgroundColor: selectedColor }]} />
              <Text style={styles.previewText}>{name || 'Nome da operação'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: -4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 90,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedSectorText: {
    fontSize: 15,
    color: colors.text,
  },
  placeholderText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  sectorList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectorOptionText: {
    fontSize: 15,
    color: colors.text,
  },
  sectorOptionSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text,
    transform: [{ scale: 1.15 }],
  },
  previewContainer: {
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  previewText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  emptyPicker: {
    padding: 20,
    alignItems: 'center' as const,
  },
  emptyPickerText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center' as const,
  },
  emptyPickerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  emptyPickerButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textLight,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
});
