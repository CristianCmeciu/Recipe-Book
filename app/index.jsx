import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MainMenu = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carte cu rețete</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/ViewRecipes')}>
        <Text style={styles.buttonText}>Vezi Rețetele</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/RecipeCreator')}>
        <Text style={styles.buttonText}>Adaugă Rețetă nouă</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MainMenu;