import cuid from "cuid";
import { reportData } from "$lib/stores";

export const sortedArrayFromMap = (map: Map<number, number>) => {
    return Array.from(map).sort((a, b) => (a[0] < b[0] ? -1 : 1));
}

enum Columns {
    SampleName,
    DilutionFactor,
    SampleWeight,
    Analyte,
    Mass,
    Concentration,
    Units
}

const getElementCount = (data: string[][]) => {
    const elementMap = new Map();

    for (let i = 0; i < data.length; i++) {
        const currentElement = data[i][Columns.Mass];
        if (!elementMap.has(currentElement)) elementMap.set(currentElement, true);
        else return i;
    }
    return -1;
}

const csvParse = (input: string) => {
    const fileLines = input.replace('\r', '').split('\n')
    const fileData = fileLines.map(line => line.split(',')).slice(1);


    const elementCount = getElementCount(fileData);

    const outputData: { name: string, results: Map<number, number> }[] = [];
    fileData.forEach((sample, index) => {
        const rowName = parseInt(sample[Columns.Mass]);
        if (index % elementCount === 0) {
            const sampleItem = {
                name: sample[Columns.SampleName].trim(),
                results: new Map()
            }
            const rowMap = sampleItem.results;
            const concentration = parseFloat(sample[Columns.Concentration])
            rowMap.set(rowName, concentration)
            outputData.push(sampleItem);
        } else {
            const rowMap = outputData[outputData.length - 1].results;
            const concentration = parseFloat(sample[Columns.Concentration])
            rowMap.set(rowName, concentration)
        }
    });

    return outputData;
}



const parseJsonData = (rawInput: { name: string, results: Map<number, number> }[]) => {
    const input = rawInput as unknown as InputLine[];

    const runList: RunListEntry[] = [];

    const sampleDupRegex = /\d{2}-\d{6}-\d{4}d|dup/i;
    const otherDupRegex = /^.* d+u?p?\s?$/i;

    input.forEach(line => {
        let isDup = false;

        // determine if sample is a duplicate, get the non-dup sample name
        let sampleName = line.name;
        if (sampleDupRegex.test(sampleName) || otherDupRegex.test(sampleName)) {
            isDup = true;
            const nameMatch = sampleName.match(/(.*) [dup]+/i)
            if (nameMatch && nameMatch[1] && typeof nameMatch[1] === 'string') sampleName = nameMatch[1].trim();
        }

        if (!isDup) {
            // the results are just the current sample results
            const sampleObject = {
                name: sampleName,
                id: cuid(),
                isDup: false,
                results: {
                    values: line.results
                }
            }
            runList.push(sampleObject);
        } else {
            // find the original sample, append the current results
            let originalSample: RunListEntry | undefined = undefined;
            for (let i = runList.length - 1; i >= 0; --i) {
                if (runList[i].name != sampleName) continue;

                originalSample = runList[i];
            }

            if (!originalSample) {
                console.log('Uncomment the error handling, please');

                // alert(`Only found duplicate of "${sampleName}" and not the reference.`)
                return;
            }
            originalSample.isDup = true;
            originalSample.results.dupValues = line.results;

        }
    });

    return runList
};

const addSampleTypesTo = (input: RunListEntry[], rms: string[]) => {
    const referenceMaterialsLower = rms.map((rm) => rm.toLowerCase());
    const submissionRegex = /\d{2}-\d{6}-\d{4}/;

    input.forEach(sample => {
        const sampleNameLower = sample.name.toLowerCase();

        sample.isCalBlank = ['calibration blank', 'cal blank'].includes(sampleNameLower);
        sample.isCalCheck = ['calibration check', 'cal check'].includes(sampleNameLower) || sampleNameLower.endsWith('ppb check');
        sample.isMethodBlank = sampleNameLower === 'method blank';
        sample.isReferenceMaterial = referenceMaterialsLower.includes(sampleNameLower);
        sample.isSample = (submissionRegex.test(sample.name) || sample.name.toLowerCase().startsWith('qc')) && !sample.isDup
    })
    return input;
}



export const parseFileAndUpdateStore = (inputFile: File, referenceMaterialNames: string[]) => {
    const reader = new FileReader();
    reader.readAsText(inputFile);
    reader.onloadend = () => {
        if (!reader.result || typeof reader.result != 'string') return;
        const jsonData = csvParse(reader.result);
        const parsedData = parseJsonData(jsonData);
        const dataWithSampleTypes = addSampleTypesTo(parsedData, referenceMaterialNames);
        reportData.set(dataWithSampleTypes)
    }
}


export const roundToSigFigs = (number: number, sigFigs: number) => {
    let orderOfMagnitude = 0;
    let result = Number(number);

    if (number > 10) {
        while (result > 10) {
            result /= 10;
            orderOfMagnitude += 1;
        }
    } else if (number < 0.0001 && number > 0) {
        return "0.00";
    } else if (number < 10) {
        while (result < 1 && result > 0) {
            if (result < 0) {
                result = result * -1;
            }
            result = result * 10;
            orderOfMagnitude += 1;
        }
    }
    if (number > 10) {
        result = number / Math.pow(10, orderOfMagnitude);
        result = result * Math.pow(10, sigFigs - 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs - orderOfMagnitude - 1);
        return parseFloat(result.toPrecision(sigFigs));
    } else if (number < 0) {
        result = number * Math.pow(10, sigFigs + 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs + 1);
        return parseFloat(result.toPrecision(sigFigs));
    } else if (number < 1) {
        result = number * Math.pow(10, orderOfMagnitude);
        result = result * Math.pow(10, sigFigs - 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs + orderOfMagnitude - 1);
        return parseFloat(result.toPrecision(sigFigs));
    } else {
        return parseFloat(number.toPrecision(sigFigs));
    }
};