import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './style';

type City = {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  };
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
};

const LocationSelectorModal = ({
  visible,
  onClose,
  onLocationSelect,
}: Props) => {
  const [searchText, setSearchText] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  // Efeito para buscar cidades na API do IBGE quando o texto de busca muda
  useEffect(() => {
    // Ignora a busca se o texto for muito curto
    if (searchText.length < 3) {
      setCities([]);
      return;
    }

    setLoading(true);
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`,
        );
        const allCities: City[] = await response.json();

        // Filtra as cidades no cliente para corresponder ao texto de busca
        const filtered = allCities.filter(city =>
          city.nome.toLowerCase().includes(searchText.toLowerCase()),
        );

        setCities(filtered);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: Atraso para evitar muitas chamadas à API enquanto o usuário digita
    const timerId = setTimeout(() => {
      fetchCities();
    }, 500); // Espera 500ms após o usuário parar de digitar

    return () => clearTimeout(timerId); // Limpa o timer
  }, [searchText]);

  const handleSelect = (city: City) => {
    const locationString = `${city.nome}, ${city.microrregiao.mesorregiao.UF.sigla}`;
    onLocationSelect(locationString);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da sua cidade..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={cities}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.listItemText}>
                    {item.nome}, {item.microrregiao.mesorregiao.UF.sigla}
                  </Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LocationSelectorModal;
