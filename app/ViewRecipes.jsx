import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import LZString from 'lz-string';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const ViewRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [importModalVisible, setImportModalVisible] = useState(false);
    const [importCode, setImportCode] = useState('');

    const loadRecipes = async () => {
        const saved = await AsyncStorage.getItem('recipes');
        const parsed = saved ? JSON.parse(saved) : [];
        setRecipes(parsed);
    };
    useEffect(() => {

        loadRecipes();
    }, []);

    const deleteRecipeById = async (id) => {
        try {
            const saved = await AsyncStorage.getItem('recipes');
            const recipes = saved ? JSON.parse(saved) : [];

            const updated = recipes.filter((r) => r.id !== id);
            await AsyncStorage.setItem('recipes', JSON.stringify(updated));
            loadRecipes();
            alert('Recipe deleted!');
        } catch (e) {
            console.error('Failed to delete recipe', e);
        }
    };

    const compressRecipe = (recipe) => {
        const json = JSON.stringify(recipe);
        return LZString.compressToEncodedURIComponent(json);
    };

    const decompressAndSaveRecipe = async () => {
        try {
            const json = LZString.decompressFromEncodedURIComponent(importCode);
            const recipe = JSON.parse(json);

            // Load existing recipes
            const saved = await AsyncStorage.getItem('recipes');
            const current = saved ? JSON.parse(saved) : [];

            // Optional: prevent duplicates by ID
            if (current.some(r => r.id === recipe.id)) {
                alert('Rețeta există deja.');
                return;
            }

            const updated = [...current, recipe];
            await AsyncStorage.setItem('recipes', JSON.stringify(updated));
            setImportModalVisible(false);
            setImportCode('');
            loadRecipes();
            alert('Rețetă importată cu succes!');
        } catch (err) {
            console.error(err);
            alert('Cod invalid sau corupt.');
        }
    };

    const shareRecipe = async (id) => {
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) {
            alert("Recipe not found!");
            return;
        }

        const compressed = compressRecipe(recipe);

        await Clipboard.setStringAsync(compressed);
        alert('Codul rețetei a fost copiat în clipboard!\n\nPoți acum să-l trimiți altcuiva.');
    };

    return (<>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Rețete salvate</Text>
            <TouchableOpacity
                onPress={() =>
                    setImportModalVisible(true)
                }
                style={styles.shareButton}
            >
                <Text style={styles.removeButtonText}>Adaugă rețetă prin cod</Text>
            </TouchableOpacity>
            {recipes.length === 0 ? (
                <Text style={styles.empty}>Nicio rețetă salvată încă</Text>
            ) : (
                recipes.map((recipe, index) => (
                    <View key={index} style={styles.recipeCard}>
                        <View style={styles.horizontalView}>
                            <Text style={styles.recipeTitle}>
                                {recipe.name || `Recipe ${index + 1}`}
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    deleteRecipeById(recipe.id)
                                }
                                style={styles.removeButton}
                            >
                                <Text style={styles.removeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {recipe.components.map((comp, i) => (
                            <View key={i} style={styles.component}>
                                <Text style={styles.componentName}>{comp.name}</Text>
                                {comp.ingredients.map((ing, j) => (
                                    <Text style={styles.ingredientStyle} key={j}>- {ing}</Text>
                                ))}
                                <Text style={styles.ingredientStyle}>{comp.preparare}</Text>
                            </View>
                        ))}
                        <TouchableOpacity
                            onPress={() =>
                                shareRecipe(recipe.id)
                            }
                            style={styles.shareButton}
                        >
                            <Text style={styles.removeButtonText}>Distribuie</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </ScrollView>
        <Modal
            visible={importModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setImportModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Lipește codul rețetei:</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Cod compresat..."
                        placeholderTextColor={'#000'}
                        value={importCode}
                        onChangeText={setImportCode}
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={decompressAndSaveRecipe}
                    >
                        <Text style={styles.removeButtonText}>Importă</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalButton, { marginTop: 10 }]}
                        onPress={() => setImportModalVisible(false)}
                    >
                        <Text style={styles.removeButtonText}>Închide</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    empty: {
        textAlign: 'center',
        color: '#888',
    },
    recipeCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    recipeTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 10,
        flex: 1,
        padding: 10,
    },
    component: {
        marginBottom: 10,
        marginLeft: 15,
    },
    componentName: {
        fontWeight: '600',
        fontSize: 17,
    },
    ingredientStyle: {
        fontSize: 15,
    },
    horizontalView: {
        flexDirection: "row",
    },
    removeButton: {
        marginLeft: 8,
        marginBottom: 10,
        backgroundColor: '#ccc',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
    },
    removeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    shareButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        height: 45,
        justifyContent: "center",
        marginBottom: 15,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },

    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        width: '100%',
        minHeight: 80,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    modalButton: {
        marginLeft: 8,
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
    },
});

export default ViewRecipes;