import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const RecipeCreator = () => {
    const [components, setComponents] = useState([]);
    const [numeReteta, setNumeReteta] = useState('');

    const addComponent = () => {
        setComponents([...components, { name: '', ingredients: [''], preparare: '' }]);
    };

    const removeComponent = (index) => {
        const newComponents = [...components];
        newComponents.splice(index, 1);
        setComponents(newComponents);
    };

    const updateComponentName = (index, name) => {
        const newComponents = [...components];
        newComponents[index].name = name;
        setComponents(newComponents);
    };

    const updateComponentPreparare = (index, preparare) => {
        const newComponents = [...components];
        newComponents[index].preparare = preparare;
        setComponents(newComponents);
    };

    const addIngredient = (compIndex) => {
        const newComponents = [...components];
        newComponents[compIndex].ingredients.push('');
        setComponents(newComponents);
    };

    const removeIngredient = (compIndex, ingIndex) => {
        const newComponents = [...components];
        newComponents[compIndex].ingredients.splice(ingIndex, 1);
        setComponents(newComponents);
    };

    const updateIngredient = (compIndex, ingIndex, value) => {
        const newComponents = [...components];
        newComponents[compIndex].ingredients[ingIndex] = value;
        setComponents(newComponents);
    };

    const handleSave = () => {
        const recipe = {
            id: Date.now(),
            name: numeReteta,
            components: components,
        };

        saveRecipe(recipe);
    };

    const saveRecipe = async (recipe) => {
        try {
            const existing = await AsyncStorage.getItem('recipes');
            const recipes = existing ? JSON.parse(existing) : [];

            recipes.push(recipe);

            await AsyncStorage.setItem('recipes', JSON.stringify(recipes));

            alert('Recipe saved!');
        } catch (e) {
            console.error('Failed to save recipe', e);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crează o rețetă</Text>

            <TextInput
                placeholder="Nume rețetă"
                placeholderTextColor={'#000'}
                style={styles.nameInput}
                value={numeReteta}
                onChangeText={(text) => setNumeReteta(text)}
            />

            {components.map((component, compIndex) => (
                <View key={compIndex} style={styles.componentBox}>
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Nume componentă (ex: Aluat)"
                            placeholderTextColor={'#000'}
                            style={styles.textInput}
                            value={component.name}
                            onChangeText={(text) =>
                                updateComponentName(compIndex, text)
                            }
                        />
                        <TouchableOpacity
                            onPress={() =>
                                removeComponent(compIndex)
                            }
                            style={styles.removeButton}
                        >
                            <Text style={styles.removeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    {component.ingredients.map((ingredient, ingIndex) => (
                        <View key={ingIndex} style={styles.row}>
                            <TextInput
                                placeholder={`Ingredient ${ingIndex + 1}`}
                                placeholderTextColor={'#000'}
                                style={[styles.textInput]}
                                value={ingredient}
                                onChangeText={(text) =>
                                    updateIngredient(compIndex, ingIndex, text)
                                }
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    removeIngredient(compIndex, ingIndex)
                                }
                                style={styles.removeButton}
                            >
                                <Text style={styles.removeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TextInput
                        placeholder="Mod de preparare"
                        placeholderTextColor={'#000'}
                        style={styles.textInput}
                        value={component.preparare}
                        onChangeText={(text) =>
                            updateComponentPreparare(compIndex, text)
                        }
                    />

                    <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => addIngredient(compIndex)}
                    >
                        <Text style={styles.buttonText}>Adaugă ingredient</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={addComponent}>
                <Text style={styles.buttonText}>Adaugă componentă</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvează rețetă</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    smallButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    componentBox: {
        width: '100%',
        backgroundColor: '#f2f2f2',
        padding: 16,
        borderRadius: 10,
        marginBottom: 24,
    },
    nameInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    removeButton: {
        marginLeft: 8,
        marginBottom: 10,
        backgroundColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 4,
    },
    removeButtonText: {
        fontSize: 16,
        color: '#000',
    },
});

export default RecipeCreator;