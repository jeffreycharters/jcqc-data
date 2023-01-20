import { reportData } from "./stores";

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
    console.log(elementCount);

    const outputData: { name: string, results: Map<string, string | number> }[] = [];
    fileData.forEach((sample, index) => {
        if (index % elementCount === 0) {
            console.log('creating new item');
            const sampleItem = {
                name: sample[Columns.SampleName],
                results: new Map()
            }
            const rowMap = sampleItem.results;
            const concentration = parseToNumber(sample[Columns.Concentration])
            rowMap.set(sample[Columns.Analyte], concentration)
            outputData.push(sampleItem);
        } else {
            const rowMap = outputData[outputData.length - 1].results;
            const concentration = parseToNumber(sample[Columns.Concentration])
            rowMap.set(sample[Columns.Analyte], concentration)
        }
    });

    console.log(outputData);
    return outputData;

    // TODO: keep working on this, the current function is about done
}

// const csvParse = (input: string) => {
//     const fileData = input;

//     const splitFileData = fileData.split("\n");

//     const fieldNamesWithSpaces = splitFileData[0].trim().split(",");

//     // modify field names to not allow spaces -> replace with underscore
//     const fieldNames = fieldNamesWithSpaces.map(fn =>
//         fn.trim().toLowerCase().replaceAll(' ', '_'))

//     const parsedData = [];

//     for (let i = 1; i < splitFileData.length; i++) {
//         const currentLine = splitFileData[i];
//         const lineItems = currentLine.split(",");
//         const currentLineObject: Record<string, string> = {};

//         for (let j = 0; j < lineItems.length; j++) {
//             currentLineObject[fieldNames[j]] = lineItems[j].replace('\r', '');
//         }

//         if (currentLineObject[fieldNames[0]].length > 0) {
//             parsedData.push(currentLineObject);
//         }
//     }
//     return parsedData;
// };

interface ElementResult {
    value: number;
    dupValue?: number;
}

interface SubmissionMeta {
    hasDup: boolean;
}

export interface SubmissionResult {
    results: Map<string, ElementResult>;
    meta: SubmissionMeta
}

interface InputLine {
    analyte: string;
    concentration: string;
    dilution_factor: string;
    mass: string;
    sample_name: string;
    saple_weight_or_volume: string;
    units: string;
}

const parseToNumber = (datum: string | number) => {
    if (typeof datum === 'number') return datum;

    const castDatum = Number(datum);
    if (isNaN(castDatum)) throw new Error('Invalid number provided');
    return castDatum;
}

const parseJsonData = (rawInput: Record<string, string>[]) => {
    const input = rawInput as unknown as InputLine[];

    const runList: { name: string, results: SubmissionResult }[] = [];

    const sampleDupRegex = /\d{2}-\d{6}-\d{4}d|dup/i;
    const otherDupRegex = /^.* d+u?p?\s?$/i;

    input.forEach((line, index) => {
        let isDup = false;
        let sampleName = line.sample_name;

        if (sampleDupRegex.test(sampleName) || otherDupRegex.test(sampleName)) {
            isDup = true;
            const nameMatch = sampleName.match(/(.*) [dup]+/i)
            if (nameMatch && nameMatch[0] && typeof nameMatch[1] === 'string') sampleName = nameMatch[1];
            else return;
        }

        let resultsMap: SubmissionResult | undefined = undefined;
        if (!isDup) {
            resultsMap = {
                meta: { hasDup: isDup },
                results: new Map()
            }
        } else {
            for (let i = runList.length - 1; i >= 0; --i) {
                if (runList[i].name === sampleName) {
                    resultsMap = runList[i].results;
                    break;
                }
            }
            // console.log('No first part of dup?');
            if (!resultsMap) return;
        }

        const currentResults = resultsMap.results;
        const currentElement = `${line.mass}${line.analyte}`;

        const currentResultsMap = currentResults?.get(currentElement);
        if (isDup && currentResultsMap) {
            const value = currentResultsMap.value
            currentResults?.set(currentElement, { value, dupValue: parseToNumber(line.concentration) });
        }
        if (!isDup) currentResults?.set(currentElement, { value: parseToNumber(line.concentration) })
    })

    return runList
};



export const convertFileToSampleList = (inputFile: File) => {
    const reader = new FileReader();
    // let parsedData;
    reader.readAsText(inputFile);
    reader.onloadend = () => {
        if (!reader.result || typeof reader.result != 'string') return;
        const jsonData = csvParse(reader.result);
        // parsedData = parseJsonData(jsonData);
        reportData.set([])
    }
}


const roundToSigFigs = (number: number, sigFigs: number) => {
    let oom = 0;
    let result = Number(number);

    if (number > 10) {
        while (result > 10) {
            result /= 10;
            oom += 1;
        }
    } else if (number < 0.0001 && number > 0) {
        return "0.00";
    } else if (number < 10) {
        while (result < 1 && result > 0) {
            if (result < 0) {
                result = result * -1;
            }
            result = result * 10;
            oom += 1;
        }
    }
    if (number > 10) {
        result = number / Math.pow(10, oom);
        result = result * Math.pow(10, sigFigs - 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs - oom - 1);
        return result.toPrecision(sigFigs);
    } else if (number < 0) {
        result = number * Math.pow(10, sigFigs + 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs + 1);
        return result.toPrecision(sigFigs);
    } else if (number < 1) {
        result = number * Math.pow(10, oom);
        result = result * Math.pow(10, sigFigs - 1);
        result = Math.round(result);
        result = result / Math.pow(10, sigFigs + oom - 1);
        return result.toPrecision(sigFigs);
    } else {
        return number.toPrecision(sigFigs);
    }
};