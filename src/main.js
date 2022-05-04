const canvas = document.querySelector('.canvas')
const context = canvas.getContext('2d') 

const chargeRadius = 10
const mu0 = 11
const epsilon0 = 0.000001 

const chargesList = [
    { value: 1, x: 300, y: 300 },
    { value: -1, x: 500, y: 300 }
]

function renderCharges(){
    for(let charge of chargesList){
        context.beginPath()
        context.arc(charge.x, charge.y, chargeRadius, 0, 2 * Math.PI, false)
        context.fillStyle = charge.value > 0 ? 'red' : 'blue'
        context.fill()
    }
}

function eletricField(point){
    const K = 1/(4*Math.PI*epsilon0)
    let eletricVector = [0, 0]
    for(let charge of chargesList){
        let dist = Math.sqrt((point[0] - charge.x)**2 + (point[1] - charge.y)**2) == 0 ? 0.1 : Math.sqrt((point[0] - charge.x)**2 + (point[1] - charge.y)**2)
        let unitVector = [(point[0] - charge.x)/dist, (point[1] - charge.y)/dist]
        eletricVector[0] += K*charge.value*unitVector[0]/dist**2
        eletricVector[1] += K*charge.value*unitVector[1]/dist**2
    }
    return eletricVector
}

function renderEletricField(){
    
    for(let x = 0; x < 600; x += 20){
        for(let y = 0; y < 600; y += 20){
            let vector = eletricField([x, y])
            let vectorNorm = Math.sqrt(vector[0]**2 + vector[1]**2) 
            let len = vectorNorm < 20 ? vectorNorm : 20 

            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + vector[0]*len/vectorNorm, y + vector[1]*len/vectorNorm);
            context.lineWidth = 2
            context.strokeStyle = 'rgb(200, 200, 200)'
            context.stroke()
        }
    }
}

function renderScreen(){
    context.clearRect(0, 0, 599, 599)
    context.fillStyle = '#000000'
    context.fillRect(0, 0, 599, 599)

    
    renderEletricField()
    renderCharges()
    
    requestAnimationFrame(renderScreen)
}
renderScreen()