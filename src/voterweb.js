// let camera_button = document.querySelector("#start-camera");
// let video = document.querySelector("#video");
// let click_button = document.querySelector("#click-photo");
// let canvas = document.querySelector("#canvas");

// camera_button.addEventListener('click', async function() {
//    	let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
// 	video.srcObject = stream;
// });

// click_button.addEventListener('click', function() {
//    	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//    	let image_data_url = canvas.toDataURL('image/jpeg');

//    	// data url of the image
//    	console.log(image_data_url);
// });


const video = document.getElementById('videoInput')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models') //heavier/accurate version of tiny face detector
]).then(start)

function start() {
    document.body.append('Models Loaded')
    
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
    
    //video.src = '../videos/speech.mp4'
    // console.log('video added')
    recognizeFaces()
}

async function recognizeFaces() {

    const labeledDescriptors = await loadLabeledImages()
    // console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6)


    video.addEventListener('play', async () => {
        const asd = []
        // console.log('Playing')
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)

        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

            const resizedDetections = faceapi.resizeResults(detections, displaySize)

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor)
            })
            results.forEach( (result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
                // console.log(result.label)
                asd.push(result.label)

                if ( asd.length > 20)
                {
                    console.log(asd)
                    let unknown = 0;
                    let c = 0;
                    for (let i = 0; i < asd.length; i++) {
                        
                        if(asd[i] == 'unknown')
                        {
                            unknown = unknown + 1;
                        }
                        else{
                            c = c+1;
                        } 

                    }

                    if(c>unknown)
                    {
                        window.location.replace("voterprofile.html");
                    }
                    else{
                        window.location.replace("voterlogin.html");
                    }

                    // window.location.replace("profile.html");
                }
            })
        }, 100)
        
    })
}


function loadLabeledImages() {
    //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
    const labels = ['shanto'] // for WebCam
    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=2; i++) {
                const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                // console.log(label + i + JSON.stringify(detections))
                descriptions.push(detections.descriptor)
            }
            // document.body.append(label+' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}
