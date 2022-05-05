const canvas = document.querySelector('.canvas')
const context = canvas.getContext('2d') 

const magCanvas = document.querySelector('.magCanvas')
const magContext = magCanvas.getContext('2d') 

const chargeRadius = 10
const mu0 = 1
const epsilon0 = 1
const deltaX = 20
const deltaY = 20
const deltaT = 20
let time = 0


var [r, c] = [30, 30]; 
const B = Array(r).fill().map(()=>Array(c).fill(0));
const E = Array(r).fill().map(()=>Array(c).fill([0, 0]));

const chargesList = [
    { value: 1, x: 300, y: 300 }
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

function renderEletricMagneticField(){
    
    for(let x = 0; x < 600; x += 20){
        for(let y = 0; y < 600; y += 20){
            let coloumbE = eletricField([x, y])
            
            let dBdy = (B[y/20 + 1 > 29 ? y/20 - 1 : y/20 + 1][x/20] - B[y/20][x/20])/(2*deltaY)
            let dBdx = (B[y/20][x/20 + 1 > 29 ? x/20 - 1 : x/20 + 1] - B[y/20][x/20])/(2*deltaX)
            let dEdt = [dBdy/(epsilon0*mu0), -dBdx/(epsilon0*mu0)]
            E[y/20][x/20][0] += dEdt[0]
            E[y/20][x/20][1] += dEdt[1]
            let eNorm = Math.sqrt((E[y/20][x/20][0] + coloumbE[0])**2 + (E[y/20][x/20][1] + coloumbE[1])**2)
            let len = Math.abs(eNorm) > 20 ? 20 : Math.abs(eNorm)

            let dE2dx = ((E[y/20][x/20 + 1 > 29 ? x/20 - 1 : x/20 + 1][1] + eletricField([x+20, y])[1]) - (E[y/20][x/20][1] + eletricField([x, y])[1]))/(2*deltaX)
            let dE1dy = ((E[y/20 + 1 > 29 ? y/20 - 1 : y/20 + 1][x/20][0] + eletricField([x, y+20])[0]) - (E[y/20][x/20][0] + eletricField([x, y])[0]))/(2*deltaY)
            let dBdt = dE1dy - dE2dx
            B[y/20][x/20] += dBdt

            

            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + (E[y/20][x/20][0] + coloumbE[0])*len/eNorm, y + (E[y/20][x/20][1] + coloumbE[1])*len/eNorm);
            context.lineWidth = 2
            context.strokeStyle = 'rgb(200, 200, 200)'
            context.stroke()

            let color
            if(B[y/20][x/20] < 0){
                color = `rgb(${Math.abs(B[y/20][x/20]) > 255 ? 255 : Math.abs(Math.round(B[y/20][x/20]*1000))}, 0, 0)`
            }else{
                color = `rgb(0, ${Math.abs(B[y/20][x/20]) > 255 ? 255 : Math.abs(Math.round(B[y/20][x/20]*1000))}, 0)`
            }

            magContext.fillStyle = color
            magContext.fillRect(x/20, y/20, 1, 1)
        }
    }
}

function renderScreen(){
    magContext.clearRect(0, 0, 29, 29)
    context.clearRect(0, 0, 599, 599)

    context.fillStyle = '#000000'
    context.fillRect(0, 0, 599, 599)

    chargesList[0].x = 300 + 50*Math.sin(time/100)

    renderEletricMagneticField()
    renderCharges()
    
    requestAnimationFrame(renderScreen)
    time += deltaT
}
renderScreen()