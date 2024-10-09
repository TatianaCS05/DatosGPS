const { Layer, Network, Trainer } = require('synaptic');

// Crear capas
const inputLayer = new Layer(3); // 3 entradas
const hiddenLayer = new Layer(5); // Capa oculta
const outputLayer = new Layer(2); // 2 salidas: recordar, no recordar

// Conectar capas
inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

// Crear red
const network = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

// Preparar conjunto de entrenamiento
const trainingSet = [
    { input: [1, 1, 1], output: [1, 0] }, // Recordar
    { input: [0, 0, 0], output: [0, 1] }, // No recordar
    { input: [1, 0, 1], output: [1, 0] }, // Recordar
    { input: [0, 1, 0], output: [0, 1] }, // No recordar
    // Añadir más ejemplos según sea necesario
];

// Entrenar la red
const trainer = new Trainer(network);
trainer.train(trainingSet, {
    rate: 0.1,
    iterations: 20000,
    error: 0.005,
    shuffle: true,
    log: true,
    cost: Trainer.cost.CROSS_ENTROPY
});

// Función para predecir
function predictAction(pagoPendiente, clienteRecordado, tiempoDePago) {
    const result = network.activate([pagoPendiente, clienteRecordado, tiempoDePago]);
    return result; // Resultados: [recordar, no recordar]
}

// Exportar la red y la función de predicción
module.exports = { predictAction };
