import * as tf from '@tensorflow/tfjs'
//inputs
//Property sizes
const sizes=[1000,1500,2000,2500,3000]
const prices=[200,300,400,500,600]

//2. create tensors
const inputTensor=tf.tensor2d(sizes,[5,1])
const outputTensor=tf.tensor2d(prices,[5,1])

//3. create a simple model
const model=tf.sequential()

//add one layer
model.add(tf.layers.dense({
    units:1,
    inputShape:[1]
}))

//configure the model
model.compile({
    optimizer:tf.train.sgd(0.0000001),
    loss:'meanSquaredError'
})

//train the model
async function trainModel() {
    console.log("Training started")
    await model.fit(inputTensor,outputTensor,{
        epochs:100
    })
    console.log("Training completed")
}

//predictions
async function predict(size) {
    const input=tf.tensor2d([size],[1,1])
    const prediction=model.predict(input)
    const price=await prediction.data()
    console.log(`House size:${size}`)
    console.log(`Predicted prize:${price[0].toFixed(0)}k`)
    input.dispose()
    prediction.dispose()
}

async function run() {
    await trainModel()

    await predict(1800)
    inputTensor.dispose()
    outputTensor.dispose()
}

run()