const imageInputHandler = async (e) => {
    const photo = document.getElementById('photo');
    const photoFile = e.srcElement.files[0];
    
    document.getElementById('result').innerHTML = "Processing image..."
    const worker = await Tesseract.createWorker('eng');
    const { data: { text } } = await worker.recognize(photoFile);
    await worker.terminate();

    document.getElementById('result').innerHTML = "";
    photo.src = URL.createObjectURL(photoFile);
    
    const bieresLines = text.split(/\r?\n/);
    console.log(bieresLines);

    const bieres = bieresLines
        .filter(biere => biere !== '')
        .map(biere => biere.replace(/\s*\d+°?\d*\s*.*$/g, '')
                            .replace(/[^\w\s']/g, '')
                            .trim()
        );
    console.log(bieres);

    const response = await fetch("http://localhost:3000/rateBeer", {
        method: "POST",
        mode:  'cors',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({
            query: bieres[0]
        })
    });

    console.log(response.status);
    console.log(await response.json());
}

document.getElementById("captureInput").addEventListener("input", imageInputHandler);
